// Permanent sidebar navigation using header's working navigation structure
import React from 'react';
import { useLocation } from 'wouter';
import { 
  Building, Users, DollarSign, BarChart3, Target, UserCheck, 
  Calendar, Settings, Activity, Brain, Trophy
} from 'lucide-react';

const PermanentSidebar = () => {
  const [location, setLocation] = useLocation();

  const navigationItems = [
    { name: 'Analytics', path: '/analytics', icon: BarChart3, color: 'text-orange-600' },
    { name: 'CRM', path: '/crm', icon: Users, color: 'text-blue-600' },
    { name: 'Accounts', path: '/crm/accounts', icon: Building, color: 'text-green-600' },
    { name: 'Deals', path: '/crm/deals', icon: DollarSign, color: 'text-purple-600' },
    { name: 'Activities', path: '/crm/activities', icon: Activity, color: 'text-indigo-600' },
    { name: 'Lead Generation', path: '/lead-generation', icon: Target, color: 'text-red-600' },
    { name: 'HRMS', path: '/hrms', icon: UserCheck, color: 'text-teal-600' },
    { name: 'Meeting Intelligence', path: '/meeting-intelligence', icon: Brain, color: 'text-pink-600' },
    { name: 'Calendar', path: '/calendar', icon: Calendar, color: 'text-yellow-600' },
    { name: 'Settings', path: '/settings', icon: Settings, color: 'text-gray-600' }
  ];

  const handleNavigation = (path: string) => {
    console.log(`Permanent Sidebar: Attempting navigation to ${path}`);
    setLocation(path);
  };

  return (
    <div className="fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 shadow-sm z-40 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
        
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location === item.path || (item.path !== '/analytics' && location?.startsWith(item.path));
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-gray-50 ${
                  isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                data-testid={`sidebar-nav-${item.path.replace('/', '-')}`}
              >
                <IconComponent className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color}`} />
                <span className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">Navigation Status</h3>
          <p className="text-xs text-yellow-700">
            This sidebar uses the same navigation method as the Header. 
            If these buttons don't work, the issue is deeper than browser security restrictions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermanentSidebar;