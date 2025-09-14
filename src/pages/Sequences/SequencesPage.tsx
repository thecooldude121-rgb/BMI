import React, { useState } from 'react';
import { Plus, Play, Pause, MoreHorizontal, Mail, Phone, MessageSquare, TrendingUp, Users, Clock, Target } from 'lucide-react';
import EmailTemplates from './EmailTemplates';

interface SequenceStep {
  id: string;
  stepType: 'email' | 'call' | 'linkedin' | 'wait';
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
  subject?: string;
  content?: string;
  isActive: boolean;
}

interface Sequence {
  id: string;
  name: string;
  description: string;
  steps: SequenceStep[];
  isActive: boolean;
  enrolledCount: number;
  completedCount: number;
  replyCount: number;
  openRate: number;
  createdAt: string;
}

const SequencesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'templates' | 'analytics'>('active');

  const tabs = [
    { id: 'active', name: 'Active Sequences', icon: Target },
    { id: 'templates', name: 'Email Templates', icon: Mail },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ];

  const sequences: Sequence[] = [
    {
      id: '1',
      name: 'Cold Outreach - Tech Companies',
      description: 'Multi-touch sequence for technology companies with 500+ employees',
      steps: [
        { id: '1', stepType: 'email', delay: 0, delayUnit: 'days', subject: 'Quick question about {{company_name}}', content: 'Hi {{first_name}}...', isActive: true },
        { id: '2', stepType: 'wait', delay: 3, delayUnit: 'days', isActive: true },
        { id: '3', stepType: 'email', delay: 0, delayUnit: 'days', subject: 'Following up on {{company_name}}', content: 'Hi {{first_name}}...', isActive: true },
        { id: '4', stepType: 'call', delay: 2, delayUnit: 'days', isActive: true },
        { id: '5', stepType: 'linkedin', delay: 1, delayUnit: 'days', isActive: true }
      ],
      isActive: true,
      enrolledCount: 156,
      completedCount: 23,
      replyCount: 18,
      openRate: 34.2,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Follow-up After Demo',
      description: 'Nurture sequence for prospects who attended a product demo',
      steps: [
        { id: '1', stepType: 'email', delay: 1, delayUnit: 'hours', subject: 'Thanks for your time today', content: 'Hi {{first_name}}...', isActive: true },
        { id: '2', stepType: 'wait', delay: 2, delayUnit: 'days', isActive: true },
        { id: '3', stepType: 'email', delay: 0, delayUnit: 'days', subject: 'Next steps for {{company_name}}', content: 'Hi {{first_name}}...', isActive: true }
      ],
      isActive: true,
      enrolledCount: 89,
      completedCount: 34,
      replyCount: 28,
      openRate: 67.8,
      createdAt: '2024-01-20'
    }
  ];

  const getStepIcon = (stepType: SequenceStep['stepType']) => {
    switch (stepType) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'linkedin': return Users;
      case 'wait': return Clock;
      default: return Mail;
    }
  };

  const getSequenceStats = (sequenceId: string) => {
    const sequence = sequences.find(s => s.id === sequenceId);
    if (!sequence) return { enrolled: 0, completed: 0, replied: 0, bounced: 0 };
    
    return {
      enrolled: sequence.enrolledCount,
      completed: sequence.completedCount,
      replied: sequence.replyCount,
      bounced: Math.floor(sequence.enrolledCount * 0.05) // 5% bounce rate
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Sequences</h1>
          <p className="text-gray-600">Automate your outreach with multi-touch email sequences</p>
        </div>
        <button className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Create Sequence
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">245</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">57</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Replies</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">34.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {sequences.map((sequence) => {
              const stats = getSequenceStats(sequence.id);
              
              return (
                <div key={sequence.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{sequence.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          sequence.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sequence.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-gray-600">{sequence.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                        {sequence.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sequence Steps */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sequence Steps</h4>
                    <div className="flex items-center space-x-2">
                      {sequence.steps.map((step, index) => {
                        const StepIcon = getStepIcon(step.stepType);
                        return (
                          <div key={step.id} className="flex items-center">
                            <div className={`p-2 rounded-full ${
                              step.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              <StepIcon className="h-4 w-4" />
                            </div>
                            {index < sequence.steps.length - 1 && (
                              <div className="w-8 h-0.5 bg-gray-300 mx-1"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{stats.enrolled}</p>
                      <p className="text-xs text-gray-600">Enrolled</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{stats.completed}</p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{stats.replied}</p>
                      <p className="text-xs text-gray-600">Replied</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">{stats.bounced}</p>
                      <p className="text-xs text-gray-600">Bounced</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'templates' && <EmailTemplates />}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sequence Analytics</h3>
          <p className="text-gray-600 mb-6">Detailed performance metrics and optimization insights</p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700">
            View Analytics
          </button>
        </div>
      )}
    </div>
  );
};

export default SequencesPage;