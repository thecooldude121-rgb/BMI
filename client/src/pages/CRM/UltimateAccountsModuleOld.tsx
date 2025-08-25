import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Fuse from 'fuse.js';
import { 
  Building, Search, Filter, Plus, MoreVertical, Users, DollarSign, 
  TrendingUp, Target, Grid3X3, List, BarChart3, Eye, Edit, Trash2,
  Phone, Mail, Globe, MapPin, Star, AlertTriangle, Brain, Sparkles,
  ChevronDown, Download, RefreshCw, Settings, Zap, Activity,
  Calendar, FileText, CheckSquare, Square, ArrowUpDown, SlidersHorizontal,
  Copy, GitMerge, Shield, Trash, AlertCircle
} from 'lucide-react';
import { apiRequest } from '../../lib/queryClient';
import AccountMergeWizard from '../../components/AccountMergeWizard';

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
  contacts?: any[];
  deals?: any[];
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  searchTerm: string;
  industry: string;
  accountType: string;
  accountStatus: string;
  accountSegment: string;
  companySize: string;
  healthScore: string;
  revenueRange: string;
  owner: string;
  tags: string[];
}

interface ViewMode {
  type: 'grid' | 'list' | 'kanban' | 'analytics';
  density: 'compact' | 'comfortable' | 'spacious';
  columns: string[];
}

const UltimateAccountsModule: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // State Management
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    industry: 'all',
    accountType: 'all',
    accountStatus: 'all',
    accountSegment: 'all',
    companySize: 'all',
    healthScore: 'all',
    revenueRange: 'all',
    owner: 'all',
    tags: []
  });

  const [viewMode, setViewMode] = useState<ViewMode>({
    type: 'grid',
    density: 'comfortable',
    columns: ['name', 'industry', 'revenue', 'deals', 'health', 'lastActivity']
  });

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showMergeWizard, setShowMergeWizard] = useState(false);
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc'
  });

  // Data Fetching
  const { data: accounts = [], isLoading, error, refetch } = useQuery<Account[]>({
    queryKey: ['/api/accounts'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Duplicate Management Data
  const { data: duplicatesData } = useQuery<any>({
    queryKey: ['/api/accounts/duplicates'],
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const cleanupDuplicates = useMutation({
    mutationFn: () => apiRequest('/api/accounts/duplicates/cleanup', {
      method: 'POST',
      body: { autoCleanup: true }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/duplicates'] });
    }
  });

  // Helper Functions (moved before usage)
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  };

  const matchesHealthScore = (score: number | undefined, filter: string): boolean => {
    if (!score) return filter === 'unknown';
    switch (filter) {
      case 'excellent': return score >= 80;
      case 'good': return score >= 60 && score < 80;
      case 'at_risk': return score >= 40 && score < 60;
      case 'critical': return score < 40;
      default: return true;
    }
  };

  const matchesRevenueRange = (revenue: number | undefined, filter: string): boolean => {
    if (!revenue) return filter === 'unknown';
    switch (filter) {
      case 'startup': return revenue < 1000000;
      case 'small': return revenue >= 1000000 && revenue < 10000000;
      case 'medium': return revenue >= 10000000 && revenue < 100000000;
      case 'large': return revenue >= 100000000;
      default: return true;
    }
  };

  // AI-Powered Fuzzy Search Setup
  const fuse = useMemo(() => {
    if (!accounts.length) return null;
    
    return new Fuse(accounts, {
      keys: [
        { name: 'name', weight: 0.3 },
        { name: 'domain', weight: 0.2 },
        { name: 'industry', weight: 0.15 },
        { name: 'description', weight: 0.15 },
        { name: 'tags', weight: 0.1 },
        { name: 'accountType', weight: 0.05 },
        { name: 'accountSegment', weight: 0.05 }
      ],
      threshold: 0.4,
      includeScore: true,
      shouldSort: true,
    });
  }, [accounts]);

  // Filtered and Sorted Data
  const processedAccounts = useMemo(() => {
    let filtered = accounts;

    // Apply AI search if search term exists
    if (filters.searchTerm && fuse) {
      const results = fuse.search(filters.searchTerm);
      filtered = results.map(result => result.item);
    }

    // Apply filters
    filtered = filtered.filter((account: Account) => {
      return (
        (filters.industry === 'all' || account.industry === filters.industry) &&
        (filters.accountType === 'all' || account.accountType === filters.accountType) &&
        (filters.accountStatus === 'all' || account.accountStatus === filters.accountStatus) &&
        (filters.accountSegment === 'all' || account.accountSegment === filters.accountSegment) &&
        (filters.companySize === 'all' || account.companySize === filters.companySize) &&
        (filters.owner === 'all' || account.ownerId === filters.owner) &&
        (filters.healthScore === 'all' || matchesHealthScore(account.healthScore, filters.healthScore)) &&
        (filters.revenueRange === 'all' || matchesRevenueRange(account.annualRevenue, filters.revenueRange)) &&
        (filters.tags.length === 0 || filters.tags.some(tag => account.tags?.includes(tag)))
      );
    });

    // Apply sorting
    filtered.sort((a: Account, b: Account) => {
      const aVal = getNestedValue(a, sortBy.field);
      const bVal = getNestedValue(b, sortBy.field);
      
      if (aVal === bVal) return 0;
      const comparison = aVal > bVal ? 1 : -1;
      return sortBy.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [accounts, filters, sortBy, fuse]);

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount) return 'N/A';
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
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreIcon = (score: number | undefined) => {
    if (!score) return AlertTriangle;
    if (score >= 80) return TrendingUp;
    if (score >= 60) return Target;
    if (score >= 40) return AlertTriangle;
    return AlertTriangle;
  };

  // Event Handlers
  const handleAccountClick = (accountId: string) => {
    setLocation(`/crm/accounts/${accountId}`);
  };

  const handleCreateAccount = () => {
    setLocation('/crm/accounts/create');
  };

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === processedAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(processedAccounts.map(account => account.id));
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      industry: 'all',
      accountType: 'all',
      accountStatus: 'all',
      accountSegment: 'all',
      companySize: 'all',
      healthScore: 'all',
      revenueRange: 'all',
      owner: 'all',
      tags: []
    });
  };

  // Available Options for Filters
  const industries = [
    'technology', 'healthcare', 'finance', 'education', 'manufacturing',
    'retail', 'real_estate', 'consulting', 'media', 'transportation',
    'energy', 'agriculture', 'biotechnology', 'fashion', 'other'
  ];

  const accountTypes = ['prospect', 'customer', 'partner', 'vendor', 'competitor', 'former_customer'];
  const accountStatuses = ['active', 'inactive', 'suspended', 'churned', 'potential'];
  const accountSegments = ['enterprise', 'mid_market', 'smb', 'startup', 'government', 'non_profit'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  // Loading State
  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-gray-50"
    >
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Stats */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Accounts
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h1>
              <p className="text-sm text-gray-600">
                {processedAccounts.length} of {accounts.length} accounts • 
                {selectedAccounts.length > 0 && ` ${selectedAccounts.length} selected • `}
                Total Revenue: {formatCurrency(accounts.reduce((sum: number, acc: Account) => sum + (acc.totalRevenue || 0), 0))}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              data-testid="button-filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {Object.values(filters).some(v => v !== 'all' && v !== '' && (!Array.isArray(v) || v.length > 0)) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                data-testid="button-view-options"
              >
                <Settings className="w-4 h-4" />
                View
              </button>
            </div>

            <button
              onClick={handleCreateAccount}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              data-testid="button-create-account"
            >
              <Plus className="w-4 h-4" />
              Create Account
            </button>
          </div>
        </div>
        
        {/* Duplicate Management Alert */}
        {duplicatesData && duplicatesData.totalDuplicateGroups > 0 && (
          <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">
                    Duplicate Accounts Detected
                  </h3>
                  <p className="text-sm text-amber-700">
                    Found {duplicatesData.totalDuplicateGroups} duplicate groups with {duplicatesData.totalDuplicateAccounts} total duplicate accounts
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/accounts/duplicates'] })}
                  className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors flex items-center gap-1"
                  data-testid="button-refresh-duplicates"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowMergeWizard(true)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                  data-testid="button-merge-wizard"
                >
                  <GitMerge className="w-3 h-3" />
                  Merge Wizard
                </button>
                <button
                  onClick={() => cleanupDuplicates.mutate()}
                  disabled={cleanupDuplicates.isPending}
                  className="px-3 py-1 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                  data-testid="button-cleanup-duplicates"
                >
                  {cleanupDuplicates.isPending ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      Auto-Cleanup
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="🔍 AI-powered search: accounts, domains, industries, descriptions..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            data-testid="input-search"
          />
          {filters.searchTerm && (
            <button
              onClick={() => handleFilterChange('searchTerm', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {/* Industry Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="select-industry"
                  >
                    <option value="all">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>
                        {industry.charAt(0).toUpperCase() + industry.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={filters.accountType}
                    onChange={(e) => handleFilterChange('accountType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="select-account-type"
                  >
                    <option value="all">All Types</option>
                    {accountTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={filters.accountStatus}
                    onChange={(e) => handleFilterChange('accountStatus', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="select-account-status"
                  >
                    <option value="all">All Statuses</option>
                    {accountStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company Size Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company Size</label>
                  <select
                    value={filters.companySize}
                    onChange={(e) => handleFilterChange('companySize', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="select-company-size"
                  >
                    <option value="all">All Sizes</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>
                        {size} employees
                      </option>
                    ))}
                  </select>
                </div>

                {/* Health Score Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Health Score</label>
                  <select
                    value={filters.healthScore}
                    onChange={(e) => handleFilterChange('healthScore', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="select-health-score"
                  >
                    <option value="all">All Scores</option>
                    <option value="excellent">Excellent (80-100)</option>
                    <option value="good">Good (60-79)</option>
                    <option value="at_risk">At Risk (40-59)</option>
                    <option value="critical">Critical (0-39)</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                {/* Revenue Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Revenue Range</label>
                  <select
                    value={filters.revenueRange}
                    onChange={(e) => handleFilterChange('revenueRange', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="select-revenue-range"
                  >
                    <option value="all">All Ranges</option>
                    <option value="startup">Startup (&lt;$1M)</option>
                    <option value="small">Small ($1M-$10M)</option>
                    <option value="medium">Medium ($10M-$100M)</option>
                    <option value="large">Large ($100M+)</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {processedAccounts.length} of {accounts.length} accounts
                </div>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="button-clear-filters"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Mode Selector */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* View Mode Buttons */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { mode: 'grid', icon: Grid3X3, label: 'Grid' },
              { mode: 'list', icon: List, label: 'List' },
              { mode: 'kanban', icon: BarChart3, label: 'Kanban' },
              { mode: 'analytics', icon: TrendingUp, label: 'Analytics' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(prev => ({ ...prev, type: mode as any }))}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode.type === mode
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid={`button-view-${mode}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedAccounts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <span className="text-sm text-gray-600">
                {selectedAccounts.length} selected
              </span>
              <div className="flex items-center space-x-1">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                  Export
                </button>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                  Assign
                </button>
                <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors">
                  Tag
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          )}

          {/* Sort Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy.field}
                onChange={(e) => handleSort(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="select-sort-field"
              >
                <option value="name">Name</option>
                <option value="industry">Industry</option>
                <option value="annualRevenue">Revenue</option>
                <option value="healthScore">Health Score</option>
                <option value="totalDeals">Total Deals</option>
                <option value="lastActivityDate">Last Activity</option>
                <option value="createdAt">Created Date</option>
              </select>
              <button
                onClick={() => setSortBy(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                data-testid="button-sort-direction"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {viewMode.type === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedAccounts.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                isSelected={selectedAccounts.includes(account.id)}
                onSelect={handleSelectAccount}
                onClick={handleAccountClick}
                formatCurrency={formatCurrency}
                formatNumber={formatNumber}
                getHealthScoreColor={getHealthScoreColor}
                getHealthScoreIcon={getHealthScoreIcon}
              />
            ))}
          </div>
        )}

        {viewMode.type === 'list' && (
          <AccountsTable
            accounts={processedAccounts}
            selectedAccounts={selectedAccounts}
            onSelect={handleSelectAccount}
            onSelectAll={handleSelectAll}
            onClick={handleAccountClick}
            sortBy={sortBy}
            onSort={handleSort}
            viewMode={viewMode}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            getHealthScoreColor={getHealthScoreColor}
            getHealthScoreIcon={getHealthScoreIcon}
          />
        )}

        {processedAccounts.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
            <p className="text-gray-600 mb-4">
              {accounts.length === 0 
                ? "Get started by creating your first account" 
                : "Try adjusting your filters or search terms"
              }
            </p>
            {accounts.length === 0 && (
              <button
                onClick={handleCreateAccount}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                data-testid="button-create-first-account"
              >
                Create First Account
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Account Card Component
const AccountCard: React.FC<{
  account: Account;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
  formatCurrency: (amount: number | undefined) => string;
  formatNumber: (num: number | undefined) => string;
  getHealthScoreColor: (score: number | undefined) => string;
  getHealthScoreIcon: (score: number | undefined) => any;
}> = ({ 
  account, 
  isSelected, 
  onSelect, 
  onClick, 
  formatCurrency, 
  formatNumber, 
  getHealthScoreColor, 
  getHealthScoreIcon 
}) => {
  const HealthIcon = getHealthScoreIcon(account.healthScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      className={`bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      data-testid={`card-account-${account.id}`}
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(account.id);
              }}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              data-testid={`checkbox-account-${account.id}`}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {account.logoUrl ? (
                <img 
                  src={account.logoUrl} 
                  alt={account.name}
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                account.name.charAt(0).toUpperCase()
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${getHealthScoreColor(account.healthScore)}`}>
              <HealthIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {account.healthScore || 'N/A'}
              </span>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all duration-200"
              data-testid={`menu-account-${account.id}`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Account Name and Details */}
        <div className="mb-4" onClick={() => onClick(account.id)}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {account.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
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
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Revenue</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(account.annualRevenue)}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Deals</div>
            <div className="font-semibold text-gray-900">
              {account.totalDeals || 0}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          {account.website && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span className="truncate">{account.website}</span>
            </div>
          )}
          {account.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{account.phone}</span>
            </div>
          )}
          {account.owner && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{account.owner.firstName} {account.owner.lastName}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {account.tags && account.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {account.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {account.tags.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{account.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span>
              {account.lastActivityDate 
                ? `Last activity ${new Date(account.lastActivityDate).toLocaleDateString()}`
                : 'No recent activity'
              }
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(account.id);
              }}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              data-testid={`button-view-account-${account.id}`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              data-testid={`button-edit-account-${account.id}`}
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Accounts Table Component  
const AccountsTable: React.FC<{
  accounts: Account[];
  selectedAccounts: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onClick: (id: string) => void;
  sortBy: { field: string; direction: 'asc' | 'desc' };
  onSort: (field: string) => void;
  viewMode: ViewMode;
  formatCurrency: (amount: number | undefined) => string;
  formatNumber: (num: number | undefined) => string;
  getHealthScoreColor: (score: number | undefined) => string;
  getHealthScoreIcon: (score: number | undefined) => any;
}> = ({ 
  accounts, 
  selectedAccounts, 
  onSelect, 
  onSelectAll, 
  onClick, 
  sortBy, 
  onSort, 
  viewMode,
  formatCurrency, 
  formatNumber, 
  getHealthScoreColor, 
  getHealthScoreIcon 
}) => {
  const columns = [
    { key: 'name', label: 'Account Name', sortable: true },
    { key: 'industry', label: 'Industry', sortable: true },
    { key: 'accountType', label: 'Type', sortable: true },
    { key: 'annualRevenue', label: 'Revenue', sortable: true },
    { key: 'totalDeals', label: 'Deals', sortable: true },
    { key: 'healthScore', label: 'Health', sortable: true },
    { key: 'lastActivityDate', label: 'Last Activity', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-4">
                <button
                  onClick={onSelectAll}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  data-testid="checkbox-select-all"
                >
                  {selectedAccounts.length === accounts.length && accounts.length > 0 ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </th>
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                      data-testid={`sort-${column.key}`}
                    >
                      <span>{column.label}</span>
                      {sortBy.field === column.key && (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accounts.map(account => {
              const HealthIcon = getHealthScoreIcon(account.healthScore);
              
              return (
                <motion.tr
                  key={account.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onClick(account.id)}
                  data-testid={`row-account-${account.id}`}
                >
                  <td className="w-12 px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(account.id);
                      }}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      data-testid={`checkbox-table-account-${account.id}`}
                    >
                      {selectedAccounts.includes(account.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {account.logoUrl ? (
                          <img 
                            src={account.logoUrl} 
                            alt={account.name}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        ) : (
                          account.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {account.name}
                        </div>
                        {account.domain && (
                          <div className="text-sm text-gray-600">{account.domain}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {account.industry && (
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                        {account.industry}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    {account.accountType && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm">
                        {account.accountType}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 font-semibold">
                    {formatCurrency(account.annualRevenue)}
                  </td>
                  
                  <td className="px-6 py-4 font-semibold">
                    {account.totalDeals || 0}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className={`flex items-center space-x-2 ${getHealthScoreColor(account.healthScore)}`}>
                      <HealthIcon className="w-4 h-4" />
                      <span className="font-medium">
                        {account.healthScore || 'N/A'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {account.lastActivityDate 
                      ? new Date(account.lastActivityDate).toLocaleDateString()
                      : 'No activity'
                    }
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick(account.id);
                        }}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        data-testid={`button-table-view-${account.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        data-testid={`button-table-edit-${account.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        data-testid={`button-table-menu-${account.id}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UltimateAccountsModuleWrapper: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // State Management
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    industry: 'all',
    accountType: 'all',
    accountStatus: 'all',
    accountSegment: 'all',
    companySize: 'all',
    healthScore: 'all',
    revenueRange: 'all',
    owner: 'all',
    tags: []
  });

  const [viewMode, setViewMode] = useState<ViewMode>({
    type: 'grid',
    density: 'comfortable',
    columns: ['name', 'industry', 'revenue', 'deals', 'health', 'lastActivity']
  });

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showMergeWizard, setShowMergeWizard] = useState(false);
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc'
  });

  // Data Fetching
  const { data: accounts = [], isLoading, error, refetch } = useQuery<Account[]>({
    queryKey: ['/api/accounts'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Duplicate Management Data
  const { data: duplicatesData } = useQuery<any>({
    queryKey: ['/api/accounts/duplicates'],
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const cleanupDuplicates = useMutation({
    mutationFn: () => apiRequest('/api/accounts/duplicates/cleanup', {
      method: 'POST',
      body: { autoCleanup: true }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/duplicates'] });
    }
  });

  // Helper Functions
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  };

  const matchesHealthScore = (score: number | undefined, filter: string): boolean => {
    if (!score) return filter === 'unknown';
    switch (filter) {
      case 'excellent': return score >= 80;
      case 'good': return score >= 60 && score < 80;
      case 'at_risk': return score >= 40 && score < 60;
      case 'critical': return score < 40;
      default: return true;
    }
  };

  const matchesRevenueRange = (revenue: number | undefined, filter: string): boolean => {
    if (!revenue) return filter === 'under_1m';
    switch (filter) {
      case 'under_1m': return revenue < 1000000;
      case '1m_10m': return revenue >= 1000000 && revenue <= 10000000;
      case '10m_50m': return revenue > 10000000 && revenue <= 50000000;
      case 'over_50m': return revenue > 50000000;
      default: return true;
    }
  };

  // Filtering and Search Logic
  const fuse = useMemo(() => new Fuse(accounts, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'industry', weight: 0.2 },
      { name: 'description', weight: 0.2 },
      { name: 'website', weight: 0.1 },
      { name: 'domain', weight: 0.1 }
    ],
    threshold: 0.3,
    includeScore: true
  }), [accounts]);

  const smartSearchResults = useMemo(() => {
    if (!filters.searchTerm) return accounts;
    return fuse.search(filters.searchTerm).map(result => result.item);
  }, [fuse, filters.searchTerm, accounts]);

  const filteredAccounts = useMemo(() => {
    return smartSearchResults.filter((account: Account) => {
      return (
        (filters.industry === 'all' || account.industry === filters.industry) &&
        (filters.accountType === 'all' || account.accountType === filters.accountType) &&
        (filters.accountStatus === 'all' || account.accountStatus === filters.accountStatus) &&
        (filters.accountSegment === 'all' || account.accountSegment === filters.accountSegment) &&
        (filters.companySize === 'all' || account.companySize === filters.companySize) &&
        (filters.owner === 'all' || account.ownerId === filters.owner) &&
        (filters.healthScore === 'all' || matchesHealthScore(account.healthScore, filters.healthScore)) &&
        (filters.revenueRange === 'all' || matchesRevenueRange(account.annualRevenue, filters.revenueRange)) &&
        (filters.tags.length === 0 || filters.tags.some(tag => account.tags?.includes(tag)))
      );
    });
  }, [smartSearchResults, filters]);

  const sortedAccounts = useMemo(() => {
    return [...filteredAccounts].sort((a, b) => {
      const aValue = getNestedValue(a, sortBy.field);
      const bValue = getNestedValue(b, sortBy.field);
      
      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      const compareResult = typeof aValue === 'string' && typeof bValue === 'string'
        ? aValue.localeCompare(bValue)
        : Number(aValue) - Number(bValue);
      
      return sortBy.direction === 'asc' ? compareResult : -compareResult;
    });
  }, [filteredAccounts, sortBy]);

  const displayAccounts = sortedAccounts;

  // Statistics
  const totalRevenue = useMemo(() => 
    displayAccounts.reduce((sum, account) => sum + (account.totalRevenue || 0), 0)
  , [displayAccounts]);

  const avgHealthScore = useMemo(() => {
    const validScores = displayAccounts.filter(acc => acc.healthScore).map(acc => acc.healthScore!);
    return validScores.length > 0 ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length) : 0;
  }, [displayAccounts]);

  // Event Handlers
  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      industry: 'all',
      accountType: 'all',
      accountStatus: 'all',
      accountSegment: 'all',
      companySize: 'all',
      healthScore: 'all',
      revenueRange: 'all',
      owner: 'all',
      tags: []
    });
  }, []);

  const toggleAccountSelection = useCallback((accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedAccounts(prev => 
      prev.length === displayAccounts.length 
        ? [] 
        : displayAccounts.map(account => account.id)
    );
  }, [displayAccounts]);

  const handleAccountClick = useCallback((accountId: string) => {
    setLocation(`/crm/accounts/${accountId}`);
  }, [setLocation]);

  const handleCreateAccount = useCallback(() => {
    setLocation('/crm/accounts/create');
  }, [setLocation]);

  // Loading State
  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-gray-50"
    >
    {/* Main Content */}
    <div>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Stats */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                Accounts
                <span className="text-2xl">🏢</span>
                {smartSearchResults.length > 0 && smartSearchResults.length !== accounts.length && (
                  <Badge variant="secondary" className="text-sm">
                    {smartSearchResults.length} results
                  </Badge>
                )}
              </h1>
              <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{displayAccounts.length} accounts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{avgHealthScore}% avg health</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showFilters || Object.values(filters).some(v => v !== 'all' && v !== '' && (!Array.isArray(v) || v.length > 0))
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              data-testid="button-filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {Object.values(filters).some(v => v !== 'all' && v !== '' && (!Array.isArray(v) || v.length > 0)) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                data-testid="button-view-options"
              >
                <Settings className="w-4 h-4" />
                View
              </button>
            </div>

            <button
              onClick={handleCreateAccount}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              data-testid="button-create-account"
            >
              <Plus className="w-4 h-4" />
              Create Account
            </button>
          </div>
        </div>
        
        {/* Duplicate Management Alert */}
        {duplicatesData && duplicatesData.totalDuplicateGroups > 0 && (
          <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">
                    Duplicate Accounts Detected
                  </h3>
                  <p className="text-sm text-amber-700">
                    Found {duplicatesData.totalDuplicateGroups} duplicate groups with {duplicatesData.totalDuplicateAccounts} total duplicate accounts
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/accounts/duplicates'] })}
                  className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors flex items-center gap-1"
                  data-testid="button-refresh-duplicates"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowMergeWizard(true)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                  data-testid="button-merge-wizard"
                >
                  <GitMerge className="w-3 h-3" />
                  Merge Wizard
                </button>
                <button
                  onClick={() => cleanupDuplicates.mutate()}
                  disabled={cleanupDuplicates.isPending}
                  className="px-3 py-1 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                  data-testid="button-cleanup-duplicates"
                >
                  {cleanupDuplicates.isPending ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      Auto-Cleanup
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="🔍 AI-powered search: accounts, domains, industries, descriptions..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            data-testid="input-search"
          />
          {filters.searchTerm && (
            <button
              onClick={() => handleFilterChange('searchTerm', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200 p-6 overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Industries</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                </select>
              </div>

              {/* Company Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <select
                  value={filters.companySize}
                  onChange={(e) => handleFilterChange('companySize', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Sizes</option>
                  <option value="startup">Startup (1-50)</option>
                  <option value="small">Small (51-200)</option>
                  <option value="medium">Medium (201-1000)</option>
                  <option value="large">Large (1000+)</option>
                </select>
              </div>

              {/* Health Score Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Score</label>
                <select
                  value={filters.healthScore}
                  onChange={(e) => handleFilterChange('healthScore', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Scores</option>
                  <option value="excellent">Excellent (80-100)</option>
                  <option value="good">Good (60-79)</option>
                  <option value="at_risk">At Risk (40-59)</option>
                  <option value="critical">Critical (0-39)</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {/* Revenue Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue</label>
                <select
                  value={filters.revenueRange}
                  onChange={(e) => handleFilterChange('revenueRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Revenue</option>
                  <option value="under_1m">Under $1M</option>
                  <option value="1m_10m">$1M - $10M</option>
                  <option value="10m_50m">$10M - $50M</option>
                  <option value="over_50m">Over $50M</option>
                </select>
              </div>

              {/* Account Owner Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
                <select
                  value={filters.owner}
                  onChange={(e) => handleFilterChange('owner', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Owners</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Controls and Column Selector */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode(prev => ({ ...prev, type: 'grid' }))}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode.type === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid="button-view-grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode(prev => ({ ...prev, type: 'list' }))}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode.type === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid="button-view-list"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy.field}
                onChange={(e) => setSortBy(prev => ({ ...prev, field: e.target.value }))}
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="industry">Industry</option>
                <option value="totalRevenue">Revenue</option>
                <option value="healthScore">Health Score</option>
                <option value="createdAt">Created Date</option>
                <option value="lastActivityDate">Last Activity</option>
              </select>
              <button
                onClick={() => setSortBy(prev => ({ 
                  ...prev, 
                  direction: prev.direction === 'asc' ? 'desc' : 'asc' 
                }))}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                data-testid="button-sort-direction"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* Selection Actions */}
            {selectedAccounts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedAccounts.length} selected
                </span>
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                  Bulk Edit
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {isLoading ? (
          // Loading State
          <div className="space-y-6">
            <div className="animate-pulse space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ) : displayAccounts.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="max-w-sm mx-auto">
              <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Building className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No accounts found</h3>
              <p className="text-gray-600 mb-6">
                {accounts.length === 0 
                  ? "Get started by creating your first account."
                  : "Try adjusting your search or filters to find what you're looking for."
                }
              </p>
              <button
                onClick={handleCreateAccount}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Create Account
              </button>
            </div>
          </motion.div>
        ) : (
          // Accounts Display
          <>
            {viewMode.type === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    isSelected={selectedAccounts.includes(account.id)}
                    onSelect={(id) => toggleAccountSelection(id)}
                    onClick={handleAccountClick}
                  />
                ))}
              </div>
            ) : (
              <AccountTable
                accounts={displayAccounts}
                selectedAccounts={selectedAccounts}
                onSelectAccount={toggleAccountSelection}
                onSelectAll={toggleSelectAll}
                onClick={handleAccountClick}
                sortBy={sortBy}
                onSort={(field) => setSortBy(prev => ({
                  field,
                  direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
                }))}
                viewMode={viewMode}
              />
            )}
          </>
        )}
      </div>
    </div>

    {/* Account Merge Wizard */}
    <AccountMergeWizard
      isOpen={showMergeWizard}
      onClose={() => setShowMergeWizard(false)}
      duplicateGroups={duplicatesData?.duplicateGroups || []}
      onMergeComplete={() => {
        queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
        queryClient.invalidateQueries({ queryKey: ['/api/accounts/duplicates'] });
      }}
    />
  </motion.div>
  );
};

export default UltimateAccountsModuleWrapper;