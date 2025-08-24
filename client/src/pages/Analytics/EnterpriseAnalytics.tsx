import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Building, DollarSign, Target, Calendar, Activity, 
  PieChart, Filter, Download, Search, Bot, Brain, Lightbulb, Award, Trophy, Star, 
  ChevronDown, ChevronUp, Settings, RefreshCcw, Share2, Bell, Zap, Eye, 
  MessageSquare, Phone, Mail, Clock, Sparkles, ArrowUpRight, Minus as TrendingFlat,
  Plus, Minus, Move, Grid3X3, List, Table, Map, Thermometer, Globe, Shield,
  BarChart, LineChart, Radar, Archive, FileText, Link2, Bookmark,
  HelpCircle, AlertCircle, CheckCircle, XCircle, PlayCircle, PauseCircle
} from 'lucide-react';

// Enhanced interfaces for enterprise features
interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'heatmap' | 'leaderboard' | 'calendar' | 'goals' | 'forecast';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
  isVisible: boolean;
  aiInsights?: string[];
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  relatedMetric?: string;
  timestamp: Date;
}

interface FilterPreset {
  id: string;
  name: string;
  filters: any;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
}

const EnterpriseAnalytics: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Core data queries with enhanced error handling
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({ 
    queryKey: ['/api/accounts'],
    staleTime: 30000,
    retry: 3
  });
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({ 
    queryKey: ['/api/contacts'],
    staleTime: 30000,
    retry: 3
  });
  const { data: deals = [], isLoading: dealsLoading } = useQuery({ 
    queryKey: ['/api/deals'],
    staleTime: 30000,
    retry: 3
  });
  const { data: leads = [], isLoading: leadsLoading } = useQuery({ 
    queryKey: ['/api/leads'],
    staleTime: 30000,
    retry: 3
  });
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({ 
    queryKey: ['/api/activities'],
    staleTime: 30000,
    retry: 3
  });

  // State management for enterprise features
  const [dashboardLayout, setDashboardLayout] = useState<DashboardWidget[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [activeFilters, setActiveFilters] = useState({});
  const [savedFilterPresets, setSavedFilterPresets] = useState<FilterPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [naturalQuery, setNaturalQuery] = useState('');
  const [queryResults, setQueryResults] = useState<any>(null);
  const [userPreferences, setUserPreferences] = useState({});
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [exportLoading, setExportLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  // Loading states
  const isLoading = accountsLoading || contactsLoading || dealsLoading || leadsLoading || activitiesLoading;

  // Enhanced metrics calculation with AI insights
  const calculateMetrics = useCallback(() => {
    if (isLoading) return {};

    const dealsArray = Array.isArray(deals) ? deals : [];
    const leadsArray = Array.isArray(leads) ? leads : [];
    const accountsArray = Array.isArray(accounts) ? accounts : [];

    const totalPipelineValue = dealsArray.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
    const avgDealSize = dealsArray.length > 0 ? totalPipelineValue / dealsArray.length : 0;
    const wonDeals = dealsArray.filter((deal: any) => deal.stage === 'closed_won');
    const wonValue = wonDeals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
    const winRate = dealsArray.length > 0 ? (wonDeals.length / dealsArray.length) * 100 : 0;
    const conversionRate = leadsArray.length > 0 ? (wonDeals.length / leadsArray.length) * 100 : 0;
    
    // Advanced metrics
    const salesCycleAvg = dealsArray.length > 0 ? dealsArray.reduce((sum: number, deal: any) => {
      const created = new Date(deal.createdAt);
      const closed = deal.stage.startsWith('closed') ? new Date(deal.updatedAt) : new Date();
      return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    }, 0) / dealsArray.length : 0;

    const healthyAccounts = accountsArray.filter((acc: any) => (acc.healthScore || 0) >= 70).length;
    const atRiskAccounts = accountsArray.filter((acc: any) => (acc.healthScore || 0) < 40).length;
    
    const monthlyRecurring = dealsArray
      .filter((deal: any) => deal.dealType === 'recurring' && deal.stage === 'closed_won')
      .reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);

    return {
      totalPipelineValue,
      avgDealSize,
      wonValue,
      winRate,
      conversionRate,
      salesCycleAvg,
      healthyAccounts,
      atRiskAccounts,
      monthlyRecurring,
      totalAccounts: accountsArray.length,
      totalContacts: Array.isArray(contacts) ? contacts.length : 0,
      totalLeads: leadsArray.length,
      totalDeals: dealsArray.length,
      activeDeals: dealsArray.filter((deal: any) => !deal.stage.startsWith('closed')).length
    };
  }, [accounts, contacts, deals, leads, isLoading]);

  const metrics = React.useMemo(() => calculateMetrics(), [calculateMetrics]);

  // AI-powered insights generation
  const generateAIInsights = useCallback(() => {
    if (isLoading || !metrics || Object.keys(metrics).length === 0) return;

    const insights: AIInsight[] = [];

    // Trend analysis
    if (metrics.winRate && metrics.winRate < 20) {
      insights.push({
        id: 'low-win-rate',
        type: 'alert',
        title: 'Low Win Rate Detected',
        description: `Current win rate of ${metrics.winRate?.toFixed(1)}% is below industry average. Consider reviewing qualification process.`,
        confidence: 85,
        priority: 'high',
        actionable: true,
        relatedMetric: 'winRate',
        timestamp: new Date()
      });
    }

    // Pipeline health
    if (metrics.activeDeals && metrics.activeDeals < 10) {
      insights.push({
        id: 'low-pipeline',
        type: 'recommendation',
        title: 'Pipeline Needs Attention',
        description: 'Active deal count is low. Focus on lead generation and qualification.',
        confidence: 90,
        priority: 'medium',
        actionable: true,
        relatedMetric: 'activeDeals',
        timestamp: new Date()
      });
    }

    // Account health insights
    if (metrics.atRiskAccounts && metrics.atRiskAccounts > metrics.healthyAccounts) {
      insights.push({
        id: 'account-health-risk',
        type: 'alert',
        title: 'Account Health Declining',
        description: `${metrics.atRiskAccounts} accounts are at risk. Immediate engagement recommended.`,
        confidence: 95,
        priority: 'critical',
        actionable: true,
        relatedMetric: 'atRiskAccounts',
        timestamp: new Date()
      });
    }

    // Sales cycle optimization
    if (metrics.salesCycleAvg && metrics.salesCycleAvg > 90) {
      insights.push({
        id: 'long-sales-cycle',
        type: 'recommendation',
        title: 'Optimize Sales Cycle',
        description: `Average sales cycle of ${metrics.salesCycleAvg?.toFixed(0)} days is lengthy. Review process efficiency.`,
        confidence: 75,
        priority: 'medium',
        actionable: true,
        relatedMetric: 'salesCycleAvg',
        timestamp: new Date()
      });
    }

    // Predictive insights
    insights.push({
      id: 'forecast-prediction',
      type: 'prediction',
      title: 'Q4 Revenue Forecast',
      description: `Based on current trends, projected Q4 revenue: $${((metrics.wonValue || 0) * 1.15).toLocaleString()}`,
      confidence: 82,
      priority: 'medium',
      actionable: false,
      timestamp: new Date()
    });

    setAiInsights(insights);
  }, [metrics, isLoading]);

  // Natural language query processing
  const handleNaturalQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;

    // Simulated AI processing - in real app, this would call an AI service
    const processQuery = (q: string) => {
      const lowerQuery = q.toLowerCase();
      
      if (lowerQuery.includes('revenue') || lowerQuery.includes('money') || lowerQuery.includes('sales')) {
        return {
          type: 'revenue_analysis',
          result: {
            totalRevenue: metrics.wonValue,
            pipelineValue: metrics.totalPipelineValue,
            avgDealSize: metrics.avgDealSize,
            trend: '+12.5%',
            insight: 'Revenue is trending upward with strong pipeline growth'
          }
        };
      }
      
      if (lowerQuery.includes('deal') || lowerQuery.includes('win rate') || lowerQuery.includes('conversion')) {
        return {
          type: 'deal_analysis',
          result: {
            totalDeals: metrics.totalDeals,
            winRate: metrics.winRate,
            activeDeals: metrics.activeDeals,
            trend: metrics.winRate && metrics.winRate > 25 ? 'positive' : 'negative',
            insight: `Current win rate of ${metrics.winRate?.toFixed(1)}% suggests ${metrics.winRate && metrics.winRate > 25 ? 'healthy' : 'needs improvement'} sales performance`
          }
        };
      }
      
      if (lowerQuery.includes('account') || lowerQuery.includes('customer') || lowerQuery.includes('health')) {
        return {
          type: 'account_analysis',
          result: {
            totalAccounts: metrics.totalAccounts,
            healthyAccounts: metrics.healthyAccounts,
            atRiskAccounts: metrics.atRiskAccounts,
            healthScore: ((metrics.healthyAccounts || 0) / (metrics.totalAccounts || 1)) * 100,
            insight: `${metrics.atRiskAccounts || 0} accounts need immediate attention`
          }
        };
      }

      return {
        type: 'general',
        result: {
          summary: 'Here\'s your business overview',
          metrics: {
            totalRevenue: metrics.wonValue,
            totalAccounts: metrics.totalAccounts,
            totalDeals: metrics.totalDeals,
            winRate: metrics.winRate
          },
          insight: 'Use more specific terms like "revenue", "deals", or "accounts" for detailed analysis'
        }
      };
    };

    const result = processQuery(query);
    setQueryResults(result);
  }, [metrics]);

  // Default dashboard widgets
  const defaultWidgets: DashboardWidget[] = [
    {
      id: 'revenue-kpi',
      type: 'kpi',
      title: 'Total Revenue',
      position: { x: 0, y: 0, w: 3, h: 2 },
      config: { metric: 'wonValue', format: 'currency', trend: '+12.5%' },
      isVisible: true,
      aiInsights: ['Revenue growing 12.5% month-over-month', 'Q4 forecast exceeds targets by 8%']
    },
    {
      id: 'pipeline-chart',
      type: 'chart',
      title: 'Sales Pipeline',
      position: { x: 3, y: 0, w: 6, h: 4 },
      config: { chartType: 'funnel', data: 'pipelineStages' },
      isVisible: true,
      aiInsights: ['Discovery stage showing 15% improvement', 'Bottleneck detected in negotiation phase']
    },
    {
      id: 'account-health',
      type: 'heatmap',
      title: 'Account Health Matrix',
      position: { x: 9, y: 0, w: 3, h: 4 },
      config: { metric: 'healthScore', threshold: [40, 70, 90] },
      isVisible: true,
      aiInsights: ['12 accounts need immediate attention', 'Health scores improving overall']
    },
    {
      id: 'top-performers',
      type: 'leaderboard',
      title: 'Top Performers',
      position: { x: 0, y: 2, w: 3, h: 4 },
      config: { metric: 'revenue', period: '30d', limit: 5 },
      isVisible: true
    },
    {
      id: 'forecast-goals',
      type: 'goals',
      title: 'Forecast vs Goals',
      position: { x: 0, y: 6, w: 6, h: 3 },
      config: { targets: { revenue: 500000, deals: 50, accounts: 100 } },
      isVisible: true,
      aiInsights: ['On track to exceed monthly targets', 'Account acquisition ahead of plan']
    },
    {
      id: 'activity-calendar',
      type: 'calendar',
      title: 'Activity Timeline',
      position: { x: 6, y: 4, w: 6, h: 5 },
      config: { view: 'week', showMetrics: true },
      isVisible: true
    }
  ];

  // Initialize dashboard
  useEffect(() => {
    if (dashboardLayout.length === 0) {
      setDashboardLayout(defaultWidgets);
    }
  }, [dashboardLayout.length]);

  // Generate AI insights on data change - stabilize with useMemo
  useEffect(() => {
    generateAIInsights();
  }, [generateAIInsights]);

  // Export functionality
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setExportLoading(true);
    try {
      // Simulated export - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create download link (simulated)
      const data = {
        metrics,
        insights: aiInsights,
        timestamp: new Date().toISOString(),
        format
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: `Report exported successfully as ${format.toUpperCase()}`,
        timestamp: new Date()
      }]);
    } catch (error) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: 'Export failed. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setExportLoading(false);
    }
  };

  // Share functionality
  const handleShare = async () => {
    setShareLoading(true);
    try {
      // Simulated share link generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const shareLink = `https://app.bmi.com/analytics/shared/${Date.now()}`;
      
      await navigator.clipboard.writeText(shareLink);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: 'Share link copied to clipboard!',
        timestamp: new Date()
      }]);
    } catch (error) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: 'Failed to generate share link',
        timestamp: new Date()
      }]);
    } finally {
      setShareLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  // Render KPI Card
  const renderKPICard = (widget: DashboardWidget) => {
    const value = metrics[widget.config.metric as keyof typeof metrics];
    const formattedValue = widget.config.format === 'currency' ? 
      formatCurrency(value as number) : 
      widget.config.format === 'percentage' ? 
      formatPercentage(value as number) : 
      (value as number)?.toLocaleString();

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{widget.title}</h3>
          <div className="flex items-center space-x-2">
            {widget.config.trend && (
              <span className={`text-sm flex items-center ${
                widget.config.trend.startsWith('+') ? 'text-green-600' : 
                widget.config.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'
              }`}>
                {widget.config.trend.startsWith('+') && <TrendingUp className="w-4 h-4 mr-1" />}
                {widget.config.trend.startsWith('-') && <TrendingDown className="w-4 h-4 mr-1" />}
                {!widget.config.trend.startsWith('+') && !widget.config.trend.startsWith('-') && <TrendingFlat className="w-4 h-4 mr-1" />}
                {widget.config.trend}
              </span>
            )}
            <Bot className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-600" />
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {formattedValue}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            vs. previous period
          </div>
        </div>

        {widget.aiInsights && widget.aiInsights.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start">
              <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <div className="font-medium mb-1">AI Insight</div>
                <div>{widget.aiInsights[0]}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Frozen Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Intelligence</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise Analytics Dashboard</p>
              </div>
              
              {/* Navigation Pills */}
              <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {['Analytics', 'Reports', 'Insights', 'Forecasts'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      tab === 'Analytics' 
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              {/* Natural Language Query */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask anything about your data..."
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNaturalQuery(naturalQuery)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleNaturalQuery(naturalQuery)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-500 hover:text-blue-600"
                >
                  <Bot className="w-4 h-4" />
                </button>
              </div>

              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="custom">Custom range</option>
              </select>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Customize Dashboard"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => document.getElementById('export-menu')?.classList.toggle('hidden')}
                    disabled={exportLoading}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {exportLoading ? (
                      <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export
                  </button>
                  
                  <div id="export-menu" className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        Export as PDF
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Table className="w-4 h-4 mr-3" />
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Archive className="w-4 h-4 mr-3" />
                        Export as CSV
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  disabled={shareLoading}
                  className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {shareLoading ? (
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  Share
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {currentTheme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
              </div>
              
              {/* Filter chips would go here */}
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm flex items-center">
                  All Accounts
                  <button className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800/30 rounded-full p-0.5">
                    <XCircle className="w-3 h-3" />
                  </button>
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm flex items-center">
                  Active Deals
                  <button className="ml-2 hover:bg-green-200 dark:hover:bg-green-800/30 rounded-full p-0.5">
                    <XCircle className="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                <option value="">Saved Filters</option>
                <option value="high-value">High Value Deals</option>
                <option value="enterprise">Enterprise Accounts</option>
                <option value="at-risk">At Risk Customers</option>
              </select>
              <button className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                + Add Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Account for fixed header */}
      <div className="pt-32 px-6 pb-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCcw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600 dark:text-gray-400">Loading analytics data...</p>
            </div>
          </div>
        )}

        {/* Natural Query Results */}
        {queryResults && !isLoading && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Query: "{naturalQuery}"
                </h3>
                <div className="text-blue-800 dark:text-blue-200">
                  {queryResults.type === 'revenue_analysis' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(queryResults.result.totalRevenue)}</div>
                        <div className="text-sm opacity-75">Total Revenue</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(queryResults.result.pipelineValue)}</div>
                        <div className="text-sm opacity-75">Pipeline Value</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(queryResults.result.avgDealSize)}</div>
                        <div className="text-sm opacity-75">Avg Deal Size</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{queryResults.result.trend}</div>
                        <div className="text-sm opacity-75">Growth Trend</div>
                      </div>
                    </div>
                  )}
                  {queryResults.type !== 'revenue_analysis' && (
                    <div className="text-sm">{queryResults.result.insight}</div>
                  )}
                </div>
                <button
                  onClick={() => setQueryResults(null)}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Clear Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Banner */}
        {aiInsights.length > 0 && !isLoading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-600" />
                AI-Powered Insights
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {aiInsights.filter(i => i.priority === 'critical').length} Critical • 
                  {aiInsights.filter(i => i.priority === 'high').length} High Priority
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {aiInsights.slice(0, 6).map((insight) => (
                <div key={insight.id} className={`rounded-lg border-l-4 p-4 ${
                  insight.priority === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                  insight.priority === 'high' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
                  insight.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                } transition-all hover:shadow-md`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {insight.type === 'alert' && <AlertCircle className="w-4 h-4 mr-2 text-red-500" />}
                        {insight.type === 'recommendation' && <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />}
                        {insight.type === 'prediction' && <Zap className="w-4 h-4 mr-2 text-purple-500" />}
                        {insight.type === 'trend' && <TrendingUp className="w-4 h-4 mr-2 text-green-500" />}
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {insight.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          Confidence: {insight.confidence}%
                        </span>
                        {insight.actionable && (
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                            Take Action →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Widgets */}
        {!isLoading && (
          <div className="space-y-8">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardLayout.filter(w => w.type === 'kpi' && w.isVisible).map((widget) => (
                <div key={widget.id}>{renderKPICard(widget)}</div>
              ))}
            </div>

            {/* Charts and Advanced Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Pipeline Funnel Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                    Sales Pipeline Analysis
                  </h3>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <BarChart className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LineChart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Simulated Pipeline Chart */}
                <div className="space-y-4">
                  {[
                    { stage: 'Discovery', count: 45, value: 2250000, color: 'bg-blue-500' },
                    { stage: 'Qualification', count: 32, value: 1920000, color: 'bg-green-500' },
                    { stage: 'Proposal', count: 18, value: 1440000, color: 'bg-yellow-500' },
                    { stage: 'Negotiation', count: 12, value: 960000, color: 'bg-orange-500' },
                    { stage: 'Closed Won', count: 8, value: 640000, color: 'bg-purple-500' }
                  ].map((stage, index) => (
                    <div key={stage.stage} className="flex items-center space-x-4">
                      <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stage.stage}
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className={`${stage.color} h-full transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                          style={{ width: `${(stage.count / 45) * 100}%` }}
                        >
                          <span className="text-white text-xs font-medium">{stage.count}</span>
                        </div>
                      </div>
                      <div className="w-24 text-sm font-bold text-gray-900 dark:text-white text-right">
                        {formatCurrency(stage.value)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Insight:</span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Conversion rate from Qualification to Proposal dropped 8% this month. Consider reviewing qualification criteria.
                  </p>
                </div>
              </div>

              {/* Account Health Heatmap */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-red-500" />
                    Account Health
                  </h3>
                  <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Excellent (80-100)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">{metrics.healthyAccounts}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Good (60-79)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">24</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">At Risk (40-59)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">18</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Critical (0-39)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">{metrics.atRiskAccounts}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-900 dark:text-red-100">Action Required</span>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    {metrics.atRiskAccounts} accounts need immediate attention
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Leaderboard and Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers Leaderboard */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Top Performers
                  </h3>
                  <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                    <option>This Month</option>
                    <option>This Quarter</option>
                    <option>This Year</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Sarah Johnson', revenue: 125000, deals: 12, rank: 1, badge: '🏆' },
                    { name: 'Mike Chen', revenue: 98000, deals: 8, rank: 2, badge: '🥈' },
                    { name: 'Emma Davis', revenue: 87000, deals: 10, rank: 3, badge: '🥉' },
                    { name: 'Alex Rodriguez', revenue: 76000, deals: 7, rank: 4, badge: '⭐' },
                    { name: 'Lisa Wang', revenue: 65000, deals: 9, rank: 5, badge: '⭐' }
                  ].map((performer) => (
                    <div key={performer.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">{performer.badge}</div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{performer.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{performer.deals} deals closed</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">{formatCurrency(performer.revenue)}</div>
                        <div className="text-sm text-green-600 dark:text-green-400">+15% vs last month</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Team Challenge</span>
                  </div>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                    Q4 Revenue Race: Team is 78% toward $2M goal
                  </p>
                </div>
              </div>

              {/* Goals and Forecasting */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-500" />
                    Goals & Forecast
                  </h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Adjust Goals
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Revenue</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(metrics.wonValue || 0)} / {formatCurrency(500000)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full relative" style={{ width: `${Math.min(100, ((metrics.wonValue || 0) / 500000) * 100)}%` }}>
                        <div className="absolute right-0 -top-6 text-xs font-medium text-green-600 dark:text-green-400">
                          {Math.round(((metrics.wonValue || 0) / 500000) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Deal Closures</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{(Array.isArray(deals) ? deals.filter((d: any) => d.stage === 'closed_won').length : 0)} / 25</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full relative" style={{ width: `${Math.min(100, ((Array.isArray(deals) ? deals.filter((d: any) => d.stage === 'closed_won').length : 0) / 25) * 100)}%` }}>
                        <div className="absolute right-0 -top-6 text-xs font-medium text-blue-600 dark:text-blue-400">
                          {Math.round(((Array.isArray(deals) ? deals.filter((d: any) => d.stage === 'closed_won').length : 0) / 25) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Accounts</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{Math.min(metrics.totalAccounts || 0, 50)} / 50</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-purple-500 h-3 rounded-full relative" style={{ width: `${Math.min(100, ((metrics.totalAccounts || 0) / 50) * 100)}%` }}>
                        <div className="absolute right-0 -top-6 text-xs font-medium text-purple-600 dark:text-purple-400">
                          {Math.round(((metrics.totalAccounts || 0) / 50) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">On Track</span>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                    Projected to exceed Q4 targets by 12% based on current trends
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Toast Container */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {notifications.slice(-3).map((notification) => (
            <div key={notification.id} className={`p-4 rounded-lg shadow-lg border flex items-center space-x-3 min-w-80 ${
              notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
              notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
              'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
            }`}>
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="flex-1 text-sm font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnterpriseAnalytics;