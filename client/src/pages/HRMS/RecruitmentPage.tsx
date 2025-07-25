import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Briefcase, Users, Eye, Star, TrendingUp, Brain, 
  Filter, Search, Plus, FileText, Calendar, Award
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  applicationsCount: number;
  postedDate: string;
  salary: string;
}

interface JobApplication {
  id: string;
  jobPostingId: string;
  candidateName: string;
  candidateEmail: string;
  status: string;
  aiScore?: number;
  submittedAt: string;
  resume?: string;
}

const RecruitmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [selectedJob, setSelectedJob] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch job postings
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/hrms/jobs'],
    queryFn: async () => {
      const response = await fetch('/api/hrms/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    }
  });

  // Fetch job applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['/api/hrms/applications'],
    queryFn: async () => {
      const response = await fetch('/api/hrms/applications');
      if (!response.ok) throw new Error('Failed to fetch applications');
      return response.json();
    }
  });

  // AI screening mutation
  const aiScreenMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const response = await fetch(`/api/hrms/applications/${applicationId}/ai-screen`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to screen application');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hrms/applications'] });
    }
  });

  // Mock data for demonstration
  const mockJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      status: 'active',
      applicationsCount: 45,
      postedDate: '2025-01-20',
      salary: '$120K - $180K'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      status: 'active',
      applicationsCount: 32,
      postedDate: '2025-01-18',
      salary: '$110K - $160K'
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
      status: 'draft',
      applicationsCount: 0,
      postedDate: '2025-01-25',
      salary: '$90K - $130K'
    }
  ];

  const mockApplications: JobApplication[] = [
    {
      id: '1',
      jobPostingId: '1',
      candidateName: 'Alex Johnson',
      candidateEmail: 'alex.johnson@email.com',
      status: 'under_review',
      aiScore: 87,
      submittedAt: '2025-01-22',
      resume: 'alex_johnson_resume.pdf'
    },
    {
      id: '2',
      jobPostingId: '1',
      candidateName: 'Sarah Chen',
      candidateEmail: 'sarah.chen@email.com',
      status: 'shortlisted',
      aiScore: 92,
      submittedAt: '2025-01-21',
      resume: 'sarah_chen_resume.pdf'
    },
    {
      id: '3',
      jobPostingId: '2',
      candidateName: 'Michael Brown',
      candidateEmail: 'michael.brown@email.com',
      status: 'new',
      submittedAt: '2025-01-23',
      resume: 'michael_brown_resume.pdf'
    }
  ];

  const displayJobs = jobs.length > 0 ? jobs : mockJobs;
  const displayApplications = applications.length > 0 ? applications : mockApplications;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'draft': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'closed': return 'text-red-600 bg-red-50 border-red-200';
      case 'shortlisted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'under_review': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'new': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleAIScreen = async (applicationId: string) => {
    try {
      await aiScreenMutation.mutateAsync(applicationId);
    } catch (error) {
      console.error('AI screening failed:', error);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-auto">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI-Powered Recruitment
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Intelligent talent acquisition with automated screening and insights
                </p>
              </div>
            </div>
            <motion.button
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Job Posting</span>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayJobs.filter(j => j.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayApplications.length}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shortlisted</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayApplications.filter(a => a.status === 'shortlisted').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. AI Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(displayApplications.filter(a => a.aiScore).reduce((sum, a) => sum + (a.aiScore || 0), 0) / displayApplications.filter(a => a.aiScore).length || 0)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'jobs'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Job Postings
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'applications'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Applications
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'jobs' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayJobs.map((job, index) => (
              <motion.div
                key={job.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.department} • {job.location}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{job.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Salary:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{job.salary}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Applications:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{job.applicationsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Posted:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{job.postedDate}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <motion.button 
                      className="flex-1 px-3 py-2 text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      View
                    </motion.button>
                    <motion.button 
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Applications
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayApplications.map((application, index) => (
              <motion.div
                key={application.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {application.candidateName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {application.candidateName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {application.candidateEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {application.aiScore && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(application.aiScore)}`}>
                          AI Score: {application.aiScore}
                        </div>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Applied: {application.submittedAt}</span>
                      </div>
                      {application.resume && (
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{application.resume}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!application.aiScore && (
                        <motion.button
                          onClick={() => handleAIScreen(application.id)}
                          disabled={aiScreenMutation.isPending}
                          className="flex items-center space-x-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-sm disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Brain className="w-4 h-4" />
                          <span>{aiScreenMutation.isPending ? 'Screening...' : 'AI Screen'}</span>
                        </motion.button>
                      )}
                      <motion.button 
                        className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Profile
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentPage;