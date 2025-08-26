import { useState } from 'react';
import { useRoute } from 'wouter';
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
  Clock,
  Plus,
  Filter,
  Search,
  Download,
  MoreVertical,
  ExternalLink,
  Edit,
  MessageCircle,
  User,
  Briefcase,
  Tag,
  Activity,
  AlertCircle,
  Eye,
  Send
} from 'lucide-react';
// Using standard HTML elements with Tailwind CSS styling

interface CompanyEmployee {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  avatar?: string;
}

interface CompanyInsight {
  id: string;
  type: 'news' | 'technology' | 'funding' | 'hiring' | 'job_posting';
  title: string;
  description: string;
  date: string;
  source?: string;
  url?: string;
}

interface SimilarCompany {
  id: string;
  name: string;
  industry: string;
  employeeCount: string;
  revenue?: string;
  location: string;
  logo?: string;
}

interface CompanyActivity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task' | 'note';
  title: string;
  description?: string;
  date: string;
  user: string;
  status?: string;
}

interface CompanyTask {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  createdAt: string;
}

interface CompanyDeal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  owner: string;
}

interface CompanyNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
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
  insights: CompanyInsight[];
  similarCompanies: SimilarCompany[];
  activities: CompanyActivity[];
  tasks: CompanyTask[];
  deals: CompanyDeal[];
  notes: CompanyNote[];
  technologies?: string[];
  fundingHistory?: Array<{
    round: string;
    amount: string;
    date: string;
    investors: string[];
  }>;
}

const CompanyDetailPage = () => {
  const [match, params] = useRoute('/lead-generation/company/:id');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');

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
      }
    ],
    insights: [
      {
        id: '1',
        type: 'news',
        title: 'TechCorp Raises $25M Series B Funding',
        description: 'Company plans to expand AI capabilities and hire 100+ employees',
        date: '2024-01-15',
        source: 'TechCrunch'
      },
      {
        id: '2',
        type: 'technology',
        title: 'Recently Adopted Kubernetes',
        description: 'Infrastructure modernization initiative',
        date: '2024-01-10'
      }
    ],
    similarCompanies: [
      {
        id: '1',
        name: 'AI Innovations',
        industry: 'Technology',
        employeeCount: '151-300',
        revenue: '$25M - $50M',
        location: 'Austin, TX',
        logo: 'AI'
      }
    ],
    activities: [
      {
        id: '1',
        type: 'email',
        title: 'Follow-up email sent',
        description: 'Sent product demo information',
        date: '2024-01-20',
        user: 'Sales Rep'
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Schedule product demo',
        status: 'open',
        priority: 'high',
        assignee: 'John Doe',
        dueDate: '2024-01-25',
        createdAt: '2024-01-20'
      }
    ],
    deals: [
      {
        id: '1',
        title: 'Enterprise AI Platform',
        value: 150000,
        stage: 'Proposal',
        probability: 70,
        expectedCloseDate: '2024-02-15',
        owner: 'Sales Team'
      }
    ],
    notes: [
      {
        id: '1',
        content: 'Very interested in our AI capabilities. Decision maker is the CTO.',
        author: 'Sales Rep',
        createdAt: '2024-01-20',
        tags: ['qualified', 'hot-lead']
      }
    ],
    technologies: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    fundingHistory: [
      {
        round: 'Series B',
        amount: '$25M',
        date: '2024-01-15',
        investors: ['Acme Ventures', 'Tech Capital']
      }
    ]
  };

  const companyData = mockCompanyData;

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add note to local state for demo
      console.log('Adding note:', newNote);
      setNewNote('');
    }
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
                    
                    {companyData.keywords && companyData.keywords.length > 0 && (
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
                    )}

                    {companyData.executives && companyData.executives.length > 0 && (
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
                    )}
                  </div>
                </div>

                {/* Company Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Company Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {companyData.insights.map((insight) => (
                        <div key={insight.id} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{insight.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {insight.type}
                                </Badge>
                                <span className="text-xs text-gray-500">{insight.date}</span>
                                {insight.source && (
                                  <span className="text-xs text-gray-500">• {insight.source}</span>
                                )}
                              </div>
                            </div>
                            {insight.url && (
                              <a href={insight.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Activities Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Activities Timeline
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {companyData.activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{activity.title}</h4>
                              <span className="text-xs text-gray-500">{activity.date}</span>
                            </div>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.type}
                              </Badge>
                              <span className="text-xs text-gray-500">{activity.user}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Prospects Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Key Prospects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {companyData.employees.slice(0, 3).map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{employee.name}</div>
                              <div className="text-xs text-gray-500">{employee.title} • {employee.department}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {employee.email && (
                              <Button variant="outline" size="sm">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Button>
                            )}
                            {employee.phone && (
                              <Button variant="outline" size="sm">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Similar Companies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Similar Companies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {companyData.similarCompanies.map((similar) => (
                        <div key={similar.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gray-200 rounded text-xs flex items-center justify-center">
                              {similar.logo}
                            </div>
                            <span className="font-medium text-sm">{similar.name}</span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>{similar.industry}</div>
                            <div>{similar.employeeCount} employees</div>
                            <div>{similar.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckSquare className="h-5 w-5 mr-2" />
                        Tasks
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {companyData.tasks.map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <Badge 
                              variant={task.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Assigned to: {task.assignee}</div>
                            <div>Due: {task.dueDate}</div>
                            <Badge 
                              variant={task.priority === 'high' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {task.priority} priority
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Deals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Deals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {companyData.deals.map((deal) => (
                        <div key={deal.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{deal.title}</h4>
                            <span className="text-sm font-semibold">${deal.value.toLocaleString()}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>{deal.stage}</span>
                              <span>{deal.probability}%</span>
                            </div>
                            <Progress value={deal.probability} className="h-2" />
                            <div className="text-xs text-gray-600">
                              Expected close: {deal.expectedCloseDate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Add Note */}
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <Button 
                          onClick={handleAddNote}
                          disabled={!newNote.trim() || addNoteMutation.isPending}
                          size="sm"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Add Note
                        </Button>
                      </div>

                      {/* Existing Notes */}
                      <div className="space-y-3">
                        {companyData.notes.map((note) => (
                          <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm mb-2">{note.content}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{note.author}</span>
                              <span>{note.createdAt}</span>
                            </div>
                            {note.tags && note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {note.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Employees ({companyData.employees.length})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search employees..."
                        value={employeeSearchQuery}
                        onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Bulk Email
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Employee Table */}
                <div className="border rounded-lg overflow-hidden">
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
                            Contact
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
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={employee.avatar} />
                                  <AvatarFallback>
                                    {employee.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {employee.name}
                                  </div>
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
                                  <Button variant="ghost" size="sm" className="p-1">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                  </Button>
                                )}
                                {employee.phone && (
                                  <Button variant="ghost" size="sm" className="p-1">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                  </Button>
                                )}
                                {employee.linkedinUrl && (
                                  <Button variant="ghost" size="sm" className="p-1">
                                    <Linkedin className="h-4 w-4 text-gray-400" />
                                  </Button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center space-x-2">
                                {employee.email && (
                                  <Button variant="outline" size="sm">
                                    <Mail className="h-3 w-3 mr-1" />
                                    Email
                                  </Button>
                                )}
                                {employee.phone && (
                                  <Button variant="outline" size="sm">
                                    <Phone className="h-3 w-3 mr-1" />
                                    Call
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyDetailPage;