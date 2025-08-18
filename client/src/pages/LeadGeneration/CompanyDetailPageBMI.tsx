import React, { useState, useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import {
  Building2,
  TrendingUp,
  Users,
  Calendar,
  Phone,
  Search,
  FileText,
  Target,
  DollarSign,
  Star,
  Settings,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Globe,
  Mail,
  MapPin,
  Briefcase,
  Award,
  Activity,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { companies } from '../../data/companies';

interface ContactData {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  avatar?: string;
  initials: string;
}

interface CompanyData {
  id: string;
  name: string;
  logo: string;
  domain: string;
  description: string;
  industry: string;
  location: string;
  founded: string;
  employees: string;
  revenue: string;
  phone: string;
  tradingSymbol: string;
  subsidiaries: number;
  score: number;
  rating: string;
}

interface ProspectData {
  id: string;
  name: string;
  title: string;
  location: string;
  department: string;
  reason: string;
  actions: string[];
}

interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task' | 'note';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  person?: string;
}

const CompanyDetailPageBMI: React.FC = () => {
  const [match, params] = useRoute('/lead-generation/company/:id');
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'recommendations' | 'existing-contacts' | 'sequences' | 'meetings' | 'deals' | 'conversations' | 'locations'>('overview');
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [companyInfoExpanded, setCompanyInfoExpanded] = useState(true);
  const [contactsExpanded, setContactsExpanded] = useState(true);
  const [dealsExpanded, setDealsExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [notesExpanded, setNotesExpanded] = useState(true);
  const [activeInsightTab, setActiveInsightTab] = useState<'score' | 'news' | 'technologies' | 'funding' | 'job-postings' | 'employee-trends' | 'website-visitors'>('score');
  const [activeProspectTab, setActiveProspectTab] = useState<'all' | 'sales-dept' | 'it' | 'marketing' | 'business-dev'>('all');
  const [activeActivityTab, setActiveActivityTab] = useState<'all' | 'emails' | 'calls' | 'conversations' | 'meetings' | 'notes' | 'tasks' | 'activity-log'>('all');

  // Get the selected company data based on URL parameter
  const selectedCompany = useMemo(() => {
    return companies.find(company => company.id === params?.id) || companies[0];
  }, [params?.id]);

  // Transform to CompanyData format for the detail page
  const companyData: CompanyData = useMemo(() => ({
    id: selectedCompany.id,
    name: selectedCompany.name,
    logo: selectedCompany.logo,
    domain: selectedCompany.domain,
    description: selectedCompany.description,
    industry: selectedCompany.industry,
    location: selectedCompany.location,
    founded: selectedCompany.foundedYear?.toString() || '2010',
    employees: selectedCompany.employees?.toString() || '100-500',
    revenue: selectedCompany.revenue || '$10M-50M',
    phone: '+1-555-4895',
    tradingSymbol: 'Private Company',
    subsidiaries: 3,
    score: selectedCompany.score || 85,
    rating: 'A+'
  }), [selectedCompany]);

  // Sample data for prospects
  const prospects: ProspectData[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'VP of Sales',
      location: 'San Francisco, CA',
      department: 'Sales Department',
      reason: 'High priority lead',
      actions: ['Email', 'LinkedIn']
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'IT Director',
      location: 'Austin, TX',
      department: 'IT',
      reason: 'Technical decision maker',
      actions: ['Call', 'Email']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Marketing Manager',
      location: 'New York, NY',
      department: 'Marketing',
      reason: 'Budget authority',
      actions: ['Meeting', 'Email']
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'Business Development Lead',
      location: 'Seattle, WA',
      department: 'Business Development',
      reason: 'Partnership opportunities',
      actions: ['Call', 'LinkedIn']
    }
  ];

  // Sample activities data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      title: 'Follow-up email sent to Sarah Johnson',
      description: 'Sent product demo invitation',
      timestamp: '2 hours ago',
      person: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'call',
      title: 'Discovery call with Michael Chen',
      description: '30-minute technical discussion',
      timestamp: '1 day ago',
      status: 'Completed',
      person: 'Michael Chen'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Product demo scheduled',
      description: 'Demo meeting with decision makers',
      timestamp: 'Tomorrow 2:00 PM',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/90 border-b border-slate-700/50 shadow-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/lead-generation" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Companies</span>
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{selectedCompany.name}</h1>
                  <p className="text-slate-400 text-sm">{companyData.industry} • {selectedCompany.location}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium">
                Add to Sequence
              </button>
              <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors shadow-lg font-medium">
                Export
              </button>
              <button className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors shadow-lg">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6 p-6 min-h-screen">
        {/* Left Sidebar - Company Profile (3 columns) */}
        <div className="col-span-3 space-y-6">
          {/* Company Profile Widget */}
          <div className="group bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 p-6 border-b border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-xl">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Company Profile</h2>
                    <p className="text-blue-300 text-sm">{companyData.industry}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCompanyInfoExpanded(!companyInfoExpanded)}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                  data-testid="toggle-company-info"
                >
                  {companyInfoExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-300" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            {companyInfoExpanded && (
              <div className="p-6 space-y-6">
                {/* Company Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                    <Calendar className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{companyData.founded}</div>
                    <div className="text-xs text-green-300">Founded</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                    <Users className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{selectedCompany.employees}</div>
                    <div className="text-xs text-orange-300">Employees</div>
                  </div>
                </div>

                {/* Company Description */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <h4 className="text-slate-300 font-medium mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-400" />
                    About Company
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{companyData.description}</p>
                </div>

                {/* Contact Information */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <h4 className="text-slate-300 font-medium mb-3 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-green-400" />
                    Contact Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Phone</span>
                      <span className="text-white font-medium text-sm">{companyData.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Location</span>
                      <span className="text-white font-medium text-sm">{selectedCompany.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Website</span>
                      <span className="text-blue-400 font-medium text-sm">{selectedCompany.domain}</span>
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <h4 className="text-slate-300 font-medium mb-3 flex items-center">
                    <Search className="h-4 w-4 mr-2 text-cyan-400" />
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.keywords.slice(0, 6).map((keyword, index) => (
                      <span key={index} className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-300 px-2 py-1 rounded-lg text-xs font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Company Score */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                  <h4 className="text-slate-300 font-medium mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-green-400" />
                    Company Score
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">{companyData.rating}</span>
                      </div>
                      <div>
                        <div className="text-green-400 font-medium">Excellent Prospect</div>
                        <div className="text-slate-400 text-xs">High conversion potential</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">{companyData.score}/100</div>
                      <div className="text-slate-400 text-xs">Overall Score</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Column - Main Content (6 columns) */}
        <div className="col-span-6 space-y-6">
          {/* Company Insights Widget */}
          <div className="group bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 p-6 border-b border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">AI-Powered Company Insights</h2>
                  <span className="bg-cyan-600 text-white text-xs px-3 py-1 rounded-full font-medium">AI Powered</span>
                  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">Live Data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400">Updated 2 min ago</span>
                  <button 
                    onClick={() => setInsightsExpanded(!insightsExpanded)}
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                    data-testid="toggle-insights"
                  >
                    {insightsExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-300" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {insightsExpanded && (
              <div className="p-6">
                {/* Insight Tabs */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {[
                    { key: 'score', label: 'Overview', icon: Star, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30' },
                    { key: 'news', label: 'News', icon: FileText, badge: '8', color: 'text-red-400', bg: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30' },
                    { key: 'technologies', label: 'Tech Stack', icon: Target, badge: '15', color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30' },
                    { key: 'funding', label: 'Funding', icon: DollarSign, badge: '3', color: 'text-green-400', bg: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30' },
                    { key: 'job-postings', label: 'Jobs', icon: Briefcase, badge: '12', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30' },
                    { key: 'employee-trends', label: 'Growth', icon: Users, badge: '+24', color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-600/20', border: 'border-orange-500/30' },
                    { key: 'website-visitors', label: 'Traffic', icon: Activity, badge: '2.3M', color: 'text-pink-400', bg: 'from-pink-500/20 to-pink-600/20', border: 'border-pink-500/30' }
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveInsightTab(tab.key as any)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border font-medium ${
                          activeInsightTab === tab.key
                            ? `bg-gradient-to-r ${tab.bg} ${tab.border} text-white shadow-lg scale-105`
                            : `bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700/50 hover:text-white hover:border-slate-600/50`
                        }`}
                        data-testid={`insight-tab-${tab.key}`}
                      >
                        <IconComponent className={`h-5 w-5 ${activeInsightTab === tab.key ? 'text-white' : tab.color}`} />
                        <span className="text-sm">{tab.label}</span>
                        {tab.badge && (
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            activeInsightTab === tab.key 
                              ? 'bg-white/20 text-white' 
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 min-h-[400px]">
                  {/* Score Overview Content */}
                  {activeInsightTab === 'score' && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-6">
                          <div className="text-6xl font-bold text-white">87<span className="text-3xl text-slate-400">/100</span></div>
                          <div className="text-left">
                            <div className="text-xl text-green-400 bg-green-900/50 px-4 py-2 rounded-xl border border-green-700 font-bold">
                              Excellent Prospect
                            </div>
                            <div className="text-sm text-slate-300 mt-2">High conversion potential with strong growth indicators</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700/50">
                          <h4 className="text-slate-200 font-semibold mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                            Growth Indicators
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Revenue Growth</span>
                              <span className="text-green-400 font-bold">+32%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Employee Growth</span>
                              <span className="text-green-400 font-bold">+18%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Market Share</span>
                              <span className="text-blue-400 font-bold">4.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Innovation Score</span>
                              <span className="text-purple-400 font-bold">8.9/10</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700/50">
                          <h4 className="text-slate-200 font-semibold mb-4 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
                            Risk Assessment
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Financial Risk</span>
                              <span className="text-green-400 font-bold">Low</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Competition Risk</span>
                              <span className="text-yellow-400 font-bold">Medium</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Market Risk</span>
                              <span className="text-green-400 font-bold">Low</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Technology Risk</span>
                              <span className="text-green-400 font-bold">Low</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                        <h4 className="text-white font-semibold mb-4 flex items-center">
                          <Target className="h-5 w-5 mr-2 text-blue-400" />
                          AI Recommendations
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-slate-200 text-sm">Ideal timing for outreach</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-slate-200 text-sm">High budget probability</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-slate-200 text-sm">Decision maker accessible</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-slate-200 text-sm">Technology fit: 95%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* News Content */}
                  {activeInsightTab === 'news' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-white font-bold text-lg">Latest News & Mentions</h4>
                        <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Sourced from Google News, LinkedIn, Twitter</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          { 
                            title: `${selectedCompany.name} Announces Major Product Launch`, 
                            source: 'TechCrunch', 
                            time: '2 hours ago', 
                            sentiment: 'positive',
                            summary: 'Company unveils new AI-powered platform expected to disrupt the market with innovative features and competitive pricing.'
                          },
                          { 
                            title: `${selectedCompany.name} Secures Series B Funding`, 
                            source: 'VentureBeat', 
                            time: '1 day ago', 
                            sentiment: 'positive',
                            summary: 'Raises $25M to expand operations and accelerate growth in enterprise markets.'
                          },
                          { 
                            title: `Industry Analysis: ${selectedCompany.industry} Market Trends`, 
                            source: 'Forbes', 
                            time: '3 days ago', 
                            sentiment: 'neutral',
                            summary: 'Market showing strong growth with key players expanding rapidly into new verticals.'
                          }
                        ].map((article, index) => (
                          <div key={index} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-700/30">
                            <div className="flex items-start justify-between mb-3">
                              <h5 className="text-white font-semibold text-sm leading-tight flex-1 mr-3">{article.title}</h5>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                article.sentiment === 'positive' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                article.sentiment === 'negative' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                'bg-slate-600 text-slate-300'
                              }`}>
                                {article.sentiment}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm mb-3 leading-relaxed">{article.summary}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-blue-400 text-sm font-medium">{article.source}</span>
                              <span className="text-slate-400 text-xs">{article.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add similar content blocks for other tabs... */}
                  {activeInsightTab !== 'score' && activeInsightTab !== 'news' && (
                    <div className="text-center py-12">
                      <div className="text-slate-400 text-lg font-medium">
                        {activeInsightTab.charAt(0).toUpperCase() + activeInsightTab.slice(1)} insights coming soon...
                      </div>
                      <p className="text-slate-500 text-sm mt-2">This feature is under development</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* New Prospects Widget */}
          <div className="group bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 p-6 border-b border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Users className="h-6 w-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Key Prospects</h2>
                  <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">{prospects.length} contacts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    <Plus className="h-3 w-3 inline mr-1" />
                    Add Contact
                  </button>
                  <button className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
                    <Filter className="h-4 w-4 text-slate-300" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {prospects.map((prospect) => (
                  <div key={prospect.id} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-700/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {prospect.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{prospect.name}</h4>
                          <p className="text-slate-300 text-sm">{prospect.title}</p>
                          <p className="text-slate-400 text-xs">{prospect.location} • {prospect.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {prospect.actions.map((action, index) => (
                          <button 
                            key={index}
                            className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg hover:bg-slate-600 hover:text-white transition-colors font-medium"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Activities & Actions (3 columns) */}
        <div className="col-span-3 space-y-6">
          {/* Recent Activities Widget */}
          <div className="group bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-green-600/20 p-6 border-b border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Activity className="h-6 w-6 text-green-400" />
                  <h2 className="text-lg font-bold text-white">Recent Activities</h2>
                </div>
                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <Plus className="h-3 w-3 inline mr-1" />
                  Add Activity
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'email' ? 'bg-blue-500/20 text-blue-400' :
                      activity.type === 'call' ? 'bg-green-500/20 text-green-400' :
                      activity.type === 'meeting' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-slate-600/20 text-slate-400'
                    }`}>
                      {activity.type === 'email' && <Mail className="h-4 w-4" />}
                      {activity.type === 'call' && <Phone className="h-4 w-4" />}
                      {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                      {activity.type === 'task' && <CheckCircle className="h-4 w-4" />}
                      {activity.type === 'note' && <MessageSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{activity.title}</h4>
                      <p className="text-slate-300 text-xs mt-1">{activity.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-400 text-xs">{activity.timestamp}</span>
                        {activity.status && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            activity.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                            activity.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-slate-600/20 text-slate-300'
                          }`}>
                            {activity.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="group bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-orange-600/20 via-amber-600/20 to-orange-600/20 p-6 border-b border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5"></div>
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <Target className="h-6 w-6 text-orange-400" />
                  <h2 className="text-lg font-bold text-white">Quick Actions</h2>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium">
                <Mail className="h-5 w-5 inline mr-2" />
                Send Email Campaign
              </button>
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg font-medium">
                <Phone className="h-5 w-5 inline mr-2" />
                Schedule Call
              </button>
              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-medium">
                <Calendar className="h-5 w-5 inline mr-2" />
                Book Meeting
              </button>
              <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg font-medium">
                <Plus className="h-5 w-5 inline mr-2" />
                Add to Sequence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPageBMI;