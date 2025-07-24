import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Users, DollarSign, Lightbulb, CheckCircle, Clock, ArrowRight,
  Sparkles, Brain, Zap, Star, BarChart3, Calendar, AlertTriangle, ChevronDown,
  Filter, Search, Download, Upload, Plus, Edit, Eye, Settings
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface GrowthRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'engagement' | 'retention' | 'expansion' | 'efficiency';
  priority: 'high' | 'medium' | 'low';
  impact: number;
  effort: number;
  timeline: string;
  potentialRevenue: number;
  confidence: number;
  actionItems: string[];
  reasoning: string;
  relatedMetrics: string[];
  implementationSteps: Array<{
    step: string;
    duration: string;
    owner: string;
  }>;
  successMetrics: string[];
  aiInsights?: string;
}

interface GrowthAnalysis {
  accountId: string;
  overallScore: number;
  growthPotential: number;
  riskFactors: string[];
  opportunities: string[];
  recommendations: GrowthRecommendation[];
  marketComparison: {
    industryAverage: number;
    percentile: number;
    topPerformers: string[];
  };
  trendAnalysis: {
    revenueGrowth: number;
    engagementTrend: string;
    churnRisk: number;
    expansionReadiness: number;
  };
  generatedAt: string;
}

interface GrowthRecommendationsProps {
  accountId: string;
  className?: string;
}

export function GrowthRecommendations({ accountId, className }: GrowthRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [implementedRecommendations, setImplementedRecommendations] = useState<Set<string>>(new Set());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch growth analysis and recommendations
  const { data: growthAnalysis, isLoading, error } = useQuery({
    queryKey: ['growth-recommendations', accountId],
    queryFn: () => apiRequest(`/api/accounts/${accountId}/growth-recommendations`),
    refetchInterval: 5 * 60 * 1000,
  });

  // Generate new recommendations
  const generateRecommendationsMutation = useMutation({
    mutationFn: () => apiRequest(`/api/accounts/${accountId}/growth-recommendations/generate`, {
      method: 'POST',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-recommendations', accountId] });
    },
  });

  // Mark recommendation as implemented
  const implementRecommendationMutation = useMutation({
    mutationFn: (recommendationId: string) => 
      apiRequest(`/api/accounts/${accountId}/growth-recommendations/${recommendationId}/implement`, {
        method: 'POST',
      }),
    onSuccess: (_, recommendationId) => {
      setImplementedRecommendations(prev => new Set([...prev, recommendationId]));
      queryClient.invalidateQueries({ queryKey: ['growth-recommendations', accountId] });
    },
  });

  const filteredRecommendations = growthAnalysis?.recommendations?.filter((rec: GrowthRecommendation) => 
    selectedCategory === 'all' || rec.category === selectedCategory
  ) || [];

  const categoryColors = {
    revenue: 'bg-green-500',
    engagement: 'bg-blue-500',
    retention: 'bg-purple-500',
    expansion: 'bg-orange-500',
    efficiency: 'bg-teal-500',
  };

  const priorityColors = {
    high: 'bg-red-50 border-red-200 text-red-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    low: 'bg-gray-50 border-gray-200 text-gray-800',
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">AI Growth Recommendations</h2>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Analyzing account data and generating personalized recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">AI Growth Recommendations</h2>
          </div>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load recommendations</h3>
          <p className="text-gray-500 mb-6">There was an issue generating AI recommendations for this account.</p>
          <button 
            onClick={() => generateRecommendationsMutation.mutate()}
            disabled={generateRecommendationsMutation.isPending}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {generateRecommendationsMutation.isPending ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Generate Recommendations
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">AI Growth Recommendations</h2>
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </div>
            </div>
            <button 
              onClick={() => generateRecommendationsMutation.mutate()}
              disabled={generateRecommendationsMutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {generateRecommendationsMutation.isPending ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Refresh Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Growth Overview Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Growth Score</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {growthAnalysis?.overallScore || 0}/10
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(growthAnalysis?.overallScore || 0) * 10}%` }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Growth Potential</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {growthAnalysis?.growthPotential || 0}%
              </div>
              <p className="text-xs text-blue-700 mt-1">Above industry avg</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-purple-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Revenue Potential</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                ${Math.round((filteredRecommendations.reduce((sum, rec) => sum + rec.potentialRevenue, 0) / 1000))}K
              </div>
              <p className="text-xs text-purple-700 mt-1">Estimated annual</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-orange-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Recommendations</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {filteredRecommendations.length}
              </div>
              <p className="text-xs text-orange-700 mt-1">Active suggestions</p>
            </motion.div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {['all', 'revenue', 'engagement', 'retention', 'expansion', 'efficiency'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations List */}
        <div className="p-6">
          {filteredRecommendations.length > 0 ? (
            <div className="space-y-6">
              {filteredRecommendations.map((recommendation: GrowthRecommendation, index: number) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${categoryColors[recommendation.category]}`} />
                          <h3 className="font-semibold text-lg text-gray-900">{recommendation.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[recommendation.priority]}`}>
                            {recommendation.priority.toUpperCase()}
                          </span>
                          <span className="bg-blue-50 border border-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {recommendation.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{recommendation.description}</p>
                        
                        {recommendation.aiInsights && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">AI Insights</span>
                            </div>
                            <p className="text-sm text-blue-700">{recommendation.aiInsights}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-green-600">
                          ${Math.round(recommendation.potentialRevenue / 1000)}K
                        </div>
                        <p className="text-xs text-gray-500">potential revenue</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Impact</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${recommendation.impact * 10}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{recommendation.impact}/10</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Effort</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${recommendation.effort * 10}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{recommendation.effort}/10</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Timeline</label>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{recommendation.timeline}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Items */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Action Items</h4>
                      <ul className="space-y-2">
                        {recommendation.actionItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        Generated {growthAnalysis?.generatedAt && new Date(growthAnalysis.generatedAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => implementRecommendationMutation.mutate(recommendation.id)}
                        disabled={implementRecommendationMutation.isPending || implementedRecommendations.has(recommendation.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                          implementedRecommendations.has(recommendation.id)
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {implementedRecommendations.has(recommendation.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Implemented
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4" />
                            Mark as Implemented
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations available</h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory === 'all' 
                  ? 'Generate new AI recommendations to see personalized growth opportunities.'
                  : `No ${selectedCategory} recommendations found. Try a different category or generate new recommendations.`
                }
              </p>
              <button 
                onClick={() => generateRecommendationsMutation.mutate()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Sparkles className="h-4 w-4" />
                Generate AI Recommendations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrowthRecommendations;