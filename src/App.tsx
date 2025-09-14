import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import CRMPage from './pages/CRM/CRMPage';
import LeadsPage from './pages/CRM/LeadsPage';
import AddLeadPage from './pages/CRM/AddLeadPage';
import LeadDetailPage from './pages/CRM/LeadDetailPage';
import ContactsPage from './pages/CRM/ContactsPage';
import CompaniesPage from './pages/CRM/CompaniesPage';
import DealsPage from './pages/CRM/DealsPage';
import UnifiedDealsPage from './pages/CRM/UnifiedDealsPage';
import PipelinePage from './pages/CRM/PipelinePage';
import ActivitiesPage from './pages/CRM/ActivitiesPage';
import TasksPage from './pages/CRM/TasksPage';
import Analytics from './pages/Analytics/Analytics';
import Calendar from './pages/Calendar/Calendar';
import LeadGeneration from './pages/LeadGeneration/LeadGeneration';
import LeadGenerationDetailPage from './pages/LeadGeneration/LeadDetailPage';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import GamificationPage from './pages/CRM/GamificationPage';
import HRMSModule from './pages/HRMS/HRMSModule';
import EmployeesPage from './pages/HRMS/EmployeesPage';
import AttendancePage from './pages/HRMS/AttendancePage';
import WorkflowsPage from './pages/HRMS/WorkflowsPage';
import ReportsPage from './pages/HRMS/ReportsPage';
import DealManagementPage from './pages/Deal/DealManagementPage';
import CreateDealPage from './components/Deal/CreateDealPage';
import DealDetailPage from './components/Deal/DealDetailPage';
import MeetingPage from './pages/Meeting/MeetingPage';
import MeetingScheduler from './pages/Meeting/MeetingScheduler';
import MeetingCalendar from './pages/Meeting/MeetingCalendar';
import SequencesPage from './pages/Sequences/SequencesPage';
import SequenceBuilder from './pages/Sequences/SequenceBuilder';
import EmailTemplates from './pages/Sequences/EmailTemplates';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            
            {/* Main App Routes */}
            <Route path="/" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />
            
            {/* CRM Routes */}
            <Route path="/crm" element={
              <MainLayout>
                <CRMPage />
              </MainLayout>
            } />
            <Route path="/crm/leads" element={
              <MainLayout>
                <LeadsPage />
              </MainLayout>
            } />
            <Route path="/crm/leads/new" element={
              <MainLayout>
                <AddLeadPage />
              </MainLayout>
            } />
            <Route path="/crm/leads/:id" element={
              <MainLayout>
                <LeadDetailPage />
              </MainLayout>
            } />
            <Route path="/crm/contacts" element={
              <MainLayout>
                <ContactsPage />
              </MainLayout>
            } />
            <Route path="/crm/companies" element={
              <MainLayout>
                <CompaniesPage />
              </MainLayout>
            } />
            <Route path="/crm/deals" element={
              <MainLayout>
                <DealsPage />
              </MainLayout>
            } />
            <Route path="/crm/unified-deals" element={
              <MainLayout>
                <UnifiedDealsPage />
              </MainLayout>
            } />
            <Route path="/crm/pipeline" element={
              <MainLayout>
                <PipelinePage />
              </MainLayout>
            } />
            <Route path="/crm/activities" element={
              <MainLayout>
                <ActivitiesPage />
              </MainLayout>
            } />
            <Route path="/crm/tasks" element={
              <MainLayout>
                <TasksPage />
              </MainLayout>
            } />
            <Route path="/crm/gamification" element={
              <MainLayout>
                <GamificationPage />
              </MainLayout>
            } />
            
            {/* Deal Management Routes */}
            <Route path="/deals" element={
              <MainLayout>
                <DealManagementPage />
              </MainLayout>
            } />
            <Route path="/deals/new" element={
              <MainLayout>
                <CreateDealPage />
              </MainLayout>
            } />
            <Route path="/deals/:id" element={
              <MainLayout>
                <DealDetailPage />
              </MainLayout>
            } />
            
            {/* Lead Generation Routes */}
            <Route path="/lead-generation" element={
              <MainLayout>
                <LeadGeneration />
              </MainLayout>
            } />
            <Route path="/lead-generation/leads/:id" element={
              <MainLayout>
                <LeadGenerationDetailPage />
              </MainLayout>
            } />
            
            {/* Meeting Routes */}
            <Route path="/meetings" element={
              <MainLayout>
                <MeetingPage />
              </MainLayout>
            } />
            <Route path="/meetings/scheduler" element={
              <MainLayout>
                <MeetingScheduler />
              </MainLayout>
            } />
            <Route path="/meetings/calendar" element={
              <MainLayout>
                <MeetingCalendar />
              </MainLayout>
            } />
            
            {/* Sequences Routes */}
            <Route path="/sequences" element={
              <MainLayout>
                <SequencesPage />
              </MainLayout>
            } />
            <Route path="/sequences/builder" element={
              <MainLayout>
                <SequenceBuilder />
              </MainLayout>
            } />
            <Route path="/sequences/templates" element={
              <MainLayout>
                <EmailTemplates />
              </MainLayout>
            } />
            
            {/* HRMS Routes */}
            <Route path="/hrms" element={
              <MainLayout>
                <HRMSModule />
              </MainLayout>
            } />
            <Route path="/hrms/employees" element={
              <MainLayout>
                <EmployeesPage />
              </MainLayout>
            } />
            <Route path="/hrms/attendance" element={
              <MainLayout>
                <AttendancePage />
              </MainLayout>
            } />
            <Route path="/hrms/workflows" element={
              <MainLayout>
                <WorkflowsPage />
              </MainLayout>
            } />
            <Route path="/hrms/reports" element={
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            } />
            
            {/* Other Routes */}
            <Route path="/analytics" element={
              <MainLayout>
                <Analytics />
              </MainLayout>
            } />
            <Route path="/calendar" element={
              <MainLayout>
                <Calendar />
              </MainLayout>
            } />
            <Route path="/settings" element={
              <MainLayout>
                <Settings />
              </MainLayout>
            } />
            
            {/* Redirect unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;