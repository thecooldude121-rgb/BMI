// Working navigation using the existing header structure
import React from 'react';
import { useLocation } from 'wouter';
import { Building, Users, DollarSign, BarChart3, Target, UserCheck } from 'lucide-react';

const WorkingNavigation = () => {
  const [, setLocation] = useLocation();

  const navigationItems = [
    { name: 'CRM Home', path: '/crm', icon: Building, color: 'bg-blue-500' },
    { name: 'Accounts', path: '/crm/accounts', icon: Building, color: 'bg-green-500' },
    { name: 'Deals', path: '/crm/deals', icon: DollarSign, color: 'bg-purple-500' },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, color: 'bg-orange-500' },
    { name: 'Lead Gen', path: '/lead-generation', icon: Target, color: 'bg-red-500' },
    { name: 'HRMS', path: '/hrms', icon: UserCheck, color: 'bg-indigo-500' }
  ];

  const handleNavigation = (path: string) => {
    console.log(`Working Navigation: Navigating to ${path}`);
    setLocation(path);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-xl">
      <h3 className="text-sm font-bold mb-3 text-gray-800 text-center">Working Navigation</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`${item.color} text-white p-2 rounded-lg hover:opacity-90 transition-all duration-200 flex flex-col items-center space-y-1`}
              data-testid={`working-nav-${item.path.replace('/', '-')}`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Uses wouter setLocation
      </div>
    </div>
  );
};

export default WorkingNavigation;