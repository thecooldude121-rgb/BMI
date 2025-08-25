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

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMergeWizard, setShowMergeWizard] = useState(false);

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
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                Accounts
                <span className="text-2xl">🏢</span>
              </h1>
              <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
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
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              data-testid="button-filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('card')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  currentView === 'card' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid="button-view-card"
              >
                <Grid3X3 className="w-4 h-4" />
                Card
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  currentView === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid="button-view-list"
              >
                <List className="w-4 h-4" />
                List
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

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="🔍 Search accounts..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="p-6">
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
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
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
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
                        className="text-blue-600 hover:text-blue-700 transition-colors"
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
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
    </motion.div>
  );
};

export default UltimateAccountsModule;