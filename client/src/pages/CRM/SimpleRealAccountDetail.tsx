import React from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Phone, Mail, Globe, Building, Users, TrendingUp, DollarSign } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  industry?: string;
  accountStatus?: string;
  healthScore?: number;
  annualRevenue?: string;
  employees?: number;
  description?: string;
  phone?: string;
  website?: string;
  domain?: string;
  customerSince?: string;
  lastActivityDate?: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  accountId: string;
}

const SimpleRealAccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  // Fetch account data
  const { data: account, isLoading: accountLoading, error: accountError } = useQuery<Account>({
    queryKey: ['/api/accounts', id],
    enabled: !!id
  });

  // Fetch related contacts
  const { data: contacts, isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ['/api/contacts/by-account', id],
    enabled: !!id
  });

  const handleBackToAccounts = () => {
    setLocation('/crm/accounts');
  };

  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (value?: string) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (accountLoading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleBackToAccounts} className="mb-6 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Accounts
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

  if (accountError || !account) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleBackToAccounts} className="mb-6 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Accounts
          </button>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Not Found</h2>
            <p className="text-gray-600">The account you're looking for doesn't exist or you don't have permission to view it.</p>
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
            <button onClick={handleBackToAccounts} className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Accounts
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{account.name}</h1>
              <p className="text-gray-600 mt-1">{account.industry || 'Industry not specified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(account.accountStatus)}`}>
              {account.accountStatus?.toUpperCase() || 'UNKNOWN'}
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2 inline" />
              Edit Account
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Account Overview
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Annual Revenue</label>
                    <p className="text-sm text-gray-900">{formatCurrency(account.annualRevenue)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employees</label>
                    <p className="text-sm text-gray-900">{account.employees ? account.employees.toLocaleString() : 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{account.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    {account.website ? (
                      <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {account.website}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-900">Not provided</p>
                    )}
                  </div>
                </div>
                
                {account.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{account.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Key Contacts */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Key Contacts ({contacts?.length || 0})
                  </h2>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    Add Contact
                  </button>
                </div>
              </div>
              <div className="p-6">
                {contactsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : contacts && contacts.length > 0 ? (
                  <div className="space-y-4">
                    {contacts.slice(0, 3).map((contact) => (
                      <div key={contact.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {contact.firstName?.[0]}{contact.lastName?.[0]}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{contact.title || 'Title not specified'}</p>
                          <p className="text-sm text-gray-500 truncate">{contact.email || 'Email not provided'}</p>
                        </div>
                        <div className="flex space-x-2">
                          {contact.email && (
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Mail className="w-4 h-4" />
                            </button>
                          )}
                          {contact.phone && (
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Phone className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {contacts.length > 3 && (
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        View All {contacts.length} Contacts
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No contacts found for this account</p>
                    <button className="mt-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      Add First Contact
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Score */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Account Health
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className={`w-16 h-16 rounded-full ${getHealthScoreColor(account.healthScore)} flex items-center justify-center text-white font-bold text-lg`}>
                        {account.healthScore || '—'}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Health Score: {account.healthScore || 'Unknown'}/100</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer Since</label>
                  <p className="text-sm text-gray-900">{formatDate(account.customerSince)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Activity</label>
                  <p className="text-sm text-gray-900">{formatDate(account.lastActivityDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Revenue</label>
                  <p className="text-sm text-gray-900">{formatCurrency(account.annualRevenue)}</p>
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
                  Schedule Call
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Create Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRealAccountDetail;