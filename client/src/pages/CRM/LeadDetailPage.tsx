import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  Target, 
  TrendingUp,
  Clock,
  Star,
  MessageSquare,
  FileText,
  Activity,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Settings,
  MoreVertical,
  Heart,
  Share,
  Download,
  Tag
} from 'lucide-react';

interface Lead {
  id: string;
  contactId?: string;
  accountId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  jobTitle?: string;
  leadSource?: string;
  leadStatus?: string;
  leadScore?: number;
  industry?: string;
  stage?: string;
  status?: string;
  score?: number;
  value?: string;
  probability?: number;
  expectedCloseDate?: string;
  source?: string;
  priority?: string;
  rating?: number;
  assignedTo?: string;
  lastContact?: string;
  notes?: string;
  tags?: string[];
  customFields?: any;
  engagementScore?: number;
  fitScore?: number;
  intentScore?: number;
  qualification?: any;
  channel?: string;
  sentiment?: string;
  webActivity?: any;
  emailActivity?: any;
  socialActivity?: any;
  nurturingCampaignId?: string;
  nurturingStage?: string;
  autoAssignmentRules?: any;
  assignmentHistory?: any;
  enrichmentStatus?: string;
  enrichmentData?: any;
  consentStatus?: string;
  consentTimestamp?: string;
  communicationPreferences?: any;
  attachments?: any;
  linkedinUrl?: string;
  twitterUrl?: string;
  companyLinkedinUrl?: string;
  timezone?: string;
  locale?: string;
  companySize?: string;
  annualRevenue?: string;
  employees?: string;
  technologies?: any;
  competitors?: any;
  painPoints?: any;
  interests?: any;
  websiteVisits?: number;
  emailOpens?: number;
  emailClicks?: number;
  contentDownloads?: number;
  demoRequests?: number;
  nextAction?: string;
  nextActionDate?: string;
  lastActivityType?: string;
  responseTime?: number;
  campaignId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  firstTouchpoint?: string;
  lastTouchpoint?: string;
  aiInsights?: any;
  autoNurturing?: boolean;
  sequenceId?: string;
  gdprConsent?: boolean;
  emailOptIn?: boolean;
  smsOptIn?: boolean;
  dataProcessingConsent?: string;
  createdAt: string;
  updatedAt?: string;
  lastContactDate?: string;
  nextFollowUp?: string;
  description?: string;
  interest?: string;
  budget?: string;
  timeline?: string;
  website?: string;
  linkedinProfile?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  conversionProbability?: number;
}

const LEAD_STATUSES = [
  { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-800' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'qualified', name: 'Qualified', color: 'bg-green-100 text-green-800' },
  { id: 'unqualified', name: 'Unqualified', color: 'bg-red-100 text-red-800' },
  { id: 'nurturing', name: 'Nurturing', color: 'bg-purple-100 text-purple-800' },
  { id: 'converted', name: 'Converted', color: 'bg-emerald-100 text-emerald-800' }
];

export default function LeadDetailPage({ params }: { params?: { id: string } } = {}) {
  const { id: routeId } = useParams<{ id: string }>();
  const id = params?.id || routeId;
  const [, setLocation] = useLocation();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const queryClient = useQueryClient();

  // Fetch lead details
  const { data: lead, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/leads/${id}`],
    enabled: !!id,
    retry: 3,
    retryDelay: 1000
  }) as { data: Lead | undefined, isLoading: boolean, error: any, refetch: () => void };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead Not Found</h2>
          <p className="text-gray-600 mb-4">The lead you're looking for doesn't exist.</p>
          <button 
            onClick={() => setLocation('/crm/leads')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  // Lead update mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ updates }: { updates: Partial<Lead> }) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: [`/api/leads/${id}`] });
      setEditingField(null);
    },
    onError: (error) => {
      console.error('Failed to update lead:', error);
      setEditingField(null);
    }
  });

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const handleSave = () => {
    if (editingField && lead && editValue !== (lead as any)[editingField]) {
      updateLeadMutation.mutate({
        updates: { [editingField]: editValue }
      });
    } else {
      setEditingField(null);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const renderEditableField = (field: string, label: string, value: string | undefined, type: 'text' | 'email' | 'tel' | 'textarea' | 'select' = 'text', options?: Array<{id: string, name: string}>) => {
    const isEditing = editingField === field;
    
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-600">{label}</label>
          {isEditing ? (
            <div className="mt-1">
              {type === 'textarea' ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              ) : type === 'select' ? (
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {options?.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ) : (
            <div className="mt-1 text-gray-900">{value || 'Not set'}</div>
          )}
        </div>
        <div className="ml-4 flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={updateLeadMutation.isPending}
                className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleEdit(field, value || '')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const calculateLeadHealth = (lead: Lead) => {
    if (!lead) return { status: 'neutral', color: 'gray', icon: '📊', label: 'Neutral' };
    
    const lastContactDate = lead.lastContactDate || lead.lastContact || lead.createdAt;
    const daysSinceContact = Math.ceil((new Date().getTime() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24));
    const score = lead.leadScore || lead.score || 0;
    
    if (score >= 80) return { status: 'hot', color: 'red', icon: '🔥', label: 'Hot Lead' };
    if (score >= 60) return { status: 'warm', color: 'yellow', icon: '⚡', label: 'Warm Lead' };
    if (daysSinceContact > 14) return { status: 'cold', color: 'blue', icon: '❄️', label: 'Cold Lead' };
    return { status: 'neutral', color: 'gray', icon: '📊', label: 'Neutral' };
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ Error loading lead</div>
          <p className="text-gray-600 mb-4">{error?.toString() || 'Lead not found'}</p>
          <button 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mr-3"
            onClick={() => refetch()}
          >
            Retry
          </button>
          <button 
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            onClick={() => setLocation('/crm/leads')}
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  const health = calculateLeadHealth(lead as Lead);
  const statusConfig = LEAD_STATUSES.find(s => s.id === (lead as Lead)?.status) || LEAD_STATUSES[0];

  return (
    <motion.div 
      className="h-full flex flex-col bg-gray-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <motion.div 
        className="bg-white border-b px-6 py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation('/crm/leads')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {(lead as Lead)?.firstName || (lead as Lead)?.name?.split(' ')[0] || 'Unknown'} {(lead as Lead)?.lastName || (lead as Lead)?.name?.split(' ')[1] || ''}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-3 py-1 text-sm rounded-full ${statusConfig.color}`}>
                  {statusConfig.name}
                </span>
                <span className="flex items-center space-x-1 text-sm text-gray-600">
                  <span>{health.icon}</span>
                  <span>{health.label}</span>
                </span>
                <span className="text-sm text-gray-600">
                  Score: <span className="font-semibold text-orange-600">{(lead as Lead)?.leadScore || (lead as Lead)?.score || 0}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2"
              onClick={() => alert('Convert to Deal functionality coming soon!')}
            >
              <ArrowRight className="w-4 h-4" />
              <span>Convert to Deal</span>
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2"
              onClick={() => alert('Send Email functionality coming soon!')}
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="flex-1 overflow-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">{(lead as Lead)?.score || 0}</div>
                <div className="text-sm text-gray-600">Lead Score</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(lead as Lead)?.score || 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{(lead as Lead)?.probability || 0}%</div>
                <div className="text-sm text-gray-600">Conversion Probability</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((lead as Lead)?.probability || 0) >= 75 ? 'High potential' : 
                   ((lead as Lead)?.probability || 0) >= 50 ? 'Medium potential' : 'Low potential'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  {Math.ceil((new Date((lead as Lead)?.expectedCloseDate || new Date()).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days to Close</div>
                <div className="text-xs text-gray-500 mt-1">
                  Expected: {new Date((lead as Lead)?.expectedCloseDate || new Date()).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.ceil((new Date().getTime() - new Date((lead as Lead)?.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Since Created</div>
                <div className="text-xs text-gray-500 mt-1">
                  Created: {new Date((lead as Lead)?.createdAt || new Date()).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Lead Information */}
            <div className="bg-white rounded-lg border mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Lead Information</h2>
                <div className="space-y-0">
                  {renderEditableField('name', 'Full Name', (lead as Lead)?.name || `${(lead as Lead)?.firstName || ''} ${(lead as Lead)?.lastName || ''}`.trim())}
                  {renderEditableField('email', 'Email', (lead as Lead)?.email, 'email')}
                  {renderEditableField('phone', 'Phone', (lead as Lead)?.phone, 'tel')}
                  {renderEditableField('company', 'Company', (lead as Lead)?.company)}
                  {renderEditableField('position', 'Position', (lead as Lead)?.position || (lead as Lead)?.jobTitle)}
                  {renderEditableField('status', 'Status', (lead as Lead)?.status || (lead as Lead)?.leadStatus, 'select', LEAD_STATUSES)}
                  {renderEditableField('source', 'Lead Source', (lead as Lead)?.source || (lead as Lead)?.leadSource)}
                  {renderEditableField('industry', 'Industry', (lead as Lead)?.industry)}
                  {renderEditableField('notes', 'Notes', (lead as Lead)?.notes || (lead as Lead)?.description, 'textarea')}
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg border mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Company Information</h2>
                <div className="space-y-0">
                  {renderEditableField('annualRevenue', 'Annual Revenue', (lead as Lead)?.annualRevenue)}
                  {renderEditableField('employees', 'Number of Employees', (lead as Lead)?.employees)}
                  {renderEditableField('industry', 'Industry', (lead as Lead)?.industry)}
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg border mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Location Information</h2>
                <div className="space-y-0">
                  {renderEditableField('city', 'City', (lead as Lead)?.city)}
                  {renderEditableField('state', 'State', (lead as Lead)?.state)}
                  {renderEditableField('country', 'Country', (lead as Lead)?.country)}
                  {renderEditableField('zipCode', 'Zip Code', (lead as Lead)?.zipCode)}
                </div>
              </div>
            </div>

            {/* Qualification Information */}
            <div className="bg-white rounded-lg border mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Qualification Details</h2>
                <div className="space-y-0">
                  {renderEditableField('interest', 'Interest Level', (lead as Lead)?.interest)}
                  {renderEditableField('budget', 'Budget', (lead as Lead)?.budget)}
                  {renderEditableField('timeline', 'Timeline', (lead as Lead)?.timeline)}
                  {renderEditableField('sentiment', 'Sentiment', (lead as Lead)?.sentiment)}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Lead Created</div>
                      <div className="text-sm text-gray-600">
                        Lead was created from {(lead as Lead)?.source}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date((lead as Lead)?.createdAt || new Date()).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Last Contact</div>
                      <div className="text-sm text-gray-600">
                        Last contacted via email
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date((lead as Lead)?.lastContact || new Date()).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Score Updated</div>
                      <div className="text-sm text-gray-600">
                        Lead score increased to {(lead as Lead)?.score}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        2 hours ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l overflow-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left"
                onClick={() => alert('Schedule meeting functionality coming soon!')}
              >
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Schedule Meeting</span>
              </button>
              
              <button 
                className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left"
                onClick={() => alert('Send email functionality coming soon!')}
              >
                <Mail className="w-5 h-5 text-green-600" />
                <span className="font-medium">Send Email</span>
              </button>
              
              <button 
                className="w-full flex items-center space-x-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left"
                onClick={() => alert('Make call functionality coming soon!')}
              >
                <Phone className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Make Call</span>
              </button>
              
              <button 
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left"
                onClick={() => alert('Add note functionality coming soon!')}
              >
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Add Note</span>
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Lead Health</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{health.icon}</span>
                  <span className="font-medium">{health.label}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Based on lead score, activity, and engagement
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lead Score</span>
                    <span className="font-medium">{(lead as Lead)?.score}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conversion Probability</span>
                    <span className="font-medium">{(lead as Lead)?.probability}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Days Since Contact</span>
                    <span className="font-medium">
                      {Math.ceil((new Date().getTime() - new Date((lead as Lead)?.lastContact || new Date()).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Assigned To</h3>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {(lead as Lead)?.assignedTo?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{(lead as Lead)?.assignedTo}</div>
                  <div className="text-sm text-gray-600">Sales Rep</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}