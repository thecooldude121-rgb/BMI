import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation } from 'wouter';
import { 
  Building, ArrowLeft, Edit, Save, X, Plus, FileText, Users, DollarSign,
  Phone, Mail, Globe, MapPin, Calendar, Activity, Target, TrendingUp,
  AlertTriangle, CheckCircle, ExternalLink, Linkedin, Twitter, Share2,
  MoreHorizontal, Download, Upload, Archive, Trash2, Star, Award,
  BarChart3, PieChart, Zap, Brain, Settings, Eye, Link, User, Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { GrowthRecommendations } from '@/components/GrowthRecommendations';

interface Account {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  companySize?: string;
  annualRevenue?: string;
  website?: string;
  phone?: string;
  description?: string;
  address?: any;
  accountType?: string;
  accountStatus?: string;
  accountSegment?: string;
  parentAccountId?: string;
  employees?: number;
  foundedYear?: number;
  stockSymbol?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  healthScore?: number;
  customerSince?: string;
  lastActivityDate?: string;
  logoUrl?: string;
  technologies?: any[];
  socialMedia?: any;
  competitors?: any[];
  ownerId?: string;
  tags?: string[];
  customFields?: any;
  totalDeals?: number;
  totalRevenue?: string;
  averageDealSize?: string;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  contacts?: any[];
  deals?: any[];
  leads?: any[];
  documents?: any[];
}

const AccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState<Partial<Account>>({});
  const [activeTab, setActiveTab] = useState('overview');

  const queryClient = useQueryClient();

  // Fetch account data
  const { data: account, isLoading, error } = useQuery({
    queryKey: ['/api/accounts', id],
    queryFn: () => apiRequest(`/api/accounts/${id}`),
    enabled: !!id,
  });

  // Fetch account health
  const { data: health } = useQuery({
    queryKey: ['/api/accounts', id, 'health'],
    queryFn: () => apiRequest(`/api/accounts/${id}/health`),
    enabled: !!id,
  });

  // Fetch account metrics
  const { data: metrics } = useQuery({
    queryKey: ['/api/accounts', id, 'metrics'],
    queryFn: () => apiRequest(`/api/accounts/${id}/metrics`),
    enabled: !!id,
  });

  // Fetch Lead Generation company data for synchronization
  const { data: leadGenData } = useQuery({
    queryKey: ['/api/leadgen/companies', account?.domain],
    queryFn: () => apiRequest(`/api/leadgen/companies/by-domain/${account?.domain}`),
    enabled: !!account?.domain,
  });

  // Fetch enriched company insights from Lead Generation
  const { data: companyInsights } = useQuery({
    queryKey: ['/api/leadgen/insights', account?.domain],
    queryFn: () => apiRequest(`/api/leadgen/insights/${account?.domain}`),
    enabled: !!account?.domain,
  });

  // Update account mutation
  const updateAccountMutation = useMutation({
    mutationFn: (data: Partial<Account>) => apiRequest(`/api/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      setIsEditing(false);
      setEditedAccount({});
    },
  });

  // Fetch account-specific deals from CRM deals module
  const { data: allDeals = [] } = useQuery({
    queryKey: ['/api/deals'],
  });

  // Fetch account-specific contacts from CRM contacts module
  const { data: allContacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
  });

  // Fetch account-specific activities
  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
  });

  // Filter data specific to this account
  const accountDeals = allDeals.filter((deal: any) => deal.accountId === id);
  const accountContacts = allContacts.filter((contact: any) => contact.accountId === id);
  const accountActivities = activities.filter((activity: any) => activity.accountId === id);

  // Lead Generation sync mutation
  const syncToLeadGenMutation = useMutation({
    mutationFn: () => apiRequest(`/api/accounts/${id}/sync-to-leadgen`, {
      method: 'POST'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leadgen/companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leadgen/insights'] });
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
  });

  useEffect(() => {
    if (account) {
      setEditedAccount(account);
    }
  }, [account]);

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Account</h3>
          <p className="text-red-600 mt-1">{String(error) || 'Account not found'}</p>
        </div>
      </div>
    );
  }

  const getHealthStatus = () => {
    const score = account?.healthScore || 0;
    if (score >= 80) return { status: 'excellent', color: 'text-green-600 bg-green-100', icon: CheckCircle };
    if (score >= 60) return { status: 'good', color: 'text-blue-600 bg-blue-100', icon: TrendingUp };
    if (score >= 40) return { status: 'at_risk', color: 'text-yellow-600 bg-yellow-100', icon: AlertTriangle };
    return { status: 'critical', color: 'text-red-600 bg-red-100', icon: AlertTriangle };
  };

  const handleSave = () => {
    updateAccountMutation.mutate(editedAccount);
  };

  const handleCancel = () => {
    setEditedAccount(account);
    setIsEditing(false);
  };

  const renderEditableField = (field: keyof Account, label: string, type: 'text' | 'email' | 'url' | 'tel' | 'number' | 'textarea' = 'text') => {
    const value = editedAccount[field] as string || '';
    
    if (isEditing) {
      if (type === 'textarea') {
        return (
          <textarea
            value={value}
            onChange={(e) => setEditedAccount(prev => ({ ...prev, [field]: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        );
      }
      return (
        <input
          type={type}
          value={value}
          onChange={(e) => setEditedAccount(prev => ({ ...prev, [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );
    }

    if (type === 'email' && value) {
      return <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
    }
    if (type === 'url' && value) {
      return <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">{value} <ExternalLink className="w-3 h-3 ml-1" /></a>;
    }
    if (type === 'tel' && value) {
      return <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;
    }

    return <span className="text-gray-900">{value || 'Not provided'}</span>;
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation('/crm/accounts')}
              className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              {account?.logoUrl ? (
                <img src={account.logoUrl} alt={account.name} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{account?.name || 'Loading...'}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-gray-600">{account?.industry || 'Unknown'}</span>
                  <div className={`px-2 py-1 rounded-full ${healthStatus.color} flex items-center space-x-1`}>
                    <HealthIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{account?.healthScore || 0}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account?.accountType === 'customer' ? 'bg-green-100 text-green-700' :
                    account?.accountType === 'prospect' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {account?.accountType || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={updateAccountMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateAccountMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => syncToLeadGenMutation.mutate()}
                  disabled={syncToLeadGenMutation.isPending}
                  className="border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center disabled:opacity-50"
                >
                  {syncToLeadGenMutation.isPending ? (
                    <Brain className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4 mr-2" />
                  )}
                  {syncToLeadGenMutation.isPending ? 'Syncing...' : 'Sync Lead Gen'}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button className="text-gray-600 hover:text-gray-900 p-2">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Lead Gen Sync Status */}
        {leadGenData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Lead Generation Data Synchronized</h3>
                  <p className="text-xs text-blue-700">
                    Enriched with company intelligence • Last synced: {syncStatusData?.lastSyncAt ? new Date(syncStatusData.lastSyncAt).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {leadGenData.technologies && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {leadGenData.technologies.length} Technologies
                  </span>
                )}
                {leadGenData.executives && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {leadGenData.executives.length} Executives
                  </span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  syncStatusData?.status === 'synced' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {syncStatusData?.status === 'synced' ? 'Synced' : 'Partial'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium text-sm">Total Deals</p>
                <p className="text-blue-900 text-xl font-bold">{metrics?.totalDeals || 0}</p>
              </div>
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium text-sm">Annual Revenue</p>
                <p className="text-green-900 text-xl font-bold">
                  ${leadGenData?.annualRevenue ? `${leadGenData.annualRevenue}M` : parseFloat(metrics?.totalRevenue || '0').toLocaleString()}
                </p>
                {leadGenData?.annualRevenue && (
                  <div className="flex items-center mt-1">
                    <Brain className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">Lead Gen Data</span>
                  </div>
                )}
              </div>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium text-sm">Industry</p>
                <p className="text-purple-900 text-lg font-bold">
                  {leadGenData?.industry || account?.industry || 'Unknown'}
                </p>
                {leadGenData?.technologies && leadGenData.technologies.length > 0 && (
                  <div className="flex items-center mt-1">
                    <Brain className="w-3 h-3 text-purple-600 mr-1" />
                    <span className="text-xs text-purple-600">{leadGenData.technologies.length} Tech Stack</span>
                  </div>
                )}
              </div>
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 font-medium text-sm">Employees</p>
                <p className="text-orange-900 text-xl font-bold">
                  {leadGenData?.employeeCount || account?.employees || 'Unknown'}
                </p>
                {leadGenData && (
                  <div className="flex items-center mt-1">
                    <Brain className="w-3 h-3 text-orange-600 mr-1" />
                    <span className="text-xs text-orange-600">Lead Gen Data</span>
                  </div>
                )}
              </div>
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: Building },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'deals', label: 'Deals', icon: Target },
            { id: 'activities', label: 'Activities', icon: Activity },
            { id: 'growth', label: 'AI Growth', icon: Brain },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'hierarchy', label: 'Hierarchy', icon: Link },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-2" />
                {tab.label}
                {tab.id === 'contacts' && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {accountContacts.length}
                  </span>
                )}
                {tab.id === 'deals' && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {accountDeals.length}
                  </span>
                )}
                {tab.id === 'activities' && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {accountActivities.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    {renderEditableField('name', 'Company Name')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                    {renderEditableField('domain', 'Domain')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    {renderEditableField('website', 'Website', 'url')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {renderEditableField('phone', 'Phone', 'tel')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    {renderEditableField('industry', 'Industry')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                    {renderEditableField('companySize', 'Company Size')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
                    {renderEditableField('annualRevenue', 'Annual Revenue')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                    {renderEditableField('employees', 'Employees', 'number')}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    {renderEditableField('description', 'Description', 'textarea')}
                  </div>
                </div>
              </div>

              {/* Social Media & Links */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media & Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    {renderEditableField('linkedinUrl', 'LinkedIn URL', 'url')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Handle</label>
                    {renderEditableField('twitterHandle', 'Twitter Handle')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Symbol</label>
                    {renderEditableField('stockSymbol', 'Stock Symbol')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                    {renderEditableField('foundedYear', 'Founded Year', 'number')}
                  </div>
                </div>
              </div>
            </div>

            {/* Health & Insights Sidebar */}
            <div className="space-y-6">
              {/* Health Score */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Health</h3>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${healthStatus.color} mb-4`}>
                    <HealthIcon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{account.healthScore || 0}</div>
                  <div className="text-sm text-gray-600 capitalize">{healthStatus.status.replace('_', ' ')}</div>
                </div>
                
                {health?.factors && health.factors.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium text-gray-900">Contributing Factors:</h4>
                    {health.factors.map((factor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{factor.value}</span>
                        <span className={`font-medium ${factor.impact.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {factor.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-3 text-blue-600" />
                    <span>Create Deal</span>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Users className="w-4 h-4 mr-3 text-green-600" />
                    <span>Add Contact</span>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-purple-600" />
                    <span>Schedule Meeting</span>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <FileText className="w-4 h-4 mr-3 text-orange-600" />
                    <span>Upload Document</span>
                  </button>
                </div>
              </div>

              {/* Lead Generation Insights */}
              {leadGenData && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    Lead Intelligence
                  </h3>
                  
                  {leadGenData.industry && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Industry:</span>
                      <span className="text-sm text-gray-600 ml-2">{leadGenData.industry}</span>
                    </div>
                  )}
                  
                  {leadGenData.employeeCount && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Employee Range:</span>
                      <span className="text-sm text-gray-600 ml-2">{leadGenData.employeeCount}</span>
                    </div>
                  )}
                  
                  {leadGenData.revenue && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Revenue:</span>
                      <span className="text-sm text-gray-600 ml-2">{leadGenData.revenue}</span>
                    </div>
                  )}
                  
                  {/* Technology Stack */}
                  {leadGenData.technologies && leadGenData.technologies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <Settings className="w-4 h-4 mr-1" />
                        Technology Stack ({leadGenData.technologies.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {leadGenData.technologies.slice(0, 6).map((tech: string, index: number) => (
                          <div key={index} className="bg-white border border-blue-200 px-3 py-2 rounded-lg">
                            <div className="text-xs font-medium text-blue-900">{tech}</div>
                          </div>
                        ))}
                        {leadGenData.technologies.length > 6 && (
                          <div className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-medium">
                              +{leadGenData.technologies.length - 6} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Executives */}
                  {leadGenData.executives && leadGenData.executives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Key Executives ({leadGenData.executives.length})
                      </h4>
                      <div className="space-y-2">
                        {leadGenData.executives.slice(0, 3).map((exec: any, index: number) => (
                          <div key={index} className="bg-white border border-blue-200 px-3 py-2 rounded-lg flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{exec.name}</div>
                              <div className="text-xs text-gray-600">{exec.title}</div>
                            </div>
                          </div>
                        ))}
                        {leadGenData.executives.length > 3 && (
                          <div className="text-xs text-blue-600 font-medium">
                            +{leadGenData.executives.length - 3} more executives
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {leadGenData.lastSynced && (
                    <div className="text-xs text-gray-500 border-t pt-2 mt-3 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Last synced: {new Date(leadGenData.lastSynced).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}

              {/* Company Insights */}
              {companyInsights && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Market Intelligence
                  </h3>
                  
                  {companyInsights.confidence && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Data Confidence</span>
                        <span className="text-sm text-gray-600">{companyInsights.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${companyInsights.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {companyInsights.growth && companyInsights.growth.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 block mb-1">Growth Signals:</span>
                      <div className="space-y-1">
                        {companyInsights.growth.slice(0, 2).map((signal: string, index: number) => (
                          <div key={index} className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                            {signal}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {companyInsights.funding && companyInsights.funding.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 block mb-1">Funding:</span>
                      <div className="text-xs text-gray-600">
                        {companyInsights.funding[0].round} - {companyInsights.funding[0].amount}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {account.tags && account.tags.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {account.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Growth Recommendations Tab */}
        {activeTab === 'growth' && (
          <GrowthRecommendations accountId={id!} />
        )}

        {/* Other tab content would go here */}
        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Account Deals</h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {accountDeals.length} deals
              </span>
            </div>
            
            {accountDeals.length > 0 ? (
              <div className="space-y-4">
                {accountDeals.map((deal: any) => (
                  <div key={deal.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{deal.name}</h4>
                        <p className="text-sm text-gray-600">Stage: {deal.stage}</p>
                        <p className="text-sm text-gray-500">Close Date: {new Date(deal.closeDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${deal.value?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{deal.probability}% probability</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Deals Found</h3>
                <p className="text-gray-500">This account doesn't have any deals yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Account Contacts</h3>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {accountContacts.length} contacts
              </span>
            </div>
            
            {accountContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accountContacts.map((contact: any) => (
                  <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</h4>
                        <p className="text-sm text-gray-600">{contact.title}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Contacts Found</h3>
                <p className="text-gray-500">This account doesn't have any contacts yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Account Activities</h3>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {accountActivities.length} activities
              </span>
            </div>
            
            {accountActivities.length > 0 ? (
              <div className="space-y-4">
                {accountActivities.slice(0, 10).map((activity: any) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                        <p className="text-sm text-gray-600">{activity.type}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
                <p className="text-gray-500">This account doesn't have any activities yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === 'documents' || activeTab === 'hierarchy') && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="py-12">
              <div className="text-gray-400 mb-4">
                {activeTab === 'documents' && <FileText className="w-12 h-12 mx-auto" />}
                {activeTab === 'hierarchy' && <Link className="w-12 h-12 mx-auto" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 capitalize">{activeTab} View</h3>
              <p className="text-gray-500">
                Comprehensive {activeTab} management and insights coming soon...
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AccountDetailPage;