import React from 'react';
import { useParams } from 'wouter';

const WorkingAccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Account Detail Page
          </h1>
          <p className="text-blue-700 text-lg">
            Successfully navigated to account: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{id}</span>
          </p>
          <p className="text-blue-600 mt-2">
            ✅ Routing is working correctly!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">Account Information</h2>
            <div className="space-y-2">
              <p><strong>Account ID:</strong> {id}</p>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Type:</strong> Enterprise</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.href = '/crm/accounts'}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 block w-full"
              >
                Back to Accounts
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 block w-full">
                Edit Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingAccountDetail;