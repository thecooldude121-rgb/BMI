import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, Calendar, MessageSquare, MapPin, Building2,
  Globe, Users, DollarSign, Star, TrendingUp, Clock, FileText,
  Video, Edit3, Plus, Share, MoreHorizontal, ExternalLink,
  Activity, Target, Brain, Lightbulb, CheckCircle, AlertCircle,
  Tag, User, Briefcase, Award, Zap, Eye, Download, Link,
  Coffee, PieChart, BarChart3, Sparkles, Shield, Heart
} from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';

// Types for the detailed lead data
interface LeadScore {
  overall: number;
  fit: number;
  intent: number;
  engagement: number;
}

interface ActivityItem {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'linkedin' | 'note' | 'task';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'completed' | 'pending' | 'failed';
  metadata?: Record<string, any>;
}

interface InsightItem {
  id: string;
  type: 'news' | 'intent' | 'competitive' | 'social' | 'funding';
  title: string;
  description: string;
  source: string;
  confidence: number;
  timestamp: Date;
  impact: 'high' | 'medium' | 'low';
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
  assignedTo: string;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
  uploadedBy: string;
  category: 'proposal' | 'contract' | 'presentation' | 'document' | 'other';
}

interface LeadDetail {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  company: string;
  companyLogo?: string;
  location: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  twitterUrl?: string;
  managerName?: string;
  reportsTo?: string;
  
  // Company context
  industry: string;
  companySize: string;
  companyWebsite: string;
  lastFunding?: string;
  companyDescription: string;
  
  // Lead intelligence
  score: LeadScore;
  enrichmentStatus: 'complete' | 'partial' | 'pending';
  dataSources: string[];
  leadSource: string;
  lastConversationSummary?: string;
  
  // Status and ownership
  status: 'new' | 'contacted' | 'qualified' | 'opportunity' | 'closed_won' | 'closed_lost';
  assignedOwner: string;
  tags: string[];
  segments: string[];
  personas: string[];
  gdprConsent: boolean;
  
  // Related data
  activities: ActivityItem[];
  insights: InsightItem[];
  tasks: TaskItem[];
  files: FileItem[];
  notes: string[];
}

