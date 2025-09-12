import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Archive, Mail, Phone, Video, MessageSquare,
  User, Building, Calendar, DollarSign, Target, Star, TrendingUp,
  Activity, Clock, Globe, MapPin, Tag, FileText, Paperclip, Settings,
  MoreHorizontal, CheckCircle, AlertCircle, Zap, Bot, Lightbulb,
  Users, Send, Plus, Eye, Share, Copy, Download, Flag, Shield,
  Briefcase, Award, ChevronDown, ChevronRight, X, Save, RefreshCw,
  ExternalLink, Heart, ThumbsUp, MessageCircle, Linkedin, Twitter
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { aiEngine } from '../../utils/aiEngine';

interface LeadDetailPageProps {
  leadId?: string;
}

interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'sms';
  subject: string;
  description?: string;
  timestamp: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  outcome?: string;
  duration?: number;
  createdBy: string;
}

interface AIInsight {
  type: 'next-action' | 'similar-leads' | 'risk-alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  actionItems: string[];
  priority: 'low' | 'medium' | 'high';
}

const LeadDetailPage: React.FC<LeadDetailPageProps> = ({ leadId: propLeadId }) => {
  const { id: paramLeadId } = useParams();
  const navigate = useNavigate();
  const { leads, employees, companies, updateLead, deleteLead } = useData();
  
  const leadId = propLeadId || paramLeadId;
  const lead = leads.find(l => l.id === leadId);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'analytics' | 'history'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState<Record<string, any>>({});
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic', 'qualification', 'ai-insights'])
  );

  // Mock data for demonstration
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'email',
      subject: 'Initial outreach email sent',
      description: 'Sent introduction email with company overview and value proposition',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'completed',
      outcome: 'Email opened, no reply yet',
      createdBy: 'John Smith'
    },
    {
      id: '2',
      type: 'call',
      subject: 'Discovery call scheduled',
      description: 'Scheduled 30-minute discovery call to understand requirements',
      timestamp: '2024-01-22T14:00:00Z',
      status: 'scheduled',
      duration: 30,
      createdBy: 'John Smith'
    }
  ]);

  const [aiInsights] = useState<AIInsight[]>([
    {
      type: 'next-action',
      title: 'Schedule Follow-up Call',
      description: 'Lead has high engagement score and visited pricing page 3 times',
      confidence: 0.87,
      actionItems: [
        'Schedule discovery call within 2 days',
        'Prepare custom demo based on their industry',
        'Send case study from similar customer'
      ],
      priority: 'high'
    },
    {
      type: 'similar-leads',
      title: 'Similar High-Converting Leads',
      description: 'Found 3 similar leads that converted with avg deal size of $75K',
      confidence: 0.92,
      actionItems: [
        'Review successful conversion strategies',
        'Use similar messaging and positioning',
        'Consider same pricing approach'
      ],
      priority: 'medium'
    },
    {
      type: 'opportunity',
      title: 'Expansion Opportunity',
      description: 'Company is growing rapidly and may need enterprise solution',
      confidence: 0.78,
      actionItems: [
        'Research recent company growth',
        'Identify additional stakeholders',
        'Prepare enterprise-level proposal'
      ],
      priority: 'medium'
    }
  ]);

  useEffect(() => {
    if (lead) {
      setEditableFields({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position,
        industry: lead.industry,
        stage: lead.stage,
        score: lead.score,
        value: lead.value,
        probability: lead.probability,
        source: lead.source,
        assignedTo: lead.assignedTo,
        status: lead.status,
        notes: lead.notes || '',
        tags: lead.tags || []
      });
    }
  }, [lead]);

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead Not Found</h2>
          <button
            onClick={() => navigate('/crm/leads')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  const aiScore = aiEngine.scoreLeadFit(lead);
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Unassigned';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStageColor = (stage: string) => {
    const colors = {
      new: 'bg-gray-100 text-gray-800 border-gray-300',
      contacted: 'bg-blue-100 text-blue-800 border-blue-300',
      qualified: 'bg-green-100 text-green-800 border-green-300',
      proposal: 'bg-purple-100 text-purple-800 border-purple-300',
      won: 'bg-green-100 text-green-800 border-green-300',
      lost: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      call: Phone,
      email: Mail,
      meeting: Video,
      note: FileText,
      task: CheckCircle,
      sms: MessageSquare
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getActivityColor = (type: string) => {
    const colors = {
      call: 'text-blue-600 bg-blue-100 border-blue-200',
      email: 'text-green-600 bg-green-100 border-green-200',
      meeting: 'text-purple-600 bg-purple-100 border-purple-200',
      note: 'text-gray-600 bg-gray-100 border-gray-200',
      task: 'text-orange-600 bg-orange-100 border-orange-200',
      sms: 'text-indigo-600 bg-indigo-100 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleFieldEdit = (field: string, value: any) => {
    setEditableFields(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    updateLead(lead.id, editableFields);
    setIsEditing(false);
  };

  const handleConvertToDeal = () => {
    // TODO: Integrate with deal creation
    console.log('Converting lead to deal:', lead.id);
    setShowConvertModal(false);
  };

  const renderCollapsibleSection = (
    id: string,
    title: string,
    icon: React.ElementType,
    children: React.ReactNode,
    actions?: React.ReactNode
  ) => {
    const Icon = icon;
    const isExpanded = expandedSections.has(id);

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(id)}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center space-x-3">
            {actions}
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

  const renderInlineEditField = (
    field: string,
    label: string,
    type: 'text' | 'number' | 'select' | 'textarea' = 'text',
    options?: string[],
    className?: string
  ) => {
    const value = editableFields[field];
    
    if (isEditing) {
      if (type === 'select') {
        return (
          <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <select
              value={value || ''}
              onChange={(e) => handleFieldEdit(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      }
      
      if (type === 'textarea') {
        return (
          <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <textarea
              value={value || ''}
              onChange={(e) => handleFieldEdit(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        );
      }
      
      return (
        <div className={className}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <input
            type={type}
            value={value || ''}
            onChange={(e) => handleFieldEdit(field, type === 'number' ? Number(e.target.value) : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <p className="text-lg font-medium text-gray-900">
          {type === 'number' && field === 'value' ? `$${(value || 0).toLocaleString()}` : value || '-'}
        </p>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User, count: null },
    { id: 'activities', name: 'Activities', icon: Activity, count: activities.length },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, count: null },
    { id: 'history', name: 'History', icon: Clock, count: 5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/crm/leads')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {lead.name.split(' ').map(n => n.charAt(0)).join('')}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(lead.stage)}`}>
                      {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(lead.score)}`}>
                        Score: {lead.score}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(aiScore)}`}>
                        AI: {aiScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {lead.company}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {lead.position}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${lead.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConvertModal(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm hover:from-green-600 hover:to-green-700 transition-all shadow-md"
              >
                <Target className="h-4 w-4 mr-2" />
                Convert to Deal
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Lead
                  </>
                )}
              </button>
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </button>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
              <Video className="h-4 w-4 mr-2" />
              Schedule Meeting
            </button>
            <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add to Sequence
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-6 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center pb-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Basic Information */}
                {renderCollapsibleSection(
                  'basic',
                  'Contact Information',
                  User,
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInlineEditField('email', 'Email Address', 'text')}
                    {renderInlineEditField('phone', 'Phone Number', 'text')}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Phone</label>
                      <p className="text-lg font-medium text-gray-900">+1 (555) 987-6543</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Preferred Contact Method</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-lg font-medium text-gray-900">Email</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-medium text-gray-900">San Francisco, CA</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Timezone</label>
                      <p className="text-lg font-medium text-gray-900">PST (UTC-8)</p>
                    </div>
                  </div>
                )}

                {/* Company Information */}
                {renderCollapsibleSection(
                  'company',
                  'Company Information',
                  Building,
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInlineEditField('company', 'Company Name', 'text')}
                    {renderInlineEditField('industry', 'Industry', 'text')}
                    {renderInlineEditField('position', 'Job Title', 'text')}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Company Size</label>
                      <p className="text-lg font-medium text-gray-900">201-500 employees</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Annual Revenue</label>
                      <p className="text-lg font-medium text-gray-900">$50M - $100M</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Website</label>
                      <a href="#" className="text-lg font-medium text-blue-600 hover:text-blue-800 flex items-center">
                        www.company.com
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Lead Qualification */}
                {renderCollapsibleSection(
                  'qualification',
                  'Lead Qualification',
                  Target,
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {renderInlineEditField('value', 'Estimated Deal Value', 'number')}
                      {renderInlineEditField('probability', 'Win Probability (%)', 'number')}
                      {renderInlineEditField('source', 'Lead Source', 'text')}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Purchase Timeframe</label>
                        <p className="text-lg font-medium text-gray-900">3-6 months</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Budget Status</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Budget Approved
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Decision Maker</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Primary Decision Maker
                        </span>
                      </div>
                    </div>
                    
                    {/* BANT Qualification */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">BANT Qualification</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="font-semibold text-green-700">Budget</p>
                          <p className="text-xs text-gray-600">Confirmed</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="font-semibold text-green-700">Authority</p>
                          <p className="text-xs text-gray-600">Decision Maker</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="font-semibold text-green-700">Need</p>
                          <p className="text-xs text-gray-600">Identified</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                          <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                          <p className="font-semibold text-yellow-700">Timeline</p>
                          <p className="text-xs text-gray-600">3-6 months</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes & Tags */}
                {renderCollapsibleSection(
                  'notes',
                  'Notes & Tags',
                  FileText,
                  <div className="mt-6 space-y-6">
                    {renderInlineEditField('notes', 'Notes', 'textarea', undefined, 'mb-6')}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {(lead.tags || []).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {(!lead.tags || lead.tags.length === 0) && (
                          <span className="text-gray-500 text-sm">No tags added</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'activities' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Activity
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {activities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const colorClasses = getActivityColor(activity.type);
                    
                    return (
                      <div key={activity.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 p-3 rounded-lg border ${colorClasses}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-medium text-gray-900">{activity.subject}</h4>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {activity.status}
                              </span>
                            </div>
                            
                            {activity.description && (
                              <p className="text-gray-600 mb-3">{activity.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span>By {activity.createdBy}</span>
                                {activity.duration && (
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{activity.duration} minutes</span>
                                  </div>
                                )}
                              </div>
                              <span>{new Date(activity.timestamp).toLocaleString()}</span>
                            </div>
                            
                            {activity.outcome && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800">
                                  <strong>Outcome:</strong> {activity.outcome}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Lead Analytics */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-blue-600">{lead.score}</p>
                      <p className="text-sm text-gray-600">Lead Score</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <Bot className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-purple-600">{aiScore}</p>
                      <p className="text-sm text-gray-600">AI Score</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                      <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-green-600">{lead.probability}%</p>
                      <p className="text-sm text-gray-600">Conversion Probability</p>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Engagement History</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Email Opens</span>
                          <span className="font-bold text-blue-600">8</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Link Clicks</span>
                          <span className="font-bold text-green-600">3</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Website Visits</span>
                          <span className="font-bold text-purple-600">12</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Lead Journey</h4>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">First Contact</p>
                            <p className="text-xs text-gray-500">5 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Qualification Call</p>
                            <p className="text-xs text-gray-500">Scheduled for tomorrow</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Change History</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Lead created', user: 'John Smith', timestamp: '2024-01-15T09:00:00Z', details: 'Lead imported from website form' },
                    { action: 'Stage changed', user: 'John Smith', timestamp: '2024-01-16T14:30:00Z', details: 'Changed from New to Contacted' },
                    { action: 'Score updated', user: 'AI System', timestamp: '2024-01-17T10:15:00Z', details: 'Score increased from 65 to 85 based on engagement' },
                    { action: 'Owner assigned', user: 'Sarah Johnson', timestamp: '2024-01-18T11:00:00Z', details: 'Assigned to John Smith' }
                  ].map((entry, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{entry.action}</p>
                          <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600">{entry.details}</p>
                        <p className="text-xs text-gray-500 mt-1">by {entry.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                AI Insights
              </h3>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="bg-white rounded-lg border border-purple-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-600 font-medium">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                      <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Owner */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Owner</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                  alt={getEmployeeName(lead.assignedTo)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{getEmployeeName(lead.assignedTo)}</p>
                  <p className="text-sm text-gray-600">Sales Representative</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Leads This Month</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-medium text-green-600">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-medium">2.3 hours</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Created</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Last Contact</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Activities</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{activities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Source</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{lead.source}</span>
                </div>
              </div>
            </div>

            {/* Similar Leads */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Similar Leads
              </h3>
              <div className="space-y-3">
                {aiEngine.generateSimilarLeads(lead, leads).slice(0, 3).map((similarLead) => (
                  <div key={similarLead.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 text-sm">{similarLead.name}</p>
                      <span className="text-xs text-blue-600 font-medium">
                        {Math.round(similarLead.similarityScore * 100)}% match
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{similarLead.company} • {similarLead.industry}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{similarLead.stage}</span>
                      <span className="text-xs font-medium text-green-600">${similarLead.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Send className="h-4 w-4 mr-3 text-blue-600" />
                  <span className="text-sm font-medium">Send Follow-up Email</span>
                </button>
                <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="h-4 w-4 mr-3 text-green-600" />
                  <span className="text-sm font-medium">Schedule Call</span>
                </button>
                <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Target className="h-4 w-4 mr-3 text-purple-600" />
                  <span className="text-sm font-medium">Add to Sequence</span>
                </button>
                <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="h-4 w-4 mr-3 text-orange-600" />
                  <span className="text-sm font-medium">Assign Team Member</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Convert to Deal Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Convert Lead to Deal</h3>
              <button onClick={() => setShowConvertModal(false)}>
                <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Lead Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Lead:</span>
                    <span className="font-medium text-gray-900 ml-2">{lead.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium text-gray-900 ml-2">{lead.company}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Estimated Value:</span>
                    <span className="font-medium text-green-600 ml-2">${lead.value.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Probability:</span>
                    <span className="font-medium text-blue-600 ml-2">{lead.probability}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvertToDeal}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl text-sm hover:from-green-700 hover:to-blue-700 transition-all"
                >
                  Convert to Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetailPage;

/*
INTEGRATION POINTS FOR FUTURE DEVELOPMENT:

1. API Integration:
   - GET /api/leads/{id} - Fetch lead details with related data
   - PUT /api/leads/{id} - Update lead information
   - DELETE /api/leads/{id} - Delete lead
   - POST /api/leads/{id}/convert - Convert lead to deal
   - GET /api/leads/{id}/activities - Fetch lead activities
   - POST /api/leads/{id}/activities - Log new activity
   - GET /api/leads/{id}/similar - Find similar leads
   - GET /api/leads/{id}/insights - Get AI insights

2. Activity Management Integration:
   - Real-time activity logging
   - Email tracking and engagement metrics
   - Call recording and transcription
   - Meeting scheduling integration
   - Task creation and management

3. AI/ML Integration:
   - Real-time lead scoring updates
   - Predictive analytics for conversion probability
   - Next best action recommendations
   - Similar lead identification
   - Risk assessment and alerts

4. Communication Integration:
   - Email client integration (Gmail, Outlook)
   - Phone system integration for click-to-call
   - Video conferencing integration (Zoom, Teams)
   - SMS/WhatsApp messaging
   - LinkedIn integration for social selling

5. Analytics Integration:
   - Lead engagement tracking
   - Conversion funnel analysis
   - Performance benchmarking
   - ROI calculation and attribution
   - Predictive lead scoring

6. Workflow Integration:
   - Automated lead routing and assignment
   - Sequence enrollment and management
   - Task automation based on lead behavior
   - Notification triggers for important events
   - Lead nurturing campaign integration

7. Data Enrichment:
   - Company data enrichment (Clearbit, ZoomInfo)
   - Social media profile matching
   - Email validation and verification
   - Phone number validation
   - Geographic and demographic data

8. Compliance & Security:
   - GDPR compliance tracking
   - Data retention policies
   - Audit trail maintenance
   - Privacy preference management
   - Consent management integration
*/