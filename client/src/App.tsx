import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/CRM/LeadsPage';
import ContactsPage from './pages/CRM/ContactsPage';
import CompaniesPage from './pages/CRM/CompaniesPage';
import UnifiedDealsPage from './pages/CRM/UnifiedDealsPage';
import PipelinePage from './pages/CRM/PipelinePage';
import ActivitiesPage from './pages/CRM/ActivitiesPage';
import TasksPage from './pages/CRM/TasksPage';
import CreateDealWizard from './components/Deal/CreateDealWizard';
import DealDetailPage from './components/Deal/DealDetailPage';
import HRMSModule from './pages/HRMS/HRMSModule';
import Analytics from './pages/Analytics/Analytics';
import Calendar from './pages/Calendar/Calendar';
import LeadGeneration from './pages/LeadGeneration/LeadGeneration';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';

// Wrapper components for routes that need props
const CreateDealWrapper = () => <CreateDealWizard />;
const DealDetailWrapper = ({ params }: { params: { id: string } }) => <DealDetailPage dealId={params.id} />;



const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pt-16">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/crm/leads" component={LeadsPage} />
              <Route path="/crm/contacts" component={ContactsPage} />
              <Route path="/crm/accounts" component={CompaniesPage} />
              <Route path="/crm/deals" component={UnifiedDealsPage} />
              <Route path="/crm/deals/create" component={CreateDealWrapper} />
              <Route path="/crm/deals/:id" component={DealDetailWrapper} />
              <Route path="/crm/pipeline" component={PipelinePage} />
              <Route path="/crm/tasks" component={TasksPage} />
              <Route path="/crm/activities" component={ActivitiesPage} />
              <Route path="/hrms" component={HRMSModule} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/lead-generation" component={LeadGeneration} />
              <Route path="/settings" component={Settings} />
            </Switch>
          </main>
        </div>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;