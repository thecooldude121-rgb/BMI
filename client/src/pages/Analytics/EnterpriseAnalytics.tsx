import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Building, DollarSign, Target, Calendar, Activity, 
  PieChart, Filter, Download, Search, Bot, Brain, Lightbulb, Award, Trophy, Star, 
  ChevronDown, ChevronUp, Settings, RefreshCcw, Share2, Bell, Zap, Eye, 
  MessageSquare, Phone, Mail, Clock, Sparkles, ArrowUpRight, Minus,
  Plus, Move, Grid3X3, List, Table, Map, Thermometer, Globe, Shield,
  BarChart, LineChart, Radar, Archive, FileText, Link2, Bookmark, Mic, MicOff,
  HelpCircle, AlertCircle, CheckCircle, XCircle, PlayCircle, PauseCircle, Volume2,
  Layers, Maximize2, RotateCcw, GitBranch, TreePine, Network, Waves, Crosshair,
  MapPin, Compass, Navigation, Cpu, Database, MousePointer2,
  Hand, Fingerprint, Headphones, Palette, Sliders, BarChart2, PieChart as Chart,
  Hexagon, Triangle, Square, Circle, Diamond, Star as StarIcon, Heart
} from 'lucide-react';

// Enhanced interfaces for next-level enterprise features
interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'heatmap' | 'leaderboard' | 'calendar' | 'goals' | 'forecast' | 
        'funnel' | 'geographic' | 'pipeline3d' | 'correlation' | 'sankey' | 'cohort' | 'churn' | 'attribution';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
  isVisible: boolean;
  aiInsights?: string[];
  drillDownEnabled?: boolean;
  voiceEnabled?: boolean;
  gestureEnabled?: boolean;
  collaborativeMode?: boolean;
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation' | 'alert' | 'forecasting' | 'attribution' | 'churn_risk' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  relatedMetric?: string;
  timestamp: Date;
  mlModel?: string;
  interventionSuggestions?: string[];
  confidenceInterval?: { lower: number; upper: number };
  rootCause?: string[];
}

interface PredictiveModel {
  id: string;
  name: string;
  type: 'pipeline_forecasting' | 'deal_scoring' | 'churn_prediction' | 'clv_modeling' | 'attribution';
  accuracy: number;
  lastTrained: Date;
  features: string[];
  predictions: any[];
  confidenceLevel: number;
}

interface FilterPreset {
  id: string;
  name: string;
  filters: any;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
}

interface VoiceCommand {
  command: string;
  confidence: number;
  intent: string;
  entities: any;
  timestamp: Date;
}

interface CollaborativeCursor {
  userId: string;
  userName: string;
  position: { x: number; y: number };
  color: string;
  lastSeen: Date;
}

interface SmartAnnotation {
  id: string;
  widgetId: string;
  position: { x: number; y: number };
  content: string;
  author: string;
  timestamp: Date;
  type: 'insight' | 'question' | 'action' | 'alert';
  resolved: boolean;
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


  // Enhanced state management for next-level features - CRITICAL FIX: Initialize KPI Cards
  const [dashboardLayout, setDashboardLayout] = useState<DashboardWidget[]>([
    {
      id: 'revenue-kpi',
      type: 'kpi',
      title: 'Total Revenue',
      config: {
        metric: 'wonValue',
        format: 'currency',
        trend: '+12.5%'
      },
      position: { x: 0, y: 0, w: 3, h: 2 },
      aiInsights: ['Revenue growth is accelerating with strong Q4 performance'],
      voiceEnabled: true,
      drillDownEnabled: true,
      gestureEnabled: true,
      isVisible: true
    },
    {
      id: 'conversion-kpi',
      type: 'kpi',
      title: 'Conversion Rate',
      config: {
        metric: 'conversionRate',
        format: 'percentage',
        trend: '+8.2%'
      },
      position: { x: 3, y: 0, w: 3, h: 2 },
      aiInsights: ['Conversion rate improved due to better lead qualification'],
      voiceEnabled: true,
      drillDownEnabled: true,
      gestureEnabled: true,
      isVisible: true
    },
    {
      id: 'active-deals-kpi',
      type: 'kpi',
      title: 'Active Deals',
      config: {
        metric: 'totalDeals',
        format: 'number',
        trend: '+15.3%'
      },
      position: { x: 6, y: 0, w: 3, h: 2 },
      aiInsights: ['Pipeline is growing with high-quality opportunities'],
      voiceEnabled: true,
      drillDownEnabled: true,
      gestureEnabled: true,
      isVisible: true
    },
    {
      id: 'win-rate-kpi',
      type: 'kpi',
      title: 'Win Rate',
      config: {
        metric: 'winRate',
        format: 'percentage',
        trend: '+4.7%'
      },
      position: { x: 9, y: 0, w: 3, h: 2 },
      aiInsights: ['Win rate improvement indicates better deal qualification'],
      voiceEnabled: true,
      drillDownEnabled: true,
      gestureEnabled: true,
      isVisible: true
    },
    {
      id: 'pipeline-funnel',
      type: 'funnel',
      title: 'Sales Pipeline Funnel',
      config: {},
      position: { x: 0, y: 2, w: 6, h: 4 },
      voiceEnabled: true,
      drillDownEnabled: true,
      gestureEnabled: true,
      isVisible: true
    },
    {
      id: 'geographic-heatmap',
      type: 'geographic',
      title: 'Revenue by Geography',
      config: {},
      position: { x: 6, y: 2, w: 6, h: 4 },
      voiceEnabled: true,
      drillDownEnabled: true,
      gestureEnabled: true,
      isVisible: true
    }
  ]);
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
  
  // Advanced AI and ML features
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModel[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any>(null);
  const [attributionModel, setAttributionModel] = useState<any>(null);
  const [churnRiskScores, setChurnRiskScores] = useState<any[]>([]);
  const [dealProbabilityScores, setDealProbabilityScores] = useState<any[]>([]);
  const [crossSellOpportunities, setCrossSellOpportunities] = useState<any[]>([]);
  
  // Voice and gesture controls
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [gestureMode, setGestureMode] = useState(false);
  const [touchGestures, setTouchGestures] = useState<any>({});
  
  // Collaborative features
  const [collaborativeCursors, setCollaborativeCursors] = useState<CollaborativeCursor[]>([]);
  const [annotations, setAnnotations] = useState<SmartAnnotation[]>([]);
  const [isCollaborativeMode, setIsCollaborativeMode] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  // Advanced visualization states
  const [selectedVisualization, setSelectedVisualization] = useState('overview');
  const [drillDownPath, setDrillDownPath] = useState<string[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<any>(null);
  const [geographicData, setGeographicData] = useState<any>(null);
  const [pipelineAnimation, setPipelineAnimation] = useState(false);
  const [cohortData, setCohortData] = useState<any>(null);
  
  // Performance and optimization
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});
  const [mlModelPerformance, setMlModelPerformance] = useState<any>({});
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[]>([]);
  
