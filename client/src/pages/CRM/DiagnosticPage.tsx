import React from 'react';
import { useLocation } from 'wouter';

const DiagnosticPage: React.FC = () => {
  const [location] = useLocation();
  
  console.log('🔍 DiagnosticPage loaded at:', location);
  
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-4">✅ CRM Module Loading Successfully</h1>
      <div className="space-y-3">
        <p><strong>Current Route:</strong> {location}</p>
        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
        <p><strong>Window Location:</strong> {window.location.pathname}</p>
      </div>
      
      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold">Test Navigation:</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/crm" className="px-3 py-1 bg-blue-500 text-white rounded">CRM Home</a>
          <a href="/crm/leads" className="px-3 py-1 bg-blue-500 text-white rounded">Leads</a>
          <a href="/crm/contacts" className="px-3 py-1 bg-blue-500 text-white rounded">Contacts</a>
          <a href="/crm/accounts" className="px-3 py-1 bg-blue-500 text-white rounded">Accounts</a>
          <a href="/crm/deals" className="px-3 py-1 bg-blue-500 text-white rounded">Deals</a>
          <a href="/crm/activities" className="px-3 py-1 bg-blue-500 text-white rounded">Activities</a>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;