'use client';

import { useState, useEffect } from 'react';
import { Upload, Eye, Trash2, Plus, User, Calendar, Tag } from 'lucide-react';
import WorkflowUpload from '@/components/WorkflowUpload';
import WorkflowPreview from '@/components/WorkflowPreview';

interface Workflow {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    image?: string;
  };
  createdAt: string;
  tags: string[];
  assets: any;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  // Load workflows from API
  const loadWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows');
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data);
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleUploadSuccess = () => {
    setShowUpload(false);
    loadWorkflows();
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        const response = await fetch(`/api/workflows/${workflowId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          loadWorkflows();
        }
      } catch (error) {
        console.error('Error deleting workflow:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflow Manager</h1>
              <p className="text-gray-600 mt-2">
                Upload, preview and manage your n8n workflows
              </p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Workflow
            </button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Upload New Workflow</h2>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <WorkflowUpload onSuccess={handleUploadSuccess} />
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {selectedWorkflow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{selectedWorkflow.title}</h2>
                  <button
                    onClick={() => setSelectedWorkflow(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <WorkflowPreview workflow={selectedWorkflow.assets} />
              </div>
            </div>
          </div>
        )}

        {/* Workflows Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows yet</h3>
            <p className="text-gray-600 mb-4">Upload your first n8n workflow to get started</p>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Workflow
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {workflow.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {workflow.description}
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center mb-4">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{workflow.author.name}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center mb-4">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {new Date(workflow.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Tags */}
                  {workflow.tags.length > 0 && (
                    <div className="flex items-center mb-4">
                      <Tag className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="flex flex-wrap gap-1">
                        {workflow.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {workflow.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{workflow.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedWorkflow(workflow)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
