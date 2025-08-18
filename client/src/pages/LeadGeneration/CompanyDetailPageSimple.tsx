import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Globe, 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  Linkedin, 
  Building2, 
  TrendingUp,
  FileText,
  CheckSquare,
  Target,
  Plus,
  Search,
  Download,
  Edit,
  User,
  Briefcase,
  Tag,
  Activity,
  Send,
  MoreVertical,
  ExternalLink,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Newspaper,
  Cpu,
  DollarSign as Funding,
  Calendar as CalendarIcon,
  Briefcase as JobIcon,
  RefreshCw
} from 'lucide-react';

interface CompanyEmployee {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface Technology {
  name: string;
  category: string;
  adoptedAt?: string;
  confidence: number;
}

interface FundingRound {
  id: string;
  type: string;
  amount: string;
  date: string;
  investors: string[];
  valuation?: string;
}

interface EmployeeTrend {
  date: string;
  count: number;
  growth: number;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  postedAt: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  remote: boolean;
  url: string;
}

interface CompanyInsights {
  news: NewsItem[];
  technologies: Technology[];
  fundingHistory: FundingRound[];
  employeeTrends: EmployeeTrend[];
  jobPostings: JobPosting[];
  lastUpdated: string;
}

interface CompanyDetail {
  id: string;
  name: string;
  domain: string;
  industry: string;
  keywords: string[];
  phone?: string;
  website: string;
  founded?: number;
  headquarters: string;
  employeeCount: string;
  revenue?: string;
  ownershipType?: string;
  description?: string;
  logo?: string;
  executives: Array<{
    name: string;
    title: string;
    linkedinUrl?: string;
  }>;
  employees: CompanyEmployee[];
  insights?: CompanyInsights;
}

const CompanyDetailPageSimple = () => {
  const [match, params] = useRoute('/lead-generation/company/:id');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');
  const [refreshingInsights, setRefreshingInsights] = useState(false);

  // Fetch real-time company insights
  const { data: liveInsights, isLoading: insightsLoading, refetch: refetchInsights } = useQuery({
    queryKey: ['/api/lead-generation/company', params?.id, 'insights'],
    enabled: !!params?.id && activeTab === 'insights',
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });

  // Mock company data for demo purposes
  const mockCompanyData: CompanyDetail = {
    id: params?.id || '1',
    name: 'TechCorp Solutions',
    domain: 'techcorp.com',
    industry: 'Technology',
    keywords: ['SaaS', 'Cloud Computing', 'AI', 'Machine Learning'],
    phone: '+1 (555) 123-4567',
    website: 'https://techcorp.com',
    founded: 2018,
    headquarters: 'San Francisco, CA, USA',
    employeeCount: '201-500',
    revenue: '$50M - $100M',
    ownershipType: 'Private',
    description: 'Leading provider of cloud-based AI solutions for enterprises.',
    logo: 'TC',
    executives: [
      { name: 'John Smith', title: 'CEO & Founder', linkedinUrl: 'https://linkedin.com/in/johnsmith' },
      { name: 'Sarah Johnson', title: 'CTO', linkedinUrl: 'https://linkedin.com/in/sarahjohnson' },
      { name: 'Mike Chen', title: 'VP of Sales', linkedinUrl: 'https://linkedin.com/in/mikechen' }
    ],
    employees: [
      {
        id: '1',
        name: 'Alice Cooper',
        title: 'Software Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        email: 'alice.cooper@techcorp.com',
        phone: '+1 (555) 234-5678',
        linkedinUrl: 'https://linkedin.com/in/alicecooper'
      },
      {
        id: '2',
        name: 'Bob Wilson',
        title: 'Product Manager',
        department: 'Product',
        location: 'New York, NY',
        email: 'bob.wilson@techcorp.com',
        phone: '+1 (555) 345-6789'
      },
      {
        id: '3',
        name: 'Carol Davis',
        title: 'Marketing Director',
        department: 'Marketing',
        location: 'Los Angeles, CA',
        email: 'carol.davis@techcorp.com',
        phone: '+1 (555) 456-7890'
      }
    ],
    insights: {
      news: [
        {
          id: 'news-1',
          title: 'TechCorp Solutions Raises $25M Series B to Accelerate AI Development',
          summary: 'The company announced significant funding to expand their AI capabilities and hire 50 new engineers across machine learning and cloud infrastructure teams.',
          url: 'https://techcrunch.com/techcorp-series-b',
          source: 'TechCrunch',
          publishedAt: '2024-01-15',
          sentiment: 'positive'
        },
        {
          id: 'news-2',
          title: 'TechCorp Partners with Major Cloud Provider for Enterprise AI Solutions',
          summary: 'Strategic partnership announced to deliver enhanced AI capabilities to enterprise customers, expanding market reach significantly.',
          url: 'https://businesswire.com/techcorp-partnership',
          source: 'Business Wire',
          publishedAt: '2024-01-10',
          sentiment: 'positive'
        },
        {
          id: 'news-3',
          title: 'Industry Analysis: TechCorp Leading Innovation in AI-Powered Business Solutions',
          summary: 'Market research firm recognizes TechCorp as a key player in the rapidly growing AI business solutions market.',
          url: 'https://forrester.com/ai-solutions-report',
          source: 'Forrester',
          publishedAt: '2024-01-08',
          sentiment: 'positive'
        }
      ],
      technologies: [
        { name: 'React', category: 'Frontend Framework', adoptedAt: '2020-01', confidence: 95 },
        { name: 'Python', category: 'Backend Language', adoptedAt: '2018-06', confidence: 98 },
        { name: 'AWS', category: 'Cloud Platform', adoptedAt: '2019-03', confidence: 92 },
        { name: 'Docker', category: 'Containerization', adoptedAt: '2019-09', confidence: 88 },
        { name: 'TensorFlow', category: 'Machine Learning', adoptedAt: '2021-01', confidence: 85 },
        { name: 'PostgreSQL', category: 'Database', adoptedAt: '2018-06', confidence: 90 },
        { name: 'Kubernetes', category: 'Orchestration', adoptedAt: '2021-06', confidence: 82 },
        { name: 'Redis', category: 'Caching', adoptedAt: '2020-03', confidence: 87 }
      ],
      fundingHistory: [
        {
          id: 'round-1',
          type: 'Series B',
          amount: '$25M',
          date: '2024-01-15',
          investors: ['Sequoia Capital', 'Andreessen Horowitz', 'GV'],
          valuation: '$150M'
        },
        {
          id: 'round-2',
          type: 'Series A',
          amount: '$8M',
          date: '2021-06-10',
          investors: ['Sequoia Capital', 'First Round Capital'],
          valuation: '$40M'
        },
        {
          id: 'round-3',
          type: 'Seed',
          amount: '$2M',
          date: '2019-03-20',
          investors: ['Y Combinator', 'Angel Investors'],
          valuation: '$10M'
        }
      ],
      employeeTrends: [
        { date: '2024-01', count: 387, growth: 8.2 },
        { date: '2023-12', count: 358, growth: 6.5 },
        { date: '2023-11', count: 336, growth: 5.1 },
        { date: '2023-10', count: 320, growth: 4.2 },
        { date: '2023-09', count: 307, growth: 3.8 },
        { date: '2023-08', count: 296, growth: 2.9 }
      ],
      jobPostings: [
        {
          id: 'job-1',
          title: 'Senior AI Engineer',
          department: 'Engineering',
          location: 'San Francisco, CA',
          postedAt: '2024-01-18',
          type: 'Full-time',
          remote: true,
          url: 'https://techcorp.com/careers/senior-ai-engineer'
        },
        {
          id: 'job-2',
          title: 'Product Manager - AI Platform',
          department: 'Product',
          location: 'San Francisco, CA',
          postedAt: '2024-01-16',
          type: 'Full-time',
          remote: false,
          url: 'https://techcorp.com/careers/product-manager-ai'
        },
        {
          id: 'job-3',
          title: 'Data Scientist',
          department: 'Data Science',
          location: 'New York, NY',
          postedAt: '2024-01-14',
          type: 'Full-time',
          remote: true,
          url: 'https://techcorp.com/careers/data-scientist'
        },
        {
          id: 'job-4',
          title: 'Cloud Infrastructure Engineer',
          department: 'Engineering',
          location: 'Austin, TX',
          postedAt: '2024-01-12',
          type: 'Full-time',
          remote: true,
          url: 'https://techcorp.com/careers/cloud-engineer'
        },
        {
          id: 'job-5',
          title: 'Sales Development Representative',
          department: 'Sales',
          location: 'San Francisco, CA',
          postedAt: '2024-01-10',
          type: 'Full-time',
          remote: false,
          url: 'https://techcorp.com/careers/sdr'
        }
      ],
      lastUpdated: '2024-01-20T10:30:00Z'
    }
  };

  const companyData = mockCompanyData;

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log('Adding note:', newNote);
      setNewNote('');
    }
  };

  const refreshInsights = async () => {
    setRefreshingInsights(true);
    try {
      await refetchInsights();
      console.log('Insights refreshed from web sources');
    } catch (error) {
      console.error('Failed to refresh insights:', error);
    } finally {
      setRefreshingInsights(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTechCategoryColor = (category: string) => {
    const colors = {
      'Frontend Framework': 'bg-blue-100 text-blue-800',
      'Backend Language': 'bg-green-100 text-green-800',
      'Cloud Platform': 'bg-purple-100 text-purple-800',
      'Database': 'bg-yellow-100 text-yellow-800',
      'Machine Learning': 'bg-red-100 text-red-800',
      'Containerization': 'bg-indigo-100 text-indigo-800',
      'Orchestration': 'bg-pink-100 text-pink-800',
      'Caching': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {companyData.logo}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{companyData.name}</h1>
                  <p className="text-sm text-gray-500">{companyData.domain}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button className="flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add to CRM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'insights'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Insights
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'employees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Employees
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Information */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Company Information
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Industry:</span>
                          <span className="text-sm text-gray-600">{companyData.industry}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Phone:</span>
                          <span className="text-sm text-gray-600">{companyData.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Website:</span>
                          <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {companyData.website}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Founded:</span>
                          <span className="text-sm text-gray-600">{companyData.founded}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">HQ:</span>
                          <span className="text-sm text-gray-600">{companyData.headquarters}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Employees:</span>
                          <span className="text-sm text-gray-600">{companyData.employeeCount}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Revenue:</span>
                          <span className="text-sm text-gray-600">{companyData.revenue}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Type:</span>
                          <span className="text-sm text-gray-600">{companyData.ownershipType}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Keywords */}
                    <div className="mt-4">
                      <span className="text-sm font-medium mb-2 block">Keywords:</span>
                      <div className="flex flex-wrap gap-2">
                        {companyData.keywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Executives */}
                    <div className="mt-4">
                      <span className="text-sm font-medium mb-2 block">Key Executives:</span>
                      <div className="space-y-2">
                        {companyData.executives.map((exec, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{exec.name}</div>
                              <div className="text-xs text-gray-500">{exec.title}</div>
                            </div>
                            {exec.linkedinUrl && (
                              <a href={exec.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Prospects */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Key Prospects
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {companyData.employees.slice(0, 3).map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{employee.name}</div>
                              <div className="text-xs text-gray-500">{employee.title} • {employee.department}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {employee.email && (
                              <button className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </button>
                            )}
                            {employee.phone && (
                              <button className="flex items-center px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Company Stats */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Company Stats
                    </h3>
                  </div>
                  <div className="px-6 py-4 space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">78%</div>
                      <div className="text-sm text-gray-600">Lead Score</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-gray-900">15</div>
                        <div className="text-xs text-gray-600">Open Deals</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-gray-900">32</div>
                        <div className="text-xs text-gray-600">Activities</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Quick Actions
                    </h3>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email Campaign
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Create Task
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      <FileText className="h-4 w-4 mr-2" />
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Notes
                    </h3>
                  </div>
                  <div className="px-6 py-4 space-y-4">
                    {/* Add Note */}
                    <div className="space-y-2">
                      <textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <button 
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Add Note
                      </button>
                    </div>

                    {/* Sample Notes */}
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm mb-2">Very interested in our AI capabilities. Decision maker is the CTO.</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Sales Rep</span>
                          <span>2024-01-20</span>
                        </div>
                        <div className="flex space-x-1 mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            qualified
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            hot-lead
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            insightsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading real-time insights...</p>
                </div>
              </div>
            ) : liveInsights ? (
            <div className="space-y-6">
              {/* Header with Refresh Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Company Insights</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(liveInsights.lastUpdated).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={refreshInsights}
                  disabled={refreshingInsights}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshingInsights ? 'animate-spin' : ''}`} />
                  {refreshingInsights ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latest News Section */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Newspaper className="h-5 w-5 mr-2" />
                        Latest News Mentions
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {liveInsights.news.length} articles
                        </span>
                      </h3>
                    </div>
                    <div className="px-6 py-4">
                      <div className="space-y-4">
                        {liveInsights.news.map((article) => (
                          <div key={article.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 mb-2">{article.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                                <div className="flex items-center space-x-3 text-xs">
                                  <span className="text-gray-500">{article.source}</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
                                    {article.sentiment}
                                  </span>
                                </div>
                              </div>
                              <a href={article.url} target="_blank" rel="noopener noreferrer" className="ml-3 flex-shrink-0">
                                <ExternalLink className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technologies Adopted */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Cpu className="h-5 w-5 mr-2" />
                      Technologies Adopted
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {liveInsights.technologies.length} technologies
                      </span>
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {liveInsights.technologies.map((tech, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTechCategoryColor(tech.category)}`}>
                              {tech.name}
                            </span>
                            <div className="text-xs text-gray-500">
                              {tech.category}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-gray-500">
                              {tech.confidence}% confidence
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${tech.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Funding History */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Funding className="h-5 w-5 mr-2" />
                      Funding History
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {liveInsights.fundingHistory.reduce((sum, round) => sum + parseFloat(round.amount.replace(/[$M]/g, '')), 0)}M total
                      </span>
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {liveInsights.fundingHistory.map((round) => (
                        <div key={round.id} className="border-l-4 border-purple-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-sm text-gray-900">{round.type}</span>
                                <span className="text-lg font-bold text-purple-600">{round.amount}</span>
                              </div>
                              <div className="text-xs text-gray-500 mb-2">
                                {new Date(round.date).toLocaleDateString()} • Valuation: {round.valuation}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {round.investors.map((investor, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    {investor}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Employee Trends Chart */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Employee Trends
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        +{liveInsights.employeeTrends[0]?.growth || 0}% growth
                      </span>
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {liveInsights.employeeTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(trend.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              {trend.count}
                            </div>
                          </div>
                          <div className={`flex items-center px-2 py-1 rounded text-xs font-medium ${
                            trend.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {trend.growth > 0 ? '+' : ''}{trend.growth}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Job Postings */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <JobIcon className="h-5 w-5 mr-2" />
                      Active Job Postings
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {liveInsights.jobPostings.length} open positions
                      </span>
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {liveInsights.jobPostings.map((job) => (
                        <div key={job.id} className="border-l-4 border-orange-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm text-gray-900">{job.title}</h4>
                                <a href={job.url} target="_blank" rel="noopener noreferrer" className="ml-2 flex-shrink-0">
                                  <ExternalLink className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                                </a>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-800">
                                  {job.department}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {job.type}
                                </span>
                                {job.remote && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Remote
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{job.location}</span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sources Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Real-time Data Sources</h4>
                    <p className="text-sm text-blue-700">
                      This data is automatically updated from multiple sources including LinkedIn, company websites, 
                      job boards, news APIs, and tech stack detection tools. Data refreshes every 24 hours or on-demand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No insights data available</p>
              </div>
            )
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Employees ({companyData.employees.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        placeholder="Search employees..."
                        value={employeeSearchQuery}
                        onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                    <button className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                      <Send className="h-4 w-4 mr-2" />
                      Bulk Email
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                {/* Employee Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {companyData.employees
                        .filter(employee => 
                          employee.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
                          employee.title.toLowerCase().includes(employeeSearchQuery.toLowerCase())
                        )
                        .map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              checked={selectedEmployees.includes(employee.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmployees([...selectedEmployees, employee.id]);
                                } else {
                                  setSelectedEmployees(selectedEmployees.filter(id => id !== employee.id));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700 mr-3">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.title}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.department}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.location}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              {employee.email && (
                                <button className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email
                                </button>
                              )}
                              {employee.phone && (
                                <button className="flex items-center px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Call
                                </button>
                              )}
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPageSimple;