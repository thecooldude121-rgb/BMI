import React, { useState, useMemo } from 'react';
import { useRoute } from 'wouter';
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
import { companies, CompanyData as SharedCompanyData } from '../../data/companies';

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
  employees: string;
}

const CompanyDetailPageBMI: React.FC = () => {
  const [match, params] = useRoute('/lead-generation/company/:id');
  const companyId = params?.id || '1';
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [activeInsightTab, setActiveInsightTab] = useState('score');
  const [activeActivityTab, setActiveActivityTab] = useState('all');

  // Company data
  const companyData: CompanyData = {
    id: companyId,
    name: 'VGI Partners Ltd',
    logo: 'VGI',
    domain: 'vgipartners.com',
    description: 'Leading investment management company specializing in long-term value creation',
    industry: 'Financial Services',
    location: 'Sydney, NSW, Australia',
    founded: '2008',
    employees: '50-100',
    revenue: '$50M - $100M',
    phone: '+61 2 9237 8900',
    tradingSymbol: 'VG1',
    subsidiaries: 3,
    score: 85,
    rating: 'A+'
  };

  // Sample contacts data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Robert Luciano',
      title: 'Managing Director & Chief Investment Officer',
      department: 'Executive',
      location: 'Sydney, NSW',
      initials: 'RL'
    },
    {
      id: '2', 
      name: 'David Jones',
      title: 'Portfolio Manager',
      department: 'Investment Management',
      location: 'Sydney, NSW',
      initials: 'DJ'
    },
    {
      id: '3',
      name: 'Sarah Chen',
      title: 'Senior Research Analyst',
      department: 'Research',
      location: 'Sydney, NSW',
      initials: 'SC'
    }
  ];

  // Sample prospects data
  const prospects: ProspectData[] = [
    {
      id: '1',
      name: 'Michael Thompson',
      title: 'Investment Director',
      location: 'Sydney, NSW',
      department: 'Investment Management',
      reason: 'New hire',
      actions: ['Access email']
    },
    {
      id: '2',
      name: 'Emma Wilson',
      title: 'Research Manager', 
      location: 'Melbourne, VIC',
      department: 'Research & Analysis',
      reason: 'Promotion',
      actions: ['Access email']
    }
  ];

  // Sample lookalike companies
  const lookalikeCompanies: LookalikeCompany[] = [
    {
      id: '1',
      name: 'Magellan Financial Group',
      logo: 'MF',
      location: 'Sydney, NSW',
      employees: '200-500'
    },
    {
      id: '2',
      name: 'Pendal Group',
      logo: 'PG', 
      location: 'Sydney, NSW',
      employees: '100-200'
    }
  ];

  // Sample activities
  const activities = [
    {
      id: '1',
      type: 'task',
      title: 'Follow up on Q3 investment proposal',
      description: 'Schedule meeting to discuss portfolio allocation strategy',
      timestamp: 'Aug 18, 2025, 10:30 am',
      person: 'Robert Luciano'
    },
    {
      id: '2',
      type: 'email',
      title: 'sales@company.com to Jane Smith',
      description: 'Follow-up on enterprise solution proposal',
      timestamp: 'Aug 15, 2025, 2:18 pm',
      person: 'Jane Smith'
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
            <button className="pb-2 border-b-2 border-blue-500 text-white font-medium text-sm">
              Account
            </button>
            <button className="pb-2 border-b-2 border-transparent text-gray-400 hover:text-white text-sm">
              Contacts
            </button>
            <button className="pb-2 border-b-2 border-transparent text-gray-400 hover:text-white text-sm">
              Deals
            </button>
            <button className="pb-2 border-b-2 border-transparent text-gray-400 hover:text-white text-sm">
              Activities
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Left Sidebar - All Widgets */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <div className="p-3 space-y-3">

            {/* Company Information Widget */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
                <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-blue-400" />
                      <h3 className="font-semibold text-white text-lg">Company Information</h3>
                    </div>
                    <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors" />
                  </div>
                </div>
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-400 font-medium mb-2">ABOUT</h4>
                      <p className="text-gray-300 text-sm">{companyData.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="text-gray-400 font-medium mb-2">INDUSTRY</h4>
                        <p className="text-gray-300">{companyData.industry}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400 font-medium mb-2">LOCATION</h4>
                        <p className="text-gray-300">{companyData.location}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400 font-medium mb-2">EMPLOYEES</h4>
                        <p className="text-gray-300">{companyData.employees}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400 font-medium mb-2">REVENUE</h4>
                        <p className="text-gray-300">{companyData.revenue}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400 font-medium mb-2">PHONE NUMBER</h4>
                        <p className="text-gray-300">{companyData.phone}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400 font-medium mb-2">FOUNDING YEAR</h4>
                        <p className="text-gray-300">{companyData.founded}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
                <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-400" />
                      <h3 className="font-semibold text-white text-lg">Contacts</h3>
                      <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">{contacts.length}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors" />
                      <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="bg-gradient-to-r from-gray-700 to-gray-800 p-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg border border-gray-600 hover:shadow-xl hover:border-blue-500/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                            {contact.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">{contact.name}</div>
                            <div className="text-gray-300 text-xs truncate">{contact.title}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors rounded hover:bg-gray-600">
                              <Mail className="h-3 w-3" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-400 transition-colors rounded hover:bg-gray-600">
                              <Phone className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deals Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
                <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <h3 className="font-semibold text-white text-lg">Deals</h3>
                      <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">0</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-green-400 transition-colors" />
                      <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-green-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl overflow-y-auto">
                  <div className="p-4 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-gray-300 text-sm mb-2 font-medium">
                        No deals yet
                      </div>
                      <div className="text-gray-400 text-xs mb-4">
                        Create your first deal to start tracking opportunities
                      </div>
                      <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 shadow-lg hover:shadow-xl" data-testid="button-add-deal">
                        + Create Deal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Widget */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
                <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckSquare className="h-5 w-5 text-purple-400" />
                      <h3 className="font-semibold text-white text-lg">Tasks</h3>
                      <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">0</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-purple-400 transition-colors" />
                      <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl overflow-y-auto">
                  <div className="p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckSquare className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-gray-300 text-lg mb-3 font-medium">No tasks yet</div>
                      <div className="text-gray-400 text-sm mb-6 max-w-md">
                        Create tasks to track important actions and follow-ups
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl" data-testid="button-add-task">
                        + Add First Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Widget */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
                <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-orange-400" />
                      <h3 className="font-semibold text-white text-lg">Notes</h3>
                      <span className="bg-orange-600 text-white text-sm px-3 py-1 rounded-full">0</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-orange-400 transition-colors" />
                      <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-orange-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl overflow-y-auto">
                  <div className="p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-gray-300 text-lg mb-3 font-medium">No notes yet</div>
                      <div className="text-gray-400 text-sm mb-6 max-w-md">
                        Start documenting important information and insights
                      </div>
                      <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl" data-testid="button-add-note">
                        + Add First Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Full Width */}
        <div className="flex-1 p-3">
          {/* Company Insights Widget */}
          <div className="mb-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
              {/* Widget Header */}
              <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    <h2 className="text-lg font-semibold text-white">Company Insights</h2>
                    <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">AI Powered</span>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Live Data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">Last updated: 2 min ago</span>
                    <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-cyan-400 transition-colors" />
                    <button 
                      onClick={() => setInsightsExpanded(!insightsExpanded)}
                      className="p-1 rounded hover:bg-gray-600 transition-colors"
                      data-testid="toggle-insights"
                    >
                      {insightsExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {insightsExpanded && (
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl p-4">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-gray-300 text-lg mb-3 font-medium">Insights Loading</div>
                    <div className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                      AI-powered company insights will be displayed here
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Prospects */}
          <div className="mb-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
              <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">New prospects</h2>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl p-4">
                <div className="grid grid-cols-4 gap-4 text-xs text-gray-400 font-medium mb-4">
                  <div>PERSON</div>
                  <div>LOCATION</div>
                  <div>REASONING</div>
                  <div>ACTIONS</div>
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
          <div className="mb-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
              <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                <div className="flex items-center justify-between">
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
              </div>

              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl p-4">
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
                  <span>1 - 2 of 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
              <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Activities</h2>
                  <div className="flex items-center space-x-2">
                    <select className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600">
                      <option>Log activity</option>
                    </select>
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl p-4">
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
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPageBMI;