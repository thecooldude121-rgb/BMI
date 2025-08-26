// Router debugging component to diagnose wouter issues
import React from 'react';
import { useLocation, useRouter } from 'wouter';

const RouterDebug = () => {
  const [location, setLocation] = useLocation();
  const router = useRouter();

  const testNavigation = () => {
    console.log('🔍 Router Debug Information:');
    console.log('Current location:', location);
    console.log('Router object:', router);
    console.log('setLocation type:', typeof setLocation);
    
    // Test basic navigation
    console.log('Testing navigation to /crm/deals...');
    setLocation('/crm/deals');
    
    setTimeout(() => {
      console.log('Location after setLocation:', window.location.pathname);
      console.log('Wouter location:', location);
    }, 100);
  };

  return (
    <div className="fixed top-16 right-4 z-50 bg-red-100 border border-red-500 rounded p-3 max-w-xs">
      <h3 className="font-bold text-red-800 mb-2">Router Debug</h3>
      <div className="text-xs text-red-700 mb-2">
        <div>Current: {location}</div>
        <div>Browser: {window.location.pathname}</div>
      </div>
      <button 
        onClick={testNavigation}
        className="w-full px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
      >
        Debug Router
      </button>
    </div>
  );
};

export default RouterDebug;