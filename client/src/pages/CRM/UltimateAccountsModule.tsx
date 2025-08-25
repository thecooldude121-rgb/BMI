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
  Copy, GitMerge, Shield, Trash, AlertCircle, X
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
  type: 'grid' | 'list';
  density: 'compact' | 'comfortable';
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
  
  const [currentView, setCurrentView] = useState<'card' | 'list'>('card');
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMergeWizard, setShowMergeWizard] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  // Data Fetching
  const { data: accounts = [], isLoading, refetch } = useQuery<Account[]>({
    queryKey: ['/api/accounts'],
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  // Basic filtering
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account: Account) => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          account.name.toLowerCase().includes(searchLower) ||
          account.industry?.toLowerCase().includes(searchLower) ||
          account.description?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [accounts, filters.searchTerm]);

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCreateAccount = useCallback(() => {
    setLocation('/crm/accounts/create');
  }, [setLocation]);

  const handleAccountClick = useCallback((accountId: string) => {
    setLocation(`/crm/accounts/${accountId}`);
  }, [setLocation]);

  // Live Analytics Calculations
  const analytics = useMemo(() => {
    const totalAccounts = accounts.length;
    const totalRevenue = accounts.reduce((sum, acc) => sum + (acc.annualRevenue || 0), 0);
    const totalDeals = accounts.reduce((sum, acc) => sum + (acc.totalDeals || 0), 0);
    const avgHealthScore = totalAccounts > 0 ? 
      accounts.reduce((sum, acc) => sum + (acc.healthScore || 0), 0) / totalAccounts : 0;

    // Health Score Distribution
    const healthDistribution = accounts.reduce((acc, account) => {
      const score = account.healthScore || 0;
      if (score >= 80) acc.excellent++;
      else if (score >= 60) acc.good++;
      else if (score >= 40) acc.atRisk++;
      else acc.critical++;
      return acc;
    }, { excellent: 0, good: 0, atRisk: 0, critical: 0 });

    // Industry Distribution
    const industryStats = accounts.reduce((acc, account) => {
      const industry = account.industry || 'Unknown';
      if (!acc[industry]) acc[industry] = { count: 0, revenue: 0 };
      acc[industry].count++;
      acc[industry].revenue += account.annualRevenue || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    // Revenue by Segment
    const segmentStats = accounts.reduce((acc, account) => {
      const segment = account.accountSegment || 'unknown';
      if (!acc[segment]) acc[segment] = { count: 0, revenue: 0 };
      acc[segment].count++;
      acc[segment].revenue += account.annualRevenue || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    // Status Distribution
    const statusStats = accounts.reduce((acc, account) => {
      const status = account.accountStatus || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Growth Metrics (mock trend data)
    const accountsGrowth = 8.5; // +8.5% growth
    const revenueGrowth = 12.3; // +12.3% growth
    const healthGrowth = -2.1; // -2.1% change
    const dealsGrowth = 15.7; // +15.7% growth

    return {
      totalAccounts,
      totalRevenue,
      totalDeals,
      avgHealthScore,
      healthDistribution,
      industryStats,
      segmentStats,
      statusStats,
      growth: {
        accounts: accountsGrowth,
        revenue: revenueGrowth,
        health: healthGrowth,
        deals: dealsGrowth
      }
    };
  }, [accounts]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingUp;
  };

  const getTrendColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

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
    <div className="flex-1 bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-16 z-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Stats */}
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Accounts
              </h1>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{filteredAccounts.length} accounts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl bg-white border border-gray-200 hover:border-gray-300"
              data-testid="button-filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* View Dropdown */}
            <div className="relative">
              <button
                onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="button-view-dropdown"
              >
                {currentView === 'card' ? (
                  <Grid3X3 className="w-4 h-4" />
                ) : (
                  <List className="w-4 h-4" />
                )}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {viewDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setViewDropdownOpen(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentView('card');
                          setViewDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                          currentView === 'card' ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                        }`}
                        data-testid="option-view-card"
                      >
                        <Grid3X3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Card View</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('list');
                          setViewDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                          currentView === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                        }`}
                        data-testid="option-view-list"
                      >
                        <List className="w-4 h-4" />
                        <span className="text-sm font-medium">List View</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleCreateAccount}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              data-testid="button-create-account"
            >
              <Plus className="w-4 h-4" />
              Create Account
            </button>
          </div>
        </div>
        
        {/* Duplicate Management Alert */}
        {duplicatesData && duplicatesData.totalDuplicateGroups > 0 && (
          <div className="mt-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 shadow-lg">
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
                  className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105"
                  data-testid="button-refresh-duplicates"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowMergeWizard(true)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105"
                  data-testid="button-merge-wizard"
                >
                  <GitMerge className="w-3 h-3" />
                  Merge Wizard
                </button>
                <button
                  onClick={() => cleanupDuplicates.mutate()}
                  disabled={cleanupDuplicates.isPending}
                  className="px-3 py-1 text-xs bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 flex items-center gap-1 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
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

      {/* Analytics Content Container */}
      <div className="bg-white">
        
        {/* Compact Analytics Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm sticky top-24 z-40">
          <div className="flex items-center justify-between">
            {/* Compact Analytics Summary */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live Analytics</span>
              </div>
              
              {/* Compact KPIs */}
              <div className="hidden lg:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{analytics.totalAccounts}</div>
                  <div className="text-xs text-gray-600">Accounts</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{formatCurrency(analytics.totalRevenue)}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{Math.round(analytics.avgHealthScore)}</div>
                  <div className="text-xs text-gray-600">Avg Health</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{analytics.totalDeals}</div>
                  <div className="text-xs text-gray-600">Active Deals</div>
                </div>
              </div>
            </div>

            {/* Dashboard Toggle & Insights */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  showDashboard 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                {showDashboard ? 'Hide Insights' : 'Show Insights'}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Insights Panel */}
        <AnimatePresence>
          {showDashboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border-b border-gray-200 px-6 py-6 shadow-lg"
            >
            {/* Advanced Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column - Key Insights */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Performance Overview Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{analytics.totalAccounts}</div>
                        <div className="text-sm text-gray-600 mb-2">Total Accounts</div>
                        <div className={`text-xs font-medium flex items-center gap-1 ${getTrendColor(analytics.growth.accounts)}`}>
                          <TrendingUp className="w-3 h-3" />
                          {formatPercentage(analytics.growth.accounts)}
                        </div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xl font-bold text-green-600 mb-1">{formatCurrency(analytics.totalRevenue)}</div>
                        <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
                        <div className={`text-xs font-medium flex items-center gap-1 ${getTrendColor(analytics.growth.revenue)}`}>
                          <TrendingUp className="w-3 h-3" />
                          {formatPercentage(analytics.growth.revenue)}
                        </div>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">{Math.round(analytics.avgHealthScore)}</div>
                        <div className="text-sm text-gray-600 mb-2">Avg Health</div>
                        <div className={`text-xs font-medium flex items-center gap-1 ${getTrendColor(analytics.growth.health)}`}>
                          <TrendingUp className="w-3 h-3" />
                          {formatPercentage(Math.abs(analytics.growth.health))}
                        </div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl font-bold text-orange-600 mb-1">{analytics.totalDeals}</div>
                        <div className="text-sm text-gray-600 mb-2">Active Deals</div>
                        <div className={`text-xs font-medium flex items-center gap-1 ${getTrendColor(analytics.growth.deals)}`}>
                          <TrendingUp className="w-3 h-3" />
                          {formatPercentage(analytics.growth.deals)}
                        </div>
                      </div>
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Zap className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Detailed Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Health Score Analysis */}
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Account Health Analysis
                      </h3>
                      <div className="text-sm text-gray-500">
                        {analytics.totalAccounts} total
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { label: 'Excellent', range: '(80-100)', count: analytics.healthDistribution.excellent, color: 'green', bgColor: 'bg-green-500' },
                        { label: 'Good', range: '(60-79)', count: analytics.healthDistribution.good, color: 'yellow', bgColor: 'bg-yellow-500' },
                        { label: 'At Risk', range: '(40-59)', count: analytics.healthDistribution.atRisk, color: 'orange', bgColor: 'bg-orange-500' },
                        { label: 'Critical', range: '(0-39)', count: analytics.healthDistribution.critical, color: 'red', bgColor: 'bg-red-500' }
                      ].map((item) => {
                        const percentage = (item.count / analytics.totalAccounts) * 100;
                        return (
                          <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${item.bgColor}`}></div>
                                <span className="text-sm font-medium text-gray-700">
                                  {item.label} {item.range}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`${item.bgColor} h-2 rounded-full`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Revenue by Industry */}
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Revenue by Industry
                      </h3>
                      <div className="text-sm text-gray-500">
                        Top performing
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(analytics.industryStats)
                        .sort(([,a], [,b]) => b.revenue - a.revenue)
                        .slice(0, 5)
                        .map(([industry, stats], index) => {
                          const maxRevenue = Math.max(...Object.values(analytics.industryStats).map(s => s.revenue));
                          const percentage = (stats.revenue / maxRevenue) * 100;
                          
                          return (
                            <div key={industry} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-blue-500' :
                                    index === 1 ? 'bg-purple-500' :
                                    index === 2 ? 'bg-green-500' :
                                    index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
                                  }`}></div>
                                  <span className="text-sm font-medium text-gray-700 capitalize">{industry}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-gray-900">{formatCurrency(stats.revenue)}</div>
                                  <div className="text-xs text-gray-500">{stats.count} accounts</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.8, delay: index * 0.1 }}
                                  className={`h-1.5 rounded-full ${
                                    index === 0 ? 'bg-blue-500' :
                                    index === 1 ? 'bg-purple-500' :
                                    index === 2 ? 'bg-green-500' :
                                    index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Column - Quick Actions & Insights */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Account Segments Summary */}
                <motion.div
                  whileHover={{ y: -1 }}
                  className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Account Segments
                  </h3>
                  
                  <div className="space-y-3">
                    {Object.entries(analytics.segmentStats)
                      .sort(([,a], [,b]) => b.revenue - a.revenue)
                      .map(([segment, stats]) => (
                        <div key={segment} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              segment === 'enterprise' ? 'bg-yellow-500' :
                              segment === 'mid_market' ? 'bg-purple-500' :
                              segment === 'smb' ? 'bg-blue-500' :
                              segment === 'startup' ? 'bg-green-500' : 'bg-gray-500'
                            }`}></div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {segment.replace('_', ' ')}
                              </div>
                              <div className="text-xs text-gray-500">{stats.count} accounts</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">{formatCurrency(stats.revenue)}</div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(stats.revenue / stats.count)} avg
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>

                {/* AI-Powered Business Insights */}
                <motion.div
                  whileHover={{ y: -1 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    AI Business Insights
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    {/* Portfolio Health Insight */}
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900">Portfolio Health Status</div>
                        <div className="text-gray-600">
                          {((analytics.healthDistribution.excellent + analytics.healthDistribution.good) / analytics.totalAccounts * 100).toFixed(1)}% 
                          of accounts are healthy. 
                          {analytics.healthDistribution.excellent > analytics.healthDistribution.good ? 
                            " Excellence-focused strategy is working well." : 
                            " Focus on moving good accounts to excellent tier."}
                        </div>
                      </div>
                    </div>
                    
                    {/* Revenue Concentration Analysis */}
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900">Revenue Concentration</div>
                        <div className="text-gray-600">
                          {(() => {
                            const topIndustryRevenue = Math.max(...Object.values(analytics.industryStats).map(s => s.revenue));
                            const concentrationPct = (topIndustryRevenue / analytics.totalRevenue * 100).toFixed(1);
                            return `${concentrationPct}% of revenue comes from your top industry. ${parseFloat(concentrationPct) > 40 ? 'Consider diversification opportunities.' : 'Good industry diversification.'}`;
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Urgent Actions */}
                    {analytics.healthDistribution.critical > 0 && (
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium text-gray-900">Urgent Action Required</div>
                          <div className="text-gray-600">
                            {analytics.healthDistribution.critical} accounts are in critical state. 
                            Immediate intervention needed to prevent churn.
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Growth Opportunity */}
                    {analytics.healthDistribution.atRisk > 0 && (
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium text-gray-900">Recovery Opportunity</div>
                          <div className="text-gray-600">
                            {analytics.healthDistribution.atRisk} at-risk accounts have 
                            {formatCurrency(Object.values(analytics.segmentStats).reduce((sum, s) => sum + s.revenue, 0) / analytics.totalAccounts)} 
                            average value. Recovery efforts could yield significant returns.
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Performance Trend */}
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        analytics.growth.revenue > 10 ? 'bg-green-500' :
                        analytics.growth.revenue > 0 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">Performance Trajectory</div>
                        <div className="text-gray-600">
                          {analytics.growth.revenue > 10 ? 
                            `Strong growth momentum with ${formatPercentage(analytics.growth.revenue)} revenue increase. Scale successful strategies.` :
                            analytics.growth.revenue > 0 ?
                            `Moderate growth at ${formatPercentage(analytics.growth.revenue)}. Identify acceleration opportunities.` :
                            `Revenue decline of ${formatPercentage(Math.abs(analytics.growth.revenue))}. Review retention strategies immediately.`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Action Recommendations */}
                <motion.div
                  whileHover={{ y: -1 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    Recommended Actions
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    {analytics.healthDistribution.critical > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-100">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-red-900">Priority:</span>
                          <span className="text-red-700 ml-1">Schedule urgent calls for {analytics.healthDistribution.critical} critical accounts</span>
                        </div>
                      </div>
                    )}
                    
                    {analytics.healthDistribution.atRisk > 2 && (
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                        <Target className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-orange-900">Focus:</span>
                          <span className="text-orange-700 ml-1">Launch retention campaign for {analytics.healthDistribution.atRisk} at-risk accounts</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                      <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-green-900">Growth:</span>
                        <span className="text-green-700 ml-1">Upsell opportunities with {analytics.healthDistribution.excellent} excellent accounts</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-blue-900">Expansion:</span>
                        <span className="text-blue-700 ml-1">Target similar profiles in top-performing industries</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-md hover:shadow-lg bg-white"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="px-6 py-4">
        {filteredAccounts.length === 0 ? (
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
                  : "Try adjusting your search to find what you're looking for."
                }
              </p>
              <button
                onClick={handleCreateAccount}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Account
              </button>
            </div>
          </motion.div>
        ) : currentView === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAccounts.map((account) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group shadow-md hover:shadow-xl"
                onClick={() => handleAccountClick(account.id)}
                data-testid={`card-account-${account.id}`}
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {account.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {account.industry || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-3 text-sm">
                    {account.website && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{account.website}</span>
                      </div>
                    )}
                    
                    {account.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{account.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-1 text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">${account.totalRevenue?.toLocaleString() || '0'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{account.totalDeals || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Created {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccountClick(account.id);
                        }}
                        className="text-blue-600 hover:text-blue-700 transition-all duration-200 p-2 rounded-xl hover:bg-blue-50 shadow-sm hover:shadow-md transform hover:scale-110"
                        data-testid={`button-view-${account.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Account</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Industry</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Revenue</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Deals</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAccounts.map((account) => (
                    <motion.tr
                      key={account.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleAccountClick(account.id)}
                      data-testid={`row-account-${account.id}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{account.name}</div>
                            <div className="text-sm text-gray-500">{account.website || 'No website'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                        {account.industry || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-medium">${account.totalRevenue?.toLocaleString() || '0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{account.totalDeals || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccountClick(account.id);
                            }}
                            className="text-blue-600 hover:text-blue-700 transition-all duration-200 p-2 rounded-xl hover:bg-blue-50 shadow-sm hover:shadow-md transform hover:scale-110"
                            data-testid={`button-table-view-${account.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-xl hover:bg-gray-50 shadow-sm hover:shadow-md transform hover:scale-110"
                            data-testid={`button-table-edit-${account.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
    </div>
  );
};

export default UltimateAccountsModule;