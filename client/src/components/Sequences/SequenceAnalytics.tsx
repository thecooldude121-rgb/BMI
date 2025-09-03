import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Mail, Phone, Users, Target, 
  Calendar, Clock, Eye, MousePointer, Reply, Calendar as CalendarIcon,
  BarChart3, PieChart, Activity, Download, Filter, RefreshCw
} from 'lucide-react';

interface SequenceAnalyticsProps {
  sequenceId: string;
}

interface AnalyticsData {
  overview: {
    totalProspects: number;
    activeProspects: number;
    replied: number;
    opened: number;
    clicked: number;
    booked: number;
    replyRate: number;
    openRate: number;
    clickRate: number;
    bookingRate: number;
  };
  performance: {
    byStep: Array<{
      step: number;
      type: string;
      sent: number;
      opened: number;
      clicked: number;
      replied: number;
      openRate: number;
      clickRate: number;
      replyRate: number;
    }>;
    byDay: Array<{
      date: string;
      sent: number;
      opened: number;
      clicked: number;
      replied: number;
    }>;
  };
  prospects: Array<{
    id: string;
    name: string;
    company: string;
    status: 'active' | 'replied' | 'bounced' | 'unsubscribed';
    currentStep: number;
    lastActivity: string;
    reply: string | null;
  }>;
}

/**
 * Sequence Analytics Component - Apollo.io inspired analytics dashboard
 * Features: Performance metrics, step analysis, prospect tracking
 * TODO: Connect to backend API for real analytics data
 */
