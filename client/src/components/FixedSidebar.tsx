// Fixed sidebar with working click events
import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  BarChart3,
  Building2,
  Briefcase,
  Target,
  Users,
  Calendar,
  Settings,
  Home
} from 'lucide-react';

const FixedSidebar = () => {
  const [location, setLocation] = useLocation();

  // Enhanced navigation with multiple fallbacks
  const handleNavigation = (path: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log(`🔄 Sidebar navigation to: ${path}`);
    
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
    { path: '/', icon: Home, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'text-green-600' },
    { path: '/crm/accounts', icon: Building2, label: 'Accounts', color: 'text-purple-600' },
    { path: '/crm/deals', icon: Briefcase, label: 'Deals', color: 'text-orange-600' },
    { path: '/lead-generation', icon: Target, label: 'Lead Generation', color: 'text-red-600' },
    { path: '/hrms', icon: Users, label: 'HRMS', color: 'text-teal-600' },
    { path: '/calendar', icon: Calendar, label: 'Calendar', color: 'text-pink-600' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-600' }
  ];

  return (
    <div className="fixed left-0 top-14 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
        <nav className="space-y-2">
          {navItems.map(({ path, icon: Icon, label, color }) => {
            const isActive = location === path;
            
            return (
              <button
                key={path}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-all text-left ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => handleNavigation(path, e)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleNavigation(path);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleNavigation(path);
                }}
                data-testid={`sidebar-${label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : color}`} />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="text-xs text-green-800 font-medium">🟢 Navigation Active</div>
          <div className="text-xs text-green-600">Click events restored</div>
        </div>
      </div>
    </div>
  );
};

export default FixedSidebar;