// Direct browser navigation test without any external dependencies
import React from 'react';

const DirectNavigationTest = () => {
  const navigate = (path: string) => {
    console.log(`🚀 YELLOW PANEL: Direct navigation attempt to: ${path}`);
    console.log(`🌍 Current URL: ${window.location.href}`);
    
    const fullUrl = `${window.location.protocol}//${window.location.host}${path}`;
    console.log(`🎯 Target URL: ${fullUrl}`);
    
    try {
      console.log(`🔥 Method 1: window.location.replace`);
      window.location.replace(fullUrl);
    } catch (error) {
      console.error(`❌ Replace failed:`, error);
      try {
        console.log(`🔥 Method 2: window.location.href`);
        window.location.href = fullUrl;
      } catch (error2) {
        console.error(`❌ Href failed:`, error2);
        try {
          console.log(`🔥 Method 3: window.location.assign`);
          window.location.assign(fullUrl);
        } catch (error3) {
          console.error(`❌ All methods failed:`, error3);
          alert(`Navigation completely blocked: ${error3}`);
        }
      }
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-bold mb-2 text-yellow-800">🔧 Direct Navigation Test</h3>
      <p className="text-xs text-yellow-700 mb-3">Bypass all router issues</p>
      
      <div className="space-y-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🔵 BLUE BUTTON CLICKED: Going to deals`);
            navigate('/crm/deals');
          }}
          onMouseDown={(e) => console.log(`🔵 Mouse down on deals button`)}
          className="block w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          data-testid="direct-nav-deals"
          type="button"
        >
          🔵 Go to Deals
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🟢 GREEN BUTTON CLICKED: Going to accounts`);
            navigate('/crm/accounts');
          }}
          onMouseDown={(e) => console.log(`🟢 Mouse down on accounts button`)}
          className="block w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          data-testid="direct-nav-accounts"
          type="button"
        >
          🟢 Go to Accounts
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