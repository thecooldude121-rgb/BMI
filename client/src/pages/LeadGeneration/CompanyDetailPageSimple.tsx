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
  Plus,
  Search,
  Download,
  Edit,
  User,
  Briefcase,
  Tag,
  Activity,
  Send,
  MoreVertical
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
}

const CompanyDetailPageSimple = () => {
  const [match, params] = useRoute('/lead-generation/company/:id');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
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
    ]
  };

  const companyData = mockCompanyData;

  const handleAddNote = () => {
    if (newNote.trim()) {
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