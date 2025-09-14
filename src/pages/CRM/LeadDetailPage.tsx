import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Star,
  TrendingUp,
  Activity,
  MessageSquare,
  FileText,
  Clock,
  User,
  Building,
  Tag,
  DollarSign,
  Target,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: string;
  score: number;
  source: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  value: number;
  stage: string;
  tags: string[];
  notes: string;
  address: string;
  website: string;
  industry: string;
  employees: string;
  revenue: string;
}

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    company: true,
    activity: true,
    analytics: false
  });

  useEffect(() => {
    // Simulate API call to fetch lead data
    const fetchLead = async () => {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockLead: Lead = {
        id: id || '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Solutions Inc.',
        position: 'CTO',
        status: 'qualified',
        score: 85,
        source: 'Website',
        assignedTo: 'Sarah Johnson',
        createdAt: '2024-01-15',
        lastContact: '2024-01-20',
        value: 50000,
        stage: 'Proposal',
        tags: ['Hot Lead', 'Enterprise', 'Decision Maker'],
        notes: 'Very interested in our enterprise solution. Has budget approved.',
        address: '123 Business Ave, San Francisco, CA 94105',
        website: 'https://techsolutions.com',
        industry: 'Technology',
        employees: '100-500',
        revenue: '$10M-$50M'
      };
      
      setTimeout(() => {
        setLead(mockLead);
        setLoading(false);
      }, 500);
    };

    fetchLead();
  }, [id]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead Not Found</h2>
          <p className="text-gray-600 mb-4">The lead you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/crm/leads')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/crm/leads')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                <p className="text-gray-600">{lead.position} at {lead.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>Edit Lead</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleSection('contact')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Contact Information</span>
                </h3>
                {expandedSections.contact ? 
                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                }
              </div>
              {expandedSections.contact && (
                <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">{lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900">{lead.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Contact</p>
                      <p className="text-gray-900">{lead.lastContact}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleSection('company')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>Company Information</span>
                </h3>
                {expandedSections.company ? 
                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                }
              </div>
              {expandedSections.company && (
                <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="text-gray-900 font-medium">{lead.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="text-gray-900">{lead.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employees</p>
                    <p className="text-gray-900">{lead.employees}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-gray-900">{lead.revenue}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Website</p>
                    <a href={lead.website} className="text-blue-600 hover:underline">{lead.website}</a>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleSection('activity')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Activity Timeline</span>
                </h3>
                {expandedSections.activity ? 
                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                }
              </div>
              {expandedSections.activity && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {[
                      { type: 'email', title: 'Email sent', time: '2 hours ago', icon: Mail },
                      { type: 'call', title: 'Phone call completed', time: '1 day ago', icon: Phone },
                      { type: 'note', title: 'Note added', time: '3 days ago', icon: FileText },
                      { type: 'meeting', title: 'Meeting scheduled', time: '1 week ago', icon: Calendar }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <activity.icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Score */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Lead Score</span>
              </h3>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(lead.score)} mb-2`}>
                  {lead.score}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${lead.score}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Out of 100</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Deal Value</span>
                  <span className="font-semibold text-gray-900">${lead.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Source</span>
                  <span className="font-semibold text-gray-900">{lead.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Assigned To</span>
                  <span className="font-semibold text-gray-900">{lead.assignedTo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold text-gray-900">{lead.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Tag className="h-5 w-5 text-blue-600" />
                <span>Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Notes</span>
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{lead.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailPage;