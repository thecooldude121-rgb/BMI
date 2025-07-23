import React, { useState, useEffect } from 'react';
import { Plus, Search, Building, Users, DollarSign, Filter, Download, CheckSquare, Square, Eye, FileText, Phone, Mail, Globe, ChevronDown, LayoutGrid, List, Columns } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { useViewMode } from '../../hooks/useViewMode';
import { useContextPreservation } from '../../hooks/useContextPreservation';

const EnhancedAccountsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['/api/accounts'],
  });
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/contacts'],
  });
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
  });

  // Smart Context Preservation
  const { context, isLoaded: contextLoaded, saveFilters, handleScroll, restoreScrollPosition } = useContextPreservation('accounts');
  
  // Initialize state from context or defaults
  const [searchTerm, setSearchTerm] = useState(() => context?.filters.searchTerm || '');
  const [industryFilter, setIndustryFilter] = useState(() => context?.filters.filters.industry || 'all');
  const [sizeFilter, setSizeFilter] = useState(() => context?.filters.filters.size || 'all');
  const [typeFilter, setTypeFilter] = useState(() => context?.filters.filters.type || 'all');
  const [revenueFilter, setRevenueFilter] = useState(() => context?.filters.filters.revenue || 'all');
  const [sortBy, setSortBy] = useState(() => context?.filters.sortBy || 'name');
  const { viewMode, setViewMode, isLoaded } = useViewMode('accountsViewMode', 'tile');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(() => context?.filters.selectedItems || []);
  const [isSelectionMode, setIsSelectionMode] = useState(() => context?.filters.isSelectionMode || false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  // Log component mount and restore context
  useEffect(() => {
    console.log('🚀 EnhancedAccountsPage component mounted/remounted at', new Date().toLocaleTimeString());
    
    // Restore filters from context when component mounts
    if (contextLoaded && context) {
      setSearchTerm(context.filters.searchTerm || '');
      setIndustryFilter(context.filters.filters.industry || 'all');
      setSizeFilter(context.filters.filters.size || 'all');
      setTypeFilter(context.filters.filters.type || 'all');
      setRevenueFilter(context.filters.filters.revenue || 'all');
      setSortBy(context.filters.sortBy || 'name');
      setSelectedAccounts(context.filters.selectedItems || []);
      setIsSelectionMode(context.filters.isSelectionMode || false);
      
      console.log('🔄 [Context] Restored accounts filters from context');
    }
  }, [contextLoaded]);

  // Save filters to context when they change
  useEffect(() => {
    if (contextLoaded) {
      saveFilters({
        searchTerm,
        filters: { industry: industryFilter, size: sizeFilter, type: typeFilter, revenue: revenueFilter },
        sortBy,
        viewMode,
        selectedItems: selectedAccounts,
        isSelectionMode
      });
    }
  }, [searchTerm, industryFilter, sizeFilter, typeFilter, revenueFilter, sortBy, viewMode, selectedAccounts, isSelectionMode, contextLoaded, saveFilters]);

  // Restore scroll position after data loads
  useEffect(() => {
    if (contextLoaded && !accountsLoading && context?.scroll) {
      const container = document.querySelector('.accounts-container');
      if (container) {
        setTimeout(() => restoreScrollPosition(container as HTMLElement), 100);
      }
    }
  }, [contextLoaded, accountsLoading, context, restoreScrollPosition]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showViewDropdown && !target.closest('.view-dropdown')) {
        setShowViewDropdown(false);
      }
    };

    if (showViewDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showViewDropdown]);

  const accountsArray = Array.isArray(accounts) ? accounts : [];
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const dealsArray = Array.isArray(deals) ? deals : [];

  const filteredAccounts = accountsArray.filter((account: any) => {
    const matchesSearch = 
      account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.domain?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || account.industry === industryFilter;
    const matchesSize = sizeFilter === 'all' || account.companySize === sizeFilter;
    const matchesType = typeFilter === 'all' || account.accountType === typeFilter;
    
    let matchesRevenue = true;
    if (revenueFilter !== 'all') {
      const revenue = parseFloat(account.annualRevenue || '0');
      switch (revenueFilter) {
        case 'under_1m':
          matchesRevenue = revenue < 1000000;
          break;
        case '1m_to_10m':
          matchesRevenue = revenue >= 1000000 && revenue < 10000000;
          break;
        case '10m_to_100m':
          matchesRevenue = revenue >= 10000000 && revenue < 100000000;
          break;
        case 'over_100m':
          matchesRevenue = revenue >= 100000000;
          break;
      }
    }
    
    return matchesSearch && matchesIndustry && matchesSize && matchesType && matchesRevenue;
  }).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'name':
        return a.name?.localeCompare(b.name);
      case 'revenue':
        return parseFloat(b.annualRevenue || '0') - parseFloat(a.annualRevenue || '0');
      case 'employees':
        return (b.employees || 0) - (a.employees || 0);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return a.name?.localeCompare(b.name);
    }
  });

  const getAccountContacts = (accountId: string) => {
    return contactsArray.filter((contact: any) => contact.accountId === accountId);
  };

  const getAccountDeals = (accountId: string) => {
    return dealsArray.filter((deal: any) => deal.accountId === accountId);
  };

  const getAccountRevenue = (accountId: string) => {
    return getAccountDeals(accountId).reduce((sum: number, deal: any) => {
      return sum + (deal.stage === 'closed-won' ? parseFloat(deal.value || '0') : 0);
    }, 0);
  };

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map((account: any) => account.id));
    }
  };

  const industries = Array.from(new Set(accountsArray.map((a: any) => a.industry).filter(Boolean)));
  const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const types = ['prospect', 'customer', 'partner'];
  const revenueRanges = [
    { value: 'under_1m', label: 'Under $1M' },
    { value: '1m_to_10m', label: '$1M - $10M' },
    { value: '10m_to_100m', label: '$10M - $100M' },
    { value: 'over_100m', label: 'Over $100M' }
  ];

  if (accountsLoading || contactsLoading || dealsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div 
      className="p-4 space-y-6 accounts-container" 
      onScroll={handleScroll}
      style={{ height: '100vh', overflowY: 'auto' }}
    >
      {/* Enhanced Header with KPIs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600">Manage your company accounts and prospects</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Mode Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowViewDropdown(!showViewDropdown)}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50"
              >
                {viewMode === 'tile' && <LayoutGrid className="h-4 w-4" />}
                {viewMode === 'list' && <List className="h-4 w-4" />}
                {viewMode === 'kanban' && <Columns className="h-4 w-4" />}
                <span className="capitalize">{viewMode}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showViewDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setViewMode('tile');
                        setShowViewDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                        viewMode === 'tile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Tile</div>
                        <div className="text-sm text-gray-500">Visual card layout</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('list');
                        setShowViewDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                        viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <List className="h-4 w-4" />
                      <div>
                        <div className="font-medium">List</div>
                        <div className="text-sm text-gray-500">Detailed table format</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('kanban');
                        setShowViewDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                        viewMode === 'kanban' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <Columns className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Kanban</div>
                        <div className="text-sm text-gray-500">Organized by status</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>Add Account</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-blue-600">Total Accounts</p>
                <p className="text-2xl font-bold text-blue-900">{accountsArray.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-green-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-900">
                  {accountsArray.filter((a: any) => a.accountType === 'customer').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm text-yellow-600">Total Revenue</p>
                <p className="text-2xl font-bold text-yellow-900">
                  ${accountsArray.reduce((sum: number, account: any) => sum + getAccountRevenue(account.id), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-purple-600">Prospects</p>
                <p className="text-2xl font-bold text-purple-900">
                  {accountsArray.filter((a: any) => a.accountType === 'prospect').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size} employees</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
          <select
            value={revenueFilter}
            onChange={(e) => setRevenueFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Revenue</option>
            {revenueRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="revenue">Revenue</option>
              <option value="employees">Employees</option>
              <option value="created">Recently Created</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('tile')}
                className={`px-3 py-1 text-sm ${viewMode === 'tile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} rounded-l-md`}
              >
                Tile
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} rounded-r-md border-l`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Display */}
      {viewMode === 'tile' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account: any) => {
            const accountContacts = getAccountContacts(account.id);
            const accountDeals = getAccountDeals(account.id);
            const accountRevenue = getAccountRevenue(account.id);

            return (
              <div
                key={account.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedAccount(account)}
              >
                {isSelectionMode && (
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectAccount(account.id);
                      }}
                      className="mr-2"
                    />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{account.name}</h3>
                    <p className="text-sm text-gray-600">{account.industry || 'No industry specified'}</p>
                  </div>
                  <div className="ml-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.accountType === 'customer' 
                        ? 'bg-green-100 text-green-800' 
                        : account.accountType === 'partner'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {account.accountType?.charAt(0).toUpperCase() + account.accountType?.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{account.companySize || 'Unknown'} employees</span>
                  </div>
                  {account.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">{account.website}</span>
                    </div>
                  )}
                  {account.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{account.phone}</span>
                    </div>
                  )}
                  {account.annualRevenue && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <span>${parseFloat(account.annualRevenue).toLocaleString()} annual revenue</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{accountContacts.length}</p>
                    <p className="text-xs text-gray-500">Contacts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{accountDeals.length}</p>
                    <p className="text-xs text-gray-500">Deals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">${accountRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAccount(account);
                    }}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-500"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isSelectionMode && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account: any) => {
                const accountContacts = getAccountContacts(account.id);
                const accountDeals = getAccountDeals(account.id);
                const accountRevenue = getAccountRevenue(account.id);

                return (
                  <tr key={account.id} className="hover:bg-gray-50">
                    {isSelectionMode && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAccounts.includes(account.id)}
                          onChange={() => handleSelectAccount(account.id)}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.domain}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{account.industry || 'Not specified'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        account.accountType === 'customer' 
                          ? 'bg-green-100 text-green-800' 
                          : account.accountType === 'partner'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {account.accountType?.charAt(0).toUpperCase() + account.accountType?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{account.companySize || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${parseFloat(account.annualRevenue || '0').toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{accountContacts.length}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{accountDeals.length}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedAccount(account)}
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Account Detail Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{selectedAccount.name}</h2>
              <button 
                onClick={() => setSelectedAccount(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Information</h3>
                  <div className="space-y-3 text-sm">
                    <div><strong>Industry:</strong> {selectedAccount.industry || 'Not specified'}</div>
                    <div><strong>Type:</strong> {selectedAccount.accountType}</div>
                    <div><strong>Size:</strong> {selectedAccount.companySize || 'Unknown'} employees</div>
                    <div><strong>Revenue:</strong> ${parseFloat(selectedAccount.annualRevenue || '0').toLocaleString()}</div>
                    <div><strong>Website:</strong> {selectedAccount.website || 'Not provided'}</div>
                    <div><strong>Phone:</strong> {selectedAccount.phone || 'Not provided'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Related Records</h3>
                  <div className="space-y-3">
                    <div>
                      <strong>Contacts:</strong> {getAccountContacts(selectedAccount.id).length}
                    </div>
                    <div>
                      <strong>Deals:</strong> {getAccountDeals(selectedAccount.id).length}
                    </div>
                    <div>
                      <strong>Revenue:</strong> ${getAccountRevenue(selectedAccount.id).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              {selectedAccount.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{selectedAccount.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAccountsPage;