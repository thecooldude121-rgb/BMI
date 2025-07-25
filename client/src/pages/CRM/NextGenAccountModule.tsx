import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Building, Phone, Mail, MapPin, Users, DollarSign, Plus, Filter, Search, 
  Grid3X3, List, MoreHorizontal, TrendingUp, AlertTriangle, CheckCircle,
  ExternalLink, FileText, Calendar, Target, Activity, Globe, Linkedin,
  Twitter, Star, Award, Zap, Brain, BarChart3, Download, Upload,
  Edit, Eye, Archive, Copy, Trash2, Share2, Settings, Columns, ChevronDown
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Fuse from 'fuse.js';

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
  documents?: any[];
  enrichmentStatus?: string;
  enrichmentData?: any;
  totalDeals?: number;
  totalRevenue?: string;
  averageDealSize?: string;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountMetrics {
  totalAccounts: number;
  activeAccounts: number;
  averageHealthScore: number;
  totalRevenue: string;
  topPerformingAccounts: number;
  recentlyUpdated: number;
}

const NextGenAccountModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [location, setLocation] = useLocation();

  const queryClient = useQueryClient();

  // Fetch accounts
  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ['/api/accounts'],
    queryFn: () => apiRequest('/api/accounts'),
  });

  // Search configuration
  const fuse = new Fuse(accounts, {
    keys: ['name', 'industry', 'domain', 'accountType', 'description'],
    threshold: 0.3,
  });

  // Filter and search accounts
  const filteredAccounts = React.useMemo(() => {
    let filtered = accounts;

    // Apply search
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      filtered = searchResults.map(result => result.item);
    }

    // Apply filters
    if (selectedFilters.industry) {
      filtered = filtered.filter((account: Account) => account.industry === selectedFilters.industry);
    }
    if (selectedFilters.accountType) {
      filtered = filtered.filter((account: Account) => account.accountType === selectedFilters.accountType);
    }
    if (selectedFilters.accountStatus) {
      filtered = filtered.filter((account: Account) => account.accountStatus === selectedFilters.accountStatus);
    }
    if (selectedFilters.accountSegment) {
      filtered = filtered.filter((account: Account) => account.accountSegment === selectedFilters.accountSegment);
    }
    if (selectedFilters.healthScore) {
      const [min, max] = selectedFilters.healthScore;
      filtered = filtered.filter((account: Account) => {
        const score = account.healthScore || 0;
        return score >= min && score <= max;
      });
    }

    return filtered;
  }, [accounts, searchQuery, selectedFilters, fuse]);

  // Calculate metrics
  const metrics: AccountMetrics = React.useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((a: Account) => a.accountStatus === 'active').length;
    const avgHealth = accounts.length > 0 
      ? accounts.reduce((sum: number, a: Account) => sum + (a.healthScore || 0), 0) / accounts.length 
      : 0;
    const totalRev = accounts.reduce((sum: number, a: Account) => sum + parseFloat(a.totalRevenue || '0'), 0);
    const topPerforming = accounts.filter((a: Account) => (a.healthScore || 0) >= 80).length;
    const recentlyUpdated = accounts.filter((a: Account) => {
      const updatedDate = new Date(a.updatedAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return updatedDate > weekAgo;
    }).length;

    return {
      totalAccounts: total,
      activeAccounts: active,
      averageHealthScore: Math.round(avgHealth),
      totalRevenue: totalRev.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
      topPerformingAccounts: topPerforming,
      recentlyUpdated
    };
  }, [accounts]);

  // Calculate account health
  const getAccountHealth = (account: Account) => {
    const score = account.healthScore || 0;
    if (score >= 80) return { status: 'excellent', color: 'text-green-600 bg-green-100', icon: CheckCircle };
    if (score >= 60) return { status: 'good', color: 'text-blue-600 bg-blue-100', icon: TrendingUp };
    if (score >= 40) return { status: 'at_risk', color: 'text-yellow-600 bg-yellow-100', icon: AlertTriangle };
    return { status: 'critical', color: 'text-red-600 bg-red-100', icon: AlertTriangle };
  };

  // Get unique filter options
  const filterOptions = React.useMemo(() => {
    const industries = Array.from(new Set(accounts.map((a: Account) => a.industry).filter(Boolean)));
    const types = Array.from(new Set(accounts.map((a: Account) => a.accountType).filter(Boolean)));
    const statuses = Array.from(new Set(accounts.map((a: Account) => a.accountStatus).filter(Boolean)));
    const segments = Array.from(new Set(accounts.map((a: Account) => a.accountSegment).filter(Boolean)));

    return { industries, types, statuses, segments };
  }, [accounts]);

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Accounts</h3>
          <p className="text-red-600 mt-1">{String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Analytics Dashboard */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Intelligence</h1>
            <p className="text-gray-600">Advanced account management and relationship insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button 
              onClick={() => window.location.href = '/crm/accounts/health'}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Brain className="w-4 h-4 mr-2" />
              Health Dashboard
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </button>
            
            
          </div>
        </div>
        
        

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium text-sm">Total Accounts</p>
                <p className="text-blue-900 text-2xl font-bold">{metrics.totalAccounts}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium text-sm">Active Accounts</p>
                <p className="text-green-900 text-2xl font-bold">{metrics.activeAccounts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium text-sm">Avg Health Score</p>
                <p className="text-purple-900 text-2xl font-bold">{metrics.averageHealthScore}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 font-medium text-sm">Total Revenue</p>
                <p className="text-orange-900 text-2xl font-bold">{metrics.totalRevenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 font-medium text-sm">Top Performing</p>
                <p className="text-emerald-900 text-2xl font-bold">{metrics.topPerformingAccounts}</p>
              </div>
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-700 font-medium text-sm">Recently Updated</p>
                <p className="text-indigo-900 text-2xl font-bold">{metrics.recentlyUpdated}</p>
              </div>
              <Activity className="w-8 h-8 text-indigo-600" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search accounts by name, industry, domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {Object.keys(selectedFilters).length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {Object.keys(selectedFilters).length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Columns className="w-4 h-4" />
              </button>
            </div>
            

          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <select
                value={selectedFilters.industry || ''}
                onChange={(e) => setSelectedFilters((prev: any) => ({ ...prev, industry: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Industries</option>
                {filterOptions.industries.map((industry) => (
                  <option key={String(industry)} value={String(industry)}>{String(industry)}</option>
                ))}
              </select>

              <select
                value={selectedFilters.accountType || ''}
                onChange={(e) => setSelectedFilters((prev: any) => ({ ...prev, accountType: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Types</option>
                {filterOptions.types.map((type) => (
                  <option key={String(type)} value={String(type)}>{String(type)}</option>
                ))}
              </select>

              <select
                value={selectedFilters.accountStatus || ''}
                onChange={(e) => setSelectedFilters((prev: any) => ({ ...prev, accountStatus: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Statuses</option>
                {filterOptions.statuses.map((status) => (
                  <option key={String(status)} value={String(status)}>{String(status)}</option>
                ))}
              </select>

              <select
                value={selectedFilters.accountSegment || ''}
                onChange={(e) => setSelectedFilters((prev: any) => ({ ...prev, accountSegment: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Segments</option>
                {filterOptions.segments.map((segment) => (
                  <option key={String(segment)} value={String(segment)}>{String(segment)}</option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accounts Grid/List */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredAccounts.map((account: Account, index: number) => {
                const health = getAccountHealth(account);
                const HealthIcon = health.icon;
                
                return (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      console.log('Clicking account card:', account.id, account.name);
                      console.log('Setting location to:', `/crm/accounts/${account.id}`);
                      setLocation(`/crm/accounts/${account.id}`);
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {account.logoUrl ? (
                          <img src={account.logoUrl} alt={account.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">{account.name}</h3>
                          <p className="text-sm text-gray-500">{account.industry}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full ${health.color}`}>
                        <HealthIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {account.website && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{account.website}</span>
                        </div>
                      )}
                      {account.employees && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{account.employees.toLocaleString()} employees</span>
                        </div>
                      )}
                      {account.totalRevenue && parseFloat(account.totalRevenue) > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span>${parseFloat(account.totalRevenue).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.accountType === 'customer' ? 'bg-green-100 text-green-700' :
                          account.accountType === 'prospect' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {account.accountType}
                        </span>
                        {account.accountSegment && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {account.accountSegment}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {account.linkedinUrl && (
                          <Linkedin className="w-4 h-4 text-blue-600" />
                        )}
                        {account.twitterHandle && (
                          <Twitter className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Account</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Industry</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Health</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Employees</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Last Activity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account: Account, index: number) => {
                      const health = getAccountHealth(account);
                      const HealthIcon = health.icon;
                      
                      return (
                        <motion.tr
                          key={account.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              {account.logoUrl ? (
                                <img src={account.logoUrl} alt={account.name} className="w-8 h-8 rounded-lg object-cover" />
                              ) : (
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Building className="w-4 h-4 text-blue-600" />
                                </div>
                              )}
                              <div>
                                <button 
                                  onClick={() => {
                                    console.log('Clicking account name:', account.id, account.name);
                                    console.log('Setting location to:', `/crm/accounts/${account.id}`);
                                    setLocation(`/crm/accounts/${account.id}`);
                                  }}
                                  className="font-medium text-gray-900 hover:text-blue-600 text-left"
                                >
                                  {account.name}
                                </button>
                                <p className="text-sm text-gray-500">{account.domain}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{account.industry}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              account.accountType === 'customer' ? 'bg-green-100 text-green-700' :
                              account.accountType === 'prospect' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {account.accountType}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className={`p-1 rounded-full ${health.color}`}>
                                <HealthIcon className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium">{account.healthScore || 0}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {account.totalRevenue && parseFloat(account.totalRevenue) > 0 
                              ? `$${parseFloat(account.totalRevenue).toLocaleString()}` 
                              : '-'
                            }
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {account.employees ? account.employees.toLocaleString() : '-'}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {account.lastActivityDate 
                              ? new Date(account.lastActivityDate).toLocaleDateString() 
                              : '-'
                            }
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {viewMode === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {[
                { 
                  status: 'excellent', 
                  title: 'Excellent Health', 
                  color: 'green', 
                  accounts: filteredAccounts.filter((a: Account) => (a.healthScore || 0) >= 80) 
                },
                { 
                  status: 'good', 
                  title: 'Good Health', 
                  color: 'blue', 
                  accounts: filteredAccounts.filter((a: Account) => (a.healthScore || 0) >= 60 && (a.healthScore || 0) < 80) 
                },
                { 
                  status: 'at_risk', 
                  title: 'At Risk', 
                  color: 'yellow', 
                  accounts: filteredAccounts.filter((a: Account) => (a.healthScore || 0) >= 40 && (a.healthScore || 0) < 60) 
                },
                { 
                  status: 'critical', 
                  title: 'Critical', 
                  color: 'red', 
                  accounts: filteredAccounts.filter((a: Account) => (a.healthScore || 0) < 40) 
                }
              ].map((column) => (
                <div key={column.status} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${column.color}-100 text-${column.color}-700`}>
                      {column.accounts.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {column.accounts.map((account: Account, index: number) => {
                      const health = getAccountHealth(account);
                      const HealthIcon = health.icon;
                      
                      return (
                        <motion.div
                          key={account.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                          onClick={() => setLocation(`/crm/accounts/${account.id}`)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {account.logoUrl ? (
                                <img src={account.logoUrl} alt={account.name} className="w-8 h-8 rounded object-cover" />
                              ) : (
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                  <Building className="w-4 h-4 text-blue-600" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm truncate">{account.name}</h4>
                                <p className="text-xs text-gray-500">{account.industry}</p>
                              </div>
                            </div>
                            
                            <div className={`px-2 py-1 rounded-full ${health.color} flex items-center space-x-1`}>
                              <HealthIcon className="w-3 h-3" />
                              <span className="text-xs font-medium">{account.healthScore || 0}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            {account.totalRevenue && parseFloat(account.totalRevenue) > 0 && (
                              <div className="flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                ${parseFloat(account.totalRevenue).toLocaleString()}
                              </div>
                            )}
                            {account.employees && (
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {account.employees.toLocaleString()} employees
                              </div>
                            )}
                            {account.website && (
                              <div className="flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                <span className="truncate">{account.website}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              account.accountType === 'customer' ? 'bg-green-100 text-green-700' :
                              account.accountType === 'prospect' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {account.accountType}
                            </span>
                            
                            <div className="flex items-center space-x-1">
                              {account.linkedinUrl && (
                                <Linkedin className="w-3 h-3 text-blue-600" />
                              )}
                              {account.twitterHandle && (
                                <Twitter className="w-3 h-3 text-blue-400" />
                              )}
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {column.accounts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No accounts in this category</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredAccounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
            <p className="text-gray-500">
              {searchQuery || Object.keys(selectedFilters).length > 0
                ? "Try adjusting your search or filters"
                : "Get started by adding your first account"
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NextGenAccountModule;