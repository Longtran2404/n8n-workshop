import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { S3Service } from '@/lib/s3';

const prisma = new PrismaClient();

// GET /api/workflows/[id]/download - Download workflow as zip
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find the workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: { 
        author: true,
        files: true
      }
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Check if workflow is published or user has access
    const session = await auth();
    if (!workflow.isPublished) {
      if (!session?.user?.id || workflow.authorId !== session.user.id) {
        const user = await prisma.user.findUnique({
          where: { id: session?.user?.id || '' }
        });
        if ((user as any)?.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          );
        }
      }
    }

    if (workflow.files.length === 0) {
      return NextResponse.json(
        { error: 'No files found for this workflow' },
        { status: 404 }
      );
    }

    // Create zip file using S3Service static method
    const zipBuffer = await S3Service.createWorkflowZip(params.id, workflow.authorId || '');

    // Increment download count
    await prisma.workflow.update({
      where: { id: params.id },
      data: {
        downloads: {
          increment: 1
        }
      }
    });

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(zipBuffer);

    // Return zip file
    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', `attachment; filename="${workflow.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip"`);
    headers.set('Content-Length', zipBuffer.length.toString());

    return new NextResponse(uint8Array, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error downloading workflow:', error);
    return NextResponse.json(
      { error: 'Failed to download workflow' },
      { status: 500 }
    );
  }
}
