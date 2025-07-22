import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, Edit2, Save, X, Plus, Mail, Phone, Globe, Building,
  Calendar, DollarSign, User, Target, Clock, FileText, Paperclip,
  Activity, Users, MessageSquare, Briefcase, TrendingUp, CheckCircle
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

  const sidebarModules = [
    { id: 'overview', label: 'Deal Overview', icon: Briefcase },
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'activities', label: 'Open Activities', icon: Target },
    { id: 'engagement', label: 'Engagement Plan', icon: Users },
    { id: 'stage-history', label: 'Stage History', icon: TrendingUp },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'emails', label: 'Email Communications', icon: Mail }
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
          <h2 className="text-2xl font-bold text-gray-900">Deal not found</h2>
          <button
            onClick={() => setLocation('/crm/deals')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Deal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Deal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label="Deal Owner"
            value={deal.assignedTo || 'Unassigned'}
            field="assignedTo"
            onSave={handleFieldSave}
          />
          <EditableField
            label="Amount"
            value={deal.value}
            field="value"
            type="number"
            onSave={handleFieldSave}
          />
          <EditableField
            label="Stage"
            value={deal.stage}
            field="stage"
            type="select"
            options={stageOptions}
            onSave={handleFieldSave}
          />
          <EditableField
            label="Probability (%)"
            value={deal.probability}
            field="probability"
            type="number"
            onSave={handleFieldSave}
          />
          <EditableField
            label="Expected Close Date"
            value={deal.expectedCloseDate}
            field="expectedCloseDate"
            type="date"
            onSave={handleFieldSave}
          />
          <EditableField
            label="Next Step"
            value={deal.nextStep || ''}
            field="nextStep"
            onSave={handleFieldSave}
          />
        </div>
      </div>

      {/* Account & Contact Information */}
      {(account || contact) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Account & Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {account && (
              <>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Account Name</label>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{account.name}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <span className="text-gray-900">{account.industry || '-'}</span>
                </div>
                {account.website && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {account.website}
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
            {contact && (
              <>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{contact.firstName} {contact.lastName}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
                {contact.phone && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                {contact.position && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <span className="text-gray-900">{contact.position}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Description</h3>
        <EditableField
          label="Deal Description"
          value={deal.description || ''}
          field="description"
          type="textarea"
          onSave={handleFieldSave}
        />
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notes</h3>
        <EditableField
          label="Deal Notes"
          value={deal.notes || ''}
          field="notes"
          type="textarea"
          onSave={handleFieldSave}
        />
      </div>
    </div>
  );

  // Removed placeholder tab function - now showing actual content sections

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation('/crm/deals')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
              <p className="text-gray-600">
                ${parseFloat(deal.value || '0').toLocaleString()} • {deal.stage}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Send Email
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Deal Sections</h2>
            <nav className="space-y-1">
              {sidebarModules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => scrollToSection(module.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === module.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
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

        {/* Main Scrollable Content */}
        <div className="flex-1 max-w-5xl mx-auto p-6 space-y-8">
          {/* Deal Overview Section */}
          <div id="overview">
            {renderOverviewTab()}
          </div>

        {/* Timeline Section */}
        <div id="timeline" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Activity
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Deal Created</h4>
                  <span className="text-sm text-gray-500">{new Date(deal.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Initial deal created in the system</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Follow-up Scheduled</h4>
                  <span className="text-sm text-gray-500">Tomorrow</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Next follow-up call scheduled with prospect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div id="activities" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Open Activities</h3>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Task
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Follow up with decision maker</h4>
                  <p className="text-sm text-gray-600">Due: Tomorrow</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">High Priority</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Send proposal document</h4>
                  <p className="text-sm text-gray-600">Due: Next week</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Medium Priority</span>
            </div>
          </div>
        </div>

        {/* Engagement Plan Section */}
        <div id="engagement" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Engagement Plan</h3>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Engagement
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Discovery Phase</h4>
              <p className="text-sm text-gray-600">Understand customer needs and pain points</p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">75% Complete</span>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Proposal Phase</h4>
              <p className="text-sm text-gray-600">Present solution and pricing</p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">50% Complete</span>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Negotiation Phase</h4>
              <p className="text-sm text-gray-600">Finalize terms and close deal</p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">25% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage History Section */}
        <div id="stage-history" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Stage History</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{deal.stage}</h4>
                  <span className="text-sm text-gray-500">Current Stage</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Deal is currently in this stage</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Qualification</h4>
                  <span className="text-sm text-gray-500">{new Date(deal.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Initial qualification completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div id="attachments" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Paperclip className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
            </div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              <Plus className="h-4 w-4 inline mr-2" />
              Upload File
            </button>
          </div>
          <div className="text-center py-8">
            <Paperclip className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No attachments yet</p>
            <p className="text-gray-400 text-sm">Upload documents, images, or other files related to this deal</p>
          </div>
        </div>

        {/* Emails Section */}
        <div id="emails" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Email Communications</h3>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              <Plus className="h-4 w-4 inline mr-2" />
              Compose Email
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">Re: Proposal Discussion</h4>
                  <p className="text-sm text-gray-600">From: {contact?.email || 'prospect@company.com'}</p>
                </div>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
              <p className="text-gray-700 text-sm">Thanks for the detailed proposal. We'll review it with our team and get back to you by end of week...</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">Proposal Sent</h4>
                  <p className="text-sm text-gray-600">To: {contact?.email || 'prospect@company.com'}</p>
                </div>
                <span className="text-sm text-gray-500">1 week ago</span>
              </div>
              <p className="text-gray-700 text-sm">Attached is our proposal for the project. Please review and let us know if you have any questions...</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailPage;