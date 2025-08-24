import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivitiesSync } from '../../hooks/useActivitiesSync';
import ActivityLogModal from '../ActivityLogging/ActivityLogModal';
import FilesDocumentsSection from './FilesDocumentsSection';
import { 
  ArrowLeft, Edit2, Save, X, Plus, Mail, Phone, Globe, Building,
  Calendar, DollarSign, User, Target, Clock, FileText, Paperclip,
  Activity, Users, MessageSquare, Briefcase, TrendingUp, CheckCircle,
  CheckSquare, Eye, History, ChevronRight, ChevronLeft, Award, Zap, ChevronDown, ChevronUp,
  Upload, Download, Search, Filter, MoreVertical, Star, Flag,
  AlertTriangle, ThumbsUp, Send, Reply, Forward, Archive, Trash2,
  ExternalLink, Copy, Share2, Bell, BellOff, UserPlus, Settings,
  Maximize2, Minimize2, RefreshCw, BookOpen, Calculator, PieChart,
  BarChart3, LineChart, Camera, Video, Mic, AtSign, Hash, Link as LinkIcon,
  Tag, MoreHorizontal, Timer, FolderPlus, FolderOpen, Trophy, Check, Circle,
  ArrowUpDown, HelpCircle, UserCheck, FileCheck, Handshake, CheckCheck,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ContextualHelpBubble, DealStageHelp, FieldHelp } from '../AI/ContextualHelpSystem';
import { 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedTabContent, 
  StaggeredContainer, 
  AnimatedListItem,
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  tabTransition
} from './AnimatedDealComponents';

// Comprehensive list of countries for the searchable dropdown
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

interface AdvancedDealDetailsPageProps {
  dealId: string;
}

// Enhanced Deal interface with all required fields
// Helper function to render stage icon
const renderStageIcon = (stageId: string, className: string) => {
  switch (stageId) {
    case 'qualification':
      return <UserCheck className={className} />;
    case 'proposal':
      return <FileCheck className={className} />;
    case 'negotiation':
      return <Handshake className={className} />;
    case 'closed-won':
      return <Trophy className={className} />;
    case 'closed-lost':
      return <XCircle className={className} />;
    case 'prospecting':
      return <Target className={className} />;
    case 'demo':
      return <Eye className={className} />;
    case 'decision':
      return <CheckSquare className={className} />;
    case 'contract':
      return <FileText className={className} />;
    case 'implementation':
      return <Settings className={className} />;
    default:
      return <Target className={className} />;
  }
};

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
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'currency' | 'searchable-select';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setEditValue(value);
    if (type === 'searchable-select' && value) {
      setSearchTerm(value);
    }
  }, [value, type]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showDropdown && !target.closest('.searchable-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Filter options for searchable select
  const filteredOptions = type === 'searchable-select' 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10) // Limit to 10 results for performance
    : options;

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
          ) : type === 'searchable-select' ? (
            <div className="relative flex-1 searchable-dropdown">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  setShowDropdown(true);
                  if (!searchTerm && editValue) {
                    setSearchTerm(editValue);
                  }
                }}
                placeholder={`Search ${label.toLowerCase()}...`}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isValid ? 'border-gray-300' : 'border-red-300'
                }`}
              />
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setEditValue(option.value);
                          setSearchTerm(option.label);
                          setShowDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {option.label}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">No countries found</div>
                  )}
                </div>
              )}
            </div>
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
      <div className="relative group">
        <div
          onClick={() => setIsEditing(true)}
          className="w-full px-3 py-2 text-sm border border-transparent rounded-md bg-transparent cursor-pointer hover:border-gray-300 hover:bg-white hover:shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
          title={`Click to edit ${label}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-900 flex-1 min-h-[1.25rem]">
              {formatDisplayValue()}
            </span>
            <Edit2 className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
      {helpText && (
        <p className="text-gray-500 text-xs mt-1">{helpText}</p>
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
                  
                  {/* Stage Icon for Incomplete */}
                  {!isCompleted && !isActive && (
                    <div className="absolute inset-0 rounded-full flex items-center justify-center">
                      {renderStageIcon(stage.id, "h-5 w-5 text-gray-400")}
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

// Enhanced Deep AI Insights Panel with web intelligence
const DeepAIInsightsPanel: React.FC<{
  deal: any;
  account: any;
  activities: any[];
}> = ({ deal, account, activities }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState('tasks');

  useEffect(() => {
    const fetchDeepInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ai/deep-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deal,
            account,
            activities,
            context: 'comprehensive_analysis'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setInsights(data);
        }
      } catch (error) {
        console.error('Failed to fetch deep insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeepInsights();
  }, [deal?.id, account?.id]);

  const insightTabs = [
    { id: 'tasks', label: 'Action Items', icon: CheckSquare, color: 'blue' },
    { id: 'followup', label: 'Follow-ups', icon: Calendar, color: 'green' },
    { id: 'company', label: 'Company Intel', icon: Building, color: 'purple' },
    { id: 'trends', label: 'Market Trends', icon: TrendingUp, color: 'orange' },
    { id: 'risks', label: 'Risk Analysis', icon: AlertTriangle, color: 'red' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-sm text-gray-600">Analyzing deal intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Insight Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
        {insightTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveInsightTab(tab.id)}
              className={`flex-none flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeInsightTab === tab.id
                  ? `bg-${tab.color}-600 text-white`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-3 w-3 mr-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Action Items Tab */}
      {activeInsightTab === 'tasks' && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-3 flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" />
            Recommended Action Items
          </h5>
          <div className="space-y-2">
            <div className="flex items-start space-x-3 p-2 bg-white rounded border border-blue-200">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Send follow-up proposal</p>
                <p className="text-xs text-gray-600">Due in 2 days • High priority</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-xs">Create Task</button>
            </div>
            <div className="flex items-start space-x-3 p-2 bg-white rounded border border-blue-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Schedule stakeholder demo</p>
                <p className="text-xs text-gray-600">Optimal timing: Next week • Medium priority</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-xs">Schedule</button>
            </div>
            <div className="flex items-start space-x-3 p-2 bg-white rounded border border-blue-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Prepare competitive analysis</p>
                <p className="text-xs text-gray-600">Based on recent competitor activity • Low priority</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-xs">Research</button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-ups Tab */}
      {activeInsightTab === 'followup' && (
        <div className="bg-green-50 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Strategic Follow-up Plan
          </h5>
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Check-in Call</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Tomorrow</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Follow up on proposal feedback and address any concerns raised in last meeting.
              </p>
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-700">15-min call with Sarah Johnson</span>
              </div>
            </div>
            <div className="bg-white rounded p-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Contract Review</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Next Week</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Schedule legal review meeting with procurement team.
              </p>
              <div className="flex items-center space-x-2">
                <Users className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-700">Meeting with legal & procurement</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Intelligence Tab */}
      {activeInsightTab === 'company' && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h5 className="font-medium text-purple-900 mb-3 flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Company Intelligence
          </h5>
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-purple-200">
              <h6 className="text-sm font-medium text-gray-900 mb-2">Recent News & Updates</h6>
              <div className="space-y-2">
                <div className="text-xs text-gray-600 border-l-2 border-purple-300 pl-2">
                  <span className="font-medium">Q4 Earnings Beat:</span> {account?.name || 'TechCorp'} reported 15% revenue growth
                  <span className="text-purple-600 ml-1">2 days ago</span>
                </div>
                <div className="text-xs text-gray-600 border-l-2 border-purple-300 pl-2">
                  <span className="font-medium">New Funding Round:</span> Secured $50M Series B for expansion
                  <span className="text-purple-600 ml-1">1 week ago</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded p-3 border border-purple-200">
              <h6 className="text-sm font-medium text-gray-900 mb-2">Financial Health</h6>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">8.5/10</div>
                  <div className="text-xs text-gray-600">Credit Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">+15%</div>
                  <div className="text-xs text-gray-600">Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Trends Tab */}
      {activeInsightTab === 'trends' && (
        <div className="bg-orange-50 rounded-lg p-4">
          <h5 className="font-medium text-orange-900 mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Market Trends & Opportunities
          </h5>
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Industry Growth</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">+23% YoY</span>
              </div>
              <p className="text-xs text-gray-600">
                The automation software market is experiencing rapid growth, creating urgency for digital transformation.
              </p>
            </div>
            <div className="bg-white rounded p-3 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Competitive Landscape</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Advantage</span>
              </div>
              <p className="text-xs text-gray-600">
                Your solution's unique AI capabilities position well against traditional competitors.
              </p>
            </div>
            <div className="bg-white rounded p-3 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Timing Analysis</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Optimal</span>
              </div>
              <p className="text-xs text-gray-600">
                Q1 budget cycles align perfectly with client's decision timeline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Analysis Tab */}
      {activeInsightTab === 'risks' && (
        <div className="bg-red-50 rounded-lg p-4">
          <h5 className="font-medium text-red-900 mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Risk Assessment & Mitigation
          </h5>
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Budget Constraints</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium Risk</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Client mentioned budget review process could delay decision.
              </p>
              <div className="text-xs text-red-700">
                <span className="font-medium">Mitigation:</span> Offer flexible payment terms and ROI analysis
              </div>
            </div>
            <div className="bg-white rounded p-3 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Competition</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High Risk</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Competitor A has been aggressively pursuing this account.
              </p>
              <div className="text-xs text-red-700">
                <span className="font-medium">Mitigation:</span> Accelerate demo schedule and emphasize unique value
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex space-x-2 pt-2 border-t border-gray-200">
        <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
          Generate Action Plan
        </button>
        <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-50 transition-colors">
          Export Insights
        </button>
      </div>
    </div>
  );
};

const AdvancedDealDetailsPage: React.FC<AdvancedDealDetailsPageProps> = ({ dealId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeActivityTab, setActiveActivityTab] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'blocks' | 'timeline'>('blocks');
  const [expandedInsights, setExpandedInsights] = useState(true);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const queryClient = useQueryClient();

  // Use shared activities sync hook for real-time synchronization across modules
  const { createActivity: createActivityMutation } = useActivitiesSync();

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
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sticky Header */}
      <motion.div 
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/crm/deals">
                <motion.button 
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{deal.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Deal #{deal.id ? deal.id.slice(0, 8) : 'N/A'}</span>
                  <span>•</span>
                  <span>{account?.name}</span>
                  <span>•</span>
                  <span className="capitalize">{deal.stage && typeof deal.stage === 'string' ? deal.stage.replace('-', ' ') : deal.stage || 'N/A'}</span>
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
      </motion.div>

      {/* Main Content with Sidebar */}
      <div className="w-full px-0 py-0">
        <div className="flex gap-0">
          {/* Left Sidebar Navigation */}
          <div className={`${isSidebarCollapsed ? 'w-12' : 'w-48'} flex-shrink-0 transition-all duration-300 ml-0.5`}>
            <div className="bg-white shadow-sm border-r border-gray-200 p-2 sticky top-0 h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                {!isSidebarCollapsed && (
                  <h3 className="text-sm font-semibold text-gray-900">Deal Functions</h3>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <StaggeredContainer className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview & Summary', icon: Eye, description: 'Deal details and progress' },
                  { id: 'activities', label: 'Activities', icon: Activity, description: 'Tasks, calls, emails' },
                  { id: 'communication', label: 'Communication', icon: MessageSquare, description: 'Messages and notes' },
                  { id: 'files', label: 'Files & Documents', icon: FileText, description: 'Attachments and contracts' },
                  { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3, description: 'Performance insights' }
                ].map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <AnimatedListItem
                      key={tab.id}
                      className={`w-full flex items-start ${isSidebarCollapsed ? 'justify-center px-1' : 'space-x-2 px-2'} py-2 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-blue-50 border border-blue-200 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      index={index}
                    >
                      <div 
                        onClick={() => setActiveTab(tab.id)} 
                        className={`w-full flex items-start ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}
                        title={isSidebarCollapsed ? tab.label : ''}
                      >
                      <Icon className={`h-4 w-4 ${isSidebarCollapsed ? '' : 'mt-0.5'} flex-shrink-0 ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      {!isSidebarCollapsed && (
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
                      )}
                      </div>
                    </AnimatedListItem>
                  );
                })}
              </StaggeredContainer>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 px-2 py-4">
            <div>
              {activeTab === 'overview' && (
              <AnimatedTabContent tabKey="overview" isActive={true}>
                <div className="space-y-4">
                {/* Deal Progress Bar with AI Help */}
                <div className="relative">
                  <div className="absolute top-2 right-2 z-20">
                    <DealStageHelp 
                      stage={deal.stage}
                      dealValue={Number(deal.value || 0)}
                    />
                  </div>
                  <DealProgressBar
                    currentStage={deal.stage}
                    stages={stages}
                    stageHistory={[]}
                    onStageClick={(stage) => handleFieldSave('stage', stage)}
                    dealValue={Number(deal.value || 0)}
                    probability={deal.probability || 0}
                  />
                </div>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              {/* Left Column - 4/6 width */}
              <div className="lg:col-span-4 space-y-0">
                {/* Deal Summary Block */}
                <AnimatedCard 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  hoverable={true}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                      Deal Summary
                    </h3>
                    <ContextualHelpBubble
                      trigger={<HelpCircle className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors" />}
                      context={{
                        page: 'deals',
                        section: 'deal_summary',
                        dealStage: deal.stage,
                        dealValue: Number(deal.value || 0),
                        currentData: { dealName: deal.name, pipeline: deal.pipeline }
                      }}
                      variant="info"
                      placement="left"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                    {/* Left Column - Takes 2 parts */}
                    <div className="md:col-span-2 space-y-4">
                      <AdvancedEditableField
                        label="Deal Name"
                        value={deal.name}
                        field="name"
                        required
                        icon={<FileText className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Deal Number</label>
                        <input
                          type="text"
                          value={`Deal-${deal.id ? deal.id.slice(-4).toUpperCase() : 'N/A'}`}
                          disabled
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      
                      <AdvancedEditableField
                        label="Pipeline"
                        value={deal.pipeline || 'MediaTech'}
                        field="pipeline"
                        type="select"
                        options={[
                          { value: 'MediaTech', label: 'MediaTech' },
                          { value: 'Sales Pipeline', label: 'Sales Pipeline' },
                          { value: 'Marketing Pipeline', label: 'Marketing Pipeline' }
                        ]}
                        icon={<TrendingUp className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Deal Type"
                        value={deal.dealType || 'Mediatech - Fixed Subscription'}
                        field="dealType"
                        type="select"
                        options={[
                          { value: 'Mediatech - Fixed Subscription', label: 'Mediatech - Fixed Subscription' },
                          { value: 'new-business', label: 'New Business' },
                          { value: 'existing-customer', label: 'Existing Customer' },
                          { value: 'renewal', label: 'Renewal' }
                        ]}
                        icon={<Tag className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Account Name"
                        value={account?.name || 'FC Media'}
                        field="accountName"
                        icon={<Building className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Contact Name"
                        value={contacts.length > 0 ? `${contacts[0].firstName} ${contacts[0].lastName}` : ''}
                        field="contactName"
                        icon={<Users className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Deal Owner"
                        value={deal.owner?.name || deal.ownerId || 'Venkatraj Radhakrishnan'}
                        field="dealOwner"
                        icon={<User className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Created By"
                        value={deal.createdBy || 'Venkatraj Radhakrishnan'}
                        field="createdBy"
                        icon={<User className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                    </div>
                    
                    {/* Right Column - Takes rightmost 2 parts, offset by 1 for gap */}
                    <div className="md:col-span-2 md:col-start-4 space-y-4">
                      <div className="relative">
                        <AdvancedEditableField
                          label="Closing Date"
                          value={deal.closeDate ? format(new Date(deal.closeDate), 'MMM dd, yyyy') : 'Aug 29, 2025'}
                          field="closeDate"
                          type="date"
                          icon={<Calendar className="h-4 w-4" />}
                          onSave={handleFieldSave}
                        />
                        <div className="absolute top-0 right-0">
                          <FieldHelp 
                            fieldName="closeDate" 
                            currentValue={deal.closeDate}
                          />
                        </div>
                      </div>
                      
                      <AdvancedEditableField
                        label="Stage"
                        value={deal.stage || '2 - Pitch'}
                        field="stage"
                        type="select"
                        options={[
                          { value: '1 - Prospecting', label: '1 - Prospecting' },
                          { value: '2 - Pitch', label: '2 - Pitch' },
                          { value: '3 - Proposal', label: '3 - Proposal' },
                          { value: '4 - Negotiation', label: '4 - Negotiation' },
                          { value: '5 - Closed Won', label: '5 - Closed Won' }
                        ]}
                        icon={<TrendingUp className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <div className="relative">
                        <AdvancedEditableField
                          label="Probability (%)"
                          value={deal.probability || '20'}
                          field="probability"
                          type="number"
                          icon={<Target className="h-4 w-4" />}
                          onSave={handleFieldSave}
                        />
                        <div className="absolute top-0 right-0">
                          <FieldHelp 
                            fieldName="probability" 
                            currentValue={deal.probability}
                          />
                        </div>
                      </div>
                      
                      <AdvancedEditableField
                        label="Country of Origin"
                        value={account?.country || 'Morocco'}
                        field="countryOfOrigin"
                        type="searchable-select"
                        options={COUNTRIES.map(country => ({ value: country, label: country }))}
                        icon={<Globe className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <div className="relative">
                        <AdvancedEditableField
                          label="Amount"
                          value={deal.value || '100000.00'}
                          field="value"
                          type="currency"
                          icon={<DollarSign className="h-4 w-4" />}
                          onSave={handleFieldSave}
                        />
                        <div className="absolute top-0 right-0">
                          <FieldHelp 
                            fieldName="amount" 
                            currentValue={deal.value}
                          />
                        </div>
                      </div>
                      
                      <AdvancedEditableField
                        label="Currency"
                        value={deal.currency || 'USD'}
                        field="currency"
                        type="select"
                        options={[
                          { value: 'USD', label: 'USD' },
                          { value: 'EUR', label: 'EUR' },
                          { value: 'GBP', label: 'GBP' },
                          { value: 'CAD', label: 'CAD' }
                        ]}
                        icon={<DollarSign className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                      
                      <AdvancedEditableField
                        label="Exchange Rate"
                        value="1"
                        field="exchangeRate"
                        type="number"
                        icon={<Calculator className="h-4 w-4" />}
                        onSave={handleFieldSave}
                      />
                    </div>
                  </div>
                  
                  {/* Expected Revenue - Full Width */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Expected Revenue Calculation</label>
                        <div className="text-sm text-gray-600">
                          {deal.probability || 20}% probability × ${Number(deal.value || 100000).toLocaleString()} amount
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Expected Revenue</label>
                        <div className="text-xl font-bold text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                          ${((Number(deal.value || 100000)) * (Number(deal.probability || 20)) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  

                  
                  {/* Account & Contact Name (moved to main grid) - handled in main deal summary above */}
                </AnimatedCard>

                {/* Deal Classification Block */}
                <AnimatedCard className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" hoverable={true}>
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
                </AnimatedCard>

                {/* Financials Block */}
                <AnimatedCard className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" hoverable={true}>
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
                </AnimatedCard>
              </div>

              {/* Right Column - 2/6 width */}
              <div className="lg:col-span-2 space-y-0 pl-1">
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
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">AI Insights & Intelligence</h4>
                      <button 
                        onClick={() => setExpandedInsights(!expandedInsights)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        {expandedInsights ? 'Show Less' : 'Show More'}
                        <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${expandedInsights ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    {/* Compact Insights */}
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

                    {/* Expanded AI Insights */}
                    {expandedInsights && (
                      <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                        <DeepAIInsightsPanel deal={deal} account={account} activities={activities} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      Recent Activities
                    </h3>
                    <ContextualHelpBubble
                      trigger={<HelpCircle className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors" />}
                      context={{
                        page: 'deals',
                        section: 'activities',
                        dealStage: deal.stage,
                        dealValue: Number(deal.value || 0),
                        currentData: { activitiesCount: activities.length }
                      }}
                      variant="tip"
                      placement="left"
                    />
                  </div>
                  
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
        </AnimatedTabContent>
      )}
      
      {activeTab === 'activities' && (
        <AnimatedTabContent tabKey="activities" isActive={true}>
          <div className="space-y-0">
            {/* Activities Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      Activities
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setIsActivityModalOpen(true)}
                        className="text-white text-sm px-3 py-1 rounded transition-colors hover:scale-105 active:scale-95 transition-all duration-200 bg-blue-600 hover:bg-blue-700"
                        data-testid="button-log-activity"
                      >
                        + Log Activity
                      </button>
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl p-4">
                  {/* Activity Tabs */}
                  <div className="flex space-x-4 mb-4 border-b border-gray-200">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'email', label: 'Emails' },
                      { key: 'call', label: 'Calls' },
                      { key: 'meeting', label: 'Meetings' },
                      { key: 'task', label: 'Tasks' },
                      { key: 'note', label: 'Notes' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveActivityTab(tab.key as any)}
                        className={`pb-2 border-b-2 transition-colors text-sm ${
                          activeActivityTab === tab.key
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                        data-testid={`activity-tab-${tab.key}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Activities Content */}
                  <div className="space-y-4">
                    {(() => {
                      // Filter activities for this specific deal
                      const dealActivities = activities
                        .filter((activity: any) => activity.dealId === deal.id)
                        .map((activity: any) => ({
                          id: activity.id,
                          type: activity.type,
                          title: activity.subject || activity.emailSubject || 'Untitled Activity',
                          description: activity.description || activity.outcome || '',
                          timestamp: format(new Date(activity.createdAt), 'MMM dd, h:mm a'),
                          person: activity.assignedTo || activity.createdBy || 'Unknown',
                          status: activity.status,
                          scheduledAt: activity.scheduledAt,
                          completedAt: activity.completedAt,
                          priority: activity.priority || 'medium',
                          rawActivity: activity
                        }))
                        .sort((a: any, b: any) => new Date(b.rawActivity.createdAt).getTime() - new Date(a.rawActivity.createdAt).getTime());

                      // Filter by active tab
                      const filteredActivities = activeActivityTab === 'all' 
                        ? dealActivities 
                        : dealActivities.filter((activity: any) => activity.type === activeActivityTab);

                      if (filteredActivities.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                              {activeActivityTab === 'all' ? (
                                <Activity className="h-12 w-12 mx-auto" />
                              ) : activeActivityTab === 'email' ? (
                                <Mail className="h-12 w-12 mx-auto" />
                              ) : activeActivityTab === 'call' ? (
                                <Phone className="h-12 w-12 mx-auto" />
                              ) : activeActivityTab === 'meeting' ? (
                                <Calendar className="h-12 w-12 mx-auto" />
                              ) : activeActivityTab === 'task' ? (
                                <CheckSquare className="h-12 w-12 mx-auto" />
                              ) : (
                                <FileText className="h-12 w-12 mx-auto" />
                              )}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No {activeActivityTab === 'all' ? 'Activities' : activeActivityTab + 's'} Found
                            </h3>
                            <p className="text-gray-500 mb-4">
                              {activeActivityTab === 'all' 
                                ? 'No activities have been recorded for this deal yet.' 
                                : `No ${activeActivityTab} activities found for this deal.`}
                            </p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                              + Create {activeActivityTab === 'all' ? 'Activity' : activeActivityTab.charAt(0).toUpperCase() + activeActivityTab.slice(1)}
                            </button>
                          </div>
                        );
                      }

                      // Group activities by status (upcoming vs completed)
                      const upcomingActivities = filteredActivities.filter((activity: any) => 
                        activity.status === 'open' || 
                        activity.status === 'planned' || 
                        activity.status === 'in_progress' ||
                        (activity.scheduledAt && new Date(activity.scheduledAt) > new Date())
                      );

                      const completedActivities = filteredActivities.filter((activity: any) => 
                        activity.status === 'completed' || activity.completedAt
                      );

                      return (
                        <div className="space-y-6">
                          {/* Upcoming Activities */}
                          {upcomingActivities.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="text-gray-900 font-medium">Upcoming Activities</div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {upcomingActivities.length}
                                </span>
                              </div>

                              <div className="space-y-3">
                                {upcomingActivities.map((activity: any) => (
                                  <div key={activity.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start space-x-4">
                                      {/* Activity Icon */}
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                                        activity.type === 'call' ? 'bg-green-100 text-green-600' :
                                        activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                                        activity.type === 'task' ? 'bg-orange-100 text-orange-600' :
                                        'bg-gray-100 text-gray-600'
                                      }`}>
                                        {activity.type === 'email' && <Mail className="h-5 w-5" />}
                                        {activity.type === 'call' && <Phone className="h-5 w-5" />}
                                        {activity.type === 'meeting' && <Calendar className="h-5 w-5" />}
                                        {activity.type === 'task' && <CheckSquare className="h-5 w-5" />}
                                        {activity.type === 'note' && <FileText className="h-5 w-5" />}
                                      </div>

                                      {/* Activity Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                          <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {activity.title}
                                          </h4>
                                          <div className="flex items-center space-x-2">
                                            {activity.priority === 'high' && (
                                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                                High Priority
                                              </span>
                                            )}
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                              activity.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                              activity.status === 'planned' ? 'bg-purple-100 text-purple-800' :
                                              'bg-yellow-100 text-yellow-800'
                                            }`}>
                                              {activity.status === 'in_progress' ? 'In Progress' : 
                                               activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        {activity.description && (
                                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                            {activity.description}
                                          </p>
                                        )}
                                        
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>Due: {activity.scheduledAt ? format(new Date(activity.scheduledAt), 'MMM dd, h:mm a') : activity.timestamp}</span>
                                            <span>•</span>
                                            <span>Assigned: {activity.person}</span>
                                          </div>
                                          
                                          <div className="flex items-center space-x-2">
                                            <button className="text-blue-600 hover:text-blue-800 text-xs">
                                              View
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 text-xs">
                                              Edit
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Completed Activities */}
                          {completedActivities.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="text-gray-900 font-medium">Recent Activity History</div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {completedActivities.length}
                                </span>
                              </div>

                              <div className="space-y-3">
                                {completedActivities.slice(0, 10).map((activity: any) => (
                                  <div key={activity.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-start space-x-4">
                                      {/* Activity Icon */}
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 opacity-75 ${
                                        activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                                        activity.type === 'call' ? 'bg-green-100 text-green-600' :
                                        activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                                        activity.type === 'task' ? 'bg-orange-100 text-orange-600' :
                                        'bg-gray-100 text-gray-600'
                                      }`}>
                                        {activity.type === 'email' && <Mail className="h-4 w-4" />}
                                        {activity.type === 'call' && <Phone className="h-4 w-4" />}
                                        {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                                        {activity.type === 'task' && <CheckSquare className="h-4 w-4" />}
                                        {activity.type === 'note' && <FileText className="h-4 w-4" />}
                                      </div>

                                      {/* Activity Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                          <h4 className="text-sm font-medium text-gray-700 truncate">
                                            {activity.title}
                                          </h4>
                                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                            Completed
                                          </span>
                                        </div>
                                        
                                        {activity.description && (
                                          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                                            {activity.description}
                                          </p>
                                        )}
                                        
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>Completed: {activity.completedAt ? format(new Date(activity.completedAt), 'MMM dd, h:mm a') : activity.timestamp}</span>
                                            <span>•</span>
                                            <span>By: {activity.person}</span>
                                          </div>
                                          
                                          <div className="flex items-center space-x-2">
                                            <button className="text-blue-600 hover:text-blue-800 text-xs">
                                              View
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedTabContent>
      )}
      
      {activeTab === 'communication' && (
        <AnimatedTabContent tabKey="communication" isActive={true}>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                Communication Tab Content
              </h3>
              <p>Communication content will be implemented here...</p>
            </div>
          </div>
        </AnimatedTabContent>
      )}
      
      {activeTab === 'files' && (
        <AnimatedTabContent tabKey="files" isActive={true}>
          <FilesDocumentsSection dealId={deal?.id || dealId} />
        </AnimatedTabContent>
      )}
      
      {activeTab === 'analytics' && (
        <AnimatedTabContent tabKey="analytics" isActive={true}>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
                Analytics & Reports Tab Content
              </h3>
              <p>Analytics content will be implemented here...</p>
            </div>
          </div>
        </AnimatedTabContent>
      )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        dealId={deal?.id}
        dealTitle={deal?.title}
      />
    </motion.div>
  );
};

export default AdvancedDealDetailsPage;
