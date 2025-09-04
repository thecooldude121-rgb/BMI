import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, MoreVertical, Play, Pause, Copy, 
  Archive, Edit3, Eye, Users, Mail, Phone, Calendar,
  TrendingUp, Clock, Target, Grid, List, SortAsc, SortDesc
} from 'lucide-react';
import { navigateTo } from '../../utils/navigation';

// Mock sequence data - structured for real backend integration
interface Sequence {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft' | 'archived';
  type: 'email' | 'call' | 'mixed';
  steps: number;
  prospects: number;
  replied: number;
  opened: number;
  clicked: number;
  booked: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  replyRate: number;
  openRate: number;
  clickRate: number;
  bookingRate: number;
}

/**
 * Main Sequence Dashboard - Apollo.io inspired design
 * Features: Card/List view, filtering, sorting, quick actions
 * TODO: Connect to backend API for real sequence data
 */
const SequenceDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSequences, setSelectedSequences] = useState<string[]>([]);

  // Mock data - replace with API call
  const mockSequences: Sequence[] = [
    {
      id: '1',
      name: 'SaaS Demo Follow-up',
      description: 'Follow up sequence for SaaS demo prospects',
      status: 'active',
      type: 'mixed',
      steps: 7,
      prospects: 156,
      replied: 23,
      opened: 89,
      clicked: 34,
      booked: 12,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: 'Sarah Johnson',
      tags: ['demo', 'saas', 'high-value'],
      replyRate: 14.7,
      openRate: 57.1,
      clickRate: 21.8,
      bookingRate: 7.7
    },
    {
      id: '2', 
      name: 'Cold Outreach - Enterprise',
      description: 'Initial outreach for enterprise prospects',
      status: 'active',
      type: 'email',
      steps: 5,
      prospects: 89,
      replied: 8,
      opened: 45,
      clicked: 12,
      booked: 3,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      createdBy: 'Mike Chen',
      tags: ['cold', 'enterprise', 'outreach'],
      replyRate: 9.0,
      openRate: 50.6,
      clickRate: 13.5,
      bookingRate: 3.4
    },
    {
      id: '3',
      name: 'Webinar Registration Follow-up',
      description: 'Nurture sequence for webinar attendees',
      status: 'paused',
      type: 'email',
      steps: 4,
      prospects: 234,
      replied: 45,
      opened: 178,
      clicked: 67,
      booked: 21,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-16',
      createdBy: 'Emily Rodriguez',
      tags: ['webinar', 'nurture', 'marketing'],
      replyRate: 19.2,
      openRate: 76.1,
      clickRate: 28.6,
      bookingRate: 9.0
    },
    {
      id: '4',
      name: 'Free Trial Activation',
      description: 'Onboard and activate free trial users',
      status: 'draft',
      type: 'mixed',
      steps: 6,
      prospects: 0,
      replied: 0,
      opened: 0,
      clicked: 0,
      booked: 0,
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
      createdBy: 'David Park',
      tags: ['trial', 'onboarding', 'activation'],
      replyRate: 0,
      openRate: 0,
      clickRate: 0,
      bookingRate: 0
    }
  ];

  // Filter and sort sequences
  const filteredSequences = useMemo(() => {
    let filtered = mockSequences.filter(seq => {
      const matchesSearch = seq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           seq.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           seq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || seq.status === statusFilter;
      const matchesType = typeFilter === 'all' || seq.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort sequences
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Sequence];
      let bValue: any = b[sortBy as keyof Sequence];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mockSequences, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'mixed': return <Target className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const handleSequenceAction = (action: string, sequenceId: string) => {
    switch (action) {
      case 'edit':
        navigateTo(`/sequences/${sequenceId}`);
        break;
      case 'preview':
        // TODO: Implement preview modal
        console.log('Preview sequence:', sequenceId);
        break;
      case 'clone':
        // TODO: Implement clone functionality
        console.log('Clone sequence:', sequenceId);
        break;
      case 'archive':
        // TODO: Implement archive functionality  
        console.log('Archive sequence:', sequenceId);
        break;
      case 'activate':
        // TODO: Implement activation
        console.log('Activate sequence:', sequenceId);
        break;
      case 'pause':
        // TODO: Implement pause
        console.log('Pause sequence:', sequenceId);
        break;
    }
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sequences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="input-search-sequences"
            />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
            data-testid="button-toggle-filters"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid="button-grid-view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid="button-list-view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => navigateTo('/sequences/create')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors hover:scale-105 transform"
          data-testid="button-create-sequence"
        >
          <Plus className="h-4 w-4" />
          <span>Create Sequence</span>
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center space-x-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  data-testid="select-status-filter"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  data-testid="select-type-filter"
                >
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="select-sort-by"
                  >
                    <option value="updatedAt">Last Updated</option>
                    <option value="name">Name</option>
                    <option value="prospects">Prospects</option>
                    <option value="replyRate">Reply Rate</option>
                    <option value="openRate">Open Rate</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    data-testid="button-sort-order"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sequences</p>
              <p className="text-2xl font-bold text-gray-900">{filteredSequences.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sequences</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredSequences.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Prospects</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredSequences.reduce((sum, s) => sum + s.prospects, 0)}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Reply Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredSequences.length > 0 
                  ? (filteredSequences.reduce((sum, s) => sum + s.replyRate, 0) / filteredSequences.length).toFixed(1)
                  : '0'}%
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sequences Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSequences.map((sequence) => (
            <SequenceCard key={sequence.id} sequence={sequence} onAction={handleSequenceAction} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SequenceList sequences={filteredSequences} onAction={handleSequenceAction} />
        </div>
      )}

      {filteredSequences.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sequences found</h3>
          <p className="text-gray-600 mb-6">Create your first sequence to start engaging prospects.</p>
          <button
            onClick={() => navigateTo('/sequences/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            data-testid="button-create-first-sequence"
          >
            Create Your First Sequence
          </button>
        </div>
      )}
    </div>
  );
};

// Sequence Card Component
const SequenceCard: React.FC<{ sequence: Sequence; onAction: (action: string, id: string) => void }> = ({ 
  sequence, onAction 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 relative cursor-pointer"
      onClick={() => navigateTo(`/sequences/${sequence.id}`)}
      data-testid={`card-sequence-${sequence.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${sequence.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : sequence.status === 'paused' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : sequence.status === 'draft' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
              {sequence.status.toUpperCase()}
            </span>
            <div className="flex items-center space-x-1 text-gray-500">
              {sequence.type === 'email' && <Mail className="h-4 w-4" />}
              {sequence.type === 'call' && <Phone className="h-4 w-4" />}
              {sequence.type === 'mixed' && <Target className="h-4 w-4" />}
              <span className="text-xs capitalize">{sequence.type}</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{sequence.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{sequence.description}</p>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            data-testid={`button-sequence-menu-${sequence.id}`}
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('edit', sequence.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit3 className="h-4 w-4 mr-3" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('preview', sequence.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-3" />
                Preview
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('clone', sequence.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Copy className="h-4 w-4 mr-3" />
                Clone
              </button>
              {sequence.status === 'active' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('pause', sequence.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Pause className="h-4 w-4 mr-3" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('activate', sequence.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Play className="h-4 w-4 mr-3" />
                  Activate
                </button>
              )}
              <hr className="my-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('archive', sequence.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Archive className="h-4 w-4 mr-3" />
                Archive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Steps</p>
          <p className="text-lg font-semibold text-gray-900">{sequence.steps}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Prospects</p>
          <p className="text-lg font-semibold text-gray-900">{sequence.prospects}</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Reply Rate</span>
          <span className="text-xs font-medium text-gray-900">{sequence.replyRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${sequence.replyRate}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">Open Rate</span>
          <span className="text-xs font-medium text-gray-900">{sequence.openRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${sequence.openRate}%` }}
          ></div>
        </div>
      </div>

      {/* Tags */}
      {sequence.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {sequence.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {sequence.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{sequence.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>By {sequence.createdBy}</span>
        <span>{new Date(sequence.updatedAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
};

// Sequence List Component
const SequenceList: React.FC<{ sequences: Sequence[]; onAction: (action: string, id: string) => void }> = ({ 
  sequences, onAction 
}) => {
  return (
    <div>
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-3">Sequence</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Steps</div>
          <div className="col-span-1">Prospects</div>
          <div className="col-span-1">Replies</div>
          <div className="col-span-1">Opens</div>
          <div className="col-span-1">Reply Rate</div>
          <div className="col-span-1">Open Rate</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Rows */}
      <div>
        {sequences.map((sequence) => (
          <motion.div
            key={sequence.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => navigateTo(`/sequences/${sequence.id}`)}
            data-testid={`row-sequence-${sequence.id}`}
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                <div>
                  <p className="font-medium text-gray-900">{sequence.name}</p>
                  <p className="text-sm text-gray-500 truncate">{sequence.description}</p>
                </div>
              </div>
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${sequence.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : sequence.status === 'paused' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : sequence.status === 'draft' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                  {sequence.status}
                </span>
              </div>
              <div className="col-span-1">
                <div className="flex items-center space-x-1">
                  {sequence.type === 'email' && <Mail className="h-4 w-4 text-gray-400" />}
                  {sequence.type === 'call' && <Phone className="h-4 w-4 text-gray-400" />}
                  {sequence.type === 'mixed' && <Target className="h-4 w-4 text-gray-400" />}
                  <span className="text-sm text-gray-900 capitalize">{sequence.type}</span>
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-sm text-gray-900">{sequence.steps}</span>
              </div>
              <div className="col-span-1">
                <span className="text-sm text-gray-900">{sequence.prospects}</span>
              </div>
              <div className="col-span-1">
                <span className="text-sm text-gray-900">{sequence.replied}</span>
              </div>
              <div className="col-span-1">
                <span className="text-sm text-gray-900">{sequence.opened}</span>
              </div>
              <div className="col-span-1">
                <span className="text-sm font-medium text-gray-900">{sequence.replyRate}%</span>
              </div>
              <div className="col-span-1">
                <span className="text-sm font-medium text-gray-900">{sequence.openRate}%</span>
              </div>
              <div className="col-span-1">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction('edit', sequence.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction('clone', sequence.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Clone"
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                  </button>
                  {sequence.status === 'active' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction('pause', sequence.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Pause"
                    >
                      <Pause className="h-4 w-4 text-gray-400" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction('activate', sequence.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Activate"
                    >
                      <Play className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SequenceDashboard;