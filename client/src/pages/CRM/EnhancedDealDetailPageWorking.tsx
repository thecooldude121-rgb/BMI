import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, DollarSign, Calendar, User, Building, Phone, Mail, MessageSquare,
  FileText, Upload, Download, Edit3, Save, X, Plus, ChevronDown, ChevronUp,
  Activity, Clock, AlertTriangle, CheckCircle, Target, TrendingUp,
  Settings, Link2, Tag, Bell, Filter, Search, MoreHorizontal,
  ArrowRight, ArrowLeft, Maximize2, Minimize2, Eye, EyeOff,
  Users, Paperclip, Video, Shield, Zap, BarChart3, Brain, Lightbulb,
  Check, XCircle, AlertCircle, Trash2, Copy, ExternalLink, RefreshCw,
  MapPin, Globe, Briefcase, Award, Camera, Share2, BookOpen, PieChart,
  Calendar as CalendarIcon, Smartphone, MessageCircle, BarChart2
} from 'lucide-react';

// Enhanced Types with Modern Architecture
interface DealScorecard {
  overallScore: number;
  healthStatus: 'healthy' | 'at_risk' | 'critical' | 'hot_opportunity';
  engagementScore: number;
  fitScore: number;
  urgencyScore: number;
  budgetScore: number;
  authorityScore: number;
  timelineScore: number;
  riskFactors: string[];
  opportunities: string[];
  strengths: string[];
  recommendations: string[];
}

interface EditableField {
  field: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  validation?: (value: string) => string | null;
}

interface ValidationError {
  field: string;
  message: string;
}

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  actions?: string[];
}

interface DealCommunication {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'sms';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  duration?: number;
  outcome: string;
  participants: string[];
  occurredAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  actionItems: string[];
}

interface DealNote {
  id: string;
  content: string;
  noteType: 'internal' | 'external' | 'meeting' | 'call';
  isPrivate: boolean;
  authorName: string;
  createdAt: string;
  mentions: string[];
}

interface DealFile {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  documentType: string;
  uploadedBy: string;
  uploadedAt: string;
  accessLevel: string;
}

