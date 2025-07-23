import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download, Upload, Search, Trash2, CheckSquare, Square, Star, Users, BarChart3, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EnhancedLeadForm from '../../components/CRM/EnhancedLeadForm';
import LeadDetailPanel from '../../components/CRM/LeadDetailPanel';
import BulkActionsDropdown from '../../components/CRM/BulkActionsDropdown';
import { apiRequest } from '../../lib/queryClient';

const EnhancedLeadsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['/api/leads'],
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState<'list' | 'card'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('leadsViewMode');
      console.log('Loading leads view mode from localStorage:', stored);
      return (stored as 'list' | 'card') || 'card';
    }
    return 'card';
  });
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Use useEffect to ensure localStorage persists properly
  useEffect(() => {
    const handleViewModeChange = (mode: 'list' | 'card') => {
      try {
        localStorage.setItem('leadsViewMode', mode);
        console.log('Persisted leads view mode:', mode);
      } catch (error) {
        console.error('Failed to persist leads view mode:', error);
      }
    };
    
    // Set up event listener for when the component is about to unmount
    return () => {
      handleViewModeChange(viewMode);
    };
  }, [viewMode]);

  const deleteLeadsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return apiRequest('/api/leads', {
        method: 'DELETE',
        body: { ids }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setSelectedLeads([]);
      setIsSelectionMode(false);
    }
  });

  const leadsArray = Array.isArray(leads) ? leads : [];

  const filteredLeads = leadsArray
    .filter((lead: any) => {
      const matchesSearch = 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
      const matchesRating = ratingFilter === 'all' || lead.rating?.toString() === ratingFilter;
      return matchesSearch && matchesStage && matchesSource && matchesPriority && matchesRating;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'value':
          return parseFloat(b.value || 0) - parseFloat(a.value || 0);
        case 'name':
          return a.name?.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((lead: any) => lead.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedLeads.length > 0 && window.confirm(`Delete ${selectedLeads.length} selected leads?`)) {
      deleteLeadsMutation.mutate(selectedLeads);
    }
  };

  const handleBulkTransfer = () => {
    alert(`Bulk Transfer feature for ${selectedLeads.length} leads - Coming Soon!`);
  };

  const handleBulkUpdate = () => {
    alert(`Bulk Update feature for ${selectedLeads.length} leads - Coming Soon!`);
  };

  const handleBulkEmail = () => {
    alert(`Bulk Email feature for ${selectedLeads.length} leads - Coming Soon!`);
  };

  const handlePrintView = () => {
    alert(`Print View feature for ${selectedLeads.length} leads - Coming Soon!`);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStageColor = (stage: string) => {
    const colors = {
      new: 'bg-gray-100 text-gray-800 border-gray-200',
      contacted: 'bg-blue-100 text-blue-800 border-blue-200',
      qualified: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      proposal: 'bg-purple-100 text-purple-800 border-purple-200',
      won: 'bg-green-100 text-green-800 border-green-200',
      lost: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSourceLabel = (source: string) => {
    const labels = {
      website: 'Website',
      social_media: 'Social Media',
      email_campaign: 'Email Campaign',
      referral: 'Referral',
      cold_call: 'Cold Call',
      trade_show: 'Trade Show',
      advertisement: 'Advertisement',
      partner: 'Partner'
    };
    return labels[source as keyof typeof labels] || source;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading leads...</div>
      </div>
    );
  }

  const stages = ['all', 'new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
  const sources = ['all', 'website', 'social_media', 'email_campaign', 'referral', 'cold_call', 'trade_show', 'advertisement', 'partner'];
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'];
  const ratings = ['all', '1', '2', '3', '4', '5'];

  return (
    <div className="p-4 space-y-6">
      {/* Enhanced Header with KPIs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
            <p className="text-gray-600">{filteredLeads.length} of {leadsArray.length} leads</p>
          </div>
          <div className="flex space-x-3">
            {isSelectionMode ? (
              <>
                <button
                  onClick={handleSelectAll}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  {selectedLeads.length === filteredLeads.length ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
                  Select All
                </button>
                <BulkActionsDropdown
                  selectedItems={selectedLeads}
                  itemType="leads"
                  onBulkTransfer={handleBulkTransfer}
                  onBulkUpdate={handleBulkUpdate}
                  onBulkDelete={handleDeleteSelected}
                  onBulkEmail={handleBulkEmail}
                  onPrintView={handlePrintView}
                  isVisible={true}
                />
                <button
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedLeads([]);
                  }}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsSelectionMode(true)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Select
                </button>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </button>
              </>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-blue-600">Total Leads</p>
                <p className="text-2xl font-bold text-blue-900">{leadsArray.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-green-600">Qualified</p>
                <p className="text-2xl font-bold text-green-900">
                  {leadsArray.filter((l: any) => ['qualified', 'proposal', 'won'].includes(l.stage)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm text-yellow-600">High Priority</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {leadsArray.filter((l: any) => ['high', 'urgent'].includes(l.priority)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-purple-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-900">
                  ${leadsArray.reduce((sum: number, l: any) => sum + (parseFloat(l.value) || 0), 0).toLocaleString()}
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
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stages.map(stage => (
              <option key={stage} value={stage}>
                {stage === 'all' ? 'All Stages' : stage.charAt(0).toUpperCase() + stage.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sources.map(source => (
              <option key={source} value={source}>
                {source === 'all' ? 'All Sources' : getSourceLabel(source)}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ratings.map(rating => (
              <option key={rating} value={rating}>
                {rating === 'all' ? 'All Ratings' : `${rating} Star${rating !== '1' ? 's' : ''}`}
              </option>
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
              <option value="created">Recently Created</option>
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="rating">Rating</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => {
                  console.log('Setting leads view mode to card');
                  setViewMode('card');
                  localStorage.setItem('leadsViewMode', 'card');
                }}
                className={`px-3 py-1 text-sm ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} rounded-l-md`}
              >
                Cards
              </button>
              <button
                onClick={() => {
                  console.log('Setting leads view mode to list');
                  setViewMode('list');
                  localStorage.setItem('leadsViewMode', 'list');
                }}
                className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} rounded-r-md border-l`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Display */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead: any) => (
            <div
              key={lead.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              {isSelectionMode && (
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectLead(lead.id);
                    }}
                    className="mr-2"
                  />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{lead.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{lead.position} at {lead.company}</p>
                </div>
                <div className="flex items-center ml-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= (lead.rating || 1) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(lead.stage)}`}>
                  {lead.stage?.charAt(0).toUpperCase() + lead.stage?.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                  {lead.priority?.charAt(0).toUpperCase() + lead.priority?.slice(1)}
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <p><span className="font-medium">Source:</span> {getSourceLabel(lead.source)}</p>
                <p><span className="font-medium">Value:</span> ${parseInt(lead.value || 0).toLocaleString()}</p>
                <p><span className="font-medium">Email:</span> {lead.email}</p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLead(lead);
                  }}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-500"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
              </div>
            </div>
          ))}
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
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  {isSelectionMode && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.company}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(lead.stage)}`}>
                      {lead.stage?.charAt(0).toUpperCase() + lead.stage?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                      {lead.priority?.charAt(0).toUpperCase() + lead.priority?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= (lead.rating || 1) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${parseInt(lead.value || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getSourceLabel(lead.source)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-blue-600 hover:text-blue-500 text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enhanced Lead Form */}
      {showForm && (
        <EnhancedLeadForm
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Lead Form */}
      {editingLead && (
        <EnhancedLeadForm
          lead={editingLead}
          onClose={() => setEditingLead(null)}
        />
      )}

      {/* Lead Detail Panel */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={() => {
            setEditingLead(selectedLead);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedLeadsPage;