import React from 'react';
import NewLeadForm from '../../components/CRM/NewLeadForm';

const SimpleLeadCreationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ minHeight: '100vh' }}>
      <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-lg">
        <h1 className="text-2xl font-bold text-green-800">✅ Lead Creation Page is Working!</h1>
        <p className="text-green-600">Ready to create new leads in the system</p>
        <p className="text-sm text-green-500 mt-2">
          Fill out the form below to add a new lead to your CRM
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Lead</h1>
          <p className="text-gray-600">Add a new lead to your CRM system</p>
        </div>
        
        <NewLeadForm 
          isOpen={true}
          onClose={() => window.history.back()} 
          onSuccess={() => window.history.back()}
          mode="create"
        />
      </div>
    </div>
  );
};

export default SimpleLeadCreationPage;