import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  DollarSign, Calendar, AlertCircle, CheckCircle, TrendingUp,
  Users, Shield, Brain, FileText, Clock, Target
} from 'lucide-react';

interface PayrollCycle {
  id: string;
  name: string;
  payPeriod: string;
  status: string;
  employeeCount: number;
  totalAmount: number;
  processedDate: string;
  dueDate: string;
}

const PayrollPage: React.FC = () => {
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch payroll cycles
  const { data: payrollCycles = [], isLoading } = useQuery({
    queryKey: ['/api/hrms/payroll'],
    queryFn: async () => {
      const response = await fetch('/api/hrms/payroll');
      if (!response.ok) throw new Error('Failed to fetch payroll cycles');
      return response.json();
    }
  });

  // Process payroll with AI
  const processWithAI = useMutation({
    mutationFn: async (cycleId: string) => {
      const response = await fetch(`/api/hrms/payroll/${cycleId}/process-ai`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to process payroll with AI');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hrms/payroll'] });
    }
  });

  // Mock data for enhanced demonstration
  const mockPayrollCycles: PayrollCycle[] = [
    {
      id: '1',
      name: 'January 2025 - Bi-weekly',
      payPeriod: '2025-01-01 to 2025-01-15',
      status: 'completed',
      employeeCount: 156,
      totalAmount: 890000,
      processedDate: '2025-01-16',
      dueDate: '2025-01-18'
    },
    {
      id: '2',
      name: 'January 2025 - Mid-month',
      payPeriod: '2025-01-16 to 2025-01-31',
      status: 'processing',
      employeeCount: 156,
      totalAmount: 890000,
      processedDate: '',
      dueDate: '2025-02-02'
    },
    {
      id: '3',
      name: 'February 2025 - First Half',
      payPeriod: '2025-02-01 to 2025-02-15',
      status: 'pending',
      employeeCount: 158,
      totalAmount: 912000,
      processedDate: '',
      dueDate: '2025-02-18'
    }
  ];

  const displayCycles = payrollCycles.length > 0 ? payrollCycles : mockPayrollCycles;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleProcessWithAI = async (cycleId: string) => {
    try {
      await processWithAI.mutateAsync(cycleId);
    } catch (error) {
      console.error('AI processing failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payroll data...</p>
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
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI-Powered Payroll Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Automated payroll processing with compliance monitoring and anomaly detection
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  SOX Compliant
                </span>
              </div>
              <motion.button
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <DollarSign className="w-4 h-4" />
                <span>Run Payroll</span>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Payroll</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(1780000)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Employees</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On-time Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">99.8%</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cost Savings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(45000)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Payroll Cycles */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Payroll Cycles
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {displayCycles.map((cycle: any, index: number) => (
              <motion.div
                key={cycle.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(cycle.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {cycle.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pay Period: {cycle.payPeriod}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(cycle.status)}`}>
                        {cycle.status}
                      </span>
                      {cycle.status === 'pending' && (
                        <motion.button
                          onClick={() => handleProcessWithAI(cycle.id)}
                          disabled={processWithAI.isPending}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Brain className="w-4 h-4" />
                          <span>{processWithAI.isPending ? 'Processing...' : 'AI Process'}</span>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Cycle Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Employees</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {cycle.employeeCount}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(cycle.totalAmount)}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Due Date</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {cycle.dueDate}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Processed</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {cycle.processedDate || 'Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-3">
                    <motion.button 
                      className="flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Report</span>
                    </motion.button>
                    <motion.button 
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Users className="w-4 h-4" />
                      <span>Employee Details</span>
                    </motion.button>
                    <motion.button 
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Compliance Check</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insights Panel */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
              AI Payroll Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-green-800 dark:text-green-200">Anomaly Detection</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                2 overtime anomalies detected requiring review before processing.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-green-800 dark:text-green-200">Compliance Status</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                All tax calculations updated. Federal compliance verified.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-green-800 dark:text-green-200">Cost Optimization</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                AI identified $12K in potential savings through benefit optimization.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PayrollPage;