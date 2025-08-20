import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, Building2, MapPin, Mail, Phone, ExternalLink,
  Calendar, TrendingUp, Users, Eye, Settings, ChevronUp, ChevronDown,
  Star, Bookmark, Download, Share2, Plus, Edit, MoreHorizontal,
  Briefcase, GraduationCap, Award
} from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';

interface PersonData {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  companyId: string;
  location: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  companyEmployeeCount: string;
  keywords: string[];
  accessibleEmail: boolean;
  accessiblePhone: boolean;
}

interface Contact {
  id: string;
  accountId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  position?: string;
  location?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  workPhone?: string;
  linkedinUrl?: string;
  department?: string;
  reportingManager?: string;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  employees?: number;
  companySize?: string;
  website?: string;
  domain?: string;
  description?: string;
}

interface Activity {
  id: string;
  contactId?: string;
  accountId?: string;
  type: string;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

const PersonDetails: React.FC = () => {
  const [, params] = useRoute('/lead-generation/people/:id');
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('about');

  // Fetch contact data from CRM database
  const { data: contact, isLoading: contactLoading, error: contactError } = useQuery<Contact>({
    queryKey: [`/api/contacts/${params?.id}`],
    enabled: !!params?.id
  });

  // Fetch account data for the contact
  const { data: account, isLoading: accountLoading } = useQuery<Account>({
    queryKey: [`/api/accounts/${contact?.accountId}`],
    enabled: !!contact?.accountId
  });

  // Fetch activities for this contact
  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: [`/api/activities`],
    select: (data: Activity[]) => data.filter((activity: Activity) => activity.contactId === params?.id)
  });

  // If data is loading, show loading state
  if (contactLoading || accountLoading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading person details...</p>
        </div>
      </div>
    );
  }

  // Show error state for API errors or missing contact
  if (contactError || (!contactLoading && !contact)) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Person Not Found</h2>
          <p className="text-gray-600 mb-4">
            {contactError ? 'Error loading person data.' : 'The requested person could not be found in our database.'}
          </p>
          <p className="text-sm text-gray-500 mb-4">ID: {params?.id}</p>
          <button
            onClick={() => setLocation('/lead-generation/people')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to People Discovery
          </button>
        </div>
      </div>
    );
  }

  // Ensure we have a contact object before proceeding
  if (!contact) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading person details...</p>
        </div>
      </div>
    );
  }

  // Create person object from CRM data
  const person: PersonData = {
    id: contact.id,
    name: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown Person',
    jobTitle: contact.title || contact.position || 'N/A',
    company: account?.name || 'Unknown Company',
    companyId: contact.accountId || '',
    location: contact.location || account?.location || 'Unknown',
    email: contact.email || 'N/A',
    phone: contact.phone || contact.mobile || contact.workPhone || 'N/A',
    linkedinUrl: contact.linkedinUrl || '',
    companyEmployeeCount: account?.employees ? `${account.employees} employees` : account?.companySize || 'Unknown',
    keywords: [], // Will be populated based on industry and role
    accessibleEmail: !!contact.email,
    accessiblePhone: !!(contact.phone || contact.mobile || contact.workPhone)
  };

  // Generate keywords based on account industry and contact role
  const generateKeywords = () => {
    const keywords: string[] = [];
    if (account?.industry) {
      const industryKeywords: { [key: string]: string[] } = {
        'technology': ['Software Development', 'Digital Innovation', 'Tech Solutions'],
        'healthcare': ['Medical Technology', 'Healthcare Solutions', 'Patient Care'],
        'finance': ['Financial Services', 'Investment Solutions', 'Fintech'],
        'education': ['Educational Technology', 'Learning Solutions', 'Training'],
        'manufacturing': ['Manufacturing Automation', 'Industrial Solutions', 'Production'],
        'retail': ['E-commerce', 'Retail Technology', 'Customer Experience'],
        'consulting': ['Business Consulting', 'Strategic Solutions', 'Advisory Services']
      };
      keywords.push(...(industryKeywords[account.industry] || ['Business Solutions', 'Professional Services', 'Industry Innovation']));
    }
    
    if (person.jobTitle.toLowerCase().includes('sales')) {
      keywords.push('Sales Management', 'Revenue Growth', 'Customer Acquisition');
    } else if (person.jobTitle.toLowerCase().includes('marketing')) {
      keywords.push('Digital Marketing', 'Brand Strategy', 'Lead Generation');
    } else if (person.jobTitle.toLowerCase().includes('tech')) {
      keywords.push('Technology Leadership', 'Technical Innovation', 'Software Architecture');
    }
    
    return keywords.slice(0, 3);
  };

  person.keywords = generateKeywords();

  const handleBack = () => {
    setLocation('/lead-generation/people');
  };

  const tabs = [
    { id: 'about', label: 'About', count: null },
    { id: 'prospects', label: 'New prospects', count: 1 },
    { id: 'contacts', label: 'Existing contacts', count: null }
  ];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        {/* Breadcrumb */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-1 hover-scale"
            >
              <span>People</span>
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-900 font-medium">{person.name}</span>
          </div>
        </div>

        {/* Person Header */}
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {person.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              {/* Person Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{person.name}</h1>
                  <button className="p-1 hover:bg-gray-100 rounded hover-scale">
                    <Settings className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 mb-1">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{person.jobTitle}</span>
                  <span className="text-gray-400">at</span>
                  <span className="text-blue-600 font-medium">{person.company}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{person.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 btn-hover">
                <Bookmark className="h-4 w-4 inline mr-2" />
                Add to list
              </button>
              <button className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 btn-hover">
                <Download className="h-4 w-4 inline mr-2" />
                Access email
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 btn-hover">
                <Eye className="h-4 w-4 inline mr-2" />
                Person overview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Contact Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Contact information</h3>
              <ChevronUp className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-900">{person.email}</span>
                </div>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 btn-hover">
                  Access email
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-900">{person.phone}</span>
                    <div className="text-xs text-gray-500">Mobile • credit</div>
                  </div>
                </div>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 btn-hover">
                  Access mobile
                </button>
              </div>

              {/* No phone available */}
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-900">No phone number available</div>
                  <div className="text-xs text-gray-500">Business</div>
                </div>
              </div>
            </div>
          </div>

          {/* Work History */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Work history</h3>
              <ChevronUp className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {/* Current Position */}
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{person.company}</div>
                  <div className="text-sm text-gray-600">{person.jobTitle}</div>
                  <div className="text-xs text-gray-500">Current • 2 years</div>
                </div>
              </div>

              {/* Previous Position */}
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{person.company}</div>
                  <div className="text-sm text-gray-600">Manager of Sales</div>
                  <div className="text-xs text-gray-500">Current • 2 years</div>
                </div>
              </div>

              {/* Another Position */}
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">A3Charge</div>
                  <div className="text-sm text-gray-600">Marketing Manager</div>
                  <div className="text-xs text-gray-500">2021 - 2023 • 2 years</div>
                </div>
              </div>

              {/* PayTunes Position */}
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">PayTunes Digital Audio Advertising</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-auto">
          {/* Company Insights Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-900">Company Insights</h2>
                <Settings className="h-4 w-4 text-gray-400" />
                <ChevronUp className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'about' && (
              <div>
                {/* Score Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Score</span>
                    <span className="text-sm text-gray-600">People Auto-Score</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-900">36 / 100</div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Excellent</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>

                {/* Personas Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Personas</h4>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">People located in India</span>
                  </div>
                </div>

                {/* Company Profile */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Company profile</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      Marketing Advertising Industry
                    </span>
                    <span className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full border border-green-200">
                      Advertising Solutions
                    </span>
                    <span className="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                      Advertising Technology
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prospects' && (
              <div>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">{person.company}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Excellent</span>
                      <span className="text-xs text-gray-500">21</span>
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex space-x-6 text-sm border-b border-gray-200 mb-4">
                    <button className="pb-2 text-blue-600 border-b-2 border-blue-600">About</button>
                    <button className="pb-2 text-gray-500">New prospects <span className="ml-1">1</span></button>
                    <button className="pb-2 text-gray-500">Existing contacts</button>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">New prospects</h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">All</button>
                      <button className="px-3 py-1 text-blue-600 bg-blue-50 rounded">Business Development <span className="ml-1">1</span></button>
                    </div>

                    <div className="mt-4 overflow-hidden bg-white rounded border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left p-3 font-medium text-gray-600">Name</th>
                            <th className="text-left p-3 font-medium text-gray-600">Location</th>
                            <th className="text-left p-3 font-medium text-gray-600">Department</th>
                            <th className="text-left p-3 font-medium text-gray-600">Reason</th>
                            <th className="text-left p-3 font-medium text-gray-600">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">Sample Prospect</td>
                            <td className="p-3">Delhi, India</td>
                            <td className="p-3">Business Development</td>
                            <td className="p-3">High match score</td>
                            <td className="p-3">
                              <button className="text-blue-600 hover:text-blue-800">View</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No existing contacts found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;