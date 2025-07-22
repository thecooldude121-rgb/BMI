import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  RefreshCw,
  ChevronRight,
  X,
  BarChart3
} from 'lucide-react';
import { aiInsightsService, type SalesAnalysis, type SalesInsight } from '../../services/aiInsights';

interface AIInsightsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIInsightsSidebar: React.FC<AIInsightsSidebarProps> = ({ isOpen, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<SalesAnalysis | null>(null);

  // Fetch CRM data for analysis
  const { data: deals = [] } = useQuery({ queryKey: ['/api/deals'] });
  const { data: leads = [] } = useQuery({ queryKey: ['/api/leads'] });
  const { data: accounts = [] } = useQuery({ queryKey: ['/api/accounts'] });

  const dealsArray = Array.isArray(deals) ? deals : [];
  const leadsArray = Array.isArray(leads) ? leads : [];
  const accountsArray = Array.isArray(accounts) ? accounts : [];

  const runAnalysis = async () => {
    if (dealsArray.length === 0 && leadsArray.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await aiInsightsService.analyzeSalesData(
        dealsArray, 
        leadsArray, 
        accountsArray
      );
      setLastAnalysis(analysis);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isOpen && dealsArray.length > 0 && !lastAnalysis && !isAnalyzing) {
      runAnalysis();
    }
  }, [isOpen, dealsArray.length]);

  const getInsightIcon = (type: SalesInsight['type']) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'opportunity': return <Target className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: SalesInsight['type'], impact: SalesInsight['impact']) => {
    const baseColors = {
      trend: 'blue',
      opportunity: 'green',
      warning: 'orange',
      recommendation: 'purple'
    };
    
    const color = baseColors[type] || 'gray';
    const intensity = impact === 'high' ? '600' : impact === 'medium' ? '500' : '400';
    
    return {
      icon: `text-${color}-${intensity}`,
      border: `border-${color}-200`,
      bg: `bg-${color}-50`
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Sales Insights</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
            title="Refresh Analysis"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Brain className="h-8 w-8 text-blue-500 animate-pulse mx-auto mb-2" />
              <p className="text-sm text-gray-600">Analyzing your sales data...</p>
            </div>
          </div>
        ) : lastAnalysis ? (
          <div className="p-4 space-y-6">
            {/* Executive Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Executive Summary</h3>
              <p className="text-sm text-gray-700">{lastAnalysis.summary}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 font-medium">Conversion Rate</div>
                <div className="text-lg font-semibold text-blue-900">
                  {lastAnalysis.keyMetrics.conversionRate.toFixed(1)}%
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-green-600 font-medium">Avg Deal Size</div>
                <div className="text-lg font-semibold text-green-900">
                  ${Math.round(lastAnalysis.keyMetrics.averageDealSize).toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-purple-600 font-medium">Sales Velocity</div>
                <div className="text-lg font-semibold text-purple-900">
                  {lastAnalysis.keyMetrics.salesVelocity} days
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-xs text-orange-600 font-medium">Pipeline Health</div>
                <div className="text-lg font-semibold text-orange-900">
                  {lastAnalysis.keyMetrics.pipelineHealth.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Insights */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">AI-Generated Insights</h3>
              <div className="space-y-3">
                {lastAnalysis.insights.map((insight) => {
                  const colors = getInsightColor(insight.type, insight.impact);
                  
                  return (
                    <div
                      key={insight.id}
                      className={`rounded-lg border ${colors.border} ${colors.bg} p-3`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`mt-0.5 ${colors.icon}`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {insight.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <span className={`
                                inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium
                                ${insight.impact === 'high' ? 'bg-red-100 text-red-800' : 
                                  insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'}
                              `}>
                                {insight.impact}
                              </span>
                              {insight.actionable && (
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {insight.description}
                          </p>
                          {insight.actionable && (
                            <div className="mt-2">
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                View Action Items →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click refresh to analyze your sales data</p>
              <button
                onClick={runAnalysis}
                className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Generate Insights
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsSidebar;