import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import CRMPage from './pages/CRM/CRMPage';
import LeadsPage from './pages/CRM/LeadsPage';
import ContactsPage from './pages/CRM/ContactsPage';
import AccountsModule from './pages/Accounts';
import UnifiedDealsPage from './pages/CRM/UnifiedDealsPage';
import DealsPage from './pages/CRM/DealsPage';
import PipelinePage from './pages/CRM/PipelinePage';
import ActivitiesPage from './pages/CRM/ActivitiesPage';
import TasksPage from './pages/CRM/TasksPage';
import CreateDealWizard from './components/Deal/CreateDealWizard';
import DealDetailPage from './components/Deal/DealDetailPage';
import AddLeadPage from './pages/CRM/AddLeadPage';
import LeadDetailPage from './pages/CRM/LeadDetailPage';
import HRMSModule from './pages/HRMS/HRMSModule';
import Analytics from './pages/Analytics/Analytics';
import Calendar from './pages/Calendar/Calendar';
import LeadGenerationModule from './pages/LeadGeneration/LeadGenerationModule';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import GamificationPage from './pages/CRM/GamificationPage';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-2">
        {children}
      </main>
    </div>
  );
};

const CRMRoutes = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      <Routes>
        <Route path="/" element={<Navigate to="/crm/leads" replace />} />
        <Route path="/gamification" element={<GamificationPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/new" element={<AddLeadPage />} />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/deals-unified" element={<UnifiedDealsPage />} />
        <Route path="/deals/create" element={<CreateDealWizard />} />
        <Route path="/deals/:id" element={<DealDetailPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/crm/*" element={<CRMRoutes />} />
                <Route path="/accounts/*" element={<AccountsModule />} />
                <Route path="/hrms/*" element={<HRMSModule />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/lead-generation/*" element={<LeadGenerationModule />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;