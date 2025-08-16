'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Eye, Download, Edit, Trash2, Star, User, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { FileUpload } from '@/components/FileUpload';
import { WorkflowPreview } from '@/components/WorkflowPreview';

interface WorkflowFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
}

interface Workflow {
  id: string;
  title: string;
  description: string;
  content: any;
  thumbnail: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  platform: string;
  category: string;
  tags: string[];
  difficulty: string;
  price: number;
  isPaid: boolean;
  isPublished: boolean;
  views: number;
  downloads: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  files: WorkflowFile[];
}

export default function WorkflowDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [files, setFiles] = useState<WorkflowFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const workflowId = params.id as string;

  useEffect(() => {
    fetchWorkflow();
    fetchFiles();
  }, [workflowId]);

  const fetchWorkflow = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workflow');
      }
      const data = await response.json();
      setWorkflow(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/files`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workflow');
      }

      // Redirect to workflows page
      window.location.href = '/workflows';
    } catch (error) {
      alert('Failed to delete workflow: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error || 'Workflow not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const canEdit = session?.user?.id === workflow.author?.id;
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {workflow.title}
                </h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{workflow.author?.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{workflow.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{workflow.downloads} downloads</span>
                  </div>
                  {workflow.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{workflow.rating.toFixed(1)} ({workflow.ratingCount})</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    difficultyColors[workflow.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {workflow.platform}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    {workflow.category}
                  </span>
                  {workflow.isPaid && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      ${workflow.price}
                    </span>
                  )}
                </div>

                {workflow.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {workflow.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {workflow.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {workflow.description}
                  </p>
                )}
              </div>

              {canEdit && (
                <div className="flex space-x-2 ml-6">
                  <Link
                    href={`/workflows/${workflow.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Workflow Preview */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Workflow Preview</h2>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </div>
                  
                  {showPreview && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <WorkflowPreview workflow={workflow.content} />
                    </div>
                  )}
                </div>

                {/* Files Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Files</h2>
                  <FileUpload
                    workflowId={workflow.id}
                    files={files}
                    onFileUploaded={fetchFiles}
                    canEdit={canEdit}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Author Info */}
                {workflow.author && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Author</h3>
                    <div className="flex items-center space-x-3">
                      {workflow.author.image ? (
                        <img
                          src={workflow.author.image}
                          alt={workflow.author.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {workflow.author.name}
                        </p>
                        <p className="text-sm text-gray-500">Workflow Creator</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium">{workflow.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Downloads:</span>
                      <span className="font-medium">{workflow.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(workflow.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updated:</span>
                      <span className="font-medium">
                        {new Date(workflow.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
