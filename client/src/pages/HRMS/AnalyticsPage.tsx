import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Clock, Target, Brain,
  BarChart3, PieChart, Activity, AlertTriangle, CheckCircle
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');

  // Fetch HRMS analytics
  const { data: analytics = [], isLoading } = useQuery({
    queryKey: ['/api/hrms/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/hrms/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }
  });

  // Mock comprehensive analytics data
  const mockAnalytics = {
    overview: {
      totalEmployees: 156,
      activeEmployees: 148,
      newHires: 8,
      turnoverRate: 3.2,
      averageTenure: 3.4,
      satisfactionScore: 4.2
    },
    recruitment: {
      activeJobs: 12,
      applications: 89,
      interviewsScheduled: 23,
      timeToHire: 18,
      costPerHire: 3200,
      offerAcceptanceRate: 85
    },
    performance: {
      averageRating: 4.1,
      goalsCompleted: 78,
      reviewsCompleted: 92,
      topPerformers: 24,
      improvementPlans: 8,
      promotions: 6
    },
    learning: {
      activeEnrollments: 234,
      completionRate: 87,
      averageProgress: 68,
      certificatesEarned: 45,
      learningHours: 1230,
      skillsAcquired: 156
    },
    attendance: {
      averageAttendance: 96.5,
      lateArrivals: 12,
      absences: 8,
      overtime: 15.2,
      workFromHome: 42,
      leaveBalance: 18.4
    }
  };

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-auto">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  HRMS Analytics & Insights
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive workforce analytics powered by AI intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              <motion.button
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Brain className="w-4 h-4" />
                <span>Generate Report</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Overview Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalytics.overview.totalEmployees}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalytics.overview.activeEmployees}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Hires</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalytics.overview.newHires}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Turnover Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalytics.overview.turnoverRate}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Tenure</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalytics.overview.averageTenure}y
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalytics.overview.satisfactionScore}/5
                </p>
              </div>
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <Target className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Module Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recruitment Analytics */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recruitment Performance
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Jobs</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.recruitment.activeJobs}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Applications</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.recruitment.applications}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time to Hire</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.recruitment.timeToHire} days
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Accept Rate</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.recruitment.offerAcceptanceRate}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance Analytics */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Analytics
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Rating</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.performance.averageRating}/5
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Goals Done</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.performance.goalsCompleted}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Performers</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.performance.topPerformers}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Promotions</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.performance.promotions}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Analytics */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Learning & Development
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Enrollments</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.learning.activeEnrollments}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.learning.completionRate}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Certificates</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.learning.certificatesEarned}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Learning Hours</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.learning.learningHours}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Attendance Analytics */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Attendance & Time
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Attendance</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.attendance.averageAttendance}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Late Arrivals</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.attendance.lateArrivals}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overtime Hrs</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.attendance.overtime}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">WFH Days</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockAnalytics.attendance.workFromHome}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Insights Panel */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
              AI-Powered Workforce Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Growth Prediction</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Team productivity expected to increase 15% based on current learning trends.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Risk Alert</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                3 high-performing employees show risk indicators for potential turnover.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Optimization</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Recommend creating 2 leadership development programs for succession planning.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;