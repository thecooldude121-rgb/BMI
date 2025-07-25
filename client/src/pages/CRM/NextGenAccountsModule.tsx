import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Building, Search, Filter, Plus, MoreVertical, Users, DollarSign, 
  TrendingUp, Target, Grid3X3, List, BarChart3, Eye, Edit, Trash2,
  Phone, Mail, Globe, MapPin, Star, AlertTriangle
} from 'lucide-react';

interface Account {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  annualRevenue?: string;
  employees?: number;
  healthScore?: number;
  status?: string;
  ownerId?: string;
  totalRevenue?: string;
  lastActivityDate?: string;
  createdAt?: string;
}

const NextGenAccountsModule: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch accounts data
  const { data: accounts = [], isLoading, error } = useQuery<Account[]>({
    queryKey: ['/api/accounts'],
    retry: 3,
    retryDelay: 1000
  });

  // Log error if exists
  React.useEffect(() => {
    if (error) {
      console.error('Error fetching accounts:', error);
    }
  }, [error]);

  // Delete mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return Promise.all(ids.map(id => 
        fetch(`/api/accounts/${id}`, { method: 'DELETE' })
      ));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      setSelectedAccounts([]);
    }
  });

  const formatCurrency = (value?: string) => {
    if (!value) return 'N/A';
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getHealthColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getHealthIcon = (score?: number) => {
    if (!score) return null;
    if (score >= 80) return <Star className="w-4 h-4" />;
    if (score >= 60) return <TrendingUp className="w-4 h-4" />;
    if (score >= 40) return <Target className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  // Filter accounts
  const filteredAccounts = (accounts || []).filter((account: Account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || account.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate metrics
  const totalAccounts = (accounts || []).length;
  const activeAccounts = (accounts || []).filter((a: Account) => a.status === 'active').length;
  const avgHealthScore = (accounts || []).length > 0 
    ? Math.round((accounts || []).reduce((sum: number, a: Account) => sum + (a.healthScore || 0), 0) / (accounts || []).length)
    : 0;
  const totalRevenue = (accounts || []).reduce((sum: number, a: Account) => sum + parseFloat(a.totalRevenue || '0'), 0);

  const handleAccountClick = (accountId: string) => {
    setLocation(`/crm/accounts/${accountId}`);
  };

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const AccountCard = ({ account }: { account: Account }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => handleAccountClick(account.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {account.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {account.name}
            </h3>
            <p className="text-sm text-gray-500">{account.industry || 'Industry not specified'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getHealthColor(account.healthScore)}`}>
            {getHealthIcon(account.healthScore)}
            <span>{account.healthScore || 0}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleSelectAccount(account.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Annual Revenue</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(account.annualRevenue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Employees</p>
          <p className="text-sm font-medium text-gray-900">
            {account.employees?.toLocaleString() || 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {account.website && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://${account.website}`, '_blank');
              }}
              className="hover:text-blue-600"
            >
              <Globe className="w-4 h-4" />
            </button>
          )}
          {account.phone && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${account.phone}`;
              }}
              className="hover:text-blue-600"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}
          {account.email && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${account.email}`;
              }}
              className="hover:text-blue-600"
            >
              <Mail className="w-4 h-4" />
            </button>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {account.status?.toUpperCase() || 'UNKNOWN'}
        </span>
      </div>
    </div>
  );

  const AccountListItem = ({ account }: { account: Account }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => handleAccountClick(account.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedAccounts.includes(account.id)}
            onChange={(e) => {
              e.stopPropagation();
              handleSelectAccount(account.id);
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            {account.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 truncate">
              {account.name}
            </h3>
            <p className="text-sm text-gray-500">{account.industry || 'Industry not specified'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{formatCurrency(account.annualRevenue)}</p>
            <p className="text-xs text-gray-500">Annual Revenue</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{account.employees?.toLocaleString() || 'N/A'}</p>
            <p className="text-xs text-gray-500">Employees</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getHealthColor(account.healthScore)}`}>
            {getHealthIcon(account.healthScore)}
            <span>{account.healthScore || 0}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {account.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Accounts</h3>
          <p className="text-red-700">There was an issue loading the accounts data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your customer accounts and relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-3xl font-bold text-gray-900">{totalAccounts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Accounts</p>
              <p className="text-3xl font-bold text-gray-900">{activeAccounts}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Health Score</p>
              <p className="text-3xl font-bold text-gray-900">{avgHealthScore}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue.toString())}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +15% from last month
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedAccounts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-blue-700">
              {selectedAccounts.length} account{selectedAccounts.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                Bulk Edit
              </button>
              <button 
                onClick={() => deleteAccountMutation.mutate(selectedAccounts)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {(filteredAccounts || []).map((account: Account) => 
          viewMode === 'grid' ? (
            <AccountCard key={account.id} account={account} />
          ) : (
            <AccountListItem key={account.id} account={account} />
          )
        )}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default NextGenAccountsModule;