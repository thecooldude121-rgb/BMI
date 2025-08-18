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
    name: 'Sample Company Inc.',
    logo: 'SC',
    domain: 'samplecompany.com',
    description: 'Sample Company Inc. is a technology-focused organization specializing in software development, digital solutions, and business automation services.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    founded: '2015',
    employees: '150 employees',
    revenue: '$25.5M revenue',
    phone: '+1-555-0123',
    tradingSymbol: 'NASDAQ: SMPL',
    subsidiaries: 2,
    score: 85,
    rating: 'Excellent'
  };

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Jane Smith',
      title: 'VP of Sales',
      department: 'Sales',
      location: 'San Francisco, CA',
      initials: 'JS'
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Engineering Manager',
      department: 'Engineering',
      location: 'San Francisco, CA',
      initials: 'MC'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      title: 'Marketing Director',
      department: 'Marketing',
      location: 'San Francisco, CA',
      initials: 'SJ'
    },
    {
      id: '4',
      name: 'David Rodriguez',
      title: 'Chief Technology Officer',
      department: 'Executive',
      location: 'San Francisco, CA',
      initials: 'DR'
    },
    {
      id: '5',
      name: 'Emily Davis',
      title: 'Business Development Manager',
      department: 'Business Development',
      location: 'San Francisco, CA',
      initials: 'ED'
    }
  ];

  const prospects: ProspectData[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      title: 'Sales Director',
      location: 'California, USA',
      department: 'Sales',
      reason: 'High-value prospect match',
      actions: ['Access email']
    },
    {
      id: '2',
      name: 'Maria Garcia',
      title: 'IT Manager',
      location: 'Texas, USA',
      department: 'IT',
      reason: 'Technology decision maker',
      actions: ['Access email']
    }
  ];

  const lookalikeCompanies: LookalikeCompany[] = [
    {
      id: '1',
      name: 'TechFlow Solutions',
      logo: 'TF',
      location: 'Austin, Texas',
      employees: 145,
      actions: ['Save']
    },
    {
      id: '2',
      name: 'Digital Dynamics',
      logo: 'DD',
      location: 'Seattle, Washington',
      employees: 132,
      actions: ['Save']
    },
    {
      id: '3',
      name: 'Innovation Labs Inc.',
      logo: 'IL',
      location: 'Boston, Massachusetts',
      employees: 167,
      actions: ['Save']
    },
    {
      id: '4',
      name: 'Smart Systems Corp',
      logo: 'SS',
      location: 'Denver, Colorado',
      employees: 198,
      actions: ['Save']
    },
    {
      id: '5',
      name: 'Future Tech Group',
      logo: 'FT',
      location: 'Portland, Oregon',
      employees: 124,
      actions: ['Save']
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      title: 'Email opened by Michael Chen',
      description: 'Product demo request and technical requirements discussion',
      timestamp: 'Aug 15, 2025, 3:22 pm',
      status: 'Opened',
      person: 'Michael Chen'
    },
    {
      id: '2',
      type: 'email',
      title: 'sales@samplecompany.com to Jane Smith',
      description: 'Follow-up on enterprise solution proposal\nDear Jane, Thank you for your interest in our enterprise software solutions. As discussed, our platform can help streamline your business processes and improve operational efficiency...',
      timestamp: 'Aug 15, 2025, 2:18 pm',
      person: 'Jane Smith'
    },
    {
      id: '3',
      type: 'task',
      title: 'Scheduled LinkedIn connection request to Sarah Johnson',
      description: 'Connect to discuss marketing automation opportunities',
      timestamp: 'Aug 12, 2025, 9:15 am',
      person: 'Sarah Johnson'
    },
    {
      id: '4',
      type: 'email',
      title: 'Meeting confirmation from David Rodriguez',
      description: 'Technical architecture review meeting scheduled for next week',
      timestamp: 'Aug 10, 2025, 4:30 pm',
      status: 'Confirmed',
      person: 'David Rodriguez'
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
                    software development
                  </span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs block w-fit">
                    business automation
                  </span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs block w-fit">
                    digital solutions
                  </span>
                </div>
                <button className="text-blue-400 text-xs mt-2 hover:text-blue-300">
                  Show all 12
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
                          Companies located in California
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          Technology industry
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Software Development
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          Business Automation
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          Between 101 and 200 employees
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
                      <div className="text-gray-400 text-xs">{contact.title} at Sample Company Inc.</div>
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
                        Follow-up email sent to <span className="text-blue-400">Michael Chen</span>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        Completed on Aug 15, 4:30 PM
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
                        LinkedIn connection request to <span className="text-blue-400">Sarah Johnson</span>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        Completed on Aug 12, 9:15 AM
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