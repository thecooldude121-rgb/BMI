// Simple HTML link-based navigation that bypasses JavaScript restrictions
import React from 'react';

const LinkBasedNavigation = () => {
  return (
    <div className="fixed top-4 left-4 z-50 bg-green-100 border-2 border-green-500 rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-bold mb-2 text-green-800">✅ HTML Link Navigation</h3>
      <p className="text-xs text-green-700 mb-3">Pure HTML links - no JavaScript</p>
      
      <div className="space-y-2">
        <a
          href="/crm/deals"
          className="block w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 no-underline text-center"
          data-testid="link-nav-deals"
        >
          📊 CRM Deals
        </a>
        
        <a
          href="/crm/accounts"
          className="block w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 no-underline text-center"
          data-testid="link-nav-accounts"
        >
          🏢 CRM Accounts
        </a>
        
        <a
          href="/analytics"
          className="block w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 no-underline text-center"
          data-testid="link-nav-analytics"
        >
          📈 Analytics
        </a>
        
        <a
          href="/crm"
          className="block w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 no-underline text-center"
          data-testid="link-nav-crm"
        >
          🎯 CRM Home
        </a>
        
        <a
          href="/lead-generation"
          className="block w-full px-3 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 no-underline text-center"
          data-testid="link-nav-leadgen"
        >
          🔍 Lead Generation
        </a>
      </div>
    </div>
  );
};

export default LinkBasedNavigation;