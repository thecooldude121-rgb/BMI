import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Plus,
  RefreshCw,
  Brain,
  Lightbulb,
  ChevronRight,
  Phone,
  Mail,
  Users,
  FileText,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface ActivitySuggestion {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task' | 'note' | 'follow_up';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  title: string;
  description: string;
  suggestedDate: string;
  estimatedDuration: number;
  relatedToType: 'lead' | 'deal' | 'contact' | 'account';
  relatedToId: string;
  relatedToName: string;
  reasoning: string;
  confidence: number;
  tags: string[];
  context: {
    trigger: string;
    dataPoints: string[];
    expectedOutcome: string;
  };
}

interface AIAutomationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAutomationPanel: React.FC<AIAutomationPanelProps> = ({ isOpen, onClose }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<ActivitySuggestion | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const queryClient = useQueryClient();

  // Fetch AI suggestions
  const { data: suggestions = [], isLoading, refetch } = useQuery<ActivitySuggestion[]>({
    queryKey: ['/api/activities/ai-suggestions'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Accept suggestion mutation
  const acceptSuggestionMutation = useMutation({
    mutationFn: async ({ suggestionId, customizations }: { suggestionId: string; customizations: any }) => {
      const response = await fetch('/api/activities/ai-suggestions/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId, customizations, userId: '1' })
      });
      if (!response.ok) throw new Error('Failed to accept suggestion');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities/metrics'] });
      refetch();
    },
  });

  // Feedback mutation
  const feedbackMutation = useMutation({
    mutationFn: async ({ suggestionId, helpful, reason }: { suggestionId: string; helpful: boolean; reason?: string }) => {
      const response = await fetch('/api/activities/ai-suggestions/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId, helpful, reason })
      });
      return response.json();
    },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'task': return <CheckCircle2 className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'urgent': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-blue-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const handleAcceptSuggestion = (suggestion: ActivitySuggestion) => {
    const customizations = {
      title: suggestion.title,
      type: suggestion.type,
      priority: suggestion.priority,
      description: suggestion.description,
      scheduledAt: suggestion.suggestedDate,
      duration: suggestion.estimatedDuration,
      relatedToType: suggestion.relatedToType,
      relatedToId: suggestion.relatedToId
    };

    acceptSuggestionMutation.mutate({ 
      suggestionId: suggestion.id, 
      customizations 
    });
  };

  const handleFeedback = (suggestionId: string, helpful: boolean) => {
    feedbackMutation.mutate({ suggestionId, helpful });
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filterPriority !== 'all' && suggestion.priority !== filterPriority) return false;
    if (filterType !== 'all' && suggestion.type !== filterType) return false;
    return true;
  });

  const priorityStats = suggestions.reduce((acc, suggestion) => {
    acc[suggestion.priority] = (acc[suggestion.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Activity Automation</h2>
                <p className="text-purple-100">Intelligent suggestions for optimal productivity</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="text-2xl font-bold">{suggestions.length}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Critical</span>
              </div>
              <div className="text-2xl font-bold">{priorityStats.critical || 0}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Urgent</span>
              </div>
              <div className="text-2xl font-bold">{priorityStats.urgent || 0}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">High</span>
              </div>
              <div className="text-2xl font-bold">{priorityStats.high || 0}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">AI Score</span>
              </div>
              <div className="text-2xl font-bold">
                {suggestions.length > 0 ? Math.round(suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Priority:</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="critical">Critical</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Type:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                  <option value="note">Note</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[60vh]">
          {/* Suggestions List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Analyzing CRM data...</p>
                </div>
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No AI suggestions available</p>
                  <p className="text-sm text-gray-500">All activities are up to date!</p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredSuggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    layout
                    className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      selectedSuggestion?.id === suggestion.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setSelectedSuggestion(suggestion)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 rounded-lg bg-gray-100">
                          {getActivityIcon(suggestion.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{suggestion.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{suggestion.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                              {suggestion.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              {suggestion.relatedToType}: {suggestion.relatedToName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className={`flex items-center space-x-1 ${getConfidenceColor(suggestion.confidence)}`}>
                          <Star className="w-3 h-3" />
                          <span className="text-xs font-medium">{suggestion.confidence}%</span>
                        </div>
                        <span className="text-xs text-gray-500">{suggestion.estimatedDuration}m</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Suggestion Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedSuggestion ? (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100">
                      {getActivityIcon(selectedSuggestion.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedSuggestion.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedSuggestion.priority)}`}>
                          {selectedSuggestion.priority}
                        </span>
                        <span className="text-sm text-gray-600">
                          {selectedSuggestion.relatedToType}: {selectedSuggestion.relatedToName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{selectedSuggestion.description}</p>

                  {/* AI Reasoning */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-amber-900">AI Reasoning</span>
                      <span className={`text-xs font-medium ${getConfidenceColor(selectedSuggestion.confidence)}`}>
                        {selectedSuggestion.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-amber-800">{selectedSuggestion.reasoning}</p>
                  </div>

                  {/* Context Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Context</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Trigger: </span>
                          <span className="text-sm text-gray-600">{selectedSuggestion.context.trigger}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Expected Outcome: </span>
                          <span className="text-sm text-gray-600">{selectedSuggestion.context.expectedOutcome}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Data Points</h4>
                      <div className="space-y-1">
                        {selectedSuggestion.context.dataPoints.map((point, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Suggested Date:</span>
                          <div className="font-medium">{new Date(selectedSuggestion.suggestedDate).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div className="font-medium">{selectedSuggestion.estimatedDuration} minutes</div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedSuggestion.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSuggestion.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFeedback(selectedSuggestion.id, true)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful</span>
                      </button>
                      <button
                        onClick={() => handleFeedback(selectedSuggestion.id, false)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>Not helpful</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleAcceptSuggestion(selectedSuggestion)}
                      disabled={acceptSuggestionMutation.isPending}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Activity</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Select a suggestion to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAutomationPanel;