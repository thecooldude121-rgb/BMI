import React from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Phone, Mail, Video, CheckCircle, FileText, Activity } from 'lucide-react';

interface Activity {
  id: string;
  subject: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  description?: string;
  status: 'completed' | 'planned' | 'open' | 'cancelled' | 'in_progress';
  completedAt?: string;
  scheduledAt?: string;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  account?: { name: string };
  contact?: { firstName: string; lastName: string };
}

export default function SimpleDealDetailsPage() {
  const [match, params] = useRoute('/crm/deals/:id');
  const id = params?.id;

  // Fetch deal data
  const { data: deal, isLoading: dealLoading } = useQuery({
    queryKey: ['/api/deals', id],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${id}`);
      if (!response.ok) throw new Error('Failed to fetch deal');
      return response.json();
    },
    enabled: !!id
  });

  // Fetch deal activities with correct parameters
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/activities', 'deal', id],
    queryFn: async () => {
      const response = await fetch(`/api/activities?relatedToType=deal&relatedToId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
    enabled: !!id
  });

  console.log('🔍 Deal Details Debug:', {
    dealId: id,
    deal,
    activitiesCount: activities.length,
    activities: activities.slice(0, 2) // Log first 2 activities for debugging
  });

  if (dealLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Deal not found</h2>
            <p className="mt-2 text-gray-600">The deal you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Deals
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{deal.name}</h1>
          <p className="text-gray-600">
            ${deal.value?.toLocaleString()} • {deal.stage} • {deal.account?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Deal Information */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Deal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Value</label>
                  <p className="text-lg font-semibold text-gray-900">${deal.value?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Stage</label>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{deal.stage}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account</label>
                  <p className="text-lg font-semibold text-gray-900">{deal.account?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : 'Not assigned'}
                  </p>
                </div>
              </div>
            </div>

            {/* Activities & Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Activities & Timeline ({activities.length})
                  </h3>
                  {activitiesLoading && (
                    <div className="text-sm text-gray-500">Loading activities...</div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activities.length > 0 ? activities.map((activity: Activity) => (
                    <div key={activity.id} className="flex space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        {activity.type === 'call' && <Phone className="w-5 h-5 text-blue-500" />}
                        {activity.type === 'email' && <Mail className="w-5 h-5 text-green-500" />}
                        {activity.type === 'meeting' && <Video className="w-5 h-5 text-purple-500" />}
                        {activity.type === 'task' && <CheckCircle className="w-5 h-5 text-orange-500" />}
                        {activity.type === 'note' && <FileText className="w-5 h-5 text-gray-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              {activity.completedAt 
                                ? `Completed ${new Date(activity.completedAt).toLocaleDateString()}`
                                : activity.scheduledAt 
                                  ? `Scheduled ${new Date(activity.scheduledAt).toLocaleDateString()}`
                                  : 'Not scheduled'
                              }
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : activity.status === 'planned'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">No activities yet</p>
                      <p className="text-sm mt-1">Activities will appear here once added</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  <Video className="w-4 h-4 mr-2" />
                  Book Meeting
                </button>
              </div>
            </div>

            {/* Deal Stats */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Activities</span>
                  <span className="font-medium text-gray-900">{activities.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium text-green-600">
                    {activities.filter((a: Activity) => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Planned</span>
                  <span className="font-medium text-blue-600">
                    {activities.filter((a: Activity) => a.status === 'planned').length}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}