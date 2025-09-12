import React, { useState, useEffect } from 'react';
import { 
  Plus, Filter, Download, Upload, Search, LayoutGrid, List, 
  Users, Target, TrendingUp, DollarSign, Calendar, Phone, Mail, 
  Video, CheckSquare, MoreHorizontal, Star, Eye, Edit, Trash2,
  ArrowUpDown, ChevronDown, X, Settings, RefreshCw, Bell,
  Activity, Clock, Globe, Building, Tag, Zap, Bot, Sparkles
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { aiEngine } from '../../utils/aiEngine';

// Enhanced Lead interface with additional properties
interface EnhancedLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  industry: string;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  status: 'active' | 'inactive' | 'nurturing';
  score: number;
  aiScore: number;
  value: number;
  probability: number;
  source: string;
  assignedTo: string;
  createdAt: string;
  lastContact?: string;
  notes?: string;
  tags?: string[];
  temperature: 'hot' | 'warm' | 'cold';
  nextAction?: string;
  lastActivity?: string;
  customFields?: Record<string, any>;
}

interface LeadFilters {
  search: string;
  stage: string;
  status: string;
  assignedTo: string;
  source: string;
  industry: string;
  scoreRange: [number, number];
  valueRange: [number, number];
  dateRange: string;
  tags: string[];
}

interface BulkAction {
  id: string;
  label: string;
  icon: React.ElementType;
  action: (leadIds: string[]) => void;
  color: string;
}

const LeadsPage: React.FC = () => {
  const { leads: rawLeads, employees, updateLead, deleteLead } = useData();
  
  // Enhanced leads with AI scoring
  const [leads, setLeads] = useState<EnhancedLead[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    stage: 'all',
    status: 'all',
    assignedTo: 'all',
    source: 'all',
    industry: 'all',
    scoreRange: [0, 100],
    valueRange: [0, 1000000],
    dateRange: 'all',
    tags: []
  });

  // Initialize enhanced leads with AI scoring
  useEffect(() => {
    const enhancedLeads: EnhancedLead[] = rawLeads.map(lead => ({
      ...lead,
      aiScore: aiEngine.scoreLeadFit(lead),
      temperature: lead.score > 80 ? 'hot' : lead.score > 60 ? 'warm' : 'cold',
      nextAction: getNextAction(lead),
      lastActivity: getLastActivity(lead.id)
    }));
    setLeads(enhancedLeads);
  }, [rawLeads]);

  const getNextAction = (lead: any): string => {
    if (lead.stage === 'new') return 'Initial contact';
    if (lead.stage === 'contacted') return 'Follow up call';
    if (lead.stage === 'qualified') return 'Send proposal';
    if (lead.stage === 'proposal') return 'Schedule demo';
    return 'Continue nurturing';
  };

  const getLastActivity = (leadId: string): string => {
    // Mock last activity - in real app, this would come from activities data
    const activities = ['Called', 'Emailed', 'Met', 'Texted'];
    return activities[Math.floor(Math.random() * activities.length)] + ' 2 days ago';
  };

  // Filter and sort leads
  const filteredLeads = leads
    .filter(lead => {
      if (filters.search && !lead.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !lead.company.toLowerCase().includes(filters.search.toLowerCase()) &&
          !lead.email.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.stage !== 'all' && lead.stage !== filters.stage) return false;
      if (filters.status !== 'all' && lead.status !== filters.status) return false;
      if (filters.assignedTo !== 'all' && lead.assignedTo !== filters.assignedTo) return false;
      if (filters.source !== 'all' && lead.source !== filters.source) return false;
      if (filters.industry !== 'all' && lead.industry !== filters.industry) return false;
      if (lead.score < filters.scoreRange[0] || lead.score > filters.scoreRange[1]) return false;
      if (lead.value < filters.valueRange[0] || lead.value > filters.valueRange[1]) return false;
      
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof EnhancedLead];
      let bValue = b[sortBy as keyof EnhancedLead];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / pageSize);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate KPIs
  const kpis = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.stage === 'qualified' || l.stage === 'proposal').length,
    hotLeads: leads.filter(l => l.temperature === 'hot').length,
    avgScore: Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length),
    conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.stage === 'won').length / leads.length) * 100) : 0,
    totalValue: leads.reduce((sum, l) => sum + l.value, 0),
    avgDealSize: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.value, 0) / leads.length) : 0,
    newThisWeek: leads.filter(l => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(l.createdAt) > weekAgo;
    }).length
  };

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      id: 'assign',
      label: 'Assign Owner',
      icon: Users,
      action: (leadIds) => console.log('Assigning leads:', leadIds),
      color: 'blue'
    },
    {
      id: 'stage',
      label: 'Change Stage',
      icon: Target,
      action: (leadIds) => console.log('Changing stage:', leadIds),
      color: 'green'
    },
    {
      id: 'tag',
      label: 'Add Tags',
      icon: Tag,
      action: (leadIds) => console.log('Adding tags:', leadIds),
      color: 'purple'
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: Download,
      action: (leadIds) => console.log('Exporting leads:', leadIds),
      color: 'gray'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      action: (leadIds) => console.log('Deleting leads:', leadIds),
      color: 'red'
    }
  ];

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === paginatedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(paginatedLeads.map(lead => lead.id));
    }
  };

  const getStageColor = (stage: string) => {
    const colors = {
      new: 'bg-gray-100 text-gray-800 border-gray-300',
      contacted: 'bg-blue-100 text-blue-800 border-blue-300',
      qualified: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      proposal: 'bg-orange-100 text-orange-800 border-orange-300',
      won: 'bg-green-100 text-green-800 border-green-300',
      lost: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getTemperatureColor = (temp: string) => {
    const colors = {
      hot: 'text-red-500',
      warm: 'text-orange-500',
      cold: 'text-blue-500'
    };
    return colors[temp as keyof typeof colors] || 'text-gray-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderKPICard = (title: string, value: string | number, icon: React.ElementType, change?: string, color = 'blue') => {
    const Icon = icon;
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600 text-blue-100',
      green: 'from-green-500 to-green-600 text-green-100',
      purple: 'from-purple-500 to-purple-600 text-purple-100',
      orange: 'from-orange-500 to-orange-600 text-orange-100',
      red: 'from-red-500 to-red-600 text-red-100'
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} shadow-lg`}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              {[
                { key: 'name', label: 'Lead' },
                { key: 'company', label: 'Company' },
                { key: 'stage', label: 'Stage' },
                { key: 'score', label: 'Score' },
                { key: 'value', label: 'Value' },
                { key: 'assignedTo', label: 'Owner' },
                { key: 'lastContact', label: 'Last Contact' },
                { key: 'actions', label: 'Actions' }
              ].map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => column.key !== 'actions' && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.key !== 'actions' && (
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLeads.map((lead) => (
              <tr 
                key={lead.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  selectedLeads.includes(lead.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {lead.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                        <div className={`w-2 h-2 rounded-full ${getTemperatureColor(lead.temperature)}`} />
                      </div>
                      <p className="text-sm text-gray-600">{lead.position}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{lead.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.company}</p>
                    <p className="text-xs text-gray-500">{lead.industry}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(lead.stage)}`}>
                    {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(lead.aiScore)}`}>
                          AI: {lead.aiScore}
                        </span>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(lead.value)}</p>
                    <p className="text-xs text-gray-500">{lead.probability}% probability</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {employees.find(e => e.id === lead.assignedTo)?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {employees.find(e => e.id === lead.assignedTo)?.name || 'Unassigned'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-gray-900">
                      {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : 'Never'}
                    </p>
                    <p className="text-xs text-gray-500">{lead.lastActivity}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
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

  const renderKanbanView = () => {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
    
    return (
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {stages.map(stage => {
          const stageLeads = filteredLeads.filter(lead => lead.stage === stage);
          const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
          
          return (
            <div key={stage} className="flex-shrink-0 w-80">
              <div className="bg-white rounded-t-xl border border-gray-200 shadow-sm mb-3">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 capitalize">{stage}</h3>
                      <span className="text-sm text-gray-500">({stageLeads.length})</span>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(stageValue)}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 min-h-[600px]">
                <div className="space-y-3">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-300 group shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                              {lead.name}
                            </h4>
                            <div className={`w-2 h-2 rounded-full ${getTemperatureColor(lead.temperature)}`} />
                          </div>
                          <p className="text-xs text-gray-600">{lead.company}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-semibold text-green-600 text-sm">
                            {formatCurrency(lead.value)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{lead.probability}%</span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-2">
                        {lead.nextAction}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{lead.source}</span>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                            <Phone className="h-3 w-3" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 rounded">
                            <Mail className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-2 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
                <p className="text-gray-600 text-lg">Comprehensive lead pipeline and scoring system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-all ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <List className="h-4 w-4 mr-2" />
                  Table
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
                  Kanban
                </button>
              </div>

              <button className="flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </button>
              
              <button className="flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              
              <button className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </button>
            </div>
          </div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {renderKPICard('Total Leads', kpis.totalLeads, Users, '+12%', 'blue')}
            {renderKPICard('Qualified', kpis.qualifiedLeads, Target, '+8%', 'green')}
            {renderKPICard('Hot Leads', kpis.hotLeads, Zap, '+15%', 'orange')}
            {renderKPICard('Avg Score', kpis.avgScore, Star, '+5%', 'purple')}
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads, companies, emails..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2.5 w-96 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2.5 border rounded-xl text-sm transition-colors shadow-sm ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50 bg-white'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </button>
              
              <button className="flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span>{filteredLeads.length} of {leads.length} leads</span>
              <span>•</span>
              <span>Pipeline Value: {formatCurrency(kpis.totalValue)}</span>
            </div>
          </div>

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select
                    value={filters.stage}
                    onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Stages</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
                  <select
                    value={filters.assignedTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Owners</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                  <select
                    value={filters.source}
                    onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Sources</option>
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Email">Cold Email</option>
                    <option value="Trade Show">Trade Show</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Industries</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Score Range: {filters.scoreRange[0]} - {filters.scoreRange[1]}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.scoreRange[0]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        scoreRange: [Number(e.target.value), prev.scoreRange[1]] 
                      }))}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.scoreRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        scoreRange: [prev.scoreRange[0], Number(e.target.value)] 
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-2 py-6">
        {/* AI Insights Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900">AI Lead Intelligence</h3>
                <p className="text-purple-700">
                  {leads.filter(l => l.aiScore > 85).length} high-potential leads identified • 
                  {leads.filter(l => l.temperature === 'hot').length} hot leads need immediate attention
                </p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Sparkles className="h-4 w-4 mr-2" />
              View Insights
            </button>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'table' ? renderTableView() : renderKanbanView()}

        {/* Pagination */}
        {viewMode === 'table' && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-6 py-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>per page</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-4 z-50">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              {bulkActions.map((action) => {
                const Icon = action.icon;
                const colorClasses = {
                  blue: 'bg-blue-600 hover:bg-blue-700',
                  green: 'bg-green-600 hover:bg-green-700',
                  purple: 'bg-purple-600 hover:bg-purple-700',
                  gray: 'bg-gray-600 hover:bg-gray-700',
                  red: 'bg-red-600 hover:bg-red-700'
                };
                
                return (
                  <button
                    key={action.id}
                    onClick={() => action.action(selectedLeads)}
                    className={`flex items-center px-3 py-2 text-white rounded-lg text-sm transition-colors ${
                      colorClasses[action.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setSelectedLeads([])}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.stage !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first lead'
            }
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2 inline" />
            Add Your First Lead
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;