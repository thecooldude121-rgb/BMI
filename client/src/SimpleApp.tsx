import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { 
  Plus, Search, Filter, Mail, Phone, Building, Calendar, DollarSign, Star, User,
  Menu, Bell, Settings, LogOut, Users, BarChart3, Target, Briefcase,
  Home, Building2, ChevronDown, X, Brain, Video
} from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

// Header Component
const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">BMI Platform</h1>
            <p className="text-xs text-gray-500">Business Management Intelligence</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4 border-b border-gray-100">
                  <div className="text-sm text-gray-600">
                    Signed in as <strong>Admin</strong>
                  </div>
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

// Simple Dashboard Component
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

// Simple placeholder components for other modules
const LeadGenerationContent = () => {
  return (
    <div style={{ marginLeft: '256px', paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Generation</h1>
              <p className="text-gray-600 mt-1">AI-powered prospecting and discovery</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lead Generation Module</h2>
          <p className="text-gray-600 mb-4">Find and discover new prospects with AI-powered tools.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">People Discovery</h3>
              <p className="text-sm text-gray-600 mt-1">Find and connect with decision makers</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Company Research</h3>
              <p className="text-sm text-gray-600 mt-1">Research companies and opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MeetingIntelligenceContent = () => {
  return (
    <div style={{ marginLeft: '256px', paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Meeting Intelligence</h1>
              <p className="text-gray-600 mt-1">Transform meetings into actionable insights</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Intelligence Module</h2>
          <p className="text-gray-600 mb-4">Analyze meetings with AI-powered insights and recommendations.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Meeting Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">AI-powered meeting transcription and analysis</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Action Items</h3>
              <p className="text-sm text-gray-600 mt-1">Automatic action item extraction</p>
            </div>
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
  
  // Lead Generation Page
  if (currentPath === '/lead-generation') {
    return <LeadGenerationContent />;
  }
  
  // AI Meeting Intelligence Page
  if (currentPath === '/meeting-intelligence') {
    return <MeetingIntelligenceContent />;
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