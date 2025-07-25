import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Users, Building, DollarSign, Target, Calendar, Activity, PieChart, BarChart3 } from 'lucide-react';

interface Metric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

const CRMAnalyticsDashboard: React.FC = () => {
  // Fetch CRM data for analytics
  const { data: accounts = [] } = useQuery({ queryKey: ['/api/accounts'] });
  const { data: contacts = [] } = useQuery({ queryKey: ['/api/contacts'] });
  const { data: deals = [] } = useQuery({ queryKey: ['/api/deals'] });
  const { data: leads = [] } = useQuery({ queryKey: ['/api/leads'] });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate metrics
  const totalPipelineValue = Array.isArray(deals) ? deals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0) : 0;
  const avgDealSize = Array.isArray(deals) && deals.length > 0 ? totalPipelineValue / deals.length : 0;
  const totalAccounts = Array.isArray(accounts) ? accounts.length : 0;
  const totalContacts = Array.isArray(contacts) ? contacts.length : 0;
  const totalLeads = Array.isArray(leads) ? leads.length : 0;
  const wonDeals = Array.isArray(deals) ? deals.filter((deal: any) => deal.stage === 'closed_won').length : 0;
  const totalDeals = Array.isArray(deals) ? deals.length : 0;
  const winRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  const metrics: Metric[] = [
    {
      label: 'Total Pipeline',
      value: formatCurrency(totalPipelineValue),
      change: 12.5,
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      label: 'Active Accounts',
      value: totalAccounts,
      change: 8.2,
      trend: 'up',
      icon: <Building className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Contacts',
      value: totalContacts,
      change: 15.1,
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      label: 'Win Rate',
      value: `${winRate}%`,
      change: -2.4,
      trend: 'down',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      label: 'Avg Deal Size',
      value: formatCurrency(avgDealSize),
      change: 6.8,
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-indigo-500'
    },
    {
      label: 'Active Leads',
      value: totalLeads,
      change: 22.3,
      trend: 'up',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-yellow-500'
    }
  ];

  // Calculate deal stages distribution
  const dealStages = Array.isArray(deals) ? deals.reduce((acc: any, deal: any) => {
    const stage = deal.stage || 'unknown';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {}) : {};

  // Calculate lead sources
  const leadSources = Array.isArray(leads) ? leads.reduce((acc: any, lead: any) => {
    const source = lead.source || 'unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {}) : {};

  // Calculate account health distribution
  const healthDistribution = Array.isArray(accounts) ? accounts.reduce((acc: any, account: any) => {
    const score = account.healthScore || 0;
    if (score >= 80) acc.excellent = (acc.excellent || 0) + 1;
    else if (score >= 60) acc.good = (acc.good || 0) + 1;
    else if (score >= 40) acc.atRisk = (acc.atRisk || 0) + 1;
    else acc.critical = (acc.critical || 0) + 1;
    return acc;
  }, {}) : {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Create Dashboard
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${metric.color} text-white`}>
                {metric.icon}
              </div>
              <div className={`flex items-center text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : 
                 metric.trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Stages Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Deal Pipeline by Stage
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(dealStages).map(([stage, count]: [string, any]) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      stage === 'closed_won' ? 'bg-green-500' :
                      stage === 'closed_lost' ? 'bg-red-500' :
                      stage === 'negotiation' ? 'bg-orange-500' :
                      stage === 'proposal' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="text-sm text-gray-700 capitalize">
                      {stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stage === 'closed_won' ? 'bg-green-500' :
                          stage === 'closed_lost' ? 'bg-red-500' :
                          stage === 'negotiation' ? 'bg-orange-500' :
                          stage === 'proposal' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${(count / totalDeals) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Health Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Account Health Distribution
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { key: 'excellent', label: 'Excellent (80-100)', color: 'bg-green-500', count: healthDistribution.excellent || 0 },
                { key: 'good', label: 'Good (60-79)', color: 'bg-blue-500', count: healthDistribution.good || 0 },
                { key: 'atRisk', label: 'At Risk (40-59)', color: 'bg-yellow-500', count: healthDistribution.atRisk || 0 },
                { key: 'critical', label: 'Critical (0-39)', color: 'bg-red-500', count: healthDistribution.critical || 0 }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{item.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${totalAccounts > 0 ? (item.count / totalAccounts) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Lead Sources</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(leadSources).slice(0, 5).map(([source, count]: [string, any]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{source}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Activity Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Emails Sent</span>
                <span className="text-lg font-semibold text-gray-900">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Calls Made</span>
                <span className="text-lg font-semibold text-gray-900">83</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Meetings Held</span>
                <span className="text-lg font-semibold text-gray-900">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tasks Completed</span>
                <span className="text-lg font-semibold text-gray-900">156</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Performance Goals
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Monthly Revenue Target</span>
                  <span className="text-sm text-gray-900">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Lead Conversion Goal</span>
                  <span className="text-sm text-gray-900">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Activity Target</span>
                  <span className="text-sm text-gray-900">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMAnalyticsDashboard;