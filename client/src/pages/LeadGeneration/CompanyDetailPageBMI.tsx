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
  Share,
  Shield,
  CheckCircle
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
  email: string;
  website: string;
  companyType: string;
  stockSymbol?: string;
  lastUpdated: string;
  tags: string[];
  score: number;
  tier: 'Enterprise' | 'Mid-Market' | 'SMB';
  stage: 'Prospect' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  source: string;
  assignedTo: string;
}

interface Deal {
  id: string;
  title: string;
  value: string;
  stage: string;
  probability: number;
  closeDate: string;
  lastActivity: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  assignee: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  type: 'General' | 'Meeting' | 'Call' | 'Email';
}

const CompanyDetailPageBMI: React.FC = () => {
  const [, params] = useRoute('/lead-generation/company/:id');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCompanyInsights, setShowCompanyInsights] = useState(true);
  const [activeInsightTab, setActiveInsightTab] = useState('ai-score');
  const [activeSidebarTab, setActiveSidebarTab] = useState('company-info');

  // Default company data
  const companyData: CompanyData = {
    id: '1',
    name: 'VGI Partners',
    logo: 'VGI',
    domain: 'vgipartners.com',
    description: 'Leading Australian investment management firm focusing on concentrated, high-conviction equity portfolios.',
    industry: 'Financial Services',
    location: 'Sydney, NSW',
    founded: '2008',
    employees: '50-100',
    revenue: '$45M',
    phone: '+61 2 9237 8900',
    email: 'info@vgipartners.com',
    website: 'https://www.vgipartners.com',
    companyType: 'Public',
    stockSymbol: 'VG1.AX',
    lastUpdated: '2025-08-19',
    tags: ['Investment Management', 'Equity Funds', 'ESG'],
    score: 85,
    tier: 'Enterprise',
    stage: 'Qualified',
    source: 'LinkedIn',
    assignedTo: 'Sarah Chen'
  };

  // Sample data
  const deals: Deal[] = [
    {
      id: '1',
      title: 'Enterprise Portfolio Management Platform',
      value: '$2.4M',
      stage: 'Proposal',
      probability: 65,
      closeDate: '2025-09-15',
      lastActivity: '2025-08-18'
    }
  ];

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Prepare investment proposal presentation',
      dueDate: '2025-08-25',
      priority: 'High',
      completed: false,
      assignee: 'Sarah Chen'
    }
  ];

  const notes: Note[] = [
    {
      id: '1',
      content: 'Initial discovery call went well. Strong interest in our enterprise platform.',
      author: 'Sarah Chen',
      timestamp: '2025-08-18 14:30',
      type: 'Call'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header - Fixed below global header */}
      <div className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/lead-generation">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold text-white">
                  VGI
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900" data-testid="text-company-name">
                    {companyData.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="button-phone">
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="button-email">
                <Mail className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="button-website">
                <ExternalLink className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Adjust for fixed header */}
      <div className="pt-32 flex min-h-screen">
        {/* Left Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-200">
            {!sidebarCollapsed && (
              <>
                <button 
                  onClick={() => setActiveSidebarTab('company-info')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeSidebarTab === 'company-info' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Company
                </button>
                <button 
                  onClick={() => setActiveSidebarTab('contacts')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeSidebarTab === 'contacts' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Contacts
                </button>
                <button 
                  onClick={() => setActiveSidebarTab('deals')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeSidebarTab === 'deals' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Deals
                </button>
                <button 
                  onClick={() => setActiveSidebarTab('tasks')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeSidebarTab === 'tasks' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Tasks
                </button>
                <button 
                  onClick={() => setActiveSidebarTab('notes')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeSidebarTab === 'notes' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Notes
                </button>
              </>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {!sidebarCollapsed && (
              <>
                {/* Company Info Tab */}
                {activeSidebarTab === 'company-info' && (
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{companyData.industry}</div>
                          <div className="text-sm text-gray-600">Industry</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{companyData.location}</div>
                          <div className="text-sm text-gray-600">Location</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{companyData.employees}</div>
                          <div className="text-sm text-gray-600">Employees</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{companyData.revenue}</div>
                          <div className="text-sm text-gray-600">Annual Revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Placeholder tabs */}
                {activeSidebarTab === 'contacts' && (
                  <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                      Contacts loading...
                    </div>
                  </div>
                )}

                {activeSidebarTab === 'deals' && (
                  <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                      Deals loading...
                    </div>
                  </div>
                )}

                {activeSidebarTab === 'tasks' && (
                  <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                      Tasks loading...
                    </div>
                  </div>
                )}

                {activeSidebarTab === 'notes' && (
                  <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                      Notes loading...
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showCompanyInsights && (
            <div className="bg-white border-b border-gray-200">
              {/* Company Insights Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Company Intelligence</h2>
                  </div>
                  <button 
                    onClick={() => setShowCompanyInsights(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 py-0">
                <div className="flex space-x-8 border-b border-gray-200">
                  {[
                    { id: 'ai-score', label: 'AI Score', icon: Star },
                    { id: 'news', label: 'News', icon: MessageSquare },
                    { id: 'technologies', label: 'Technologies', icon: Settings },
                    { id: 'funding', label: 'Funding', icon: DollarSign },
                    { id: 'job-postings', label: 'Job Postings', icon: Users }
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveInsightTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeInsightTab === tab.id
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-6 py-6 min-h-96">
                {/* AI Score Tab */}
                {activeInsightTab === 'ai-score' && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                        <span className="text-3xl font-bold text-white">85</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Company AI Score</h3>
                      <p className="text-gray-600 text-sm">Based on comprehensive AI analysis of 247 data points</p>
                    </div>
                  </div>
                )}

                {/* Other Tabs */}
                {activeInsightTab === 'news' && (
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 py-8">
                      News content loading...
                    </div>
                  </div>
                )}

                {activeInsightTab === 'technologies' && (
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 py-8">
                      Technologies content loading...
                    </div>
                  </div>
                )}

                {activeInsightTab === 'funding' && (
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 py-8">
                      Funding content loading...
                    </div>
                  </div>
                )}

                {activeInsightTab === 'job-postings' && (
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 py-8">
                      Job postings content loading...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPageBMI;