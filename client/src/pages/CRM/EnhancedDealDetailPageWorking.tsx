import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, DollarSign, Calendar, User, Building, Phone, Mail, MessageSquare,
  FileText, Upload, Download, Edit3, Save, X, Plus, ChevronDown, ChevronUp,
  Activity, Clock, AlertTriangle, CheckCircle, Target, TrendingUp,
  Settings, Link2, Tag, Bell, Filter, Search, MoreHorizontal,
  ArrowRight, ArrowLeft, Maximize2, Minimize2, Eye, EyeOff,
  Users, Paperclip, Video, Shield, Zap, BarChart3
} from 'lucide-react';

// Enhanced Types
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

  // UI State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
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

  // Data fetching
  const { data: deal, isLoading: dealLoading } = useQuery({
    queryKey: ['/api/deals', dealId],
    enabled: !!dealId
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
    enabled: !!dealId
  });

  const { data: account } = useQuery({
    queryKey: ['/api/accounts', deal?.accountId],
    enabled: !!deal?.accountId
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
    enabled: !!dealId
  });

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
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${showFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Header with Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 truncate max-w-md">
                {(deal as any)?.name || 'Deal'}
              </h1>
              {getHealthBadge(dealScorecard.healthStatus)}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">${parseInt((deal as any)?.value || '0').toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Quick Actions */}
              <button 
                onClick={() => setShowFullScreen(!showFullScreen)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={showFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {showFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </button>
              
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                  isEditMode 
                    ? 'text-white bg-green-600 hover:bg-green-700' 
                    : 'text-white bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isEditMode ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditMode ? 'Save Changes' : 'Edit Deal'}
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'scorecard', label: 'Scorecard', icon: BarChart3 },
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'communications', label: 'Communications', icon: MessageSquare },
                { id: 'files', label: 'Files', icon: FileText },
                { id: 'related', label: 'Related', icon: Link2 },
                { id: 'automation', label: 'Workflows', icon: Zap }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Deal Information */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Deal Details Card */}
                  <CollapsibleCard 
                    title="Deal Information" 
                    icon={Target}
                    onToggle={() => toggleSection('deal-info')}
                    isCollapsed={isSectionCollapsed('deal-info')}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField label="Deal Name" value={(deal as any)?.name || ''} editable={isEditMode} />
                      <InfoField label="Account" value={account?.name || 'N/A'} />
                      <InfoField label="Value" value={`$${parseInt((deal as any)?.value || '0').toLocaleString()}`} editable={isEditMode} />
                      <InfoField label="Stage" value={(deal as any)?.stage || ''} editable={isEditMode} />
                      <InfoField label="Probability" value={`${(deal as any)?.probability || 0}%`} editable={isEditMode} />
                      <InfoField label="Expected Close" value={(deal as any)?.expectedCloseDate ? new Date((deal as any).expectedCloseDate).toLocaleDateString() : 'Not set'} editable={isEditMode} />
                    </div>
                  </CollapsibleCard>

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
                <div className="space-y-6">
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
              <FilesView 
                files={dealFiles}
                dealId={dealId || ''}
                searchTerm={searchTerms.files}
                onSearchChange={(term) => setSearchTerms(prev => ({ ...prev, files: term }))}
              />
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