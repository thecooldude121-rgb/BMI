import React from 'react';
import { Switch, Route, Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Users, Clock, Calendar, BarChart3, Award, BookOpen, DollarSign, Settings,
  UserPlus, Briefcase, Brain, Target, Zap, Globe, Shield, TrendingUp
} from 'lucide-react';
import EmployeesPage from './EmployeesPage';
import AttendancePage from './AttendancePage';
import OnboardingPage from './OnboardingPage';
import RecruitmentPage from './RecruitmentPage';
import LearningPage from './LearningPage';
import PayrollPage from './PayrollPage';
import AnalyticsPage from './AnalyticsPage';
import PerformancePage from './PerformancePage';

const HRMSModule: React.FC = () => {
  const [location] = useLocation();
  
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
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-800">
      {/* Enhanced Header */}
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  AI-Powered HRMS Platform
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Comprehensive Employee Lifecycle Management</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  AI Active
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Multi-tenant Ready</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex space-x-0 overflow-x-auto bg-slate-50/50 dark:bg-slate-800/50">
          {tabs.map((tab) => {
            const isActive = location.startsWith(tab.path);
            const Icon = tab.icon;
            
            return (
              <Link key={tab.id} href={tab.path}>
                <motion.div
                  className={`
                    flex flex-col items-center justify-center px-4 py-3 border-b-2 cursor-pointer
                    transition-all duration-300 whitespace-nowrap min-w-[120px]
                    ${isActive 
                      ? 'border-blue-500 bg-gradient-to-t from-blue-50 to-white dark:from-blue-900/30 dark:to-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'border-transparent hover:border-slate-300 hover:bg-gradient-to-t hover:from-slate-50 hover:to-white dark:hover:from-slate-700/50 dark:hover:to-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }
                  `}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  initial={false}
                  animate={isActive ? { y: -1 } : { y: 0 }}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span className="font-medium text-xs">{tab.name}</span>
                  <span className="text-xs opacity-75 mt-0.5">{tab.description}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content with Enhanced Layout */}
      <div className="flex-1 overflow-auto">
        <Switch>
          <Route path="/hrms/employees" component={EmployeesPage} />
          <Route path="/hrms/onboarding" component={OnboardingPage} />
          <Route path="/hrms/recruitment" component={RecruitmentPage} />
          <Route path="/hrms/performance" component={PerformancePage} />
          <Route path="/hrms/learning" component={LearningPage} />
          <Route path="/hrms/attendance" component={AttendancePage} />
          <Route path="/hrms/leave" component={LeaveManagementPlaceholder} />
          <Route path="/hrms/payroll" component={PayrollPage} />
          <Route path="/hrms/analytics" component={AnalyticsPage} />
          <Route path="/hrms/settings" component={SettingsPlaceholder} />
          <Route path="/hrms" component={EmployeesPage} />
        </Switch>
      </div>
    </div>
  );
};

// Enhanced Placeholder Components
const LeaveManagementPlaceholder: React.FC = () => (
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

const SettingsPlaceholder: React.FC = () => (
  <div className="p-8 max-w-4xl mx-auto">
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
      <div className="text-center">
        <Settings className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Enterprise Configuration
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Multi-tenant setup, integrations, compliance, and system administration
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full">Multi-Tenant</span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full">API Integrations</span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full">Security</span>
        </div>
      </div>
    </div>
  </div>
);

export default HRMSModule;