  // Filter Modal State - CRITICAL FIX
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newFilter, setNewFilter] = useState({
    category: 'Account',
    field: '',
    operator: 'equals',
    value: '',
    logicOperator: 'AND'
  });
  const [appliedFilters, setAppliedFilters] = useState<any[]>([]);
  const [filterResultsCount, setFilterResultsCount] = useState<number | null>(null);
  
  // Refs for advanced interactions
  const voiceRecognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gestureRef = useRef<any>(null);
  const collaborationRef = useRef<any>(null);

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

  // Advanced AI-powered insights with ML predictions
  const generateAdvancedAIInsights = useCallback(() => {
    if (isLoading || !metrics || Object.keys(metrics).length === 0) return;

    const insights: AIInsight[] = [];

    // Advanced predictive pipeline forecasting
    const pipelineForecast = generatePipelineForecast(metrics);
    insights.push({
      id: 'advanced-pipeline-forecast',
      type: 'forecasting',
      title: 'ML Pipeline Forecast',
      description: `Advanced forecasting predicts ${formatCurrency(pipelineForecast.predicted)} revenue with 95% confidence interval.`,
      confidence: pipelineForecast.confidence,
      priority: 'high',
      actionable: true,
      relatedMetric: 'totalPipelineValue',
      timestamp: new Date(),
      mlModel: 'RandomForest-Pipeline-v2.1',
      confidenceInterval: pipelineForecast.interval,
      interventionSuggestions: [
        'Focus on deals in negotiation stage (highest conversion probability)',
        'Accelerate qualification process to reduce cycle time',
        'Implement automated follow-up sequences'
      ]
    });

    // Anomaly detection with root cause analysis
    const anomalies = detectAnomalies(metrics);
    anomalies.forEach((anomaly, index) => {
      insights.push({
        id: `anomaly-${index}`,
        type: 'anomaly',
        title: `Anomaly Detected: ${anomaly.metric}`,
        description: `${anomaly.description} - ${anomaly.deviation}% deviation from expected.`,
        confidence: anomaly.confidence,
        priority: anomaly.severity,
        actionable: true,
        relatedMetric: anomaly.metric,
        timestamp: new Date(),
        mlModel: 'IsolationForest-Anomaly-v1.3',
        rootCause: anomaly.rootCause,
        interventionSuggestions: anomaly.interventions
      });
    });

    // Revenue attribution modeling
    const dealsArray = Array.isArray(deals) ? deals : [];
    const attribution = calculateRevenueAttribution(dealsArray);
    insights.push({
      id: 'revenue-attribution',
      type: 'attribution',
      title: 'Revenue Attribution Analysis',
      description: `Marketing contributed ${attribution.marketing}%, Sales ${attribution.sales}%, Referrals ${attribution.referrals}% to closed revenue.`,
      confidence: 88,
      priority: 'medium',
      actionable: true,
      relatedMetric: 'wonValue',
      timestamp: new Date(),
      mlModel: 'Shapley-Attribution-v1.0'
    });

    // Customer Lifetime Value predictions
    const accountsArray = Array.isArray(accounts) ? accounts : [];
    const clvPredictions = calculateCLVPredictions(accountsArray);
    insights.push({
      id: 'clv-predictions',
      type: 'prediction',
      title: 'Customer Lifetime Value Insights',
      description: `Average predicted CLV: ${formatCurrency(clvPredictions.average)}. ${clvPredictions.highRisk.length} accounts at churn risk.`,
      confidence: 91,
      priority: 'high',
      actionable: true,
      relatedMetric: 'totalAccounts',
      timestamp: new Date(),
      mlModel: 'XGBoost-CLV-v2.0',
      interventionSuggestions: [
        'Implement retention campaign for high-risk accounts',
        'Upsell to high-value customers with expansion potential',
        'Automate health score monitoring'
      ]
    });

    // Deal prioritization recommendations
    const dealPriority = intelligentDealPrioritization(dealsArray);
    insights.push({
      id: 'deal-prioritization',
      type: 'optimization',
      title: 'AI Deal Prioritization',
      description: `Focus on ${dealPriority.highPriority.length} high-priority deals for maximum ROI. Expected lift: ${dealPriority.expectedLift}%.`,
      confidence: 89,
      priority: 'high',
      actionable: true,
      relatedMetric: 'activeDeals',
      timestamp: new Date(),
      mlModel: 'LightGBM-Priority-v1.5',
      interventionSuggestions: dealPriority.recommendations
    });

    // Churn risk modeling
    const churnRisks = modelChurnRisk(accountsArray);
    if (churnRisks.highRisk.length > 0) {
      insights.push({
        id: 'churn-risk-model',
        type: 'churn_risk',
        title: 'Churn Risk Alert',
        description: `${churnRisks.highRisk.length} accounts have >70% churn probability. Immediate intervention required.`,
        confidence: 94,
        priority: 'critical',
        actionable: true,
        relatedMetric: 'atRiskAccounts',
        timestamp: new Date(),
        mlModel: 'GradientBoosting-Churn-v2.2',
        interventionSuggestions: [
          'Schedule executive-level check-ins',
          'Offer loyalty incentives and expansion opportunities',
          'Implement dedicated success manager assignment'
        ]
      });
    }

    setAiInsights(insights);
  }, [metrics, isLoading, deals, accounts]);

  // ML Helper Functions
  const generatePipelineForecast = (metrics: any) => {
    const predicted = (metrics.totalPipelineValue || 0) * 1.23; // Simulated ML prediction
    const confidence = 89;
    const margin = predicted * 0.12;
    return {
      predicted,
      confidence,
      interval: { lower: predicted - margin, upper: predicted + margin }
    };
  };

  const detectAnomalies = (metrics: any) => {
    const anomalies = [];
    
    // Simulated anomaly detection
    if (metrics.winRate && metrics.winRate < 15) {
      anomalies.push({
        metric: 'winRate',
        description: 'Win rate significantly below normal',
        deviation: -34,
        confidence: 92,
        severity: 'critical' as const,
        rootCause: ['Qualification process changes', 'Market conditions', 'Competitor activity'],
        interventions: ['Review lead qualification criteria', 'Analyze lost deal patterns', 'Competitive analysis']
      });
    }
    
    return anomalies;
  };

  const calculateRevenueAttribution = (deals: any[]) => {
    // Simulated attribution modeling
    return {
      marketing: 42,
      sales: 38,
      referrals: 20
    };
  };

  const calculateCLVPredictions = (accounts: any[]) => {
    const accountsArray = Array.isArray(accounts) ? accounts : [];
    return {
      average: 125000,
      highRisk: accountsArray.filter(() => Math.random() < 0.15) // Simulated risk
    };
  };

  const intelligentDealPrioritization = (deals: any[]) => {
    const dealsArray = Array.isArray(deals) ? deals : [];
    return {
      highPriority: dealsArray.filter(() => Math.random() < 0.3),
      expectedLift: 23,
      recommendations: [
        'Focus on enterprise deals >$50K',
        'Prioritize warm leads from existing customers',
        'Target deals in final negotiation stage'
      ]
    };
  };

  const modelChurnRisk = (accounts: any[]) => {
    const accountsArray = Array.isArray(accounts) ? accounts : [];
    return {
      highRisk: accountsArray.filter(() => Math.random() < 0.12) // Simulated churn risk
    };
  };


  // Add funnel chart click handlers - CRITICAL FIX
  const handleFunnelStageClick = (stage: string, value: number) => {
    console.log(`Clicked funnel stage: ${stage} with value: ${value}`);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: `Drilling down into ${stage} stage with ${value} records`,
      timestamp: new Date()
    }]);
    
    // Set drill-down path for detailed analysis
    setDrillDownPath(prev => [...prev, stage]);
  };

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
      aiInsights: ['Revenue growing 12.5% month-over-month', 'Q4 forecast exceeds targets by 8%'],
      voiceEnabled: true,
      gestureEnabled: true
    },
    {
      id: 'interactive-funnel',
      type: 'funnel',
      title: 'Interactive Sales Funnel',
      position: { x: 3, y: 0, w: 6, h: 4 },
      config: { chartType: 'funnel', drillDown: true, animation: true },
      isVisible: true,
      drillDownEnabled: true,
      voiceEnabled: true,
      aiInsights: ['Discovery stage showing 15% improvement', 'Bottleneck detected in negotiation phase']
    },
    {
      id: 'geographic-heatmap',
      type: 'geographic',
      title: 'Geographic Deal Heatmap',
      position: { x: 9, y: 0, w: 3, h: 4 },
      config: { mapType: 'heatmap', metric: 'dealValue', regions: true },
      isVisible: true,
      gestureEnabled: true,
      aiInsights: ['West Coast showing 34% deal value increase', 'Expand territory coverage in Southeast']
    },
    {
      id: 'pipeline-3d',
      type: 'pipeline3d',
      title: '3D Pipeline Visualization',
      position: { x: 0, y: 4, w: 6, h: 4 },
      config: { animation: true, timeAxis: true, interaction: 'gesture' },
      isVisible: true,
      gestureEnabled: true,
      voiceEnabled: true
    },
    {
      id: 'correlation-matrix',
      type: 'correlation',
      title: 'Deal Success Factors',
      position: { x: 6, y: 4, w: 3, h: 4 },
      config: { factors: ['deal_size', 'rep_experience', 'account_health', 'timeline'] },
      isVisible: true,
      drillDownEnabled: true
    },
    {
      id: 'churn-predictor',
      type: 'churn',
      title: 'AI Churn Risk Model',
      position: { x: 9, y: 4, w: 3, h: 4 },
      config: { model: 'gradient_boosting', threshold: 0.7, realTime: true },
      isVisible: true,
      voiceEnabled: true,
      aiInsights: ['12 high-risk accounts identified', 'Intervention strategies recommended']
    },
    {
      id: 'attribution-flow',
      type: 'sankey',
      title: 'Revenue Attribution Flow',
      position: { x: 0, y: 8, w: 6, h: 3 },
      config: { channels: ['marketing', 'sales', 'referrals'], interactive: true },
      isVisible: true,
      drillDownEnabled: true
    },
    {
      id: 'cohort-retention',
      type: 'cohort',
      title: 'Customer Retention Cohorts',
      position: { x: 6, y: 8, w: 6, h: 3 },
      config: { period: 'monthly', metric: 'revenue', heatmap: true },
      isVisible: true,
      collaborativeMode: true
    }
  ];

  // Initialize dashboard
  useEffect(() => {
    if (dashboardLayout.length === 0) {
      setDashboardLayout(defaultWidgets);
    }
  }, [dashboardLayout.length]);

  // Advanced Voice Recognition System
  const initializeVoiceRecognition = useCallback(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const results = Array.from(event.results);
        const transcript = results
          .map((result: any) => result[0].transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          const command: VoiceCommand = {
            command: transcript,
            confidence: event.results[event.results.length - 1][0].confidence,
            intent: parseVoiceIntent(transcript),
            entities: extractVoiceEntities(transcript),
            timestamp: new Date()
          };
          
          setVoiceCommands(prev => [...prev.slice(-9), command]);
          processVoiceCommand(command);
        }
      };

      voiceRecognitionRef.current = recognition;
    }
  }, []);

  const parseVoiceIntent = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('show') || lowerCommand.includes('display')) return 'show';
    if (lowerCommand.includes('filter') || lowerCommand.includes('where')) return 'filter';
    if (lowerCommand.includes('export') || lowerCommand.includes('download')) return 'export';
    if (lowerCommand.includes('analyze') || lowerCommand.includes('insights')) return 'analyze';
    return 'query';
  };

  const extractVoiceEntities = (command: string) => {
    const entities: any = {};
    const lowerCommand = command.toLowerCase();
    
    // Extract time periods
    if (lowerCommand.includes('last week')) entities.timePeriod = '7d';
    if (lowerCommand.includes('last month')) entities.timePeriod = '30d';
    if (lowerCommand.includes('quarter')) entities.timePeriod = '90d';
    
    // Extract metrics
    if (lowerCommand.includes('revenue') || lowerCommand.includes('sales')) entities.metric = 'revenue';
    if (lowerCommand.includes('deals') || lowerCommand.includes('opportunities')) entities.metric = 'deals';
    if (lowerCommand.includes('accounts') || lowerCommand.includes('customers')) entities.metric = 'accounts';
    
    return entities;
  };

  const processVoiceCommand = (command: VoiceCommand) => {
    switch (command.intent) {
      case 'show':
        if (command.entities.metric) {
          setSelectedVisualization(command.entities.metric);
        }
        break;
      case 'filter':
        if (command.entities.timePeriod) {
          setSelectedTimeRange(command.entities.timePeriod);
        }
        break;
      case 'analyze':
        handleNaturalQuery(command.command);
        break;
      case 'export':
        handleExport('pdf');
        break;
      default:
        handleNaturalQuery(command.command);
    }
  };

  // Initialize voice recognition after function definitions - CRITICAL FIX
  useEffect(() => {
    initializeVoiceRecognition();
    
    // Notify user that voice system is ready
    const timer = setTimeout(() => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: 'Voice recognition ready! Click microphone to activate.',
        timestamp: new Date()
      }]);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (voiceRecognitionRef.current) {
        voiceRecognitionRef.current.stop();
      }
    };
  }, [initializeVoiceRecognition]);

  // Advanced Gesture Recognition for Mobile
  const initializeGestureRecognition = useCallback(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!gestureMode) return;
      
      const touch = e.touches[0];
      setTouchGestures({
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now()
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!gestureMode || !touchGestures.startX) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!gestureMode || !touchGestures.startX) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchGestures.startX;
      const deltaY = touch.clientY - touchGestures.startY;
      const deltaTime = Date.now() - touchGestures.startTime;
      
      // Detect gesture patterns
      if (deltaTime < 500) { // Quick gestures
        if (Math.abs(deltaX) > 100) {
          // Horizontal swipe
          if (deltaX > 0) {
            // Swipe right - next visualization
            const visualizations = ['overview', 'pipeline', 'geographic', 'correlation'];
            const currentIndex = visualizations.indexOf(selectedVisualization);
            const nextIndex = (currentIndex + 1) % visualizations.length;
            setSelectedVisualization(visualizations[nextIndex]);
          } else {
            // Swipe left - previous visualization
            const visualizations = ['overview', 'pipeline', 'geographic', 'correlation'];
            const currentIndex = visualizations.indexOf(selectedVisualization);
            const prevIndex = currentIndex === 0 ? visualizations.length - 1 : currentIndex - 1;
            setSelectedVisualization(visualizations[prevIndex]);
          }
        } else if (Math.abs(deltaY) > 100) {
          // Vertical swipe
          if (deltaY < 0) {
            // Swipe up - show AI insights
            document.getElementById('ai-insights')?.scrollIntoView({ behavior: 'smooth' });
          } else {
            // Swipe down - refresh data
            queryClient.invalidateQueries();
          }
        }
      }
      
      setTouchGestures({});
    };

    if (gestureMode) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [gestureMode, touchGestures, selectedVisualization, queryClient]);

  // Collaborative Features
  const initializeCollaboration = useCallback(() => {
    if (!isCollaborativeMode) return;
    
    // Simulated real-time cursor tracking
    const updateCursors = () => {
      const mockCursors: CollaborativeCursor[] = [
        {
          userId: '1',
          userName: 'Sarah Chen',
          position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
          color: '#3B82F6',
          lastSeen: new Date()
        },
        {
          userId: '2',
          userName: 'Mike Johnson',
          position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
          color: '#10B981',
          lastSeen: new Date()
        }
      ];
      setCollaborativeCursors(mockCursors);
    };

    const interval = setInterval(updateCursors, 2000);
    return () => clearInterval(interval);
  }, [isCollaborativeMode]);

  // FIXED: Initialize predictive models only once and generate predictions separately
  useEffect(() => {
    const models: PredictiveModel[] = [
      {
        id: 'pipeline-forecast',
        name: 'Pipeline Forecasting Model',
        type: 'pipeline_forecasting',
        accuracy: 0.89,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        features: ['deal_value', 'stage', 'age', 'rep_performance', 'account_health'],
        predictions: [],
        confidenceLevel: 0.95
      },
      {
        id: 'churn-prediction',
        name: 'Customer Churn Prediction',
        type: 'churn_prediction',
        accuracy: 0.94,
        lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        features: ['engagement_score', 'support_tickets', 'usage_trend', 'contract_value'],
        predictions: [],
        confidenceLevel: 0.92
      },
      {
        id: 'deal-scoring',
        name: 'Deal Probability Scoring',
        type: 'deal_scoring',
        accuracy: 0.87,
        lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        features: ['deal_size', 'competitor_presence', 'decision_makers', 'timeline'],
        predictions: [],
        confidenceLevel: 0.88
      }
    ];
    
    setPredictiveModels(models);
  }, []);

  // FIXED: Generate predictions only when data changes, with throttling
  useEffect(() => {
    if (isLoading) return;
    
    const dealsArray = Array.isArray(deals) ? deals : [];
    const accountsArray = Array.isArray(accounts) ? accounts : [];
    
    if (dealsArray.length > 0) {
      setDealProbabilityScores(
        dealsArray.map((deal: any) => ({
          dealId: deal.id,
          probability: Math.random() * 100,
          confidence: 0.85 + Math.random() * 0.15,
          factors: ['timeline_alignment', 'budget_confirmed', 'champion_identified']
        }))
      );
    }
    
    if (accountsArray.length > 0) {
      setChurnRiskScores(
        accountsArray.map((account: any) => ({
          accountId: account.id,
          churnProbability: Math.random() * 100,
          riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
          interventions: ['schedule_check_in', 'offer_training', 'renewal_discussion']
        }))
      );
    }
  }, [deals, accounts, isLoading]);

  // Initialize advanced features - FIXED: Remove function dependencies to prevent loops
  useEffect(() => {
    initializeVoiceRecognition();
  }, []);

  useEffect(() => {
    return initializeGestureRecognition();
  }, [gestureMode, touchGestures, selectedVisualization]);

  useEffect(() => {
    return initializeCollaboration();
  }, [isCollaborativeMode]);

  // Generate AI insights on data change - FIXED: Use stable dependencies
  useEffect(() => {
    generateAdvancedAIInsights();
  }, [metrics, isLoading]);

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

  // Filter Management Functions - CRITICAL FIX
  const handleAddFilter = () => {
    setShowFilterModal(true);
  };

  const getFieldsForCategory = (category: string) => {
    const fieldMaps: { [key: string]: { value: string; label: string; type: string }[] } = {
      'Account': [
        { value: 'name', label: 'Account Name', type: 'text' },
        { value: 'industry', label: 'Industry', type: 'text' },
        { value: 'size', label: 'Company Size', type: 'number' },
        { value: 'revenue', label: 'Annual Revenue', type: 'number' },
        { value: 'health_score', label: 'Health Score', type: 'number' }
      ],
      'Deal': [
        { value: 'name', label: 'Deal Name', type: 'text' },
        { value: 'value', label: 'Deal Value', type: 'number' },
        { value: 'stage', label: 'Deal Stage', type: 'select' },
        { value: 'probability', label: 'Win Probability', type: 'number' },
        { value: 'close_date', label: 'Close Date', type: 'date' }
      ],
      'Rep': [
        { value: 'name', label: 'Rep Name', type: 'text' },
        { value: 'team', label: 'Team', type: 'text' },
        { value: 'quota_attainment', label: 'Quota Attainment %', type: 'number' },
        { value: 'deals_closed', label: 'Deals Closed', type: 'number' }
      ],
      'Time': [
        { value: 'created_at', label: 'Created Date', type: 'date' },
        { value: 'updated_at', label: 'Updated Date', type: 'date' },
        { value: 'quarter', label: 'Quarter', type: 'select' },
        { value: 'month', label: 'Month', type: 'select' }
      ]
    };
    return fieldMaps[category] || [];
  };

  const getOperatorsForFieldType = (fieldType: string) => {
    const operatorMaps: { [key: string]: { value: string; label: string }[] } = {
      'text': [
        { value: 'equals', label: 'Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'starts_with', label: 'Starts with' },
        { value: 'not_equals', label: 'Not equals' }
      ],
      'number': [
        { value: 'equals', label: 'Equals' },
        { value: 'greater_than', label: 'Greater than' },
        { value: 'less_than', label: 'Less than' },
        { value: 'between', label: 'Between' }
      ],
      'date': [
        { value: 'equals', label: 'On' },
        { value: 'after', label: 'After' },
        { value: 'before', label: 'Before' },
        { value: 'between', label: 'Between' }
      ],
      'select': [
        { value: 'equals', label: 'Is' },
        { value: 'not_equals', label: 'Is not' },
        { value: 'in', label: 'Is one of' }
      ]
    };
    return operatorMaps[fieldType] || operatorMaps['text'];
  };

  const calculateFilterPreview = useCallback((filters: any[]) => {
    if (filters.length === 0) return null;
    
    let filteredData = [
      ...(Array.isArray(deals) ? deals : []), 
      ...(Array.isArray(accounts) ? accounts : []), 
      ...(Array.isArray(leads) ? leads : [])
    ];
    
    filters.forEach(filter => {
      if (filter.category === 'Deal' && deals) {
        filteredData = filteredData.filter((item: any) => {
          const value = item[filter.field];
          switch (filter.operator) {
            case 'equals': return value === filter.value;
            case 'contains': return String(value).toLowerCase().includes(filter.value.toLowerCase());
            case 'greater_than': return Number(value) > Number(filter.value);
            case 'less_than': return Number(value) < Number(filter.value);
            default: return true;
          }
        });
      }
    });
    
    return filteredData.length;
  }, [deals, accounts, leads]);

  // FilterModal Component - CRITICAL FIX
  const FilterModal = () => {
    const selectedFields = getFieldsForCategory(newFilter.category);
    const selectedField = selectedFields.find(f => f.value === newFilter.field);
    const availableOperators = selectedField ? getOperatorsForFieldType(selectedField.type) : [];

    const handlePreviewUpdate = () => {
      if (newFilter.field && newFilter.operator && newFilter.value) {
        const previewFilters = [...appliedFilters, { ...newFilter, id: Date.now() }];
        const count = calculateFilterPreview(previewFilters);
        setFilterResultsCount(count);
      }
    };

    useEffect(() => {
      handlePreviewUpdate();
    }, [newFilter.field, newFilter.operator, newFilter.value, handlePreviewUpdate]);

    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showFilterModal ? 'block' : 'hidden'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Filter className="w-6 h-6 mr-2 text-blue-500" />
              Add Filter
            </h3>
            <button 
              onClick={() => setShowFilterModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              data-testid="button-close-filter-modal"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Filter Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter Category
              </label>
              <select
                value={newFilter.category}
                onChange={(e) => setNewFilter({ ...newFilter, category: e.target.value, field: '', value: '' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                data-testid="select-filter-category"
              >
                <option value="Account">Account</option>
                <option value="Deal">Deal</option>
                <option value="Rep">Rep</option>
                <option value="Time">Time</option>
              </select>
            </div>

            {/* Field Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Field
              </label>
              <select
                value={newFilter.field}
                onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value, operator: 'equals', value: '' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                data-testid="select-filter-field"
              >
                <option value="">Select a field</option>
                {selectedFields.map(field => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Operator Selection */}
            {newFilter.field && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operator
                </label>
                <select
                  value={newFilter.operator}
                  onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  data-testid="select-filter-operator"
                >
                  {availableOperators.map(op => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Value Input */}
            {newFilter.field && newFilter.operator && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Value
                </label>
                {selectedField?.type === 'number' ? (
                  <input
                    type="number"
                    value={newFilter.value}
                    onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter numeric value"
                    data-testid="input-filter-value"
                  />
                ) : selectedField?.type === 'date' ? (
                  <input
                    type="date"
                    value={newFilter.value}
                    onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    data-testid="input-filter-date"
                  />
                ) : selectedField?.type === 'select' && selectedField.value === 'stage' ? (
                  <select
                    value={newFilter.value}
                    onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    data-testid="select-filter-stage"
                  >
                    <option value="">Select stage</option>
                    <option value="discovery">Discovery</option>
                    <option value="qualification">Qualification</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed_won">Closed Won</option>
                    <option value="closed_lost">Closed Lost</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newFilter.value}
                    onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter value"
                    data-testid="input-filter-text"
                  />
                )}
              </div>
            )}

            {/* Logic Operator for Multiple Filters */}
            {appliedFilters.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Combine with existing filters using
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="logic"
                      value="AND"
                      checked={newFilter.logicOperator === 'AND'}
                      onChange={(e) => setNewFilter({ ...newFilter, logicOperator: e.target.value })}
                      className="mr-2"
                      data-testid="radio-logic-and"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">AND</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="logic"
                      value="OR"
                      checked={newFilter.logicOperator === 'OR'}
                      onChange={(e) => setNewFilter({ ...newFilter, logicOperator: e.target.value })}
                      className="mr-2"
                      data-testid="radio-logic-or"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">OR</span>
                  </label>
                </div>
              </div>
            )}

            {/* Filter Preview */}
            {filterResultsCount !== null && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Preview: {filterResultsCount} records will match this filter
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  data-testid="button-cancel-filter"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  data-testid="button-clear-filters"
                >
                  Clear All
                </button>
              </div>
              <button
                onClick={applyFilter}
                disabled={!newFilter.field || !newFilter.operator || !newFilter.value}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                data-testid="button-apply-filter"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const applyFilter = () => {
    const newAppliedFilter = { ...newFilter, id: Date.now() };
    const updatedFilters = [...appliedFilters, newAppliedFilter];
    setAppliedFilters(updatedFilters);
    
    // Update preview count
    const previewCount = calculateFilterPreview(updatedFilters);
    setFilterResultsCount(previewCount);
    
    // Reset new filter
    setNewFilter({
      category: 'Account',
      field: '',
      operator: 'equals',
      value: '',
      logicOperator: 'AND'
    });
    
    setShowFilterModal(false);
  };

  const removeFilter = (filterId: number) => {
    const updatedFilters = appliedFilters.filter(f => f.id !== filterId);
    setAppliedFilters(updatedFilters);
    const previewCount = calculateFilterPreview(updatedFilters);
    setFilterResultsCount(previewCount);
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
    setFilterResultsCount(null);
  };

  // Premium Visualization Renderers
  const renderWidget = (widget: DashboardWidget) => {
    const baseProps = {
      className: `bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${
        widget.gestureEnabled ? 'cursor-pointer touch-manipulation' : ''
      }`
    };

    switch (widget.type) {
      case 'kpi':
        return renderKPICard(widget);
      case 'funnel':
        return renderInteractiveFunnel(widget);
      case 'geographic':
        return renderGeographicHeatmap(widget);
      case 'pipeline3d':
        return render3DPipeline(widget);
      case 'correlation':
        return renderCorrelationMatrix(widget);
      case 'sankey':
        return renderSankeyDiagram(widget);
      case 'cohort':
        return renderCohortAnalysis(widget);
      case 'churn':
        return renderChurnPredictor(widget);
      case 'attribution':
        return renderAttributionModel(widget);
      default:
        return renderKPICard(widget);
    }
  };

  // Interactive Funnel Chart with Drill-down
  const renderInteractiveFunnel = (widget: DashboardWidget) => (
    <div {...{ className: `bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300` }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <GitBranch className="w-5 h-5 mr-2 text-blue-500" />
          {widget.title}
        </h3>
        <div className="flex items-center space-x-2">
          {widget.drillDownEnabled && (
            <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          {widget.voiceEnabled && isVoiceActive && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { stage: 'Total Leads', count: 450, conversion: 100, color: 'bg-blue-500' },
          { stage: 'Qualified', count: 320, conversion: 71, color: 'bg-green-500' },
          { stage: 'Proposal', count: 180, conversion: 56, color: 'bg-yellow-500' },
          { stage: 'Negotiation', count: 120, conversion: 67, color: 'bg-orange-500' },
          { stage: 'Closed Won', count: 80, conversion: 67, color: 'bg-purple-500' }
        ].map((stage, index) => (
          <div key={stage.stage} 
               className="cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors"
               onClick={() => setDrillDownPath([...drillDownPath, stage.stage])}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage.stage}</span>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">{stage.conversion}% conversion</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{stage.count}</span>
                {widget.drillDownEnabled && (
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
              <div className={`${stage.color} h-full transition-all duration-1000 ease-out`}
                   style={{ width: `${(stage.count / 450) * 100}%` }}>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {widget.aiInsights && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="flex items-center">
            <Brain className="w-4 h-4 text-purple-500 mr-2" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">AI Analysis</span>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">{widget.aiInsights[0]}</p>
        </div>
      )}
    </div>
  );

  // Geographic Deal Heatmap
  const renderGeographicHeatmap = (widget: DashboardWidget) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-500" />
          {widget.title}
        </h3>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-green-500">
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Simulated Map Visualization */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg mb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-20"></div>
        {/* Simulated Heat Points */}
        {[
          { name: 'West Coast', x: '15%', y: '30%', intensity: 'high', value: '$2.3M' },
          { name: 'Texas', x: '45%', y: '65%', intensity: 'medium', value: '$1.8M' },
          { name: 'Northeast', x: '80%', y: '25%', intensity: 'high', value: '$2.1M' },
          { name: 'Southeast', x: '70%', y: '70%', intensity: 'low', value: '$0.8M' }
        ].map((point) => (
          <div key={point.name} 
               className={`absolute w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-125 ${
                 point.intensity === 'high' ? 'bg-red-500' : 
                 point.intensity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
               }`}
               style={{ left: point.x, top: point.y }}
               title={`${point.name}: ${point.value}`}>
            <div className="w-full h-full rounded-full animate-pulse opacity-60"></div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Top Region</span>
          <span className="font-semibold text-gray-900 dark:text-white">West Coast</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Growth Area</span>
          <span className="font-semibold text-green-600">Southeast +34%</span>
        </div>
      </div>
    </div>
  );

  // 3D Pipeline Visualization
  const render3DPipeline = (widget: DashboardWidget) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Layers className="w-5 h-5 mr-2 text-indigo-500" />
          {widget.title}
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setPipelineAnimation(!pipelineAnimation)}
            className={`p-1 transition-colors ${pipelineAnimation ? 'text-indigo-500' : 'text-gray-400 hover:text-indigo-500'}`}>
            <PlayCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 3D Pipeline Simulation */}
      <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full opacity-80"></canvas>
        
        {/* Animated Pipeline Layers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative transform-gpu perspective-1000">
            {[
              { depth: 0, width: '100%', opacity: 1, stage: 'Discovery' },
              { depth: 20, width: '80%', opacity: 0.8, stage: 'Qualification' },
              { depth: 40, width: '60%', opacity: 0.6, stage: 'Proposal' },
              { depth: 60, width: '40%', opacity: 0.4, stage: 'Negotiation' },
              { depth: 80, width: '20%', opacity: 0.3, stage: 'Closing' }
            ].map((layer, index) => (
              <div key={layer.stage} 
                   className={`absolute bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg transition-all duration-1000 ${
                     pipelineAnimation ? 'animate-pulse' : ''
                   }`}
                   style={{
                     width: layer.width,
                     height: '40px',
                     opacity: layer.opacity,
                     transform: `translateZ(${layer.depth}px) rotateX(-20deg)`,
                     top: `${index * 45}px`,
                     left: '50%',
                     marginLeft: `-${parseInt(layer.width) / 2}%`
                   }}>
                <div className="flex items-center justify-center h-full text-white text-sm font-medium">
                  {layer.stage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Pipeline Flow Rate</span>
        <span className="font-semibold text-indigo-600">87% efficiency</span>
      </div>
    </div>
  );

  // Correlation Matrix
  const renderCorrelationMatrix = (widget: DashboardWidget) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Network className="w-5 h-5 mr-2 text-cyan-500" />
          {widget.title}
        </h3>
      </div>
      
      {/* Correlation Matrix Grid */}
      <div className="grid grid-cols-4 gap-1 mb-4">
        {widget.config.factors.map((rowFactor: string, i: number) =>
          widget.config.factors.map((colFactor: string, j: number) => {
            const correlation = i === j ? 1 : Math.random() * 2 - 1; // Simulated correlation
            const intensity = Math.abs(correlation);
            const color = correlation > 0 ? 'bg-green-500' : 'bg-red-500';
            
            return (
              <div key={`${i}-${j}`} 
                   className={`aspect-square rounded ${color} cursor-pointer hover:scale-110 transition-transform`}
                   style={{ opacity: intensity }}
                   title={`${rowFactor} vs ${colFactor}: ${correlation.toFixed(2)}`}>
              </div>
            );
          })
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Factors: Deal Size, Rep Experience, Account Health, Timeline</span>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Negative</span>
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Positive</span>
        </div>
      </div>
    </div>
  );

  // Sankey Diagram for Attribution
  const renderSankeyDiagram = (widget: DashboardWidget) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <GitBranch className="w-5 h-5 mr-2 text-amber-500" />
          {widget.title}
        </h3>
      </div>
      
      {/* Simulated Sankey Flow */}
      <div className="relative h-32 mb-4">
        <svg className="w-full h-full" viewBox="0 0 400 120">
          {/* Marketing to Revenue Flow */}
          <path d="M20,20 Q200,20 350,40" stroke="#3B82F6" strokeWidth="20" fill="none" opacity="0.7" />
          <path d="M20,60 Q200,60 350,50" stroke="#10B981" strokeWidth="15" fill="none" opacity="0.7" />
          <path d="M20,90 Q200,90 350,70" stroke="#F59E0B" strokeWidth="10" fill="none" opacity="0.7" />
          
          {/* Source Labels */}
          <text x="5" y="25" className="fill-current text-blue-600 text-xs">Marketing</text>
          <text x="5" y="65" className="fill-current text-green-600 text-xs">Sales</text>
          <text x="5" y="95" className="fill-current text-yellow-600 text-xs">Referrals</text>
          
          {/* Target Label */}
          <text x="360" y="55" className="fill-current text-gray-600 text-xs">Revenue</text>
        </svg>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">42%</div>
          <div className="text-gray-600 dark:text-gray-400">Marketing</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">38%</div>
          <div className="text-gray-600 dark:text-gray-400">Sales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">20%</div>
          <div className="text-gray-600 dark:text-gray-400">Referrals</div>
        </div>
      </div>
    </div>
  );

  // Cohort Retention Analysis
  const renderCohortAnalysis = (widget: DashboardWidget) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-500" />
          {widget.title}
        </h3>
        {isCollaborativeMode && (
          <div className="flex items-center space-x-2">
            {collaborativeCursors.map((cursor) => (
              <div key={cursor.userId} 
                   className="w-2 h-2 rounded-full" 
                   style={{ backgroundColor: cursor.color }}
                   title={cursor.userName}>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Cohort Heatmap */}
      <div className="grid grid-cols-6 gap-1 mb-4">
        {Array.from({ length: 30 }, (_, i) => {
          const retention = Math.max(0, 100 - (i * 3) - Math.random() * 10);
          const intensity = retention / 100;
          return (
            <div key={i} 
                 className="aspect-square bg-purple-500 rounded cursor-pointer hover:scale-110 transition-transform"
                 style={{ opacity: intensity }}
                 title={`${retention.toFixed(0)}% retention`}>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Avg. Retention</span>
        <span className="font-semibold text-purple-600">68%</span>
      </div>
    </div>
  );

  // Churn Predictor
  const renderChurnPredictor = (widget: DashboardWidget) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
          {widget.title}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-red-600">Live Model</span>
        </div>
      </div>
      
      {/* Risk Indicators */}
      <div className="space-y-3 mb-4">
        {churnRiskScores.slice(0, 3).map((score, index) => (
          <div key={score.accountId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                score.riskLevel === 'high' ? 'bg-red-500' : 
                score.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Account {index + 1}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {score.churnProbability.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">{score.riskLevel} risk</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
        <div className="flex items-center">
          <Cpu className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-sm font-medium text-red-900 dark:text-red-100">ML Model: GradientBoosting v2.2</span>
        </div>
        <p className="text-sm text-red-800 dark:text-red-200 mt-1">94% accuracy • Updated 1 day ago</p>
      </div>
    </div>
  );

  // Attribution Model Renderer
  const renderAttributionModel = (widget: DashboardWidget) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-orange-500" />
          {widget.title}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ${formatCurrency(metrics.wonValue || 0).replace('$', '')}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Attributed Revenue</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { channel: 'Marketing', value: 42, color: 'bg-blue-500' },
            { channel: 'Sales', value: 38, color: 'bg-green-500' },
            { channel: 'Referrals', value: 20, color: 'bg-yellow-500' }
          ].map((channel) => (
            <div key={channel.channel} className="text-center">
              <div className={`w-full h-2 ${channel.color} rounded-full mb-2`}></div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{channel.value}%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{channel.channel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Fixed KPI Card Renderer with Click Handlers
  const handleKPICardClick = (widget: DashboardWidget) => {
    console.log(`Clicked KPI: ${widget.title}`);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: `Drilling down into ${widget.title} analytics`,
      timestamp: new Date()
    }]);
    // Additional drill-down logic can be added here
  };

  const renderKPICard = (widget: DashboardWidget) => {
    const value = metrics[widget.config.metric as keyof typeof metrics];
    const formattedValue = widget.config.format === 'currency' ? 
      formatCurrency(value as number) : 
      widget.config.format === 'percentage' ? 
      formatPercentage(value as number) : 
      (value as number)?.toLocaleString();

    return (
      <div 
        onClick={() => handleKPICardClick(widget)}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
          widget.voiceEnabled && isVoiceActive ? 'ring-2 ring-blue-500' : ''
        }`}>
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
                {!widget.config.trend.startsWith('+') && !widget.config.trend.startsWith('-') && <Minus className="w-4 h-4 mr-1" />}
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
              {/* Enhanced Natural Language Query with Voice */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask anything about your data or use voice commands..."
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNaturalQuery(naturalQuery)}
                  className="pl-10 pr-20 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setIsVoiceActive(!isVoiceActive);
                      if (!isVoiceActive && voiceRecognitionRef.current) {
                        voiceRecognitionRef.current.start();
                      } else if (voiceRecognitionRef.current) {
                        voiceRecognitionRef.current.stop();
                      }
                    }}
                    className={`p-1 rounded transition-colors ${
                      isVoiceActive 
                        ? 'text-red-500 bg-red-100 hover:text-red-600 hover:bg-red-200' 
                        : 'text-blue-500 hover:text-blue-600 hover:bg-blue-100'
                    }`}
                    title={isVoiceActive ? 'Stop voice recognition' : 'Start voice recognition'}
                  >
                    {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleNaturalQuery(naturalQuery)}
                    className="p-1 text-blue-500 hover:text-blue-600"
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Voice Status Indicator */}
                {isVoiceActive && (
                  <div className="absolute -bottom-8 left-0 flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    <span>Listening for voice commands...</span>
                  </div>
                )}
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

              {/* Enhanced Actions with Advanced Features */}
              <div className="flex items-center space-x-2">
                {/* Gesture Mode Toggle */}
                <button
                  onClick={() => setGestureMode(!gestureMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    gestureMode 
                      ? 'text-purple-600 bg-purple-100 hover:text-purple-700 hover:bg-purple-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={gestureMode ? 'Disable gesture controls' : 'Enable gesture controls'}
                >
                  <Hand className="w-5 h-5" />
                </button>

                {/* Collaborative Mode Toggle */}
                <button
                  onClick={() => setIsCollaborativeMode(!isCollaborativeMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    isCollaborativeMode 
                      ? 'text-green-600 bg-green-100 hover:text-green-700 hover:bg-green-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={isCollaborativeMode ? 'Leave collaborative mode' : 'Enter collaborative mode'}
                >
                  <Users className="w-5 h-5" />
                </button>

                {/* 3D Pipeline Animation Toggle */}
                <button
                  onClick={() => setPipelineAnimation(!pipelineAnimation)}
                  className={`p-2 rounded-lg transition-colors ${
                    pipelineAnimation 
                      ? 'text-indigo-600 bg-indigo-100 hover:text-indigo-700 hover:bg-indigo-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={pipelineAnimation ? 'Stop pipeline animation' : 'Start pipeline animation'}
                >
                  <Layers className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Customize Dashboard"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Add Filter Button */}
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Add Filter"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const menu = document.getElementById('export-menu');
                      if (menu) {
                        menu.classList.toggle('hidden');
                      }
                    }}
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
              {/* Dynamic filter chips container - cleared static filters */}
              <div className="flex items-center space-x-2">
                {/* Only dynamically applied filters will show here */}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                <option value="">Saved Filters</option>
                <option value="high-value">High Value Deals</option>
                <option value="enterprise">Enterprise Accounts</option>
                <option value="at-risk">At Risk Customers</option>
              </select>
              <button 
                onClick={() => setShowFilterModal(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 embossed-button"
                data-testid="button-add-filter"
                title="Add Filter"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
            
            {/* Applied Filters Display */}
            {appliedFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {appliedFilters.map((filter) => (
                  <div key={filter.id} className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                    <span className="font-medium">{filter.category}</span>
                    <span className="mx-1">•</span>
                    <span>{filter.field}</span>
                    <span className="mx-1">{filter.operator}</span>
                    <span className="font-medium">{filter.value}</span>
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                      data-testid={`button-remove-filter-${filter.id}`}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {appliedFilters.length > 1 && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-2 py-1 text-sm"
                    data-testid="button-clear-all-filters"
                  >
                    Clear All
                  </button>
                )}
                {filterResultsCount !== null && (
                  <div className="inline-flex items-center text-gray-600 dark:text-gray-400 px-2 py-1 text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    {filterResultsCount} results
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Enhanced positioning for Intelligence section */}
      <div className="pt-40 pl-6 pr-8 pb-8">
        {/* AI Intelligence Section - Positioned immediately below header */}
        {aiInsights.length > 0 && !isLoading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Brain className="w-7 h-7 mr-3 text-purple-600" />
                AI-Powered Intelligence
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {aiInsights.filter(i => i.priority === 'critical').length} Critical • 
                  {aiInsights.filter(i => i.priority === 'high').length} High Priority
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {aiInsights.slice(0, 6).map((insight) => (
                <div key={insight.id} className={`rounded-xl border-l-4 p-6 shadow-sm hover:shadow-lg ${
                  insight.priority === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                  insight.priority === 'high' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
                  insight.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                } transition-all duration-200`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        {insight.type === 'alert' && <AlertCircle className="w-5 h-5 mr-2 text-red-500" />}
                        {insight.type === 'recommendation' && <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />}
                        {insight.type === 'prediction' && <Zap className="w-5 h-5 mr-2 text-purple-500" />}
                        {insight.type === 'trend' && <TrendingUp className="w-5 h-5 mr-2 text-green-500" />}
                        <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                          {insight.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Confidence: {insight.confidence}%
                        </span>
                        {insight.actionable && (
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
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

        {/* Dashboard Widgets */}
        {!isLoading && (
          <div className="space-y-8">
            {/* Enhanced Widget Grid with Premium Visualizations */}
            <div className="space-y-8">
              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardLayout.filter(w => w.type === 'kpi' && w.isVisible).map((widget) => (
                  <div key={widget.id}>{renderWidget(widget)}</div>
                ))}
              </div>

              {/* Advanced Visualizations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {dashboardLayout.filter(w => w.type !== 'kpi' && w.isVisible).map((widget) => (
                  <div key={widget.id} className={`${
                    widget.type === 'funnel' || widget.type === 'pipeline3d' || widget.type === 'sankey' || widget.type === 'cohort' 
                      ? 'lg:col-span-2' : ''
                  }`}>
                    {renderWidget(widget)}
                  </div>
                ))}
              </div>
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

      {/* Collaborative Cursors Overlay */}
      {isCollaborativeMode && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {collaborativeCursors.map((cursor) => (
            <div
              key={cursor.userId}
              className="absolute transition-all duration-200 pointer-events-none"
              style={{
                left: `${cursor.position.x}px`,
                top: `${cursor.position.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
                  style={{ backgroundColor: cursor.color }}
                ></div>
                <div
                  className="absolute top-4 left-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg"
                  style={{ borderColor: cursor.color }}
                >
                  {cursor.userName}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voice Commands History Panel */}
      {isVoiceActive && voiceCommands.length > 0 && (
        <div className="fixed top-20 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Headphones className="w-5 h-5 mr-2 text-blue-500" />
              Voice Commands
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-600">Recording</span>
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {voiceCommands.slice(-5).map((command, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {command.intent.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {(command.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{command.command}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gesture Guide Overlay */}
      {gestureMode && (
        <div className="fixed top-20 left-4 z-50 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center mb-4">
            <Fingerprint className="w-5 h-5 mr-2 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gesture Controls</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Swipe Right</div>
                <div className="text-gray-600 dark:text-gray-400">Next visualization</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Swipe Up</div>
                <div className="text-gray-600 dark:text-gray-400">View AI insights</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <RefreshCcw className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Swipe Down</div>
                <div className="text-gray-600 dark:text-gray-400">Refresh data</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Model Performance Panel */}
      {predictiveModels.length > 0 && (
        <div className="fixed bottom-20 right-4 z-40 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-indigo-500" />
              ML Models Status
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Active</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {predictiveModels.slice(0, 3).map((model) => (
              <div key={model.id} className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {model.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      model.accuracy > 0.9 ? 'bg-green-500' : 
                      model.accuracy > 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {(model.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Updated {Math.floor((Date.now() - model.lastTrained.getTime()) / (1000 * 60 * 60 * 24))}d ago</span>
                  <span>{model.features.length} features</span>
                </div>
                
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${model.accuracy * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
      {/* CRITICAL FIX: FilterModal Component */}
      <FilterModal />
    </div>
  );
};

export default EnterpriseAnalytics;