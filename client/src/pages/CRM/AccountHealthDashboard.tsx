import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, Brain,
  BarChart3, PieChart, Target, Zap, Users, DollarSign, Calendar, ArrowUp,
  ArrowDown, Eye, RefreshCw, Filter, Download, Share2, Settings, Bell,
  Clock, Star, Award, Shield, Heart, Battery, ThermometerSun
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  color: string;
  icon: any;
  description: string;
}

interface AccountHealth {
  id: string;
  name: string;
  healthScore: number;
  healthTrend: 'improving' | 'declining' | 'stable';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
  predictedChurn: number;
  engagementScore: number;
  revenueRisk: number;
  factors: {
    name: string;
    impact: number;
    trend: 'positive' | 'negative' | 'neutral';
  }[];
  insights: {
    type: 'opportunity' | 'risk' | 'action';
    message: string;
    priority: 'high' | 'medium' | 'low';
    confidence: number;
  }[];
  recommendations: {
    action: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    timeline: string;
  }[];
}

interface PredictiveInsight {
  id: string;
  type: 'churn_risk' | 'expansion_opportunity' | 'engagement_drop' | 'revenue_growth';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeline: string;
  accountsAffected: number;
  potentialValue: string;
  recommendations: string[];
}

const AccountHealthDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const queryClient = useQueryClient();

  // Fetch overall health metrics
  const { data: healthMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/accounts/health/metrics', selectedTimeframe],
    queryFn: () => apiRequest(`/api/accounts/health/metrics?timeframe=${selectedTimeframe}`),
  });

  // Fetch account health data
  const { data: accountsHealth = [], isLoading: healthLoading } = useQuery({
    queryKey: ['/api/accounts/health', selectedFilter, selectedTimeframe],
    queryFn: () => apiRequest(`/api/accounts/health?filter=${selectedFilter}&timeframe=${selectedTimeframe}`),
  });

  // Fetch predictive insights
  const { data: predictiveInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/accounts/health/insights', selectedTimeframe],
    queryFn: () => apiRequest(`/api/accounts/health/insights?timeframe=${selectedTimeframe}`),
  });

  // Generate AI insights mutation
  const generateInsightsMutation = useMutation({
    mutationFn: () => apiRequest('/api/accounts/health/generate-insights', { 
      method: 'POST', 
      body: JSON.stringify({ timeframe: selectedTimeframe }),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/health/insights'] });
      setIsGeneratingInsights(false);
    },
  });

  const handleGenerateInsights = () => {
    setIsGeneratingInsights(true);
    generateInsightsMutation.mutate();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'improving': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
      case 'declining': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <span className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  // Mock data for demonstration (replace with real API calls)
  const mockHealthMetrics: HealthMetric[] = [
    {
      id: '1',
      name: 'Overall Health Score',
      value: 78,
      trend: 'up',
      change: 5.2,
      color: 'blue',
      icon: Heart,
      description: 'Average health score across all accounts'
    },
    {
      id: '2',
      name: 'At-Risk Accounts',
      value: 12,
      trend: 'down',
      change: -2,
      color: 'red',
      icon: AlertTriangle,
      description: 'Accounts with health score below 40'
    },
    {
      id: '3',
      name: 'Engagement Rate',
      value: 84,
      trend: 'up',
      change: 8.1,
      color: 'green',
      icon: Activity,
      description: 'Average engagement across all touchpoints'
    },
    {
      id: '4',
      name: 'Churn Probability',
      value: 15,
      trend: 'down',
      change: -3.5,
      color: 'orange',
      icon: TrendingDown,
      description: 'Predicted churn risk within next 90 days'
    },
    {
      id: '5',
      name: 'Revenue at Risk',
      value: 125000,
      trend: 'stable',
      change: 0,
      color: 'purple',
      icon: DollarSign,
      description: 'Potential revenue loss from at-risk accounts'
    },
    {
      id: '6',
      name: 'Health Improving',
      value: 23,
      trend: 'up',
      change: 12,
      color: 'emerald',
      icon: TrendingUp,
      description: 'Accounts showing positive health trends'
    }
  ];

  const mockPredictiveInsights: PredictiveInsight[] = [
    {
      id: '1',
      type: 'churn_risk',
      title: 'High Churn Risk Detected',
      description: 'AI has identified 3 enterprise accounts with declining engagement patterns and reduced activity.',
      confidence: 87,
      impact: 'high',
      timeline: 'Next 30 days',
      accountsAffected: 3,
      potentialValue: '$450K ARR',
      recommendations: [
        'Schedule executive check-ins immediately',
        'Review and address any support tickets',
        'Propose value-add services or feature updates'
      ]
    },
    {
      id: '2',
      type: 'expansion_opportunity',
      title: 'Expansion Opportunities Identified',
      description: 'Based on usage patterns, 8 accounts show strong signals for upselling additional services.',
      confidence: 92,
      impact: 'high',
      timeline: 'Next 60 days',
      accountsAffected: 8,
      potentialValue: '$280K expansion',
      recommendations: [
        'Present usage analytics to demonstrate value',
        'Propose pilot programs for additional features',
        'Schedule product demo sessions'
      ]
    },
    {
      id: '3',
      type: 'engagement_drop',
      title: 'Engagement Anomaly Alert',
      description: 'Unusual drop in product engagement detected across 5 mid-market accounts.',
      confidence: 78,
      impact: 'medium',
      timeline: 'Last 14 days',
      accountsAffected: 5,
      potentialValue: '$180K at risk',
      recommendations: [
        'Investigate product usage barriers',
        'Provide additional training resources',
        'Schedule health check calls'
      ]
    }
  ];

  if (metricsLoading || healthLoading) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Brain className="w-7 h-7 mr-3 text-blue-600" />
              Account Health Intelligence
            </h1>
            <p className="text-gray-600">AI-powered predictive insights and health monitoring</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={handleGenerateInsights}
              disabled={isGeneratingInsights}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              {isGeneratingInsights ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {isGeneratingInsights ? 'Generating...' : 'Generate AI Insights'}
            </button>
            
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Health Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockHealthMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                    <Icon className={`w-4 h-4 text-${metric.color}-600`} />
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                
                <div className="mb-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.name === 'Revenue at Risk' ? `$${(metric.value / 1000).toFixed(0)}K` : metric.value}
                  </span>
                  {metric.change !== 0 && (
                    <span className={`ml-2 text-sm font-medium ${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 font-medium">{metric.name}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Predictive Insights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              AI Predictive Insights
            </h2>
            <div className="flex items-center space-x-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Insights</option>
                <option value="high_impact">High Impact</option>
                <option value="urgent">Urgent</option>
                <option value="opportunities">Opportunities</option>
              </select>
              <button className="text-gray-600 hover:text-gray-900 p-1">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {mockPredictiveInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'churn_risk' ? 'bg-red-100' :
                    insight.type === 'expansion_opportunity' ? 'bg-green-100' :
                    insight.type === 'engagement_drop' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {insight.type === 'churn_risk' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    {insight.type === 'expansion_opportunity' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {insight.type === 'engagement_drop' && <Activity className="w-4 h-4 text-yellow-600" />}
                    {insight.type === 'revenue_growth' && <DollarSign className="w-4 h-4 text-blue-600" />}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {insight.impact.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Confidence</span>
                    <span className="font-medium">{insight.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${insight.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">{insight.accountsAffected}</span> accounts
                  </div>
                  <div>
                    <span className="font-medium">{insight.potentialValue}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">{insight.timeline}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-900">Recommended Actions:</h4>
                  {insight.recommendations.slice(0, 2).map((rec, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex items-start">
                      <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {rec}
                    </div>
                  ))}
                  {insight.recommendations.length > 2 && (
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      +{insight.recommendations.length - 2} more actions
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Account Health Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ThermometerSun className="w-5 h-5 mr-2 text-orange-600" />
              Health Distribution
            </h2>
            
            <div className="space-y-4">
              {[
                { range: '80-100', label: 'Excellent', count: 45, color: 'bg-green-500', percentage: 42 },
                { range: '60-79', label: 'Good', count: 32, color: 'bg-blue-500', percentage: 30 },
                { range: '40-59', label: 'At Risk', count: 18, color: 'bg-yellow-500', percentage: 17 },
                { range: '0-39', label: 'Critical', count: 12, color: 'bg-red-500', percentage: 11 }
              ].map((segment) => (
                <div key={segment.range} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{segment.label}</span>
                    <span className="text-xs text-gray-500">({segment.range})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${segment.color}`}
                        style={{ width: `${segment.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{segment.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Battery className="w-5 h-5 mr-2 text-blue-600" />
              Health Trends
            </h2>
            
            <div className="space-y-4">
              {[
                { metric: 'Product Usage', current: 78, change: 5, trend: 'up' },
                { metric: 'Support Tickets', current: 23, change: -12, trend: 'down' },
                { metric: 'Login Frequency', current: 85, change: 8, trend: 'up' },
                { metric: 'Feature Adoption', current: 67, change: 15, trend: 'up' },
                { metric: 'Payment Issues', current: 4, change: -50, trend: 'down' }
              ].map((trend) => (
                <div key={trend.metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trend.metric}</p>
                    <p className="text-xs text-gray-500">Current: {trend.current}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {trend.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-semibold ${
                      trend.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.change > 0 ? '+' : ''}{trend.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-red-600" />
            Real-time Health Alerts
          </h2>
          
          <div className="space-y-3">
            {[
              {
                type: 'critical',
                message: 'TechCorp Industries health score dropped below 30',
                time: '2 minutes ago',
                account: 'TechCorp Industries'
              },
              {
                type: 'warning',
                message: 'Unusual login pattern detected for Global Solutions',
                time: '15 minutes ago',
                account: 'Global Solutions'
              },
              {
                type: 'info',
                message: 'Health score improvement detected for StartupX',
                time: '1 hour ago',
                account: 'StartupX'
              }
            ].map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">Account: {alert.account}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">{alert.time}</span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHealthDashboard;