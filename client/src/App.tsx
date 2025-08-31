import React, { Suspense, lazy, Component, ErrorInfo, ReactNode, useState } from 'react';
import { Route, Router, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataProvider } from './contexts/DataContext';
import { 
  Home, BarChart3, Target, Building2, Briefcase, Users, Brain, Menu,
  User, Settings, Bell, Search, Plus, ChevronDown
} from 'lucide-react';

// Lazy load components for better performance
const UltimateAccountsModule = lazy(() => import('./pages/CRM/UltimateAccountsModule'));
const NextGenContactsModule = lazy(() => import('./pages/CRM/NextGenContactsModule'));
const NextGenActivitiesModule = lazy(() => import('./pages/CRM/NextGenActivitiesModule'));
const EnhancedDealDetailPageWorking = lazy(() => import('./pages/CRM/EnhancedDealDetailPageWorking'));
const CreateDealWizard = lazy(() => import('./components/Deal/CreateDealWizard'));
const UltimateCreateAccountPageEnhanced = lazy(() => import('./pages/CRM/UltimateCreateAccountPageEnhanced'));
const NewLeadManagementPage = lazy(() => import('./pages/CRM/NewLeadManagementPage'));
const LeadGeneration = lazy(() => import('./pages/LeadGeneration/LeadGeneration'));
const MeetingIntelligencePage = lazy(() => import('./pages/MeetingIntelligencePage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Enhanced Loading Component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Platform</h2>
      <p className="text-gray-600">Preparing your business intelligence dashboard...</p>
    </div>
  </div>
);

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-red-200/30 shadow-xl p-8 text-center max-w-md">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Header Component
const Header = () => {
  const [location] = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Business Intelligence Platform
            </h1>
            <p className="text-xs text-gray-500">Enterprise CRM & Lead Generation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </a>
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
  const [location, setLocation] = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'text-green-600' },
    { path: '/crm/leads', icon: Target, label: 'CRM - Leads', color: 'text-red-600' },
    { path: '/crm/accounts', icon: Building2, label: 'CRM - Accounts', color: 'text-purple-600' },
    { path: '/crm/contacts', icon: Users, label: 'CRM - Contacts', color: 'text-cyan-600' },
    { path: '/crm/deals', icon: Briefcase, label: 'CRM - Deals', color: 'text-orange-600' },
    { path: '/crm/activities', icon: Target, label: 'CRM - Activities', color: 'text-pink-600' },
    { path: '/lead-generation', icon: Target, label: 'Lead Generation', color: 'text-green-500' },
    { path: '/meeting-intelligence', icon: Brain, label: 'AI Meeting Intelligence', color: 'text-indigo-600' },
    { path: '/hrms', icon: Users, label: 'HRMS', color: 'text-teal-600' },
  ];

  return (
    <div className={`fixed left-0 top-16 h-full bg-white/95 backdrop-blur-lg border-r border-gray-200 shadow-sm z-40 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
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
            const isActive = location === path;
            
            return (
              <button
                key={path}
                onClick={() => setLocation(path)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? label : undefined}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : color} ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <span className="font-medium">{label}</span>
                )}
              </button>
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

// Dashboard Component
const Dashboard = () => (
  <div className="space-y-6">
    {/* Welcome Section */}
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Welcome to Your Business Intelligence Hub
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Manage your entire business pipeline with AI-powered insights, comprehensive CRM tools, and intelligent lead generation.
        </p>
      </div>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Total Revenue', value: '$2.4M', change: '+12%', color: 'from-green-500 to-emerald-600', icon: '💰' },
        { title: 'Active Deals', value: '156', change: '+8 this week', color: 'from-blue-500 to-cyan-600', icon: '📊' },
        { title: 'New Leads', value: '89', change: '+23 today', color: 'from-orange-500 to-red-600', icon: '🎯' },
        { title: 'Conversion Rate', value: '34.5%', change: '+2.1%', color: 'from-purple-500 to-pink-600', icon: '📈' },
      ].map((stat, index) => (
        <div key={index} className="bg-white/60 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-green-600 font-medium">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Quick Actions */}
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/crm/accounts/create', label: 'Create Account', desc: 'Add new company', icon: '🏢', color: 'from-blue-500 to-blue-600' },
          { href: '/crm/deals/create', label: 'New Deal', desc: 'Start deal process', icon: '💼', color: 'from-green-500 to-green-600' },
          { href: '/lead-generation', label: 'Find Prospects', desc: 'AI-powered search', icon: '🚀', color: 'from-purple-500 to-purple-600' },
          { href: '/meeting-intelligence', label: 'Analyze Meeting', desc: 'AI insights & notes', icon: '🧠', color: 'from-indigo-500 to-indigo-600' },
        ].map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="group relative bg-white/70 backdrop-blur-sm rounded-xl border border-white/40 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {action.icon}
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{action.label}</h4>
            <p className="text-sm text-gray-600">{action.desc}</p>
          </a>
        ))}
      </div>
    </div>
  </div>
);

// Main Layout Component
const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <Sidebar />
      <main className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Router>
              <MainLayout>
                {/* Dashboard/Home */}
                <Route path="/" component={Dashboard} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/analytics" component={() => <div className="p-8 text-center text-gray-600">Analytics Dashboard Coming Soon</div>} />
                
                {/* CRM Routes */}
                <Route path="/crm/accounts" component={UltimateAccountsModule} />
                <Route path="/crm/accounts/create" component={UltimateCreateAccountPageEnhanced} />
                <Route path="/crm/contacts" component={NextGenContactsModule} />
                <Route path="/crm/activities" component={NextGenActivitiesModule} />
                <Route path="/crm/leads" component={NewLeadManagementPage} />
                
                {/* Deal Management */}
                <Route path="/crm/deals" component={() => <div className="p-8 text-center text-gray-600">Deals Kanban View Coming Soon</div>} />
                <Route path="/crm/deals/create" component={() => <CreateDealWizard />} />
                <Route path="/crm/deals/:id" component={EnhancedDealDetailPageWorking} />
                
                {/* Lead Generation & AI */}
                <Route path="/lead-generation" component={LeadGeneration} />
                <Route path="/meeting-intelligence" component={MeetingIntelligencePage} />
                
                {/* HRMS */}
                <Route path="/hrms" component={() => <div className="p-8 text-center text-gray-600">HRMS Module Coming Soon</div>} />
                
                {/* Fallback */}
                <Route>
                  <div className="p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested page could not be found.</p>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Go Home
                    </button>
                  </div>
                </Route>
              </MainLayout>
            </Router>
          </Suspense>
        </ErrorBoundary>
      </DataProvider>
    </QueryClientProvider>
  );
};

export default App;