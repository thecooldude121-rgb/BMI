import React from 'react';

const BasicAccountsPage: React.FC = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accounts Module</h1>
          <p className="text-gray-600 mb-4">Basic accounts page is loading correctly.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900">Test Account 1</h3>
              <p className="text-blue-700 text-sm">ID: test-123</p>
              <button 
                onClick={() => window.location.href = '/crm/accounts/test-123'}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900">Test Account 2</h3>
              <p className="text-green-700 text-sm">ID: test-456</p>
              <button 
                onClick={() => window.location.href = '/crm/accounts/test-456'}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                View Details
              </button>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900">Test Account 3</h3>
              <p className="text-purple-700 text-sm">ID: test-789</p>
              <button 
                onClick={() => window.location.href = '/crm/accounts/test-789'}
                className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="font-semibold text-yellow-900 mb-2">Debug Information</h2>
          <p className="text-yellow-800 text-sm">
            Current URL: {window.location.pathname}
          </p>
          <p className="text-yellow-800 text-sm">
            Time: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicAccountsPage;