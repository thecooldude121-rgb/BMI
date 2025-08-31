import React from 'react';
import { Route, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from '@/components/ui/toaster';

// Lazy loading components
const LazyLoader: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = <div>Loading...</div> 
}) => {
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};

const FastLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Route path="/" component={() => {
            const Dashboard = React.lazy(() => import('./pages/Dashboard'));
            return (
              <LazyLoader fallback={<FastLoader />}>
                <Dashboard />
              </LazyLoader>
            );
          }} />
          
          {/* Direct CRM Lead Routes - Fixed and Working */}
          <Route path="/crm/leads/new" component={() => {
            const SimpleLeadCreationPage = React.lazy(() => import('./pages/CRM/SimpleLeadCreationPage'));
            return (
              <LazyLoader fallback={<FastLoader />}>
                <SimpleLeadCreationPage />
              </LazyLoader>
            );
          }} />
          
          <Route path="/crm/leads" component={() => {
            const NewLeadManagementPage = React.lazy(() => import('./pages/CRM/NewLeadManagementPage'));
            return (
              <LazyLoader fallback={<FastLoader />}>
                <NewLeadManagementPage />
              </LazyLoader>
            );
          }} />

          {/* Test Routes */}
          <Route path="/test-leads" component={() => {
            const DirectTestPage = React.lazy(() => import('./pages/DirectTestPage'));
            return (
              <LazyLoader fallback={<FastLoader />}>
                <DirectTestPage />
              </LazyLoader>
            );
          }} />
          
          <Route path="/direct-crm-leads" component={() => {
            const TestLeadsPage = React.lazy(() => import('./pages/CRM/TestLeadsPage'));
            return (
              <LazyLoader fallback={<FastLoader />}>
                <TestLeadsPage />
              </LazyLoader>
            );
          }} />
          
          <Route path="/direct-crm-leads-new" component={() => {
            const NewLeadManagementPage = React.lazy(() => import('./pages/CRM/NewLeadManagementPage'));
            return (
              <LazyLoader fallback={<FastLoader />}>
                <NewLeadManagementPage />
              </LazyLoader>
            );
          }} />

          {/* Other CRM Routes - Temporarily disabled due to react-router-dom conflicts */}
          {/* <Route path="/crm/:rest*" component={() => {
            const CRMModule = React.lazy(() => import('./pages/CRM/CRMModule'));
            return (
              <LazyLoader fallback={<FastLoader />}>
                <CRMModule />
              </LazyLoader>
            );
          }} /> */}
          
        </div>
      </Router>
      {/* <Toaster /> */}
    </QueryClientProvider>
  );
}

export default App;