// Clickable navigation panel with working buttons
import React from 'react';
import { useLocation } from 'wouter';

const ClickableNavigation = () => {
  const [, setLocation] = useLocation();
  
  // Enhanced navigation function with multiple fallbacks
  const navigate = (path: string) => {
    console.log(`🔄 Navigating to: ${path}`);
    
    try {
      // Method 1: Wouter navigation
      setLocation(path);
      console.log('✅ Wouter navigation successful');
    } catch (error1) {
      console.log('Wouter failed, trying window.location');
      
      try {
        // Method 2: Direct window navigation
        window.location.href = path;
      } catch (error2) {
        console.log('Window.location failed, trying location.assign');
        
        try {
          // Method 3: Location assign
          window.location.assign(path);
        } catch (error3) {
          console.error('All navigation methods failed:', error3);
        }
      }
    }
  };
  
  const navItems = [
    { path: '/analytics', label: '📊 Analytics', color: 'bg-blue-500' },
    { path: '/crm/accounts', label: '🏢 Accounts', color: 'bg-green-500' },
    { path: '/crm/deals', label: '💼 Deals', color: 'bg-purple-500' },
    { path: '/lead-generation', label: '🎯 Lead Gen', color: 'bg-orange-500' },
    { path: '/hrms', label: '👥 HRMS', color: 'bg-teal-500' },
    { path: '/calendar', label: '📅 Calendar', color: 'bg-pink-500' }
  ];
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
      <h3 className="font-bold text-sm mb-3 text-gray-800">🧭 NAVIGATION</h3>
      <div className="space-y-2">
        {navItems.map(({ path, label, color }) => (
          <button
            key={path}
            className={`w-full ${color} hover:opacity-80 text-white px-3 py-2 rounded text-xs font-medium transition-all`}
            style={{ pointerEvents: 'auto' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(path);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              navigate(path);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              navigate(path);
            }}
            data-testid={`nav-${path.replace('/', '-')}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-600">
        Click any button above to navigate
      </div>
    </div>
  );
};

export default ClickableNavigation;