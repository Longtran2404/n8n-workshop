import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/workflows - List all workflows
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const authorId = searchParams.get('authorId');
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    
    const session = await auth();
    const user = session?.user?.id ? await prisma.user.findUnique({
      where: { id: session.user.id }
    }) : null;

    const skip = (page - 1) * limit;

    const where: any = {};

    // Only admins can see unpublished workflows
    if (!includeUnpublished || user?.role !== 'admin') {
      where.isPublished = true;
    }

    if (category) {
      where.category = category;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    const workflows = await prisma.workflow.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        files: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
          }
        },
        _count: {
          select: {
            reviews: true,
            purchases: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const total = await prisma.workflow.count({ where });

    return NextResponse.json({
      workflows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const workflow = await prisma.workflow.create({
      data: {
        title: data.title,
        description: data.description || '',
        content: data.content,
        platform: data.platform || 'n8n',
        category: data.category,
        tags: data.tags || [],
        difficulty: data.difficulty || 'beginner',
        price: data.price || 0,
        isPaid: data.isPaid || false,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}
