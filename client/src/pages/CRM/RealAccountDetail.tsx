import React from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
// Using standard HTML elements with Tailwind CSS styling
import { ArrowLeft, Edit, Phone, Mail, Globe, MapPin, Building, Users, Calendar, TrendingUp, FileText, Target, DollarSign } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  companySize?: string;
  annualRevenue?: string;
  website?: string;
  phone?: string;
  description?: string;
  accountType?: string;
  accountStatus?: string;
  accountSegment?: string;
  employees?: number;
  foundedYear?: number;
  healthScore?: number;
  customerSince?: string;
  lastActivityDate?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
  address?: any;
  linkedinUrl?: string;
  twitterHandle?: string;
  logoUrl?: string;
  technologies?: any[];
  tags?: any[];
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

interface Deal {
  id: string;
  name: string;
  value?: string;
  stage?: string;
  probability?: number;
  accountId: string;
  expectedCloseDate?: string;
}

const RealAccountDetail: React.FC = () => {
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

  // Fetch related deals
  const { data: deals, isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: ['/api/deals/by-account', id],
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

  const getHealthScoreLabel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'At Risk';
    return 'Critical';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'churned': return 'bg-red-100 text-red-800';
      case 'potential': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={handleBackToAccounts} className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Accounts
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (accountError || !account) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={handleBackToAccounts} className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Accounts
            </button>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Not Found</h2>
                <p className="text-gray-600">The account you're looking for doesn't exist or you don't have permission to view it.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button onClick={handleBackToAccounts} variant="outline" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Accounts
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{account.name}</h1>
              <p className="text-gray-600 mt-1">{account.industry || 'Industry not specified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(account.accountStatus)}>
              {account.accountStatus?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            <Button variant="default">
              <Edit className="w-4 h-4 mr-2" />
              Edit Account
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company Type</label>
                    <p className="text-sm text-gray-900">{account.accountType || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Segment</label>
                    <p className="text-sm text-gray-900">{account.accountSegment || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company Size</label>
                    <p className="text-sm text-gray-900">{account.companySize || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employees</label>
                    <p className="text-sm text-gray-900">{account.employees ? account.employees.toLocaleString() : 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Founded</label>
                    <p className="text-sm text-gray-900">{account.foundedYear || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Annual Revenue</label>
                    <p className="text-sm text-gray-900">{formatCurrency(account.annualRevenue)}</p>
                  </div>
                </div>
                
                {account.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{account.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="text-sm font-medium text-gray-500">Domain</label>
                    <p className="text-sm text-gray-900">{account.domain || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                    {account.linkedinUrl ? (
                      <a href={account.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        View Profile
                      </a>
                    ) : (
                      <p className="text-sm text-gray-900">Not provided</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Key Contacts ({contacts?.length || 0})
                  </div>
                  <Button variant="outline" size="sm">
                    Add Contact
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          {contact.phone && (
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {contacts.length > 3 && (
                      <Button variant="outline" className="w-full">
                        View All {contacts.length} Contacts
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No contacts found for this account</p>
                    <Button variant="outline" className="mt-2">
                      Add First Contact
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Deals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Active Deals ({deals?.length || 0})
                  </div>
                  <Button variant="outline" size="sm">
                    Create Deal
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dealsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : deals && deals.length > 0 ? (
                  <div className="space-y-4">
                    {deals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{deal.name}</h4>
                            <p className="text-sm text-gray-500">{deal.stage || 'Stage not specified'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(deal.value)}</p>
                            <p className="text-sm text-gray-500">{deal.probability}% probability</p>
                          </div>
                        </div>
                        {deal.expectedCloseDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Expected close: {formatDate(deal.expectedCloseDate)}
                          </p>
                        )}
                      </div>
                    ))}
                    {deals.length > 3 && (
                      <Button variant="outline" className="w-full">
                        View All {deals.length} Deals
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active deals for this account</p>
                    <Button variant="outline" className="mt-2">
                      Create First Deal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Account Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className={`w-16 h-16 rounded-full ${getHealthScoreColor(account.healthScore)} flex items-center justify-center text-white font-bold text-lg`}>
                        {account.healthScore || '—'}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{getHealthScoreLabel(account.healthScore)}</p>
                  <p className="text-sm text-gray-500">Health Score: {account.healthScore || 'Unknown'}/100</p>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div>
                  <label className="text-sm font-medium text-gray-500">Open Deals</label>
                  <p className="text-sm text-gray-900">{deals?.length || 0}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Create Opportunity
                </Button>
              </CardContent>
            </Card>

            {/* Account Tags */}
            {account.tags && account.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {account.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealAccountDetail;