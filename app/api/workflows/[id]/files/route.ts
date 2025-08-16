import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { S3Service } from '@/lib/s3';

const prisma = new PrismaClient();

// POST /api/workflows/[id]/files - Upload file for workflow
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user owns the workflow or is admin
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: { author: true }
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (workflow.authorId !== session.user.id && user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate S3 key with proper folder structure
    const s3Key = S3Service.generateKey(session.user.id, params.id, file.name);

    // Upload to S3
    const fileUrl = await S3Service.uploadFile(buffer, s3Key, file.type);

    // Save file info to database
    const workflowFile = await prisma.workflowFile.create({
      data: {
        workflowId: params.id,
        fileName: file.name,
        fileUrl,
        fileType: file.type,
        fileSize: file.size,
        bucketName: process.env.S3_BUCKET_NAME || 'workflow-files-bucket',
        s3Key,
        contentType: file.type,
      }
    });

    // Update workflow with folder path
    const folderPath = S3Service.getWorkflowFolderPath(session.user.id, params.id);
    await prisma.workflow.update({
      where: { id: params.id },
      data: {
        folderPath: folderPath
      }
    });

    return NextResponse.json(workflowFile, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// GET /api/workflows/[id]/files - Get files for workflow
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const files = await prisma.workflowFile.findMany({
      where: { workflowId: params.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
