import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import CRMModule from './pages/CRM/CRMModule';
import EnhancedLeadsPage from './pages/CRM/EnhancedLeadsPage';
import ContactsPage from './pages/CRM/ContactsPage';
import EnhancedAccountsPage from './pages/CRM/EnhancedAccountsPage';
import UnifiedDealsPage from './pages/CRM/UnifiedDealsPage';
import PipelinePage from './pages/CRM/PipelinePage';
import ActivitiesPage from './pages/CRM/ActivitiesPage';
import TasksPage from './pages/CRM/TasksPage';
import CreateDealWizard from './components/Deal/CreateDealWizard';

import DealDetailPage from './components/Deal/DealDetailPage';

import Analytics from './pages/Analytics/Analytics';
import Calendar from './pages/Calendar/Calendar';
import LeadGeneration from './pages/LeadGeneration/LeadGeneration';
import GamificationPage from './pages/Gamification/GamificationPage';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import MeetingIntelligencePage from './pages/MeetingIntelligencePage';
import MeetingDashboard from './pages/MeetingDashboard';
import SimpleRealAccountDetail from './pages/CRM/SimpleRealAccountDetail';
import ContactDetailPage from './pages/CRM/ContactDetailPage';
import GamificationModule from './pages/CRM/GamificationModuleNextGen';

// Wrapper components for routes that need props
const CreateDealWrapper = () => <CreateDealWizard />;
const DealDetailWrapper = ({ params }: { params: { id: string } }) => <DealDetailPage dealId={params.id} />;
const MeetingDashboardWrapper = ({ params }: { params: { id: string } }) => <MeetingDashboard />;



const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pt-14">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={Analytics} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/crm/deals/create" component={CreateDealWrapper} />
              <Route path="/crm/deals/:id" component={DealDetailWrapper} />
              <Route path="/crm/accounts/:id" component={SimpleRealAccountDetail} />
              <Route path="/crm/contacts/:id" component={ContactDetailPage} />
              <Route path="/crm" component={() => (
                <div className="min-h-screen w-full">
                  <GamificationModule />
                </div>
              )} />
              <Route path="/crm/:rest*" component={CRMModule} />

              <Route path="/analytics" component={Analytics} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/meeting-intelligence" component={MeetingIntelligencePage} />
              <Route path="/meetings/:id" component={MeetingDashboardWrapper} />
              <Route path="/lead-generation" component={LeadGeneration} />
              <Route path="/gamification" component={GamificationPage} />
              <Route path="/settings" component={Settings} />
            </Switch>
          </main>
        </div>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;