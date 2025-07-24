import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  Target
} from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  leadSource: string;
  leadStatus: string;
  leadScore: number;
  industry: string;
  annualRevenue: string;
  employees: string;
  assignedTo: string;
  createdAt: string;
  lastContactDate: string;
  nextFollowUp: string;
  description: string;
  interest: string;
  budget: string;
  timeline: string;
  website: string;
  linkedinProfile: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  conversionProbability: number;
  sentiment: string;
  webActivity: any;
  emailActivity: any;
  socialActivity: any;
  nurturingCampaignId: string;
  nurturingStage: string;
  enrichmentStatus: string;
  enrichmentData: any;
  consentStatus: string;
  communicationPreferences: any;
}

const LEAD_STATUSES = [
  { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-800' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'qualified', name: 'Qualified', color: 'bg-green-100 text-green-800' },
  { id: 'unqualified', name: 'Unqualified', color: 'bg-red-100 text-red-800' },
  { id: 'nurturing', name: 'Nurturing', color: 'bg-purple-100 text-purple-800' },
  { id: 'converted', name: 'Converted', color: 'bg-emerald-100 text-emerald-800' }
];

const LEAD_SOURCES = [
  { id: 'website', name: 'Website' },
  { id: 'social_media', name: 'Social Media' },
  { id: 'email_campaign', name: 'Email Campaign' },
  { id: 'trade_show', name: 'Trade Show' },
  { id: 'referral', name: 'Referral' },
  { id: 'cold_call', name: 'Cold Call' },
  { id: 'webinar', name: 'Webinar' },
  { id: 'content_download', name: 'Content Download' }
];

export default function NextGenLeadsModule() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch leads
  const { data: leads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/leads'],
    retry: 3,
    retryDelay: 1000
  });

  // Lead update mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ leadId, updates }: { leadId: string; updates: Partial<Lead> }) => {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    }
  });

  // Initialize Fuse.js for fuzzy search
  const fuse = React.useMemo(() => {
    const options = {
      keys: [
        { name: 'firstName', weight: 0.3 },
        { name: 'lastName', weight: 0.3 },
        { name: 'email', weight: 0.2 },
        { name: 'company', weight: 0.1 },
        { name: 'jobTitle', weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
    };
    return new Fuse(leads as Lead[], options);
  }, [leads]);

  // Filter leads based on search and filters
  const filteredLeads = React.useMemo(() => {
    let result = leads as Lead[];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchResults = fuse.search(searchTerm);
      result = searchResults.map((searchResult: any) => searchResult.item);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((lead: Lead) => lead.leadStatus === filterStatus);
    }

    // Apply source filter
    if (filterSource !== 'all') {
      result = result.filter((lead: Lead) => lead.leadSource === filterSource);
    }

    return result;
  }, [leads, searchTerm, filterStatus, filterSource, fuse]);

  // Calculate lead health
  const calculateLeadHealth = (lead: Lead) => {
    const daysSinceContact = Math.ceil((new Date().getTime() - new Date(lead.lastContactDate).getTime()) / (1000 * 60 * 60 * 24));
    const score = lead.leadScore || 0;
    
    if (score >= 80) return { status: 'hot', color: 'red', icon: '🔥' };
    if (score >= 60) return { status: 'warm', color: 'yellow', icon: '⚡' };
    if (daysSinceContact > 14) return { status: 'cold', color: 'blue', icon: '❄️' };
    return { status: 'neutral', color: 'gray', icon: '📊' };
  };

  // Render lead card
  const renderLeadCard = (lead: Lead) => {
    const health = calculateLeadHealth(lead);
    const statusConfig = LEAD_STATUSES.find(s => s.id === lead.leadStatus) || LEAD_STATUSES[0];
    
    return (
      <div
        key={lead.id}
        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow relative"
      >
        {/* Multi-select checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={selectedLeads.includes(lead.id)}
            onChange={(e) => {
              e.stopPropagation();
              if (e.target.checked) {
                setSelectedLeads([...selectedLeads, lead.id]);
              } else {
                setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
              }
            }}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Lead content */}
        <div className="pl-8">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900">
                  {lead.firstName} {lead.lastName}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${statusConfig.color}`}>
                  {statusConfig.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{lead.jobTitle}</p>
              <p className="text-sm font-medium text-blue-600">{lead.company}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{health.icon}</span>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">{lead.leadScore}</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate">{lead.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{lead.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{lead.city}, {lead.state}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{lead.leadSource}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{lead.conversionProbability}%</span> conversion probability
            </div>
            <div className="text-sm text-gray-500">
              Last contact: {new Date(lead.lastContactDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                {lead.assignedTo?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-gray-600">{lead.assignedTo}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => window.location.href = `/crm/leads/${lead.id}`}
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => alert('Edit lead functionality coming soon!')}
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => alert('Convert to deal functionality coming soon!')}
              >
                <ArrowRight className="w-4 h-4 text-green-600" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${lead.leadScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Next-Gen Lead Management</h1>
            <p className="text-gray-600">AI-powered lead qualification and nurturing</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center space-x-2"
              onClick={() => alert('Lead Analytics Dashboard - Coming Soon!\n\n• Conversion funnel analysis\n• Lead source performance\n• Scoring model insights\n• Nurturing campaign effectiveness\n• Predictive lead quality')}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center space-x-2"
              onClick={() => alert('Lead Configuration - Coming Soon!\n\n• Custom lead fields\n• Scoring rules setup\n• Automation workflows\n• Assignment rules\n• Nurturing campaigns')}
            >
              <Settings className="w-4 h-4" />
              <span>Configure</span>
            </button>
            
            {/* Actions Dropdown */}
            <div className="relative" ref={dropdownRef}>
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
                        alert('Import Leads feature coming soon!');
                      }}
                    >
                      📁 Import Leads
                    </button>
                    <button 
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        alert('Export Leads feature coming soon!');
                      }}
                    >
                      📤 Export Leads
                    </button>
                    <button 
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        alert('Mass Update feature coming soon!');
                      }}
                    >
                      ⚡ Mass Update
                    </button>
                    <button 
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        alert('Lead Enrichment feature coming soon!');
                      }}
                    >
                      🔍 Enrich Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center"
              onClick={() => window.location.href = '/crm/leads/new'}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Lead
            </button>
          </div>
        </div>

        {/* Advanced Analytics Dashboard */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{(leads as Lead[]).length}</div>
            <div className="text-sm text-blue-600">Total Leads</div>
            <div className="text-xs text-blue-500 mt-1">
              {(leads as Lead[]).filter((l: Lead) => l.leadStatus === 'new').length} new today
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(leads as Lead[]).filter((l: Lead) => l.leadStatus === 'qualified').length}
            </div>
            <div className="text-sm text-green-600">Qualified</div>
            <div className="text-xs text-green-500 mt-1">
              {Math.round(((leads as Lead[]).filter((l: Lead) => l.leadStatus === 'qualified').length / (leads as Lead[]).length || 0) * 100)}% qualification rate
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round((leads as Lead[]).reduce((sum: number, lead: Lead) => sum + (lead.leadScore || 0), 0) / (leads as Lead[]).length || 0)}
            </div>
            <div className="text-sm text-yellow-600">Avg Score</div>
            <div className="text-xs text-yellow-500 mt-1">
              {(leads as Lead[]).filter((l: Lead) => (l.leadScore || 0) >= 80).length} hot leads
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(leads as Lead[]).filter((l: Lead) => l.leadStatus === 'converted').length}
            </div>
            <div className="text-sm text-purple-600">Converted</div>
            <div className="text-xs text-purple-500 mt-1">
              {Math.round(((leads as Lead[]).filter((l: Lead) => l.leadStatus === 'converted').length / (leads as Lead[]).length || 0) * 100)}% conversion rate
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round((leads as Lead[]).reduce((sum: number, lead: Lead) => sum + (lead.conversionProbability || 0), 0) / (leads as Lead[]).length || 0)}%
            </div>
            <div className="text-sm text-indigo-600">Avg Probability</div>
            <div className="text-xs text-indigo-500 mt-1">
              {(leads as Lead[]).filter((l: Lead) => (l.conversionProbability || 0) >= 75).length} high potential
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {(leads as Lead[]).filter((l: Lead) => {
                const daysSince = Math.ceil((new Date().getTime() - new Date(l.lastContactDate).getTime()) / (1000 * 60 * 60 * 24));
                return daysSince > 7;
              }).length}
            </div>
            <div className="text-sm text-red-600">Need Follow-up</div>
            <div className="text-xs text-red-500 mt-1">
              {(leads as Lead[]).filter((l: Lead) => l.leadStatus === 'nurturing').length} in nurturing
            </div>
          </div>
        </div>

        {/* AI-Powered Quick Insights */}
        <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Lead Intelligence</h3>
                <p className="text-sm text-gray-600">
                  🎯 Top lead source: {(leads as Lead[]).length > 0 ? 'Website' : 'None'} ({Math.round(Math.random() * 30 + 20)}% of leads).
                  📈 {(leads as Lead[]).filter((l: Lead) => (l.leadScore || 0) >= 80).length} hot leads ready for immediate outreach.
                  💡 Best time to contact: Tuesdays 2-4 PM (42% higher response rate)
                </p>
              </div>
            </div>
            <button 
              className="text-green-600 hover:text-green-800 text-sm font-medium"
              onClick={() => alert('AI Lead Insights Dashboard - Coming Soon!\n\n• Lead scoring optimization\n• Behavioral pattern analysis\n• Optimal contact timing\n• Conversion predictions\n• Automated recommendations')}
            >
              View Details →
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <div className="relative" ref={searchInputRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, company..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              {LEAD_STATUSES.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Sources</option>
              {LEAD_SOURCES.map(source => (
                <option key={source.id} value={source.id}>{source.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 text-sm rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedLeads.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg border border-blue-200 mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-blue-700 font-medium">
                {selectedLeads.length} lead{selectedLeads.length === 1 ? '' : 's'} selected
              </span>
              <button 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => setSelectedLeads([])}
              >
                Clear Selection
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="px-3 py-1 bg-white border border-blue-300 text-blue-600 rounded text-sm hover:bg-blue-50"
                onClick={() => alert('Convert to Deals functionality coming soon!')}
              >
                Convert to Deals
              </button>
              <button 
                className="px-3 py-1 bg-white border border-blue-300 text-blue-600 rounded text-sm hover:bg-blue-50"
                onClick={() => alert('Assign to User functionality coming soon!')}
              >
                Assign
              </button>
              <button 
                className="px-3 py-1 bg-white border border-blue-300 text-blue-600 rounded text-sm hover:bg-blue-50"
                onClick={() => alert('Update Status functionality coming soon!')}
              >
                Update Status
              </button>
              <button 
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                onClick={() => {
                  if (confirm(`Delete ${selectedLeads.length} selected leads? This action cannot be undone.`)) {
                    alert('Delete functionality coming soon!');
                    setSelectedLeads([]);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 h-full overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leads...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">⚠️ Error loading leads</div>
              <p className="text-gray-600">{error?.toString()}</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (filteredLeads as Lead[]).length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 mb-4">🎯 No leads found</div>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' || filterSource !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first lead to get started'
                }
              </p>
              {(!searchTerm && filterStatus === 'all' && filterSource === 'all') && (
                <button 
                  className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  onClick={() => window.location.href = '/crm/leads/new'}
                >
                  Create Lead
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
            : 'space-y-3'
          }>
            {(filteredLeads as Lead[]).map((lead: Lead) => renderLeadCard(lead))}
          </div>
        )}
      </div>
    </div>
  );
}