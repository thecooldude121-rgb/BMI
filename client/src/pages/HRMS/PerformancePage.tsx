import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Target, TrendingUp, Star, Users, Award, Brain,
  BarChart3, Calendar, CheckCircle, AlertCircle, Clock
} from 'lucide-react';

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  status: string;
  overallRating: number;
  goals: { title: string; progress: number; status: string }[];
  feedback: string;
  reviewDate: string;
}

const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'goals'>('reviews');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch performance reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/performance-reviews'],
    queryFn: async () => {
      const response = await fetch('/api/performance-reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    }
  });

  // Generate employee insights
  const generateInsights = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await fetch(`/api/hrms/employees/${employeeId}/insights`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to generate insights');
      return response.json();
    }
  });

  // Mock comprehensive performance data
  const mockReviews: PerformanceReview[] = [
    {
      id: '1',
      employeeId: 'emp-001',
      employeeName: 'Sarah Johnson',
      reviewPeriod: 'Q4 2024',
      status: 'completed',
      overallRating: 4.5,
      goals: [
        { title: 'Complete React Migration', progress: 100, status: 'completed' },
        { title: 'Lead Team Training', progress: 85, status: 'in_progress' },
        { title: 'Improve Code Quality', progress: 92, status: 'completed' }
      ],
      feedback: 'Exceptional performance in technical leadership and team collaboration.',
      reviewDate: '2024-12-15'
    },
    {
      id: '2',
      employeeId: 'emp-002',
      employeeName: 'Mike Chen',
      reviewPeriod: 'Q4 2024',
      status: 'in_progress',
      overallRating: 4.2,
      goals: [
        { title: 'Database Optimization', progress: 75, status: 'in_progress' },
        { title: 'Mentor Junior Developers', progress: 100, status: 'completed' },
        { title: 'API Documentation', progress: 60, status: 'in_progress' }
      ],
      feedback: 'Strong technical skills with excellent mentoring capabilities.',
      reviewDate: '2024-12-20'
    },
    {
      id: '3',
      employeeId: 'emp-003',
      employeeName: 'Emily Rodriguez',
      reviewPeriod: 'Q4 2024',
      status: 'pending',
      overallRating: 0,
      goals: [
        { title: 'Product Roadmap Planning', progress: 45, status: 'in_progress' },
        { title: 'Stakeholder Management', progress: 80, status: 'in_progress' },
        { title: 'Market Research Analysis', progress: 30, status: 'in_progress' }
      ],
      feedback: '',
      reviewDate: ''
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : mockReviews;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleGenerateInsights = async (employeeId: string) => {
    try {
      await generateInsights.mutateAsync(employeeId);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  if (reviewsLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading performance data...</p>
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
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Performance Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  AI-driven performance tracking with goal management and insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Employee</option>
                <option value="emp-001">Sarah Johnson</option>
                <option value="emp-002">Mike Chen</option>
                <option value="emp-003">Emily Rodriguez</option>
              </select>
              <motion.button
                onClick={() => selectedEmployee && handleGenerateInsights(selectedEmployee)}
                disabled={!selectedEmployee || generateInsights.isPending}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Brain className="w-4 h-4" />
                <span>{generateInsights.isPending ? 'Analyzing...' : 'AI Insights'}</span>
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayReviews.length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Rating</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(displayReviews.filter((r: any) => r.overallRating > 0).reduce((sum: number, r: any) => sum + r.overallRating, 0) / displayReviews.filter((r: any) => r.overallRating > 0).length).toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayReviews.filter((r: any) => r.status === 'completed').length}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Goal Success</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'reviews'
                  ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Performance Reviews
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'goals'
                  ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Goal Tracking
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'reviews' ? (
          <div className="space-y-6">
            {displayReviews.map((review: any, index: number) => (
              <motion.div
                key={review.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.employeeName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {review.employeeName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {review.reviewPeriod} Review
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {review.overallRating > 0 && (
                        <div className="flex items-center space-x-2">
                          <Star className={`w-5 h-5 ${getRatingColor(review.overallRating)}`} />
                          <span className={`text-lg font-bold ${getRatingColor(review.overallRating)}`}>
                            {review.overallRating}/5
                          </span>
                        </div>
                      )}
                      <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                  </div>

                  {/* Goals Progress */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Goal Progress</h4>
                    <div className="space-y-3">
                      {review.goals.map((goal: any, goalIndex: number) => (
                        <div key={goalIndex} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {goal.title}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(goal.status)}`}>
                                {goal.status}
                              </span>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {goal.progress}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.2 + goalIndex * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  {review.feedback && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Feedback</h4>
                      <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                        {review.feedback}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Review Date: {review.reviewDate || 'Not scheduled'}</span>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button 
                        className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Details
                      </motion.button>
                      {review.status === 'pending' && (
                        <motion.button 
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Start Review
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayReviews.flatMap((review: any) => 
              review.goals.map((goal: any, goalIndex: number) => (
                <motion.div
                  key={`${review.id}-${goalIndex}`}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: goalIndex * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {goal.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1, delay: goalIndex * 0.2 }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="mb-2">Assigned to: {review.employeeName}</p>
                      <p>Period: {review.reviewPeriod}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* AI Performance Insights Panel */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-orange-900 dark:text-orange-100">
              AI Performance Intelligence
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="font-medium text-orange-800 dark:text-orange-200">Team Performance</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Overall team performance increased 12% this quarter with improved goal completion rates.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-orange-800 dark:text-orange-200">Recognition</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                5 employees eligible for promotion based on consistent high performance ratings.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-orange-800 dark:text-orange-200">Goal Optimization</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                AI suggests adjusting Q1 goals based on current completion trends and resource allocation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PerformancePage;