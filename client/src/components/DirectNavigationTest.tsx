// Direct browser navigation test without any external dependencies
import React from 'react';

const DirectNavigationTest = () => {
  const navigate = (path: string) => {
    console.log(`🚀 Direct navigation to: ${path}`);
    console.log(`Current URL: ${window.location.href}`);
    
    const fullUrl = `${window.location.protocol}//${window.location.host}${path}`;
    console.log(`Target URL: ${fullUrl}`);
    
    // Force immediate navigation
    window.location.replace(fullUrl);
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-bold mb-2 text-yellow-800">🔧 Direct Navigation Test</h3>
      <p className="text-xs text-yellow-700 mb-3">Bypass all router issues</p>
      
      <div className="space-y-2">
        <button
          onClick={() => navigate('/crm/deals')}
          className="block w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          data-testid="direct-nav-deals"
        >
          Go to Deals
        </button>
        
        <button
          onClick={() => navigate('/crm/accounts')}  
          className="block w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          data-testid="direct-nav-accounts"
        >
          Go to Accounts
        </button>
        
        <button
          onClick={() => navigate('/analytics')}
          className="block w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          data-testid="direct-nav-analytics"
        >
          Go to Analytics
        </button>
        
        <button
          onClick={() => navigate('/crm')}
          className="block w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          data-testid="direct-nav-crm"
        >
          Go to CRM Home
        </button>
      </div>
    </div>
  );
};

export default DirectNavigationTest;