import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Search, Target, TrendingUp, Users, Building2, Mail, Phone,
  Globe, LinkedinIcon, Twitter, Filter, Star, AlertCircle, CheckCircle,
  Clock, Zap, Eye, Settings, Download, Upload, RefreshCw, BarChart3,
  PieChart, Activity, Shield, Lock, Calendar, MessageSquare, Database, Plus
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Core Types for AI Lead Generation
interface AIProspectingConfig {
  targetPersonas: string[];
  industries: string[];
  companySizes: string[];
  locations: string[];
  technologies: string[];
  intentSignals: string[];
  leadScoringWeights: {
    fit: number;
    intent: number;
    engagement: number;
    timing: number;
  };
}

interface LeadEnrichmentData {
  contact: {
    email: string;
    emailVerified: boolean;
    phone: string;
    phoneVerified: boolean;
    socialProfiles: {
      linkedin: string;
      twitter: string;
    };
    personalInfo: {
      role: string;
      department: string;
      seniority: string;
      yearsInRole: number;
    };
  };
  company: {
    domain: string;
    revenue: string;
    employees: number;
    industry: string;
    techStack: string[];
    fundingStage: string;
    recentNews: string[];
    competitorAnalysis: string[];
  };
  intent: {
    score: number;
    signals: string[];
    recentActivity: string[];
    buyingStage: string;
  };
  aiInsights: {
    leadScore: number;
    personaMatch: string;
    recommendedActions: string[];
    engagementProbability: number;
  };
}

interface ProspectingCampaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  config: AIProspectingConfig;
  progress: {
    searched: number;
    found: number;
    enriched: number;
    qualified: number;
  };
  results: EnrichedLead[];
  createdAt: Date;
  lastRun: Date;
}

interface EnrichedLead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  leadScore: number;
  intentScore: number;
  enrichmentData: LeadEnrichmentData;
  campaignId: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'nurture';
  tags: string[];
  createdAt: Date;
}

const AIProspectingEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'prospects' | 'enrichment' | 'analytics'>('campaigns');
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<ProspectingCampaign | null>(null);
  const queryClient = useQueryClient();

  // Mock data for MVP demonstration
  const mockCampaigns: ProspectingCampaign[] = [
    {
      id: 'camp-1',
      name: 'Enterprise Tech Leaders Q1 2024',
      status: 'active',
      config: {
        targetPersonas: ['CTO', 'VP Engineering', 'Head of Technology'],
        industries: ['Software', 'Technology', 'SaaS'],
        companySizes: ['500-1000', '1000+'],
        locations: ['United States', 'Canada', 'United Kingdom'],
        technologies: ['AWS', 'React', 'Node.js', 'Python'],
        intentSignals: ['job_postings', 'funding_rounds', 'tech_stack_changes'],
        leadScoringWeights: { fit: 0.3, intent: 0.4, engagement: 0.2, timing: 0.1 }
      },
      progress: { searched: 15420, found: 2340, enriched: 1890, qualified: 456 },
      results: [],
      createdAt: new Date('2024-01-15'),
      lastRun: new Date('2024-01-20')
    },
    {
      id: 'camp-2', 
      name: 'Healthcare Operations Directors',
      status: 'paused',
      config: {
        targetPersonas: ['Operations Director', 'VP Operations', 'COO'],
        industries: ['Healthcare', 'Medical Devices', 'Hospitals'],
        companySizes: ['100-500', '500-1000'],
        locations: ['United States'],
        technologies: ['EMR', 'Healthcare IT', 'Medical Software'],
        intentSignals: ['expansion_signals', 'regulatory_changes'],
        leadScoringWeights: { fit: 0.25, intent: 0.35, engagement: 0.25, timing: 0.15 }
      },
      progress: { searched: 8750, found: 1240, enriched: 980, qualified: 287 },
      results: [],
      createdAt: new Date('2024-01-10'),
      lastRun: new Date('2024-01-18')
    }
  ];

  const mockEnrichedLeads: EnrichedLead[] = [
    {
      id: 'lead-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      company: 'TechCorp Solutions',
      title: 'VP of Engineering',
      leadScore: 92,
      intentScore: 87,
      enrichmentData: {
        contact: {
          email: 'sarah.chen@techcorp.com',
          emailVerified: true,
          phone: '+1-555-0123',
          phoneVerified: true,
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/sarahchen',
            twitter: '@sarahchen_tech'
          },
          personalInfo: {
            role: 'VP Engineering',
            department: 'Engineering',
            seniority: 'VP',
            yearsInRole: 3
          }
        },
        company: {
          domain: 'techcorp.com',
          revenue: '$50M - $100M',
          employees: 750,
          industry: 'Software',
          techStack: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
          fundingStage: 'Series B',
          recentNews: ['Series B funding round completed', 'Expanded engineering team by 40%'],
          competitorAnalysis: ['Using competitor A for project management', 'Evaluating new development tools']
        },
        intent: {
          score: 87,
          signals: ['Recent job postings for developers', 'Technology stack expansion', 'Engineering blog posts about scaling'],
          recentActivity: ['LinkedIn post about hiring challenges', 'Conference attendance: DevOps Summit'],
          buyingStage: 'consideration'
        },
        aiInsights: {
          leadScore: 92,
          personaMatch: 'High-value enterprise tech leader',
          recommendedActions: [
            'Personalized email about scaling engineering teams',
            'LinkedIn connection with development tools content',
            'Invite to exclusive CTO roundtable'
          ],
          engagementProbability: 78
        }
      },
      campaignId: 'camp-1',
      status: 'new',
      tags: ['high-priority', 'enterprise', 'tech-leader'],
      createdAt: new Date('2024-01-20')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Prospecting Engine</h1>
                <p className="text-sm text-gray-600">Next-generation lead generation powered by advanced AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCampaignBuilder(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'campaigns', label: 'Campaigns', icon: Target },
                { id: 'prospects', label: 'Prospects', icon: Users },
                { id: 'enrichment', label: 'Data Enrichment', icon: Database },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'campaigns' && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Campaign Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                      <p className="text-2xl font-bold text-gray-900">{mockCampaigns.filter(c => c.status === 'active').length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Prospects</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockCampaigns.reduce((sum, c) => sum + c.progress.found, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Qualified Leads</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockCampaigns.reduce((sum, c) => sum + c.progress.qualified, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Lead Score</p>
                      <p className="text-2xl font-bold text-gray-900">87.5</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Campaigns */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
                  <p className="text-sm text-gray-600">Monitor and manage your AI-powered prospecting campaigns</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              campaign.status === 'active' ? 'bg-green-500' :
                              campaign.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}></div>
                            <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                              campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Settings className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Metrics */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{campaign.progress.searched.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Searched</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{campaign.progress.found.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Found</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{campaign.progress.enriched.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Enriched</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{campaign.progress.qualified.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Qualified</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(campaign.progress.qualified / campaign.progress.found) * 100}%` }}
                          ></div>
                        </div>

                        {/* Campaign Details */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>Industries: {campaign.config.industries.join(', ')}</span>
                            <span>•</span>
                            <span>Personas: {campaign.config.targetPersonas.length}</span>
                          </div>
                          <div>
                            Last run: {campaign.lastRun.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'prospects' && (
            <motion.div
              key="prospects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Prospects Dashboard */}
              <ProspectsDashboard leads={mockEnrichedLeads} />
            </motion.div>
          )}

          {activeTab === 'enrichment' && (
            <motion.div
              key="enrichment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Data Enrichment Module */}
              <DataEnrichmentModule />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Analytics Dashboard */}
              <AnalyticsDashboard campaigns={mockCampaigns} leads={mockEnrichedLeads} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Prospects Dashboard Component
const ProspectsDashboard: React.FC<{ leads: EnrichedLead[] }> = ({ leads }) => {
  const [selectedLead, setSelectedLead] = useState<EnrichedLead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Prospects List */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Enriched Prospects</h3>
              <p className="text-sm text-gray-600">High-quality leads with comprehensive data enrichment</p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {leads.map((lead) => (
              <div 
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                      <p className="text-sm text-gray-600">{lead.title} at {lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-gray-900">{lead.leadScore}</span>
                      </div>
                      <p className="text-xs text-gray-600">Lead Score</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-gray-900">{lead.intentScore}</span>
                      </div>
                      <p className="text-xs text-gray-600">Intent Score</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{lead.enrichmentData.contact.emailVerified ? 'Verified' : 'Unverified'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{lead.enrichmentData.contact.phoneVerified ? 'Verified' : 'Unverified'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span>{lead.enrichmentData.company.employees} employees</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    lead.status === 'new' ? 'bg-green-100 text-green-800' :
                    lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Detail Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {selectedLead ? (
          <LeadDetailPanel lead={selectedLead} />
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a prospect to view detailed enrichment data</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Lead Detail Panel Component  
const LeadDetailPanel: React.FC<{ lead: EnrichedLead }> = ({ lead }) => {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {lead.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
          <p className="text-sm text-gray-600">{lead.title}</p>
          <p className="text-sm text-gray-600">{lead.company}</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-blue-900">AI Insights</span>
        </div>
        <p className="text-sm text-blue-800 mb-3">{lead.enrichmentData.aiInsights.personaMatch}</p>
        <div className="space-y-2">
          {lead.enrichmentData.aiInsights.recommendedActions.map((action, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{lead.enrichmentData.contact.email}</span>
            {lead.enrichmentData.contact.emailVerified && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{lead.enrichmentData.contact.phone}</span>
            {lead.enrichmentData.contact.phoneVerified && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div className="flex items-center space-x-3">
            <LinkedinIcon className="h-4 w-4 text-gray-400" />
            <a href={lead.enrichmentData.contact.socialProfiles.linkedin} className="text-sm text-blue-600 hover:underline">
              LinkedIn Profile
            </a>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Company Details</h4>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Revenue:</span> {lead.enrichmentData.company.revenue}</div>
          <div><span className="font-medium">Employees:</span> {lead.enrichmentData.company.employees}</div>
          <div><span className="font-medium">Industry:</span> {lead.enrichmentData.company.industry}</div>
          <div><span className="font-medium">Funding:</span> {lead.enrichmentData.company.fundingStage}</div>
        </div>
        
        <div className="mt-4">
          <h5 className="font-medium text-gray-900 mb-2">Technology Stack</h5>
          <div className="flex flex-wrap gap-1">
            {lead.enrichmentData.company.techStack.map((tech) => (
              <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Intent Signals */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Intent Signals</h4>
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Intent Score</span>
            <span className="text-sm font-bold text-blue-600">{lead.enrichmentData.intent.score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${lead.enrichmentData.intent.score}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-1">
          {lead.enrichmentData.intent.signals.map((signal, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Activity className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">{signal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Add to CRM
        </button>
        <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
          Start Sequence
        </button>
      </div>
    </div>
  );
};

// Data Enrichment Module Component
const DataEnrichmentModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Data Enrichment & Validation</h2>
            <p className="text-sm text-gray-600">Automated data cleansing, live verification, and dynamic refresh</p>
          </div>
        </div>

        {/* Enrichment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Email Verified</p>
                <p className="text-lg font-bold text-green-900">94.5%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Phone Verified</p>
                <p className="text-lg font-bold text-blue-900">87.2%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <Building2 className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Company Data</p>
                <p className="text-lg font-bold text-purple-900">92.8%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <Globe className="h-6 w-6 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Social Profiles</p>
                <p className="text-lg font-bold text-yellow-900">78.4%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Data Sources & APIs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'LinkedIn Sales Navigator', 'ZoomInfo Database', 'Clearbit API', 'Hunter.io',
              'Apollo.io', 'Salesforce Data.com', 'FullContact', 'PeopleDataLabs'
            ].map((source) => (
              <div key={source} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard: React.FC<{ campaigns: ProspectingCampaign[], leads: EnrichedLead[] }> = ({ campaigns, leads }) => {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">19.5%</p>
              <p className="text-sm text-green-600">+2.3% from last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Lead Score</p>
              <p className="text-2xl font-bold text-gray-900">87.3</p>
              <p className="text-sm text-blue-600">Above industry avg</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Quality</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
              <p className="text-sm text-green-600">Excellent quality</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{campaign.name}</p>
                  <p className="text-sm text-gray-600">{campaign.progress.qualified} qualified leads</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    {((campaign.progress.qualified / campaign.progress.found) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-600">conversion</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Source Distribution</h3>
          <div className="space-y-3">
            {[
              { source: 'LinkedIn', count: 45, percentage: 35 },
              { source: 'Company Database', count: 32, percentage: 28 },
              { source: 'Web Scraping', count: 28, percentage: 22 },
              { source: 'Referrals', count: 18, percentage: 15 }
            ].map(({ source, count, percentage }) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{source}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIProspectingEngine;