import React, { useState } from 'react';
import { Switch, Route, Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Clock, Calendar, BarChart3, Award, BookOpen, DollarSign, Settings,
  UserPlus, Briefcase, Brain, Target, Zap, Globe, Shield, TrendingUp,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import EmployeesPage from './EmployeesPage';
import AttendancePage from './AttendancePage';
import OnboardingPage from './OnboardingPage';
import RecruitmentPage from './RecruitmentPage';
import LearningPage from './LearningPage';
import PayrollPage from './PayrollPage';
import AnalyticsPage from './AnalyticsPage';
import PerformancePage from './PerformancePage';

// Placeholder components for missing routes
const LeavePage: React.FC = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave Management</h2>
    <p className="text-gray-600">Coming soon - comprehensive leave management system</p>
  </div>
);

const SettingsPlaceholder: React.FC = () => (
  <div className="p-8 max-w-4xl mx-auto">
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-8 border border-slate-200 shadow-lg">
      <div className="text-center">
        <Settings className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Enterprise Configuration
        </h2>
        <p className="text-slate-700 mb-4">
          Comprehensive HRMS settings, integrations, and system configuration
        </p>
      </div>
    </div>
  </div>
);

const HRMSModule: React.FC = () => {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const tabs = [
    { id: 'employees', name: 'Employees', icon: Users, path: '/hrms/employees', description: 'Workforce Management' },
    { id: 'onboarding', name: 'Onboarding', icon: UserPlus, path: '/hrms/onboarding', description: 'AI-Powered Welcome' },
    { id: 'recruitment', name: 'Recruitment', icon: Briefcase, path: '/hrms/recruitment', description: 'Talent Acquisition' },
    { id: 'performance', name: 'Performance', icon: Target, path: '/hrms/performance', description: 'Goal Management' },
    { id: 'learning', name: 'Learning', icon: Brain, path: '/hrms/learning', description: 'Development Paths' },
    { id: 'attendance', name: 'Attendance', icon: Clock, path: '/hrms/attendance', description: 'Time Tracking' },
    { id: 'leave', name: 'Leave', icon: Calendar, path: '/hrms/leave', description: 'Leave Management' },
    { id: 'payroll', name: 'Payroll', icon: DollarSign, path: '/hrms/payroll', description: 'Compensation' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, path: '/hrms/analytics', description: 'Insights & Reports' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/hrms/settings', description: 'Configuration' }
  ];

  const getActiveSection = () => {
    const currentPath = location.split('/')[2] || 'employees';
    return tabs.find(tab => tab.id === currentPath) || tabs[0];
  };

  const activeSection = getActiveSection();

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex">
      {/* Collapsible Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white/95 backdrop-blur-sm border-r border-slate-200 shadow-lg flex flex-col relative"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      HRMS Platform
                    </h1>
                    <p className="text-xs text-slate-600">AI-Powered</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {tabs.map((tab) => {
            const isActive = location.startsWith(tab.path);
            const Icon = tab.icon;
            
            return (
              <Link key={tab.id} href={tab.path}>
                <motion.div
                  className={`
                    mx-2 mb-1 rounded-lg cursor-pointer transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-200' 
                      : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                    }
                  `}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`flex items-center ${sidebarCollapsed ? 'justify-center py-3' : 'px-3 py-2.5'}`}>
                    <Icon className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-blue-600' : ''}`} />
                    
                    <AnimatePresence mode="wait">
                      {!sidebarCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 flex-1"
                        >
                          <div className="text-sm font-medium">{tab.name}</div>
                          <div className="text-xs opacity-75">{tab.description}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Status Indicators in Sidebar */}
        <div className="p-4 border-t border-slate-200">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 px-2 py-1 bg-green-50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">System Online</span>
                </div>
                <div className="flex items-center space-x-2 px-2 py-1 bg-blue-50 rounded-md">
                  <Brain className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">AI Analytics</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Brain className="w-4 h-4 text-blue-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {activeSection.name}
                </h1>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{activeSection.description}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <Globe className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-medium text-slate-700">Enterprise</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <Shield className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-medium text-slate-700">SOC 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Switch>
            <Route path="/hrms/employees" component={EmployeesPage} />
            <Route path="/hrms/onboarding" component={OnboardingPage} />
            <Route path="/hrms/recruitment" component={RecruitmentPage} />
            <Route path="/hrms/performance" component={PerformancePage} />
            <Route path="/hrms/learning" component={LearningPage} />
            <Route path="/hrms/attendance" component={AttendancePage} />
            <Route path="/hrms/leave" component={LeavePage} />
            <Route path="/hrms/payroll" component={PayrollPage} />
            <Route path="/hrms/analytics" component={AnalyticsPage} />
            <Route path="/hrms/settings" component={SettingsPlaceholder} />
            <Route path="/hrms" component={EmployeesPage} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

// Enhanced Leave Management Placeholder
const EnhancedLeavePage: React.FC = () => (
  <div className="p-8 max-w-4xl mx-auto">
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-8 border border-orange-200 dark:border-orange-800">
      <div className="text-center">
        <Calendar className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-2">
          Advanced Leave Management
        </h2>
        <p className="text-orange-700 dark:text-orange-300 mb-4">
          AI-powered leave planning, automated approvals, and workforce forecasting
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 rounded-full">Smart Scheduling</span>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 rounded-full">Team Coverage</span>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 rounded-full">Compliance Tracking</span>
        </div>
      </div>
    </div>
  </div>
);

export default HRMSModule;