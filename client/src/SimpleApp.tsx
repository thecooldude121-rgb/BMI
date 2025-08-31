import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { 
  Plus, Search, Filter, Mail, Phone, Building, Calendar, DollarSign, Star, User,
  Menu, Bell, Settings, LogOut, Users, BarChart3, Target, Briefcase,
  Home, Building2, ChevronDown, X, Brain, Video
} from 'lucide-react';

// Import existing components
import NewLeadManagementPage from './pages/CRM/NewLeadManagementPage';
import NewLeadForm from './components/CRM/NewLeadForm';
import LeadGeneration from './pages/LeadGeneration/LeadGeneration';
import MeetingIntelligencePage from './pages/MeetingIntelligencePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const apiRequest = async (url: string, options: any = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

// Header Component
const Header = () => {
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Company Name */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <span className="text-xl font-bold text-gray-900">BMI Platform</span>
              <div className="text-xs text-gray-500 font-medium">Business Management Intelligence</div>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search across all modules..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>
        </div>

        {/* Right Section - Actions and User */}
        <div className="flex items-center space-x-4">
          {/* All Modules Menu */}
          <div className="relative">
            <button
              onClick={() => setShowModulesMenu(!showModulesMenu)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-4 w-4 mr-2" />
              All Modules
              <ChevronDown className="h-3 w-3 ml-1" />
            </button>
            
            {showModulesMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Business Modules
                </div>
                <a href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Home className="h-4 w-4 mr-3 text-blue-600" />
                  Dashboard
                </a>
                <a href="/crm/leads" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Target className="h-4 w-4 mr-3 text-green-600" />
                  CRM - Leads
                </a>
                <a href="/crm/accounts" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Building2 className="h-4 w-4 mr-3 text-purple-600" />
                  CRM - Accounts
                </a>
                <a href="/crm/deals" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Briefcase className="h-4 w-4 mr-3 text-orange-600" />
                  CRM - Deals
                </a>
                <a href="/analytics" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <BarChart3 className="h-4 w-4 mr-3 text-indigo-600" />
                  Analytics
                </a>
                <a href="/hrms" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Users className="h-4 w-4 mr-3 text-teal-600" />
                  HRMS
                </a>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <span>Admin User</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-500 border-b">
                  Signed in as <strong>Admin</strong>
                </div>
                <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="h-4 w-4 mr-3" />
                  Your Profile
                </a>
                <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'text-green-600' },
    { path: '/crm/leads', icon: Target, label: 'CRM - Leads', color: 'text-red-600' },
    { path: '/crm/accounts', icon: Building2, label: 'CRM - Accounts', color: 'text-purple-600' },
    { path: '/crm/deals', icon: Briefcase, label: 'CRM - Deals', color: 'text-orange-600' },
    { path: '/lead-generation', icon: Target, label: 'Lead Generation', color: 'text-pink-600' },
    { path: '/meeting-intelligence', icon: Brain, label: 'AI Meeting Intelligence', color: 'text-indigo-600' },
    { path: '/hrms', icon: Users, label: 'HRMS', color: 'text-teal-600' },
  ];

  const currentPath = window.location.pathname;

  return (
    <div className={`fixed left-0 top-16 h-full bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="p-4">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
        )}
        <nav className="space-y-2">
          {navItems.map(({ path, icon: Icon, label, color }) => {
            const isActive = currentPath === path;
            
            return (
              <a
                key={path}
                href={path}
                className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? label : undefined}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : color} ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <span className="font-medium">{label}</span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Status Indicator */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs text-green-800 font-medium">🟢 System Online</div>
            <div className="text-xs text-green-600">All modules active</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Lead Management Content
const LeadManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch leads
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: () => apiRequest('/api/leads')
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Leads</h3>
          <p className="text-red-600 mt-1">Failed to load leads data</p>
        </div>
      </div>
    );
  }

  // Filter leads
  const filteredLeads = leads.filter((lead: any) => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get stats
  const stats = {
    total: leads.length,
    new: leads.filter((l: any) => l.status === 'new').length,
    qualified: leads.filter((l: any) => l.status === 'qualified').length,
    converted: leads.filter((l: any) => l.status === 'converted').length,
    totalValue: leads.reduce((sum: number, l: any) => sum + (l.estimatedValue || 0), 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div style={{ marginLeft: '256px', paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '24px' }}>
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">New Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              </div>
              <Plus className="h-6 w-6 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Qualified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.qualified}</p>
              </div>
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Lead Management</h2>
                <p className="text-gray-600 text-sm">Manage and track your sales leads</p>
              </div>
              <a 
                href="/crm/leads/new" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create New Lead
              </a>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-3 items-center flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLeads.map((lead: any) => (
              <div key={lead.id} className="bg-white border rounded-lg p-5 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {lead.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <Star className={`h-3 w-3 ${getPriorityColor(lead.priority)}`} />
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                  )}
                  {lead.estimatedValue && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      ${lead.estimatedValue.toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Star className={`h-4 w-4 ${getPriorityColor(lead.priority)}`} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      ${lead.estimatedValue?.toLocaleString() || '0'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 text-xs border rounded hover:bg-gray-50">
                          Edit
                        </button>
                        <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Lead Creation Content
const LeadCreationContent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    source: 'website',
    status: 'new',
    priority: 'medium',
    estimatedValue: 0,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        title: formData.title,
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        estimatedValue: formData.estimatedValue,
        notes: formData.notes
      };

      await apiRequest('/api/leads', { 
        method: 'POST', 
        body: submitData 
      });

      // Success - redirect to leads page
      window.location.href = '/crm/leads';
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginLeft: '256px', paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '24px' }}>
        {/* Form */}
        <div className="bg-white p-8 rounded-lg border max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Create New Lead</h2>
              <p className="text-gray-600 mt-1">Add a new lead to your CRM system</p>
            </div>
            <a 
              href="/crm/leads" 
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              ← Back to Lead List
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter job title"
                  />
                </div>
              </div>
            </div>

            {/* Lead Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Lead Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social-media">Social Media</option>
                    <option value="cold-call">Cold Call</option>
                    <option value="email">Email Campaign</option>
                    <option value="trade-show">Trade Show</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Value ($)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => handleInputChange('estimatedValue', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                placeholder="Add any additional notes about this lead..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <a
                href="/crm/leads"
                className="inline-flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </a>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Lead
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardContent = () => {
  return (
    <div style={{ marginLeft: '256px', paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '24px' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your comprehensive business management platform</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                <p className="text-green-600 text-xs mt-1">+12% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-blue-600 text-xs mt-1">+8 this week</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">New Leads</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-orange-600 text-xs mt-1">+23 today</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-purple-600 text-xs mt-1">All active</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/crm/leads/new" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Create Lead</p>
                <p className="text-gray-600 text-xs">Add new prospect</p>
              </div>
            </a>
            
            <a href="/lead-generation" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Target className="h-5 w-5 text-pink-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Lead Generation</p>
                <p className="text-gray-600 text-xs">Find new prospects</p>
              </div>
            </a>
            
            <a href="/meeting-intelligence" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Brain className="h-5 w-5 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">AI Meeting Intelligence</p>
                <p className="text-gray-600 text-xs">Analyze meetings</p>
              </div>
            </a>
            
            <a href="/analytics" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-gray-600 text-xs">Business insights</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Content Router
const SimpleAppContent = () => {
  const currentPath = window.location.pathname;
  
  // Dashboard
  if (currentPath === '/' || currentPath === '/dashboard') {
    return <DashboardContent />;
  }
  
  // Lead Management Page
  if (currentPath === '/crm/leads') {
    return <LeadManagementContent />;
  }
  
  // Lead Creation Page
  if (currentPath === '/crm/leads/new') {
    return <LeadCreationContent />;
  }
  
  // Lead Generation Page
  if (currentPath === '/lead-generation') {
    return <LeadGeneration />;
  }
  
  // AI Meeting Intelligence Page
  if (currentPath === '/meeting-intelligence') {
    return <MeetingIntelligencePage />;
  }
  
  // Default fallback - redirect to dashboard
  return <DashboardContent />;
};

// Main App Component
const SimpleApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Sidebar />
        <SimpleAppContent />
      </div>
    </QueryClientProvider>
  );
};

export default SimpleApp;