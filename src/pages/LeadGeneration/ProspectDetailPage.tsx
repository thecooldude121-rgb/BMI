import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Mail, Phone, MessageSquare, Calendar, 
  Building, MapPin, Globe, Star, Target, Zap, Plus, 
  ChevronDown, ChevronUp, Clock, Activity, FileText,
  User, Tag, TrendingUp, Eye, Download, Share, Copy,
  Sparkles, Bot, AlertCircle, CheckCircle, X
} from 'lucide-react';
import { Prospect } from '../../types/leadGeneration';

const ProspectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'emails' | 'company' | 'insights'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['contact', 'company', 'engagement']));
  const [isEditing, setIsEditing] = useState(false);

  // Mock prospect data
  const prospect: Prospect = {
    id: id || '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    fullName: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    personalEmail: 'sarah.chen.personal@gmail.com',
    phone: '+1-555-0101',
    mobilePhone: '+1-555-0102',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    twitterUrl: 'https://twitter.com/sarahchen',
    title: 'Chief Technology Officer',
    seniority: 'C-Level',
    department: 'Technology',
    functions: ['Engineering', 'Product', 'Innovation'],
    companyId: 'comp1',
    companyName: 'TechCorp Solutions',
    companyDomain: 'techcorp.com',
    companyIndustry: 'Software',
    companySize: '500-1000',
    companyRevenue: '$50M-$100M',
    companyLocation: 'San Francisco, CA',
    leadSource: 'Apollo Discovery',
    leadStatus: 'qualified',
    leadScore: 92,
    aiScore: 88,
    temperature: 'hot',
    emailStatus: 'valid',
    lastContactedAt: '2024-01-20T10:00:00Z',
    lastEngagedAt: '2024-01-20T10:30:00Z',
    engagementLevel: 'high',
    activeSequences: ['Enterprise Outreach', 'CTO Follow-up'],
    campaignHistory: [],
    tags: ['enterprise', 'decision-maker', 'high-priority', 'tech-savvy'],
    customFields: {
      'Budget Authority': 'Yes',
      'Decision Timeline': 'Q1 2024',
      'Current Solution': 'Salesforce',
      'Pain Points': 'Scalability, Integration'
    },
    notes: 'CTO at fast-growing tech company. Very interested in our enterprise solution. Has budget authority and looking to make decision in Q1. Currently using Salesforce but facing scalability issues.',
    ownerId: 'user1',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    enrichmentStatus: 'enriched',
    enrichmentData: {
      personalEmails: ['sarah.chen.personal@gmail.com'],
      phoneNumbers: ['+1-555-0101', '+1-555-0102'],
      socialProfiles: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/sarahchen', followers: 2500 },
        { platform: 'twitter', url: 'https://twitter.com/sarahchen', followers: 890 }
      ],
      workHistory: [
        { company: 'TechCorp Solutions', title: 'Chief Technology Officer', startDate: '2022-01', description: 'Leading technology strategy and engineering teams' },
        { company: 'StartupX', title: 'VP of Engineering', startDate: '2019-03', endDate: '2021-12', description: 'Built engineering team from 5 to 50 people' }
      ],
      education: [
        { school: 'Stanford University', degree: 'MS', field: 'Computer Science', startYear: 2015, endYear: 2017 },
        { school: 'UC Berkeley', degree: 'BS', field: 'Electrical Engineering', startYear: 2011, endYear: 2015 }
      ],
      skills: ['Machine Learning', 'Cloud Architecture', 'Team Leadership', 'Product Strategy'],
      interests: ['AI/ML', 'Startups', 'Technology Innovation']
    },
    dataQuality: 95
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      replied: 'bg-green-100 text-green-800 border-green-200',
      interested: 'bg-purple-100 text-purple-800 border-purple-200',
      not_interested: 'bg-red-100 text-red-800 border-red-200',
      qualified: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getTemperatureColor = (temp: string) => {
    const colors = {
      hot: 'text-red-500 bg-red-100',
      warm: 'text-orange-500 bg-orange-100',
      cold: 'text-blue-500 bg-blue-100'
    };
    return colors[temp as keyof typeof colors] || 'text-gray-500 bg-gray-100';
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
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User, count: null },
    { id: 'activity', name: 'Activity', icon: Activity, count: 12 },
    { id: 'emails', name: 'Emails', icon: Mail, count: 8 },
    { id: 'company', name: 'Company', icon: Building, count: null },
    { id: 'insights', name: 'AI Insights', icon: Sparkles, count: 3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/lead-generation/prospects')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {prospect.firstName.charAt(0)}{prospect.lastName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{prospect.fullName}</h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(prospect.leadStatus)}`}>
                      {prospect.leadStatus.replace('_', ' ')}
                    </span>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTemperatureColor(prospect.temperature)}`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        prospect.temperature === 'hot' ? 'bg-red-500' :
                        prospect.temperature === 'warm' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      {prospect.temperature}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{prospect.title}</span>
                    <span>•</span>
                    <span>{prospect.companyName}</span>
                    <span>•</span>
                    <span>{prospect.seniority}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Score Badges */}
              <div className="flex items-center space-x-2">
                <div className="text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(prospect.leadScore)}`}>
                    {prospect.leadScore}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Lead Score</p>
                </div>
                <div className="text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(prospect.aiScore)}`}>
                    {prospect.aiScore}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">AI Score</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </button>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <MessageSquare className="h-4 w-4 mr-2" />
              LinkedIn
            </button>
            <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </button>
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Zap className="h-4 w-4 mr-2" />
              Add to Sequence
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mt-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{tab.name}</span>
                      {tab.count !== null && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Work Email</p>
                    <a href={`mailto:${prospect.email}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {prospect.email}
                    </a>
                  </div>
                </div>
                
                {prospect.personalEmail && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Personal Email</p>
                      <a href={`mailto:${prospect.personalEmail}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {prospect.personalEmail}
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${prospect.phone}`} className="text-sm font-medium text-gray-900">
                      {prospect.phone}
                    </a>
                  </div>
                </div>
                
                {prospect.linkedinUrl && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">LinkedIn</p>
                      <a 
                        href={prospect.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Scoring */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Scoring</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl text-lg font-bold ${getScoreColor(prospect.leadScore)}`}>
                    <Star className="h-5 w-5 mr-2" />
                    {prospect.leadScore}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Lead Score</p>
                </div>
                
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl text-lg font-bold ${getScoreColor(prospect.aiScore)}`}>
                    <Bot className="h-5 w-5 mr-2" />
                    {prospect.aiScore}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">AI Score</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Data Quality</span>
                    <span className="text-sm font-medium text-gray-900">{prospect.dataQuality}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${prospect.dataQuality}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Sequences */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sequences</h3>
              {prospect.activeSequences.length > 0 ? (
                <div className="space-y-3">
                  {prospect.activeSequences.map((sequence, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-900">{sequence}</span>
                      </div>
                      <span className="text-xs text-orange-600">Step 2 of 5</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Zap className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Not in any sequences</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Add to Sequence
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prospect.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                + Add Tag
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Contact Details */}
                {renderCollapsibleSection(
                  'contact',
                  'Contact Details',
                  User,
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                        <p className="text-lg font-medium text-gray-900">{prospect.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Job Title</label>
                        <p className="text-lg font-medium text-gray-900">{prospect.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                        <p className="text-lg font-medium text-gray-900">{prospect.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Functions</label>
                        <div className="flex flex-wrap gap-1">
                          {prospect.functions.map(func => (
                            <span key={func} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {func}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Lead Source</label>
                        <p className="text-lg font-medium text-gray-900">{prospect.leadSource}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Owner</label>
                        <p className="text-lg font-medium text-gray-900">{prospect.ownerId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
                        <p className="text-lg font-medium text-gray-900">
                          {new Date(prospect.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                        <p className="text-lg font-medium text-gray-900">
                          {new Date(prospect.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Company Information */}
                {renderCollapsibleSection(
                  'company',
                  'Company Information',
                  Building,
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Company</label>
                        <button
                          onClick={() => navigate(`/lead-generation/companies/${prospect.companyId}`)}
                          className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {prospect.companyName}
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Industry</label>
                        <p className="text-lg font-medium text-gray-900">{prospect.companyIndustry}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Company Size</label>
                        <p className="text-lg font-medium text-gray-900">{prospect.companySize} employees</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                        <p className="text-lg font-medium text-gray-900">{prospect.companyLocation}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Website</label>
                        <a 
                          href={`https://${prospect.companyDomain}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-blue-600 hover:text-blue-800"
                        >
                          {prospect.companyDomain}
                        </a>
                      </div>
                      {prospect.companyRevenue && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Revenue</label>
                          <p className="text-lg font-medium text-gray-900">{prospect.companyRevenue}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Engagement History */}
                {renderCollapsibleSection(
                  'engagement',
                  'Engagement History',
                  Activity,
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">8</p>
                        <p className="text-sm text-gray-600">Emails Sent</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Eye className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">5</p>
                        <p className="text-sm text-gray-600">Emails Opened</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">2</p>
                        <p className="text-sm text-gray-600">Replies</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { type: 'email', action: 'Opened email', details: '"Partnership Opportunity"', time: '2 hours ago', icon: Mail },
                        { type: 'email', action: 'Replied to email', details: '"Re: Partnership Opportunity"', time: '1 day ago', icon: MessageSquare },
                        { type: 'email', action: 'Opened email', details: '"Follow-up on our conversation"', time: '3 days ago', icon: Eye },
                        { type: 'email', action: 'Email sent', details: '"Introduction to our platform"', time: '5 days ago', icon: Mail }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-white rounded-lg border border-gray-200">
                            <activity.icon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.details}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Fields */}
                {Object.keys(prospect.customFields).length > 0 && renderCollapsibleSection(
                  'custom',
                  'Custom Fields',
                  Settings,
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(prospect.customFields).map(([key, value]) => (
                      <div key={key} className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600 mb-1">{key}</label>
                        <p className="text-sm font-medium text-gray-900">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {renderCollapsibleSection(
                  'notes',
                  'Notes',
                  FileText,
                  <div className="mt-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">{prospect.notes}</p>
                    </div>
                    <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit Notes
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                {/* AI Insights */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                      <p className="text-sm text-gray-600">Powered by machine learning analysis</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">High Conversion Probability</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        This prospect matches your highest-converting customer profile with 87% similarity.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-900">Optimal Contact Time</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Best time to contact: Tuesday-Thursday, 10 AM - 2 PM PST based on engagement patterns.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Recommended Approach</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Focus on scalability and integration challenges. Mention case studies from similar tech companies.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enrichment Data */}
                {prospect.enrichmentData && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Enrichment Data</h3>
                    
                    {/* Work History */}
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Work History</h4>
                      <div className="space-y-3">
                        {prospect.enrichmentData.workHistory.map((work, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Building className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{work.title}</p>
                              <p className="text-sm text-gray-600">{work.company}</p>
                              <p className="text-xs text-gray-500">
                                {work.startDate} - {work.endDate || 'Present'}
                              </p>
                              {work.description && (
                                <p className="text-xs text-gray-600 mt-1">{work.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Education</h4>
                      <div className="space-y-3">
                        {prospect.enrichmentData.education.map((edu, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Target className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{edu.degree} in {edu.field}</p>
                              <p className="text-sm text-gray-600">{edu.school}</p>
                              <p className="text-xs text-gray-500">{edu.startYear} - {edu.endYear}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills & Interests */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {prospect.enrichmentData.skills.map(skill => (
                            <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {prospect.enrichmentData.interests.map(interest => (
                            <span key={interest} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Activity Timeline</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Activity
                  </button>
                </div>
                
                <div className="text-center py-16">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Activity timeline will be implemented here</p>
                </div>
              </div>
            )}

            {activeTab === 'emails' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Email History</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Mail className="h-4 w-4 mr-2" />
                    Compose Email
                  </button>
                </div>
                
                <div className="text-center py-16">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Email history will be implemented here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetailPage;