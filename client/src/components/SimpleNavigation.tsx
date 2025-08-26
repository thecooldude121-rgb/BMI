// Ultra-simple navigation using location.pathname manipulation
import React from 'react';

const SimpleNavigation = () => {
  const goToPage = (path: string) => {
    // Direct URL manipulation
    const newUrl = window.location.origin + path;
    window.history.pushState({}, '', newUrl);
    
    // Force page refresh to load new route
    window.location.href = newUrl;
  };

  return (
    <div className="fixed top-1/2 left-2 transform -translate-y-1/2 z-50 bg-purple-100 border-2 border-purple-500 rounded-lg p-3 shadow-lg">
      <h4 className="text-xs font-bold mb-2 text-purple-800">Simple Nav</h4>
      
      <div className="space-y-1">
        <div 
          onClick={() => goToPage('/crm/deals')}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
        >
          Deals
        </div>
        
        <div
          onClick={() => goToPage('/crm/accounts')}
          className="px-2 py-1 text-xs bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
        >
          Accounts
        </div>
        
        <div
          onClick={() => goToPage('/analytics')}
          className="px-2 py-1 text-xs bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600"
        >
          Analytics
        </div>
      </div>
    </div>
  );
};

export default SimpleNavigation;