const SequenceAnalytics: React.FC<SequenceAnalyticsProps> = ({ sequenceId }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock analytics data - replace with API call
  useEffect(() => {
    const fetchAnalytics = async () => {
      // TODO: Replace with real API call
      setTimeout(() => {
        setData({
          overview: {
            totalProspects: 156,
            activeProspects: 89,
            replied: 23,
            opened: 89,
            clicked: 34,
            booked: 12,
            replyRate: 14.7,
            openRate: 57.1,
            clickRate: 21.8,
            bookingRate: 7.7
          },
          performance: {
            byStep: [
              { step: 1, type: 'email', sent: 156, opened: 89, clicked: 34, replied: 12, openRate: 57.1, clickRate: 21.8, replyRate: 7.7 },
              { step: 2, type: 'email', sent: 144, opened: 67, clicked: 18, replied: 8, openRate: 46.5, clickRate: 12.5, replyRate: 5.6 },
              { step: 3, type: 'call', sent: 136, opened: 0, clicked: 0, replied: 3, openRate: 0, clickRate: 0, replyRate: 2.2 },
              { step: 4, type: 'email', sent: 133, opened: 45, clicked: 12, replied: 0, openRate: 33.8, clickRate: 9.0, replyRate: 0 }
            ],
            byDay: [
              { date: '2024-01-20', sent: 45, opened: 23, clicked: 8, replied: 3 },
              { date: '2024-01-19', sent: 38, opened: 19, clicked: 6, replied: 2 },
              { date: '2024-01-18', sent: 41, opened: 25, clicked: 9, replied: 4 },
              { date: '2024-01-17', sent: 32, opened: 18, clicked: 5, replied: 1 }
            ]
          },
          prospects: [
            { id: '1', name: 'John Smith', company: 'Acme Corp', status: 'replied', currentStep: 2, lastActivity: '2 hours ago', reply: 'Thanks for reaching out! I\'d love to learn more.' },
            { id: '2', name: 'Sarah Johnson', company: 'TechCorp', status: 'active', currentStep: 3, lastActivity: '1 day ago', reply: null },
            { id: '3', name: 'Mike Chen', company: 'StartupXYZ', status: 'active', currentStep: 1, lastActivity: '3 hours ago', reply: null },
            { id: '4', name: 'Emily Davis', company: 'BigCorp', status: 'bounced', currentStep: 1, lastActivity: '2 days ago', reply: null },
            { id: '5', name: 'David Wilson', company: 'Growth Inc', status: 'replied', currentStep: 1, lastActivity: '5 hours ago', reply: 'Not interested at this time, but please follow up in Q2.' }
          ]
        });
        setLoading(false);
      }, 500);
    };

    fetchAnalytics();
  }, [sequenceId, timeRange]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'prospects', label: 'Prospects', icon: Users }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bounced': return 'bg-red-100 text-red-800 border-red-200';
      case 'unsubscribed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
        <p className="text-gray-600">Analytics will appear once your sequence starts running.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reply Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.replyRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">+2.3%</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Reply className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.openRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 ml-1">+1.8%</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.clickRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600 ml-1">-0.5%</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MousePointer className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Booking Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.bookingRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-600 ml-1">+3.1%</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
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

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Prospects</span>
                  <span className="text-sm font-medium text-gray-900">{data.overview.totalProspects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Prospects</span>
                  <span className="text-sm font-medium text-gray-900">{data.overview.activeProspects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Emails Opened</span>
                  <span className="text-sm font-medium text-gray-900">{data.overview.opened}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Links Clicked</span>
                  <span className="text-sm font-medium text-gray-900">{data.overview.clicked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Replies Received</span>
                  <span className="text-sm font-medium text-gray-900">{data.overview.replied}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Meetings Booked</span>
                  <span className="text-sm font-medium text-gray-900">{data.overview.booked}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-3">
                {[
                  { type: 'reply', prospect: 'John Smith', time: '2 hours ago', action: 'Replied to step 2' },
                  { type: 'open', prospect: 'Sarah Johnson', time: '4 hours ago', action: 'Opened step 3 email' },
                  { type: 'click', prospect: 'Mike Chen', time: '6 hours ago', action: 'Clicked link in step 1' },
                  { type: 'bounce', prospect: 'Emily Davis', time: '8 hours ago', action: 'Email bounced' },
                  { type: 'book', prospect: 'David Wilson', time: '1 day ago', action: 'Booked a meeting' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'reply' ? 'bg-green-100' :
                      activity.type === 'open' ? 'bg-blue-100' :
                      activity.type === 'click' ? 'bg-purple-100' :
                      activity.type === 'bounce' ? 'bg-red-100' :
                      'bg-orange-100'
                    }`}>
                      {activity.type === 'reply' && <Reply className="h-4 w-4 text-green-600" />}
                      {activity.type === 'open' && <Eye className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'click' && <MousePointer className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'bounce' && <Mail className="h-4 w-4 text-red-600" />}
                      {activity.type === 'book' && <CalendarIcon className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.prospect}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Step Performance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Step Performance</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Step</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Sent</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Opened</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Clicked</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Replied</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Open Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Reply Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.performance.byStep.map((step) => (
                      <tr key={step.step} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">Step {step.step}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {step.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                            {step.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                            <span className="text-sm text-gray-600 capitalize">{step.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{step.sent}</td>
                        <td className="py-3 px-4 text-gray-900">{step.opened}</td>
                        <td className="py-3 px-4 text-gray-900">{step.clicked}</td>
                        <td className="py-3 px-4 text-gray-900">{step.replied}</td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">{step.openRate}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">{step.replyRate}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daily Performance Chart Placeholder */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Performance</h4>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Chart visualization would go here</p>
                  <p className="text-sm text-gray-500">Connect to charting library for visual analytics</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prospects' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Prospect Status</h4>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Prospect</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Company</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Current Step</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Last Activity</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {data.prospects.map((prospect) => (
                    <tr key={prospect.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{prospect.name}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{prospect.company}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(prospect.status)}`}>
                          {prospect.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">Step {prospect.currentStep}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{prospect.lastActivity}</td>
                      <td className="py-4 px-6">
                        {prospect.reply ? (
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900 truncate" title={prospect.reply}>
                              {prospect.reply}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SequenceAnalytics;