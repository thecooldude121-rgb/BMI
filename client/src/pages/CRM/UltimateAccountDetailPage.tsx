import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Building, ArrowLeft, Edit, MoreVertical, Phone, Mail, Globe, MapPin,
  Users, DollarSign, TrendingUp, Target, Activity, Calendar, FileText,
  Star, AlertTriangle, CheckCircle, Clock, Plus, MessageSquare,
  BarChart3, Zap, Brain, Sparkles, Eye, Filter, Search, Download,
  ExternalLink, RefreshCw, Share, Bookmark, Tag, Settings, Bell,
  ChevronDown, ChevronRight, Grid3X3, List, X, Send, Paperclip,
  ThumbsUp, ThumbsDown, Heart, Flag, Archive, Trash2, Copy,
  Camera, Video, Headphones, Map, Shield, Award, Briefcase,
  ArrowRightLeft, Database, Bot, Link, Linkedin, Twitter
} from 'lucide-react';
import { apiRequest } from '../../lib/queryClient';

// Types
interface Account {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  companySize?: string;
  annualRevenue?: number;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  accountType?: string;
  accountStatus?: string;
  accountSegment?: string;
  healthScore?: number;
  employees?: number;
  foundedYear?: number;
  logoUrl?: string;
  address?: any;
  tags?: string[];
  totalDeals?: number;
  totalRevenue?: number;
  lastContactDate?: string;
  lastActivityDate?: string;
  ownerId?: string;
  owner?: { firstName: string; lastName: string };
  contacts?: Contact[];
  deals?: Deal[];
  activities?: Activity[];
  notes?: Note[];
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  isPrimary?: boolean;
  lastContactDate?: string;
}

interface Deal {
  id: string;
  name: string;
  value?: number;
  stage?: string;
  probability?: number;
  expectedCloseDate?: string;
  status?: string;
  ownerId?: string;
  owner?: { firstName: string; lastName: string };
}

interface Activity {
  id: string;
  type: string;
  subject: string;
  description?: string;
  date: string;
  status?: string;
  ownerId?: string;
  owner?: { firstName: string; lastName: string };
}

interface Note {
  id: string;
  content: string;
  type?: string;
  createdAt: string;
  ownerId?: string;
  owner?: { firstName: string; lastName: string };
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  ownerId?: string;
  owner?: { firstName: string; lastName: string };
}

interface CompanyEnrichmentData {
  website?: string;
  linkedinUrl?: string;
  industry?: string;
  employees?: number;
  annualRevenue?: number;
  foundedYear?: number;
  headquarters?: string;
  phone?: string;
  description?: string;
  technologies?: string[];
  techStack?: string[];
  competitors?: string[];
  fundingStage?: string;
  keyExecutives?: Array<{
    name: string;
    title: string;
    linkedinUrl?: string;
  }>;
  healthScore?: number;
  growthIndicators?: string[];
  marketPresence?: string;
  riskFactors?: string[];
  dataSources?: string[];
  confidence?: number;
  lastEnriched?: Date;
}

interface SyncStatus {
  lastSync?: Date;
  syncHealth: 'healthy' | 'warning' | 'error';
  conflicts?: number;
  pendingUpdates?: number;
  autoSyncEnabled: boolean;
}

const UltimateAccountDetailPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const accountId = params.id;

  // State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [activityType, setActivityType] = useState('call');
  const [activitySubject, setActivitySubject] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [showLeadGenSync, setShowLeadGenSync] = useState(true);
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Data Fetching
  const { data: account, isLoading, error, refetch } = useQuery<Account>({
    queryKey: ['/api/accounts', accountId],
    queryFn: async () => {
      if (!accountId) throw new Error('No account ID provided');
      const response = await fetch(`/api/accounts/${accountId}`);
      if (!response.ok) throw new Error('Failed to fetch account');
      const data = await response.json();
      return data;
    },
    enabled: !!accountId,
  });

  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: ['/api/deals', 'by-account', accountId],
    queryFn: async () => {
      if (!accountId) return [];
      const response = await fetch(`/api/deals/by-account/${accountId}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!accountId,
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['/api/contacts', 'by-account', accountId],
    queryFn: async () => {
      if (!accountId) return [];
      const response = await fetch(`/api/contacts/by-account/${accountId}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!accountId,
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/accounts', accountId, 'activities'],
    queryFn: async () => {
      if (!accountId) return [];
      const response = await fetch(`/api/accounts/${accountId}/activities`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!accountId,
  });

  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ['/api/notes', 'by-account', accountId],
    queryFn: async () => {
      if (!accountId) return [];
      
      // Try account-specific endpoint first, fallback to filtering all notes
      try {
        const response = await fetch(`/api/notes/by-account/${accountId}`);
        if (response.ok) {
          const data = await response.json();
          return Array.isArray(data) ? data : [];
        }
      } catch (error) {
        console.warn('Account-specific notes endpoint not available, using fallback');
      }
      
      // Fallback: get all notes and filter by accountId
      try {
        const response = await fetch('/api/notes');
        if (response.ok) {
          const allNotes = await response.json();
          if (Array.isArray(allNotes)) {
            return allNotes.filter((note: any) => note.accountId === accountId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
      
      return [];
    },
    enabled: !!accountId,
  });

  // Sync Status Query
  const { data: syncStatus } = useQuery<SyncStatus>({
    queryKey: ['/api/accounts', accountId, 'sync-status'],
    queryFn: async () => {
      const response = await fetch(`/api/accounts/${accountId}/sync-status`);
      if (!response.ok) throw new Error('Failed to fetch sync status');
      return response.json();
    },
    enabled: !!accountId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Enrichment Data Query
  const { data: enrichmentData } = useQuery<CompanyEnrichmentData>({
    queryKey: ['/api/accounts', accountId, 'enrichment'],
    queryFn: async () => {
      const response = await fetch(`/api/accounts/${accountId}/enrichment`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!accountId,
  });

  // Mutations
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { content: string; accountId: string }) => {
      return apiRequest('/api/notes', {
        method: 'POST',
        body: JSON.stringify(noteData),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setNoteContent('');
      setShowNoteModal(false);
    }
  });

  const createActivityMutation = useMutation({
    mutationFn: async (activityData: any) => {
      return apiRequest('/api/activities', {
        method: 'POST',
        body: JSON.stringify(activityData),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      setActivitySubject('');
      setActivityDescription('');
      setShowActivityModal(false);
    }
  });

  // Sync Mutations
  const enrichAccountMutation = useMutation({
    mutationFn: async () => {
      setSyncInProgress(true);
      return apiRequest(`/api/accounts/${accountId}/enrich`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts', accountId, 'enrichment'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts', accountId, 'sync-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts', accountId] });
      setSyncInProgress(false);
    },
    onError: () => {
      setSyncInProgress(false);
    }
  });

  const syncToLeadGenMutation = useMutation({
    mutationFn: async () => {
      setSyncInProgress(true);
      return apiRequest(`/api/accounts/${accountId}/sync-to-leadgen`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts', accountId, 'sync-status'] });
      setSyncInProgress(false);
    },
    onError: () => {
      setSyncInProgress(false);
    }
  });

  const syncActivitiesMutation = useMutation({
    mutationFn: async () => {
      setSyncInProgress(true);
      return apiRequest(`/api/accounts/${accountId}/sync-activities`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts', accountId, 'activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts', accountId, 'sync-status'] });
      setSyncInProgress(false);
    },
    onError: () => {
      setSyncInProgress(false);
    }
  });

  // Helper Functions
  const formatCurrency = (amount: number | undefined): string => {
    if (!amount) return 'N/A';
    
    // Format large numbers with abbreviations like the Employees dashboard
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number | undefined): string => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getHealthScoreColor = (score: number | undefined): string => {
    if (!score) return 'text-gray-400 bg-gray-100';
    if (score >= 80) return 'text-green-700 bg-green-100';
    if (score >= 60) return 'text-blue-700 bg-blue-100';
    if (score >= 40) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const getHealthScoreIcon = (score: number | undefined) => {
    if (!score) return AlertTriangle;
    if (score >= 80) return TrendingUp;
    if (score >= 60) return Target;
    if (score >= 40) return AlertTriangle;
    return AlertTriangle;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'task': return CheckCircle;
      case 'note': return FileText;
      default: return Activity;
    }
  };

  const handleBack = () => {
    setLocation('/crm/accounts');
  };

  const handleCreateNote = () => {
    if (noteContent.trim() && account) {
      createNoteMutation.mutate({
        content: noteContent,
        accountId: account.id
      });
    }
  };

  const handleCreateActivity = () => {
    if (activitySubject.trim() && account) {
      createActivityMutation.mutate({
        type: activityType,
        subject: activitySubject,
        description: activityDescription,
        accountId: account.id,
        date: new Date().toISOString()
      });
    }
  };

  // AI Insights (Mock Data - Replace with actual AI implementation)
  const aiInsights = useMemo(() => {
    if (!account) return [];
    
    const insights = [];
    
    // Health Score Analysis
    if (account.healthScore && account.healthScore < 60) {
      insights.push({
        type: 'warning',
        title: 'Account Health Risk',
        description: 'Account health score is below optimal. Consider increasing engagement.',
        confidence: 85,
        action: 'Schedule follow-up call'
      });
    }
    
    // Revenue Opportunity
    if (account.totalDeals && account.totalDeals > 0) {
      insights.push({
        type: 'opportunity',
        title: 'Upsell Potential',
        description: 'Based on deal history, there may be expansion opportunities.',
        confidence: 72,
        action: 'Explore additional products'
      });
    }
    
    // Engagement Insights
    if (account.lastActivityDate) {
      const daysSinceLastActivity = Math.floor(
        (Date.now() - new Date(account.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastActivity > 30) {
        insights.push({
          type: 'action',
          title: 'Re-engagement Needed',
          description: `No activity for ${daysSinceLastActivity} days. Time to reconnect.`,
          confidence: 90,
          action: 'Schedule touchpoint'
        });
      }
    }
    
    return insights;
  }, [account]);

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Not Found</h2>
          <p className="text-gray-600 mb-4">The account you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Accounts
          </button>
        </div>
      </div>
    );
  }

  const HealthIcon = getHealthScoreIcon(account.healthScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-gray-50 overflow-auto"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {account.logoUrl ? (
                  <img 
                    src={account.logoUrl} 
                    alt={account.name || 'Account'}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  (account.name || 'A').charAt(0).toUpperCase()
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  {account.name || 'Unknown Account'}
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreColor(account.healthScore)}`}>
                    <HealthIcon className="w-4 h-4" />
                    <span>Health: {account.healthScore || 'Unknown'}</span>
                  </div>
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  {account.industry && (
                    <span className="bg-gray-100 px-2 py-1 rounded-md">
                      {account.industry}
                    </span>
                  )}
                  {account.accountType && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                      {account.accountType}
                    </span>
                  )}
                  {account.accountStatus && (
                    <span className={`px-2 py-1 rounded-md ${
                      account.accountStatus === 'active' ? 'bg-green-100 text-green-700' :
                      account.accountStatus === 'inactive' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {account.accountStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowInsights(!showInsights)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showInsights 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              data-testid="button-toggle-insights"
            >
              <Brain className="w-4 h-4" />
              AI Insights
            </button>
            
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              data-testid="button-edit"
            >
              <Edit className="w-4 h-4" />
              Edit Account
            </button>
            
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="button-more"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 p-6 transition-all duration-300 ${showInsights ? 'mr-80' : 'mr-0'}`}>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Annual Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(account.annualRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Deals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {account.totalDeals || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(account.employees)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Activity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {account.lastActivityDate 
                      ? Math.floor((Date.now() - new Date(account.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24))
                      : 'N/A'
                    }
                  </p>
                  <p className="text-xs text-gray-500">days ago</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: Building },
                  { id: 'leadgen-sync', label: 'LeadGen Sync', icon: ArrowRightLeft },
                  { id: 'contacts', label: 'Contacts', icon: Users },
                  { id: 'deals', label: 'Deals', icon: Target },
                  { id: 'activities', label: 'Activities', icon: Activity },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'documents', label: 'Documents', icon: Paperclip }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      data-testid={`tab-${tab.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.id === 'contacts' && Array.isArray(contacts) && contacts.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {contacts.length}
                        </span>
                      )}
                      {tab.id === 'deals' && Array.isArray(deals) && deals.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {deals.length}
                        </span>
                      )}
                      {tab.id === 'activities' && Array.isArray(activities) && activities.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {activities.length}
                        </span>
                      )}
                      {tab.id === 'notes' && Array.isArray(notes) && notes.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {notes.length}
                        </span>
                      )}
                      {tab.id === 'leadgen-sync' && syncStatus?.syncHealth === 'error' && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                          Error
                        </span>
                      )}
                      {tab.id === 'leadgen-sync' && syncStatus?.pendingUpdates && syncStatus.pendingUpdates > 0 && (
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                          {syncStatus.pendingUpdates} Pending
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                          
                          {account?.description && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Description</label>
                              <p className="text-gray-900 mt-1">{account.description}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4">
                            {account?.foundedYear && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Founded</label>
                                <p className="text-gray-900 mt-1">{account.foundedYear}</p>
                              </div>
                            )}
                            
                            {account?.companySize && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Company Size</label>
                                <p className="text-gray-900 mt-1">{account.companySize}</p>
                              </div>
                            )}
                          </div>
                          
                          {account.tags && account.tags.length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                              <div className="flex flex-wrap gap-2">
                                {account.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                          
                          {account?.website && (
                            <div className="flex items-center space-x-3">
                              <Globe className="w-5 h-5 text-gray-400" />
                              <div>
                                <label className="text-sm font-medium text-gray-700">Website</label>
                                <a 
                                  href={account.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 block"
                                >
                                  {account.website}
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {account?.phone && (
                            <div className="flex items-center space-x-3">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <div>
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <p className="text-gray-900">{account.phone}</p>
                              </div>
                            </div>
                          )}
                          
                          {account?.email && (
                            <div className="flex items-center space-x-3">
                              <Mail className="w-5 h-5 text-gray-400" />
                              <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <p className="text-gray-900">{account.email}</p>
                              </div>
                            </div>
                          )}
                          
                          {account?.address && (
                            <div className="flex items-center space-x-3">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <div>
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <p className="text-gray-900">
                                  {account.address.street && `${account.address.street}, `}
                                  {account.address.city && `${account.address.city}, `}
                                  {account.address.state && `${account.address.state} `}
                                  {account.address.zipCode}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {account?.owner && (
                            <div className="flex items-center space-x-3">
                              <Users className="w-5 h-5 text-gray-400" />
                              <div>
                                <label className="text-sm font-medium text-gray-700">Account Owner</label>
                                <p className="text-gray-900">
                                  {account.owner.firstName} {account.owner.lastName}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LeadGen Sync Tab */}
                  {activeTab === 'leadgen-sync' && (
                    <div className="space-y-6">
                      {/* Sync Status Overview */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                            LeadGen Synchronization
                          </h3>
                          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            syncStatus?.syncHealth === 'healthy' ? 'bg-green-100 text-green-700' :
                            syncStatus?.syncHealth === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {syncStatus?.syncHealth === 'healthy' ? '✓ Healthy' :
                             syncStatus?.syncHealth === 'warning' ? '⚠ Warning' : '✗ Error'}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">Last Sync</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {syncStatus?.lastSync ? 
                                new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                                  Math.floor((new Date(syncStatus.lastSync).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                                  'day'
                                ) : 'Never'}
                            </p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Database className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">Data Quality</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {enrichmentData?.confidence || 75}% Confident
                            </p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">AI Enhancement</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {enrichmentData ? 'Active' : 'Available'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sync Actions */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <RefreshCw className="w-5 h-5 text-indigo-600" />
                          Sync Actions
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => enrichAccountMutation.mutate()}
                            disabled={syncInProgress || enrichAccountMutation.isPending}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                          >
                            {syncInProgress || enrichAccountMutation.isPending ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Enrich Data
                          </button>
                          
                          <button
                            onClick={() => syncToLeadGenMutation.mutate()}
                            disabled={syncInProgress || syncToLeadGenMutation.isPending}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                          >
                            {syncInProgress || syncToLeadGenMutation.isPending ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <ArrowRightLeft className="w-4 h-4" />
                            )}
                            Sync to LeadGen
                          </button>
                          
                          <button
                            onClick={() => syncActivitiesMutation.mutate()}
                            disabled={syncInProgress || syncActivitiesMutation.isPending}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                          >
                            {syncInProgress || syncActivitiesMutation.isPending ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Activity className="w-4 h-4" />
                            )}
                            Sync Activities
                          </button>
                        </div>
                      </div>

                      {/* Enrichment Data Display */}
                      {enrichmentData && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Database className="w-5 h-5 text-green-600" />
                            Enhanced Company Intelligence
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Details */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                              <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-600" />
                                Company Details
                              </h5>
                              <div className="space-y-3">
                                {enrichmentData.industry && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Industry:</span>
                                    <span className="font-medium">{enrichmentData.industry}</span>
                                  </div>
                                )}
                                {enrichmentData.employees && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Employees:</span>
                                    <span className="font-medium">{formatNumber(enrichmentData.employees)}</span>
                                  </div>
                                )}
                                {enrichmentData.annualRevenue && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Revenue:</span>
                                    <span className="font-medium">{formatCurrency(enrichmentData.annualRevenue)}</span>
                                  </div>
                                )}
                                {enrichmentData.foundedYear && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Founded:</span>
                                    <span className="font-medium">{enrichmentData.foundedYear}</span>
                                  </div>
                                )}
                                {enrichmentData.headquarters && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">HQ:</span>
                                    <span className="font-medium text-right">{enrichmentData.headquarters}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Technology Stack */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                              <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-600" />
                                Technology Stack
                              </h5>
                              {enrichmentData.techStack && enrichmentData.techStack.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {enrichmentData.techStack.map((tech, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">No technology stack data available</p>
                              )}
                            </div>
                          </div>

                          {/* Growth Indicators */}
                          {enrichmentData.growthIndicators && enrichmentData.growthIndicators.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                              <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                Growth Indicators
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {enrichmentData.growthIndicators.map((indicator, index) => (
                                  <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-gray-700">{indicator}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Data Sources */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-600">Data Sources:</span>
                                <div className="flex gap-1">
                                  {enrichmentData.dataSources?.map((source, index) => (
                                    <span key={index} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border">
                                      {source}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                Last updated: {enrichmentData.lastEnriched ? 
                                  new Date(enrichmentData.lastEnriched).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Links to LeadGen */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Link className="w-5 h-5 text-indigo-600" />
                          Related LeadGen Actions
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => setLocation('/lead-generation')}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View in LeadGen Module
                          </button>
                          <button
                            onClick={() => setLocation(`/lead-generation/companies/${account?.domain}`)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Building className="w-4 h-4" />
                            Company Detail Page
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contacts Tab */}
                  {activeTab === 'contacts' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Contacts ({Array.isArray(contacts) ? contacts.length : 0})</h3>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Add Contact
                        </button>
                      </div>
                      
                      {Array.isArray(contacts) && contacts.length > 0 ? (
                        <div className="space-y-4">
                          {contacts.map(contact => (
                            <div
                              key={contact.id}
                              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    {(contact.firstName || 'F').charAt(0)}{(contact.lastName || 'L').charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-semibold text-gray-900">
                                        {contact.firstName || 'Unknown'} {contact.lastName || 'Contact'}
                                      </h4>
                                      {contact.isPrimary && (
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                          Primary
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {contact.title && `${contact.title} • `}
                                      {contact.department}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                      {contact.email && (
                                        <span className="flex items-center space-x-1">
                                          <Mail className="w-3 h-3" />
                                          <span>{contact.email}</span>
                                        </span>
                                      )}
                                      {contact.phone && (
                                        <span className="flex items-center space-x-1">
                                          <Phone className="w-3 h-3" />
                                          <span>{contact.phone}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h4>
                          <p className="text-gray-600 mb-4">Add contacts to start building relationships</p>
                          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Add First Contact
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deals Tab */}
                  {activeTab === 'deals' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Deals ({Array.isArray(deals) ? deals.length : 0})</h3>
                        <button 
                          onClick={() => setLocation('/crm/deals/create')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Create Deal
                        </button>
                      </div>
                      
                      {Array.isArray(deals) && deals.length > 0 ? (
                        <div className="space-y-4">
                          {deals.map(deal => (
                            <div
                              key={deal.id}
                              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => setLocation(`/crm/deals/${deal.id}`)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">{deal.name}</h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center space-x-1">
                                      <DollarSign className="w-3 h-3" />
                                      <span>{formatCurrency(deal.value)}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <Target className="w-3 h-3" />
                                      <span>{deal.stage}</span>
                                    </span>
                                    {deal.probability && (
                                      <span className="flex items-center space-x-1">
                                        <BarChart3 className="w-3 h-3" />
                                        <span>{deal.probability}%</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">
                                    {deal.expectedCloseDate && (
                                      <>Expected: {new Date(deal.expectedCloseDate).toLocaleDateString()}</>
                                    )}
                                  </div>
                                  {deal.owner && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      {deal.owner.firstName} {deal.owner.lastName}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h4>
                          <p className="text-gray-600 mb-4">Create deals to track sales opportunities</p>
                          <button 
                            onClick={() => setLocation('/crm/deals/create')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Create First Deal
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Activities Tab */}
                  {activeTab === 'activities' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Activities ({Array.isArray(activities) ? activities.length : 0})</h3>
                        <button 
                          onClick={() => setShowActivityModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Log Activity
                        </button>
                      </div>
                      
                      {Array.isArray(activities) && activities.length > 0 ? (
                        <div className="space-y-4">
                          {activities.map(activity => {
                            const ActivityIcon = getActivityIcon(activity.type);
                            return (
                              <div
                                key={activity.id}
                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-start space-x-4">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ActivityIcon className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold text-gray-900">{activity.subject}</h4>
                                      <span className="text-sm text-gray-500">
                                        {new Date(activity.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {activity.description && (
                                      <p className="text-gray-600 mt-1">{activity.description}</p>
                                    )}
                                    <div className="flex items-center space-x-4 mt-2">
                                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                        {activity.type}
                                      </span>
                                      {activity.owner && (
                                        <span className="text-sm text-gray-500">
                                          by {activity.owner.firstName} {activity.owner.lastName}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h4>
                          <p className="text-gray-600 mb-4">Log activities to track engagement</p>
                          <button 
                            onClick={() => setShowActivityModal(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Log First Activity
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === 'notes' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Notes ({Array.isArray(notes) ? notes.length : 0})</h3>
                        <button 
                          onClick={() => setShowNoteModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Note
                        </button>
                      </div>
                      
                      {Array.isArray(notes) && notes.length > 0 ? (
                        <div className="space-y-4">
                          {notes.map(note => (
                            <div
                              key={note.id}
                              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-gray-900 mb-2">{note.content}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                    {note.owner && (
                                      <span>by {note.owner.firstName} {note.owner.lastName}</span>
                                    )}
                                  </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h4>
                          <p className="text-gray-600 mb-4">Add notes to capture important information</p>
                          <button 
                            onClick={() => setShowNoteModal(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add First Note
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Documents Tab */}
                  {activeTab === 'documents' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Upload Document
                        </button>
                      </div>
                      
                      <div className="text-center py-8">
                        <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h4>
                        <p className="text-gray-600 mb-4">Upload documents to share with your team</p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Upload First Document
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <AnimatePresence>
          {showInsights && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="fixed right-0 top-14 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-40 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Insights
                  </h3>
                  <button
                    onClick={() => setShowInsights(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                        insight.type === 'opportunity' ? 'bg-green-50 border-green-400' :
                        'bg-blue-50 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.confidence >= 80 ? 'bg-green-100 text-green-700' :
                          insight.confidence >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {insight.confidence}%
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        {insight.action} →
                      </button>
                    </motion.div>
                  ))}
                  
                  {aiInsights.length === 0 && (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No insights yet</h4>
                      <p className="text-gray-600">AI insights will appear as data accumulates</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Activity Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Activity</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="task">Task</option>
                    <option value="note">Note</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={activitySubject}
                    onChange={(e) => setActivitySubject(e.target.value)}
                    placeholder="Enter activity subject..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={activityDescription}
                    onChange={(e) => setActivityDescription(e.target.value)}
                    placeholder="Enter activity description..."
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateActivity}
                  disabled={!activitySubject.trim() || createActivityMutation.isPending}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createActivityMutation.isPending ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Note</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note Content</label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Enter your note..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  disabled={!noteContent.trim() || createNoteMutation.isPending}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createNoteMutation.isPending ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UltimateAccountDetailPage;