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
    enabled: !!params?.id,
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
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Information Card */}
                <div className="bg-gray-800 text-white rounded-lg shadow border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    <button className="text-gray-400 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-gray-300 text-sm mb-4">{companyData.description}</p>
                    <button className="text-blue-400 text-sm hover:text-blue-300">Show More</button>
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">INDUSTRIES</h4>
                        <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {companyData.industry}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">KEYWORDS</h4>
                        <div className="flex flex-wrap gap-2">
                          {companyData.keywords.map((keyword, index) => (
                            <span key={index} className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">SUBSIDIARIES</h4>
                        <p className="text-gray-300 text-sm">{companyData.name} has 1 subsidiary</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">PHONE NUMBER</h4>
                          <p className="text-gray-300 text-sm">{companyData.phone || 'Not available'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">TRADING SYMBOL</h4>
                          <p className="text-gray-300 text-sm">Not public</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">FOUNDING YEAR</h4>
                          <p className="text-gray-300 text-sm">{companyData.founded}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">EMPLOYEES</h4>
                          <p className="text-gray-300 text-sm">{companyData.employeeCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Insights Section */}
                {insightsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Loading real-time company insights...</p>
                      <p className="text-sm text-gray-500 mt-2">Fetching data from LinkedIn, Crunchbase, and other sources</p>
                    </div>
                  </div>
                ) : liveInsights && (
                  <div className="bg-gray-800 text-white rounded-lg shadow border border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Company Insights</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={refreshInsights}
                          disabled={refreshingInsights}
                          className="text-gray-400 hover:text-white"
                        >
                          <RefreshCw className={`h-4 w-4 ${refreshingInsights ? 'animate-spin' : ''}`} />
                        </button>
                        <button className="text-gray-400 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="px-6 py-4">
                      {/* Score Section */}
                      <div className="mb-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-3xl font-bold">30</div>
                          <div className="text-lg text-gray-400">/ 100</div>
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Excellent</span>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex space-x-6 border-b border-gray-700">
                          <button className="pb-2 text-white border-b-2 border-white text-sm">Score</button>
                          <button className="pb-2 text-gray-400 hover:text-white text-sm">News</button>
                          <button className="pb-2 text-gray-400 hover:text-white text-sm flex items-center">
                            Technologies <span className="ml-1 text-xs bg-gray-600 px-1 rounded">{liveInsights.technologies?.length || 0}</span>
                          </button>
                          <button className="pb-2 text-gray-400 hover:text-white text-sm">Funding rounds</button>
                          <button className="pb-2 text-gray-400 hover:text-white text-sm">Job postings</button>
                          <button className="pb-2 text-gray-400 hover:text-white text-sm flex items-center">
                            Employee trends <span className="ml-1 text-xs bg-gray-600 px-1 rounded">24</span>
                          </button>
                          <button className="pb-2 text-gray-400 hover:text-white text-sm">Website visitors</button>
                        </div>
                      </div>
                      
                      {/* Company Profile Tags */}
                      <div className="mb-6">
                        <h4 className="text-sm text-gray-400 mb-3">Company profile</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            Companies located in {companyData.headquarters.split(',')[1]?.trim() || 'United States'}
                          </span>
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {companyData.industry} industry
                          </span>
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {companyData.industry}
                          </span>
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Between 51 and 100 employees
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* New Prospects Section */}
                <div className="bg-gray-800 text-white rounded-lg shadow border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">New prospects</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    {/* Filter Tabs */}
                    <div className="flex space-x-6 border-b border-gray-700 mb-4">
                      <button className="pb-2 text-white border-b-2 border-white text-sm">All</button>
                      <button className="pb-2 text-gray-400 hover:text-white text-sm flex items-center">
                        Sales Department <span className="ml-1 text-xs bg-gray-600 px-1 rounded">1</span>
                      </button>
                      <button className="pb-2 text-gray-400 hover:text-white text-sm flex items-center">
                        IT <span className="ml-1 text-xs bg-gray-600 px-1 rounded">1</span>
                      </button>
                      <button className="pb-2 text-gray-400 hover:text-white text-sm flex items-center">
                        marketing head <span className="ml-1 text-xs bg-gray-600 px-1 rounded">1</span>
                      </button>
                      <button className="pb-2 text-gray-400 hover:text-white text-sm flex items-center">
                        Business Development <span className="ml-1 text-xs bg-gray-600 px-1 rounded">1</span>
                      </button>
                    </div>
                    
                    {/* Prospect List */}
                    <div className="space-y-3">
                      {companyData.executives.slice(0, 3).map((exec, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{exec.name}</p>
                              <p className="text-xs text-gray-400">{exec.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{companyData.headquarters.split(',')[0]}</span>
                            <span className="text-xs text-gray-400">{exec.title.includes('Sales') ? 'Sales' : 'Management'}</span>
                            <div className="flex items-center space-x-1">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span className="text-xs text-blue-400">Similar to past prospects</span>
                            </div>
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                              Access email
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-400">1 - 5 of 38</span>
                      <button className="ml-4 text-sm text-blue-400 hover:text-blue-300">View All</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Contacts Card */}
                <div className="bg-gray-800 text-white rounded-lg shadow border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Contacts</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-white">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-4 space-y-4">
                    {companyData.executives.slice(0, 4).map((exec, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {exec.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{exec.name}</p>
                          <p className="text-xs text-gray-400">{exec.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deals Card */}
                <div className="bg-gray-800 text-white rounded-lg shadow border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Deals</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-white">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-8 text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-8 w-8 text-gray-500" />
                    </div>
                    <h4 className="text-sm font-medium text-white mb-2">Add deals to associate with this account</h4>
                    <p className="text-xs text-gray-400 mb-4">to track all sales activities</p>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Add deal
                    </button>
                  </div>
                </div>

                {/* Notes Card */}
                <div className="bg-gray-800 text-white rounded-lg shadow border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">Notes</h3>
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">New</span>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="px-6 py-8 text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-500" />
                    </div>
                    <h4 className="text-sm font-medium text-white mb-2">No notes found</h4>
                    <p className="text-xs text-gray-400 mb-4">Try adding a note, or adjusting your filters. Learn more.</p>
                    <button className="px-4 py-2 bg-yellow-500 text-black text-sm rounded hover:bg-yellow-400">
                      Add note
                    </button>
                  </div>
                </div>

                {/* Tasks Card */}
                <div className="bg-gray-800 text-white rounded-lg shadow border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-white">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-sm text-gray-400 mb-3">Completed tasks</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Mail className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">Email sent to movingwalls.com skipped a task to send linkedin connection request</p>
                          <p className="text-xs text-gray-400 mt-1">Skipped at Jun 12, 1:06 AM</p>
                          <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded mt-2">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
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