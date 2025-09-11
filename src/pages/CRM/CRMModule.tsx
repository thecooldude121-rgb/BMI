import React from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import CRMPage from './CRMPage';
import LeadsPage from './LeadsPage';
import ContactsPage from './ContactsPage';
import CompaniesPage from './CompaniesPage';
import UnifiedDealsPage from './UnifiedDealsPage';
import PipelinePage from './PipelinePage';
import ActivitiesPage from './ActivitiesPage';
import TasksPage from './TasksPage';

const CRMModule = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      <Routes>
        <Route path="/" element={<CRMPage />} />
        <Route path="/overview" element={<CRMPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/accounts" element={<CompaniesPage />} />
        <Route path="/deals" element={<UnifiedDealsPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
      </Routes>
    </div>
  );
};

export default CRMModule;