import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Brain, BookOpen, Play, Clock, Award, TrendingUp,
  Users, Target, Zap, Star, CheckCircle, ArrowRight
} from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  enrolledCount: number;
  completionRate: number;
  category: string;
}

const LearningPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const queryClient = useQueryClient();

  // Fetch learning paths
  const { data: learningPaths = [], isLoading } = useQuery({
    queryKey: ['/api/hrms/learning-paths'],
    queryFn: async () => {
      const response = await fetch('/api/hrms/learning-paths');
      if (!response.ok) throw new Error('Failed to fetch learning paths');
      return response.json();
    }
  });

  // Generate personalized learning path
  const generatePersonalizedPath = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await fetch(`/api/hrms/learning/personalized-path/${employeeId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to generate personalized path');
      return response.json();
    }
  });

  // Mock data for demonstration
  const mockLearningPaths: LearningPath[] = [
    {
      id: '1',
      title: 'Advanced Leadership Skills',
      description: 'Develop executive leadership capabilities with modern management techniques',
      duration: '4 weeks',
      level: 'Advanced',
      enrolledCount: 156,
      completionRate: 87,
      category: 'Leadership'
    },
    {
      id: '2',
      title: 'Technical Communication',
      description: 'Master the art of technical communication for developers and engineers',
      duration: '2 weeks',
      level: 'Intermediate',
      enrolledCount: 234,
      completionRate: 92,
      category: 'Communication'
    },
    {
      id: '3',
      title: 'Data Analysis Fundamentals',
      description: 'Learn data analysis techniques and tools for business insights',
      duration: '6 weeks',
      level: 'Beginner',
      enrolledCount: 189,
      completionRate: 78,
      category: 'Technical'
    },
    {
      id: '4',
      title: 'Project Management Excellence',
      description: 'Comprehensive project management methodology and best practices',
      duration: '5 weeks',
      level: 'Intermediate',
      enrolledCount: 167,
      completionRate: 85,
      category: 'Management'
    }
  ];

  const displayPaths = learningPaths.length > 0 ? learningPaths : mockLearningPaths;
  const categories = ['all', 'Leadership', 'Technical', 'Communication', 'Management'];

  const filteredPaths = selectedCategory === 'all' 
    ? displayPaths 
    : displayPaths.filter((path: any) => path.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Advanced': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-blue-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading learning paths...</p>
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
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI-Powered Learning & Development
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Personalized learning paths with adaptive content and intelligent coaching
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => generatePersonalizedPath.mutate('current-user')}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-4 h-4" />
              <span>Generate My Path</span>
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Learners</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">746</p>
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses Available</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayPaths.length}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(displayPaths.reduce((sum: number, path: any) => sum + path.completionRate, 0) / displayPaths.length)}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates Earned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {category === 'all' ? 'All Categories' : category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPaths.map((path: any, index: number) => (
            <motion.div
              key={path.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                      {path.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {path.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getLevelColor(path.level)}`}>
                    {path.level}
                  </span>
                </div>

                {/* Progress and Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {path.duration}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {path.enrolledCount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Enrolled</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm font-medium ${getCompletionColor(path.completionRate)}`}>
                        {path.completionRate}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Completion Rate</span>
                    <span>{path.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${path.completionRate}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <motion.button 
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Learning</span>
                  </motion.button>
                  <motion.button 
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Coaching Insights Panel */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
              AI Learning Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-indigo-800 dark:text-indigo-200">Recommended Next</span>
              </div>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Based on your progress, we recommend "Advanced Data Visualization" next.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-indigo-800 dark:text-indigo-200">Learning Style</span>
              </div>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                You learn best with hands-on projects and visual content.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-indigo-800 dark:text-indigo-200">Progress Trend</span>
              </div>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Your learning velocity has increased 25% this month!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningPage;