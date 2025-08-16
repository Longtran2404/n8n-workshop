import React, { useState } from 'react';
import { Upload, X, File, Download, Trash2 } from 'lucide-react';

interface WorkflowFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
}

interface FileUploadProps {
  workflowId: string;
  files: WorkflowFile[];
  onFileUploaded: () => void;
  canEdit: boolean;
}

export function FileUpload({ workflowId, files, onFileUploaded, canEdit }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/workflows/${workflowId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      onFileUploaded();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/workflows/${workflowId}/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      onFileUploaded(); // Refresh the files list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleFileDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/files/${fileId}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const fileData = await response.json();
      
      // Create download link
      const link = document.createElement('a');
      link.href = fileData.downloadUrl || fileData.fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (!canEdit) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {canEdit && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {uploading ? 'Uploading...' : 'Upload files'}
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                Drag and drop or click to select files
              </span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Files</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleFileDownload(file.id, file.fileName)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => handleFileDelete(file.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
