import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, MoreVertical, Play, Pause, Copy, 
  Archive, Edit3, Eye, Users, Mail, Phone, Calendar,
  TrendingUp, Clock, Target, Grid, List, SortAsc, SortDesc, MoreHorizontal
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
  activeCount?: number;
  pausedCount?: number;
  notSentCount?: number;
  bouncedCount?: number;
  spamBlockCount?: number;
  finishedCount?: number;
  scheduledCount?: number;
  deliveredCount?: number;
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
  const [sortBy, setSortBy] = useState<string>('prospects');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSequences, setSelectedSequences] = useState<string[]>([]);
  const [showAllSequencesDropdown, setShowAllSequencesDropdown] = useState(false);
  const [selectedView, setSelectedView] = useState('All Sequences');

  // Mock data - replace with API call
  const mockSequences: Sequence[] = [
    {
      id: '1',
      name: 'LMX-CMS | Hospitality Industry',
      description: 'Hospitality industry outreach sequence',
      status: 'active',
      type: 'mixed',
      steps: 7,
      prospects: 6647,
      replied: 65,
      opened: 4978,
      clicked: 398,
      booked: 65,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: 'WE',
      tags: ['hospitality', 'cms', 'industry'],
      replyRate: 1,
      openRate: 0.1,
      clickRate: 21.8,
      bookingRate: 7.7,
      activeCount: 6647,
      pausedCount: 62,
      notSentCount: 172,
      bouncedCount: 124,
      spamBlockCount: 98,
      finishedCount: 398,
      scheduledCount: 3097,
      deliveredCount: 4978
    },
    {
      id: '2', 
      name: 'LMX | Media Owners Europe',
      description: 'European media owners outreach',
      status: 'active',
      type: 'mixed',
      steps: 5,
      prospects: 578,
      replied: 9,
      opened: 526,
      clicked: 10,
      booked: 3,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      createdBy: 'WE',
      tags: ['media', 'europe', 'owners'],
      replyRate: 1.1,
      openRate: 0,
      clickRate: 13.5,
      bookingRate: 3.4,
      activeCount: 578,
      pausedCount: 9,
      notSentCount: 75,
      bouncedCount: 6,
      spamBlockCount: 25,
      finishedCount: 10,
      scheduledCount: 197,
      deliveredCount: 526
    },
    {
      id: '3',
      name: 'Healthcare Middle East',
      description: 'Middle East healthcare prospects',
      status: 'active',
      type: 'email',
      steps: 4,
      prospects: 55,
      replied: 3,
      opened: 48,
      clicked: 14,
      booked: 1,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-16',
      createdBy: 'WE',
      tags: ['healthcare', 'middle-east', 'medical'],
      replyRate: 0,
      openRate: 0,
      clickRate: 28.6,
      bookingRate: 9.0,
      activeCount: 55,
      pausedCount: 0,
      notSentCount: 1,
      bouncedCount: 0,
      spamBlockCount: 3,
      finishedCount: 14,
      scheduledCount: 34,
      deliveredCount: 48
    },
    {
      id: '4',
      name: 'LMX | Media Owners Saudi Arabia',
      description: 'Saudi Arabia media owners campaign',
      status: 'active',
      type: 'mixed',
      steps: 6,
      prospects: 51,
      replied: 1,
      opened: 133,
      clicked: 10,
      booked: 1,
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
      createdBy: 'WE',
      tags: ['media', 'saudi', 'arabia'],
      replyRate: 0,
      openRate: 0,
      clickRate: 0,
      bookingRate: 0,
      activeCount: 51,
      pausedCount: 0,
      notSentCount: 1,
      bouncedCount: 1,
      spamBlockCount: 0,
      finishedCount: 10,
      scheduledCount: 30,
      deliveredCount: 133
    },
    {
      id: '5',
      name: 'CMS Competitors (Europe)',
      description: 'European CMS competitor analysis',
      status: 'active',
      type: 'email',
      steps: 4,
      prospects: 52,
      replied: 0,
      opened: 18,
      clicked: 34,
      booked: 0,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-18',
      createdBy: 'WE',
      tags: ['cms', 'competitors', 'europe'],
      replyRate: 0,
      openRate: 0,
      clickRate: 0,
      bookingRate: 0,
      activeCount: 52,
      pausedCount: 0,
      notSentCount: 4,
      bouncedCount: 0,
      spamBlockCount: 0,
      finishedCount: 0,
      scheduledCount: 34,
      deliveredCount: 18
    },
    {
      id: '6',
      name: 'LMX | Media Owners Kuwait',
      description: 'Kuwait media owners outreach',
      status: 'active',
      type: 'mixed',
      steps: 3,
      prospects: 15,
      replied: 4,
      opened: 69,
      clicked: 6,
      booked: 2,
      createdAt: '2024-01-17',
      updatedAt: '2024-01-17',
      createdBy: 'WE',
      tags: ['media', 'kuwait', 'owners'],
      replyRate: 7.2,
      openRate: 2.9,
      clickRate: 0,
      bookingRate: 0,
      activeCount: 15,
      pausedCount: 0,
      notSentCount: 1,
      bouncedCount: 0,
      spamBlockCount: 4,
      finishedCount: 6,
      scheduledCount: 2,
      deliveredCount: 69
    },
    {
      id: '7',
      name: 'CMS Competitors (France)',
      description: 'French CMS competitor research',
      status: 'active',
      type: 'email',
      steps: 2,
      prospects: 8,
      replied: 0,
      opened: 8,
      clicked: 0,
      booked: 0,
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16',
      createdBy: 'WE',
      tags: ['cms', 'france', 'competitors'],
      replyRate: 0,
      openRate: 0,
      clickRate: 0,
      bookingRate: 0,
      activeCount: 8,
      pausedCount: 0,
      notSentCount: 0,
      bouncedCount: 0,
      spamBlockCount: 0,
      finishedCount: 0,
      scheduledCount: 8,
      deliveredCount: 0
    },
    {
      id: '8',
      name: 'LMX | Media Owners MENA',
      description: 'MENA region media owners',
      status: 'paused',
      type: 'mixed',
      steps: 5,
      prospects: 0,
      replied: 3,
      opened: 1091,
      clicked: 5,
      booked: 1,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      createdBy: 'WE',
      tags: ['media', 'mena', 'owners'],
      replyRate: 1,
      openRate: 0.1,
      clickRate: 0,
      bookingRate: 0,
      activeCount: 0,
      pausedCount: 918,
      notSentCount: 37,
      bouncedCount: 1,
      spamBlockCount: 3,
      finishedCount: 5,
      scheduledCount: 0,
      deliveredCount: 1091
    },
    {
      id: '9',
      name: 'MO-UAE',
      description: 'UAE media owners campaign',
      status: 'active',
      type: 'email',
      steps: 3,
      prospects: 43,
      replied: 1,
      opened: 43,
      clicked: 0,
      booked: 0,
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14',
      createdBy: 'WE',
      tags: ['uae', 'media', 'owners'],
      replyRate: 0,
      openRate: 0,
      clickRate: 0,
      bookingRate: 0,
      activeCount: 43,
      pausedCount: 0,
      notSentCount: 6,
      bouncedCount: 1,
      spamBlockCount: 1,
      finishedCount: 0,
      scheduledCount: 0,
      deliveredCount: 43
    },
    {
      id: '10',
      name: 'LMX | Media Owners North America',
      description: 'North American media owners outreach',
      status: 'paused',
      type: 'mixed',
      steps: 4,
      prospects: 0,
      replied: 1,
      opened: 19,
      clicked: 1,
      booked: 0,
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13',
      createdBy: 'WE',
      tags: ['media', 'north-america', 'owners'],
      replyRate: 5.3,
      openRate: 0,
      clickRate: 0,
      bookingRate: 0,
      activeCount: 0,
      pausedCount: 17,
      notSentCount: 1,
      bouncedCount: 1,
      spamBlockCount: 0,
      finishedCount: 1,
      scheduledCount: 0,
      deliveredCount: 19
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

    // Sort sequences by prospects descending (largest first) by default
    filtered.sort((a, b) => {
      if (sortBy === 'prospects') {
        return sortOrder === 'desc' ? b.prospects - a.prospects : a.prospects - b.prospects;
      }
      
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
    <div className="h-full overflow-auto bg-gray-900 text-white">
      {/* Header with Tabs */}
      <div className="border-b border-gray-700 bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-white">Sequences</h1>
            <div className="flex items-center space-x-1">
              <button className="px-4 py-2 text-sm font-medium text-white border-b-2 border-white">
                All Sequences
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
                Analytics
              </button>
              <button className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded">
                New
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
                Diagnostics
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-800 rounded">
              <span className="text-gray-400">?</span>
            </button>
            <button
              onClick={() => navigateTo('/sequences/create')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium"
              data-testid="button-create-sequence"
            >
              Create sequence
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="px-6 py-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* All Sequences Dropdown */}
            <div className="relative flex items-center space-x-2">
              <button
                onClick={() => setShowAllSequencesDropdown(!showAllSequencesDropdown)}
                className="bg-gray-800 rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors"
              >
                <Grid className="h-4 w-4" />
                <span className="text-sm">All Sequences</span>
                <span className="text-gray-400">▼</span>
              </button>

              {/* All Sequences Dropdown Panel */}
              {showAllSequencesDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 p-4">
                  {/* Search Views */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search views"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 text-sm"
                    />
                  </div>

                  {/* View Categories */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">All views</h4>
                      <button
                        onClick={() => {
                          setSelectedView('All Sequences');
                          setShowAllSequencesDropdown(false);
                        }}
                        className="w-full text-left flex items-center px-3 py-2 text-sm text-white hover:bg-gray-700 rounded"
                      >
                        <Grid className="h-4 w-4 mr-3" />
                        All Sequences
                        <span className="ml-auto text-xs text-gray-400">System</span>
                        {selectedView === 'All Sequences' && <span className="ml-2 text-blue-400">✓</span>}
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Your views</h4>
                      <div className="text-sm text-gray-400 italic">No custom views yet</div>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Starred</h4>
                      <div className="text-sm text-gray-400 italic">No starred views yet</div>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Shared</h4>
                      <div className="text-sm text-gray-400 italic">No shared views yet</div>
                    </div>
                  </div>

                  {/* Create New View Button */}
                  <div className="mt-4 pt-3 border-t border-gray-600">
                    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-medium text-sm">
                      Create new view
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Show Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white"
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4" />
              <span>Show Filters</span>
              <span className="bg-gray-700 text-xs px-2 py-1 rounded">1</span>
            </button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sequences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 w-64"
                data-testid="input-search-sequences"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-300 hover:text-white">
              Save as new view
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white">
              <span>Sort</span>
              <span>▼</span>
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white">
              <span>View options</span>
              <span>▼</span>
            </button>
          </div>
        </div>
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


      {/* Sequences Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <SequenceList sequences={filteredSequences} onAction={handleSequenceAction} />
      </div>

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

// Sequence List Component - Apollo.io style
const SequenceList: React.FC<{ sequences: Sequence[]; onAction: (action: string, id: string) => void }> = ({ 
  sequences, onAction 
}) => {
  const [selectedSequences, setSelectedSequences] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [openActionDropdown, setOpenActionDropdown] = useState<string | null>(null);

  const toggleSequence = (sequenceId: string) => {
    setSelectedSequences(prev => 
      prev.includes(sequenceId) 
        ? prev.filter(id => id !== sequenceId)
        : [...prev, sequenceId]
    );
  };

  return (
    <div className="bg-gray-900 h-full flex flex-col">
      {/* Unified Scrollable Container */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Fixed Header Row */}
          <div className="sticky top-0 z-20 bg-gray-800 border-b border-gray-700">
            <div className="flex min-w-[1400px]">
              {/* Frozen Columns: ACTIVATE & NAME */}
              <div className="sticky left-0 z-30 bg-gray-800 flex border-r border-gray-600">
                <div className="w-[140px] px-4 py-3 flex items-center text-xs font-medium text-gray-300 uppercase tracking-wide">
                  <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700" />
                  ACTIVATE
                </div>
                <div className="w-[240px] px-4 py-3 text-xs font-medium text-gray-300 uppercase tracking-wide">
                  NAME
                </div>
              </div>
              
              {/* Scrollable Columns */}
              <div className="flex">
                <div className="w-[120px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">CREATED BY</div>
                <div className="w-[100px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">ACTIVE</div>
                <div className="w-[100px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">PAUSED</div>
                <div className="w-[100px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">NOT SENT</div>
                <div className="w-[100px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">BOUNCED</div>
                <div className="w-[120px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">SPAM BLOCK</div>
                <div className="w-[100px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">FINISHED</div>
                <div className="w-[120px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">SCHEDULED</div>
                <div className="w-[120px] px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">DELIVERED</div>
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div>
          {sequences.map((sequence) => (
            <motion.div
              key={sequence.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex border-b border-gray-700 hover:bg-gray-800 cursor-pointer text-sm text-white min-w-[1400px]"
              onClick={() => navigateTo(`/sequences/${sequence.id}`)}
              data-testid={`row-sequence-${sequence.id}`}
            >
              {/* Frozen Columns: ACTIVATE & NAME */}
              <div className="sticky left-0 z-10 bg-gray-900 hover:bg-gray-800 flex border-r border-gray-600">
                {/* Activate Toggle */}
                <div className="w-[140px] px-4 py-4 flex items-center justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={sequence.status === 'active'}
                      onChange={(e) => {
                        e.stopPropagation();
                        onAction(sequence.status === 'active' ? 'pause' : 'activate', sequence.id);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                  </label>
                </div>

                {/* Name */}
                <div className="w-[240px] px-4 py-4 flex items-center space-x-3">
                  {(sequence.name.includes('LMX') || sequence.name.includes('Media')) && (
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                      WE
                    </div>
                  )}
                  <div className="font-medium text-white truncate">{sequence.name}</div>
                </div>
              </div>
              
              {/* Scrollable Columns */}
              <div className="flex">
                {/* Created By */}
                <div className="w-[120px] px-4 py-4 flex items-center justify-center text-gray-300">
                  WE
                </div>

                {/* Active */}
                <div className="w-[100px] px-4 py-4 flex items-center justify-center text-white">
                  {sequence.activeCount || '-'}
                </div>

                {/* Paused */}
                <div className="w-[100px] px-4 py-4 flex items-center justify-center text-white">
                  {sequence.pausedCount || '-'}
                </div>

                {/* Not Sent */}
                <div className="w-[100px] px-4 py-4 flex items-center justify-center text-white">
                  {sequence.notSentCount || '-'}
                </div>

                {/* Bounced */}
                <div className="w-[100px] px-4 py-4 flex items-center justify-center text-white">
                  {sequence.bouncedCount || '-'}
                </div>

                {/* Spam Block */}
                <div className="w-[120px] px-4 py-4 flex items-center justify-center text-white">
                  {sequence.spamBlockCount || '-'}
                </div>

                {/* Finished */}
                <div className="w-[100px] px-4 py-4 flex items-center justify-center text-white">
                  {sequence.finishedCount || '-'}
                </div>

                {/* Scheduled */}
                <div className="w-[120px] px-4 py-4 flex items-center justify-center text-white">
                  {sequence.scheduledCount || '-'}
                </div>

                {/* Delivered */}
                <div className="w-[120px] px-4 py-4 flex items-center justify-center text-white">
                  {sequence.deliveredCount || '-'}
                </div>

                {/* Actions */}
                <div className="w-[100px] px-4 py-4 flex items-center justify-center text-white relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(showMenu === sequence.id ? null : sequence.id);
                    }}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {/* Actions Menu */}
                  {showMenu === sequence.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2 z-20 min-w-[120px]"
                    >
                      <button 
                        onClick={() => {
                          onAction('share', sequence.id);
                          setShowMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        data-testid={`action-share-${sequence.id}`}
                      >
                        Share
                      </button>
                      <button 
                        onClick={() => {
                          onAction('clone', sequence.id);
                          setShowMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        data-testid={`action-clone-${sequence.id}`}
                      >
                        Clone
                      </button>
                      <button 
                        onClick={() => {
                          onAction('edit', sequence.id);
                          setShowMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        data-testid={`action-edit-${sequence.id}`}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          onAction('delete', sequence.id);
                          setShowMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                        data-testid={`action-delete-${sequence.id}`}
                      >
                        Delete
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Pagination */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <span>1</span>
          <span className="mx-2">1 - 14 of 14</span>
        </div>
        <div className="bg-blue-600 p-2 rounded-full">
          <span className="text-white text-xs">?</span>
        </div>
      </div>
    </div>
  );
};

export default SequenceDashboard;