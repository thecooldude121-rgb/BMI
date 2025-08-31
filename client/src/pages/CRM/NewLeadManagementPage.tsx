import React, { useState } from 'react';
import { 
  Plus, Users, TrendingUp, Clock, Star, 
  Search, Filter, LayoutGrid, List, Eye,
  ChevronDown, Download, Upload, Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  priority: string;
  source?: string;
  estimatedValue?: number;
  createdAt: string;
  assignedTo?: string;
}

const NewLeadManagementPage: React.FC = () => {
  // State management
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Fetch leads
  const { data: leads = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: () => apiRequest('/api/leads')
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter leads based on search and filters
  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get stats
  const stats = {
    total: leads.length,
    new: leads.filter((l: Lead) => l.status === 'new').length,
    qualified: leads.filter((l: Lead) => l.status === 'qualified').length,
    converted: leads.filter((l: Lead) => l.status === 'converted').length,
    totalValue: leads.reduce((sum: number, l: Lead) => sum + (l.estimatedValue || 0), 0)
  };

  const handleCreateLead = () => {
    // Navigate to dedicated lead creation page
    window.location.href = '/crm/leads/new';
  };

  const handleEditLead = (lead: any) => {
    // Navigate to edit page (for now, same as details)
    window.location.href = `/crm/leads/${lead.id}`;
  };

  const handleViewDetails = (leadId: string) => {
    // Navigate to dedicated lead details page
    window.location.href = `/crm/leads/${leadId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'unqualified': return 'bg-red-100 text-red-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900" data-testid={`lead-name-${lead.id}`}>
              {lead.name}
            </h3>
            <p className="text-sm text-gray-600">{lead.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
          <Star className={`h-4 w-4 ${getPriorityColor(lead.priority)}`} />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.source && (
          <div className="text-sm text-gray-600">
            Source: {lead.source}
          </div>
        )}
        {lead.estimatedValue && lead.estimatedValue > 0 && (
          <div className="text-sm font-medium text-green-600">
            Est. Value: ${lead.estimatedValue.toLocaleString()}
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleViewDetails(lead.id)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
          data-testid={`button-view-${lead.id}`}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </button>
        <button
          onClick={() => handleEditLead(lead)}
          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
          data-testid={`button-edit-${lead.id}`}
        >
          Edit
        </button>
      </div>
    </div>
  );

  const LeadRow: React.FC<{ lead: Lead }> = ({ lead }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-semibold">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900" data-testid={`lead-name-${lead.id}`}>
              {lead.name}
            </div>
            <div className="text-sm text-gray-500">{lead.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {lead.company}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
          {lead.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Star className={`h-4 w-4 ${getPriorityColor(lead.priority)}`} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {lead.source || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {lead.estimatedValue ? `$${lead.estimatedValue.toLocaleString()}` : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(lead.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => handleViewDetails(lead.id)}
          className="text-blue-600 hover:text-blue-900 mr-3"
          data-testid={`button-view-${lead.id}`}
        >
          View
        </button>
        <button
          onClick={() => handleEditLead(lead)}
          className="text-gray-600 hover:text-gray-900"
          data-testid={`button-edit-${lead.id}`}
        >
          Edit
        </button>
      </td>
    </tr>
  );

  
  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ minHeight: '100vh' }}>
      <div className="mb-4 p-4 bg-blue-100 border border-blue-200 rounded-lg">
        <h1 className="text-2xl font-bold text-blue-800">✅ Lead Management Page is Working!</h1>
        <p className="text-blue-600">Found {leads.length} leads in the system</p>
        <p className="text-sm text-blue-500 mt-2">
          Navigate to individual leads or create new ones using the interface below
        </p>
      </div>
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600 mt-1">Manage and track your sales leads efficiently</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {/* Export functionality */}}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
              data-testid="button-export"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => {/* Import functionality */}}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
              data-testid="button-import"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            <button
              onClick={handleCreateLead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              data-testid="button-create-lead"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Leads</p>
                <p className="text-2xl font-bold text-blue-900" data-testid="stat-total-leads">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">New</p>
                <p className="text-2xl font-bold text-yellow-900" data-testid="stat-new-leads">
                  {stats.new}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Qualified</p>
                <p className="text-2xl font-bold text-green-900" data-testid="stat-qualified-leads">
                  {stats.qualified}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Converted</p>
                <p className="text-2xl font-bold text-purple-900" data-testid="stat-converted-leads">
                  {stats.converted}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">$</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-total-value">
                  ${stats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-testid="input-search-leads"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="select-status-filter"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="select-priority-filter"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                data-testid="button-view-grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Display */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading leads...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? 'No leads match your filters' 
                : 'No leads yet'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by creating your first lead'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
              <button
                onClick={handleCreateLead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="button-create-first-lead"
              >
                Create First Lead
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead: Lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead: Lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All modals removed - using separate pages now */}
    </div>
  );
};

export default NewLeadManagementPage;