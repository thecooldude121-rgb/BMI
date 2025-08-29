import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Building, MapPin, Tag, Calendar, 
  DollarSign, Star, Clock, Edit, Trash2, UserCheck, 
  FileText, Paperclip, Camera, MessageCircle, Activity,
  ChevronDown, ChevronUp, MoreHorizontal, Download,
  ExternalLink, Copy, Share, Eye, Archive, Flag,
  Zap, TrendingUp, AlertTriangle, CheckCircle,
  Plus, Filter, Search, Upload, ArrowLeft,
  Settings, Bell, Heart, Link
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { formatDistanceToNow, format } from 'date-fns';

interface LeadDetailsPageProps {
  leadId: string;
  onClose: () => void;
  onEdit: (lead: any) => void;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'status_change';
  subject: string;
  description?: string;
  outcome?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  status: 'open' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
}

interface Contact {
  id: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  linkedinUrl?: string;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: string;
  createdAt: string;
}

const LeadDetailsPage: React.FC<LeadDetailsPageProps> = ({ leadId, onClose, onEdit }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [activeTab, setActiveTab] = useState('timeline');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newActivity, setNewActivity] = useState({
    type: 'call',
    subject: '',
    description: '',
    scheduledAt: '',
    priority: 'medium'
  });
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    contacts: true,
    deals: true,
    files: true
  });

  // Fetch lead data
  const { data: lead, isLoading: leadLoading } = useQuery({
    queryKey: [`/api/leads/${leadId}`],
    queryFn: () => apiRequest(`/api/leads/${leadId}`),
    enabled: !!leadId
  });

  // Fetch activities
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: [`/api/leads/${leadId}/activities`],
    queryFn: () => apiRequest(`/api/leads/${leadId}/activities`),
    enabled: !!leadId
  });

  // Fetch related contacts
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: [`/api/leads/${leadId}/contacts`],
    queryFn: () => apiRequest(`/api/leads/${leadId}/contacts`),
    enabled: !!leadId
  });

  // Fetch related deals
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: [`/api/leads/${leadId}/deals`],
    queryFn: () => apiRequest(`/api/leads/${leadId}/deals`),
    enabled: !!leadId
  });

  // Fetch files/attachments
  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: [`/api/leads/${leadId}/files`],
    queryFn: () => apiRequest(`/api/leads/${leadId}/files`),
    enabled: !!leadId
  });

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: (updates: any) => apiRequest(`/api/leads/${leadId}`, {
      method: 'PATCH',
      body: updates
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/leads/${leadId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    }
  });

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: (activity: any) => apiRequest('/api/activities', {
      method: 'POST',
      body: { ...activity, leadId }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/leads/${leadId}/activities`] });
      setShowActivityForm(false);
      setNewActivity({
        type: 'call',
        subject: '',
        description: '',
        scheduledAt: '',
        priority: 'medium'
      });
    }
  });

  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: () => apiRequest(`/api/leads/${leadId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      onClose();
    }
  });

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'details', label: 'Contact Info', icon: User },
    { id: 'opportunities', label: 'Opportunities', icon: TrendingUp },
    { id: 'files', label: 'Files & Notes', icon: FileText },
    { id: 'history', label: 'Change Log', icon: Clock }
  ];

  const activityTypes = [
    { value: 'call', label: 'Call', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'meeting', label: 'Meeting', icon: Calendar },
    { value: 'note', label: 'Note', icon: FileText },
    { value: 'task', label: 'Task', icon: CheckCircle }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'note': return FileText;
      case 'task': return CheckCircle;
      case 'status_change': return Flag;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'text-blue-600 bg-blue-100';
      case 'email': return 'text-green-600 bg-green-100';
      case 'meeting': return 'text-purple-600 bg-purple-100';
      case 'note': return 'text-yellow-600 bg-yellow-100';
      case 'task': return 'text-orange-600 bg-orange-100';
      case 'status_change': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'unqualified': return 'bg-red-100 text-red-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleQuickStatusChange = (newStatus: string) => {
    updateLeadMutation.mutate({ status: newStatus });
  };

  const handleQuickPriorityChange = (newPriority: string) => {
    updateLeadMutation.mutate({ priority: newPriority });
  };

  const handleCreateActivity = () => {
    if (newActivity.subject.trim()) {
      createActivityMutation.mutate(newActivity);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      // In a real app, this would upload files to a file storage service
      console.log('Uploading files:', Array.from(files));
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (leadLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Not Found</h3>
          <p className="text-gray-600 mb-4">The lead you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            data-testid="button-close-not-found"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex">
      <div className="bg-white w-full max-w-6xl mx-auto my-4 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {lead.name?.charAt(0)?.toUpperCase() || 'L'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold" data-testid="text-lead-name">{lead.name}</h1>
                  <p className="text-blue-100">
                    {lead.title && `${lead.title} at `}{lead.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                  {lead.priority?.charAt(0).toUpperCase() + lead.priority?.slice(1)} Priority
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(lead)}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 flex items-center transition-colors"
                data-testid="button-edit-lead"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              
              <button
                onClick={() => handleQuickStatusChange('converted')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center transition-colors"
                data-testid="button-convert-lead"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Convert
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                  data-testid="button-more-actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {showMoreActions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                    <button
                      onClick={() => {/* Handle duplicate */}}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                      data-testid="button-duplicate"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => {/* Handle share */}}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                      data-testid="button-share"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </button>
                    <button
                      onClick={() => {/* Handle archive */}}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                      data-testid="button-archive"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => deleteLeadMutation.mutate()}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                      data-testid="button-delete"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Lead Summary */}
              <div className="bg-white rounded-lg border p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('summary')}
                >
                  <h3 className="font-semibold text-gray-900">Lead Summary</h3>
                  {expandedSections.summary ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
                </div>
                
                {expandedSections.summary && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{lead.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{lead.company}</span>
                    </div>
                    {lead.source && (
                      <div className="flex items-center text-sm">
                        <Zap className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Source: {lead.source}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Created {formatDistanceToNow(new Date(lead.createdAt))} ago
                      </span>
                    </div>
                    {lead.estimatedValue > 0 && (
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          Est. Value: ${lead.estimatedValue?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowActivityForm(true)}
                    className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg flex items-center text-sm"
                    data-testid="button-add-activity"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </button>
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="w-full px-3 py-2 text-left text-green-600 hover:bg-green-50 rounded-lg flex items-center text-sm"
                    data-testid="button-add-note"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add Note
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-3 py-2 text-left text-purple-600 hover:bg-purple-50 rounded-lg flex items-center text-sm"
                    data-testid="button-upload-file"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </button>
                </div>
              </div>

              {/* Status Change */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Change Status</h3>
                <div className="space-y-2">
                  {['new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleQuickStatusChange(status)}
                      className={`w-full px-3 py-2 text-left rounded-lg text-sm transition-colors ${
                        lead.status === status 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      data-testid={`button-status-${status}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Change */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Priority</h3>
                <div className="space-y-2">
                  {['high', 'medium', 'low'].map(priority => (
                    <button
                      key={priority}
                      onClick={() => handleQuickPriorityChange(priority)}
                      className={`w-full px-3 py-2 text-left rounded-lg text-sm transition-colors ${
                        lead.priority === priority 
                          ? getPriorityColor(priority).replace('text-', 'bg-').replace('bg-', 'bg-') + ' border border-opacity-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      data-testid={`button-priority-${priority}`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="border-b bg-white">
              <div className="flex space-x-8 px-6">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      data-testid={`tab-${tab.id}`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Activity Timeline</h2>
                    <div className="flex items-center space-x-3">
                      <select
                        value={timelineFilter}
                        onChange={(e) => setTimelineFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        data-testid="select-timeline-filter"
                      >
                        <option value="all">All Activities</option>
                        <option value="calls">Calls</option>
                        <option value="emails">Emails</option>
                        <option value="meetings">Meetings</option>
                        <option value="notes">Notes</option>
                        <option value="tasks">Tasks</option>
                      </select>
                    </div>
                  </div>

                  {/* Add Activity Form */}
                  {showActivityForm && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Add New Activity</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={newActivity.type}
                            onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                            data-testid="select-activity-type"
                          >
                            {activityTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          <select
                            value={newActivity.priority}
                            onChange={(e) => setNewActivity({...newActivity, priority: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                            data-testid="select-activity-priority"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          placeholder="Activity subject"
                          value={newActivity.subject}
                          onChange={(e) => setNewActivity({...newActivity, subject: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          data-testid="input-activity-subject"
                        />
                        <textarea
                          placeholder="Description (optional)"
                          value={newActivity.description}
                          onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          data-testid="textarea-activity-description"
                        />
                        <input
                          type="datetime-local"
                          value={newActivity.scheduledAt}
                          onChange={(e) => setNewActivity({...newActivity, scheduledAt: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          data-testid="input-activity-scheduled"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={handleCreateActivity}
                            disabled={!newActivity.subject.trim() || createActivityMutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            data-testid="button-save-activity"
                          >
                            {createActivityMutation.isPending ? 'Creating...' : 'Create Activity'}
                          </button>
                          <button
                            onClick={() => setShowActivityForm(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            data-testid="button-cancel-activity"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activities List */}
                  <div className="space-y-4">
                    {activitiesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading activities...</p>
                      </div>
                    ) : activities.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Yet</h3>
                        <p className="text-gray-600 mb-4">Start tracking interactions with this lead</p>
                        <button
                          onClick={() => setShowActivityForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          data-testid="button-first-activity"
                        >
                          Add First Activity
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        {activities
                          .filter((activity: Activity) => 
                            timelineFilter === 'all' || 
                            (timelineFilter === 'calls' && activity.type === 'call') ||
                            (timelineFilter === 'emails' && activity.type === 'email') ||
                            (timelineFilter === 'meetings' && activity.type === 'meeting') ||
                            (timelineFilter === 'notes' && activity.type === 'note') ||
                            (timelineFilter === 'tasks' && activity.type === 'task')
                          )
                          .map((activity: Activity, index: number) => {
                            const Icon = getActivityIcon(activity.type);
                            return (
                              <div key={activity.id} className="relative flex items-start space-x-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(activity.priority)}`}>
                                        {activity.priority}
                                      </span>
                                      <span>{formatDistanceToNow(new Date(activity.createdAt))} ago</span>
                                    </div>
                                  </div>
                                  {activity.description && (
                                    <p className="text-gray-600 mb-2">{activity.description}</p>
                                  )}
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                      by {activity.createdByName}
                                    </span>
                                    {activity.attachments && activity.attachments.length > 0 && (
                                      <div className="flex items-center text-gray-500">
                                        <Paperclip className="h-4 w-4 mr-1" />
                                        {activity.attachments.length} file{activity.attachments.length > 1 ? 's' : ''}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info Tab */}
              {activeTab === 'details' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Basic Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-gray-900">{lead.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-900">{lead.email}</p>
                            <button
                              onClick={() => navigator.clipboard.writeText(lead.email)}
                              className="text-gray-400 hover:text-gray-600"
                              data-testid="button-copy-email"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {lead.phone && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <div className="flex items-center space-x-2">
                              <p className="text-gray-900">{lead.phone}</p>
                              <button
                                onClick={() => navigator.clipboard.writeText(lead.phone)}
                                className="text-gray-400 hover:text-gray-600"
                                data-testid="button-copy-phone"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Company</label>
                          <p className="text-gray-900">{lead.company}</p>
                        </div>
                        {lead.title && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Job Title</label>
                            <p className="text-gray-900">{lead.title}</p>
                          </div>
                        )}
                        {lead.industry && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Industry</label>
                            <p className="text-gray-900">{lead.industry}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lead Information */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Lead Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1)}
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Priority</label>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                            {lead.priority?.charAt(0).toUpperCase() + lead.priority?.slice(1)}
                          </span>
                        </div>
                        {lead.source && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Source</label>
                            <p className="text-gray-900">{lead.source}</p>
                          </div>
                        )}
                        {lead.estimatedValue > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Estimated Value</label>
                            <p className="text-gray-900">${lead.estimatedValue?.toLocaleString()}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created</label>
                          <p className="text-gray-900">
                            {format(new Date(lead.createdAt), 'PPP')} 
                            <span className="text-gray-500 ml-1">
                              ({formatDistanceToNow(new Date(lead.createdAt))} ago)
                            </span>
                          </p>
                        </div>
                        {lead.tags && lead.tags.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Tags</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {lead.tags.map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {lead.notes && (
                    <div className="mt-6 bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Other tabs would be implemented similarly... */}
              {activeTab === 'opportunities' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Related Opportunities</h2>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Opportunities feature coming soon...</p>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Files & Documents</h2>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Files feature coming soon...</p>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Change History</h2>
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Change history feature coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          data-testid="input-file-upload-hidden"
        />
      </div>
    </div>
  );
};

export default LeadDetailsPage;