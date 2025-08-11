import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  User, Phone, Mail, Building, MapPin, Calendar, 
  Activity, Briefcase, Target, TrendingUp, Star,
  ArrowLeft, Edit, MoreVertical, DollarSign, Users
} from 'lucide-react';

const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('deals');

  // Fetch contact data
  const { data: contact, isLoading: contactLoading } = useQuery({
    queryKey: ['/api/contacts', id],
  });

  // Fetch related data
  const { data: deals = [] } = useQuery({
    queryKey: ['/api/deals'],
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['/api/accounts'],
  });

  // Filter related data
  const contactDeals = Array.isArray(deals) ? deals.filter((deal: any) => deal.contactId === id) : [];
  const contactActivities = Array.isArray(activities) ? activities.filter((activity: any) => activity.contactId === id) : [];
  const contactAccount = Array.isArray(accounts) ? accounts.find((account: any) => account.id === contact?.accountId) : null;

  const handleBackToContacts = () => {
    setLocation('/crm/contacts');
  };

  const handleDealClick = (dealId: string) => {
    setLocation(`/crm/deals/${dealId}`);
  };

  const handleAccountClick = (accountId: string) => {
    setLocation(`/crm/accounts/${accountId}`);
  };

  if (contactLoading) {
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
            <button
              onClick={handleBackToContacts}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Contacts</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {contact?.firstName?.[0]}{contact?.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {contact?.firstName} {contact?.lastName}
                </h1>
                <p className="text-gray-600">{contact?.title || 'Title not specified'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Contact Information</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-base text-blue-600 cursor-pointer hover:underline"
                           onClick={() => contact?.email && (window.location.href = `mailto:${contact.email}`)}>
                          {contact?.email || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-base text-blue-600 cursor-pointer hover:underline"
                           onClick={() => contact?.phone && (window.location.href = `tel:${contact.phone}`)}>
                          {contact?.phone || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department</p>
                      <p className="text-base">{contact?.department || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        contact?.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact?.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Relationship Score</p>
                      <p className="text-base font-semibold">{contact?.relationshipScore || 0}/100</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Influence Level</p>
                      <p className="text-base">{contact?.influenceLevel || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Account Link */}
                {contactAccount && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-2">Associated Account</p>
                    <div 
                      onClick={() => handleAccountClick(contactAccount.id)}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <Building className="w-8 h-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{contactAccount.name}</h3>
                        <p className="text-sm text-gray-600">{contactAccount.industry}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Data Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('deals')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'deals'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Deals ({contactDeals.length})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'activities'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>Activities ({contactActivities.length})</span>
                    </div>
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'deals' && (
                  <div className="space-y-4">
                    {contactDeals.length > 0 ? (
                      contactDeals.map((deal: any) => (
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
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                deal.stage === 'closed-won' 
                                  ? 'bg-green-100 text-green-800' 
                                  : deal.stage === 'negotiation'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {deal.stage}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No deals found for this contact</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activities' && (
                  <div className="space-y-4">
                    {contactActivities.length > 0 ? (
                      contactActivities.slice(0, 10).map((activity: any) => (
                        <div key={activity.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{activity.subject}</h3>
                              <p className="text-sm text-gray-600">{activity.type} • {activity.status}</p>
                              {activity.description && (
                                <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {new Date(activity.scheduledAt).toLocaleDateString()}
                              </p>
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {activity.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No activities found for this contact</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Deals</span>
                  <span className="font-semibold">{contactDeals.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Open Deals</span>
                  <span className="font-semibold">
                    {contactDeals.filter((d: any) => !['closed-won', 'closed-lost'].includes(d.stage)).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recent Activities</span>
                  <span className="font-semibold">{contactActivities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-semibold">{contact?.responseRate || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                {contact?.email && (
                  <button 
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    onClick={() => window.location.href = `mailto:${contact.email}`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                )}
                {contact?.phone && (
                  <button 
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => window.location.href = `tel:${contact.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Contact</span>
                  </button>
                )}
                <button 
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setLocation(`/crm/activities/new?contactId=${id}`)}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button 
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setLocation(`/crm/deals/new?contactId=${id}`)}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Create Deal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailPage;