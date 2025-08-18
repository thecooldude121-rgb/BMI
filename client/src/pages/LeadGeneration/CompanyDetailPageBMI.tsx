import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  ExternalLink, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Settings, 
  Filter, 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  Save,
  Eye,
  TrendingUp,
  Star,
  MessageSquare,
  FileText,
  CheckSquare,
  Search,
  Download,
  Share
} from 'lucide-react';
import { Link } from 'wouter';

interface Contact {
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

interface LookalikeCompany {
  id: string;
  name: string;
  logo: string;
  location: string;
  employees: number;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'recommendations' | 'existing-contacts' | 'sequences' | 'meetings' | 'deals' | 'conversations' | 'locations'>('overview');
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [contactsExpanded, setContactsExpanded] = useState(true);
  const [notesExpanded, setNotesExpanded] = useState(true);
  const [dealsExpanded, setDealsExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [activeProspectTab, setActiveProspectTab] = useState<'all' | 'sales-dept' | 'it' | 'marketing' | 'business-dev'>('all');
  const [activeInsightTab, setActiveInsightTab] = useState<'score' | 'news' | 'technologies' | 'funding' | 'job-postings' | 'employee-trends' | 'website-visitors'>('score');
  const [activeActivityTab, setActiveActivityTab] = useState<'all' | 'emails' | 'calls' | 'conversations' | 'meetings' | 'notes' | 'tasks' | 'activity-log'>('all');

  // Sample company data
  const companyData: CompanyData = {
    id: '1',
    name: 'VGI Public Company Limited',
    logo: 'VGI',
    domain: 'vgi.co.th',
    description: 'VGI Public Company Limited is a Thailand-based conglomerate specializing in advertising, digital services, and distribution. Founded in 1995 and headquartered in Bangkok, Thailand.',
    industry: 'Marketing & Advertising',
    location: 'Bangkok, Thailand',
    founded: '1998',
    employees: '90 employees',
    revenue: '$144.3M revenue',
    phone: '+66227338884',
    tradingSymbol: 'SET: VGI-R.BK',
    subsidiaries: 1,
    score: 30,
    rating: 'Excellent'
  };

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Chama Savetbodi',
      title: 'Head of Marketing & Communications',
      department: 'Marketing',
      location: 'Bangkok, Thailand',
      initials: 'CS'
    },
    {
      id: '2',
      name: 'Lerpong Nilkhiew',
      title: 'IT Manager',
      department: 'IT',
      location: 'Bangkok, Thailand',
      initials: 'LN'
    },
    {
      id: '3',
      name: 'Kridsanakorn Rungjit',
      title: 'Brand and Marketing communications manager',
      department: 'Marketing',
      location: 'Bangkok, Thailand',
      initials: 'KR'
    },
    {
      id: '4',
      name: 'Nelson Leung',
      title: 'Chief Executive Officer',
      department: 'Executive',
      location: 'Bangkok, Thailand',
      initials: 'NL'
    },
    {
      id: '5',
      name: 'Wanlop Ismairikulmitr',
      title: 'Senior Marketing Manager',
      department: 'Marketing',
      location: 'Bangkok, Thailand',
      initials: 'WI'
    }
  ];

  const prospects: ProspectData[] = [
    {
      id: '1',
      name: 'Rattayagorn Petch...',
      title: 'Sales Manager',
      location: 'Thailand',
      department: 'Sales',
      reason: 'Similar to past prospects',
      actions: ['Access email']
    }
  ];

