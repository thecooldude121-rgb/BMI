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
  const [activeInsightTab, setActiveInsightTab] = useState('ai-score');
  const [activeActivityTab, setActiveActivityTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const contactsPerPage = 5;

  // All contacts data (expanded to show data from both LinkedIn and local database)
  const allContacts = [
    // Page 1 contacts
    {
      name: "Sarah Mitchell",
      title: "Chief Investment Officer",
      department: "Investment Management",
      location: "Sydney, NSW",
      source: "LinkedIn Premium",
      email: "s.mitchell@vgipartners.com",
      phone: "+61 2 8267 8000",
      connection: "2nd degree",
      lastActivity: "2 hours ago",
      verified: true
    },
    {
      name: "David Chen",
      title: "Senior Portfolio Manager",
      department: "Equities Division",
      location: "Melbourne, VIC",
      source: "Company Database",
      email: "d.chen@vgipartners.com", 
      phone: "+61 2 8267 8015",
      connection: "Direct contact",
      lastActivity: "1 day ago",
      verified: true
    },
    {
      name: "Emma Rodriguez",
      title: "ESG Investment Specialist",
      department: "Sustainable Investing",
      location: "Sydney, NSW",
      source: "LinkedIn Sales Navigator",
      email: "e.rodriguez@vgipartners.com",
      phone: "+61 2 8267 8023",
      connection: "3rd degree", 
      lastActivity: "3 days ago",
      verified: false
    },
    {
      name: "Michael Thompson",
      title: "Head of Research",
      department: "Investment Research",
      location: "Sydney, NSW",
      source: "Company Database", 
      email: "m.thompson@vgipartners.com",
      phone: "+61 2 8267 8045",
      connection: "Direct contact",
      lastActivity: "5 days ago",
      verified: true
    },
    {
      name: "Jennifer Wong",
      title: "Quantitative Analyst", 
      department: "Research & Analytics",
      location: "Brisbane, QLD",
      source: "LinkedIn Premium",
      email: "j.wong@vgipartners.com",
      phone: "+61 2 8267 8067",
      connection: "2nd degree",
      lastActivity: "1 week ago",
      verified: true
    },
    // Page 2 contacts
    {
      name: "Robert Anderson",
      title: "Senior Fund Manager",
      department: "Investment Management",
      location: "Perth, WA",
      source: "LinkedIn Sales Navigator",
      email: "r.anderson@vgipartners.com",
      phone: "+61 2 8267 8071",
      connection: "1st degree",
      lastActivity: "2 days ago",
      verified: true
    },
    {
      name: "Lisa Zhang",
      title: "Risk Management Director",
      department: "Risk & Compliance",
      location: "Sydney, NSW", 
      source: "Company Database",
      email: "l.zhang@vgipartners.com",
      phone: "+61 2 8267 8089",
      connection: "Direct contact",
      lastActivity: "4 hours ago",
      verified: true
    },
    {
      name: "James Wilson",
      title: "Client Relationship Manager",
      department: "Client Services",
      location: "Melbourne, VIC",
      source: "LinkedIn Premium",
      email: "j.wilson@vgipartners.com",
      phone: "+61 2 8267 8092",
      connection: "2nd degree",
      lastActivity: "1 day ago",
      verified: true
    },
    {
      name: "Maria Santos",
      title: "Investment Analyst",
      department: "Investment Research",
      location: "Adelaide, SA",
      source: "LinkedIn Sales Navigator",
      email: "m.santos@vgipartners.com",
      phone: "+61 2 8267 8105",
      connection: "3rd degree",
      lastActivity: "6 days ago",
      verified: false
    },
    {
      name: "Thomas Lee",
      title: "Portfolio Operations Manager",
      department: "Operations",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "t.lee@vgipartners.com",
      phone: "+61 2 8267 8118",
      connection: "Direct contact",
      lastActivity: "3 days ago",
      verified: true
    },
    // Page 3 contacts
    {
      name: "Alexandra Johnson",
      title: "Senior Investment Advisor",
      department: "Client Advisory",
      location: "Canberra, ACT",
      source: "LinkedIn Premium",
      email: "a.johnson@vgipartners.com",
      phone: "+61 2 8267 8125",
      connection: "2nd degree",
      lastActivity: "5 hours ago",
      verified: true
    },
    {
      name: "Kevin O'Connor",
      title: "Head of Trading",
      department: "Trading & Execution",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "k.oconnor@vgipartners.com",
      phone: "+61 2 8267 8139",
      connection: "Direct contact",
      lastActivity: "1 hour ago",
      verified: true
    },
    {
      name: "Rachel Kim",
      title: "Compliance Officer",
      department: "Risk & Compliance",
      location: "Melbourne, VIC",
      source: "LinkedIn Sales Navigator",
      email: "r.kim@vgipartners.com",
      phone: "+61 2 8267 8142",
      connection: "3rd degree",
      lastActivity: "2 weeks ago",
      verified: false
    },
    {
      name: "Daniel Martinez",
      title: "Technology Director",
      department: "Information Technology",
      location: "Brisbane, QLD",
      source: "LinkedIn Premium",
      email: "d.martinez@vgipartners.com",
      phone: "+61 2 8267 8156",
      connection: "1st degree",
      lastActivity: "4 days ago",
      verified: true
    },
    {
      name: "Sophie Turner",
      title: "Marketing Manager",
      department: "Marketing & Communications",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "s.turner@vgipartners.com",
      phone: "+61 2 8267 8163",
      connection: "Direct contact",
      lastActivity: "1 week ago",
      verified: true
    },
    // Page 4 contacts
    {
      name: "Andrew Phillips",
      title: "Senior Research Analyst",
      department: "Investment Research",
      location: "Darwin, NT",
      source: "LinkedIn Sales Navigator",
      email: "a.phillips@vgipartners.com",
      phone: "+61 2 8267 8177",
      connection: "2nd degree",
      lastActivity: "3 hours ago",
      verified: true
    },
    {
      name: "Catherine Brown",
      title: "Human Resources Director",
      department: "Human Resources",
      location: "Melbourne, VIC",
      source: "Company Database",
      email: "c.brown@vgipartners.com",
      phone: "+61 2 8267 8184",
      connection: "Direct contact",
      lastActivity: "2 days ago",
      verified: true
    },
    {
      name: "Nathan Davis",
      title: "Alternative Investments Manager",
      department: "Alternative Investments",
      location: "Perth, WA",
      source: "LinkedIn Premium",
      email: "n.davis@vgipartners.com",
      phone: "+61 2 8267 8191",
      connection: "3rd degree",
      lastActivity: "1 week ago",
      verified: false
    },
    {
      name: "Victoria Garcia",
      title: "Financial Controller",
      department: "Finance & Accounting",
      location: "Adelaide, SA",
      source: "LinkedIn Sales Navigator",
      email: "v.garcia@vgipartners.com",
      phone: "+61 2 8267 8205",
      connection: "2nd degree",
      lastActivity: "5 days ago",
      verified: true
    },
    {
      name: "Benjamin Clark",
      title: "Investment Operations Analyst",
      department: "Operations",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "b.clark@vgipartners.com",
      phone: "+61 2 8267 8212",
      connection: "Direct contact",
      lastActivity: "8 hours ago",
      verified: true
    },
    // Page 5 contacts
    {
      name: "Isabella Rodriguez",
      title: "Client Services Manager",
      department: "Client Services",
      location: "Brisbane, QLD",
      source: "LinkedIn Premium",
      email: "i.rodriguez@vgipartners.com",
      phone: "+61 2 8267 8229",
      connection: "1st degree",
      lastActivity: "6 hours ago",
      verified: true
    },
    {
      name: "Christopher Moore",
      title: "Legal Counsel",
      department: "Legal & Compliance",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "c.moore@vgipartners.com",
      phone: "+61 2 8267 8236",
      connection: "Direct contact",
      lastActivity: "3 days ago",
      verified: true
    },
    {
      name: "Olivia White",
      title: "Data Analyst",
      department: "Research & Analytics",
      location: "Melbourne, VIC",
      source: "LinkedIn Sales Navigator",
      email: "o.white@vgipartners.com",
      phone: "+61 2 8267 8243",
      connection: "2nd degree",
      lastActivity: "4 days ago",
      verified: true
    }
  ];

  // Get current page contacts
  const getCurrentPageContacts = () => {
    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;
    return allContacts.slice(startIndex, endIndex);
  };

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
                  {/* Enhanced Insight Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { key: 'ai-score', label: 'AI Score', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-600' },
                      { key: 'news', label: 'News', icon: FileText, badge: '8', color: 'text-red-400', bg: 'bg-red-600' },
                      { key: 'technologies', label: 'Technologies', icon: Target, badge: '15', color: 'text-blue-400', bg: 'bg-blue-600' },
                      { key: 'funding', label: 'Funding', icon: DollarSign, badge: '3', color: 'text-green-400', bg: 'bg-green-600' },
                      { key: 'job-postings', label: 'Jobs', icon: Building2, badge: '12', color: 'text-purple-400', bg: 'bg-purple-600' }
                    ].map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveInsightTab(tab.key)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                            activeInsightTab === tab.key
                              ? `${tab.bg} text-white shadow-lg`
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                          data-testid={`insight-tab-${tab.key}`}
                        >
                          <IconComponent className={`h-4 w-4 ${activeInsightTab === tab.key ? 'text-white' : tab.color}`} />
                          <span className="text-sm font-medium">{tab.label}</span>
                          {tab.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              activeInsightTab === tab.key ? 'bg-white bg-opacity-20' : 'bg-gray-600'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-96">
                    {/* AI Score Tab */}
                    {activeInsightTab === 'ai-score' && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                            <span className="text-3xl font-bold text-white">85</span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">Company AI Score</h3>
                          <p className="text-gray-300 text-sm">Based on comprehensive AI analysis of 247 data points</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-400 text-sm">Financial Health</span>
                              <span className="text-green-400 font-medium">92/100</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-400 text-sm">Market Position</span>
                              <span className="text-blue-400 font-medium">78/100</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-400 text-sm">Growth Potential</span>
                              <span className="text-purple-400 font-medium">89/100</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{width: '89%'}}></div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-400 text-sm">Tech Innovation</span>
                              <span className="text-cyan-400 font-medium">81/100</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div className="bg-cyan-500 h-2 rounded-full" style={{width: '81%'}}></div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                          <h4 className="text-white font-medium mb-3">Key AI Insights</h4>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                              <span>Strong revenue growth trajectory with 34% YoY increase</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                              <span>Leading market position in Australian investment management</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                              <span>Expanding digital transformation initiatives</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                              <span>High employee retention and satisfaction rates</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* News Tab */}
                    {activeInsightTab === 'news' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Latest News & Mentions</h3>
                          <span className="text-xs text-gray-400">Updated 2 hours ago</span>
                        </div>
                        
                        {[
                          {
                            title: "VGI Partners Reports Strong Q3 Performance",
                            source: "Australian Financial Review",
                            sentiment: "positive",
                            date: "2 hours ago",
                            summary: "Investment management firm shows continued growth in assets under management"
                          },
                          {
                            title: "VGI Partners Expands ESG Investment Strategy",
                            source: "LinkedIn Company Update",
                            sentiment: "positive", 
                            date: "1 day ago",
                            summary: "New sustainable investment initiatives launched targeting $500M AUM"
                          },
                          {
                            title: "Market Analysis: Australian Investment Firms Outlook",
                            source: "Bloomberg",
                            sentiment: "neutral",
                            date: "3 days ago",
                            summary: "Industry report mentions VGI Partners among top performing funds"
                          },
                          {
                            title: "VGI Partners Leadership Changes",
                            source: "Google News",
                            sentiment: "neutral",
                            date: "1 week ago",
                            summary: "Senior portfolio manager appointment strengthens investment team"
                          }
                        ].map((article, index) => (
                          <div key={index} className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-white font-medium text-sm leading-tight pr-4">{article.title}</h4>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                article.sentiment === 'positive' ? 'bg-green-900 text-green-300' :
                                article.sentiment === 'negative' ? 'bg-red-900 text-red-300' :
                                'bg-gray-600 text-gray-300'
                              }`}>
                                {article.sentiment}
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-3">{article.summary}</p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{article.source}</span>
                              <span>{article.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technologies Tab */}
                    {activeInsightTab === 'technologies' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Technology Stack & Platforms</h3>
                          <span className="text-xs text-gray-400">Last scanned: 4 hours ago</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-white font-medium mb-3">Core Infrastructure</h4>
                            <div className="space-y-2">
                              {[
                                { name: "Microsoft Azure", confidence: "95%", category: "Cloud" },
                                { name: "Office 365", confidence: "98%", category: "Productivity" },
                                { name: "Bloomberg Terminal", confidence: "92%", category: "Financial Data" },
                                { name: "Salesforce", confidence: "87%", category: "CRM" }
                              ].map((tech, index) => (
                                <div key={index} className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-lg border border-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white text-sm font-medium">{tech.name}</span>
                                    <span className="text-blue-400 text-xs">{tech.confidence}</span>
                                  </div>
                                  <span className="text-gray-400 text-xs">{tech.category}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-3">Investment & Analytics</h4>
                            <div className="space-y-2">
                              {[
                                { name: "FactSet", confidence: "89%", category: "Research Platform" },
                                { name: "Refinitiv Eikon", confidence: "91%", category: "Market Data" },
                                { name: "Python/R", confidence: "85%", category: "Analytics" },
                                { name: "Tableau", confidence: "78%", category: "Visualization" }
                              ].map((tech, index) => (
                                <div key={index} className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-lg border border-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white text-sm font-medium">{tech.name}</span>
                                    <span className="text-green-400 text-xs">{tech.confidence}</span>
                                  </div>
                                  <span className="text-gray-400 text-xs">{tech.category}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                          <h4 className="text-white font-medium mb-3">Recent Technology Adoptions</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">AI/ML Analytics Platform</span>
                              <span className="text-cyan-400 text-xs">Added 2 weeks ago</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">Enhanced Cybersecurity Suite</span>
                              <span className="text-purple-400 text-xs">Added 1 month ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Funding Tab */}
                    {activeInsightTab === 'funding' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Funding History & Financial Data</h3>
                          <span className="text-xs text-gray-400">Source: Crunchbase, Public Records</span>
                        </div>

                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg border border-gray-600">
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-green-400 mb-2">$2.1B</div>
                            <div className="text-gray-300">Total Assets Under Management</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="text-lg font-semibold text-blue-400 mb-1">IPO (2017)</div>
                            <div className="text-sm text-gray-300 mb-2">Listed on ASX</div>
                            <div className="text-xs text-gray-400">Market Cap: $450M</div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="text-lg font-semibold text-green-400 mb-1">Revenue</div>
                            <div className="text-sm text-gray-300 mb-2">$45M (2023)</div>
                            <div className="text-xs text-gray-400">+34% YoY Growth</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-white font-medium">Key Financial Metrics</h4>
                          {[
                            { metric: "Price-to-Earnings Ratio", value: "18.5", trend: "stable" },
                            { metric: "Return on Equity", value: "22.4%", trend: "up" },
                            { metric: "Dividend Yield", value: "4.2%", trend: "up" },
                            { metric: "Net Profit Margin", value: "31.8%", trend: "up" }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-lg border border-gray-600">
                              <span className="text-gray-300 text-sm">{item.metric}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium">{item.value}</span>
                                <div className={`w-2 h-2 rounded-full ${
                                  item.trend === 'up' ? 'bg-green-500' :
                                  item.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                                }`}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Job Postings Tab */}
                    {activeInsightTab === 'job-postings' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Active Job Postings</h3>
                          <span className="text-xs text-gray-400">12 active positions</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">8</div>
                            <div className="text-xs text-gray-400">Investment Roles</div>
                          </div>
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-green-400 mb-1">3</div>
                            <div className="text-xs text-gray-400">Tech Positions</div>
                          </div>
                          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-purple-400 mb-1">1</div>
                            <div className="text-xs text-gray-400">Operations</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {[
                            {
                              title: "Senior Portfolio Manager",
                              department: "Investment Management",
                              location: "Sydney, NSW",
                              source: "LinkedIn",
                              posted: "3 days ago",
                              urgent: true
                            },
                            {
                              title: "Quantitative Research Analyst",
                              department: "Research & Analytics",
                              location: "Sydney, NSW", 
                              source: "Indeed",
                              posted: "1 week ago",
                              urgent: false
                            },
                            {
                              title: "ESG Investment Specialist",
                              department: "Sustainable Investing",
                              location: "Sydney, NSW",
                              source: "Glassdoor",
                              posted: "5 days ago",
                              urgent: true
                            },
                            {
                              title: "Senior Data Engineer",
                              department: "Technology",
                              location: "Sydney, NSW",
                              source: "LinkedIn",
                              posted: "2 days ago",
                              urgent: false
                            }
                          ].map((job, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="text-white font-medium text-sm">{job.title}</h4>
                                    {job.urgent && (
                                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">Urgent</span>
                                    )}
                                  </div>
                                  <div className="text-gray-300 text-sm">{job.department}</div>
                                  <div className="text-gray-400 text-xs">{job.location}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Source: {job.source}</span>
                                <span>{job.posted}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600">
                          <h4 className="text-white font-medium mb-3">Hiring Trends Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">Average time to fill</span>
                              <span className="text-blue-400 text-sm font-medium">45 days</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">Most in-demand skills</span>
                              <span className="text-green-400 text-sm font-medium">Portfolio Analysis, ESG</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">Salary range trend</span>
                              <span className="text-purple-400 text-sm font-medium">+12% vs last year</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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

          {/* Key Prospects Widget */}
          <div className="mb-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
              <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-400" />
                    <h2 className="text-lg font-semibold text-white">Key Prospects</h2>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Live Data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">{allContacts.length} contacts found</span>
                    <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl p-4">
                {/* List Header */}
                <div className="grid grid-cols-5 gap-4 text-xs text-gray-400 font-medium mb-4 pb-2 border-b border-gray-700">
                  <div>NAME</div>
                  <div>TITLE</div>
                  <div>DEPARTMENT</div>
                  <div>LOCATION</div>
                  <div>ACTIONS</div>
                </div>
                
                {/* Prospects List */}
                <div className="space-y-2">
                  {getCurrentPageContacts().map((contact, index) => (
                    <div key={index} className="relative group">
                      <div className="grid grid-cols-5 gap-4 py-3 px-2 rounded-lg hover:bg-gray-700/30 transition-colors border-b border-gray-700/50 cursor-pointer">
                        {/* Name with Avatar */}
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-medium text-sm flex items-center space-x-1">
                              <span className="truncate">
                                {contact.name}
                              </span>
                              {contact.verified && (
                                <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Title */}
                        <div className="flex flex-col justify-center min-w-0">
                          <div className="text-gray-300 text-sm truncate">
                            {contact.title}
                          </div>
                        </div>
                        
                        {/* Department */}
                        <div className="flex flex-col justify-center min-w-0">
                          <div className="text-gray-300 text-sm truncate mb-1">
                            {contact.department}
                          </div>
                          <div className="text-gray-400 text-xs truncate">
                            {contact.connection} • Active {contact.lastActivity}
                          </div>
                        </div>
                        
                        {/* Location */}
                        <div className="flex flex-col justify-center min-w-0">
                          <div className="text-gray-300 text-sm truncate mb-1">
                            {contact.location}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full w-fit truncate ${
                            contact.source.includes('LinkedIn') 
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30' 
                              : 'bg-green-600/20 text-green-300 border border-green-600/30'
                          }`}>
                            {contact.source}
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors">
                            Contact
                          </button>
                          <button className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded transition-colors">
                            View
                          </button>
                        </div>
                      </div>

                      {/* Detailed Hover Card */}
                      <div className="absolute left-0 top-full mt-2 w-96 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border border-gray-600 shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="flex items-start space-x-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            {/* Header */}
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-white font-semibold text-base">{contact.name}</h3>
                                {contact.verified && (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                )}
                              </div>
                              <div className="text-gray-300 font-medium">{contact.title}</div>
                              <div className="text-gray-400 text-sm">{contact.department}</div>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-2 border-t border-gray-600 pt-3">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-blue-400" />
                                <span className="text-gray-300 text-sm">{contact.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-green-400" />
                                <span className="text-gray-300 text-sm">{contact.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-purple-400" />
                                <span className="text-gray-300 text-sm">{contact.location}</span>
                              </div>
                            </div>

                            {/* Status & Source */}
                            <div className="flex items-center justify-between border-t border-gray-600 pt-3">
                              <div>
                                <div className="text-gray-400 text-xs">Connection</div>
                                <div className="text-gray-300 text-sm">{contact.connection}</div>
                              </div>
                              <div>
                                <div className="text-gray-400 text-xs">Last Activity</div>
                                <div className="text-gray-300 text-sm">{contact.lastActivity}</div>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                contact.source.includes('LinkedIn') 
                                  ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30' 
                                  : 'bg-green-600/20 text-green-300 border border-green-600/30'
                              }`}>
                                {contact.source}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600">
                  <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * contactsPerPage) + 1}-{Math.min(currentPage * contactsPerPage, allContacts.length)} of {allContacts.length} contacts
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded transition-colors disabled:opacity-50" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          className={`w-8 h-8 text-sm rounded transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors disabled:opacity-50"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
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