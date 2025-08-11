import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, Edit2, Save, X, Plus, Mail, Phone, Globe, Building,
  Calendar, DollarSign, User, Target, Clock, FileText, Paperclip,
  Activity, Users, MessageSquare, Briefcase, TrendingUp, CheckCircle,
  CheckSquare, Eye, History, ChevronRight, Award, Zap, ChevronDown,
  Upload, Download, Search, Filter, MoreVertical, Star, Flag,
  AlertTriangle, ThumbsUp, Send, Reply, Forward, Archive, Trash2,
  ExternalLink, Copy, Share2, Bell, BellOff, UserPlus, Settings,
  Maximize2, Minimize2, RefreshCw, BookOpen, Calculator, PieChart,
  BarChart3, LineChart, Camera, Video, Mic, AtSign, Hash, Link as LinkIcon,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';

interface AdvancedDealDetailsPageProps {
  dealId: string;
}

// Enhanced Deal interface with all required fields
interface AdvancedDeal {
  id: string;
  dealNumber: string;
  name: string;
  stage: string;
  pipeline: string;
  value: string;
  probability: number;
  ownerId: string;
  owner?: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
  };
  accountId: string;
  account?: {
    id: string;
    name: string;
    country: string;
    industry: string;
  };
  contacts: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isPrimary: boolean;
  }>;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
  dealType: string;
  source: string;
  description: string;
  customFields: Record<string, any>;
  competitors: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  campaigns: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  lineItems: Array<{
    id: string;
    product: string;
    category: string;
    quantity: number;
    unitPrice: number;
    total: number;
    margin?: number;
  }>;
  stageHistory: Array<{
    id: string;
    fromStage: string;
    toStage: string;
    changedAt: string;
    changedBy: string;
    duration: number;
    notes?: string;
  }>;
  followers: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  riskFactors: Array<{
    type: string;
    level: 'low' | 'medium' | 'high';
    description: string;
    suggestedAction: string;
  }>;
}

// Component for editable fields with enhanced styling
const AdvancedEditableField: React.FC<{
  label: string;
  value: any;
  field: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'currency';
  options?: Array<{ value: string; label: string }>;
  onSave: (field: string, value: any) => void;
  required?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
}> = ({ 
  label, 
  value, 
  field, 
  type = 'text', 
  options = [],
  onSave,
  required = false,
  helpText,
  icon
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const validateField = (val: any) => {
    if (required && (!val || val.toString().trim() === '')) {
      setIsValid(false);
      return false;
    }
    if (type === 'email' && val && !/\S+@\S+\.\S+/.test(val)) {
      setIsValid(false);
      return false;
    }
    setIsValid(true);
    return true;
  };

  const handleSave = () => {
    if (validateField(editValue)) {
      onSave(field, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setIsValid(true);
  };

  const formatDisplayValue = () => {
    if (!value) return '-';
    switch (type) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'date':
        return format(new Date(value), 'MMM dd, yyyy');
      default:
        return value.toString();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center space-x-2">
          {type === 'select' ? (
            <select
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isValid ? 'border-gray-300' : 'border-red-300'
              }`}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              rows={3}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isValid ? 'border-gray-300' : 'border-red-300'
              }`}
            />
          ) : (
            <input
              type={type === 'currency' ? 'number' : type}
              value={editValue || ''}
              onChange={(e) => setEditValue(type === 'number' || type === 'currency' ? parseFloat(e.target.value) || 0 : e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isValid ? 'border-gray-300' : 'border-red-300'
              }`}
              step={type === 'currency' ? '0.01' : undefined}
            />
          )}
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
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
        {!isValid && (
          <p className="text-red-600 text-xs">
            {required && !editValue ? `${label} is required` : `Invalid ${label.toLowerCase()}`}
          </p>
        )}
        {helpText && (
          <p className="text-gray-500 text-xs">{helpText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center justify-between group">
        <span className="text-gray-900 flex-1">
          {formatDisplayValue()}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-blue-600 transition-all"
          title={`Edit ${label}`}
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
      {helpText && (
        <p className="text-gray-500 text-xs">{helpText}</p>
      )}
    </div>
  );
};

// Progress Bar Component for Deal Stages
const DealProgressBar: React.FC<{
  currentStage: string;
  stages: Array<{ id: string; name: string; color: string }>;
  stageHistory: Array<any>;
  onStageClick: (stage: string) => void;
}> = ({ currentStage, stages, stageHistory, onStageClick }) => {
  const currentIndex = stages.findIndex(s => s.id === currentStage);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Deal Progress</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Stage {currentIndex + 1} of {stages.length}</span>
        </div>
      </div>
      
      {/* Horizontal Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const isActive = stage.id === currentStage;
            const isCompleted = index < currentIndex;
            const stageData = stageHistory.find(h => h.toStage === stage.id);
            
            return (
              <div key={stage.id} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => onStageClick(stage.id)}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    isActive 
                      ? `bg-${stage.color}-600 border-${stage.color}-600 text-white shadow-lg` 
                      : isCompleted 
                        ? `bg-green-600 border-green-600 text-white` 
                        : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-25"></div>
                  )}
                </button>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                    {stage.name}
                  </p>
                  {stageData && (
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(stageData.changedAt), 'MMM dd')}
                    </p>
                  )}
                </div>
                {index < stages.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 transform -translate-y-1/2 translate-x-4 ${
                    index < currentIndex ? 'bg-green-600' : 'bg-gray-300'
                  }`} style={{ zIndex: -1 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Stage Duration Info */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <TrendingUp className="h-4 w-4" />
          <span>Avg: 12 days/stage</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>Current: 5 days</span>
        </div>
      </div>
    </div>
  );
};

const AdvancedDealDetailsPage: React.FC<AdvancedDealDetailsPageProps> = ({ dealId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'blocks' | 'timeline'>('blocks');
  
  const queryClient = useQueryClient();

  // Fetch deal data
  const { data: deal, isLoading } = useQuery({
    queryKey: ['/api/deals', dealId],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${dealId}`);
      if (!response.ok) throw new Error('Deal not found');
      return response.json();
    }
  });

  // Fetch related data
  const { data: activities = [] } = useQuery({
    queryKey: ['/api/deals', dealId, 'activities'],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${dealId}/activities`);
      if (!response.ok) return [];
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

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts', 'by-account', deal?.accountId],
    queryFn: async () => {
      if (!deal?.accountId) return [];
      const response = await fetch(`/api/contacts/by-account/${deal.accountId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!deal?.accountId
  });

  // Mutation for updating deal
  const updateDealMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: any }) => {
      const response = await apiRequest(`/api/deals/${dealId}`, {
        method: 'PATCH',
        body: JSON.stringify({ [field]: value }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals', dealId] });
    }
  });

  const handleFieldSave = (field: string, value: any) => {
    updateDealMutation.mutate({ field, value });
  };

  // Mock data for advanced features
  const stages = [
    { id: 'qualification', name: 'Qualification', color: 'blue' },
    { id: 'proposal', name: 'Proposal', color: 'purple' },
    { id: 'negotiation', name: 'Negotiation', color: 'orange' },
    { id: 'closed-won', name: 'Closed Won', color: 'green' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'red' }
  ];

  const mockLineItems = [
    { id: '1', product: 'Platform License', category: 'Software', quantity: 1, unitPrice: 50000, total: 50000, margin: 40 },
    { id: '2', product: 'Implementation', category: 'Services', quantity: 100, unitPrice: 150, total: 15000, margin: 60 },
    { id: '3', product: 'Training', category: 'Services', quantity: 20, unitPrice: 200, total: 4000, margin: 75 }
  ];

  const mockCompetitors = [
    { 
      name: 'Competitor A', 
      strengths: ['Lower price', 'Established brand'], 
      weaknesses: ['Poor support', 'Limited features'] 
    },
    { 
      name: 'Competitor B', 
      strengths: ['Feature rich'], 
      weaknesses: ['Complex setup', 'High maintenance'] 
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Deal Not Found</h2>
          <p className="text-gray-600 mb-4">The requested deal could not be found.</p>
          <Link href="/crm/deals">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Back to Deals
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/crm/deals">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{deal.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Deal #{deal.id.slice(0, 8)}</span>
                  <span>•</span>
                  <span>{account?.name}</span>
                  <span>•</span>
                  <span className="capitalize">{deal.stage?.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  ${Number(deal.value || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {deal.probability || 0}% probability
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isFollowing 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isFollowing ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  <span className="ml-1 hidden sm:inline">
                    {isFollowing ? 'Following' : 'Follow'}
                  </span>
                </button>
                
                <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Share2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-t border-gray-200 -mb-px">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'activities', label: 'Activities', icon: Activity },
                { id: 'communication', label: 'Communication', icon: MessageSquare },
                { id: 'files', label: 'Files', icon: FileText },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Deal Progress Bar */}
            <DealProgressBar
              currentStage={deal.stage}
              stages={stages}
              stageHistory={[]}
              onStageClick={(stage) => handleFieldSave('stage', stage)}
            />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Deal Summary Block */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                    Deal Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <AdvancedEditableField
                        label="Deal Name"
                        value={deal.name}
                        field="name"
                        required
                        icon={<FileText className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Pipeline/Stage"
                        value={deal.stage}
                        field="stage"
                        type="select"
                        options={stages.map(s => ({ value: s.id, label: s.name }))}
                        icon={<TrendingUp className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Deal Value"
                        value={deal.value}
                        field="value"
                        type="currency"
                        required
                        icon={<DollarSign className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <AdvancedEditableField
                        label="Probability"
                        value={deal.probability}
                        field="probability"
                        type="number"
                        helpText="Win probability as percentage (0-100)"
                        icon={<Target className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Expected Close Date"
                        value={deal.expectedCloseDate}
                        field="expectedCloseDate"
                        type="date"
                        required
                        icon={<Calendar className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <div className="space-y-1">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <User className="h-4 w-4 mr-2" />
                          Deal Owner
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {deal.owner?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{deal.owner?.name || 'Unassigned'}</p>
                            <p className="text-xs text-gray-500">{deal.owner?.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Account & Contacts */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Building className="h-4 w-4 mr-2" />
                          Account/Organization
                        </label>
                        <Link href={`/crm/accounts/${account?.id}`}>
                          <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <p className="font-medium text-blue-600">{account?.name}</p>
                            <p className="text-xs text-gray-500">{account?.industry} • {account?.country}</p>
                          </div>
                        </Link>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Users className="h-4 w-4 mr-2" />
                          Contacts ({contacts.length})
                        </label>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {contacts.slice(0, 3).map((contact: any) => (
                            <Link key={contact.id} href={`/crm/contacts/${contact.id}`}>
                              <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                  {contact.firstName?.[0]}{contact.lastName?.[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-blue-600">
                                    {contact.firstName} {contact.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">{contact.role}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                          {contacts.length > 3 && (
                            <p className="text-xs text-gray-500 text-center py-1">
                              +{contacts.length - 3} more contacts
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deal Classification Block */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-purple-600" />
                    Deal Classification
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <AdvancedEditableField
                        label="Deal Type"
                        value={deal.dealType || 'new-business'}
                        field="dealType"
                        type="select"
                        options={[
                          { value: 'new-business', label: 'New Business' },
                          { value: 'existing-customer', label: 'Existing Customer' },
                          { value: 'renewal', label: 'Renewal' },
                          { value: 'upsell', label: 'Upsell' },
                          { value: 'cross-sell', label: 'Cross-sell' }
                        ]}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Source"
                        value={deal.source || 'Direct'}
                        field="source"
                        type="select"
                        options={[
                          { value: 'direct', label: 'Direct' },
                          { value: 'referral', label: 'Referral' },
                          { value: 'marketing', label: 'Marketing Campaign' },
                          { value: 'cold-outreach', label: 'Cold Outreach' },
                          { value: 'trade-show', label: 'Trade Show' },
                          { value: 'partner', label: 'Partner' }
                        ]}
                        onSave={handleFieldSave}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <AdvancedEditableField
                        label="Description"
                        value={deal.description}
                        field="description"
                        type="textarea"
                        helpText="Brief description of the deal opportunity"
                        onSave={handleFieldSave}
                      />
                    </div>
                  </div>
                  
                  {/* Competitors Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <Flag className="h-4 w-4 mr-2" />
                      Competitive Intelligence
                    </h4>
                    
                    <div className="space-y-4">
                      {mockCompetitors.map((competitor, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3">{competitor.name}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-green-700 mb-2">Strengths:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {competitor.strengths.map((strength, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-red-700 mb-2">Weaknesses:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {competitor.weaknesses.map((weakness, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                        <Plus className="h-4 w-4 inline mr-2" />
                        Add Competitor
                      </button>
                    </div>
                  </div>
                </div>

                {/* Financials Block */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-600" />
                    Financials & Line Items
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product/Service
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Margin %
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockLineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.product}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.category}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${item.unitPrice.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${item.total.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.margin && item.margin > 50 ? 'bg-green-100 text-green-800' :
                                item.margin && item.margin > 30 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.margin}%
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={4} className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                            Total Deal Value:
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ${mockLineItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            Avg: {Math.round(mockLineItems.reduce((sum, item) => sum + (item.margin || 0), 0) / mockLineItems.length)}%
                          </td>
                          <td className="px-4 py-4"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <Plus className="h-4 w-4 inline mr-2" />
                      Add Line Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Quote
                    </button>
                  </div>
                </div>

                {/* Deal Health & Insights */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                    Deal Health
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Health</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">Healthy</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Engagement Score</span>
                        <span className="font-medium">85/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Activity Level</span>
                        <span className="font-medium">High</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">AI Insights</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-600">
                          High engagement from decision makers suggests strong buying intent.
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-600">
                          Consider scheduling a follow-up call within 3 days to maintain momentum.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Activities
                  </h3>
                  
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity: any) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'email' ? 'bg-blue-100' :
                          activity.type === 'call' ? 'bg-green-100' :
                          activity.type === 'meeting' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          {activity.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                          {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600" />}
                          {activity.type === 'task' && <CheckSquare className="h-4 w-4 text-orange-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(activity.createdAt), 'MMM dd, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <Link href={`#activities`}>
                      <button 
                        onClick={() => setActiveTab('activities')}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
                      >
                        View All Activities →
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Linked Records */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2 text-gray-600" />
                    Linked Records
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Related Deals</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Enterprise Expansion</p>
                            <p className="text-xs text-gray-500">$75,000 • Negotiation</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Related Leads</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Department B Interest</p>
                            <p className="text-xs text-gray-500">Qualified • Same Account</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm">
                      <Plus className="h-4 w-4 inline mr-2" />
                      Link Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Other tab content would be implemented here */}
        {activeTab === 'activities' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Activities & Tasks</h3>
            <p className="text-gray-600">Activities content would be implemented here...</p>
          </div>
        )}
        
        {activeTab === 'communication' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Communication Timeline</h3>
            <p className="text-gray-600">Communication timeline would be implemented here...</p>
          </div>
        )}
        
        {activeTab === 'files' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Files & Documents</h3>
            <p className="text-gray-600">File management would be implemented here...</p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Deal Analytics</h3>
            <p className="text-gray-600">Analytics dashboard would be implemented here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedDealDetailsPage;