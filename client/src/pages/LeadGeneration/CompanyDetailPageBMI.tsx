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
  const [match, params] = useRoute('/lead-generation/company/:id');
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'recommendations' | 'existing-contacts' | 'sequences' | 'meetings' | 'deals' | 'conversations' | 'locations'>('overview');
  const [contactsExpanded, setContactsExpanded] = useState(true);
  const [notesExpanded, setNotesExpanded] = useState(true);
  const [dealsExpanded, setDealsExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
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
    founded: selectedCompany.founded.toString(),
    employees: selectedCompany.employeeCount,
    revenue: selectedCompany.revenue,
    phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
    tradingSymbol: selectedCompany.funding.includes('Public') ? `NASDAQ: ${selectedCompany.name.substring(0, 4).toUpperCase()}` : 'Private Company',
    subsidiaries: Math.floor(Math.random() * 5) + 1,
    score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
    rating: 'Good'
  }), [selectedCompany]);

  // Generate contacts based on selected company
  const contacts: Contact[] = useMemo(() => {
    const contactList = [
      { name: 'Jane Smith', title: 'VP of Sales', department: 'Sales', initials: 'JS' },
      { name: 'Michael Chen', title: 'Engineering Manager', department: 'Engineering', initials: 'MC' },
      { name: 'Sarah Johnson', title: 'Marketing Director', department: 'Marketing', initials: 'SJ' },
      { name: 'David Rodriguez', title: 'Chief Technology Officer', department: 'Executive', initials: 'DR' },
      { name: 'Emily Davis', title: 'Business Development Manager', department: 'Business Development', initials: 'ED' }
    ];
    
    return contactList.map((contact, index) => ({
      id: (index + 1).toString(),
      ...contact,
      location: selectedCompany.location
    }));
  }, [selectedCompany.location]);

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



      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Sidebar - Company Information, Contacts, and Deals */}
        <div className="w-80 border-r border-gray-700 bg-gray-900 min-h-screen overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Company Information Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
                <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-lg">Company information</h3>
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl">
                  <div className="text-sm text-gray-300 space-y-4">
                    <p>{companyData.description}</p>
                    <div>
                      <h4 className="text-gray-400 font-medium mb-2">INDUSTRIES</h4>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                        {companyData.industry}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-gray-400 font-medium mb-2">KEYWORDS</h4>
                      <div className="space-y-1">
                        {selectedCompany.keywords.slice(0, 3).map((keyword, index) => (
                          <span key={index} className="bg-gray-700 px-2 py-1 rounded text-xs block w-fit">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <button className="text-blue-400 text-xs mt-2 hover:text-blue-300">
                        Show all {selectedCompany.keywords.length}
                      </button>
                    </div>
                    <div>
                      <h4 className="text-gray-400 font-medium mb-2">PHONE NUMBER</h4>
                      <p className="text-gray-300">{companyData.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-gray-400 font-medium mb-2">FOUNDING YEAR</h4>
                      <p className="text-gray-300">{companyData.founded}</p>
                    </div>
                    <div>
                      <h4 className="text-gray-400 font-medium mb-2">SUBSIDIARIES</h4>
                      <p className="text-gray-300">
                        {companyData.name} has {companyData.subsidiaries} subsidiary
                      </p>
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
          </div>
        </div>

        {/* Right Sidebar - Tasks, Notes, and Company Insights */}
        <div className="flex-1 bg-gray-900 min-h-screen overflow-y-auto p-4 space-y-4">

          {/* Tasks Widget - Full Size with Internal Scroll */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
              <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white text-lg">Tasks</h3>
                    <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">3</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-purple-400 transition-colors" />
                    <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl overflow-y-auto">
                <div className="p-4 space-y-3">
                  {[
                    { id: 1, title: 'Follow up on proposal', description: 'Send detailed follow-up email about the product proposal discussed in last meeting', status: 'pending', dueDate: 'Today', priority: 'high' },
                    { id: 2, title: 'Send product demo', description: 'Prepare and send comprehensive product demonstration video', status: 'completed', dueDate: 'Yesterday', priority: 'medium' },
                    { id: 3, title: 'Schedule meeting', description: 'Set up quarterly business review meeting with stakeholders', status: 'pending', dueDate: 'Tomorrow', priority: 'low' }
                  ].map((task) => (
                    <div key={task.id} className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg border border-gray-600 hover:shadow-xl hover:border-purple-500/30">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-4 h-4 rounded-full mt-1 ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'} shadow-lg`}></div>
                          <div className="flex-1">
                            <div className="text-white text-lg font-medium mb-1">{task.title}</div>
                            <div className="text-gray-300 text-sm mb-3">{task.description}</div>
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-400 text-sm">{task.dueDate}</div>
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                task.priority === 'high' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                                task.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' :
                                'bg-blue-900/50 text-blue-300 border border-blue-700'
                              }`}>
                                {task.priority} priority
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          task.status === 'completed' 
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                            : 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg'
                        }`}>
                          {task.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Widget - Full Size with Internal Scroll */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
              <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-orange-400" />
                    <h3 className="font-semibold text-white text-lg">Notes</h3>
                    <span className="bg-orange-600 text-white text-sm px-3 py-1 rounded-full">0</span>
                    <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">New</span>
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

        {/* Main Content Area - Now Full Width */}
        <div className="flex-1 p-3">
          {/* Company Insights Widget */}
          <div className="mb-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner border border-gray-600">
              {/* Widget Header */}
              <div className="p-6 border-b border-gray-600 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-t-xl">
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
                <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl">
                  {/* Enhanced Insight Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { key: 'score', label: 'Score', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-600' },
                      { key: 'news', label: 'News', icon: FileText, badge: '8', color: 'text-red-400', bg: 'bg-red-600' },
                      { key: 'technologies', label: 'Technologies', icon: Target, badge: '15', color: 'text-blue-400', bg: 'bg-blue-600' },
                      { key: 'funding', label: 'Funding', icon: DollarSign, badge: '3', color: 'text-green-400', bg: 'bg-green-600' },
                      { key: 'job-postings', label: 'Jobs', icon: Building2, badge: '12', color: 'text-purple-400', bg: 'bg-purple-600' },
                      { key: 'employee-trends', label: 'Employees', icon: Users, badge: '+24', color: 'text-orange-400', bg: 'bg-orange-600' },
                      { key: 'website-visitors', label: 'Traffic', icon: TrendingUp, badge: '2.3M', color: 'text-pink-400', bg: 'bg-pink-600' }
                    ].map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveInsightTab(tab.key as any)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
                            activeInsightTab === tab.key
                              ? `${tab.bg} text-white border-transparent shadow-lg`
                              : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white'
                          }`}
                          data-testid={`insight-tab-${tab.key}`}
                        >
                          <IconComponent className={`h-4 w-4 ${activeInsightTab === tab.key ? 'text-white' : tab.color}`} />
                          <span className="text-sm font-medium">{tab.label}</span>
                          {tab.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              activeInsightTab === tab.key 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-600 text-gray-300'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Enhanced Content Sections */}
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                    {/* Score Content */}
                    {activeInsightTab === 'score' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="text-5xl font-bold text-white">87<span className="text-2xl text-gray-400">/100</span></div>
                            <div className="space-y-2">
                              <div className="text-lg text-green-400 bg-green-900/50 px-3 py-1 rounded-lg border border-green-700">
                                Excellent Prospect
                              </div>
                              <div className="text-sm text-gray-300">High conversion potential</div>
                            </div>
                          </div>
                          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                            <Star className="h-12 w-12 text-white" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <h4 className="text-gray-400 text-sm mb-3">Growth Indicators</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between"><span className="text-gray-300">Revenue Growth</span><span className="text-green-400">+32%</span></div>
                              <div className="flex justify-between"><span className="text-gray-300">Employee Growth</span><span className="text-green-400">+18%</span></div>
                              <div className="flex justify-between"><span className="text-gray-300">Market Share</span><span className="text-blue-400">4.2%</span></div>
                            </div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <h4 className="text-gray-400 text-sm mb-3">Risk Assessment</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between"><span className="text-gray-300">Financial Risk</span><span className="text-green-400">Low</span></div>
                              <div className="flex justify-between"><span className="text-gray-300">Competition Risk</span><span className="text-yellow-400">Medium</span></div>
                              <div className="flex justify-between"><span className="text-gray-300">Market Risk</span><span className="text-green-400">Low</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* News Content */}
                    {activeInsightTab === 'news' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">Latest News & Mentions</h4>
                          <span className="text-xs text-gray-400">Sourced from Google News, LinkedIn, Twitter</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { 
                              title: `${selectedCompany.name} Announces Major Product Launch`, 
                              source: 'TechCrunch', 
                              time: '2 hours ago', 
                              sentiment: 'positive',
                              summary: 'Company unveils new AI-powered platform expected to disrupt the market'
                            },
                            { 
                              title: `${selectedCompany.name} Secures Series B Funding`, 
                              source: 'VentureBeat', 
                              time: '1 day ago', 
                              sentiment: 'positive',
                              summary: 'Raises $25M to expand operations and accelerate growth'
                            },
                            { 
                              title: `Industry Analysis: ${selectedCompany.industry} Market Trends`, 
                              source: 'Forbes', 
                              time: '3 days ago', 
                              sentiment: 'neutral',
                              summary: 'Market showing strong growth with key players expanding rapidly'
                            }
                          ].map((article, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="text-white font-medium text-sm leading-tight">{article.title}</h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  article.sentiment === 'positive' ? 'bg-green-900/50 text-green-300' :
                                  article.sentiment === 'negative' ? 'bg-red-900/50 text-red-300' :
                                  'bg-gray-600 text-gray-300'
                                }`}>
                                  {article.sentiment}
                                </span>
                              </div>
                              <p className="text-gray-300 text-xs mb-2">{article.summary}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-blue-400 text-xs">{article.source}</span>
                                <span className="text-gray-400 text-xs">{article.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technologies Content */}
                    {activeInsightTab === 'technologies' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">Technology Stack</h4>
                          <span className="text-xs text-gray-400">Data from BuiltWith, Wappalyzer, GitHub</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <h5 className="text-blue-400 font-medium mb-3">Frontend</h5>
                            <div className="space-y-2">
                              {['React', 'TypeScript', 'Tailwind CSS', 'Next.js'].map((tech, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-gray-300 text-sm">{tech}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <h5 className="text-green-400 font-medium mb-3">Backend</h5>
                            <div className="space-y-2">
                              {['Node.js', 'Express', 'PostgreSQL', 'Redis'].map((tech, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-gray-300 text-sm">{tech}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <h5 className="text-orange-400 font-medium mb-3">Infrastructure</h5>
                            <div className="space-y-2">
                              {['AWS', 'Docker', 'Kubernetes', 'CloudFlare'].map((tech, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span className="text-gray-300 text-sm">{tech}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Funding Content */}
                    {activeInsightTab === 'funding' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">Funding History</h4>
                          <span className="text-xs text-gray-400">Data from Crunchbase, PitchBook</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { round: 'Series B', amount: '$25M', date: 'Mar 2024', investors: ['Sequoia Capital', 'Andreessen Horowitz'], valuation: '$150M' },
                            { round: 'Series A', amount: '$8M', date: 'Sep 2022', investors: ['First Round Capital', 'Bessemer Ventures'], valuation: '$40M' },
                            { round: 'Seed', amount: '$2M', date: 'Jan 2021', investors: ['Y Combinator', 'Angel Investors'], valuation: '$10M' }
                          ].map((funding, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">{funding.round}</span>
                                  <span className="text-white font-bold text-lg">{funding.amount}</span>
                                </div>
                                <span className="text-gray-400 text-sm">{funding.date}</span>
                              </div>
                              <div className="mb-2">
                                <span className="text-gray-300 text-sm">Valuation: </span>
                                <span className="text-green-400 font-medium">{funding.valuation}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {funding.investors.map((investor, i) => (
                                  <span key={i} className="bg-gray-700 text-blue-400 px-2 py-1 rounded text-xs">{investor}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Job Postings Content */}
                    {activeInsightTab === 'job-postings' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">Active Job Postings</h4>
                          <span className="text-xs text-gray-400">Data from LinkedIn, Indeed, Glassdoor</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-green-400">12</div>
                            <div className="text-sm text-gray-300">Active Positions</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-blue-400">48</div>
                            <div className="text-sm text-gray-300">Total This Month</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {[
                            { title: 'Senior Software Engineer', department: 'Engineering', location: 'San Francisco, CA', posted: '2 days ago', applicants: 234 },
                            { title: 'Product Manager', department: 'Product', location: 'Remote', posted: '5 days ago', applicants: 156 },
                            { title: 'Sales Director', department: 'Sales', location: 'New York, NY', posted: '1 week ago', applicants: 89 },
                            { title: 'DevOps Engineer', department: 'Engineering', location: 'Austin, TX', posted: '1 week ago', applicants: 123 }
                          ].map((job, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="text-white font-medium">{job.title}</h5>
                                  <div className="flex items-center space-x-3 text-sm text-gray-300 mt-1">
                                    <span>{job.department}</span>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-blue-400 text-sm">{job.applicants} applicants</div>
                                  <div className="text-gray-400 text-xs">{job.posted}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Employee Trends Content */}
                    {activeInsightTab === 'employee-trends' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">Employee Growth Trends</h4>
                          <span className="text-xs text-gray-400">Data from LinkedIn, industry reports</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-green-400">+24</div>
                            <div className="text-sm text-gray-300">New Hires (30d)</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-blue-400">18%</div>
                            <div className="text-sm text-gray-300">Growth Rate</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-orange-400">156</div>
                            <div className="text-sm text-gray-300">Total Employees</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-gray-300 font-medium">Top Hiring Departments</h5>
                          {[
                            { dept: 'Engineering', hires: 12, growth: '+15%' },
                            { dept: 'Sales', hires: 8, growth: '+22%' },
                            { dept: 'Marketing', hires: 4, growth: '+12%' }
                          ].map((dept, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-600">
                              <span className="text-white">{dept.dept}</span>
                              <div className="flex items-center space-x-3">
                                <span className="text-blue-400">{dept.hires} new hires</span>
                                <span className="text-green-400">{dept.growth}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Website Visitors Content */}
                    {activeInsightTab === 'website-visitors' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">Website Traffic Analytics</h4>
                          <span className="text-xs text-gray-400">Data from SimilarWeb, Alexa</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-purple-400">2.3M</div>
                            <div className="text-sm text-gray-300">Monthly Visitors</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                            <div className="text-2xl font-bold text-green-400">+34%</div>
                            <div className="text-sm text-gray-300">Growth (YoY)</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-gray-300 font-medium">Traffic Sources</h5>
                          {[
                            { source: 'Organic Search', percentage: 45, visitors: '1.04M' },
                            { source: 'Direct', percentage: 30, visitors: '690K' },
                            { source: 'Social Media', percentage: 15, visitors: '345K' },
                            { source: 'Referral', percentage: 10, visitors: '230K' }
                          ].map((source, index) => (
                            <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white">{source.source}</span>
                                <span className="text-blue-400">{source.visitors}</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                                  style={{ width: `${source.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Prospects */}
          <div className="mb-3">
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
          <div className="mb-3">
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


      </div>
    </div>
  );
};

export default CompanyDetailPageBMI;