const EnhancedDealDetailPageWorking = () => {
  const [match, params] = useRoute('/crm/deals/enhanced/:id');
  const dealId = params?.id;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced UI State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [searchGlobal, setSearchGlobal] = useState('');
  const [quickFilters, setQuickFilters] = useState({
    communications: 'all',
    notes: 'all',
    files: 'all'
  });
  const [searchTerms, setSearchTerms] = useState({
    notes: '',
    communications: '',
    files: ''
  });

  // Enhanced Data fetching with error handling
  const { data: deal, isLoading: dealLoading, error: dealError } = useQuery({
    queryKey: ['/api/deals', dealId],
    enabled: !!dealId,
    refetchOnWindowFocus: false
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
    enabled: !!dealId
  });

  const { data: account } = useQuery({
    queryKey: ['/api/accounts', (deal as any)?.accountId],
    enabled: !!(deal as any)?.accountId
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
    enabled: !!dealId
  });

  // Enhanced Mutation for deal updates with optimistic updates
  const updateDealMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update deal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals', dealId] });
      setIsEditMode(false);
      setEditedFields({});
      setValidationErrors([]);
    },
    onError: (error: any) => {
      console.error('Deal update failed:', error);
    }
  });

  // Enhanced validation functions
  const validateField = useCallback((field: string, value: any): string | null => {
    switch (field) {
      case 'name':
        return !value || value.trim().length < 2 ? 'Name must be at least 2 characters' : null;
      case 'value':
        return isNaN(parseFloat(value)) || parseFloat(value) < 0 ? 'Value must be a positive number' : null;
      case 'probability':
        const prob = parseFloat(value);
        return isNaN(prob) || prob < 0 || prob > 100 ? 'Probability must be between 0-100' : null;
      case 'expectedCloseDate':
        return !value ? 'Close date is required' : null;
      default:
        return null;
    }
  }, []);

  // Inline editing handlers
  const handleFieldEdit = useCallback((field: string, value: any) => {
    setEditedFields(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const error = validateField(field, value);
    setValidationErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      return error ? [...filtered, { field, message: error }] : filtered;
    });
  }, [validateField]);

  // Drag and drop file upload handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload with progress
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Mock upload process
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setIsUploading(false);
    setUploadProgress(0);
  };

  // AI Insights generator
  const generateAIInsights = useCallback(async () => {
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'prediction',
        title: 'High Win Probability Detected',
        description: 'Based on engagement patterns and stakeholder involvement, this deal has 87% likelihood of closing within 30 days.',
        confidence: 87,
        priority: 'high',
        actionable: true,
        actions: ['Schedule executive demo', 'Prepare contract terms']
      },
      {
        id: '2',
        type: 'alert',
        title: 'Competitor Activity Detected',
        description: 'Recent market intelligence suggests competitor pricing pressure. Consider value proposition reinforcement.',
        confidence: 72,
        priority: 'medium',
        actionable: true,
        actions: ['Review competitive analysis', 'Highlight unique differentiators']
      },
      {
        id: '3',
        type: 'opportunity',
        title: 'Upsell Potential Identified',
        description: 'Account shows signs of expansion needs. Enterprise features could increase deal value by 40%.',
        confidence: 65,
        priority: 'medium',
        actionable: true,
        actions: ['Present enterprise add-ons', 'Schedule expansion meeting']
      }
    ];
    setAiInsights(mockInsights);
  }, []);

  // Initialize AI insights
  useEffect(() => {
    if (deal && !aiInsights.length) {
      generateAIInsights();
    }
  }, [deal, aiInsights.length, generateAIInsights]);

  // Enhanced InfoField Component with Inline Editing
  const EnhancedInfoField = ({ 
    label, 
    field, 
    value, 
    editable, 
    type = 'text', 
    options, 
    onChange, 
    error,
    prefix,
    suffix 
  }: {
    label: string;
    field: string;
    value: any;
    editable?: boolean;
    type?: 'text' | 'number' | 'date' | 'select';
    options?: string[];
    onChange?: (value: any) => void;
    error?: string;
    prefix?: string;
    suffix?: string;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleSave = () => {
      if (onChange) {
        onChange(localValue);
      }
      setIsEditing(false);
    };

    const handleCancel = () => {
      setLocalValue(value);
      setIsEditing(false);
    };

    const displayValue = type === 'number' && prefix ? `${prefix}${parseInt(localValue || 0).toLocaleString()}${suffix || ''}` : 
                        type === 'date' ? (localValue ? new Date(localValue).toLocaleDateString() : 'Not set') :
                        localValue || 'N/A';

    return (
      <div className="group" data-testid={`field-${field}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {editable && !isEditing ? (
          <div 
            className="relative bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 cursor-pointer transition-all duration-200 group-hover:border-blue-300"
            onClick={() => setIsEditing(true)}
            data-testid={`field-${field}-editable`}
          >
            <span className="text-gray-900">{displayValue}</span>
            <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : isEditing ? (
          <div className="space-y-2">
            {type === 'select' ? (
              <select
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                data-testid={`input-${field}`}
              >
                {options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                data-testid={`input-${field}`}
              />
            )}
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                data-testid={`button-save-${field}`}
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                data-testid={`button-cancel-${field}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-gray-900">{displayValue}</span>
          </div>
        )}
        {error && (
          <motion.p 
            className="mt-1 text-sm text-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  };

  // Mock data for enhanced features (would come from API)
  const [dealScorecard] = useState<DealScorecard>({
    overallScore: 78,
    healthStatus: 'healthy',
    engagementScore: 85,
    fitScore: 72,
    urgencyScore: 68,
    budgetScore: 80,
    authorityScore: 75,
    timelineScore: 82,
    riskFactors: ['Competition from Salesforce', 'Budget approval pending'],
    opportunities: ['Expansion potential', 'Multi-year contract possible'],
    strengths: ['Strong stakeholder buy-in', 'Clear business case'],
    recommendations: ['Schedule executive meeting', 'Provide ROI analysis']
  });

  const [communications] = useState<DealCommunication[]>([
    {
      id: '1',
      type: 'email',
      direction: 'outbound',
      subject: 'Proposal Follow-up',
      content: 'Following up on our proposal discussion...',
      outcome: 'positive_response',
      participants: ['john@company.com'],
      occurredAt: '2024-08-20T10:00:00Z',
      sentiment: 'positive',
      actionItems: ['Schedule demo', 'Prepare technical requirements']
    },
    {
      id: '2',
      type: 'call',
      direction: 'outbound',
      subject: 'Discovery Call',
      content: 'Discussed current challenges and requirements',
      duration: 45,
      outcome: 'successful',
      participants: ['Sarah Johnson', 'Mike Chen'],
      occurredAt: '2024-08-18T14:30:00Z',
      sentiment: 'positive',
      actionItems: ['Send proposal', 'Technical deep dive']
    }
  ]);

  const [dealNotes] = useState<DealNote[]>([
    {
      id: '1',
      content: 'Great meeting with stakeholders. They showed strong interest in our enterprise features.',
      noteType: 'meeting',
      isPrivate: false,
      authorName: 'John Smith',
      createdAt: '2024-08-20T15:30:00Z',
      mentions: ['@sarah', '@mike']
    },
    {
      id: '2',
      content: 'Internal note: Need to address pricing concerns before final presentation.',
      noteType: 'internal',
      isPrivate: true,
      authorName: 'Sales Manager',
      createdAt: '2024-08-19T09:15:00Z',
      mentions: []
    }
  ]);

  const [dealFiles] = useState<DealFile[]>([
    {
      id: '1',
      fileName: 'proposal_v2.pdf',
      originalName: 'Enterprise Proposal v2.pdf',
      fileSize: 2560000,
      documentType: 'proposal',
      uploadedBy: 'John Smith',
      uploadedAt: '2024-08-20T11:00:00Z',
      accessLevel: 'team'
    }
  ]);

  // Section collapse/expand functionality
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionCollapsed = (sectionId: string) => collapsedSections.includes(sectionId);

  // Enhanced Deal Health Badge
  const getHealthBadge = (status: string) => {
    const configs = {
      healthy: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Healthy' },
      at_risk: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, label: 'At Risk' },
      critical: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Critical' },
      hot_opportunity: { color: 'bg-blue-100 text-blue-800', icon: TrendingUp, label: 'Hot Opportunity' }
    };
    
    const config = configs[status as keyof typeof configs] || configs.healthy;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  // Score visualization component
  const ScoreCircle = ({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-20 h-20', 
      lg: 'w-24 h-24'
    };
    
    const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
    const radius = size === 'sm' ? 20 : size === 'md' ? 28 : 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      if (score >= 40) return 'text-orange-600';
      return 'text-red-600';
    };

    return (
      <div className="text-center">
        <div className={`relative ${sizeClasses[size]} mx-auto`}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-500 ${getScoreColor(score)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-bold ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'}`}>
              {score}
            </span>
          </div>
        </div>
        <p className={`mt-2 font-medium text-gray-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {label}
        </p>
      </div>
    );
  };

  if (dealLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deal Not Found</h2>
          <p className="text-gray-600">The deal you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 ${showFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Modern Enhanced Header with Glass Effect */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="px-6 py-4">
          {/* Global Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search across deal..."
                value={searchGlobal}
                onChange={(e) => setSearchGlobal(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                data-testid="input-global-search"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate max-w-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(deal as any)?.name || 'Deal'}
              </motion.h1>
              {getHealthBadge(dealScorecard.healthStatus)}
              <motion.div 
                className="flex items-center space-x-2 text-sm bg-gradient-to-r from-green-100 to-blue-100 px-3 py-1 rounded-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-bold text-gray-900">${parseInt((deal as any)?.value || '0').toLocaleString()}</span>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Enhanced Quick Actions with Modern Design */}
              <motion.button 
                onClick={() => setShowFullScreen(!showFullScreen)}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title={showFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-fullscreen-toggle"
              >
                {showFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </motion.button>
              
              <motion.button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-configure"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  if (isEditMode) {
                    // Save changes
                    const updates = { ...editedFields };
                    if (Object.keys(updates).length > 0) {
                      updateDealMutation.mutate(updates);
                    }
                  } else {
                    setIsEditMode(true);
                  }
                }}
                disabled={isEditMode && validationErrors.length > 0}
                className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEditMode 
                    ? 'text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg' 
                    : 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg'
                }`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-edit-save"
              >
                {updateDealMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : isEditMode ? (
                  <Save className="w-4 h-4 mr-2" />
                ) : (
                  <Edit3 className="w-4 h-4 mr-2" />
                )}
                {updateDealMutation.isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Edit Deal'}
              </motion.button>

              {/* AI Insights Toggle */}
              <motion.button
                onClick={generateAIInsights}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-ai-insights"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Insights
              </motion.button>
            </div>
          </div>
          
          {/* Enhanced Tab Navigation with Modern Design */}
          <div className="mt-6">
            <nav className="flex flex-wrap gap-1 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'scorecard', label: 'Scorecard', icon: BarChart3 },
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'communications', label: 'Communications', icon: MessageSquare },
                { id: 'files', label: 'Files', icon: FileText },
                { id: 'ai-insights', label: 'AI Insights', icon: Brain },
                { id: 'automation', label: 'Workflows', icon: Zap }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'text-blue-700 bg-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`tab-${tab.id}`}
                  >
                    <Icon className={`w-4 h-4 mr-1.5 ${isActive ? 'text-blue-600' : ''}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Validation Errors Display */}
          {validationErrors.length > 0 && (
            <motion.div 
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <ul className="mt-1 text-sm text-red-700">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 py-6 max-w-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Left Column - Deal Information */}
                <div className="xl:col-span-3 space-y-8">
                  {/* Enhanced Deal Details Card */}
                  <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <Target className="w-6 h-6 mr-3 text-blue-600" />
                          Deal Information
                        </h3>
                        {isEditMode && (
                          <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            Edit Mode Active
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <EnhancedInfoField 
                          label="Deal Name" 
                          field="name"
                          value={editedFields.name || (deal as any)?.name || ''} 
                          editable={isEditMode}
                          type="text"
                          onChange={(value) => handleFieldEdit('name', value)}
                          error={validationErrors.find(e => e.field === 'name')?.message}
                        />
                        <EnhancedInfoField 
                          label="Account" 
                          field="account"
                          value={(account as any)?.name || 'N/A'} 
                          editable={false}
                        />
                        <EnhancedInfoField 
                          label="Value" 
                          field="value"
                          value={editedFields.value || (deal as any)?.value || '0'} 
                          editable={isEditMode}
                          type="number"
                          onChange={(value) => handleFieldEdit('value', value)}
                          error={validationErrors.find(e => e.field === 'value')?.message}
                          prefix="$"
                        />
                        <EnhancedInfoField 
                          label="Stage" 
                          field="stage"
                          value={editedFields.stage || (deal as any)?.stage || ''} 
                          editable={isEditMode}
                          type="select"
                          options={['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']}
                          onChange={(value) => handleFieldEdit('stage', value)}
                        />
                        <EnhancedInfoField 
                          label="Probability" 
                          field="probability"
                          value={editedFields.probability || (deal as any)?.probability || 0} 
                          editable={isEditMode}
                          type="number"
                          onChange={(value) => handleFieldEdit('probability', value)}
                          error={validationErrors.find(e => e.field === 'probability')?.message}
                          suffix="%"
                        />
                        <EnhancedInfoField 
                          label="Expected Close" 
                          field="expectedCloseDate"
                          value={editedFields.expectedCloseDate || (deal as any)?.expectedCloseDate || ''} 
                          editable={isEditMode}
                          type="date"
                          onChange={(value) => handleFieldEdit('expectedCloseDate', value)}
                          error={validationErrors.find(e => e.field === 'expectedCloseDate')?.message}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Recent Activities */}
                  <CollapsibleCard 
                    title="Recent Activities" 
                    icon={Activity}
                    onToggle={() => toggleSection('activities')}
                    isCollapsed={isSectionCollapsed('activities')}
                    rightContent={
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {Array.isArray(activities) && activities.slice(0, 5).map((activity: any) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </div>
                  </CollapsibleCard>

                  {/* Quick Notes */}
                  <CollapsibleCard 
                    title="Quick Notes" 
                    icon={MessageSquare}
                    onToggle={() => toggleSection('notes')}
                    isCollapsed={isSectionCollapsed('notes')}
                    rightContent={
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <Plus className="w-4 h-4 mr-1 inline" />
                        Add Note
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {dealNotes.slice(0, 3).map(note => (
                        <NoteItem key={note.id} note={note} />
                      ))}
                    </div>
                  </CollapsibleCard>
                </div>

                {/* Right Column - Sidebar */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Deal Health Score */}
                  <CollapsibleCard 
                    title="Deal Health" 
                    icon={TrendingUp}
                    onToggle={() => toggleSection('health')}
                    isCollapsed={isSectionCollapsed('health')}
                  >
                    <div className="text-center mb-4">
                      <ScoreCircle score={dealScorecard.overallScore} label="Overall Score" size="lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Engagement</span>
                        <span className="font-medium">{dealScorecard.engagementScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Product Fit</span>
                        <span className="font-medium">{dealScorecard.fitScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Timeline</span>
                        <span className="font-medium">{dealScorecard.timelineScore}%</span>
                      </div>
                    </div>
                  </CollapsibleCard>

                  {/* Related Entities */}
                  <CollapsibleCard 
                    title="Related Entities" 
                    icon={Link2}
                    onToggle={() => toggleSection('related')}
                    isCollapsed={isSectionCollapsed('related')}
                  >
                    <div className="space-y-3">
                      <RelatedEntityItem 
                        type="Account" 
                        name={account?.name || 'N/A'}
                        icon={Building}
                        link={`/crm/accounts/${(deal as any)?.accountId}`}
                      />
                      <RelatedEntityItem 
                        type="Primary Contact" 
                        name={Array.isArray(contacts) && contacts[0] ? (contacts[0] as any).name : 'N/A'}
                        icon={User}
                        link={`/crm/contacts/${Array.isArray(contacts) && contacts[0] ? (contacts[0] as any).id : ''}`}
                      />
                      <RelatedEntityItem 
                        type="Activities" 
                        name={`${Array.isArray(activities) ? activities.length : 0} items`}
                        icon={Activity}
                        link={`/crm/activities?dealId=${dealId}`}
                      />
                    </div>
                  </CollapsibleCard>

                  {/* AI Insights & Recommendations */}
                  <CollapsibleCard 
                    title="AI Recommendations" 
                    icon={Zap}
                    onToggle={() => toggleSection('ai-insights')}
                    isCollapsed={isSectionCollapsed('ai-insights')}
                  >
                    <div className="space-y-3">
                      {dealScorecard.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm text-blue-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleCard>
                </div>
              </div>
            )}

            {activeTab === 'scorecard' && (
              <DealScorecardView scorecard={dealScorecard} />
            )}

            {activeTab === 'communications' && (
              <CommunicationsView 
                communications={communications}
                searchTerm={searchTerms.communications}
                onSearchChange={(term) => setSearchTerms(prev => ({ ...prev, communications: term }))}
                filter={quickFilters.communications}
                onFilterChange={(filter) => setQuickFilters(prev => ({ ...prev, communications: filter }))}
              />
            )}

            {activeTab === 'files' && (
              <div className="space-y-8">
                {/* Enhanced File Upload Area with Drag & Drop */}
                <motion.div 
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 ${
                    isDragOver ? 'border-blue-400 bg-blue-50/50' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                      <Upload className="w-6 h-6 mr-3 text-blue-600" />
                      Upload Files
                    </h3>
                    
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      {isUploading ? (
                        <div className="space-y-4">
                          <RefreshCw className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                          <div className="space-y-2">
                            <p className="text-gray-700 font-medium">Uploading files...</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              Drop files here or click to browse
                            </p>
                            <p className="text-gray-600">
                              Supports documents, images, and presentations up to 50MB
                            </p>
                          </div>
                          <motion.button
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            data-testid="button-choose-files"
                          >
                            <Camera className="w-5 h-5 mr-2" />
                            Choose Files
                          </motion.button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                handleFileUpload(Array.from(e.target.files));
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Files List */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-blue-600" />
                        Documents ({dealFiles.length})
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search files..."
                          value={searchTerms.files}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, files: e.target.value }))}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-search-files"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {dealFiles.map((file, index) => (
                        <motion.div
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-center space-x-4">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{file.originalName}</p>
                              <p className="text-sm text-gray-600">
                                {(file.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded by {file.uploadedBy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              data-testid={`button-download-${file.id}`}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              data-testid={`button-delete-${file.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'ai-insights' && (
              <div className="space-y-8">
                {/* AI Insights Dashboard */}
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg border border-purple-200/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent flex items-center">
                        <Brain className="w-8 h-8 mr-3 text-purple-600" />
                        AI Intelligence Center
                      </h3>
                      <motion.button
                        onClick={generateAIInsights}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid="button-refresh-insights"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Insights
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {aiInsights.map((insight, index) => (
                        <motion.div
                          key={insight.id}
                          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-200"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              {insight.type === 'prediction' && <TrendingUp className="w-5 h-5 text-green-600" />}
                              {insight.type === 'alert' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                              {insight.type === 'recommendation' && <Lightbulb className="w-5 h-5 text-blue-600" />}
                              {insight.type === 'opportunity' && <Target className="w-5 h-5 text-purple-600" />}
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                                insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {insight.priority.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">{insight.confidence}%</div>
                              <div className="text-xs text-gray-600">confidence</div>
                            </div>
                          </div>
                          
                          <h4 className="font-bold text-gray-900 mb-2">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mb-4">{insight.description}</p>
                          
                          {insight.actionable && insight.actions && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Recommended Actions</h5>
                              {insight.actions.map((action, actionIndex) => (
                                <motion.button
                                  key={actionIndex}
                                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  data-testid={`button-action-${insight.id}-${actionIndex}`}
                                >
                                  • {action}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* AI Performance Metrics */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                      <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                      AI Performance Analytics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">94%</div>
                        <div className="text-sm text-gray-600">Prediction Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">47</div>
                        <div className="text-sm text-gray-600">Insights Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">12</div>
                        <div className="text-sm text-gray-600">Actions Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">+23%</div>
                        <div className="text-sm text-gray-600">Deal Velocity</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Other tabs show placeholder content */}
            {activeTab === 'timeline' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Timeline</h3>
                <p className="text-gray-600">Timeline functionality coming soon...</p>
              </div>
            )}

            {activeTab === 'related' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Entities</h3>
                <p className="text-gray-600">Related entities management coming soon...</p>
              </div>
            )}

            {activeTab === 'automation' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Automation</h3>
                <p className="text-gray-600">Workflow automation coming soon...</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Reusable Components

const CollapsibleCard = ({ 
  title, 
  icon: Icon, 
  children, 
  onToggle, 
  isCollapsed, 
  rightContent 
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  onToggle: () => void;
  isCollapsed: boolean;
  rightContent?: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <button 
        onClick={onToggle}
        className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors"
      >
        <Icon className="w-5 h-5" />
        <h3 className="text-lg font-semibold">{title}</h3>
        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
      {rightContent}
    </div>
    <AnimatePresence>
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="px-6 py-4"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const InfoField = ({ label, value, editable = false }: { label: string; value: string; editable?: boolean }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {editable ? (
      <input 
        type="text" 
        defaultValue={value}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ) : (
      <p className="text-gray-900">{value}</p>
    )}
  </div>
);

const ActivityItem = ({ activity }: { activity: any }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
      <Activity className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{activity.subject || 'Activity'}</p>
      <p className="text-sm text-gray-600 truncate">{activity.description || 'No description'}</p>
      <p className="text-xs text-gray-500 mt-1">
        {activity.scheduledAt ? new Date(activity.scheduledAt).toLocaleDateString() : 'No date'}
      </p>
    </div>
  </div>
);

const NoteItem = ({ note }: { note: DealNote }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {note.noteType}
      </span>
      <span className="text-xs text-gray-500">
        {new Date(note.createdAt).toLocaleDateString()}
      </span>
    </div>
    <p className="text-sm text-gray-900 mb-1">{note.content}</p>
    <p className="text-xs text-gray-600">by {note.authorName}</p>
  </div>
);

const RelatedEntityItem = ({ 
  type, 
  name, 
  icon: Icon, 
  link 
}: { 
  type: string; 
  name: string; 
  icon: any; 
  link: string; 
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-center space-x-3">
      <Icon className="w-4 h-4 text-gray-600" />
      <div>
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{type}</p>
        <p className="text-sm text-gray-900">{name}</p>
      </div>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-400" />
  </div>
);

// Enhanced Tab Views
const DealScorecardView = ({ scorecard }: { scorecard: DealScorecard }) => (
  <div className="space-y-6">
    {/* Score Overview */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Deal Health Analysis</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <ScoreCircle score={scorecard.engagementScore} label="Engagement" />
        <ScoreCircle score={scorecard.fitScore} label="Product Fit" />
        <ScoreCircle score={scorecard.urgencyScore} label="Urgency" />
        <ScoreCircle score={scorecard.budgetScore} label="Budget" />
        <ScoreCircle score={scorecard.authorityScore} label="Authority" />
        <ScoreCircle score={scorecard.timelineScore} label="Timeline" />
      </div>
    </div>

    {/* Risk Factors & Opportunities */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          Risk Factors
        </h4>
        <div className="space-y-2">
          {scorecard.riskFactors.map((risk, index) => (
            <div key={index} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <p className="text-sm text-red-800">{risk}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
          Opportunities
        </h4>
        <div className="space-y-2">
          {scorecard.opportunities.map((opportunity, index) => (
            <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <p className="text-sm text-green-800">{opportunity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CommunicationsView = ({ 
  communications, 
  searchTerm, 
  onSearchChange, 
  filter, 
  onFilterChange 
}: {
  communications: DealCommunication[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
}) => (
  <div className="space-y-6">
    {/* Search and Filter Bar */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search communications..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Communications</option>
          <option value="email">Emails</option>
          <option value="call">Calls</option>
          <option value="meeting">Meetings</option>
        </select>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2 inline" />
          Log Communication
        </button>
      </div>
    </div>

    {/* Communications List */}
    <div className="space-y-4">
      {communications.map(comm => (
        <CommunicationItem key={comm.id} communication={comm} />
      ))}
    </div>
  </div>
);

const CommunicationItem = ({ communication }: { communication: DealCommunication }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'meeting': return Video;
      default: return MessageSquare;
    }
  };

  const Icon = getTypeIcon(communication.type);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-900">{communication.subject}</h4>
            <p className="text-sm text-gray-600 mt-1">{communication.content}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span className="capitalize">{communication.direction}</span>
              <span>{new Date(communication.occurredAt).toLocaleString()}</span>
              {communication.duration && <span>{communication.duration} min</span>}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                communication.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                communication.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {communication.sentiment}
              </span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      {communication.actionItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Action Items:</h5>
          <ul className="space-y-1">
            {communication.actionItems.map((item, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <Target className="w-3 h-3 mr-2 text-blue-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const FilesView = ({ 
  files, 
  dealId, 
  searchTerm, 
  onSearchChange 
}: {
  files: DealFile[];
  dealId: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) => (
  <div className="space-y-6">
    {/* File Upload and Search */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Documents & Files</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4 mr-2 inline" />
            Upload File
          </button>
        </div>
      </div>
    </div>

    {/* Files Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map(file => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  </div>
);

const FileCard = ({ file }: { file: DealFile }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{file.originalName}</h4>
          <p className="text-xs text-gray-500 mt-1">{file.documentType}</p>
          <p className="text-xs text-gray-500">
            {(file.fileSize / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <Download className="w-4 h-4" />
      </button>
    </div>
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>by {file.uploadedBy}</span>
        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

export default EnhancedDealDetailPageWorking;