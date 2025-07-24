import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, Edit2, Save, X, Plus, Mail, Phone, Globe, Building,
  Calendar, DollarSign, User, Target, Clock, FileText, Paperclip,
  Activity, Users, MessageSquare, Briefcase, TrendingUp, CheckCircle,
  CheckSquare
} from 'lucide-react';

interface DealDetailPageProps {
  dealId: string;
}

interface EditableFieldProps {
  label: string;
  value: string | number;
  field: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  onSave: (field: string, value: string | number) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  field, 
  type = 'text', 
  options = [],
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(field, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center space-x-2">
          {type === 'select' ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <button
            onClick={handleSave}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center justify-between group">
        <span className="text-gray-900 flex-1">
          {type === 'date' && value ? new Date(value as string).toLocaleDateString() : 
           type === 'number' && value ? `$${(value as number).toLocaleString()}` : 
           value || '-'}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-blue-600 transition-all"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const DealDetailPage: React.FC<DealDetailPageProps> = ({ dealId }) => {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState('overview');

  // Section navigation for smooth scrolling
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveSection(sectionId);
    }
  };
  
  const queryClient = useQueryClient();

  // Fetch deal activities
  const { data: activities = [] } = useQuery({
    queryKey: ['/api/deals', dealId, 'activities'],
    queryFn: async () => {
      if (!dealId) return [];
      try {
        const response = await fetch(`/api/deals/${dealId}/activities`);
        if (!response.ok) return [];
        return response.json();
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    },
    enabled: !!dealId
  });

  const { data: deal, isLoading } = useQuery({
    queryKey: ['/api/deals', dealId],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${dealId}`);
      if (!response.ok) throw new Error('Deal not found');
      return response.json();
    }
  });

  const { data: account } = useQuery({
    queryKey: ['/api/accounts', deal?.accountId],
    queryFn: async () => {
      if (!deal?.accountId) return null;
      const response = await fetch(`/api/accounts/${deal.accountId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!deal?.accountId
  });

  const { data: contact } = useQuery({
    queryKey: ['/api/contacts', deal?.contactId],
    queryFn: async () => {
      if (!deal?.contactId) return null;
      const response = await fetch(`/api/contacts/${deal.contactId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!deal?.contactId
  });

  const updateDealMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: string | number }) => {
      return apiRequest(`/api/deals/${dealId}`, {
        method: 'PATCH',
        body: { [field]: value }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals', dealId] });
    }
  });

  const handleFieldSave = (field: string, value: string | number) => {
    updateDealMutation.mutate({ field, value });
  };

  // Separate activities by status and type
  const openActivities = activities.filter((activity: any) => activity.status === 'planned');
  const closedActivities = activities.filter((activity: any) => activity.status === 'completed');
  
  const getActivitiesByType = (activitiesList: any[], type: string) => {
    return activitiesList.filter((activity: any) => activity.type === type);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'meeting': return Calendar;
      case 'task': return CheckSquare;
      default: return Activity;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderActivityColumn = (activities: any[], type: string, isOpen: boolean = true) => {
    const Icon = getActivityIcon(type);
    const typeActivities = getActivitiesByType(activities, type);
    
    return (
      <div className="border border-gray-200 rounded-lg">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Icon className={`h-4 w-4 ${
              type === 'email' ? 'text-blue-600' :
              type === 'call' ? 'text-green-600' :
              type === 'meeting' ? 'text-purple-600' :
              'text-orange-600'
            }`} />
            <h4 className="font-medium text-gray-900 capitalize">{type}s</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              type === 'email' ? 'bg-blue-100 text-blue-800' :
              type === 'call' ? 'bg-green-100 text-green-800' :
              type === 'meeting' ? 'bg-purple-100 text-purple-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {typeActivities.length}
            </span>
          </div>
        </div>
        <div className="p-3">
          {typeActivities.length > 0 ? (
            <div className="space-y-3">
              {typeActivities.map((activity: any) => (
                <div key={activity.id} className="p-3 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900">{activity.subject}</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        {isOpen ? 'Scheduled: ' : 'Completed: '}
                        {new Date(isOpen ? (activity.scheduledAt || activity.createdAt) : (activity.completedAt || activity.createdAt)).toLocaleDateString()}
                      </p>
                      {activity.duration && (
                        <p className="text-xs text-gray-500 mt-1">Duration: {activity.duration}m</p>
                      )}
                      {activity.outcome && !isOpen && (
                        <p className="text-xs text-green-700 mt-1 bg-green-50 px-2 py-1 rounded">
                          <strong>Outcome:</strong> {activity.outcome}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Icon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No {isOpen ? 'open' : 'closed'} {type}s</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const sidebarModules = [
    { id: 'overview', label: 'Deal Overview', icon: Briefcase },
    { id: 'activities', label: 'Open Activities', icon: Target },
    { id: 'closed-activities', label: 'Closed Activities', icon: CheckCircle },
  ];

  const stageOptions = [
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deal not found</h2>
          <p className="text-gray-600 mb-4">The deal you're looking for doesn't exist.</p>
          <button
            onClick={() => setLocation('/crm/deals')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation('/crm/deals')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
              <p className="text-gray-600">
                {account?.name} • {contact?.firstName} {contact?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${parseFloat(deal.value || '0').toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {deal.stage?.replace('-', ' ')} • {deal.probability || 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Deal Details</h3>
            <nav className="space-y-1">
              {sidebarModules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => scrollToSection(module.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === module.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {module.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Deal Overview */}
          <div id="overview" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Deal Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <EditableField
                  label="Deal Name"
                  value={deal.name || ''}
                  field="name"
                  onSave={handleFieldSave}
                />
                <EditableField
                  label="Stage"
                  value={deal.stage || ''}
                  field="stage"
                  type="select"
                  options={stageOptions}
                  onSave={handleFieldSave}
                />
                <EditableField
                  label="Value"
                  value={parseFloat(deal.value || '0')}
                  field="value"
                  type="number"
                  onSave={handleFieldSave}
                />
              </div>
              <div className="space-y-4">
                <EditableField
                  label="Probability"
                  value={deal.probability || 0}
                  field="probability"
                  type="number"
                  onSave={handleFieldSave}
                />
                <EditableField
                  label="Expected Close Date"
                  value={deal.expectedCloseDate || ''}
                  field="expectedCloseDate"
                  type="date"
                  onSave={handleFieldSave}
                />
                <EditableField
                  label="Description"
                  value={deal.description || ''}
                  field="description"
                  type="textarea"
                  onSave={handleFieldSave}
                />
              </div>
            </div>
          </div>

          {/* Open Activities Section */}
          <div id="activities" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Open Activities</h3>
                <span className="text-sm text-gray-500">({openActivities.length} total)</span>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4 inline mr-2" />
                Add Activity
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {renderActivityColumn(openActivities, 'email', true)}
              {renderActivityColumn(openActivities, 'task', true)}
              {renderActivityColumn(openActivities, 'meeting', true)}
              {renderActivityColumn(openActivities, 'call', true)}
            </div>
          </div>

          {/* Closed Activities Section */}
          <div id="closed-activities" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Closed Activities</h3>
                <span className="text-sm text-gray-500">({closedActivities.length} completed)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {renderActivityColumn(closedActivities, 'email', false)}
              {renderActivityColumn(closedActivities, 'task', false)}
              {renderActivityColumn(closedActivities, 'meeting', false)}
              {renderActivityColumn(closedActivities, 'call', false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailPage;