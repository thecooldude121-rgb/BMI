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
  const [showDashboard, setShowDashboard] = useState(false);

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
    <div className="absolute inset-0 top-16 bg-gray-50">
      {/* Fixed Header Section */}
      <div className="bg-white border-b border-gray-200 absolute top-0 left-0 right-0 z-50">
        {/* Main Header */}
        <div className="px-6 py-4 border-b border-gray-100">
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

              {/* Show AI Insights button when dashboard is hidden */}
              <button
                onClick={() => setShowDashboard(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                data-testid="button-show-insights"
              >
                <Brain className="w-4 h-4" />
                AI Insights
              </button>

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
        </div>

        {/* Search Bar - Integrated within header container */}
        <div className="px-6 py-3">
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
      </div>

      {/* Analytics Popup Modal */}
      {showDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-[80vw] h-[80vh] max-w-7xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Analytics Dashboard</h2>
                  <p className="text-blue-100 text-sm">Real-time account insights and performance metrics</p>
                </div>
              </div>
              <button
                onClick={() => setShowDashboard(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6" style={{ height: 'calc(100% - 80px)' }}>
              {/* Performance Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                      <div className="text-2xl font-bold text-blue-600 mb-1">{analytics.totalDeals}</div>
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

              {/* Additional Analytics Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Health Analysis */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Account Health Analysis
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                      <span className="text-green-800 font-medium">Excellent (80-100)</span>
                      <span className="text-2xl font-bold text-green-600">{analytics.healthDistribution.excellent}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <span className="text-yellow-800 font-medium">Good (60-79)</span>
                      <span className="text-2xl font-bold text-yellow-600">{analytics.healthDistribution.good}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <span className="text-red-800 font-medium">At Risk (40-59)</span>
                      <span className="text-2xl font-bold text-red-600">{analytics.healthDistribution.atRisk}</span>
                    </div>
                  </div>
                </div>

                {/* Revenue by Industry */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Revenue by Industry
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.industryStats)
                      .sort(([,a], [,b]) => b.revenue - a.revenue)
                      .slice(0, 3)
                      .map(([industry, stats], index) => (
                      <div key={industry} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                          <span className="font-medium text-gray-700 capitalize">{industry}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{formatCurrency(stats.revenue)}</div>
                          <div className="text-xs text-gray-500">{stats.count} accounts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Business Insights & Advanced Analytics */}
              <div className="mt-6 space-y-6">
                {/* AI Business Insights */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 shadow-lg border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-600" />
                    AI-Powered Business Intelligence
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                      >
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                        <div>
                          <div className="font-semibold text-green-900 mb-1">Portfolio Health Status</div>
                          <div className="text-sm text-green-700">
                            {Math.round((analytics.healthDistribution.excellent / analytics.totalAccounts) * 100)}% of accounts are in excellent condition. 
                            {analytics.healthDistribution.excellent > analytics.healthDistribution.good ? 
                              " Your account management strategy is performing exceptionally well." : 
                              " Focus on moving good accounts to excellent tier through targeted engagement."}
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                      >
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                        <div>
                          <div className="font-semibold text-blue-900 mb-1">Revenue Diversification</div>
                          <div className="text-sm text-blue-700">
                            {(() => {
                              const topIndustryRevenue = Math.max(...Object.values(analytics.industryStats).map(s => s.revenue));
                              const percentage = Math.round((topIndustryRevenue / analytics.totalRevenue) * 100);
                              return `${percentage}% of revenue comes from your top industry. ${percentage > 50 ? 'High concentration risk - consider expanding into new sectors.' : percentage > 30 ? 'Moderate diversification - opportunity for strategic expansion.' : 'Excellent industry diversification reducing portfolio risk.'}`;
                            })()}
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
                      >
                        <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                        <div>
                          <div className="font-semibold text-purple-900 mb-1">Growth Trajectory</div>
                          <div className="text-sm text-purple-700">
                            Revenue is {analytics.growth.revenue > 0 ? 'growing' : 'declining'} at {formatPercentage(Math.abs(analytics.growth.revenue))} rate. 
                            {analytics.growth.revenue > 10 ? " Exceptional growth momentum." : 
                             analytics.growth.revenue > 5 ? " Healthy growth rate." : 
                             analytics.growth.revenue > 0 ? " Steady positive growth." : " Requires immediate attention and strategic intervention."}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="space-y-3">
                      {analytics.healthDistribution.critical > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.3 }}
                          className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-shadow"
                        >
                          <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-red-900 mb-1">Critical Alert</div>
                            <div className="text-sm text-red-700">
                              {analytics.healthDistribution.critical} accounts are in critical condition requiring immediate intervention. 
                              Estimated revenue at risk: {formatCurrency(analytics.healthDistribution.critical * (analytics.totalRevenue / analytics.totalAccounts) * 0.8)}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {analytics.healthDistribution.atRisk > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 }}
                          className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
                        >
                          <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-orange-900 mb-1">Retention Opportunity</div>
                            <div className="text-sm text-orange-700">
                              {analytics.healthDistribution.atRisk} accounts are at risk. Proactive retention campaigns could recover up to 
                              {formatCurrency(analytics.healthDistribution.atRisk * (analytics.totalRevenue / analytics.totalAccounts) * 0.6)} in potential revenue.
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 }}
                        className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
                      >
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                        <div>
                          <div className="font-semibold text-yellow-900 mb-1">Expansion Potential</div>
                          <div className="text-sm text-yellow-700">
                            {analytics.healthDistribution.excellent} top-performing accounts show expansion readiness. 
                            Cross-selling initiatives could generate additional {formatCurrency(analytics.healthDistribution.excellent * 25000)} revenue.
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Account Status Breakdown */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-indigo-600" />
                      Account Status Distribution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.statusStats).map(([status, stats], index) => {
                        const percentage = (stats.count / analytics.totalAccounts) * 100;
                        const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                                <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">{stats.count}</span>
                                <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: 1.8 + index * 0.1 }}
                                className={`${colors[index % colors.length]} h-1.5 rounded-full`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Account Segments Analysis */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Account Segment Analysis
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.segmentStats)
                        .sort(([,a], [,b]) => b.revenue - a.revenue)
                        .map(([segment, stats], index) => {
                          const avgValue = stats.revenue / stats.count;
                          const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 'bg-teal-500'];
                          return (
                            <div key={segment} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                                  <span className="text-sm font-medium text-gray-700 capitalize">{segment}</span>
                                </div>
                                <span className="text-xs text-gray-500">{stats.count} accounts</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm font-bold text-gray-900">{formatCurrency(stats.revenue)}</div>
                                <div className="text-xs text-gray-600">Avg: {formatCurrency(avgValue)}</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Scrollable Content Area - Positioned below fixed header */}
      <div className="absolute left-0 right-0 bottom-0 top-32 overflow-y-auto bg-gray-50">
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