import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Mail, 
  Phone, 
  Calendar, 
  CheckSquare, 
  FileText,
  Users,
  Building,
  DollarSign,
  UserPlus,
  Filter,
  Search,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ActivityData {
  id: string;
  subject: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'demo' | 'proposal';
  direction: 'inbound' | 'outbound';
  status: 'planned' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  outcome?: string;
  duration?: number;
  scheduledAt?: string;
  completedAt?: string;
  leadId?: string;
  dealId?: string;
  contactId?: string;
  accountId?: string;
  relatedToType?: string;
  relatedToId?: string;
  createdAt: string;
  updatedAt: string;
}

const SyncedActivitiesPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    }
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: async () => {
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    }
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['/api/deals'],
    queryFn: async () => {
      const response = await fetch('/api/deals');
      if (!response.ok) throw new Error('Failed to fetch deals');
      return response.json();
    }
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    }
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['/api/accounts'],
    queryFn: async () => {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      return response.json();
    }
  });

  // Debug log the data
  console.log('🔢 Activities count:', activities.length);
  console.log('💼 Deals count:', deals.length);
  console.log('👥 Contacts count:', contacts.length);
  console.log('🏢 Accounts count:', accounts.length);
  
  if (activities.length > 0) {
    console.log('📋 Sample activity:', activities[0]);
    console.log('🔗 Activity relationships:', {
      dealId: activities[0]?.dealId,
      leadId: activities[0]?.leadId,
      contactId: activities[0]?.contactId,
      accountId: activities[0]?.accountId
    });
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'task': return <CheckSquare className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'planned': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRelatedEntityInfo = (activity: ActivityData) => {
    if (activity.leadId) {
      const lead = leads.find((l: any) => l.id === activity.leadId);
      return { type: 'Lead', name: lead?.name || 'Unknown Lead', icon: <UserPlus className="h-4 w-4 text-blue-600" /> };
    }
    if (activity.dealId) {
      const deal = deals.find((d: any) => d.id === activity.dealId);
      return { type: 'Deal', name: deal?.name || 'Unknown Deal', icon: <DollarSign className="h-4 w-4 text-green-600" /> };
    }
    if (activity.contactId) {
      const contact = contacts.find((c: any) => c.id === activity.contactId);
      return { type: 'Contact', name: contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact', icon: <Users className="h-4 w-4 text-purple-600" /> };
    }
    if (activity.accountId) {
      const account = accounts.find((a: any) => a.id === activity.accountId);
      return { type: 'Account', name: account?.name || 'Unknown Account', icon: <Building className="h-4 w-4 text-orange-600" /> };
    }
    return { type: 'General', name: 'No specific relation', icon: <Activity className="h-4 w-4 text-gray-400" /> };
  };

  const filteredActivities = activities.filter((activity: ActivityData) => {
    const matchesModule = selectedModule === 'all' || 
      (selectedModule === 'leads' && activity.leadId) ||
      (selectedModule === 'deals' && activity.dealId) ||
      (selectedModule === 'contacts' && activity.contactId) ||
      (selectedModule === 'accounts' && activity.accountId);

    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesSearch = activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesModule && matchesStatus && matchesSearch;
  });

  const groupedActivities = filteredActivities.reduce((groups: any, activity: ActivityData) => {
    const entityInfo = getRelatedEntityInfo(activity);
    const key = `${entityInfo.type}-${activity.leadId || activity.dealId || activity.contactId || activity.accountId || 'general'}`;
    
    if (!groups[key]) {
      groups[key] = {
        entityInfo,
        activities: []
      };
    }
    groups[key].activities.push(activity);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading synchronized activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Synchronized Activities</h1>
          <p className="text-gray-600">Activities connected across all CRM modules - Leads, Deals, Contacts, and Accounts</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 inline mr-2" />
          Add Activity
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Modules</option>
              <option value="leads">Leads</option>
              <option value="deals">Deals</option>
              <option value="contacts">Contacts</option>
              <option value="accounts">Accounts</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a: ActivityData) => a.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Planned</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a: ActivityData) => a.status === 'planned').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cross-Module</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a: ActivityData) => [a.leadId, a.dealId, a.contactId, a.accountId].filter(Boolean).length > 1).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Activities */}
      <div className="space-y-4">
        {Object.entries(groupedActivities).map(([key, group]: [string, any]) => (
          <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {group.entityInfo.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{group.entityInfo.name}</h3>
                  <p className="text-sm text-gray-600">{group.entityInfo.type} • {group.activities.length} activities</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {group.activities.map((activity: ActivityData) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'email' ? 'bg-blue-100' :
                        activity.type === 'call' ? 'bg-green-100' :
                        activity.type === 'meeting' ? 'bg-purple-100' :
                        activity.type === 'task' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{activity.subject}</h4>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(activity.status)}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      {activity.outcome && (
                        <p className="text-sm text-green-700 mt-2 bg-green-50 px-3 py-1 rounded">
                          <strong>Outcome:</strong> {activity.outcome}
                        </p>
                      )}
                      {/* Related Entity Information */}
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <div className="text-xs font-medium text-gray-700 mb-2">Related CRM Data:</div>
                        <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                          {activity.dealId && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3 text-green-600" />
                              <span>Deal: {deals.find((d: any) => d.id === activity.dealId)?.name || `ID: ${activity.dealId.substring(0, 8)}...`}</span>
                            </div>
                          )}
                          {activity.leadId && (
                            <div className="flex items-center space-x-1">
                              <UserPlus className="h-3 w-3 text-blue-600" />
                              <span>Lead: {leads.find((l: any) => l.id === activity.leadId)?.company || `ID: ${activity.leadId.substring(0, 8)}...`}</span>
                            </div>
                          )}
                          {activity.contactId && (
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3 text-purple-600" />
                              <span>Contact: {(() => {
                                const contact = contacts.find((c: any) => c.id === activity.contactId);
                                return contact ? `${contact.firstName} ${contact.lastName}` : `ID: ${activity.contactId.substring(0, 8)}...`;
                              })()}</span>
                            </div>
                          )}
                          {activity.accountId && (
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3 text-orange-600" />
                              <span>Account: {accounts.find((a: any) => a.id === activity.accountId)?.name || `ID: ${activity.accountId.substring(0, 8)}...`}</span>
                            </div>
                          )}
                          {!activity.dealId && !activity.leadId && !activity.contactId && !activity.accountId && (
                            <div className="text-gray-500 italic">No specific CRM entity linked</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Type: {activity.type}</span>
                          <span>Direction: {activity.direction}</span>
                          {activity.duration && <span>Duration: {activity.duration}m</span>}
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.completedAt ? 
                            `Completed: ${new Date(activity.completedAt).toLocaleDateString()}` :
                            activity.scheduledAt ? 
                              `Scheduled: ${new Date(activity.scheduledAt).toLocaleDateString()}` :
                              `Created: ${new Date(activity.createdAt).toLocaleDateString()}`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new activity to get started.</p>
        </div>
      )}
    </div>
  );
};

export default SyncedActivitiesPage;