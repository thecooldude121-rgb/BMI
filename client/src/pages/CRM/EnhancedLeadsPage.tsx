import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download, Upload, Search, Trash2, CheckSquare, Square, Star, Users, BarChart3, Eye, ChevronDown, LayoutGrid, List, Columns } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EnhancedLeadForm from '../../components/CRM/EnhancedLeadForm';
import LeadDetailPanel from '../../components/CRM/LeadDetailPanel';
import BulkActionsDropdown from '../../components/CRM/BulkActionsDropdown';
import { apiRequest } from '../../lib/queryClient';
import { useViewMode } from '../../hooks/useViewMode';
import { useContextPreservation } from '../../hooks/useContextPreservation';
import LeadsKanbanView from '../../components/CRM/LeadsKanbanView';
import LeadsTileView from '../../components/CRM/LeadsTileView';

const EnhancedLeadsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['/api/leads'],
  });
  
  const leadsArray = Array.isArray(leads) ? leads : [];
  
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  // Smart Context Preservation
  const { context, isLoaded: contextLoaded, saveFilters, handleScroll, restoreScrollPosition } = useContextPreservation('leads');
  
  // Initialize state from context or defaults
  const [searchTerm, setSearchTerm] = useState(() => context?.filters.searchTerm || '');
  const [stageFilter, setStageFilter] = useState(() => context?.filters.filters.stage || 'all');
  const [sourceFilter, setSourceFilter] = useState(() => context?.filters.filters.source || 'all');
  const [priorityFilter, setPriorityFilter] = useState(() => context?.filters.filters.priority || 'all');
  const [ratingFilter, setRatingFilter] = useState(() => context?.filters.filters.rating || 'all');
  const [sortBy, setSortBy] = useState(() => context?.filters.sortBy || 'created');
  const { viewMode, setViewMode, isLoaded } = useViewMode('leadsViewMode', 'tile');
  const [selectedLeads, setSelectedLeads] = useState<string[]>(() => context?.filters.selectedItems || []);
  const [isSelectionMode, setIsSelectionMode] = useState(() => context?.filters.isSelectionMode || false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  // Log component mount and restore context
  useEffect(() => {
    console.log('🚀 EnhancedLeadsPage component mounted/remounted at', new Date().toLocaleTimeString());
    
    // Restore filters from context when component mounts
    if (contextLoaded && context) {
      setSearchTerm(context.filters.searchTerm || '');
      setStageFilter(context.filters.filters.stage || 'all');
      setSourceFilter(context.filters.filters.source || 'all');
      setPriorityFilter(context.filters.filters.priority || 'all');
      setRatingFilter(context.filters.filters.rating || 'all');
      setSortBy(context.filters.sortBy || 'created');
      setSelectedLeads(context.filters.selectedItems || []);
      setIsSelectionMode(context.filters.isSelectionMode || false);
      
      console.log('🔄 [Context] Restored leads filters from context');
    }
  }, [contextLoaded]);

  // Save filters to context when they change
  useEffect(() => {
    if (contextLoaded && isLoaded) {
      saveFilters({
        searchTerm,
        filters: { stage: stageFilter, source: sourceFilter, priority: priorityFilter, rating: ratingFilter },
        sortBy,
        viewMode,
        selectedItems: selectedLeads,
        isSelectionMode
      });
    }
  }, [searchTerm, stageFilter, sourceFilter, priorityFilter, ratingFilter, sortBy, viewMode, selectedLeads, isSelectionMode, contextLoaded, isLoaded]);

  // Restore scroll position after data loads
  useEffect(() => {
    if (contextLoaded && !isLoading && context?.scroll) {
      const container = document.querySelector('.leads-container');
      if (container) {
        setTimeout(() => restoreScrollPosition(container as HTMLElement), 100);
      }
    }
  }, [contextLoaded, isLoading, context?.scroll, restoreScrollPosition]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showViewDropdown) {
        setShowViewDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showViewDropdown]);

  // Filter and sort leads
  const filteredLeads = leadsArray
    .filter((lead: any) => {
      const matchesSearch = !searchTerm || 
        lead.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        case 'name':
          return (a.contact || '').localeCompare(b.contact || '');
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        case 'value':
          return (b.value || 0) - (a.value || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'priority':
          const priorityOrder: { [key: string]: number } = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qualified': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed_won': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed_lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'website': return 'Website';
      case 'social_media': return 'Social Media';
      case 'referral': return 'Referral';
      case 'email_campaign': return 'Email Campaign';
      case 'cold_call': return 'Cold Call';
      case 'trade_show': return 'Trade Show';
      default: return source;
    }
  };

  const createMutation = useMutation({
    mutationFn: (newLead: any) => apiRequest('/api/leads', {
      method: 'POST',
      body: JSON.stringify(newLead)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setShowForm(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: any) => apiRequest(`/api/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setEditingLead(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (leadIds: string[]) => apiRequest('/api/leads/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids: leadIds })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setSelectedLeads([]);
      setIsSelectionMode(false);
    }
  });

  const filtersApplied = (searchTerm ? 1 : 0) + 
    (stageFilter !== 'all' ? 1 : 0) + 
    (sourceFilter !== 'all' ? 1 : 0) + 
    (priorityFilter !== 'all' ? 1 : 0) + 
    (ratingFilter !== 'all' ? 1 : 0);

  if (isLoading && !contextLoaded) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-container" onScroll={handleScroll}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage your sales leads and prospects</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50"
            >
              {viewMode === 'kanban' && <Columns className="h-4 w-4" />}
              {viewMode === 'tile' && <LayoutGrid className="h-4 w-4" />}
              {viewMode === 'list' && <List className="h-4 w-4" />}
              <span className="capitalize">{viewMode}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showViewDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      console.log('🔄 [EnhancedLeadsPage] User clicked Kanban view button');
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
                      <div className="text-sm text-gray-500">Organize by stage columns</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      console.log('🔄 [EnhancedLeadsPage] User clicked Tile view button');
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
                      <div className="text-sm text-gray-500">Card-based visual layout</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      console.log('🔄 [EnhancedLeadsPage] User clicked List view button');
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
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leadsArray.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Qualified</p>
              <p className="text-2xl font-bold text-gray-900">
                {leadsArray.filter((l: any) => l.stage === 'qualified').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {leadsArray.filter((l: any) => l.priority === 'high' || l.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {leadsArray.filter((l: any) => new Date(l.created_at).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {isSelectionMode && selectedLeads.length > 0 && (
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">{selectedLeads.length} selected</span>
                <BulkActionsDropdown
                  selectedItems={selectedLeads}
                  itemType="leads"
                  onBulkTransfer={() => console.log('Bulk transfer leads')}
                  onBulkUpdate={() => console.log('Bulk update leads')}
                  onBulkDelete={() => deleteMutation.mutate(selectedLeads)}
                  onBulkEmail={() => console.log('Send bulk emails')}
                  onPrintView={() => console.log('Print view')}
                  isVisible={selectedLeads.length > 0}
                />
              </div>
            )}
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="social_media">Social Media</option>
              <option value="referral">Referral</option>
              <option value="email_campaign">Email Campaign</option>
              <option value="cold_call">Cold Call</option>
              <option value="trade_show">Trade Show</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                isSelectionMode 
                  ? 'bg-blue-100 text-blue-700 border-blue-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isSelectionMode ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              <span>Select</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created">Date Created</option>
              <option value="name">Name</option>
              <option value="company">Company</option>
              <option value="value">Value</option>
              <option value="rating">Rating</option>
              <option value="priority">Priority</option>
            </select>


          </div>
        </div>
      </div>

      {/* Leads Display */}
      <div className="bg-white rounded-lg border border-gray-200">
        {(() => {
          console.log('🔍 [EnhancedLeadsPage] Rendering with viewMode:', viewMode, 'isLoaded:', isLoaded);
          return null;
        })()}
        {viewMode === 'kanban' ? (
          <div className="p-6">
            <LeadsKanbanView
              leads={filteredLeads}
              selectedLeads={selectedLeads}
              onSelectLead={handleLeadSelection}
              onLeadClick={setSelectedLead}
              isSelectionMode={isSelectionMode}
            />
          </div>
        ) : viewMode === 'tile' ? (
          <div className="p-6">
            <LeadsTileView
              leads={filteredLeads}
              selectedLeads={selectedLeads}
              onSelectLead={handleLeadSelection}
              onLeadClick={setSelectedLead}
              isSelectionMode={isSelectionMode}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {isSelectionMode && (
                    <th className="w-12 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads(filteredLeads.map((lead: any) => lead.id));
                          } else {
                            setSelectedLeads([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Stage</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    {isSelectionMode && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleLeadSelection(lead.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{lead.contact}</div>
                      <div className="text-sm text-gray-600">{lead.title}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{lead.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(lead.stage)}`}>
                        {lead.stage?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ${parseInt(lead.value || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (lead.rating || 1) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
      </div>

      {/* Modals */}
      {showForm && (
        <EnhancedLeadForm
          onClose={() => setShowForm(false)}
        />
      )}

      {editingLead && (
        <EnhancedLeadForm
          lead={editingLead}
          onClose={() => setEditingLead(null)}
        />
      )}

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