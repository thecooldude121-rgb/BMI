import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutGrid, List, Plus, Settings, BarChart3, Filter, Search, 
  TrendingUp, DollarSign, Target, Users, Calendar, Download,
  Eye, Edit, MoreHorizontal, Star, Clock, Globe, Briefcase,
  ChevronUp, ChevronDown, CheckSquare, Save
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import BulkActionsDropdown from '../../components/CRM/BulkActionsDropdown';
import DealKanbanView from '../../components/Deal/DealKanbanView';
import DealListView from '../../components/Deal/DealListView';
// Dashboard metrics will be calculated from API data

// Simplified types for the unified deals page
interface UnifiedDeal {
  id: string;
  name: string;
  amount: number;
  stage: string;
  probability: number;
  ownerId: string;
  createdAt: string;
  expectedCloseDate?: string;
  leadId?: string;
  customFields?: Record<string, any>;
}

interface DealStage {
  id: string;
  name: string;
  color: string;
  probability: number;
}

const UnifiedDealsPage = () => {
  const queryClient = useQueryClient();
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
  });
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
  });
  const { data: accounts = [] } = useQuery({
    queryKey: ['/api/accounts'],
  });

  // Delete deals mutation
  const deleteDealsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return apiRequest('/api/deals', {
        method: 'DELETE',
        body: { ids }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      setSelectedDeals([]);
    }
  });
  const [location, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'overview' | 'kanban' | 'list'>('overview');
  const [selectedDeal, setSelectedDeal] = useState<UnifiedDeal | null>(null);
  const [showDealDetail, setShowDealDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Define pipeline stages
  const stages: DealStage[] = [
    { id: 'qualification', name: 'Qualification', color: '#6B7280', probability: 10 },
    { id: 'proposal', name: 'Proposal', color: '#3B82F6', probability: 25 },
    { id: 'negotiation', name: 'Negotiation', color: '#F59E0B', probability: 50 },
    { id: 'closed-won', name: 'Closed Won', color: '#10B981', probability: 100 },
    { id: 'closed-lost', name: 'Closed Lost', color: '#EF4444', probability: 0 }
  ];

  // Ensure deals is an array and convert to unified format
  const dealsArray = Array.isArray(deals) ? deals : [];
  const unifiedDeals: UnifiedDeal[] = dealsArray.map((deal: any) => ({
    id: deal.id,
    name: deal.name || deal.title || `Deal ${deal.id}`,
    amount: parseFloat(deal.value || '0'),
    stage: deal.stage === 'closed-won' ? 'closed-won' : 
           deal.stage === 'closed-lost' ? 'closed-lost' :
           deal.stage === 'negotiation' ? 'negotiation' :
           deal.stage === 'proposal' ? 'proposal' : 'qualification',
    probability: deal.probability,
    ownerId: deal.assignedTo,
    createdAt: deal.createdAt,
    expectedCloseDate: deal.expectedCloseDate,
    leadId: deal.leadId,
    customFields: {}
  }));
  
  // Calculate dashboard metrics function
  const calculateDashboardMetrics = (deals: UnifiedDeal[]) => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
    const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;
    const weightedValue = deals.reduce((sum, deal) => sum + (deal.amount * deal.probability / 100), 0);
    
    return {
      totalValue,
      avgDealSize,
      weightedValue,
      totalDeals: deals.length
    };
  };
  
  // Calculate dashboard metrics
  const dashboardMetrics = calculateDashboardMetrics(unifiedDeals);
  
  console.log('📊 Dashboard Metrics:', dashboardMetrics);
  console.log('🔢 Total deals from API:', dealsArray.length);
  console.log('🎯 Unified deals:', unifiedDeals.length);

  // Filter and sort deals
  const filteredDeals = unifiedDeals
    .filter(deal => {
      const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
      const matchesOwner = ownerFilter === 'all' || deal.ownerId === ownerFilter;
      return matchesSearch && matchesStage && matchesOwner;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof UnifiedDeal];
      let bValue = b[sortBy as keyof UnifiedDeal];
      
      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      
      // Only call toLowerCase if both values are strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getEmployeeName = (employeeId: string) => {
    // For now, return simple mapping since we don't have employees API yet
    return employeeId === 'f310c13c-3edf-4f46-a6ec-46503ed02377' ? 'John Smith' : 'Unassigned';
  };

  const getLeadName = (leadId?: string) => {
    if (!leadId) return 'No Lead';
    const leadsArray = Array.isArray(leads) ? leads : [];
    const lead = leadsArray.find((l: any) => l.id === leadId);
    return lead ? lead.name : 'Unknown Lead';
  };

  const getStageColor = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    return stage ? stage.color : '#6B7280';
  };

  const getStageDeals = (stageId: string) => {
    return filteredDeals.filter(deal => deal.stage === stageId);
  };

  const getStageValue = (stageId: string) => {
    return getStageDeals(stageId).reduce((sum, deal) => sum + deal.amount, 0);
  };

  const handleDealClick = (deal: UnifiedDeal) => {
    // Navigate to the full deal detail page
    setLocation(`/crm/deals/${deal.id}`);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Calculate metrics
  const totalPipelineValue = filteredDeals.reduce((sum, deal) => sum + deal.amount, 0);
  const wonDeals = filteredDeals.filter(deal => deal.stage === 'closed-won');
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);
  const avgDealSize = filteredDeals.length > 0 ? totalPipelineValue / filteredDeals.length : 0;
  const winRate = filteredDeals.length > 0 ? (wonDeals.length / filteredDeals.length) * 100 : 0;

  // Show loading state while data is being fetched
  if (dealsLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading deals...</div>
        </div>
      </div>
    );
  }

  const renderOverviewView = () => (
    <div className="space-y-8">
      {/* Test Results Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          🧪 Deal Creation Test Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <p className="text-green-600 font-medium">Total Test Deals</p>
            <p className="text-2xl font-bold text-green-700">{filteredDeals.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 font-medium">Pipeline Value</p>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(dashboardMetrics.totalValue)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <p className="text-purple-600 font-medium">Avg Deal Size</p>
            <p className="text-2xl font-bold text-purple-700">{formatCurrency(dashboardMetrics.avgDealSize)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <p className="text-orange-600 font-medium">Weighted Value</p>
            <p className="text-2xl font-bold text-orange-700">{formatCurrency(dashboardMetrics.weightedValue)}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Pipeline</p>
              <p className="text-3xl font-bold text-blue-700">{formatCurrency(totalPipelineValue)}</p>
              <p className="text-sm text-blue-600 mt-1">{filteredDeals.length} active deals</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Won Revenue</p>
              <p className="text-3xl font-bold text-green-700">{formatCurrency(wonValue)}</p>
              <p className="text-sm text-green-600 mt-1">{wonDeals.length} won deals</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Deal Size</p>
              <p className="text-3xl font-bold text-purple-700">{formatCurrency(avgDealSize)}</p>
              <p className="text-sm text-purple-600 mt-1">Per opportunity</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Target className="h-8 w-8 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Win Rate</p>
              <p className="text-3xl font-bold text-orange-700">{winRate.toFixed(1)}%</p>
              <p className="text-sm text-orange-600 mt-1">Conversion rate</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Users className="h-8 w-8 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Pipeline Overview</h3>
        <div className="space-y-4">
          {stages.map(stage => {
            const stageDeals = getStageDeals(stage.id);
            const stageValue = getStageValue(stage.id);
            const percentage = filteredDeals.length > 0 ? (stageDeals.length / filteredDeals.length) * 100 : 0;
            
            return (
              <div key={stage.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{stage.name}</h4>
                    <p className="text-sm text-gray-600">{stageDeals.length} deals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(stageValue)}</p>
                  <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">All Deals ({filteredDeals.length})</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Total Value: {formatCurrency(totalPipelineValue)}</span>
              <span>•</span>
              <span>Avg: {formatCurrency(avgDealSize)}</span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDeals.map((deal, index) => (
            <div key={deal.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    {deal.name.includes('Sample') && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Test Deal
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDealClick(deal)}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {deal.name}
                  </button>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>Owner: {getEmployeeName(deal.ownerId)}</span>
                    <span>•</span>
                    <span>Lead: {getLeadName(deal.leadId)}</span>
                    <span>•</span>
                    <span>Created: {new Date(deal.createdAt).toLocaleDateString()}</span>
                    {deal.expectedCloseDate && (
                      <>
                        <span>•</span>
                        <span>Expected Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{formatCurrency(deal.amount)}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{deal.probability}% probability</span>
                  </div>
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: getStageColor(deal.stage) }}
                  >
                    {stages.find(s => s.id === deal.stage)?.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderKanbanView = () => {
    // Create proper pipeline and deal filters for the kanban view
    const mockPipeline = {
      id: 'default',
      name: 'Sales Pipeline',
      stages: stages.map(s => ({ ...s, order: stages.indexOf(s) })),
    };
    
    const dealFilters = {
      searchTerm,
      stageId: stageFilter !== 'all' ? stageFilter : undefined,
      ownerId: ownerFilter !== 'all' ? ownerFilter : undefined,
    };

    const convertedDeals = filteredDeals.map(deal => ({
      id: deal.id,
      name: deal.name,
      amount: deal.amount,
      stageId: deal.stage,
      ownerId: deal.ownerId,
      probability: deal.probability,
      createdAt: deal.createdAt,
      closingDate: deal.expectedCloseDate,
      dealNumber: `DEAL-${deal.id.slice(0, 8)}`,
      country: 'US',
      dealType: 'New Business',
      tags: ['sample'],
      customFields: {},
      stageHistory: [{
        id: `${deal.id}-history`,
        dealId: deal.id,
        fromStageId: null,
        toStageId: deal.stage,
        enteredAt: deal.createdAt,
        exitedAt: null,
        reason: 'Initial creation',
      }],
      tasks: [],
      emails: [],
    }));

    return (
      <DealKanbanView
        pipeline={mockPipeline}
        deals={convertedDeals}
        filters={dealFilters}
        onDealMove={(dealId, newStageId) => {
          alert(`Move deal ${dealId} to stage ${newStageId} - Coming Soon!`);
        }}
        onDealClick={(deal) => handleDealClick(deal)}
        onAddDeal={(stageId) => {
          alert(`Add deal to stage ${stageId} - Coming Soon!`);
        }}
        onFiltersChange={(filters) => {
          if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm);
          if (filters.stageId) setStageFilter(filters.stageId);
          if (filters.ownerId) setOwnerFilter(filters.ownerId);
        }}
        selectedDeals={selectedDeals}
        onSelectedDealsChange={setSelectedDeals}
        isSelectionMode={isSelectionMode}
        onToggleSelectionMode={() => setIsSelectionMode(!isSelectionMode)}
      />
    );
  };

  const renderListView = () => {
    const dealFilters = {
      searchTerm,
      stageId: stageFilter !== 'all' ? stageFilter : undefined,
      ownerId: ownerFilter !== 'all' ? ownerFilter : undefined,
    };

    const convertedDeals = filteredDeals.map(deal => ({
      id: deal.id,
      name: deal.name,
      amount: deal.amount,
      stageId: deal.stage,
      ownerId: deal.ownerId,
      probability: deal.probability,
      createdAt: deal.createdAt,
      closingDate: deal.expectedCloseDate,
      dealNumber: `DEAL-${deal.id.slice(0, 8)}`,
      country: 'US',
      dealType: 'New Business',
      tags: ['sample'],
      customFields: {},
      stageHistory: [{
        id: `${deal.id}-history`,
        dealId: deal.id,
        fromStageId: null,
        toStageId: deal.stage,
        enteredAt: deal.createdAt,
        exitedAt: null,
        reason: 'Initial creation',
      }],
      tasks: [],
      emails: [],
    }));

    return (
      <DealListView
        deals={convertedDeals}
        filters={dealFilters}
        onDealClick={(deal) => handleDealClick(deal)}
        onFiltersChange={(filters) => {
          if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm);
          if (filters.stageId) setStageFilter(filters.stageId);
          if (filters.ownerId) setOwnerFilter(filters.ownerId);
        }}
        selectedDeals={selectedDeals}
        onSelectedDealsChange={setSelectedDeals}
        isSelectionMode={isSelectionMode}
        onToggleSelectionMode={() => setIsSelectionMode(!isSelectionMode)}
      />
    );
  };

  const renderSimpleKanbanView = () => (
    <div className="flex h-full space-x-6 overflow-x-auto">
      {stages.map(stage => {
        const stageDeals = getStageDeals(stage.id);
        const stageValue = getStageValue(stage.id);
        
        return (
          <div key={stage.id} className="flex-shrink-0 w-80">
            {/* Stage Header */}
            <div className="bg-white rounded-t-xl border border-gray-200 shadow-sm mb-3">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    <span className="text-sm text-gray-500">({stageDeals.length})</span>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{formatCurrency(stageValue)}</span>
                  <span className="text-gray-500">{stage.probability}% avg</span>
                </div>
              </div>
            </div>

            {/* Stage Content */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 min-h-[500px]">
              <div className="space-y-3">
                {stageDeals.map(deal => (
                  <div
                    key={deal.id}
                    onClick={() => handleDealClick(deal)}
                    className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-300 group shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {deal.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <span className="font-bold text-green-600">
                          {formatCurrency(deal.amount)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{deal.probability}%</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-600">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{getEmployeeName(deal.ownerId)}</span>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No deals in this stage</p>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                      Add your first deal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderSimpleListView = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Deal Name</span>
                  {sortBy === 'name' && (
                    sortOrder === 'asc' 
                      ? <ChevronUp className="h-3 w-3 text-blue-600" />
                      : <ChevronDown className="h-3 w-3 text-blue-600" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-2">
                  <span>Amount</span>
                  {sortBy === 'amount' && (
                    sortOrder === 'asc' 
                      ? <ChevronUp className="h-3 w-3 text-blue-600" />
                      : <ChevronDown className="h-3 w-3 text-blue-600" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Probability
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Expected Close
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDeals.map(deal => (
              <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDealClick(deal)}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {deal.name}
                  </button>
                  <div className="text-sm text-gray-500 mt-1">
                    Lead: {getLeadName(deal.leadId)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(deal.amount)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: getStageColor(deal.stage) }}
                  >
                    {stages.find(s => s.id === deal.stage)?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{deal.probability}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${deal.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {getEmployeeName(deal.ownerId)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDealClick(deal)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Unified Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
                <p className="text-gray-600 text-lg">Comprehensive deal pipeline management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('overview')}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-all ${
                    viewMode === 'overview'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-l transition-all ${
                    viewMode === 'kanban'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Pipeline
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-l transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </button>
              </div>

              <button 
                onClick={() => setLocation('/crm/deals/create')}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Deal
              </button>
            </div>
          </div>

          {/* Enhanced Filters (shown for kanban and list views) */}
          {(viewMode === 'kanban' || viewMode === 'list') && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
              
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
              
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="all">All Owners</option>
                {/* Get unique owners from deals */}
                {Array.from(new Set(unifiedDeals.map(deal => deal.ownerId).filter(Boolean))).map(ownerId => (
                  <option key={ownerId} value={ownerId}>{getEmployeeName(ownerId)}</option>
                ))}
              </select>
              
              <button className="flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              
              <button 
                onClick={() => {
                  const savedDraft = localStorage.getItem('dealDraft');
                  if (savedDraft) {
                    setLocation('/crm/deals/create');
                  } else {
                    alert('No draft found. Create a new deal to save a draft.');
                  }
                }}
                className="flex items-center px-4 py-2.5 border border-amber-300 bg-amber-50 text-amber-700 rounded-xl text-sm hover:bg-amber-100 transition-colors shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Continue Draft
              </button>
              
              {selectedDeals.length > 0 && (
                <BulkActionsDropdown
                  selectedItems={selectedDeals}
                  itemType="deals"
                  onBulkTransfer={() => alert(`Bulk Transfer feature for ${selectedDeals.length} deals - Coming Soon!`)}
                  onBulkUpdate={() => alert(`Bulk Update feature for ${selectedDeals.length} deals - Coming Soon!`)}
                  onBulkDelete={async () => {
                    if (window.confirm(`Are you sure you want to delete ${selectedDeals.length} selected deals? This action cannot be undone.`)) {
                      try {
                        await deleteDealsMutation.mutateAsync(selectedDeals);
                        console.log(`Successfully deleted ${selectedDeals.length} deals`);
                      } catch (error) {
                        console.error('Failed to delete deals:', error);
                        alert('Failed to delete deals. Please try again.');
                      }
                    }
                  }}
                  onBulkEmail={() => alert(`Bulk Email feature for ${selectedDeals.length} deals - Coming Soon!`)}
                  onPrintView={() => alert(`Print View feature for ${selectedDeals.length} deals - Coming Soon!`)}
                  isVisible={true}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-6">
        {viewMode === 'overview' && renderOverviewView()}
        {viewMode === 'kanban' && renderKanbanView()}
        {viewMode === 'list' && renderListView()}
      </div>

      {/* Deal Detail Modal */}
      {showDealDetail && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className="relative top-4 mx-auto p-5 border w-full max-w-6xl shadow-2xl rounded-2xl bg-white">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDeal.name}</h2>
                  <p className="text-gray-600">Deal Details</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDealDetail(false);
                  setSelectedDeal(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Amount</label>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(selectedDeal.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Stage</label>
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: getStageColor(selectedDeal.stage) }}
                    >
                      {stages.find(s => s.id === selectedDeal.stage)?.name}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Probability</label>
                    <div className="flex items-center space-x-3">
                      <span className="text-xl font-bold text-gray-900">{selectedDeal.probability}%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${selectedDeal.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Owner</label>
                    <p className="text-lg font-medium text-gray-900">{getEmployeeName(selectedDeal.ownerId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Related Lead</label>
                    <p className="text-lg font-medium text-gray-900">{getLeadName(selectedDeal.leadId)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Activity</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Deal Created</span>
                    </div>
                    <p className="text-sm text-gray-600">{new Date(selectedDeal.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  {selectedDeal.expectedCloseDate && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900">Expected Close</span>
                      </div>
                      <p className="text-sm text-gray-600">{new Date(selectedDeal.expectedCloseDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Next Steps</span>
                    </div>
                    <p className="text-sm text-gray-600">Follow up on proposal requirements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedDealsPage;