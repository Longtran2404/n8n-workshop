import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { S3Service } from '@/lib/s3';

const prisma = new PrismaClient();

// DELETE /api/workflows/[id]/files/[fileId] - Delete specific file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find the file
    const file = await prisma.workflowFile.findUnique({
      where: { id: params.fileId },
      include: { 
        workflow: { 
          include: { author: true } 
        } 
      }
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (file.workflow.authorId !== session.user.id && user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Delete from S3 if s3Key exists
    if (file.s3Key) {
      try {
        await S3Service.deleteFile(file.s3Key);
      } catch (s3Error) {
        console.error('Error deleting from S3:', s3Error);
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete from database
    await prisma.workflowFile.delete({
      where: { id: params.fileId }
    });

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

// GET /api/workflows/[id]/files/[fileId] - Get file download URL
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const file = await prisma.workflowFile.findUnique({
      where: { id: params.fileId },
      include: { workflow: true }
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check if workflow is published or user has access
    const session = await auth();
    if (!file.workflow.isPublished) {
      if (!session?.user?.id || file.workflow.authorId !== session.user.id) {
        const user = await prisma.user.findUnique({
          where: { id: session?.user?.id || '' }
        });
        if (user?.role !== 'admin') {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          );
        }
      }
    }

    // Generate signed URL for S3 file
    let downloadUrl = file.fileUrl;
    if (file.s3Key) {
      try {
        downloadUrl = await S3Service.getSignedUrl(file.s3Key, 3600); // 1 hour expiry
      } catch (error) {
        console.error('Error generating signed URL:', error);
      }
    }

    // Increment download count
    await prisma.workflow.update({
      where: { id: file.workflowId },
      data: {
        downloads: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      ...file,
      downloadUrl
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}