  const lookalikeCompanies: LookalikeCompany[] = [
    {
      id: '1',
      name: 'MAER GROUP',
      logo: 'MG',
      location: 'Russia',
      employees: 28,
      actions: ['Save']
    },
    {
      id: '2',
      name: 'Cemark',
      logo: 'CM',
      location: 'Loures, Portugal',
      employees: 20,
      actions: ['Save']
    },
    {
      id: '3',
      name: 'SYNERGIC Sp. z o.o.',
      logo: 'SY',
      location: 'Warszawa, Poland',
      employees: 21,
      actions: ['Save']
    },
    {
      id: '4',
      name: 'R2OOH - Mídia OO...',
      logo: 'R2',
      location: 'Rio de Janeiro, Brazil',
      employees: 7,
      actions: ['Save']
    },
    {
      id: '5',
      name: 'dePoste',
      logo: 'DP',
      location: 'Paracuellos de Jarama, Spain',
      employees: 6,
      actions: ['Save']
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      title: 'Email opened by Lerpong Nilkhiew',
      description: 'VGI Public Company Limited x Movingwalls - Advertising Collaboration',
      timestamp: 'Jun 11, 2025, 2:45 pm',
      status: 'Opened',
      person: 'Lerpong Nilkhiew'
    },
    {
      id: '2',
      type: 'email',
      title: 'chatit.sen@movingwalls.com to Lerpong Nilkhiew',
      description: 'Step 1 of LMX: Media owners_APAC\nVGI Public Company Limited x Movingwalls - Advertising Collaboration\nDear Lerpong, If VGI Public Company Limited is looking to improve revenue generation and reduce costs, our OOH management platform might be worth a look. LMX gives you full control...',
      timestamp: 'Jun 11, 2025, 2:44 pm',
      person: 'Lerpong Nilkhiew'
    },
    {
      id: '3',
      type: 'task',
      title: 'chatit.sen@movingwalls.com skipped a task to send linkedin connection request Kridsanakorn Rungjit',
      description: '',
      timestamp: 'Jun 05, 2025, 6:32 am',
      person: 'Kridsanakorn Rungjit'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/lead-generation">
                <button 
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                  VGI
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white" data-testid="text-company-name">
                    {companyData.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{companyData.industry}</span>
                    <span>•</span>
                    <span>{companyData.location}</span>
                    <span>•</span>
                    <span>{companyData.employees}</span>
                    <span>•</span>
                    <span>{companyData.revenue}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" data-testid="button-phone">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" data-testid="button-email">
                <Mail className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" data-testid="button-external">
                <ExternalLink className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" data-testid="button-list">
                <MoreHorizontal className="h-5 w-5" />
              </button>
              <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium">
                Actions
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 mt-4">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'employees', label: 'Employees' },
              { key: 'recommendations', label: 'Recommendations' },
              { key: 'existing-contacts', label: 'Existing contacts' },
              { key: 'sequences', label: 'Sequences', badge: '0' },
              { key: 'meetings', label: 'Meetings' },
              { key: 'deals', label: 'Deals' },
              { key: 'conversations', label: 'Conversations' },
              { key: 'locations', label: 'Locations' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                data-testid={`tab-${tab.key}`}
              >
                <span className="flex items-center space-x-1">
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-gray-600 text-xs px-1.5 py-0.5 rounded">
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Account Overview Button */}
      <div className="px-6 py-3 bg-gray-800 border-b border-gray-700">
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm" data-testid="button-account-overview">
          <Building2 className="h-4 w-4" />
          <span>Account overview</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 h-screen overflow-y-auto">
          {/* Company Information */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Company information</h3>
              <ChevronUp className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-sm text-gray-300 space-y-2">
              <p>{companyData.description}</p>
              <div className="mt-4">
                <h4 className="text-gray-400 font-medium mb-2">INDUSTRIES</h4>
                <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                  {companyData.industry}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-gray-400 font-medium mb-2">KEYWORDS</h4>
                <div className="space-y-1">
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs block w-fit">
                    offline+online solutions
                  </span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs block w-fit">
                    automotive media
                  </span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs block w-fit">
                    transit advertising
                  </span>
                </div>
                <button className="text-blue-400 text-xs mt-2 hover:text-blue-300">
                  Show all 49
                </button>
              </div>
              <div className="mt-4">
                <h4 className="text-gray-400 font-medium mb-2">SUBSIDIARIES</h4>
                <p className="text-gray-300">
                  {companyData.name} has {companyData.subsidiaries} subsidiary
                </p>
              </div>
            </div>
          </div>

          {/* Record Details */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Record details</h3>
              <ChevronUp className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">PHONE NUMBER</span>
                <p className="text-gray-300">{companyData.phone}</p>
              </div>
              <div>
                <span className="text-gray-400">TRADING SYMBOL</span>
                <p className="text-gray-300">{companyData.tradingSymbol}</p>
              </div>
              <div>
                <span className="text-gray-400">FOUNDING YEAR</span>
                <p className="text-gray-300">{companyData.founded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Company Insights */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Company insights</h2>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-400" />
                {insightsExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            {insightsExpanded && (
              <div className="bg-gray-800 rounded-lg p-4">
                {/* Insight Tabs */}
                <div className="flex space-x-4 mb-4 border-b border-gray-700">
                  {[
                    { key: 'score', label: 'Score' },
                    { key: 'news', label: 'News' },
                    { key: 'technologies', label: 'Technologies', badge: '12' },
                    { key: 'funding', label: 'Funding rounds' },
                    { key: 'job-postings', label: 'Job postings' },
                    { key: 'employee-trends', label: 'Employee trends', badge: '24' },
                    { key: 'website-visitors', label: 'Website visitors' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveInsightTab(tab.key as any)}
                      className={`pb-2 border-b-2 transition-colors text-sm ${
                        activeInsightTab === tab.key
                          ? 'border-blue-500 text-white'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                      data-testid={`insight-tab-${tab.key}`}
                    >
                      <span className="flex items-center space-x-1">
                        <span>{tab.label}</span>
                        {tab.badge && (
                          <span className="bg-gray-600 text-xs px-1.5 py-0.5 rounded">
                            {tab.badge}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Score Content */}
                {activeInsightTab === 'score' && (
                  <div>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl font-bold text-white">
                        {companyData.score}/100
                      </div>
                      <div className="text-sm text-green-400 bg-green-900 px-2 py-1 rounded">
                        {companyData.rating}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-gray-400 text-sm mb-2">Company profile</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          Companies located in Thailand
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          Marketing Advertising industry
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Marketing Advertising
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          Advertising Services
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          Between 51 and 100 employees
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* New Prospects */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">New prospects</h2>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-400" />
                <ChevronUp className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              {/* Prospect Tabs */}
              <div className="flex space-x-4 mb-4">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'sales-dept', label: 'Sales Department', badge: '1' },
                  { key: 'it', label: 'IT', badge: '1' },
                  { key: 'marketing', label: 'marketing head', badge: '1' },
                  { key: 'business-dev', label: 'Business Development', badge: '1' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveProspectTab(tab.key as any)}
                    className={`pb-2 border-b-2 transition-colors text-sm ${
                      activeProspectTab === tab.key
                        ? 'border-blue-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                    data-testid={`prospect-tab-${tab.key}`}
                  >
                    <span className="flex items-center space-x-1">
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className="bg-gray-600 text-xs px-1.5 py-0.5 rounded">
                          {tab.badge}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              <div className="text-sm text-gray-400 mb-4">
                1 - 5 of 38 &nbsp;&nbsp; View All
              </div>

              {/* Prospects Table */}
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4 text-xs text-gray-400 font-medium">
                  <div>NAME</div>
                  <div>LOCATION</div>
                  <div>DEPARTMENT/REASON</div>
                  <div>ACTION</div>
                </div>
                {prospects.map((prospect) => (
                  <div key={prospect.id} className="grid grid-cols-4 gap-4 py-2 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                        {prospect.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-medium">{prospect.name}</div>
                        <div className="text-gray-400 text-sm">{prospect.title}</div>
                      </div>
                    </div>
                    <div className="text-gray-300">{prospect.location}</div>
                    <div className="space-y-1">
                      <div className="text-white">{prospect.department}</div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-blue-400" />
                        <span className="text-blue-400 text-xs">{prospect.reason}</span>
                      </div>
                      <div className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded w-fit">
                        Tenured
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors" data-testid="button-access-email">
                        ✓ Access email
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lookalike Companies */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-white">Lookalike companies</h2>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Beta</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  Apollo AI
                </span>
              </div>
              <ChevronUp className="h-4 w-4 text-gray-400" />
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4 text-xs text-gray-400 font-medium mb-4">
                <div>NAME</div>
                <div>LOCATION</div>
                <div>NUMBER OF EMPLOYEES</div>
                <div>ACTIONS</div>
              </div>
              <div className="space-y-3">
                {lookalikeCompanies.map((company) => (
                  <div key={company.id} className="grid grid-cols-4 gap-4 py-2 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-xs font-semibold">
                        {company.logo}
                      </div>
                      <div className="text-white font-medium">{company.name}</div>
                    </div>
                    <div className="text-gray-300">{company.location}</div>
                    <div className="text-gray-300">{company.employees}</div>
                    <div>
                      <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors" data-testid={`button-save-${company.id}`}>
                        <Plus className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                <span>1 - 5 of 100</span>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Activities</h2>
              <div className="flex items-center space-x-2">
                <select className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600">
                  <option>Log activity</option>
                </select>
                <ChevronUp className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              {/* Activity Tabs */}
              <div className="flex space-x-4 mb-4 border-b border-gray-700">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'emails', label: 'Emails' },
                  { key: 'calls', label: 'Calls' },
                  { key: 'conversations', label: 'Conversations' },
                  { key: 'meetings', label: 'Meetings' },
                  { key: 'notes', label: 'Notes' },
                  { key: 'tasks', label: 'Tasks' },
                  { key: 'activity-log', label: 'Activity log' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveActivityTab(tab.key as any)}
                    className={`pb-2 border-b-2 transition-colors text-sm ${
                      activeActivityTab === tab.key
                        ? 'border-blue-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                    data-testid={`activity-tab-${tab.key}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-white font-medium">Upcoming</div>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm" data-testid="button-filter">
                  <Filter className="h-4 w-4" />
                  <span>Filter 6/6</span>
                </button>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border-l-2 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {activity.type === 'email' && (
                            <Mail className="h-4 w-4 text-green-400" />
                          )}
                          {activity.type === 'task' && (
                            <CheckSquare className="h-4 w-4 text-blue-400" />
                          )}
                          <span className="text-white font-medium text-sm">{activity.title}</span>
                        </div>
                        {activity.description && (
                          <div className="text-gray-300 text-sm mb-2">
                            {activity.description}
                          </div>
                        )}
                        {activity.status && (
                          <div className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded w-fit mb-2">
                            {activity.status} 1
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 h-screen overflow-y-auto">
          {/* Contacts */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Contacts</h3>
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-gray-400" />
                {contactsExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            {contactsExpanded && (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {contact.initials}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{contact.name}</div>
                      <div className="text-gray-400 text-xs">{contact.title} at {companyData.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white">Notes</h3>
                <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">New</span>
              </div>
              <div className="flex items-center space-x-2">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                {notesExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            {notesExpanded && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-gray-300 text-sm mb-2">No notes found</div>
                <div className="text-gray-400 text-xs mb-4">
                  Try adding a note, or adjusting your filters. <span className="text-blue-400">Learn more.</span>
                </div>
                <button className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium hover:bg-yellow-400 transition-colors" data-testid="button-add-note">
                  + Add note
                </button>
              </div>
            )}
          </div>

          {/* Deals */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Deals</h3>
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-gray-400" />
                {dealsExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            {dealsExpanded && (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-gray-300 text-sm mb-2">
                  Add deals to associate with this account to track all sales activities
                </div>
                <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors" data-testid="button-add-deal">
                  Add deal
                </button>
              </div>
            )}
          </div>

          {/* Tasks */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Tasks</h3>
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-gray-400" />
                {tasksExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            {tasksExpanded && (
              <div>
                <div className="text-gray-300 text-sm mb-3">Completed tasks</div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                      <CheckSquare className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm">
                        chatit.sen@movingwalls.com skipped a task to send linkedin connection request <span className="text-blue-400">Lerpong Nilkhiew</span>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        Skipped at Jun 12, 1:06 AM
                      </div>
                      <div className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded w-fit mt-1">
                        Completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                      <CheckSquare className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm">
                        chatit.sen@movingwalls.com skipped a task to send linkedin connection request <span className="text-blue-400">Lerpong Nilkhiew</span>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        Skipped at Jun 12, 1:06 AM
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

export default CompanyDetailPageBMI;