import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Edit2, MoreVertical, Calendar, DollarSign, TrendingUp, 
  AlertTriangle, Star, Users, Activity, FileText, Phone, Mail, Video, 
  MessageSquare, Paperclip, Share2, Clock, Target, CheckCircle, Circle, 
  ArrowRight, Building, User, Tag, Link, Download, Eye, Trash2, Plus
} from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  title: string;
  value: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  dealHealth: string;
  dealType: string;
  aiScore: number;
  lastActivityDate: string;
  followUpDate: string;
  teamMembers: string[];
  followers: string[];
  description: string;
  nextStep: string;
  notes: string;
  account?: {
    id: string;
    name: string;
    industry: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface Activity {
  id: string;
  subject: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  description?: string;
  status: 'completed' | 'planned' | 'open' | 'cancelled' | 'in_progress';
  completedAt?: string;
  scheduledAt?: string;
}

export default function DealDetailPageFixed() {
  const [match, params] = useRoute('/crm/deals/:id');
  const id = params?.id;
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [newComment, setNewComment] = useState('');
  const [newActivity, setNewActivity] = useState({
    subject: '',
    type: 'call',
    description: '',
    scheduledAt: ''
  });

  // Fetch deal data
  const { data: deal, isLoading } = useQuery({
    queryKey: ['/api/deals', id],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${id}`);
      if (!response.ok) throw new Error('Failed to fetch deal');
      return response.json();
    },
    enabled: !!id
  });

  // Fetch deal activities with correct parameters
  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities', 'deal', id],
    queryFn: async () => {
      const response = await fetch(`/api/activities?relatedToType=deal&relatedToId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
    enabled: !!id
  });

  // Deal update mutation
  const updateDealMutation = useMutation({
    mutationFn: async (updates: Partial<Deal>) => {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update deal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals', id] });
      setIsEditing(null);
      setEditValues({});
    }
  });

  const handleSave = (field: string) => {
    updateDealMutation.mutate({ [field]: editValues[field] });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditValues({});
  };

  const startEditing = (field: string, currentValue: any) => {
    setIsEditing(field);
    setEditValues({ [field]: currentValue });
  };

  if (isLoading) {
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
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Deal not found</h2>
          <p className="mt-2 text-gray-600">The deal you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Deals
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{deal.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${parseInt(deal.value).toLocaleString()}
                </span>
                <span className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {deal.probability}% probability
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Closes {new Date(deal.expectedCloseDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                deal.dealHealth === 'healthy' ? 'bg-green-100 text-green-800' :
                deal.dealHealth === 'at_risk' ? 'bg-yellow-100 text-yellow-800' :
                deal.dealHealth === 'critical' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {deal.dealHealth}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {deal.stage}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Deal Overview */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Deal Overview</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <p className="text-gray-900">{deal.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Next Step</label>
                    <p className="text-gray-900">{deal.nextStep}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Deal Type</label>
                    <p className="text-gray-900 capitalize">{deal.dealType?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">AI Score</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${deal.aiScore}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{deal.aiScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities & Timeline */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Activities & Timeline ({activities.length})
                  </h3>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activities.length > 0 ? activities.map((activity: Activity) => (
                    <div key={activity.id} className="flex space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
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
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">No activities yet</p>
                      <p className="text-sm">Activities will appear here once added</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Key Contacts */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Contacts</h3>
              <div className="space-y-3">
                {deal.account && (
                  <div className="flex items-center space-x-3 p-2 border rounded">
                    <Building className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{deal.account.name}</p>
                      <p className="text-xs text-gray-500">{deal.account.industry}</p>
                    </div>
                  </div>
                )}
                
                {deal.contact && (
                  <div className="flex items-center space-x-3 p-2 border rounded">
                    <User className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-medium">
                        {deal.contact.firstName} {deal.contact.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{deal.contact.email}</p>
                      <p className="text-xs text-gray-500">{deal.contact.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md">
                  <Video className="w-4 h-4 mr-2" />
                  Book Meeting
                </button>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white shadow rounded-lg p-6">
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