import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react';
import { Route, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataProvider } from './contexts/DataContext';

// Lazy load components for better performance
const UltimateAccountsModule = lazy(() => import('./pages/CRM/UltimateAccountsModule'));
const NextGenContactsModule = lazy(() => import('./pages/CRM/NextGenContactsModule'));
const NextGenActivitiesModule = lazy(() => import('./pages/CRM/NextGenActivitiesModule'));
const EnhancedDealDetailPageWorking = lazy(() => import('./pages/CRM/EnhancedDealDetailPageWorking'));
const DealKanbanView = lazy(() => import('./components/Deal/DealKanbanView'));
const CreateDealWizard = lazy(() => import('./components/Deal/CreateDealWizard'));
const UltimateCreateAccountPageEnhanced = lazy(() => import('./pages/CRM/UltimateCreateAccountPageEnhanced'));
const NewLeadManagementPage = lazy(() => import('./pages/CRM/NewLeadManagementPage'));
const LeadGeneration = lazy(() => import('./pages/LeadGeneration/LeadGeneration'));
const MeetingIntelligencePage = lazy(() => import('./pages/MeetingIntelligencePage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Enhanced Loading Component with glassmorphism effect
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading BMI Platform</h2>
      <p className="text-gray-600">Preparing your business intelligence dashboard...</p>
    </div>
  </div>
);

// Simple Error Boundary Component
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

// Enhanced Dashboard Component with modern styling
const EnhancedDashboard = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    {/* Enhanced Header */}
    <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Business Intelligence Platform
              </h1>
              <p className="text-xs text-gray-500">Comprehensive CRM & Lead Generation</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            {[
              { href: '/crm/accounts', label: 'Accounts', icon: '🏢' },
              { href: '/crm/contacts', label: 'Contacts', icon: '👥' },
              { href: '/crm/deals', label: 'Deals', icon: '💼' },
              { href: '/crm/activities', label: 'Activities', icon: '📅' },
              { href: '/crm/leads', label: 'Leads', icon: '🎯' },
              { href: '/lead-generation', label: 'Lead Gen', icon: '🚀' },
              { href: '/meeting-intelligence', label: 'AI Meetings', icon: '🧠' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>

    {/* Enhanced Dashboard Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-8 mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Enhanced Quick Actions */}
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
    </main>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Router>
              {/* Dashboard/Home */}
              <Route path="/" component={EnhancedDashboard} />
              <Route path="/dashboard" component={EnhancedDashboard} />
              
              {/* CRM Routes */}
              <Route path="/crm/accounts" component={UltimateAccountsModule} />
              <Route path="/crm/accounts/create" component={UltimateCreateAccountPageEnhanced} />
              <Route path="/crm/contacts" component={NextGenContactsModule} />
              <Route path="/crm/activities" component={NextGenActivitiesModule} />
              <Route path="/crm/leads" component={NewLeadManagementPage} />
              
              {/* Deal Management */}
              <Route path="/crm/deals" component={() => <div>Deals Kanban View</div>} />
              <Route path="/crm/deals/create" component={() => <CreateDealWizard />} />
              <Route path="/crm/deals/:id" component={EnhancedDealDetailPageWorking} />
              
              {/* Lead Generation & AI */}
              <Route path="/lead-generation" component={LeadGeneration} />
              <Route path="/meeting-intelligence" component={MeetingIntelligencePage} />
              
              {/* Fallback */}
              <Route>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested page could not be found.</p>
                    <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      Go Home
                    </a>
                  </div>
                </div>
              </Route>
            </Router>
          </Suspense>
        </ErrorBoundary>
      </DataProvider>
    </QueryClientProvider>
  );
};

export default App;