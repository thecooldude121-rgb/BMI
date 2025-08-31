import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import LeadDetailPage from './LeadDetailPage';

// Simple lead list component
const LeadListPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Lead List</h1>
      <p>This is the lead list page</p>
    </div>
  );
};

// Simple lead creation component
const NewLeadPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Create New Lead</h1>
      <p>This is the new lead creation page</p>
    </div>
  );
};

const CRMModule = () => {
  return (
    <Routes>
      {/* CORRECT ROUTE ORDER: '/crm/leads/new' must come BEFORE '/crm/leads/:leadId' */}
      <Route path="leads/new" element={<NewLeadPage />} />
      <Route path="leads/:leadId" element={<LeadDetailPage />} />
      <Route path="leads" element={<LeadListPage />} />
    </Routes>
  );
};

export default CRMModule;