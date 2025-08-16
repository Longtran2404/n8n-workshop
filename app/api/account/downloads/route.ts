import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

// GET /api/account/downloads
export async function GET(req: NextRequest) {
  // TODO: require authentication, fetch user downloads
  return NextResponse.json([]);
}
