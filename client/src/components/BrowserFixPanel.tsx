// Comprehensive browser fix panel for navigation issues
import React from 'react';

const BrowserFixPanel = () => {
  const clearBrowserCache = () => {
    // Clear all possible browser caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear session storage
    sessionStorage.clear();
    localStorage.clear();
    
    // Force reload
    setTimeout(() => {
      window.location.reload(true);
    }, 100);
  };

  const enableIncognitoMode = () => {
    alert('To fix navigation:\n\n1. Open browser in Incognito/Private mode\n2. Navigate to this same URL\n3. Navigation should work normally in incognito mode');
  };

  const disableExtensions = () => {
    alert('Browser extensions are blocking navigation:\n\n1. Disable ad blockers (uBlock, AdBlock, etc.)\n2. Disable privacy extensions\n3. Refresh the page\n4. Try navigation again');
  };

  const manualNavInstructions = () => {
    const baseUrl = window.location.origin;
    const instructions = `Manual Navigation URLs:
    
• CRM Deals: ${baseUrl}/crm/deals
• CRM Accounts: ${baseUrl}/crm/accounts  
• Analytics: ${baseUrl}/analytics
• CRM Home: ${baseUrl}/crm
• Lead Generation: ${baseUrl}/lead-generation

Copy and paste these URLs directly into your address bar.`;
    
    alert(instructions);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-100 border-2 border-red-500 rounded-lg p-4 shadow-lg max-w-xs">
      <h3 className="text-sm font-bold mb-2 text-red-800">🚨 Browser Navigation Fix</h3>
      <p className="text-xs text-red-700 mb-3">Choose a fix method:</p>
      
      <div className="space-y-2">
        <button
          onClick={clearBrowserCache}
          className="block w-full px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          data-testid="clear-cache-btn"
        >
          Clear Cache & Reload
        </button>
        
        <button
          onClick={enableIncognitoMode}
          className="block w-full px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          data-testid="incognito-btn"
        >
          Use Incognito Mode
        </button>
        
        <button
          onClick={disableExtensions}
          className="block w-full px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700"
          data-testid="disable-ext-btn"
        >
          Disable Extensions
        </button>
        
        <button
          onClick={manualNavInstructions}
          className="block w-full px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
          data-testid="manual-nav-btn"
        >
          Manual Navigation URLs
        </button>
      </div>
    </div>
  );
};

export default BrowserFixPanel;