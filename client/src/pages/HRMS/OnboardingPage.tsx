import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  UserPlus, Calendar, CheckCircle, Clock, AlertCircle, Brain,
  Users, FileText, Monitor, Coffee, Target, Zap, Star
} from 'lucide-react';

interface OnboardingProcess {
  id: string;
  employeeId: string;
  status: string;
  currentStage: string;
  progress: number;
  startDate: string;
  expectedCompletion: string;
  assignedBuddy?: string;
  checklist: { task: string; completed: boolean; priority: string }[];
}

const OnboardingPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch onboarding processes
  const { data: processes = [], isLoading } = useQuery({
    queryKey: ['/api/hrms/onboarding'],
    queryFn: async () => {
      const response = await fetch('/api/hrms/onboarding');
      if (!response.ok) throw new Error('Failed to fetch onboarding processes');
      return response.json();
    }
  });

  // Generate AI onboarding plan
  const generatePlanMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await fetch(`/api/hrms/onboarding/ai-plan/${employeeId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to generate AI plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hrms/onboarding'] });
    }
  });

  const [aiPlan, setAiPlan] = useState<any>(null);

  const handleGenerateAIPlan = async () => {
    if (!selectedEmployee) return;
    const plan = await generatePlanMutation.mutateAsync(selectedEmployee);
    setAiPlan(plan);
  };

  const mockProcesses: OnboardingProcess[] = [
    {
      id: '1',
      employeeId: 'emp-001',
      status: 'in_progress',
      currentStage: 'IT Setup',
      progress: 65,
      startDate: '2025-01-20',
      expectedCompletion: '2025-02-03',
      assignedBuddy: 'Sarah Johnson',
      checklist: [
        { task: 'Complete documentation', completed: true, priority: 'high' },
        { task: 'IT setup and system access', completed: true, priority: 'high' },
        { task: 'Department orientation', completed: false, priority: 'medium' },
        { task: 'Meet team and buddy assignment', completed: false, priority: 'medium' },
        { task: 'Initial training modules', completed: false, priority: 'low' }
      ]
    },
    {
      id: '2',
      employeeId: 'emp-002',
      status: 'completed',
      currentStage: 'Completed',
      progress: 100,
      startDate: '2025-01-15',
      expectedCompletion: '2025-01-29',
      assignedBuddy: 'Mike Chen',
      checklist: [
        { task: 'Complete documentation', completed: true, priority: 'high' },
        { task: 'IT setup and system access', completed: true, priority: 'high' },
        { task: 'Department orientation', completed: true, priority: 'medium' },
        { task: 'Meet team and buddy assignment', completed: true, priority: 'medium' },
        { task: 'Initial training modules', completed: true, priority: 'low' }
      ]
    }
  ];

  const displayProcesses = processes.length > 0 ? processes : mockProcesses;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading onboarding processes...</p>
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
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI-Powered Onboarding
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Personalized employee welcome journeys with intelligent automation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Employee</option>
                <option value="emp-003">John Doe</option>
                <option value="emp-004">Jane Smith</option>
              </select>
              <motion.button
                onClick={handleGenerateAIPlan}
                disabled={!selectedEmployee || generatePlanMutation.isPending}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Brain className="w-4 h-4" />
                <span>{generatePlanMutation.isPending ? 'Generating...' : 'Generate AI Plan'}</span>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Processes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayProcesses.filter((p: any) => p.status === 'in_progress').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                    {displayProcesses.filter((p: any) => p.status === 'completed').length}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Duration</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12 days</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8/5</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI Plan Results */}
        {aiPlan && (
          <motion.div 
            className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                AI-Generated Onboarding Plan
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">Personalized Plan</h3>
                <p className="text-purple-700 dark:text-purple-300 mb-3">{aiPlan.personalizedPlan?.welcomeMessage}</p>
                <div className="space-y-2">
                  {aiPlan.personalizedPlan?.milestones?.map((milestone: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">
                        {milestone.day}
                      </div>
                      <span className="text-purple-700 dark:text-purple-300">{milestone.task}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(milestone.priority)}`}>
                        {milestone.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">Automated Tasks</h3>
                <div className="space-y-2">
                  {aiPlan.automatedTasks?.map((task: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span className="text-purple-700 dark:text-purple-300">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Onboarding Processes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {displayProcesses.map((process: any, index: number) => (
            <motion.div
              key={process.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(process.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Employee ID: {process.employeeId}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current Stage: {process.currentStage}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {process.progress}%
                    </p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{process.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${process.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Onboarding Checklist</h4>
                  {process.checklist.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        )}
                        <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {item.task}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>Started: {process.startDate}</span>
                      <span>Due: {process.expectedCompletion}</span>
                    </div>
                    {process.assignedBuddy && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Buddy: {process.assignedBuddy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;