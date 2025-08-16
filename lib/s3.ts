import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import archiver from 'archiver';
import { PassThrough } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'workflow-files-bucket';

export class S3Service {
  static async uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
      });

      await s3Client.send(command);
      return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  static async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error('Error deleting from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }

  static async deleteWorkflowFolder(workflowId: string, userId: string): Promise<void> {
    try {
      const prefix = `workflows/${userId}/${workflowId}/`;
      
      // List all objects in the folder
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
      });

      const listResult = await s3Client.send(listCommand);
      
      if (listResult.Contents && listResult.Contents.length > 0) {
        // Delete all objects in the folder
        for (const object of listResult.Contents) {
          if (object.Key) {
            await this.deleteFile(object.Key);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting workflow folder from S3:', error);
      throw new Error('Failed to delete workflow folder from S3');
    }
  }

  static async createWorkflowZip(workflowId: string, userId: string): Promise<Buffer> {
    try {
      const prefix = `workflows/${userId}/${workflowId}/`;
      
      // List all files in the workflow folder
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
      });

      const listResult = await s3Client.send(listCommand);
      
      if (!listResult.Contents || listResult.Contents.length === 0) {
        throw new Error('No files found in workflow folder');
      }

      // Create a zip archive
      const archive = archiver('zip', { zlib: { level: 9 } });
      const stream = new PassThrough();
      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => chunks.push(chunk));
      
      return new Promise(async (resolve, reject) => {
        stream.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });

        stream.on('error', reject);
        archive.on('error', reject);

        archive.pipe(stream);

        // Add each file to the zip
        for (const object of listResult.Contents) {
          if (object.Key) {
            try {
              const getCommand = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: object.Key,
              });
              
              const response = await s3Client.send(getCommand);
              if (response.Body) {
                const fileName = object.Key.replace(prefix, '');
                const fileBuffer = Buffer.from(await response.Body.transformToByteArray());
                archive.append(fileBuffer, { name: fileName });
              }
            } catch (error) {
              console.error(`Error downloading file ${object.Key}:`, error);
            }
          }
        }

        archive.finalize();
      });
    } catch (error) {
      console.error('Error creating workflow zip:', error);
      throw new Error('Failed to create workflow zip');
    }
  }

  static async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  static generateKey(userId: string, workflowId: string, filename: string): string {
    const timestamp = Date.now();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `workflows/${userId}/${workflowId}/${cleanFilename}`;
  }

  static getWorkflowFolderPath(userId: string, workflowId: string): string {
    return `workflows/${userId}/${workflowId}/`;
  }
}

export default S3Service;
