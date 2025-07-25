import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
// Using standard HTML elements with Tailwind CSS styling
import { Building, Users, TrendingUp, Eye, Plus } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  industry?: string;
  accountStatus?: string;
  healthScore?: number;
  annualRevenue?: string;
  employees?: number;
  description?: string;
}

const BasicAccountsPage: React.FC = () => {
  const [, setLocation] = useLocation();

  // Fetch real accounts data
  const { data: accounts, isLoading, error } = useQuery<Account[]>({
    queryKey: ['/api/accounts']
  });

  const handleAccountClick = (accountId: string) => {
    console.log('Navigating to account:', accountId);
    setLocation(`/crm/accounts/${accountId}`);
  };

  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'churned': return 'bg-red-100 text-red-800';
      case 'potential': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value?: string) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
              <p className="text-gray-600 mt-1">Manage your customer accounts and relationships</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2 inline" />
              Add Account
            </button>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Accounts</h2>
              <p className="text-gray-600">Unable to load accounts. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600 mt-1">Manage your customer accounts and relationships</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Account
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{accounts?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {accounts?.filter(a => a.accountStatus === 'active').length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {accounts?.length ? Math.round(accounts.reduce((sum, a) => sum + (a.healthScore || 0), 0) / accounts.length) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(accounts?.reduce((sum, a) => sum + parseFloat(a.annualRevenue || '0'), 0).toString())}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        {accounts && accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{account.name}</h3>
                      <p className="text-sm text-gray-600">{account.industry || 'Industry not specified'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(account.accountStatus)}`}>
                      {account.accountStatus?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  
                  {/* Health Score */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getHealthScoreColor(account.healthScore)} mr-2`}></div>
                      <span className="text-sm text-gray-600">Health Score: {account.healthScore || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  {/* Key Metrics */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">{formatCurrency(account.annualRevenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Employees:</span>
                      <span className="font-medium">{account.employees?.toLocaleString() || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  {account.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{account.description}</p>
                  )}
                  
                  <button 
                    onClick={() => handleAccountClick(account.id)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-12 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Accounts Found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first account</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2 inline" />
                Create First Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicAccountsPage;