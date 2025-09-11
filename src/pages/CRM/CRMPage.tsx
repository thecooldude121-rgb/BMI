import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Download, Upload, Users, DollarSign, 
  TrendingUp, Target, LayoutGrid, List, Calendar, Phone, Mail,
  Building, UserPlus, Activity, Bell, Settings, MoreHorizontal,
  ChevronDown, Eye, Edit, Trash2, Star, Clock, Globe, Briefcase
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

// TypeScript Interfaces
interface CRMMetrics {
  totalLeads: number;
  pipelineValue: number;
  conversionRate: number;
  wonDeals: number;
  avgDealSize: number;
  activeTasks: number;
}

interface CRMFilters {
  search: string;
  status: string;
  owner: string;
  dateRange: string;
  source: string;
}

interface CRMViewSettings {
  activeTab: 'leads' | 'contacts' | 'deals' | 'companies';
  viewMode: 'table' | 'kanban' | 'cards';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  color: string;
}

const CRMPage: React.FC = () => {
  const { leads, deals, contacts, companies, activities, tasks } = useData();
  const { user } = useAuth();
  
  // State Management
  const [viewSettings, setViewSettings] = useState<CRMViewSettings>({
    activeTab: 'leads',
    viewMode: 'table',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [filters, setFilters] = useState<CRMFilters>({
    search: '',
    status: 'all',
    owner: 'all',
    dateRange: 'all',
    source: 'all'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate KPI Metrics
  const calculateMetrics = (): CRMMetrics => {
    const totalLeads = leads.length;
    const pipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
    const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;
    const avgDealSize = wonDeals > 0 ? deals.filter(d => d.stage === 'closed-won').reduce((sum, d) => sum + d.value, 0) / wonDeals : 0;
    const activeTasks = tasks.filter(task => task.status !== 'completed').length;

    return {
      totalLeads,
      pipelineValue,
      conversionRate,
      wonDeals,
      avgDealSize,
      activeTasks
    };
  };

  const metrics = calculateMetrics();

  // Quick Actions Configuration
  const quickActions: QuickAction[] = [
    {
      id: 'add-lead',
      title: 'Add Lead',
      description: 'Create new lead opportunity',
      icon: UserPlus,
      action: () => console.log('Add Lead'), // TODO: Implement lead creation modal
      color: 'blue'
    },
    {
      id: 'schedule-call',
      title: 'Schedule Call',
      description: 'Book a sales call',
      icon: Phone,
      action: () => console.log('Schedule Call'), // TODO: Integrate calendar booking
      color: 'green'
    },
    {
      id: 'send-email',
      title: 'Send Email',
      description: 'Compose email campaign',
      icon: Mail,
      action: () => console.log('Send Email'), // TODO: Open email composer
      color: 'purple'
    },
    {
      id: 'create-task',
      title: 'Create Task',
      description: 'Add follow-up task',
      icon: Calendar,
      action: () => console.log('Create Task'), // TODO: Open task creation form
      color: 'orange'
    }
  ];

  // Data Filtering Logic
  const getFilteredData = () => {
    let data: any[] = [];
    
    switch (viewSettings.activeTab) {
      case 'leads':
        data = leads;
        break;
      case 'contacts':
        data = contacts;
        break;
      case 'deals':
        data = deals;
        break;
      case 'companies':
        data = companies;
        break;
    }

    // Apply search filter
    if (filters.search) {
      data = data.filter(item => {
        const searchTerm = filters.search.toLowerCase();
        return (
          item.name?.toLowerCase().includes(searchTerm) ||
          item.email?.toLowerCase().includes(searchTerm) ||
          item.company?.toLowerCase().includes(searchTerm) ||
          item.title?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply status filter
    if (filters.status !== 'all') {
      data = data.filter(item => item.status === filters.status || item.stage === filters.status);
    }

    // Apply owner filter
    if (filters.owner !== 'all') {
      data = data.filter(item => item.assignedTo === filters.owner || item.ownerId === filters.owner);
    }

    return data;
  };

  const filteredData = getFilteredData();

  // Event Handlers
  const handleTabChange = (tab: CRMViewSettings['activeTab']) => {
    setViewSettings(prev => ({ ...prev, activeTab: tab }));
    setSelectedItems([]);
  };

  const handleViewModeChange = (mode: CRMViewSettings['viewMode']) => {
    setViewSettings(prev => ({ ...prev, viewMode: mode }));
  };

  const handleFilterChange = (key: keyof CRMFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    // TODO: Implement bulk operations (delete, assign, update status, etc.)
  };

  const handleExport = () => {
    console.log('Exporting data for tab:', viewSettings.activeTab);
    // TODO: Implement data export functionality
  };

  const handleImport = () => {
    console.log('Importing data for tab:', viewSettings.activeTab);
    // TODO: Implement data import functionality
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get recent activities for sidebar
  const getRecentActivities = () => {
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const recentActivities = getRecentActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
                <p className="text-gray-600 text-lg">Manage your sales pipeline and customer relationships</p>
              </div>
            </div>
            
            {/* Header Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleImport}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm bg-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm bg-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => console.log('Create Deal')} // TODO: Navigate to deal creation
                className="flex items-center px-4 py-3 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition-colors shadow-md"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Create Deal
              </button>
              <button
                onClick={() => console.log('Add Lead')} // TODO: Open lead creation modal
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </button>
            </div>
          </div>

          {/* 2. KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Leads</p>
                  <p className="text-3xl font-bold text-blue-700">{metrics.totalLeads}</p>
                  <p className="text-sm text-blue-600 mt-1">+12% this month</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Users className="h-8 w-8 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Pipeline Value</p>
                  <p className="text-3xl font-bold text-green-700">{formatCurrency(metrics.pipelineValue)}</p>
                  <p className="text-sm text-green-600 mt-1">+8% this month</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-purple-700">{metrics.conversionRate.toFixed(1)}%</p>
                  <p className="text-sm text-purple-600 mt-1">+2.1% this month</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <Target className="h-8 w-8 text-purple-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Won Deals</p>
                  <p className="text-3xl font-bold text-orange-700">{metrics.wonDeals}</p>
                  <p className="text-sm text-orange-600 mt-1">{formatCurrency(metrics.avgDealSize)} avg</p>
                </div>
                <div className="p-3 bg-orange-200 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-700" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Search Bar and Filters Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${viewSettings.activeTab}...`}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="flex items-center space-x-3">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="won">Won</option>
                </select>
                
                <select
                  value={filters.owner}
                  onChange={(e) => handleFilterChange('owner', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Owners</option>
                  <option value="user1">John Smith</option>
                  <option value="user2">Sarah Johnson</option>
                  <option value="user3">Mike Chen</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-3 border rounded-xl text-sm transition-colors ${
                    showFilters 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'border-gray-300 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                    <select
                      value={filters.source}
                      onChange={(e) => handleFilterChange('source', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Sources</option>
                      <option value="website">Website</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Referral</option>
                      <option value="cold-email">Cold Email</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="all">All Industries</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => setFilters({
                        search: '',
                        status: 'all',
                        owner: 'all',
                        dateRange: 'all',
                        source: 'all'
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Tab Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
              {(['leads', 'contacts', 'deals', 'companies'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-all ${
                    viewSettings.activeTab === tab
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  } ${tab === 'leads' ? '' : 'border-l border-gray-300'}`}
                >
                  {tab === 'leads' && <UserPlus className="h-4 w-4 mr-2" />}
                  {tab === 'contacts' && <Users className="h-4 w-4 mr-2" />}
                  {tab === 'deals' && <DollarSign className="h-4 w-4 mr-2" />}
                  {tab === 'companies' && <Building className="h-4 w-4 mr-2" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tab === 'leads' && leads.length}
                    {tab === 'contacts' && contacts.length}
                    {tab === 'deals' && deals.length}
                    {tab === 'companies' && companies.length}
                  </span>
                </button>
              ))}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-3">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleViewModeChange('table')}
                  className={`p-2 ${viewSettings.viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange('kanban')}
                  className={`p-2 border-l border-gray-300 ${viewSettings.viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
              
              <span className="text-sm text-gray-600">
                {filteredData.length} of {
                  viewSettings.activeTab === 'leads' ? leads.length :
                  viewSettings.activeTab === 'contacts' ? contacts.length :
                  viewSettings.activeTab === 'deals' ? deals.length :
                  companies.length
                } {viewSettings.activeTab}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex h-full">
        {/* 5. Main Content Area */}
        <div className="flex-1 p-8">
          {/* Bulk Actions Bar */}
          {selectedItems.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('assign')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Assign Owner
                  </button>
                  <button
                    onClick={() => handleBulkAction('status')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Change Status
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Table/Kanban View */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {viewSettings.viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(filteredData.map(item => item.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {viewSettings.activeTab === 'deals' ? 'Value' : 'Company'}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(prev => [...prev, item.id]);
                              } else {
                                setSelectedItems(prev => prev.filter(id => id !== item.id));
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {(item.name || item.firstName || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.name || `${item.firstName} ${item.lastName}` || item.title}
                              </p>
                              <p className="text-sm text-gray-500">{item.email || item.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {viewSettings.activeTab === 'deals' 
                            ? formatCurrency(item.value || 0)
                            : item.company || item.industry || '-'
                          }
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            item.stage === 'won' || item.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : item.stage === 'qualified' || item.status === 'qualified'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.stage || item.status || 'New'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.assignedTo || item.ownerId || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Kanban View Placeholder */
              <div className="p-8 text-center">
                <LayoutGrid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Kanban View</h3>
                <p className="text-gray-600">Drag and drop interface for managing {viewSettings.activeTab}</p>
                {/* TODO: Implement kanban board component */}
              </div>
            )}

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {viewSettings.activeTab} found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first {viewSettings.activeTab.slice(0, -1)}</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Add {viewSettings.activeTab.slice(0, -1).charAt(0).toUpperCase() + viewSettings.activeTab.slice(1, -1)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 6. Right Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 shadow-xl">
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                alt={user?.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.role} • {user?.department}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  const colorClasses = {
                    blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
                    green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
                    purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
                    orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                  };
                  
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={`w-full flex items-center p-4 border rounded-xl transition-colors ${
                        colorClasses[action.color as keyof typeof colorClasses]
                      }`}
                    >
                      <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm opacity-75">{action.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {activity.type === 'call' && <Phone className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'email' && <Mail className="h-4 w-4 text-green-600" />}
                      {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'task' && <Activity className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.subject}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasks Completed</span>
                  <span className="font-semibold text-gray-900">
                    {tasks.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Calls Made</span>
                  <span className="font-semibold text-gray-900">
                    {activities.filter(a => a.type === 'call').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Emails Sent</span>
                  <span className="font-semibold text-gray-900">
                    {activities.filter(a => a.type === 'email').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Meetings Scheduled</span>
                  <span className="font-semibold text-gray-900">
                    {activities.filter(a => a.type === 'meeting').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      3 tasks due today
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      2 high-priority leads need attention
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Deal moved to negotiation stage
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Quick Access */}
            <div className="pt-6 border-t border-gray-200">
              <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">CRM Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-gray-900 font-medium">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMPage;

/* 
API Integration Points:

1. Data Fetching:
   - useEffect hook to fetch initial data on component mount
   - Implement pagination for large datasets
   - Real-time updates via WebSocket or polling

2. CRUD Operations:
   - Create: POST /api/leads, /api/contacts, /api/deals, /api/companies
   - Read: GET /api/{entity}?page=1&limit=50&search=query&filters={}
   - Update: PUT /api/{entity}/{id}
   - Delete: DELETE /api/{entity}/{id}

3. Bulk Operations:
   - POST /api/{entity}/bulk-update
   - POST /api/{entity}/bulk-delete
   - POST /api/{entity}/bulk-assign

4. Export/Import:
   - GET /api/{entity}/export?format=csv&filters={}
   - POST /api/{entity}/import (multipart/form-data)

5. Search & Filtering:
   - GET /api/{entity}/search?q=query&filters={}
   - GET /api/filters/options (for dropdown values)

6. Real-time Features:
   - WebSocket connection for live updates
   - Activity feed real-time notifications
   - Collaborative editing indicators

7. Analytics:
   - GET /api/analytics/metrics
   - GET /api/analytics/performance
   - GET /api/analytics/funnel

Usage Example:
```typescript
// In a real implementation, replace useData() with API calls:
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiClient.getLeads({
        page: 1,
        limit: 50,
        filters: filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [filters, viewSettings.activeTab]);
```
*/