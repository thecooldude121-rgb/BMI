import React from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Phone, Mail, MessageSquare, Calendar, Building, User, Target, TrendingUp, Activity } from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  accountId?: string;
  leadSource?: string;
  status?: string;
  lastTouchDate?: string;
  nextFollowUpDate?: string;
  relationshipScore?: number;
  engagementStatus?: string;
  totalActivities?: number;
  responseRate?: string;
  influenceLevel?: number;
  decisionMaker?: boolean;
  linkedin?: string;
  twitter?: string;
  address?: string;
  timezone?: string;
  preferredContactMethod?: string;
  notes?: string;
}

interface Account {
  id: string;
  name: string;
  industry?: string;
}

const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  // Fetch contact data
  const { data: contact, isLoading: contactLoading, error: contactError } = useQuery<Contact>({
    queryKey: ['/api/contacts', id],
    enabled: !!id
  });

  // Fetch related account data
  const { data: account, isLoading: accountLoading } = useQuery<Account>({
    queryKey: ['/api/accounts', contact?.accountId],
    enabled: !!contact?.accountId
  });

  const handleBackToContacts = () => {
    setLocation('/crm/contacts');
  };

  const handleNavigateToAccount = () => {
    if (contact?.accountId) {
      setLocation(`/crm/accounts/${contact.accountId}`);
    }
  };

  const getEngagementColor = (status?: string) => {
    switch (status) {
      case 'highly_engaged': return 'bg-green-100 text-green-800 border-green-200';
      case 'recently_engaged': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderately_engaged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dormant': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'at_risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'unresponsive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'prospect': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInfluenceLevel = (level?: number) => {
    if (!level) return 'Unknown';
    if (level >= 8) return 'High';
    if (level >= 5) return 'Medium';
    return 'Low';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (contactLoading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleBackToContacts} className="mb-6 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Contacts
          </button>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (contactError || !contact) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleBackToContacts} className="mb-6 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Contacts
          </button>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Not Found</h2>
            <p className="text-gray-600">The contact you're looking for doesn't exist or you don't have permission to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={handleBackToContacts} className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Contacts
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h1>
              <div className="flex items-center mt-1 space-x-4">
                <p className="text-gray-600">{contact.title || 'Title not specified'}</p>
                {account && (
                  <button 
                    onClick={handleNavigateToAccount}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Building className="w-4 h-4 mr-1" />
                    {account.name}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(contact.status)}`}>
              {contact.status?.toUpperCase() || 'UNKNOWN'}
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2 inline" />
              Edit Contact
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Contact Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center mt-1">
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {contact.email}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-900">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <div className="flex items-center mt-1">
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:underline flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {contact.phone}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-900">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile</label>
                    <p className="text-sm text-gray-900 mt-1">{contact.mobile || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="text-sm text-gray-900 mt-1">{contact.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lead Source</label>
                    <p className="text-sm text-gray-900 mt-1">{contact.leadSource || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferred Contact Method</label>
                    <p className="text-sm text-gray-900 mt-1">{contact.preferredContactMethod || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timezone</label>
                    <p className="text-sm text-gray-900 mt-1">{contact.timezone || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900 mt-1">{contact.address || 'Not provided'}</p>
                  </div>
                </div>
                
                {contact.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-sm text-gray-900 mt-1">{contact.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Engagement History */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Engagement History
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Touch Date</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(contact.lastTouchDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Next Follow-up</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(contact.nextFollowUpDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Activities</label>
                      <p className="text-sm text-gray-900 mt-1">{contact.totalActivities || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Response Rate</label>
                      <p className="text-sm text-gray-900 mt-1">{contact.responseRate || '0'}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Score */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Contact Score
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {contact.relationshipScore || '—'}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Relationship Score</p>
                  <p className="text-sm text-gray-600">{contact.relationshipScore || 'Unknown'}/100</p>
                </div>
              </div>
            </div>

            {/* Engagement Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Status & Influence
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Engagement Status</label>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium border ${getEngagementColor(contact.engagementStatus)}`}>
                    {contact.engagementStatus?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Influence Level</label>
                  <p className="text-sm text-gray-900 mt-1">{getInfluenceLevel(contact.influenceLevel)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Decision Maker</label>
                  <p className="text-sm text-gray-900 mt-1">{contact.decisionMaker ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-2">
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Make Call
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Note
                </button>
              </div>
            </div>

            {/* Social Links */}
            {(contact.linkedin || contact.twitter) && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
                </div>
                <div className="p-6 space-y-2">
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center text-blue-600">
                      LinkedIn Profile
                    </a>
                  )}
                  {contact.twitter && (
                    <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center text-blue-600">
                      Twitter Profile
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailPage;