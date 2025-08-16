import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { signIn } from '@/auth';

const prisma = new PrismaClient();

// POST /api/admin/auto-login - Auto login as admin for development
export async function POST(request: NextRequest) {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Auto-login only available in development mode' },
        { status: 403 }
      );
    }

    // Find or create admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          id: 'admin_user_001',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          emailVerified: new Date(),
        }
      });
    }

    // Create a session (simplified for development)
    const session = await prisma.session.create({
      data: {
        userId: adminUser.id,
        sessionToken: `admin_session_${Date.now()}`,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    });

    // Set session cookie
    const response = NextResponse.json({
      message: 'Auto-login successful',
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      }
    });

    // Set session cookie
    response.cookies.set('next-auth.session-token', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: session.expires,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auto-login error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-login' },
      { status: 500 }
    );
  }
}

// GET /api/admin/status - Check admin status
export async function GET(request: NextRequest) {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    });

    const workflowCount = await prisma.workflow.count();
    const userCount = await prisma.user.count();

    return NextResponse.json({
      hasAdmin: adminCount > 0,
      stats: {
        admins: adminCount,
        workflows: workflowCount,
        users: userCount,
      }
    });
  } catch (error) {
    console.error('Admin status error:', error);
    return NextResponse.json(
      { error: 'Failed to get admin status' },
      { status: 500 }
    );
  }
}
