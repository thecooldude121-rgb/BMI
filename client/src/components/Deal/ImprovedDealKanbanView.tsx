import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, MoreHorizontal, Calendar, DollarSign, 
  User, Clock, Target, Star, Building2, Phone, Mail, 
  ChevronDown, Settings, Download, Upload, FileText,
  ArrowUp, ArrowDown, TrendingUp, AlertCircle, CheckCircle2,
  Eye, Edit3, Users, Activity, Zap, Award, MessageCircle,
  ChevronRight, X, RefreshCw, BarChart3, TrendingDown
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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <style>{`
        .kanban-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .kanban-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .kanban-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .kanban-scroll::-webkit-scrollbar-thumb:hover {
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
      {/* Enhanced Modern Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-lg"
      >
        <div className="px-8 py-6">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Sales Pipeline
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Activity className="h-4 w-4 mr-1 text-blue-500" />
                    Real-time deal tracking & management
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              {/* Enhanced Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search deals, contacts, amounts..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onFiltersChange({ ...filters, searchTerm: e.target.value });
                  }}
                  className="pl-12 pr-4 py-3 w-80 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
                  data-testid="input-search-deals"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      onFiltersChange({ ...filters, searchTerm: '' });
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    showFilters 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'bg-white/80 text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                  data-testid="button-toggle-filters"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <button className="flex items-center px-4 py-3 bg-white/80 text-gray-700 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </button>

                <button className="flex items-center px-4 py-3 bg-white/80 text-gray-700 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>

                <button 
                  onClick={() => onAddDeal(pipeline.stages[0]?.id)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  data-testid="button-add-deal"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Deal
                </button>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Pipeline Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-4 gap-4"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200/50 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Total Pipeline</span>
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalPipelineValue)}</span>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{filteredDeals.length} active deals</span>
                  <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>

            {pipeline.stages.slice(0, 3).map((stage, index) => {
              const stageDeals = getStageDeals(stage.id);
              const stageValue = getStageValue(stage.id);
              
              return (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200/50 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-sm font-semibold text-gray-700">{stage.name}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(stageValue)}</span>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{stageDeals.length} deals</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{stage.probability}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-200/50 backdrop-blur-sm"
          >
            <div className="px-8 py-6">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Advanced Filters
                </h3>
                <button
                  onClick={() => {
                    onFiltersChange({});
                    setSearchTerm('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center px-3 py-1 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Clear All
                </button>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700">Pipeline Stage</label>
                  <div className="relative">
                    <select
                      value={filters.stageId || 'all'}
                      onChange={(e) => onFiltersChange({ ...filters, stageId: e.target.value === 'all' ? undefined : e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                      data-testid="select-stage-filter"
                    >
                      <option value="all">All Stages</option>
                      {pipeline.stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700">Deal Owner</label>
                  <div className="relative">
                    <select
                      value={filters.ownerId || 'all'}
                      onChange={(e) => onFiltersChange({ ...filters, ownerId: e.target.value === 'all' ? undefined : e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                      data-testid="select-owner-filter"
                    >
                      <option value="all">All Team Members</option>
                      {Array.from(new Set(deals.map(deal => deal.ownerId))).map((ownerId) => (
                        <option key={ownerId} value={ownerId}>{ownerId}</option>
                      ))}
                    </select>
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700">Deal Value Range</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none cursor-pointer">
                      <option>All Values</option>
                      <option>$0 - $10K</option>
                      <option>$10K - $50K</option>
                      <option>$50K - $100K</option>
                      <option>$100K+</option>
                    </select>
                    <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700">Timeline</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none cursor-pointer">
                      <option>All Time</option>
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Quarter</option>
                      <option>This Year</option>
                    </select>
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>
              </div>

              {/* Quick Filter Tags */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 pt-4 border-t border-gray-200"
              >
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'High Priority', icon: AlertCircle, color: 'bg-red-100 text-red-700 hover:bg-red-200' },
                    { label: 'Closing Soon', icon: Clock, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
                    { label: 'High Value', icon: TrendingUp, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
                    { label: 'Stalled', icon: TrendingDown, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
                    { label: 'Won Deals', icon: CheckCircle2, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' }
                  ].map((tag, index) => (
                    <motion.button
                      key={tag.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={`flex items-center px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${tag.color}`}
                    >
                      <tag.icon className="h-3 w-3 mr-1" />
                      {tag.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 py-6 kanban-scroll">
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex space-x-8 h-full min-w-max pb-4"
            style={{ width: 'max-content' }}
          >
            {pipeline.stages.map((stage, stageIndex) => {
              const stageDeals = getStageDeals(stage.id);
              const stageValue = getStageValue(stage.id);
              
              return (
                <motion.div 
                  key={stage.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + stageIndex * 0.1 }}
                  className="flex-shrink-0 w-[500px]"
                >
                  {/* Enhanced Stage Header */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 mb-6 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div 
                              className="w-4 h-4 rounded-full shadow-md ring-2 ring-white" 
                              style={{ backgroundColor: stage.color }}
                            />
                            <div 
                              className="absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-20"
                              style={{ backgroundColor: stage.color }}
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{stage.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {stageDeals.length} deal{stageDeals.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onAddDeal(stage.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            data-testid={`button-add-deal-${stage.id}`}
                          >
                            <Plus className="h-5 w-5" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-2xl font-bold text-gray-900">{formatCurrency(stageValue)}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{stage.probability}% avg close rate</span>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((stageDeals.length / Math.max(...pipeline.stages.map(s => getStageDeals(s.id).length))) * 100, 100)}%` }}
                              transition={{ delay: 0.8 + stageIndex * 0.1, duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 mt-1 block">Activity</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Droppable Area */}
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[700px] max-h-[700px] overflow-y-auto rounded-2xl p-3 transition-all duration-300 stage-scroll ${
                          snapshot.isDraggingOver 
                            ? 'bg-gradient-to-b from-blue-50/80 to-indigo-50/80 border-2 border-dashed border-blue-400 shadow-2xl scale-105' 
                            : 'bg-transparent'
                        }`}
                      >
                        <AnimatePresence mode="popLayout">
                          <div className="space-y-4">
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
                                      className={`bg-white rounded-2xl border border-gray-200/50 p-6 cursor-pointer transition-all duration-300 group hover:shadow-2xl hover:border-gray-300 hover:-translate-y-1 hover:scale-[1.02] ${
                                        snapshot.isDragging 
                                          ? 'shadow-2xl rotate-3 scale-110 border-blue-400 ring-4 ring-blue-100' 
                                          : 'shadow-lg hover:shadow-xl'
                                      }`}
                                      data-testid={`card-deal-${deal.id}`}
                                    >
                                      {/* Enhanced Deal Header */}
                                      <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0 space-y-2">
                                          <div className="flex items-start space-x-2">
                                            <div className={`p-1.5 rounded-lg ${priority.color} flex-shrink-0`}>
                                              <priority.icon className="h-3 w-3" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
                                                {deal.name}
                                              </h4>
                                              <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block">
                                                #{deal.dealNumber}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        <motion.button 
                                          whileHover={{ scale: 1.1 }}
                                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </motion.button>
                                      </div>

                                      {/* Enhanced Deal Value */}
                                      <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                                        <div className="space-y-1">
                                          <span className="text-2xl font-bold text-green-700">
                                            {formatCurrency(deal.amount, deal.currency)}
                                          </span>
                                          <p className="text-xs text-green-600">Deal Value</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-16 bg-green-200 rounded-full h-2 overflow-hidden">
                                              <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${deal.probability}%` }}
                                                transition={{ delay: 0.5, duration: 0.8 }}
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                                              />
                                            </div>
                                            <span className="text-sm font-bold text-green-700">
                                              {deal.probability}%
                                            </span>
                                          </div>
                                          <p className="text-xs text-green-600">Confidence</p>
                                        </div>
                                      </div>

                                      {/* Enhanced Deal Metadata */}
                                      <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                              <User className="h-3 w-3 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate">{deal.ownerId}</span>
                                          </div>
                                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">{deal.country}</span>
                                        </div>

                                        {deal.closingDate && (
                                          <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                              <Calendar className="h-3 w-3 text-orange-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-orange-700">Expected Close</p>
                                              <p className="text-xs text-orange-600">{new Date(deal.closingDate).toLocaleDateString()}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Enhanced Deal Actions */}
                                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex space-x-1">
                                          {[
                                            { icon: Mail, color: 'hover:text-blue-600 hover:bg-blue-50', action: 'email' },
                                            { icon: Phone, color: 'hover:text-green-600 hover:bg-green-50', action: 'call' },
                                            { icon: MessageCircle, color: 'hover:text-purple-600 hover:bg-purple-50', action: 'message' },
                                            { icon: Users, color: 'hover:text-indigo-600 hover:bg-indigo-50', action: 'meeting' }
                                          ].map((actionBtn, idx) => (
                                            <motion.button 
                                              key={idx}
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.95 }}
                                              className={`p-2 text-gray-400 rounded-lg transition-all ${actionBtn.color}`}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle action
                                              }}
                                            >
                                              <actionBtn.icon className="h-4 w-4" />
                                            </motion.button>
                                          ))}
                                        </div>
                                        <motion.div 
                                          whileHover={{ x: 4 }}
                                          className="flex items-center text-xs text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                          <span className="mr-1">View Details</span>
                                          <ChevronRight className="h-3 w-3" />
                                        </motion.div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                          </div>
                        </AnimatePresence>
                        {provided.placeholder}
                        
                        {/* Enhanced Empty State */}
                        {stageDeals.length === 0 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center py-12"
                          >
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                            >
                              <Plus className="h-8 w-8 text-gray-400" />
                            </motion.div>
                            <h4 className="text-lg font-semibold text-gray-600 mb-2">No deals yet</h4>
                            <p className="text-sm text-gray-500 mb-4">This stage is ready for your first deal</p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onAddDeal(stage.id)}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                              data-testid={`button-add-first-deal-${stage.id}`}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Deal
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              );
            })}
          </motion.div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ImprovedDealKanbanView;