import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, Edit2, Save, X, Plus, Mail, Phone, Globe, Building,
  Calendar, DollarSign, User, Target, Clock, FileText, Paperclip,
  Activity, Users, MessageSquare, Briefcase, TrendingUp, CheckCircle,
  CheckSquare, Eye, History, ChevronRight, Award, Zap, ChevronDown,
  Upload, Download, Search, Filter, MoreVertical, Star, Flag,
  AlertTriangle, ThumbsUp, Send, Reply, Forward, Archive, Trash2,
  ExternalLink, Copy, Share2, Bell, BellOff, UserPlus, Settings,
  Maximize2, Minimize2, RefreshCw, BookOpen, Calculator, PieChart,
  BarChart3, LineChart, Camera, Video, Mic, AtSign, Hash, Link as LinkIcon,
  Tag, MoreHorizontal, Timer, FolderPlus, FolderOpen, Trophy, Circle, Check
} from 'lucide-react';
import { format } from 'date-fns';

interface AdvancedDealDetailsPageProps {
  dealId: string;
}

// Enhanced Deal interface with all required fields
interface AdvancedDeal {
  id: string;
  dealNumber: string;
  name: string;
  stage: string;
  pipeline: string;
  value: string;
  probability: number;
  ownerId: string;
  owner?: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
  };
  accountId: string;
  account?: {
    id: string;
    name: string;
    country: string;
    industry: string;
  };
  contacts: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isPrimary: boolean;
  }>;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
  dealType: string;
  source: string;
  description: string;
  customFields: Record<string, any>;
  competitors: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  campaigns: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  lineItems: Array<{
    id: string;
    product: string;
    category: string;
    quantity: number;
    unitPrice: number;
    total: number;
    margin?: number;
  }>;
  stageHistory: Array<{
    id: string;
    fromStage: string;
    toStage: string;
    changedAt: string;
    changedBy: string;
    duration: number;
    notes?: string;
  }>;
  followers: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  riskFactors: Array<{
    type: string;
    level: 'low' | 'medium' | 'high';
    description: string;
    suggestedAction: string;
  }>;
}

// Component for editable fields with enhanced styling
const AdvancedEditableField: React.FC<{
  label: string;
  value: any;
  field: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'currency';
  options?: Array<{ value: string; label: string }>;
  onSave: (field: string, value: any) => void;
  required?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
}> = ({ 
  label, 
  value, 
  field, 
  type = 'text', 
  options = [],
  onSave,
  required = false,
  helpText,
  icon
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const validateField = (val: any) => {
    if (required && (!val || val.toString().trim() === '')) {
      setIsValid(false);
      return false;
    }
    if (type === 'email' && val && !/\S+@\S+\.\S+/.test(val)) {
      setIsValid(false);
      return false;
    }
    setIsValid(true);
    return true;
  };

  const handleSave = () => {
    if (validateField(editValue)) {
      onSave(field, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setIsValid(true);
  };

  const formatDisplayValue = () => {
    if (!value) return '-';
    switch (type) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'date':
        return format(new Date(value), 'MMM dd, yyyy');
      default:
        return value.toString();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center space-x-2">
          {type === 'select' ? (
            <select
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isValid ? 'border-gray-300' : 'border-red-300'
              }`}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              rows={3}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isValid ? 'border-gray-300' : 'border-red-300'
              }`}
            />
          ) : (
            <input
              type={type === 'currency' ? 'number' : type}
              value={editValue || ''}
              onChange={(e) => setEditValue(type === 'number' || type === 'currency' ? parseFloat(e.target.value) || 0 : e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isValid ? 'border-gray-300' : 'border-red-300'
              }`}
              step={type === 'currency' ? '0.01' : undefined}
            />
          )}
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {!isValid && (
          <p className="text-red-600 text-xs">
            {required && !editValue ? `${label} is required` : `Invalid ${label.toLowerCase()}`}
          </p>
        )}
        {helpText && (
          <p className="text-gray-500 text-xs">{helpText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center justify-between group">
        <span className="text-gray-900 flex-1">
          {formatDisplayValue()}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-blue-600 transition-all"
          title={`Edit ${label}`}
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
      {helpText && (
        <p className="text-gray-500 text-xs">{helpText}</p>
      )}
    </div>
  );
};

// Enhanced Progress Bar Component for Deal Stages with Modern UX
const DealProgressBar: React.FC<{
  currentStage: string;
  stages: Array<{ id: string; name: string; color: string }>;
  stageHistory: Array<any>;
  onStageClick: (stage: string) => void;
  dealValue?: number;
  probability?: number;
}> = ({ currentStage, stages, stageHistory, onStageClick, dealValue = 0, probability = 0 }) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const currentIndex = stages.findIndex(s => s.id === currentStage);
  const completionPercentage = ((currentIndex + 1) / stages.length) * 100;

  // Enhanced stage icons mapping
  const getStageIcon = (stage: { id: string; name: string; color: string }, isCompleted: boolean, isActive: boolean) => {
    if (stage.id === 'closed-won') {
      return <Trophy className="h-4 w-4" />;
    }
    if (stage.id === 'closed-lost') {
      return <X className="h-4 w-4" />;
    }
    if (isCompleted) {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (isActive) {
      return <Circle className="h-4 w-4 animate-pulse" />;
    }
    return <Circle className="h-4 w-4" />;
  };

  // Enhanced styling for different stage states
  const getStageButtonStyle = (stage: { id: string; name: string; color: string }, index: number) => {
    const isActive = stage.id === currentStage;
    const isCompleted = index < currentIndex;
    const isHovered = hoveredStage === stage.id;
    
    if (stage.id === 'closed-won' && isActive) {
      return 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-600 text-white shadow-lg shadow-green-200 scale-110';
    }
    if (stage.id === 'closed-lost' && isActive) {
      return 'bg-gradient-to-r from-red-500 to-rose-600 border-red-600 text-white shadow-lg shadow-red-200';
    }
    if (isActive) {
      return `bg-gradient-to-r from-${stage.color}-500 to-${stage.color}-600 border-${stage.color}-600 text-white shadow-lg shadow-${stage.color}-200 scale-105`;
    }
    if (isCompleted) {
      return 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-600 text-white shadow-md';
    }
    if (isHovered) {
      return 'bg-gray-100 border-gray-400 text-gray-700 scale-105';
    }
    return 'bg-white border-gray-300 text-gray-500 hover:border-gray-400';
  };

  // Connector line styling with gradients
  const getConnectorStyle = (index: number) => {
    if (index < currentIndex) {
      return 'bg-gradient-to-r from-green-500 to-emerald-600';
    }
    if (index === currentIndex) {
      return `bg-gradient-to-r from-green-500 to-${stages[currentIndex]?.color || 'blue'}-500`;
    }
    return 'bg-gray-300';
  };

  // Calculate days in current stage
  const daysInCurrentStage = stageHistory.length > 0 ? 
    Math.floor((Date.now() - new Date(stageHistory[stageHistory.length - 1]?.changedAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Trigger confetti effect for closed-won
  React.useEffect(() => {
    if (currentStage === 'closed-won') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 p-8 rounded-2xl shadow-lg border border-gray-200/50 mb-6 relative overflow-hidden backdrop-blur-sm">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      {/* Enhanced Confetti Effect for Closed Won */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            >
              <div className={`w-full h-full rounded-sm transform rotate-45 ${
                ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400'][Math.floor(Math.random() * 5)]
              }`}></div>
            </div>
          ))}
        </div>
      )}

      {/* Header with Enhanced Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Deal Progress
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Stage {currentIndex + 1} of {stages.length} • {completionPercentage.toFixed(0)}% Complete
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-blue-700 font-medium">
              ${dealValue.toLocaleString()}
            </span>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full">
            <span className="text-green-700 font-medium">
              {probability}% Win Rate
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative mb-6">
        {/* Connecting Lines Between Stages */}
        <div className="absolute top-10 left-12 right-12 flex items-center">
          {stages.slice(0, -1).map((_, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex - 1;
            
            return (
              <div
                key={`connector-${index}`}
                className="flex-1 relative mx-1"
              >
                <div className={`h-1 rounded-full transition-all duration-700 ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-200' 
                    : isActive
                      ? 'bg-gradient-to-r from-emerald-400 to-blue-400 shadow-sm shadow-blue-200'
                      : 'bg-gray-200'
                }`}>
                  {(isCompleted || isActive) && (
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Nodes */}
        <div className="flex justify-between items-start relative z-10">
          {stages.map((stage, index) => {
            const isActive = stage.id === currentStage;
            const isCompleted = index < currentIndex;
            const stageData = stageHistory.find(h => h.toStage === stage.id);
            const isHovered = hoveredStage === stage.id;
            
            return (
              <div 
                key={stage.id} 
                className="flex flex-col items-center flex-1 relative"
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                {/* Enhanced Tooltip */}
                {hoveredStage === stage.id && (
                  <div className="absolute bottom-full mb-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-3 rounded-xl text-xs whitespace-nowrap z-30 shadow-2xl border border-gray-700 animate-fadeIn">
                    <div className="font-semibold text-sm mb-1">{stage.name}</div>
                    {stageData && (
                      <div className="text-gray-300 text-xs">
                        <span className="text-gray-400">Entered:</span> {format(new Date(stageData.changedAt), 'MMM dd, yyyy')}
                      </div>
                    )}
                    {isActive && (
                      <div className="text-blue-300 text-xs mt-1">
                        <span className="text-gray-400">Duration:</span> {daysInCurrentStage} days
                      </div>
                    )}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                      <div className="border-8 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                )}

                {/* Enhanced Stage Node */}
                <div className="relative">
                  {/* Outer Glow Ring for Active Stage */}
                  {isActive && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-30 blur-md animate-pulse"></div>
                  )}
                  
                  <button
                    onClick={() => onStageClick(stage.id)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 transition-all duration-500 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-300 shadow-lg ${
                      isActive 
                        ? stage.id === 'closed-won'
                          ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 border-emerald-600 text-white shadow-xl shadow-emerald-300/50'
                          : stage.id === 'closed-lost'
                            ? 'bg-gradient-to-br from-red-400 via-rose-500 to-pink-600 border-rose-600 text-white shadow-xl shadow-rose-300/50'
                            : 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 border-blue-600 text-white shadow-xl shadow-blue-300/50'
                        : isCompleted 
                          ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-500 text-white shadow-md shadow-emerald-200/50' 
                          : isHovered
                            ? 'bg-gray-50 border-gray-400 text-gray-700 shadow-md'
                            : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400 hover:shadow-md'
                    }`}
                    aria-label={`${stage.name} stage`}
                    data-testid={`stage-button-${stage.id}`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {getStageIcon(stage, isCompleted, isActive)}
                    </span>
                    
                    {/* Inner Ring Animation for Active Stage */}
                    {isActive && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                        <div className="absolute inset-1 rounded-full bg-white/10 animate-pulse"></div>
                      </>
                    )}
                  </button>
                  
                  {/* Enhanced Completion Badge */}
                  {isCompleted && !isActive && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  
                  {/* Stage Number for Incomplete */}
                  {!isCompleted && !isActive && (
                    <div className="absolute inset-0 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Stage Label */}
                <div className="mt-4 text-center min-h-[3rem] flex flex-col justify-start">
                  <p className={`text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'text-gray-900 scale-110' 
                      : isCompleted
                        ? 'text-emerald-700'
                        : 'text-gray-500'
                  }`}>
                    {stage.name}
                  </p>
                  {stageData && (
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                      {format(new Date(stageData.changedAt), 'MMM dd')}
                    </p>
                  )}
                  {isActive && (
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-blue-600 font-semibold">
                        {daysInCurrentStage} days
                      </p>
                    </div>
                  )}
                  {!isActive && !isCompleted && (
                    <p className="text-xs text-gray-400 mt-1">Pending</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Metrics Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span>Avg: 12 days/stage</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>Current: {daysInCurrentStage} days</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-green-500" />
            <span>{completionPercentage.toFixed(0)}% Complete</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Last updated: {format(new Date(), 'MMM dd, HH:mm')}
        </div>
      </div>
    </div>
  );
};

const AdvancedDealDetailsPage: React.FC<AdvancedDealDetailsPageProps> = ({ dealId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'blocks' | 'timeline'>('blocks');
  
  const queryClient = useQueryClient();

  // Fetch deal data
  const { data: deal, isLoading } = useQuery({
    queryKey: ['/api/deals', dealId],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${dealId}`);
      if (!response.ok) throw new Error('Deal not found');
      return response.json();
    }
  });

  // Fetch related data
  const { data: activities = [] } = useQuery({
    queryKey: ['/api/deals', dealId, 'activities'],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${dealId}/activities`);
      if (!response.ok) return [];
      return response.json();
    }
  });

  const { data: account } = useQuery({
    queryKey: ['/api/accounts', deal?.accountId],
    queryFn: async () => {
      if (!deal?.accountId) return null;
      const response = await fetch(`/api/accounts/${deal.accountId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!deal?.accountId
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts', 'by-account', deal?.accountId],
    queryFn: async () => {
      if (!deal?.accountId) return [];
      const response = await fetch(`/api/contacts/by-account/${deal.accountId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!deal?.accountId
  });

  // Mutation for updating deal
  const updateDealMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: any }) => {
      const response = await apiRequest(`/api/deals/${dealId}`, {
        method: 'PATCH',
        body: JSON.stringify({ [field]: value }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals', dealId] });
    }
  });

  const handleFieldSave = (field: string, value: any) => {
    updateDealMutation.mutate({ field, value });
  };

  // Mock data for advanced features
  const stages = [
    { id: 'qualification', name: 'Qualification', color: 'blue' },
    { id: 'proposal', name: 'Proposal', color: 'purple' },
    { id: 'negotiation', name: 'Negotiation', color: 'orange' },
    { id: 'closed-won', name: 'Closed Won', color: 'green' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'red' }
  ];

  const mockLineItems = [
    { id: '1', product: 'Platform License', category: 'Software', quantity: 1, unitPrice: 50000, total: 50000, margin: 40 },
    { id: '2', product: 'Implementation', category: 'Services', quantity: 100, unitPrice: 150, total: 15000, margin: 60 },
    { id: '3', product: 'Training', category: 'Services', quantity: 20, unitPrice: 200, total: 4000, margin: 75 }
  ];

  const mockCompetitors = [
    { 
      name: 'Competitor A', 
      strengths: ['Lower price', 'Established brand'], 
      weaknesses: ['Poor support', 'Limited features'] 
    },
    { 
      name: 'Competitor B', 
      strengths: ['Feature rich'], 
      weaknesses: ['Complex setup', 'High maintenance'] 
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Deal Not Found</h2>
          <p className="text-gray-600 mb-4">The requested deal could not be found.</p>
          <Link href="/crm/deals">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Back to Deals
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/crm/deals">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{deal.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Deal #{deal.id.slice(0, 8)}</span>
                  <span>•</span>
                  <span>{account?.name}</span>
                  <span>•</span>
                  <span className="capitalize">{deal.stage?.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  ${Number(deal.value || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {deal.probability || 0}% probability
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isFollowing 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isFollowing ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  <span className="ml-1 hidden sm:inline">
                    {isFollowing ? 'Following' : 'Follow'}
                  </span>
                </button>
                
                <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Share2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="w-full px-0 py-0">
        <div className="flex gap-0">
          {/* Left Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white shadow-sm border-r border-gray-200 p-4 sticky top-0 h-screen overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Deal Functions</h3>
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview & Summary', icon: Eye, description: 'Deal details and progress' },
                  { id: 'activities', label: 'Activities', icon: Activity, description: 'Tasks, calls, emails' },
                  { id: 'communication', label: 'Communication', icon: MessageSquare, description: 'Messages and notes' },
                  { id: 'files', label: 'Files & Documents', icon: FileText, description: 'Attachments and contracts' },
                  { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3, description: 'Performance insights' }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-start space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 border border-blue-200 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          activeTab === tab.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {tab.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {tab.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 px-4 py-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Deal Progress Bar */}
                <DealProgressBar
                  currentStage={deal.stage}
                  stages={stages}
                  stageHistory={[]}
                  onStageClick={(stage) => handleFieldSave('stage', stage)}
                  dealValue={Number(deal.value || 0)}
                  probability={deal.probability || 0}
                />
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-0 pr-4">
                {/* Deal Summary Block */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                    Deal Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <AdvancedEditableField
                        label="Deal Name"
                        value={deal.name}
                        field="name"
                        required
                        icon={<FileText className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Pipeline/Stage"
                        value={deal.stage}
                        field="stage"
                        type="select"
                        options={stages.map(s => ({ value: s.id, label: s.name }))}
                        icon={<TrendingUp className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Deal Value"
                        value={deal.value}
                        field="value"
                        type="currency"
                        required
                        icon={<DollarSign className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <AdvancedEditableField
                        label="Probability"
                        value={deal.probability}
                        field="probability"
                        type="number"
                        helpText="Win probability as percentage (0-100)"
                        icon={<Target className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Expected Close Date"
                        value={deal.expectedCloseDate}
                        field="expectedCloseDate"
                        type="date"
                        required
                        icon={<Calendar className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <div className="space-y-1">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <User className="h-4 w-4 mr-2" />
                          Deal Owner
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {deal.owner?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{deal.owner?.name || 'Unassigned'}</p>
                            <p className="text-xs text-gray-500">{deal.owner?.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Account & Contacts */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Building className="h-4 w-4 mr-2" />
                          Account/Organization
                        </label>
                        <Link href={`/crm/accounts/${account?.id}`}>
                          <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <p className="font-medium text-blue-600">{account?.name}</p>
                            <p className="text-xs text-gray-500">{account?.industry} • {account?.country}</p>
                          </div>
                        </Link>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Users className="h-4 w-4 mr-2" />
                          Contacts ({contacts.length})
                        </label>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {contacts.slice(0, 3).map((contact: any) => (
                            <Link key={contact.id} href={`/crm/contacts/${contact.id}`}>
                              <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                  {contact.firstName?.[0]}{contact.lastName?.[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-blue-600">
                                    {contact.firstName} {contact.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">{contact.role}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                          {contacts.length > 3 && (
                            <p className="text-xs text-gray-500 text-center py-1">
                              +{contacts.length - 3} more contacts
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deal Classification Block */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-purple-600" />
                    Deal Classification
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <AdvancedEditableField
                        label="Deal Type"
                        value={deal.dealType || 'new-business'}
                        field="dealType"
                        type="select"
                        options={[
                          { value: 'new-business', label: 'New Business' },
                          { value: 'existing-customer', label: 'Existing Customer' },
                          { value: 'renewal', label: 'Renewal' },
                          { value: 'upsell', label: 'Upsell' },
                          { value: 'cross-sell', label: 'Cross-sell' }
                        ]}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Source"
                        value={deal.source || 'Direct'}
                        field="source"
                        type="select"
                        options={[
                          { value: 'direct', label: 'Direct' },
                          { value: 'referral', label: 'Referral' },
                          { value: 'marketing', label: 'Marketing Campaign' },
                          { value: 'cold-outreach', label: 'Cold Outreach' },
                          { value: 'trade-show', label: 'Trade Show' },
                          { value: 'partner', label: 'Partner' }
                        ]}
                        onSave={handleFieldSave}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <AdvancedEditableField
                        label="Description"
                        value={deal.description}
                        field="description"
                        type="textarea"
                        helpText="Brief description of the deal opportunity"
                        onSave={handleFieldSave}
                      />
                    </div>
                  </div>
                  
                  {/* Competitors Section */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <Flag className="h-4 w-4 mr-2" />
                      Competitive Intelligence
                    </h4>
                    
                    <div className="space-y-3">
                      {mockCompetitors.map((competitor, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <h5 className="font-medium text-gray-900 mb-2">{competitor.name}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm font-medium text-green-700 mb-2">Strengths:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {competitor.strengths.map((strength, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-red-700 mb-2">Weaknesses:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {competitor.weaknesses.map((weakness, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                        <Plus className="h-4 w-4 inline mr-2" />
                        Add Competitor
                      </button>
                    </div>
                  </div>
                </div>

                {/* Financials Block */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-600" />
                    Financials & Line Items
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product/Service
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Margin %
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockLineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.product}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.category}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${item.unitPrice.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${item.total.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.margin && item.margin > 50 ? 'bg-green-100 text-green-800' :
                                item.margin && item.margin > 30 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.margin}%
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={4} className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                            Total Deal Value:
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ${mockLineItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            Avg: {Math.round(mockLineItems.reduce((sum, item) => sum + (item.margin || 0), 0) / mockLineItems.length)}%
                          </td>
                          <td className="px-4 py-4"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="mt-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <Plus className="h-4 w-4 inline mr-2" />
                      Add Line Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-0 pl-2">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Quote
                    </button>
                  </div>
                </div>

                {/* Deal Health & Insights */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                    Deal Health
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Health</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">Healthy</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Engagement Score</span>
                        <span className="font-medium">85/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Activity Level</span>
                        <span className="font-medium">High</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">AI Insights</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-600">
                          High engagement from decision makers suggests strong buying intent.
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-600">
                          Consider scheduling a follow-up call within 3 days to maintain momentum.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Activities
                  </h3>
                  
                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity: any) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'email' ? 'bg-blue-100' :
                          activity.type === 'call' ? 'bg-green-100' :
                          activity.type === 'meeting' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          {activity.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                          {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600" />}
                          {activity.type === 'task' && <CheckSquare className="h-4 w-4 text-orange-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(activity.createdAt), 'MMM dd, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <Link href={`#activities`}>
                      <button 
                        onClick={() => setActiveTab('activities')}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
                      >
                        View All Activities →
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Linked Records */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2 text-gray-600" />
                    Linked Records
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Related Deals</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Enterprise Expansion</p>
                            <p className="text-xs text-gray-500">$75,000 • Negotiation</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Related Leads</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Department B Interest</p>
                            <p className="text-xs text-gray-500">Qualified • Same Account</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm">
                      <Plus className="h-4 w-4 inline mr-2" />
                      Link Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            {/* Activities Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Activities & Tasks
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    New Activity
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Activity Types Quick Add */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Call</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Email</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Meeting</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Task</span>
                </button>
              </div>

              {/* Activities Debug & Info */}
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Found {activities.length} activities for this deal. 
                  <Link href="/crm/activities">
                    <button className="ml-2 text-blue-600 hover:text-blue-700 underline">
                      View all activities in Activities Module →
                    </button>
                  </Link>
                </p>
              </div>

              {/* Activities Timeline */}
              <div className="space-y-3">
                {activities && activities.length > 0 ? (
                  activities.map((activity: any) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'email' ? 'bg-blue-100' :
                          activity.type === 'call' ? 'bg-green-100' :
                          activity.type === 'meeting' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          {activity.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                          {activity.type === 'call' && <Phone className="h-5 w-5 text-green-600" />}
                          {activity.type === 'meeting' && <Calendar className="h-5 w-5 text-purple-600" />}
                          {activity.type === 'task' && <CheckSquare className="h-5 w-5 text-orange-600" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {activity.subject}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                activity.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {activity.status === 'completed' ? 'Completed' :
                                 activity.status === 'in_progress' ? 'In Progress' : 
                                 activity.status || 'Open'}
                              </span>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {activity.description || 'No description'}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {activity.assignedTo || 'Unassigned'}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.createdAt ? format(new Date(activity.createdAt), 'MMM dd, yyyy - h:mm a') : 'No date'}
                            </span>
                            {activity.duration && (
                              <span className="flex items-center">
                                <Timer className="h-3 w-3 mr-1" />
                                {activity.duration} min
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium mb-2">No activities found</p>
                    <p className="text-sm">No activities have been created for this deal yet.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Create First Activity
                    </button>
                  </div>
                )}
              </div>

              {/* Load More */}
              <div className="mt-6 text-center">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Load More Activities
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="space-y-6">
            {/* Communication Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  Communication Timeline
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Compose Email
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Log Call
                  </button>
                </div>
              </div>

              {/* Communication Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-blue-600">Emails Sent</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-green-600">Calls Made</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-purple-600">Meetings</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">92%</div>
                  <div className="text-sm text-orange-600">Response Rate</div>
                </div>
              </div>

              {/* Communication Timeline */}
              <div className="space-y-6">
                {/* Email Communication */}
                <div className="border-l-4 border-blue-500 pl-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Email Thread: Proposal Discussion</h4>
                          <p className="text-sm text-gray-600">Last email: 2 hours ago</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Thread →
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white rounded p-3 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Sarah Johnson</span>
                          <span className="text-xs text-gray-500">Today, 2:30 PM</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Thank you for the updated proposal. The pricing looks good, but we'd like to discuss the implementation timeline. Can we schedule a call for tomorrow?"
                        </p>
                      </div>
                      <div className="bg-blue-100 rounded p-3 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">You</span>
                          <span className="text-xs text-blue-700">Today, 4:15 PM</span>
                        </div>
                        <p className="text-sm text-blue-800">
                          "Absolutely! I have availability tomorrow at 10 AM or 2 PM EST. Which works better for your team? I'll prepare some timeline options to discuss."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call Communication */}
                <div className="border-l-4 border-green-500 pl-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Discovery Call</h4>
                          <p className="text-sm text-gray-600">45 minutes • Yesterday, 3:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          View Notes →
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white rounded p-3 border border-green-200">
                        <h5 className="font-medium text-gray-900 mb-2">Key Discussion Points:</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Current pain points with existing solution</li>
                          <li>• Budget range: $50K - $75K</li>
                          <li>• Decision timeline: End of Q1</li>
                          <li>• 3 key stakeholders involved</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded p-3 border border-green-200">
                        <h5 className="font-medium text-gray-900 mb-2">Next Steps:</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Send technical requirements document</li>
                          <li>• Schedule demo with technical team</li>
                          <li>• Prepare initial proposal</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meeting Communication */}
                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Stakeholder Presentation</h4>
                          <p className="text-sm text-gray-600">Scheduled: Tomorrow, 10:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Upcoming</span>
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          Join Meeting →
                        </button>
                      </div>
                    </div>
                    <div className="bg-white rounded p-3 border border-purple-200">
                      <h5 className="font-medium text-gray-900 mb-2">Meeting Agenda:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Product demonstration (20 min)</li>
                        <li>• Implementation timeline review (15 min)</li>
                        <li>• Q&A with stakeholders (20 min)</li>
                        <li>• Next steps discussion (5 min)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            {/* Files Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Files & Documents
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </button>
                </div>
              </div>

              {/* File Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">24</div>
                  <div className="text-sm text-purple-600">Total Files</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">156 MB</div>
                  <div className="text-sm text-blue-600">Storage Used</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-green-600">Shared Files</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-orange-600">Recent Uploads</div>
                </div>
              </div>

              {/* File Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Proposals Folder */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <FolderOpen className="h-6 w-6 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Proposals</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-gray-900">Technical_Proposal_v3.pdf</span>
                      </div>
                      <span className="text-xs text-gray-500">2.4 MB</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-gray-900">Commercial_Proposal.pdf</span>
                      </div>
                      <span className="text-xs text-gray-500">1.8 MB</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-900">SOW_Draft.docx</span>
                      </div>
                      <span className="text-xs text-gray-500">856 KB</span>
                    </div>
                  </div>
                </div>

                {/* Contracts Folder */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <FolderOpen className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Contracts</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-900">MSA_Template.docx</span>
                      </div>
                      <span className="text-xs text-gray-500">1.2 MB</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-gray-900">NDA_Signed.pdf</span>
                      </div>
                      <span className="text-xs text-gray-500">543 KB</span>
                    </div>
                  </div>
                </div>

                {/* Presentations Folder */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <FolderOpen className="h-6 w-6 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Presentations</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-gray-900">Product_Demo.pptx</span>
                      </div>
                      <span className="text-xs text-gray-500">12.5 MB</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-gray-900">ROI_Analysis.pptx</span>
                      </div>
                      <span className="text-xs text-gray-500">8.7 MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Files */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recent Files</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Updated_Proposal_Final.pdf</p>
                        <p className="text-xs text-gray-500">Uploaded 2 hours ago • 3.2 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Meeting_Notes_Jan15.docx</p>
                        <p className="text-xs text-gray-500">Uploaded yesterday • 1.1 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                  Deal Analytics & Intelligence
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Deal Velocity</p>
                      <p className="text-2xl font-bold text-blue-700">23 days</p>
                      <p className="text-xs text-blue-600 mt-1">Avg time in pipeline</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Win Probability</p>
                      <p className="text-2xl font-bold text-green-700">78%</p>
                      <p className="text-xs text-green-600 mt-1">AI predicted</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Engagement Score</p>
                      <p className="text-2xl font-bold text-purple-700">8.7/10</p>
                      <p className="text-xs text-purple-600 mt-1">Stakeholder engagement</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Risk Score</p>
                      <p className="text-2xl font-bold text-orange-700">Low</p>
                      <p className="text-xs text-orange-600 mt-1">2.1/10 risk level</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Charts and Graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Activity Timeline Chart */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Activity Timeline
                  </h4>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Activity timeline visualization</p>
                      <p className="text-xs text-gray-400">Shows deal progression over time</p>
                    </div>
                  </div>
                </div>

                {/* Stakeholder Engagement */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Stakeholder Engagement
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">SJ</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                          <p className="text-xs text-gray-500">Decision Maker</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">High</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-purple-600">MR</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Mike Rodriguez</p>
                          <p className="text-xs text-gray-500">Technical Lead</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">Medium</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-600">LP</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Lisa Park</p>
                          <p className="text-xs text-gray-500">Finance Director</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-yellow-600">Low</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                  AI-Powered Insights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <h5 className="font-medium text-green-900 mb-1">Strong Buying Signals</h5>
                          <p className="text-sm text-green-700">
                            Increased engagement from decision makers and technical team involvement suggests high purchase intent.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <h5 className="font-medium text-blue-900 mb-1">Optimal Timing</h5>
                          <p className="text-sm text-blue-700">
                            Based on similar deals, now is the ideal time to present the final proposal and request commitment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <h5 className="font-medium text-yellow-900 mb-1">Action Recommended</h5>
                          <p className="text-sm text-yellow-700">
                            Schedule a follow-up call with finance director to address budget concerns and timeline questions.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <h5 className="font-medium text-purple-900 mb-1">Competitive Analysis</h5>
                          <p className="text-sm text-purple-700">
                            Monitor competitor activity. Consider highlighting unique value propositions in next presentation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDealDetailsPage;