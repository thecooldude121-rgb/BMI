import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeadGenerationDashboard from './LeadGenerationDashboard';
import ProspectDiscovery from './ProspectDiscovery';
import ProspectsPage from './ProspectsPage';
import CompaniesPage from './CompaniesPage';
import DealsPage from '../CRM/DealsPage';
import ListsPage from './ListsPage';
import DataEnrichmentPage from './DataEnrichmentPage';
import SequencesPage from './SequencesPage';
import EmailsPage from './EmailsPage';
import MeetingsPage from './MeetingsPage';
import TasksPage from './TasksPage';
import AnalyticsPage from './AnalyticsPage';
import SettingsPage from './SettingsPage';
import ProspectDetailPage from './ProspectDetailPage';
import CompanyDetailPage from './CompanyDetailPage';
import DealDetailPage from './DealDetailPage';

const LeadGenerationModule: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/lead-generation/dashboard" replace />} />
        <Route path="/dashboard" element={<LeadGenerationDashboard />} />
        <Route path="/discovery" element={<ProspectDiscovery />} />
        <Route path="/prospects" element={<ProspectsPage />} />
        <Route path="/prospects/:id" element={<ProspectDetailPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/deals/:id" element={<DealDetailPage />} />
        <Route path="/lists" element={<ListsPage />} />
        <Route path="/enrichment" element={<DataEnrichmentPage />} />
        <Route path="/sequences" element={<SequencesPage />} />
        <Route path="/emails" element={<EmailsPage />} />
        <Route path="/meetings" element={<MeetingsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
};

export default LeadGenerationModule;