import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import LazyLoader from './components/LazyLoader';

// Lazy load heavy modules for better performance
const CRMModule = React.lazy(() => import('./pages/CRM/CRMModule'));
import EnhancedLeadsPage from './pages/CRM/EnhancedLeadsPage';
import ContactsPage from './pages/CRM/ContactsPage';
import EnhancedAccountsPage from './pages/CRM/EnhancedAccountsPage';
import UltimateAccountsModule from './pages/CRM/UltimateAccountsModule';
import UnifiedDealsPage from './pages/CRM/UnifiedDealsPage';
import PipelinePage from './pages/CRM/PipelinePage';
import ActivitiesPage from './pages/CRM/ActivitiesPage';
import TasksPage from './pages/CRM/TasksPage';
import CreateDealWizard from './components/Deal/CreateDealWizard';
import CreateDealPageFixed from './pages/CRM/CreateDealPageFixed';

import DealDetailPage from './components/Deal/DealDetailPage';
import AdvancedDealDetailsPage from './components/Deal/AdvancedDealDetailsPage';
const HRMSModule = React.lazy(() => import('./pages/HRMS/HRMSModule'));
import Analytics from './pages/Analytics/Analytics';
import Calendar from './pages/Calendar/Calendar';
const LeadGeneration = React.lazy(() => import('./pages/LeadGeneration/LeadGeneration'));
import GamificationPage from './pages/Gamification/GamificationPage';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import MeetingIntelligencePage from './pages/MeetingIntelligencePage';
import MeetingDashboard from './pages/MeetingDashboard';
import SimpleRealAccountDetail from './pages/CRM/SimpleRealAccountDetail';
import UltimateAccountDetailPage from './pages/CRM/UltimateAccountDetailPage';
import UltimateCreateAccountPageEnhanced from './pages/CRM/UltimateCreateAccountPageEnhanced';
import ContactDetailPage from './pages/CRM/ContactDetailPage';
import GamificationModule from './pages/CRM/GamificationModuleNextGen';
import CompanyDetailPageBMI from './pages/LeadGeneration/CompanyDetailPageBMI';
import PersonDetails from './components/LeadGeneration/PersonDetails';
import IndustryTrendIndicator from './components/IndustryTrendIndicator';
import BrowserNavFix from './components/BrowserNavFix';
import AutoNavFix from './components/AutoNavFix';

import NavigationFix from './components/NavigationFix';
import ClickableNavigation from './components/ClickableNavigation';
import FixedSidebar from './components/FixedSidebar';

import SimpleErrorBoundary from './components/SimpleErrorBoundary';
import usePerformanceOptimization from './hooks/usePerformanceOptimization';

// Wrapper components for routes that need props
const CreateDealWrapper = () => <CreateDealWizard />;
const CreateDealPageWrapper = () => <CreateDealPageFixed />;
const DealDetailWrapper = ({ params }: { params: { id: string } }) => <AdvancedDealDetailsPage dealId={params.id} />;
const MeetingDashboardWrapper = ({ params }: { params: { id: string } }) => <MeetingDashboard />;



const App = () => {
  // Performance optimizations
  usePerformanceOptimization();
  
  // Debug navigation on app load
  React.useEffect(() => {
    // Only run debug in development
    if (import.meta.env.DEV) {
      console.log('App loaded successfully - navigation should work normally');
    }
  }, []);

  return (
    <SimpleErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />
            <main className="pt-16 px-4 pb-8 min-h-screen">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={Analytics} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/crm/deals/new" component={CreateDealPageWrapper} />
              <Route path="/crm/deals/create" component={CreateDealPageWrapper} />
              <Route path="/crm/deals/create-wizard" component={CreateDealWrapper} />
              <Route path="/crm/deals/:id" component={DealDetailWrapper} />
              <Route path="/crm/accounts/create" component={UltimateCreateAccountPageEnhanced} />
              <Route path="/crm/accounts/:id" component={UltimateAccountDetailPage} />
              <Route path="/crm/contacts/:id" component={ContactDetailPage} />
              <Route path="/lead-generation/company/:id" component={CompanyDetailPageBMI} />
              <Route path="/lead-generation/people/:id" component={PersonDetails} />
              <Route path="/crm" component={() => (
                <div className="min-h-screen w-full">
                  <GamificationModule />
                </div>
              )} />
              <Route path="/crm/:rest*" component={() => (
                <LazyLoader>
                  <CRMModule />
                </LazyLoader>
              )} />
              <Route path="/hrms" component={() => (
                <LazyLoader>
                  <HRMSModule />
                </LazyLoader>
              )} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/meeting-intelligence" component={MeetingIntelligencePage} />
              <Route path="/meetings/:id" component={MeetingDashboardWrapper} />
              <Route path="/lead-generation" component={() => (
                <LazyLoader>
                  <LeadGeneration />
                </LazyLoader>
              )} />
              <Route path="/trends" component={IndustryTrendIndicator} />
              <Route path="/gamification" component={GamificationPage} />
              <Route path="/settings" component={Settings} />
            </Switch>
          </main>

          </div>
        </DataProvider>
      </AuthProvider>
    </SimpleErrorBoundary>
  );
};

export default App;