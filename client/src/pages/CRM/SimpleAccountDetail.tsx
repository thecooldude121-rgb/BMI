import React from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Building, Phone, Mail, Globe, MapPin, Calendar, 
  DollarSign, Users, Briefcase, Activity, FileText,
  ArrowLeft, Eye, Edit, MoreVertical, Target,
  TrendingUp, AlertTriangle, Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SimpleAccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  // Fetch account data
  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['/api/accounts', id],
  });

  // Fetch related data
  const { data: deals = [] } = useQuery({
    queryKey: ['/api/deals'],
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
  });

  // Filter related data
  const accountDeals = Array.isArray(deals) ? deals.filter((deal: any) => deal.accountId === id) : [];
  const accountContacts = Array.isArray(contacts) ? contacts.filter((contact: any) => contact.accountId === id) : [];
  const accountActivities = Array.isArray(activities) ? activities.filter((activity: any) => activity.accountId === id) : [];

  const handleBackToAccounts = () => {
    console.log('Navigating back to accounts');
    setLocation('/crm/accounts');
  };

  const handleDealClick = (dealId: string) => {
    setLocation(`/crm/deals/${dealId}`);
  };

  const handleContactClick = (contactId: string) => {
    setLocation(`/crm/contacts/${contactId}`);
  };

  if (accountLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6 h-48"></div>
                <div className="bg-white rounded-lg p-6 h-96"></div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 h-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleBackToAccounts}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Accounts</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{account?.name || 'Account Details'}</h1>
              <p className="text-gray-600">{account?.industry || 'Industry not specified'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Account Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company Name</p>
                      <p className="text-lg font-semibold">{account?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Industry</p>
                      <p className="text-base">{account?.industry || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      <p className="text-base text-blue-600 cursor-pointer hover:underline">
                        {account?.website || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Revenue</p>
                      <p className="text-lg font-semibold">{account?.annualRevenue || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Employees</p>
                      <p className="text-base">{account?.employeeCount || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <Badge variant="outline">{account?.type || 'Standard'}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Data Tabs */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="deals" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="deals" className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Deals ({accountDeals.length})</span>
                    </TabsTrigger>
                    <TabsTrigger value="contacts" className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Contacts ({accountContacts.length})</span>
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>Activities ({accountActivities.length})</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="deals" className="p-6">
                    <div className="space-y-4">
                      {accountDeals.length > 0 ? (
                        accountDeals.map((deal: any) => (
                          <div
                            key={deal.id}
                            onClick={() => handleDealClick(deal.id)}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">{deal.name}</h3>
                                <p className="text-sm text-gray-600">{deal.stage}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${deal.value?.toLocaleString()}</p>
                                <Badge 
                                  variant={
                                    deal.stage === 'closed-won' ? 'default' :
                                    deal.stage === 'negotiation' ? 'secondary' :
                                    'outline'
                                  }
                                >
                                  {deal.stage}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No deals found for this account</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="contacts" className="p-6">
                    <div className="space-y-4">
                      {accountContacts.length > 0 ? (
                        accountContacts.map((contact: any) => (
                          <div
                            key={contact.id}
                            onClick={() => handleContactClick(contact.id)}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {contact.firstName?.[0]}{contact.lastName?.[0]}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {contact.firstName} {contact.lastName}
                                  </h3>
                                  <p className="text-sm text-gray-600">{contact.title}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {contact.email && (
                                  <Button variant="outline" size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `mailto:${contact.email}`;
                                  }}>
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                )}
                                {contact.phone && (
                                  <Button variant="outline" size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `tel:${contact.phone}`;
                                  }}>
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No contacts found for this account</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="activities" className="p-6">
                    <div className="space-y-4">
                      {accountActivities.length > 0 ? (
                        accountActivities.slice(0, 10).map((activity: any) => (
                          <div key={activity.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">{activity.subject}</h3>
                                <p className="text-sm text-gray-600">{activity.type} • {activity.status}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  {new Date(activity.scheduledAt).toLocaleDateString()}
                                </p>
                                <Badge variant="outline">{activity.status}</Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No activities found for this account</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Deals</span>
                  <span className="font-semibold">{accountDeals.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Open Deals</span>
                  <span className="font-semibold">
                    {accountDeals.filter((d: any) => !['closed-won', 'closed-lost'].includes(d.stage)).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Contacts</span>
                  <span className="font-semibold">{accountContacts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recent Activities</span>
                  <span className="font-semibold">{accountActivities.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => setLocation(`/crm/deals/new?accountId=${id}`)}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Create Deal
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setLocation(`/crm/contacts/new?accountId=${id}`)}>
                  <Users className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setLocation(`/crm/activities/new?accountId=${id}`)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAccountDetail;