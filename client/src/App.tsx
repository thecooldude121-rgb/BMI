import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import LazyLoader from './components/LazyLoader';
import FastLoader from './components/FastLoader';
import useRoutePreloader from './hooks/useRoutePreloader';
import useTransitionOptimization from './hooks/useTransitionOptimization';

// Lazy load heavy modules for better performance
const CRMModule = React.lazy(() => import('./pages/CRM/CRMModule'));
const HRMSModule = React.lazy(() => import('./pages/HRMS/HRMSModule'));
const LeadGeneration = React.lazy(() => import('./pages/LeadGeneration/LeadGeneration'));

// Lazy load commonly used components
const Analytics = React.lazy(() => import('./pages/Analytics/Analytics'));
const Calendar = React.lazy(() => import('./pages/Calendar/Calendar'));
const Settings = React.lazy(() => import('./pages/Settings/Settings'));
const GamificationPage = React.lazy(() => import('./pages/Gamification/GamificationPage'));

// Lazy load detail pages
const UltimateAccountDetailPage = React.lazy(() => import('./pages/CRM/UltimateAccountDetailPage'));
const UltimateCreateAccountPageEnhanced = React.lazy(() => import('./pages/CRM/UltimateCreateAccountPageEnhanced'));
const ContactDetailPage = React.lazy(() => import('./pages/CRM/ContactDetailPage'));
const CompanyDetailPageBMI = React.lazy(() => import('./pages/LeadGeneration/CompanyDetailPageBMI'));
const AdvancedDealDetailsPage = React.lazy(() => import('./components/Deal/AdvancedDealDetailsPage'));
const NewLeadManagementPage = React.lazy(() => import('./pages/CRM/NewLeadManagementPage'));

// Import only essential components that are always needed
import Login from './pages/Auth/Login';
import MeetingIntelligencePage from './pages/MeetingIntelligencePage';
import MeetingDashboard from './pages/MeetingDashboard';
import GamificationModule from './pages/CRM/GamificationModuleNextGen';
import PersonDetails from './components/LeadGeneration/PersonDetails';
import IndustryTrendIndicator from './components/IndustryTrendIndicator';
import CreateDealWizard from './components/Deal/CreateDealWizard';
import CreateDealPageFixed from './pages/CRM/CreateDealPageFixed';
import BrowserNavFix from './components/BrowserNavFix';
import AutoNavFix from './components/AutoNavFix';

import NavigationFix from './components/NavigationFix';
import ClickableNavigation from './components/ClickableNavigation';
import FixedSidebar from './components/FixedSidebar';

import SimpleErrorBoundary from './components/SimpleErrorBoundary';
import usePerformanceOptimization from './hooks/usePerformanceOptimization';

// Wrapper components for routes that need props - memoized for performance
const CreateDealWrapper = React.memo(() => <CreateDealWizard />);
const CreateDealPageWrapper = React.memo(() => <CreateDealPageFixed />);
const DealDetailWrapper = React.memo(({ params }: { params: { id: string } }) => (
  <LazyLoader fallback={<FastLoader />}>
    <AdvancedDealDetailsPage dealId={params.id} />
  </LazyLoader>
));
const MeetingDashboardWrapper = React.memo(() => <MeetingDashboard />);
const AccountDetailWrapper = React.memo(({ params }: { params: { id: string } }) => (
  <LazyLoader fallback={<FastLoader />}>
    <UltimateAccountDetailPage params={params} />
  </LazyLoader>
));
const ContactDetailWrapper = React.memo(({ params }: { params: { id: string } }) => (
  <LazyLoader fallback={<FastLoader />}>
    <ContactDetailPage params={params} />
  </LazyLoader>
));
const CompanyDetailWrapper = React.memo(({ params }: { params: { id: string } }) => (
  <LazyLoader fallback={<FastLoader />}>
    <CompanyDetailPageBMI params={params} />
  </LazyLoader>
));



const App = () => {
  // Debug navigation on app load
  React.useEffect(() => {
    // Only run debug in development
    if (import.meta.env.DEV) {
      console.log('App loaded successfully - navigation should work normally');
    }
  }, []);

  // Performance optimizations
  usePerformanceOptimization();
  useRoutePreloader();
  useTransitionOptimization();


  return (
    <SimpleErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />
            <main className="pt-16 px-4 pb-8 min-h-screen">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={() => (
                <LazyLoader fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                  <Analytics />
                </LazyLoader>
              )} />
              <Route path="/dashboard" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <Analytics />
                </LazyLoader>
              )} />
              <Route path="/crm/deals/new" component={CreateDealPageWrapper} />
              <Route path="/crm/deals/create" component={CreateDealPageWrapper} />
              <Route path="/crm/deals/create-wizard" component={CreateDealWrapper} />
              <Route path="/crm/deals/:id" component={DealDetailWrapper} />
              <Route path="/crm/accounts/create" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <UltimateCreateAccountPageEnhanced />
                </LazyLoader>
              )} />
              <Route path="/crm/accounts/:id" component={AccountDetailWrapper} />
              <Route path="/crm/contacts/:id" component={ContactDetailWrapper} />
              <Route path="/crm/leads/new-management" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <NewLeadManagementPage />
                </LazyLoader>
              )} />
              <Route path="/lead-generation/company/:id" component={CompanyDetailWrapper} />
              <Route path="/lead-generation/people/:id" component={PersonDetails} />
              <Route path="/crm/:rest*" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <CRMModule />
                </LazyLoader>
              )} />
              <Route path="/crm" component={() => (
                <div className="min-h-screen w-full">
                  <GamificationModule />
                </div>
              )} />
              <Route path="/hrms" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <HRMSModule />
                </LazyLoader>
              )} />
              <Route path="/analytics" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <Analytics />
                </LazyLoader>
              )} />
              <Route path="/calendar" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <Calendar />
                </LazyLoader>
              )} />
              <Route path="/meeting-intelligence" component={MeetingIntelligencePage} />
              <Route path="/meetings/:id" component={MeetingDashboardWrapper} />
              <Route path="/lead-generation" component={() => (
                <div className="absolute inset-0 top-16">
                  <LazyLoader fallback={<FastLoader />}>
                    <LeadGeneration />
                  </LazyLoader>
                </div>
              )} />
              <Route path="/trends" component={IndustryTrendIndicator} />
              <Route path="/gamification" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <GamificationPage />
                </LazyLoader>
              )} />
              <Route path="/settings" component={() => (
                <LazyLoader fallback={<FastLoader />}>
                  <Settings />
                </LazyLoader>
              )} />
            </Switch>
          </main>

          </div>
        </DataProvider>
      </AuthProvider>
    </SimpleErrorBoundary>
  );
};

export default App;