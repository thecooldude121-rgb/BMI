import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download, Upload, MoreVertical, Building2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Eye, CreditCard as Edit, Trash2, Users, DollarSign, Calendar, Tag } from 'lucide-react';
import { useAccounts } from '../../contexts/AccountsContext';
import { EnhancedAccount } from '../../types/accounts';

const AccountsListView: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredAccounts,
    currentView,
    views,
    applyFilter,
    applyView,
    setSelectedAccountIds,
    selectedAccountIds,
    executeBulkAction,
    getKPIs
  } = useAccounts();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const kpis = getKPIs();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilter({ search: term });
  };

  const handleFilterChange = () => {
    applyFilter({
      search: searchTerm,
      type: selectedType.length > 0 ? selectedType : undefined,
      industry: selectedIndustry.length > 0 ? selectedIndustry : undefined,
      status: selectedStatus.length > 0 ? selectedStatus : undefined
    });
  };

  const handleSelectAll = () => {
    if (selectedAccountIds.length === filteredAccounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(filteredAccounts.map(acc => acc.id));
    }
  };

  const handleSelectAccount = (accountId: string) => {
    if (selectedAccountIds.includes(accountId)) {
      setSelectedAccountIds(selectedAccountIds.filter(id => id !== accountId));
    } else {
      setSelectedAccountIds([...selectedAccountIds, accountId]);
    }
  };

  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreIcon = (score?: number) => {
    if (!score) return null;
    if (score >= 80) return <TrendingUp className="h-4 w-4" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const getRatingBadge = (rating: string) => {
    const colors = {
      hot: 'bg-red-100 text-red-800 border-red-200',
      warm: 'bg-orange-100 text-orange-800 border-orange-200',
      cold: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      archived: 'bg-gray-100 text-gray-600',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">
            {filteredAccounts.length} of {kpis.totalAccounts} accounts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/accounts/duplicates')}
            className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Duplicates
          </button>
          <button
            onClick={() => navigate('/accounts/import-export')}
            className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button
            onClick={() => navigate('/accounts/analytics')}
            className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.totalAccounts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {kpis.newAccountsThisMonth} new this month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{kpis.activeAccounts}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {Math.round((kpis.activeAccounts / kpis.totalAccounts) * 100)}% of total
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Health Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(kpis.averageHealthScore)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Across all accounts
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{kpis.accountsAtRisk}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Need immediate attention
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const view = views.find(v => v.id === e.target.value);
                  if (view) applyView(view);
                }}
              >
                <option value="">All Accounts</option>
                {views.map(view => (
                  <option key={view.id} value={view.id}>{view.name}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border rounded-lg ${
                  showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>

              {selectedAccountIds.length > 0 && (
                <button
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions ({selectedAccountIds.length})
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedType(selected);
                    }}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="partner">Partner</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedIndustry(selected);
                    }}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedStatus(selected);
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedType([]);
                    setSelectedIndustry([]);
                    setSelectedStatus([]);
                    setSearchTerm('');
                    applyFilter({});
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Clear All
                </button>
                <button
                  onClick={handleFilterChange}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedAccountIds.length === filteredAccounts.length && filteredAccounts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr
                  key={account.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/accounts/${account.id}`)}
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedAccountIds.includes(account.id)}
                      onChange={() => handleSelectAccount(account.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.website}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900 capitalize">{account.type}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{account.industry}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(account.status)}`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getHealthScoreColor(account.healthScore)}`}>
                        {account.healthScore || 'N/A'}
                      </span>
                      <span className={`ml-2 ${getHealthScoreColor(account.healthScore)}`}>
                        {getHealthScoreIcon(account.healthScore)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {account.rating && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRatingBadge(account.rating)}`}>
                        {account.rating}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">
                      {account.lastActivityDate
                        ? new Date(account.lastActivityDate).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/accounts/${account.id}`)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No accounts found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsListView;
