import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
  status: 'completed' | 'pending' | 'overdue';
  assignedTo: string;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
  uploadedBy: string;
  category: 'proposal' | 'contract' | 'presentation' | 'document' | 'image';
}

const PeopleDetailPage: React.FC = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'activity' | 'insights' | 'tasks' | 'files' | 'ai-research' | 'timeline'>('activity');
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Fetch lead data from API
  const { data: leads, isLoading: loading } = useQuery<any[]>({
    queryKey: ['/api/leads']
  });

  // Find the specific lead by ID
  const leadData = leads?.find(l => l.id === params.id);

  // Create enhanced lead detail from API data with additional mock data
  const lead = leadData ? {
    ...leadData,
    score: {
      overall: 87,
      fit: 92,
      intent: 78,
      engagement: 91
    },
    activities: [
      {
        id: '1',
        type: 'email' as const,
        title: 'Follow-up after demo',
        description: 'Sent follow-up email with pricing proposal and implementation timeline',
        timestamp: new Date('2024-01-15T10:30:00'),
        status: 'completed' as const
      },
      {
        id: '2',
        type: 'meeting' as const,
        title: 'Product demo call',
        description: '45-minute demo of enterprise features. Strong interest expressed',
        timestamp: new Date('2024-01-14T14:00:00'),
        status: 'completed' as const
      },
      {
        id: '3',
        type: 'call' as const,
        title: 'Discovery call',
        description: 'Initial qualification call to understand requirements',
        timestamp: new Date('2024-01-10T11:00:00'),
        status: 'completed' as const
      }
    ],
    insights: [
      {
        id: '1',
        type: 'news' as const,
        title: `${leadData.company} raises funding`,
        description: 'Company announced significant funding round to expand engineering team',
        source: 'TechCrunch',
        confidence: 95,
        timestamp: new Date('2024-01-12T09:00:00'),
        impact: 'high' as const
      },
      {
        id: '2',
        type: 'intent' as const,
        title: 'Increased website activity',
        description: 'Multiple team members visited pricing and enterprise pages',
        source: 'Website Analytics',
        confidence: 87,
        timestamp: new Date('2024-01-13T16:30:00'),
        impact: 'medium' as const
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Send technical requirements doc',
        description: 'Prepare and send detailed technical specifications',
        dueDate: new Date('2024-01-18T12:00:00'),
        priority: 'high' as const,
        status: 'pending' as const,
        assignedTo: 'Sales Team'
      },
      {
        id: '2',
        title: 'Schedule stakeholder meeting',
        description: `Coordinate meeting with ${leadData.name} and technical team`,
        dueDate: new Date('2024-01-20T15:00:00'),
        priority: 'medium' as const,
        status: 'pending' as const,
        assignedTo: 'Sales Team'
      }
    ],
    files: [
      {
        id: '1',
        name: `Proposal_${leadData.company.replace(/\s+/g, '_')}.pdf`,
        type: 'PDF',
        size: '2.3 MB',
        uploadedAt: new Date('2024-01-15T11:00:00'),
        uploadedBy: 'Sales Team',
        category: 'proposal' as const
      }
    ],
    notes: [
      'Technical decision maker with strong attention to detail.',
      'Looking for enterprise-grade solutions with good security.',
      'Budget approved - high potential for closure.'
    ],
    tags: ['Enterprise', 'High-Priority', 'Technical Decision Maker'],
    status: 'qualified',
    assignedOwner: 'Sales Team',
    companySize: '500-1000 employees',
    lastFunding: 'Series B - $25M (2023)',
    department: leadData.title?.split(' ')[0] || 'Engineering',
    linkedinUrl: 'https://linkedin.com/in/profile',
    phone: '+1 (555) 123-4567'
  } : null;

  const handleAddNote = () => {
    if (!newNote.trim() || !lead) return;
    
    lead.notes = [...(lead.notes || []), newNote.trim()];
    setNewNote('');
    setShowNoteEditor(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800 border-green-300';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'new': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'linkedin': return <SiLinkedin className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead Not Found</h2>
          <p className="text-gray-600 mb-6">The lead you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => setLocation('/lead-generation')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Lead Generation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 px-0 py-6 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setLocation('/lead-generation')}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 group"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                {lead.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{lead.name}</h1>
                <p className="text-lg text-gray-600">{lead.title} at {lead.company}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform">
              <Mail className="h-4 w-4" />
              <span className="font-medium">Email</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 transform">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Call</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 transform">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Meeting</span>
            </button>
            <button className="p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 transform">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Lead Information */}
        <div className="w-64 bg-gradient-to-b from-gray-50/80 to-white border-r border-gray-200/60 overflow-y-auto shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] relative backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-gray-50/50 pointer-events-none"></div>
          <div className="relative p-5 pb-8 space-y-5">
            {/* Lead Photo & Basic Info */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-5 shadow-xl shadow-blue-500/40 border-3 border-white/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative z-10">{lead.name.split(' ').map((n: string) => n[0]).join('')}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{lead.name}</h2>
              <p className="text-gray-600 font-medium mb-1">{lead.title}</p>
              <p className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full inline-block">{lead.department}</p>
            </div>

            {/* Contact Information */}
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200/50 backdrop-blur-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Contact
              </h3>
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
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200/50 backdrop-blur-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Company
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.company}</span>
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
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200/50 backdrop-blur-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Lead Score
              </h3>
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
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200/50 backdrop-blur-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Status & Tags
              </h3>
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
                    {lead.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200/50 backdrop-blur-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Notes
                </h3>
                <button
                  onClick={() => setShowNoteEditor(true)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 group"
                >
                  <Plus className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
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
                {lead.notes.map((note: string, index: number) => (
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
          <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 px-6 shadow-sm">
            <nav className="flex space-x-8">
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
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 transition-all duration-200 rounded-t-lg ${
                    activeTab === key
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
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
                    {lead.activities.map((activity: ActivityItem) => (
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
                    {lead.insights.map((insight: InsightItem) => (
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
                    {lead.tasks.map((task: TaskItem) => (
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
                    {lead.files.map((file: FileItem) => (
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
                            <p className="text-sm text-gray-900">Mention their recent funding round</p>
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
                      {[...lead.activities, ...lead.insights.map((i: InsightItem) => ({
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
                              {item.type === 'insight' ? <Lightbulb className="h-4 w-4 text-yellow-500" /> : getActivityIcon(item.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 pb-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                              <span className="text-xs text-gray-500">
                                {item.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            {item.metadata && (
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                {item.metadata.source && <span>Source: {item.metadata.source}</span>}
                                {item.metadata.impact && <span className={`px-2 py-1 rounded-full font-medium ${
                                  item.metadata.impact === 'high' ? 'bg-red-100 text-red-800' :
                                  item.metadata.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {item.metadata.impact} impact
                                </span>}
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