const PeopleDetailPage: React.FC = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'activity' | 'insights' | 'tasks' | 'files' | 'ai-research' | 'timeline'>('activity');
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Mock data service - in real app this would be an API call
  useEffect(() => {
    const fetchLeadDetail = async () => {
      setLoading(true);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLead: LeadDetail = {
        id: params.id || '1',
        name: 'Sarah Chen',
        jobTitle: 'VP of Engineering',
        department: 'Engineering',
        company: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        email: 'sarah.chen@techcorp.com',
        phone: '+1 (555) 123-4567',
        linkedinUrl: 'https://linkedin.com/in/sarah-chen-tech',
        twitterUrl: 'https://twitter.com/sarahtech',
        managerName: 'David Kim (CTO)',
        reportsTo: 'David Kim',
        
        industry: 'Technology',
        companySize: '500-1000 employees',
        companyWebsite: 'https://techcorp.com',
        lastFunding: 'Series B - $25M (2023)',
        companyDescription: 'Leading provider of enterprise cloud solutions with focus on AI-driven automation and data analytics.',
        
        score: {
          overall: 87,
          fit: 92,
          intent: 78,
          engagement: 91
        },
        enrichmentStatus: 'complete',
        dataSources: ['LinkedIn', 'Company Website', 'Clearbit', 'ZoomInfo'],
        leadSource: 'LinkedIn Sales Navigator',
        lastConversationSummary: 'Discussed implementation timeline for Q2 2024. High interest in enterprise package.',
        
        status: 'qualified',
        assignedOwner: 'John Smith',
        tags: ['Enterprise', 'High-Priority', 'Technical Decision Maker'],
        segments: ['Enterprise Tech Leaders', 'West Coast'],
        personas: ['Technical Buyer', 'Innovation Leader'],
        gdprConsent: true,
        
        activities: [
          {
            id: '1',
            type: 'email',
            title: 'Follow-up after demo',
            description: 'Sent follow-up email with pricing proposal and implementation timeline',
            timestamp: new Date('2024-01-15T10:30:00'),
            status: 'completed'
          },
          {
            id: '2',
            type: 'meeting',
            title: 'Product demo call',
            description: '45-minute demo of enterprise features. Sarah expressed strong interest',
            timestamp: new Date('2024-01-14T14:00:00'),
            status: 'completed'
          },
          {
            id: '3',
            type: 'call',
            title: 'Discovery call',
            description: 'Initial qualification call to understand requirements',
            timestamp: new Date('2024-01-10T11:00:00'),
            status: 'completed'
          }
        ],
        
        insights: [
          {
            id: '1',
            type: 'news',
            title: 'TechCorp raises $25M Series B',
            description: 'Company announced significant funding round to expand engineering team',
            source: 'TechCrunch',
            confidence: 95,
            timestamp: new Date('2024-01-12T09:00:00'),
            impact: 'high'
          },
          {
            id: '2',
            type: 'intent',
            title: 'Increased website activity',
            description: 'Multiple team members from TechCorp visited pricing and enterprise pages',
            source: 'Website Analytics',
            confidence: 87,
            timestamp: new Date('2024-01-13T16:30:00'),
            impact: 'medium'
          }
        ],
        
        tasks: [
          {
            id: '1',
            title: 'Send technical requirements doc',
            description: 'Prepare and send detailed technical specifications for enterprise implementation',
            dueDate: new Date('2024-01-18T12:00:00'),
            priority: 'high',
            status: 'pending',
            assignedTo: 'John Smith'
          },
          {
            id: '2',
            title: 'Schedule stakeholder meeting',
            description: 'Coordinate meeting with Sarah and her technical team',
            dueDate: new Date('2024-01-20T15:00:00'),
            priority: 'medium',
            status: 'pending',
            assignedTo: 'John Smith'
          }
        ],
        
        files: [
          {
            id: '1',
            name: 'Enterprise_Proposal_TechCorp.pdf',
            type: 'PDF',
            size: '2.3 MB',
            uploadedAt: new Date('2024-01-15T11:00:00'),
            uploadedBy: 'John Smith',
            category: 'proposal'
          },
          {
            id: '2',
            name: 'Technical_Specifications.docx',
            type: 'DOCX',
            size: '1.8 MB',
            uploadedAt: new Date('2024-01-14T16:30:00'),
            uploadedBy: 'Technical Team',
            category: 'document'
          }
        ],
        
        notes: [
          'Very technical and detail-oriented. Prefers data-driven discussions.',
          'Strong advocate for security and compliance within her organization.',
          'Looking to implement by Q2 2024. Budget approved for $100k+.'
        ]
      };
      
      setLead(mockLead);
      setLoading(false);
    };

    fetchLeadDetail();
  }, [params.id]);

  const handleAddNote = () => {
    if (newNote.trim() && lead) {
      setLead({
        ...lead,
        notes: [...lead.notes, newNote.trim()]
      });
      setNewNote('');
      setShowNoteEditor(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'opportunity': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed_won': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed_lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'linkedin': return <SiLinkedin className="h-4 w-4" />;
      case 'note': return <Edit3 className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead Not Found</h2>
          <p className="text-gray-600 mb-4">The requested lead could not be found.</p>
          <button
            onClick={() => setLocation('/lead-generation')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Lead Generation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation('/lead-generation')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
              <p className="text-gray-600">{lead.jobTitle} at {lead.company}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-4 w-4" />
              <span>Meeting</span>
            </button>
            <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Sidebar - Lead Information */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Lead Photo & Basic Info */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-gray-600">{lead.jobTitle}</p>
              <p className="text-sm text-gray-500">{lead.department}</p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SiLinkedin className="h-4 w-4 text-blue-600" />
                  <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Company</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.company}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a href={lead.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    Company Website
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.companySize}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.lastFunding}</span>
                </div>
              </div>
            </div>

            {/* Lead Score */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Lead Score</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Overall</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getScoreColor(lead.score.overall)}`}>
                    {lead.score.overall}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Fit Score</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getScoreColor(lead.score.fit)}`}>
                    {lead.score.fit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Intent</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getScoreColor(lead.score.intent)}`}>
                    {lead.score.intent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Engagement</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getScoreColor(lead.score.engagement)}`}>
                    {lead.score.engagement}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Tags */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Status & Tags</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium border capitalize ${getStatusColor(lead.status)}`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Owner</span>
                  <span className="text-sm text-gray-700">{lead.assignedOwner}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-700 block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Notes</h3>
                <button
                  onClick={() => setShowNoteEditor(true)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              {showNoteEditor && (
                <div className="space-y-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowNoteEditor(false);
                        setNewNote('');
                      }}
                      className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {lead.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 px-6">
            <nav className="flex space-x-6">
              {[
                { key: 'activity', label: 'Activity', icon: Activity },
                { key: 'insights', label: 'Insights', icon: Lightbulb },
                { key: 'tasks', label: 'Tasks', icon: CheckCircle },
                { key: 'files', label: 'Files', icon: FileText },
                { key: 'ai-research', label: 'AI Research', icon: Brain },
                { key: 'timeline', label: 'Timeline', icon: Clock }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
                  <div className="space-y-4">
                    {lead.activities.map((activity) => (
                      <div key={activity.id} className="flex space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                            <span className="text-xs text-gray-500">
                              {activity.timestamp.toLocaleDateString()} {activity.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          {activity.status && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                              activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {activity.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Lead Insights</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {lead.insights.map((insight) => (
                      <div key={insight.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {insight.impact} impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Source: {insight.source}</span>
                          <span>Confidence: {insight.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'tasks' && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Tasks & Reminders</h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus className="h-4 w-4" />
                      <span>Add Task</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {lead.tasks.map((task) => (
                      <div key={task.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Due: {task.dueDate.toLocaleDateString()}</span>
                              <span>Assigned to: {task.assignedTo}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'files' && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Files & Attachments</h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus className="h-4 w-4" />
                      <span>Upload File</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lead.files.map((file) => (
                      <div key={file.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                            <p className="text-xs text-gray-500">{file.type} • {file.size}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span>By {file.uploadedBy}</span>
                          <span>{file.uploadedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button className="flex-1 py-1 px-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                            View
                          </button>
                          <button className="flex-1 py-1 px-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai-research' && (
                <motion.div
                  key="ai-research"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900">AI Research & Insights</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Social Media Insights */}
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Social Media Activity</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <SiLinkedin className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-900">Recent post about AI implementation</p>
                            <p className="text-xs text-gray-500">2 days ago • 45 likes, 12 comments</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <SiLinkedin className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-900">Shared article on enterprise security</p>
                            <p className="text-xs text-gray-500">5 days ago • 23 interactions</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Company Intelligence */}
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Company Intelligence</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Technology Stack</span>
                          <span className="text-sm font-medium text-gray-900">AWS, React, Node.js</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Recent Hires</span>
                          <span className="text-sm font-medium text-gray-900">+15 Engineers</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Growth Rate</span>
                          <span className="text-sm font-medium text-green-600">+35% YoY</span>
                        </div>
                      </div>
                    </div>

                    {/* Personalization Suggestions */}
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Personalization Tips</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-900">Mention their recent Series B funding</p>
                            <p className="text-xs text-gray-500">High relevance for enterprise discussion</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-900">Reference their AI implementation post</p>
                            <p className="text-xs text-gray-500">Shows genuine interest in their work</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Intent Signals */}
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Buying Intent Signals</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">Multiple team members visited pricing page</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">Downloaded technical whitepaper</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">Engaged with demo request content</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Complete Timeline</h2>
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      {[...lead.activities, ...lead.insights.map(i => ({
                        id: i.id,
                        type: 'insight' as const,
                        title: i.title,
                        description: i.description,
                        timestamp: i.timestamp,
                        metadata: { source: i.source, impact: i.impact }
                      }))].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((item, index) => (
                        <div key={`${item.type}-${item.id}`} className="relative flex items-start space-x-4">
                          <div className="relative">
                            <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                              {item.type === 'insight' ? 
                                <Lightbulb className="h-4 w-4 text-yellow-500" /> :
                                getActivityIcon(item.type)
                              }
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 pb-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                              <span className="text-xs text-gray-500">
                                {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            {item.type === 'insight' && item.metadata && (
                              <div className="mt-2 flex space-x-2">
                                <span className="text-xs text-gray-500">Source: {item.metadata.source}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  item.metadata.impact === 'high' ? 'bg-red-100 text-red-800' :
                                  item.metadata.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {item.metadata.impact} impact
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleDetailPage;