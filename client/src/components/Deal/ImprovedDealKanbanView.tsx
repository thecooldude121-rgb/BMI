import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  Plus, Search, Filter, MoreHorizontal, Calendar, DollarSign, 
  User, Clock, Target, Star, Building2, Phone, Mail, 
  ChevronDown, Settings, Download, Upload, FileText,
  ArrowUp, ArrowDown, TrendingUp, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Deal, DealPipeline, DealStage, DealFilters } from '../../types/dealManagement';

interface ImprovedDealKanbanViewProps {
  pipeline: DealPipeline;
  deals: Deal[];
  filters: DealFilters;
  onDealMove: (dealId: string, newStageId: string) => void;
  onDealClick: (deal: Deal) => void;
  onAddDeal: (stageId: string) => void;
  onFiltersChange: (filters: DealFilters) => void;
  selectedDeals?: string[];
  onSelectedDealsChange?: (selectedDeals: string[]) => void;
  isSelectionMode?: boolean;
  onToggleSelectionMode?: () => void;
}

const ImprovedDealKanbanView: React.FC<ImprovedDealKanbanViewProps> = ({
  pipeline,
  deals,
  filters,
  onDealMove,
  onDealClick,
  onAddDeal,
  onFiltersChange,
  selectedDeals = [],
  onSelectedDealsChange = () => {},
  isSelectionMode = false,
  onToggleSelectionMode = () => {}
}) => {
  const [, setLocation] = useLocation();
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(deals);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = deals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(deal =>
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.dealNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Owner filter
    if (filters.ownerId) {
      filtered = filtered.filter(deal => deal.ownerId === filters.ownerId);
    }

    // Stage filter
    if (filters.stageId) {
      filtered = filtered.filter(deal => deal.stageId === filters.stageId);
    }

    // Amount range filter
    if (filters.amountRange) {
      filtered = filtered.filter(deal => 
        deal.amount >= filters.amountRange!.min && 
        deal.amount <= filters.amountRange!.max
      );
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(deal => deal.country === filters.country);
    }

    // Deal type filter
    if (filters.dealType) {
      filtered = filtered.filter(deal => deal.dealType === filters.dealType);
    }

    setFilteredDeals(filtered);
  }, [deals, filters, searchTerm]);

  const handleDragStart = (start: any) => {
    setDraggedDeal(start.draggableId);
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedDeal(null);
    setIsDragging(false);

    if (!result.destination) return;

    const dealId = result.draggableId;
    const newStageId = result.destination.droppableId;

    onDealMove(dealId, newStageId);
  };

  const getStageDeals = (stageId: string) => {
    return filteredDeals.filter(deal => deal.stageId === stageId);
  };

  const getStageValue = (stageId: string) => {
    return getStageDeals(stageId).reduce((sum, deal) => sum + deal.amount, 0);
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDealPriority = (deal: Deal) => {
    const highValue = deal.amount > 100000;
    const urgentClose = deal.closingDate && new Date(deal.closingDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    if (highValue && urgentClose) return { level: 'critical', color: 'bg-red-100 text-red-700', icon: AlertCircle };
    if (highValue) return { level: 'high', color: 'bg-orange-100 text-orange-700', icon: TrendingUp };
    if (urgentClose) return { level: 'medium', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
    return { level: 'normal', color: 'bg-gray-100 text-gray-600', icon: CheckCircle2 };
  };

  const totalPipelineValue = filteredDeals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Pipeline Management</h1>
                  <p className="text-sm text-gray-500">Track and manage your sales pipeline</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onFiltersChange({ ...filters, searchTerm: e.target.value });
                  }}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="input-search-deals"
                />
              </div>

              {/* Action Buttons */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>

              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>

              <button 
                onClick={() => onAddDeal(pipeline.stages[0]?.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                data-testid="button-add-deal"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </button>
            </div>
          </div>

          {/* Pipeline Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Total Pipeline</span>
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-1">
                <span className="text-lg font-semibold text-gray-900">{formatCurrency(totalPipelineValue)}</span>
                <span className="ml-2 text-sm text-gray-500">{filteredDeals.length} deals</span>
              </div>
            </div>

            {pipeline.stages.slice(0, 3).map((stage) => {
              const stageDeals = getStageDeals(stage.id);
              const stageValue = getStageValue(stage.id);
              
              return (
                <div key={stage.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{stage.name}</span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                  </div>
                  <div className="mt-1">
                    <span className="text-lg font-semibold text-gray-900">{formatCurrency(stageValue)}</span>
                    <span className="ml-2 text-sm text-gray-500">{stageDeals.length} deals</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-6 py-6">
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 h-full min-w-max">
            {pipeline.stages.map((stage) => {
              const stageDeals = getStageDeals(stage.id);
              const stageValue = getStageValue(stage.id);
              
              return (
                <div key={stage.id} className="flex-shrink-0 w-80">
                  {/* Stage Header */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-4 shadow-sm">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: stage.color }}
                          />
                          <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {stageDeals.length}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => onAddDeal(stage.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            data-testid={`button-add-deal-${stage.id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">{formatCurrency(stageValue)}</span>
                        <span className="text-gray-500">{stage.probability}% avg</span>
                      </div>
                    </div>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[600px] rounded-lg p-2 transition-all duration-200 ${
                          snapshot.isDraggingOver 
                            ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
                            : 'bg-transparent'
                        }`}
                      >
                        <div className="space-y-3">
                          {stageDeals.map((deal, index) => {
                            const priority = getDealPriority(deal);
                            
                            return (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => setLocation(`/crm/deals/${deal.id}`)}
                                    className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
                                      snapshot.isDragging 
                                        ? 'shadow-xl rotate-1 scale-105 border-blue-300' 
                                        : 'shadow-sm'
                                    }`}
                                    data-testid={`card-deal-${deal.id}`}
                                  >
                                    {/* Deal Header */}
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                                          {deal.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-mono">
                                          #{deal.dealNumber}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                                          <priority.icon className="h-3 w-3 inline mr-1" />
                                          {priority.level}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Deal Value */}
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-lg font-semibold text-green-600">
                                        {formatCurrency(deal.amount, deal.currency)}
                                      </span>
                                      <div className="flex items-center space-x-1">
                                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                          <div
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${deal.probability}%` }}
                                          />
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium">
                                          {deal.probability}%
                                        </span>
                                      </div>
                                    </div>

                                    {/* Deal Metadata */}
                                    <div className="space-y-2 text-xs text-gray-600">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                          <User className="h-3 w-3" />
                                          <span className="truncate">{deal.ownerId}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <span>{deal.country}</span>
                                        </div>
                                      </div>

                                      {deal.closingDate && (
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>Expected: {new Date(deal.closingDate).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Deal Actions */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                      <div className="flex space-x-1">
                                        <button 
                                          className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle email action
                                          }}
                                        >
                                          <Mail className="h-3 w-3" />
                                        </button>
                                        <button 
                                          className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle call action
                                          }}
                                        >
                                          <Phone className="h-3 w-3" />
                                        </button>
                                        <button 
                                          className="p-1 text-gray-400 hover:text-purple-600 rounded transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle schedule action
                                          }}
                                        >
                                          <Calendar className="h-3 w-3" />
                                        </button>
                                      </div>
                                      <span className="text-xs text-gray-400">
                                        View details →
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        </div>
                        {provided.placeholder}
                        
                        {/* Empty State */}
                        {stageDeals.length === 0 && (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Plus className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">No deals in this stage</p>
                            <button
                              onClick={() => onAddDeal(stage.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              data-testid={`button-add-first-deal-${stage.id}`}
                            >
                              Add your first deal
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ImprovedDealKanbanView;