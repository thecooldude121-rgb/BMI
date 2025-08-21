import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  TrendingUp, TrendingDown, Activity, Bell, Search, Filter,
  BarChart3, PieChart, LineChart, Target, AlertTriangle,
  Zap, Brain, Globe, Eye, ArrowUpCircle, ArrowDownCircle,
  CheckCircle, Clock, Star, Lightbulb, Radar, Gauge
} from 'lucide-react';
// Using standard HTML and Tailwind for now since UI components may not be available
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';

interface TrendData {
  id: string;
  keyword: string;
  industry: string;
  trendScore: number;
  changePercent: number;
  searchVolume: number;
  competitionLevel: 'low' | 'medium' | 'high';
  sentimentScore: number;
  dataSource: string;
  metadata?: {
    confidence?: number;
    relatedTerms?: string[];
    geographicData?: any;
    aiAnalysis?: any;
  };
  lastUpdated: string;
}

interface MarketIntelligence {
  id: string;
  topic: string;
  category: string;
  title: string;
  summary: string;
  sourceType: string;
  sentimentScore: number;
  impactScore: number;
  keywords: string[];
  publishedAt: string;
}

interface TrendAlert {
  id: string;
  alertType: 'spike' | 'drop' | 'milestone';
  message: string;
  actualValue: number;
  threshold: number;
  status: 'unread' | 'read' | 'dismissed';
  triggeredAt: string;
}

interface DashboardData {
  topTrends: TrendData[];
  alerts: TrendAlert[];
  intelligence: MarketIntelligence[];
  summary: {
    totalTrends: number;
    activeAlerts: number;
    latestIntelligence: number;
  };
}

export function IndustryTrendIndicator() {
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const queryClient = useQueryClient();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, refetch: refetchDashboard } = useQuery<DashboardData>({
    queryKey: ['/api/trends/dashboard', selectedIndustry],
    queryFn: () => apiRequest(`/api/trends/dashboard?industry=${selectedIndustry}&userId=user-1`),
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
  });

  // Analyze keyword mutation
  const analyzeKeywordMutation = useMutation({
    mutationFn: (keyword: string) => 
      apiRequest(`/api/trends/analyze/${encodeURIComponent(keyword)}?industry=${selectedIndustry}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trends/dashboard'] });
    }
  });

  // Generate alerts mutation
  const generateAlertsMutation = useMutation({
    mutationFn: () => apiRequest('/api/trends/alerts/generate', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1' })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trends/dashboard'] });
    }
  });

  const handleKeywordAnalysis = () => {
    if (searchKeyword.trim()) {
      analyzeKeywordMutation.mutate(searchKeyword.trim());
      setSearchKeyword('');
    }
  };

  // Simple UI Components using Tailwind
  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-lg shadow border ${className}`}>{children}</div>
  );

  const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
  );

  const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
  );

  const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
  );

  const Button = ({ children, onClick, disabled = false, className = '', ...props }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    disabled?: boolean; 
    className?: string;
    [key: string]: any;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  const Input = ({ value, onChange, placeholder, className = '', onKeyPress, ...props }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    [key: string]: any;
  }) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );

  const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );

  const Progress = ({ value, className = '' }: { value: number; className?: string }) => (
    <div className={`w-full bg-gray-200 rounded-full ${className}`}>
      <div
        className="bg-blue-600 h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );

  const Tabs = ({ value, onValueChange, children }: { 
    value: string; 
    onValueChange: (value: string) => void; 
    children: React.ReactNode;
  }) => (
    <div data-value={value} data-onvaluechange={onValueChange}>
      {children}
    </div>
  );

  const TabsList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`}>
      {children}
    </div>
  );

  const TabsTrigger = ({ value, children, className = '' }: { 
    value: string; 
    children: React.ReactNode; 
    className?: string;
  }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === value 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'
      } ${className}`}
    >
      {children}
    </button>
  );

  const TabsContent = ({ value, children, className = '' }: { 
    value: string; 
    children: React.ReactNode; 
    className?: string;
  }) => {
    if (activeTab !== value) return null;
    return <div className={className}>{children}</div>;
  };

  const getTrendIcon = (changePercent: number) => {
    if (changePercent > 10) return <ArrowUpCircle className="w-4 h-4 text-green-500" />;
    if (changePercent > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (changePercent < -10) return <ArrowDownCircle className="w-4 h-4 text-red-500" />;
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-500';
    if (score < -0.3) return 'text-red-500';
    return 'text-gray-400';
  };

  const getCompetitionBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const industries = [
    'technology', 'healthcare', 'finance', 'manufacturing', 
    'retail', 'education', 'automotive', 'energy'
  ];

  if (isDashboardLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Radar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Industry Trend Intelligence</h1>
                <p className="text-gray-600">Real-time market insights and trend analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="select-industry"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </option>
                ))}
              </select>
              <Button 
                onClick={() => generateAlertsMutation.mutate()}
                disabled={generateAlertsMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-generate-alerts"
              >
                <Bell className="w-4 h-4 mr-2" />
                Generate Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Trends</p>
                    <p className="text-3xl font-bold">{dashboardData?.summary.totalTrends || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Active Alerts</p>
                    <p className="text-3xl font-bold">{dashboardData?.summary.activeAlerts || 0}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Intelligence Items</p>
                    <p className="text-3xl font-bold">{dashboardData?.summary.latestIntelligence || 0}</p>
                  </div>
                  <Brain className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Industry Score</p>
                    <p className="text-3xl font-bold">
                      {dashboardData?.topTrends?.[0]?.trendScore ? 
                        Math.round(Number(dashboardData.topTrends[0].trendScore)) : 0}
                    </p>
                  </div>
                  <Gauge className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Analyze keyword trends (e.g., artificial intelligence, blockchain, sustainability)"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleKeywordAnalysis()}
                    data-testid="input-keyword-search"
                  />
                </div>
                <Button 
                  onClick={handleKeywordAnalysis}
                  disabled={analyzeKeywordMutation.isPending || !searchKeyword.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
                  data-testid="button-analyze-keyword"
                >
                  {analyzeKeywordMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Live Trends</span>
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Market Intel</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Trends */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Top Trending Keywords</span>
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">Live</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboardData?.topTrends?.slice(0, 5).map((trend, index) => (
                      <motion.div
                        key={trend.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {getTrendIcon(Number(trend.changePercent))}
                          <div>
                            <p className="font-medium text-gray-900">{trend.keyword}</p>
                            <p className="text-sm text-gray-500">
                              {Number(trend.searchVolume).toLocaleString()} searches
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${Number(trend.changePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Number(trend.changePercent) >= 0 ? '+' : ''}{Number(trend.changePercent).toFixed(1)}%
                          </p>
                          <Badge className={getCompetitionBadgeColor(trend.competitionLevel)}>
                            {trend.competitionLevel}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Alerts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-yellow-600" />
                      <span>Recent Alerts</span>
                    </CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {dashboardData?.alerts?.length || 0} New
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboardData?.alerts?.slice(0, 5).map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg"
                      >
                        <div className={`p-1 rounded-full ${
                          alert.alertType === 'spike' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {alert.alertType === 'spike' ? 
                            <ArrowUpCircle className="w-4 h-4 text-green-600" /> :
                            <ArrowDownCircle className="w-4 h-4 text-red-600" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.triggeredAt).toLocaleDateString()} at{' '}
                            {new Date(alert.triggeredAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Live Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.topTrends?.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold truncate">
                          {trend.keyword}
                        </CardTitle>
                        {getTrendIcon(Number(trend.changePercent))}
                      </div>
                      <Badge className={getCompetitionBadgeColor(trend.competitionLevel)}>
                        {trend.competitionLevel} competition
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Trend Score</span>
                          <span className="font-medium">{Number(trend.trendScore).toFixed(1)}/100</span>
                        </div>
                        <Progress value={Number(trend.trendScore)} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Search Volume</p>
                          <p className="font-semibold">{Number(trend.searchVolume).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Change</p>
                          <p className={`font-semibold ${Number(trend.changePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Number(trend.changePercent) >= 0 ? '+' : ''}{Number(trend.changePercent).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-sm">Sentiment</p>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            Number(trend.sentimentScore) > 0.3 ? 'bg-green-500' :
                            Number(trend.sentimentScore) < -0.3 ? 'bg-red-500' : 'bg-gray-400'
                          }`}></div>
                          <span className={`text-sm font-medium ${getSentimentColor(Number(trend.sentimentScore))}`}>
                            {Number(trend.sentimentScore) > 0.3 ? 'Positive' :
                             Number(trend.sentimentScore) < -0.3 ? 'Negative' : 'Neutral'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Last updated: {new Date(trend.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Market Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="space-y-4">
              {dashboardData?.intelligence?.map((intel, index) => (
                <motion.div
                  key={intel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-blue-100 text-blue-800">{intel.category}</Badge>
                            <Badge className="bg-gray-100 text-gray-800">{intel.sourceType}</Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{intel.title}</h3>
                          <p className="text-gray-600 mb-3">{intel.summary}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{new Date(intel.publishedAt).toLocaleDateString()}</span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                Number(intel.sentimentScore) > 0.3 ? 'bg-green-500' :
                                Number(intel.sentimentScore) < -0.3 ? 'bg-red-500' : 'bg-gray-400'
                              }`}></div>
                              <span className={getSentimentColor(Number(intel.sentimentScore))}>
                                Sentiment: {Number(intel.sentimentScore).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm text-gray-500 mb-1">Impact Score</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {(Number(intel.impactScore) * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      {intel.keywords.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex flex-wrap gap-2">
                            {intel.keywords.slice(0, 5).map((keyword, idx) => (
                              <Badge key={idx} className="bg-purple-100 text-purple-800 text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              {dashboardData?.alerts?.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-3 rounded-full ${
                            alert.alertType === 'spike' ? 'bg-green-100' : 
                            alert.alertType === 'drop' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            {alert.alertType === 'spike' ? 
                              <ArrowUpCircle className="w-6 h-6 text-green-600" /> :
                              alert.alertType === 'drop' ?
                              <ArrowDownCircle className="w-6 h-6 text-red-600" /> :
                              <Target className="w-6 h-6 text-blue-600" />
                            }
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {alert.alertType === 'spike' ? 'Trend Spike Detected' :
                               alert.alertType === 'drop' ? 'Trend Drop Alert' : 'Milestone Alert'}
                            </h3>
                            <p className="text-gray-600 mb-3">{alert.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Triggered: {new Date(alert.triggeredAt).toLocaleString()}</span>
                              <span>Threshold: {Number(alert.threshold).toFixed(1)}%</span>
                              <span>Actual: {Number(alert.actualValue).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={
                          alert.status === 'unread' ? 'bg-red-100 text-red-800' :
                          alert.status === 'read' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {alert.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default IndustryTrendIndicator;