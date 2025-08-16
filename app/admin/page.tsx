'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, FileText, Upload, Settings, Eye, Download, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  hasAdmin: boolean;
  stats: {
    admins: number;
    workflows: number;
    users: number;
  };
}

interface Workflow {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  platform: string;
  category: string;
  difficulty: string;
  price: number;
  isPaid: boolean;
  isPublished: boolean;
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);

  useEffect(() => {
    fetchStats();
    if (session?.user) {
      fetchWorkflows();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows?includeUnpublished=true&limit=50');
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || data);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  const handleAutoLogin = async () => {
    setAutoLoggingIn(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
      });

      if (response.ok) {
        // Reload the page to pick up the new session
        window.location.reload();
      } else {
        const error = await response.json();
        alert('Auto-login failed: ' + error.error);
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      alert('Auto-login failed');
    } finally {
      setAutoLoggingIn(false);
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchWorkflows(); // Refresh the list
      } else {
        const error = await response.json();
        alert('Delete failed: ' + error.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed');
    }
  };

  const togglePublished = async (workflowId: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentState,
        }),
      });

      if (response.ok) {
        fetchWorkflows(); // Refresh the list
      } else {
        const error = await response.json();
        alert('Update failed: ' + error.error);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show auto-login if no session
  if (status !== 'loading' && !session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in as an admin to access this dashboard.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="space-y-4">
                <button
                  onClick={handleAutoLogin}
                  disabled={autoLoggingIn}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {autoLoggingIn ? 'Logging in...' : 'Auto Login as Admin (Development)'}
                </button>
                <p className="text-sm text-gray-500">
                  This creates/logs in as an admin user automatically for development.
                </p>
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage workflows, users, and platform settings</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Users</h3>
                  <p className="text-2xl font-bold text-gray-700">{stats.stats.users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Workflows</h3>
                  <p className="text-2xl font-bold text-gray-700">{stats.stats.workflows}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Admins</h3>
                  <p className="text-2xl font-bold text-gray-700">{stats.stats.admins}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/workflows/new"
              className="flex items-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
            >
              <Upload className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-blue-700 font-medium">Create New Workflow</span>
            </Link>

            <Link
              href="/workflows"
              className="flex items-center px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
            >
              <Eye className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-green-700 font-medium">View All Workflows</span>
            </Link>

            <Link
              href="/admin/profile"
              className="flex items-center px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
            >
              <Users className="h-5 w-5 text-orange-600 mr-3" />
              <span className="text-orange-700 font-medium">Admin Profile</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100"
            >
              <Settings className="h-5 w-5 text-purple-600 mr-3" />
              <span className="text-purple-700 font-medium">User Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Workflows Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Manage Workflows</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow) => (
                  <tr key={workflow.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {workflow.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {workflow.platform} • {workflow.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {workflow.author?.name || 'Anonymous'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          workflow.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {workflow.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <span>{workflow.views} views</span>
                        <span>{workflow.downloads} downloads</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/workflows/${workflow.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/workflows/${workflow.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => togglePublished(workflow.id, workflow.isPublished)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title={workflow.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {workflow.isPublished ? '👁️' : '🔒'}
                        </button>
                        <button
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {workflows.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No workflows found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
