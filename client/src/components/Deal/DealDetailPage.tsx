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
  const [activeTab, setActiveTab] = useState('overview');
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
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'activities', label: 'Open Activities', icon: Activity },
    { id: 'closed-activities', label: 'Closed Activities', icon: CheckCircle },
    { id: 'engagement', label: 'Engagement Plan', icon: Target },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'proposal', label: 'Request for Proposal', icon: FileText },
    { id: 'data', label: 'Request for Data', icon: Briefcase },
    { id: 'contracts', label: 'Request for Contracts', icon: FileText },
    { id: 'stage-history', label: 'Stage History', icon: TrendingUp },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'emails', label: 'Emails', icon: Mail }
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

  const renderPlaceholderTab = (title: string, description: string) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        <Plus className="h-4 w-4 inline mr-2" />
        Add New
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
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
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Related List</h2>
            <nav className="space-y-1">
              {sidebarModules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === module.id
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

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'timeline' && renderPlaceholderTab('Timeline', 'Track all activities and milestones for this deal')}
          {activeTab === 'notes' && renderPlaceholderTab('Notes', 'Add notes and comments about this deal')}
          {activeTab === 'activities' && renderPlaceholderTab('Open Activities', 'Manage upcoming tasks and activities')}
          {activeTab === 'closed-activities' && renderPlaceholderTab('Closed Activities', 'View completed activities')}
          {activeTab === 'engagement' && renderPlaceholderTab('Engagement Plan', 'Plan customer engagement activities')}
          {activeTab === 'attachments' && renderPlaceholderTab('Attachments', 'Upload and manage deal documents')}
          {activeTab === 'proposal' && renderPlaceholderTab('Request for Proposal', 'Manage proposal requests')}
          {activeTab === 'data' && renderPlaceholderTab('Request for Data', 'Track data requests')}
          {activeTab === 'contracts' && renderPlaceholderTab('Request for Contracts', 'Manage contract requests')}
          {activeTab === 'stage-history' && renderPlaceholderTab('Stage History', 'View deal progression through stages')}
          {activeTab === 'competitors' && renderPlaceholderTab('Competitors', 'Track competitive information')}
          {activeTab === 'emails' && renderPlaceholderTab('Emails', 'Manage email communications')}
        </div>
      </div>
    </div>
  );
};

export default DealDetailPage;