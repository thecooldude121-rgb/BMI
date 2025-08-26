import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface HelpBubbleProps {
  trigger: React.ReactNode;
  context: {
    page: string;
    section: string;
    userRole?: string;
    dealStage?: string;
    dealValue?: number;
    accountType?: string;
    currentData?: any;
  };
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'info' | 'tip' | 'warning' | 'success';
}

interface AIInsight {
  type: 'tip' | 'recommendation' | 'warning' | 'best_practice';
  title: string;
  content: string;
  actionable?: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export const ContextualHelpBubble: React.FC<HelpBubbleProps> = ({
  trigger,
  context,
  placement = 'top',
  variant = 'info'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    // TEMPORARILY DISABLED - Testing interaction conflicts
    return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch AI insights when bubble opens
  const fetchAIInsights = async () => {
    if (insights.length > 0) return; // Don't refetch if we already have insights

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/contextual-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI insights');
      }

      const data = await response.json();
      setInsights(data.insights || []);
    } catch (err) {
      setError('Unable to load AI insights at the moment');
      console.error('AI insights error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchAIInsights();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'tip':
        return 'border-blue-200 bg-blue-50 text-blue-900';
      case 'warning':
        return 'border-orange-200 bg-orange-50 text-orange-900';
      case 'success':
        return 'border-green-200 bg-green-50 text-green-900';
      default:
        return 'border-gray-200 bg-white text-gray-900';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'recommendation':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'best_practice':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlacementStyles = () => {
    switch (placement) {
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default: // top
        return 'bottom-full mb-2';
    }
  };

  return (
    <div className="relative inline-block" ref={bubbleRef}>
      {/* Trigger */}
      <button
        onClick={handleToggle}
        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors"
        title="Get AI-powered insights"
      >
        {trigger}
      </button>

      {/* Help Bubble */}
      {isOpen && (
        <div
          className={`absolute z-50 w-80 ${getPlacementStyles()} ${getVariantStyles()} border rounded-lg shadow-lg p-4 animate-fadeIn`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <h3 className="font-semibold text-sm">AI Insights</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Analyzing context...</span>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
                {error}
              </div>
            )}

            {!isLoading && !error && insights.length === 0 && (
              <div className="text-gray-500 text-sm text-center py-2">
                No specific insights available for this context.
              </div>
            )}

            {insights.map((insight, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-70 border border-gray-200 rounded-md p-3 space-y-2"
              >
                <div className="flex items-start space-x-2">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900">{insight.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{insight.content}</p>
                    {insight.actionable && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Actionable
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {insights.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Insights powered by AI • Context: {context.page} - {context.section}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Smart Help Provider Component
export const SmartHelpProvider: React.FC<{
  children: React.ReactNode;
  context: HelpBubbleProps['context'];
}> = ({ children, context }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ContextualHelpBubble
          trigger={<HelpCircle className="h-4 w-4 text-gray-400" />}
          context={context}
          variant="info"
        />
      </div>
    </div>
  );
};

// Pre-built help bubbles for common scenarios
export const DealStageHelp: React.FC<{ stage: string; dealValue?: number }> = ({ stage, dealValue }) => (
  <ContextualHelpBubble
    trigger={<HelpCircle className="h-4 w-4 text-blue-500" />}
    context={{
      page: 'deals',
      section: 'stage_progression',
      dealStage: stage,
      dealValue,
    }}
    variant="tip"
  />
);

export const FieldHelp: React.FC<{ fieldName: string; currentValue?: any }> = ({ fieldName, currentValue }) => (
  <ContextualHelpBubble
    trigger={<HelpCircle className="h-3 w-3 text-gray-400" />}
    context={{
      page: 'form_field',
      section: fieldName,
      currentData: { fieldName, value: currentValue },
    }}
    placement="right"
    variant="info"
  />
);

export default ContextualHelpBubble;