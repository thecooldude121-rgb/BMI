import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp,
  Star,
  Eye,
  ChevronDown,
  Check,
  Trash2,
  UserPlus,
  ArrowRight,
  Edit
} from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  title: string;
  value: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  dealHealth: string;
  dealType: string;
  aiScore: number;
  lastActivityDate: string;
  account?: {
    id: string;
    name: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const DEAL_STAGES = [
  { id: 'discovery', title: 'Discovery', color: 'bg-blue-500' },
  { id: 'qualification', title: 'Qualification', color: 'bg-purple-500' },
  { id: 'proposal', title: 'Proposal', color: 'bg-yellow-500' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed-won', title: 'Closed Won', color: 'bg-green-500' },
  { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-500' }
];

const DEAL_HEALTH_COLORS = {
  healthy: 'bg-green-100 text-green-800',
  at_risk: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
  hot_opportunity: 'bg-blue-100 text-blue-800',
  stalled: 'bg-gray-100 text-gray-800'
};

export default function SimpleAdvancedDealsModule() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  const queryClient = useQueryClient();

  // Fetch deals data
  const { data: deals = [], isLoading, error } = useQuery({
    queryKey: ['/api/deals'],
    queryFn: async () => {
      console.log('🚀 Fetching deals...');
      const response = await fetch('/api/deals');
      if (!response.ok) throw new Error('Failed to fetch deals');
      const data = await response.json();
      console.log('✅ Deals loaded:', data.length);
      return data;
    }
  });

  // Deal update mutation
  const updateDealMutation = useMutation({
    mutationFn: async ({ dealId, updates }: { dealId: string; updates: Partial<Deal> }) => {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update deal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
    }
  });

  // Transform deals into kanban columns
  const dealColumns = React.useMemo(() => {
    const columns = DEAL_STAGES.map(stage => ({
      ...stage,
      deals: deals.filter((deal: Deal) => deal.stage === stage.id)
    }));
    return columns;
  }, [deals]);

  // Filter deals based on search
  const filteredDeals = React.useMemo(() => {
    return deals.filter((deal: Deal) => {
      const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [deals, searchTerm]);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    updateDealMutation.mutate({
      dealId,
      updates: { stage: newStage }
    });
  };

  const renderDealCard = (deal: Deal) => (
    <div
      key={deal.id}
      draggable
      onDragStart={(e) => handleDragStart(e, deal.id)}
      className="bg-white border rounded-lg p-4 mb-3 cursor-move hover:shadow-md transition-shadow relative"
    >
      {/* Multi-select checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selectedDeals.includes(deal.id)}
          onChange={(e) => {
            e.stopPropagation();
            if (e.target.checked) {
              setSelectedDeals([...selectedDeals, deal.id]);
            } else {
              setSelectedDeals(selectedDeals.filter(id => id !== deal.id));
            }
          }}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      {/* Clickable area for deal details */}
      <div 
        className="cursor-pointer pl-6"
        onClick={() => window.location.href = `/crm/deals/${deal.id}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-blue-600">{deal.name}</h4>
            <p className="text-xs text-gray-600 mb-2 line-clamp-1">{deal.title}</p>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <span className={`px-2 py-1 text-xs rounded-full ${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS]}`}>
              {deal.dealHealth}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-green-600">
            ${parseInt(deal.value).toLocaleString()}
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs">{deal.probability}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
              {deal.contact?.firstName?.[0]}{deal.contact?.lastName?.[0]}
            </div>
            <span className="text-xs text-gray-600">
              {deal.contact?.firstName} {deal.contact?.lastName}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className={`w-3 h-3 ${deal.aiScore > 80 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
            <span className="text-xs">{deal.aiScore}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
          </div>
          <div className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full" 
              style={{ width: `${deal.probability}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKanbanView = () => (
    <div className="grid grid-cols-6 gap-4 h-full">
      {dealColumns.map((column) => (
        <div 
          key={column.id} 
          className="bg-gray-50 rounded-lg p-3"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {column.deals.length}
              </span>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="min-h-[200px]">
            {column.deals.map((deal: Deal) => renderDealCard(deal))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredDeals.map((deal: Deal) => renderDealCard(deal))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input
                  type="checkbox"
                  checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDeals(filteredDeals.map((d: Deal) => d.id));
                    } else {
                      setSelectedDeals([]);
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Close Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDeals.map((deal: Deal) => (
              <tr key={deal.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedDeals.includes(deal.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDeals([...selectedDeals, deal.id]);
                      } else {
                        setSelectedDeals(selectedDeals.filter(id => id !== deal.id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div 
                      className="font-medium text-sm cursor-pointer hover:text-blue-600"
                      onClick={() => window.location.href = `/crm/deals/${deal.id}`}
                    >
                      {deal.name}
                    </div>
                    <div className="text-xs text-gray-500">{deal.title}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{deal.account?.name}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">${parseInt(deal.value).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{deal.probability}% chance</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                    {deal.stage}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS]}`}>
                    {deal.dealHealth}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(deal.expectedCloseDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button 
                    className="p-1 hover:bg-gray-100 rounded text-blue-600"
                    onClick={() => window.location.href = `/crm/deals/${deal.id}`}
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Advanced Deals Pipeline</h1>
            <p className="text-gray-600">Next-generation deal management</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
              Analytics
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
              Configure
            </button>
            
            {/* Actions Dropdown */}
            <div className="relative">
              <button 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center space-x-2"
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
              >
                <span>Actions</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showActionsDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => {
                        console.log('Mass update:', selectedDeals);
                        setShowActionsDropdown(false);
                      }}
                      disabled={selectedDeals.length === 0}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Mass Update
                    </button>
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => {
                        console.log('Mass transfer:', selectedDeals);
                        setShowActionsDropdown(false);
                      }}
                      disabled={selectedDeals.length === 0}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Mass Transfer
                    </button>
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${selectedDeals.length} selected deals?`)) {
                          console.log('Delete deals:', selectedDeals);
                          setSelectedDeals([]);
                        }
                        setShowActionsDropdown(false);
                      }}
                      disabled={selectedDeals.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
              onClick={() => window.location.href = '/crm/deals/new'}
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              New Deal
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2 inline" />
              Filters
            </button>
            {selectedDeals.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                  <Check className="w-3 h-3 inline mr-1" />
                  {selectedDeals.length} selected
                </span>
                <button 
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  onClick={() => setSelectedDeals([])}
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 border rounded-lg p-1">
              <button
                className={`px-3 py-1 text-sm rounded ${viewMode === 'kanban' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setViewMode('kanban')}
              >
                Kanban
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setViewMode('list')}
              >
                Cards
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 h-full overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading deals...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">⚠️ Error loading deals</div>
              <p className="text-gray-600">{error?.toString()}</p>
            </div>
          </div>
        ) : deals.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 mb-4">📋 No deals found</div>
              <p className="text-gray-600">Create your first deal to get started</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                onClick={() => window.location.href = '/crm/deals/new'}
              >
                Create Deal
              </button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'kanban' && renderKanbanView()}
            {viewMode === 'list' && renderListView()}
            {viewMode === 'table' && renderTableView()}
          </>
        )}
      </div>
    </div>
  );
}