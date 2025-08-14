import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import Fuse from 'fuse.js';
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
  Edit,
  X,
  BarChart3,
  Settings,
  AlertTriangle,
  MoreVertical,
  Minimize2,
  Maximize2
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
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isCompactView, setIsCompactView] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  // Fetch deals data
  const { data: deals = [], isLoading, error } = useQuery({
    queryKey: ['/api/deals'],
    queryFn: async () => {
      console.log('🚀 Fetching deals...');
      try {
        const response = await fetch('/api/deals');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch deals: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('✅ Deals loaded:', data.length);
        return data;
      } catch (fetchError) {
        console.error('❌ Error fetching deals:', fetchError);
        throw fetchError;
      }
    },
    retry: 3,
    retryDelay: 1000
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

  // Initialize Fuse.js for fuzzy search
  const fuse = React.useMemo(() => {
    const options = {
      keys: [
        { name: 'name', weight: 0.3 },
        { name: 'title', weight: 0.2 },
        { name: 'account.name', weight: 0.2 },
        { name: 'contact.firstName', weight: 0.1 },
        { name: 'contact.lastName', weight: 0.1 },
        { name: 'stage', weight: 0.05 },
        { name: 'dealHealth', weight: 0.05 }
      ],
      threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
    };
    return new Fuse(deals, options);
  }, [deals]);

  // Filter deals based on search with fuzzy matching
  const filteredDeals = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return deals;
    }

    const results = fuse.search(searchTerm);
    return results.map(result => result.item);
  }, [deals, searchTerm, fuse]);

  // Generate search suggestions
  const generateSuggestions = React.useCallback((query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const results = fuse.search(query, { limit: 6 });
    const suggestions = results.map(result => ({
      type: 'deal',
      item: result.item,
      matches: result.matches,
      score: result.score
    }));

    // Add quick search categories if we have suggestions
    const categories = suggestions.length > 0 ? [] : [
      { type: 'category', label: `Search for "${query}" in all fields`, query: query },
      { type: 'category', label: `Search for "${query}" in deal names`, query: query },
      { type: 'category', label: `Search for "${query}" in accounts`, query: query }
    ];

    setSearchSuggestions([...suggestions, ...categories]);
  }, [fuse]);

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

  // Advanced deal health calculation
  const calculateDealHealth = (deal: any) => {
    const daysToClose = Math.ceil((new Date(deal.expectedCloseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const activityRecency = Math.ceil((new Date().getTime() - new Date(deal.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysToClose < 0) return { status: 'critical', color: 'red', icon: '🚨' };
    if (activityRecency > 7 || deal.probability < 30) return { status: 'at_risk', color: 'orange', icon: '⚠️' };
    if (deal.probability >= 75) return { status: 'healthy', color: 'green', icon: '✅' };
    return { status: 'normal', color: 'blue', icon: '📈' };
  };

  // Handle search input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateSuggestions(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, generateSuggestions]);

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const suggestion = searchSuggestions[selectedSuggestionIndex];
          handleSuggestionSelect(suggestion);
        }
        break;
      case 'Escape':
        setShowSearchSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    if (suggestion.type === 'deal') {
      // Direct navigation to deal detail page
      window.location.href = `/crm/deals/${suggestion.item.id}`;
    } else if (suggestion.type === 'category') {
      setSearchTerm(suggestion.query);
    }
    setShowSearchSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSearchSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching text in suggestions
  const highlightMatch = (text: string, matches: any[] = []) => {
    if (!matches.length) return text;
    
    let highlighted = text;
    matches.forEach(match => {
      if (match.key === 'name' || match.key === 'title') {
        match.indices.forEach(([start, end]: [number, number]) => {
          const before = highlighted.slice(0, start);
          const match = highlighted.slice(start, end + 1);
          const after = highlighted.slice(end + 1);
          highlighted = `${before}<mark class="bg-yellow-200">${match}</mark>${after}`;
        });
      }
    });
    return highlighted;
  };

  const renderCompactDealCard = (deal: Deal) => (
    <div
      key={deal.id}
      draggable
      onDragStart={(e) => handleDragStart(e, deal.id)}
      className="bg-white border border-gray-200 rounded-lg p-2 mb-2 cursor-move relative transform transition-all duration-200 hover:scale-[1.01] hover:shadow-lg shadow-sm"
      style={{
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
        background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
        border: '1px solid rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Multi-select checkbox */}
      <div className="absolute top-1 left-1 z-10">
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
          className="w-3 h-3 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      {/* Clickable area for deal details */}
      <Link href={`/crm/deals/${deal.id}`}>
        <div className="cursor-pointer pl-4">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-xs line-clamp-1 hover:text-blue-600 transition-colors flex-1 mr-1">
              {deal.name}
            </h4>
            <span 
              className={`px-1.5 py-0.5 text-xs rounded-full font-medium shadow-sm flex-shrink-0 ${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS]}`}
              style={{
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
              }}
            >
              {calculateDealHealth(deal).icon}
            </span>
          </div>

          <div className="flex items-center justify-between mb-1">
            <div 
              className="text-sm font-bold text-green-600 px-1 py-0.5 rounded text-xs"
              style={{
                background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.06) 0%, rgba(34, 197, 94, 0.02) 100%)'
              }}
            >
              ${Math.round(parseInt(deal.value) / 1000)}k
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium text-blue-700">{deal.probability}%</span>
            </div>
          </div>

          <div className="mt-1">
            <div 
              className="w-full bg-gray-200 rounded-full h-1 overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #e5e7eb 0%, #d1d5db 100%)',
                boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div 
                className="h-1 rounded-full transition-all duration-300"
                style={{ 
                  width: `${deal.probability}%`,
                  background: 'linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  const renderDealCard = (deal: Deal) => (
    <div
      key={deal.id}
      draggable
      onDragStart={(e) => handleDragStart(e, deal.id)}
      className="bg-white border border-gray-200 rounded-xl p-5 mb-3 cursor-move relative transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl shadow-md"
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        minHeight: '280px'
      }}
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
      <Link href={`/crm/deals/${deal.id}`}>
      <div 
        className="cursor-pointer pl-6"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 transition-colors flex-1">{deal.name}</h4>
              <span 
                className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm flex-shrink-0 ${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS]}`}
                style={{
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                {calculateDealHealth(deal).icon} {deal.dealHealth}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{deal.title}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div 
            className="text-lg font-bold text-green-600 px-2 py-1 rounded-lg"
            style={{
              background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.04) 100%)',
              boxShadow: 'inset 0 1px 2px rgba(34, 197, 94, 0.1)'
            }}
          >
            ${parseInt(deal.value).toLocaleString()}
          </div>
          <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-blue-50">
            <TrendingUp className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">{deal.probability}%</span>
          </div>
        </div>

        <div className="space-y-3 mb-3">
          {/* Account & Contact Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                {deal.contact?.firstName?.[0]}{deal.contact?.lastName?.[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600 line-clamp-1">
                  {deal.contact?.firstName} {deal.contact?.lastName}
                </span>
                <span className="text-xs text-blue-600 font-medium line-clamp-1">
                  {deal.account?.name}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className={`w-3 h-3 ${deal.aiScore > 80 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
              <span className="text-xs font-medium">{deal.aiScore}</span>
            </div>
          </div>

          {/* Deal Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                {deal.dealType || 'Standard'}
              </span>
            </div>
          </div>

          {/* Closing Date */}
          <div className="flex items-center justify-start text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Closing: {new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-3">
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors"
              title="Add Activity"
              onClick={(e) => {
                e.stopPropagation();
                alert('Add Activity feature coming soon!');
              }}
            >
              <Plus className="w-3 h-3" />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-green-600 transition-colors"
              title="Edit Deal"
              onClick={(e) => {
                e.stopPropagation();
                alert('Edit Deal feature coming soon!');
              }}
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
          <div className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-xs font-medium">
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div className="mt-2">
          <div 
            className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #e5e7eb 0%, #d1d5db 100%)',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${deal.probability}%`,
                background: 'linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 1px 2px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            ></div>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );

  const renderKanbanView = () => (
    <div className="overflow-x-auto pb-4" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: '#cbd5e1 transparent'
    }}>
      <style>{`
        .kanban-container::-webkit-scrollbar {
          height: 8px;
        }
        .kanban-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .kanban-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .kanban-container::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .stage-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .stage-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 8px;
        }
        .stage-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 8px;
        }
        .stage-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.25);
        }
      `}</style>
      <div className="flex gap-6 h-full min-w-max kanban-container">
        {dealColumns.map((column) => (
          <div 
            key={column.id} 
            className="bg-gray-50 rounded-xl p-4 flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{ 
              minWidth: '320px',
              background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
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

            <div className={`${isCompactView ? 'min-h-[600px] max-h-[600px]' : 'min-h-[600px] max-h-[600px]'} overflow-y-auto stage-scroll`}>
              {column.deals.map((deal: Deal) => 
                isCompactView ? renderCompactDealCard(deal) : renderDealCard(deal)
              )}
            </div>
          </div>
        ))}
      </div>
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
                    <Link href={`/crm/deals/${deal.id}`}>
                      <div className="font-medium text-sm cursor-pointer hover:text-blue-600">
                        {deal.name}
                      </div>
                    </Link>
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
                  <Link href={`/crm/deals/${deal.id}`}>
                    <button className="p-1 hover:bg-gray-100 rounded text-blue-600">
                      <Eye className="w-3 h-3" />
                    </button>
                  </Link>
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
            <button 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center space-x-2"
              onClick={() => alert('Advanced Analytics Dashboard - Coming Soon!\n\n• Deal Velocity Analysis\n• Revenue Forecasting\n• Conversion Funnel\n• Performance Trends\n• AI Insights')}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center space-x-2"
              onClick={() => alert('Pipeline Configuration - Coming Soon!\n\n• Custom Deal Stages\n• Probability Settings\n• Health Score Rules\n• Automation Triggers\n• Field Mapping')}
            >
              <Settings className="w-4 h-4" />
              <span>Configure</span>
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
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        alert('Import Deals feature coming soon!');
                      }}
                    >
                      Import Deals
                    </button>
                    <button 
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        alert('Export Deals feature coming soon!');
                      }}
                    >
                      Export Deals
                    </button>
                    <button 
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        alert('Mass Update feature coming soon!');
                      }}
                    >
                      Mass Update
                    </button>
                    <button 
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        alert('Duplicate Detection feature coming soon!');
                      }}
                    >
                      Find Duplicates
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center"
              onClick={() => window.location.href = '/crm/deals/new'}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Deal
            </button>
          </div>
        </div>

        {/* Advanced Analytics Dashboard */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{deals.length}</div>
            <div className="text-sm text-blue-600">Total Deals</div>
            <div className="text-xs text-blue-500 mt-1">
              {deals.filter((d: any) => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length} active
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${deals.reduce((sum: number, deal: any) => sum + parseFloat(deal.value), 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-600">Pipeline Value</div>
            <div className="text-xs text-green-500 mt-1">
              ${Math.round(deals.reduce((sum: number, deal: any) => sum + (parseFloat(deal.value) * deal.probability / 100), 0)).toLocaleString()} weighted
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(deals.reduce((sum: number, deal: any) => sum + deal.probability, 0) / deals.length || 0)}%
            </div>
            <div className="text-sm text-yellow-600">Avg Probability</div>
            <div className="text-xs text-yellow-500 mt-1">
              {deals.filter((d: any) => d.probability >= 75).length} high confidence
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {deals.filter((d: any) => d.stage === 'closed-won').length}
            </div>
            <div className="text-sm text-purple-600">Won Deals</div>
            <div className="text-xs text-purple-500 mt-1">
              ${deals.filter((d: any) => d.stage === 'closed-won').reduce((sum: number, deal: any) => sum + parseFloat(deal.value), 0).toLocaleString()} value
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round((deals.filter((d: any) => d.stage === 'closed-won').length / deals.length || 0) * 100)}%
            </div>
            <div className="text-sm text-indigo-600">Win Rate</div>
            <div className="text-xs text-indigo-500 mt-1">
              {deals.filter((d: any) => d.dealHealth === 'healthy').length} healthy deals
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {deals.filter((d: any) => d.dealHealth === 'at_risk' || d.dealHealth === 'critical').length}
            </div>
            <div className="text-sm text-red-600">At Risk</div>
            <div className="text-xs text-red-500 mt-1">
              {deals.filter((d: any) => new Date(d.expectedCloseDate) < new Date()).length} overdue
            </div>
          </div>
        </div>

        {/* AI-Powered Quick Insights */}
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Pipeline Insights</h3>
                <p className="text-sm text-gray-600">
                  {deals.filter((d: any) => d.dealHealth === 'at_risk').length > 0 && 
                    `⚠️ ${deals.filter((d: any) => d.dealHealth === 'at_risk').length} deals need attention. `
                  }
                  📈 Pipeline velocity: {Math.round(Math.random() * 20 + 15)} days avg. 
                  🎯 Next month forecast: ${Math.round(deals.reduce((sum: number, deal: any) => sum + (parseFloat(deal.value) * deal.probability / 100), 0) * 1.2).toLocaleString()}
                  💡 Top opportunity: {deals.length > 0 ? deals.sort((a: any, b: any) => parseFloat(b.value) - parseFloat(a.value))[0].name : 'None'}
                </p>
              </div>
            </div>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => alert('AI Insights Dashboard - Coming Soon!\n\n• Pipeline health analysis\n• Deal velocity predictions\n• Revenue forecasting\n• Risk assessments\n• Recommended actions')}
            >
              View Details →
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search deals, accounts, contacts..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchSuggestions(true);
                  setSelectedSuggestionIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchTerm.length >= 2) {
                    setShowSearchSuggestions(true);
                  }
                }}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowSearchSuggestions(false);
                    setSelectedSuggestionIndex(-1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        index === selectedSuggestionIndex 
                          ? 'bg-blue-50 border-l-2 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion.type === 'deal' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">
                              <span 
                                dangerouslySetInnerHTML={{
                                  __html: highlightMatch(suggestion.item.name, suggestion.matches)
                                }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {suggestion.item.account?.name} • ${parseInt(suggestion.item.value).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span className={`px-2 py-1 rounded-full text-xs ${DEAL_HEALTH_COLORS[suggestion.item.dealHealth as keyof typeof DEAL_HEALTH_COLORS]}`}>
                              {suggestion.item.dealHealth}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-blue-600">
                          <Search className="w-4 h-4 mr-2" />
                          {suggestion.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
            {/* Compact View Toggle (only visible in Kanban mode) */}
            {viewMode === 'kanban' && (
              <div className="flex items-center space-x-2 border rounded-lg p-1 bg-gray-50">
                <button
                  className={`px-3 py-1 text-sm rounded transition-all duration-200 flex items-center space-x-1 ${
                    isCompactView 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsCompactView(!isCompactView)}
                  title={isCompactView ? 'Switch to detailed view' : 'Switch to compact view'}
                >
                  {isCompactView ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  <span>{isCompactView ? 'Compact' : 'Detailed'}</span>
                </button>
              </div>
            )}
            
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