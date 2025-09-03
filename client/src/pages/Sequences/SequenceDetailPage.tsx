import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Edit3, Copy, Archive, Users, Mail, Phone, 
  Calendar, TrendingUp, Clock, Target, Settings, BarChart3,
  User, CheckCircle, AlertCircle, XCircle, Clock3, Activity,
  Plus, Search, Filter, MoreVertical, ArrowRight, Trash2
} from 'lucide-react';
import SequenceStepManager from '../../components/Sequences/SequenceStepManager';
import SequenceAnalytics from '../../components/Sequences/SequenceAnalytics';
import SequenceMembers from '../../components/Sequences/SequenceMembers';
import { navigateTo } from '../../utils/navigation';

/**
 * Sequence Detail Page - Apollo.io inspired design
 * Features: Overview, Steps, Analytics, Members tabs
 * TODO: Connect to backend API for real sequence data
 */
const SequenceDetailPage: React.FC = () => {
  const [match, params] = useRoute('/sequences/:id');
  const [activeTab, setActiveTab] = useState('overview');
  const [sequence, setSequence] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock sequence data - replace with API call
  useEffect(() => {
    const fetchSequence = async () => {
      // TODO: Replace with real API call
      setTimeout(() => {
        setSequence({
          id: params?.id || '1',
          name: 'SaaS Demo Follow-up',
          description: 'Follow up sequence for SaaS demo prospects to increase conversion rates and book meetings.',
          status: 'active',
          type: 'mixed',
          steps: 7,
          prospects: 156,
          replied: 23,
          opened: 89,
          clicked: 34,
          booked: 12,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
          createdBy: 'Sarah Johnson',
          tags: ['demo', 'saas', 'high-value'],
          replyRate: 14.7,
          openRate: 57.1,
          clickRate: 21.8,
          bookingRate: 7.7,
          // Additional fields for detail view
          goal: 'Book demo meetings with qualified prospects',
          targetAudience: 'SaaS decision makers who attended our demo',
          settings: {
            sendingSchedule: 'Business days only',
            timezone: 'EST',
            dailyLimit: 50,
            weeklyLimit: 200,
            autoStop: true,
            autoStopReplies: true
          }
        });
        setLoading(false);
      }, 500);
    };

    if (params?.id) {
      fetchSequence();
    }
  }, [params?.id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'steps', label: 'Steps', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users }
  ];

  const handleSequenceAction = (action: string) => {
    switch (action) {
      case 'edit':
        // TODO: Navigate to edit mode
        console.log('Edit sequence');
        break;
      case 'clone':
        // TODO: Implement clone functionality
        console.log('Clone sequence');
        break;
      case 'archive':
        // TODO: Implement archive functionality
        console.log('Archive sequence');
        break;
      case 'activate':
        // TODO: Implement activation
        console.log('Activate sequence');
        break;
      case 'pause':
        // TODO: Implement pause
        console.log('Pause sequence');
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sequence) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sequence not found</h3>
          <p className="text-gray-600 mb-6">The sequence you're looking for doesn't exist.</p>
          <button
            onClick={() => navigateTo('/sequences')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Sequences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Left Side - Sequence Info */}
            <div className="flex items-center space-x-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    sequence.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 
                    sequence.status === 'paused' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                    sequence.status === 'draft' ? 'bg-gray-100 text-gray-800 border-gray-200' : 
                    'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {sequence.status.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2 text-gray-500">
                    {sequence.type === 'email' && <Mail className="h-4 w-4" />}
                    {sequence.type === 'call' && <Phone className="h-4 w-4" />}
                    {sequence.type === 'mixed' && <Target className="h-4 w-4" />}
                    <span className="text-sm capitalize">{sequence.type} Sequence</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{sequence.name}</h1>
                <p className="text-gray-600">{sequence.description}</p>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-3">
              {sequence.status === 'active' ? (
                <button
                  onClick={() => handleSequenceAction('pause')}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg hover:bg-yellow-200 transition-colors"
                  data-testid="button-pause-sequence"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSequenceAction('activate')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 border border-green-200 rounded-lg hover:bg-green-200 transition-colors"
                  data-testid="button-activate-sequence"
                >
                  <Play className="h-4 w-4" />
                  <span>Activate</span>
                </button>
              )}

              <button
                onClick={() => handleSequenceAction('edit')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid="button-edit-sequence"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleSequenceAction('clone')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid="button-clone-sequence"
              >
                <Copy className="h-4 w-4" />
                <span>Clone</span>
              </button>

              <div className="relative">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Steps</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{sequence.steps}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Prospects</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{sequence.prospects}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Mail className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Replies</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{sequence.replied}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Reply Rate</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{sequence.replyRate}%</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Open Rate</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{sequence.openRate}%</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-600">Booked</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{sequence.booked}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab sequence={sequence} />}
            {activeTab === 'steps' && <SequenceStepManager sequenceId={sequence.id} />}
            {activeTab === 'analytics' && <SequenceAnalytics sequenceId={sequence.id} />}
            {activeTab === 'members' && <SequenceMembers sequenceId={sequence.id} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ sequence: any }> = ({ sequence }) => {
  return (
    <div className="space-y-6">
      {/* Sequence Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goal & Target Audience */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sequence Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                <p className="text-gray-900">{sequence.goal}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <p className="text-gray-900">{sequence.targetAudience}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {sequence.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 inline-flex mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{sequence.replied}</p>
                <p className="text-sm text-gray-600">Replied</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 inline-flex mb-2">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{sequence.opened}</p>
                <p className="text-sm text-gray-600">Opened</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 inline-flex mb-2">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{sequence.clicked}</p>
                <p className="text-sm text-gray-600">Clicked</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full p-3 inline-flex mb-2">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{sequence.booked}</p>
                <p className="text-sm text-gray-600">Booked</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { type: 'reply', prospect: 'John Smith', time: '2 hours ago', message: 'Replied to step 3 email' },
                { type: 'open', prospect: 'Sarah Johnson', time: '4 hours ago', message: 'Opened step 2 email' },
                { type: 'bounce', prospect: 'Mike Chen', time: '6 hours ago', message: 'Email bounced' },
                { type: 'click', prospect: 'Emily Davis', time: '8 hours ago', message: 'Clicked link in step 1' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'reply' ? 'bg-green-100' :
                    activity.type === 'open' ? 'bg-blue-100' :
                    activity.type === 'bounce' ? 'bg-red-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'reply' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === 'open' && <Mail className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'bounce' && <XCircle className="h-4 w-4 text-red-600" />}
                    {activity.type === 'click' && <Target className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.prospect}</p>
                    <p className="text-sm text-gray-600">{activity.message}</p>
                  </div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sending Schedule</span>
                <span className="text-sm font-medium text-gray-900">{sequence.settings.sendingSchedule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Timezone</span>
                <span className="text-sm font-medium text-gray-900">{sequence.settings.timezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily Limit</span>
                <span className="text-sm font-medium text-gray-900">{sequence.settings.dailyLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auto-stop on Reply</span>
                <span className="text-sm font-medium text-gray-900">
                  {sequence.settings.autoStopReplies ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors">
              <Settings className="h-4 w-4 inline mr-2" />
              Edit Settings
            </button>
          </div>

          {/* Creation Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sequence Info</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                <p className="text-sm text-gray-900">{sequence.createdBy}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p className="text-sm text-gray-900">{new Date(sequence.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-sm text-gray-900">{new Date(sequence.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Prospects</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors">
                <Copy className="h-4 w-4" />
                <span>Clone Sequence</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Archive className="h-4 w-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceDetailPage;