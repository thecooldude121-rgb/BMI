import React, { useState } from 'react';
import { Plus, Filter, Calendar, Phone, Mail, Users, Clock, CheckCircle, Video, FileText, Search, List, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';

const EnhancedActivitiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/activities'],
  });
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
  });
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/contacts'],
  });
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
  });

  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'kanban'>('list');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const activitiesArray = Array.isArray(activities) ? activities : [];
  const leadsArray = Array.isArray(leads) ? leads : [];
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const dealsArray = Array.isArray(deals) ? deals : [];

  const filteredActivities = activitiesArray.filter((activity: any) => {
    const matchesSearch = 
      activity.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || activity.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || activity.assignedTo === assigneeFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesAssignee;
  });

  const getActivityIcon = (type: string) => {
    const icons = {
      call: Phone,
      email: Mail,
      meeting: Users,
      task: CheckCircle,
      note: FileText,
      demo: Video,
      proposal: FileText
    };
    const IconComponent = icons[type as keyof typeof icons] || Calendar;
    return <IconComponent className="h-5 w-5" />;
  };

  const getActivityColor = (type: string) => {
    const colors = {
      call: 'text-blue-600 bg-blue-100 border-blue-200',
      email: 'text-green-600 bg-green-100 border-green-200',
      meeting: 'text-purple-600 bg-purple-100 border-purple-200',
      task: 'text-orange-600 bg-orange-100 border-orange-200',
      note: 'text-gray-600 bg-gray-100 border-gray-200',
      demo: 'text-indigo-600 bg-indigo-100 border-indigo-200',
      proposal: 'text-red-600 bg-red-100 border-red-200'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRelatedName = (activity: any) => {
    if (activity.leadId) {
      const lead = leadsArray.find((l: any) => l.id === activity.leadId);
      return lead ? `Lead: ${lead.name}` : 'Unknown Lead';
    }
    if (activity.contactId) {
      const contact = contactsArray.find((c: any) => c.id === activity.contactId);
      return contact ? `Contact: ${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
    }
    if (activity.dealId) {
      const deal = dealsArray.find((d: any) => d.id === activity.dealId);
      return deal ? `Deal: ${deal.name}` : 'Unknown Deal';
    }
    return 'No relation';
  };

  const groupActivitiesByStatus = () => {
    const groups = {
      planned: filteredActivities.filter((a: any) => a.status === 'planned'),
      completed: filteredActivities.filter((a: any) => a.status === 'completed'),
      cancelled: filteredActivities.filter((a: any) => a.status === 'cancelled')
    };
    return groups;
  };

  if (activitiesLoading || leadsLoading || contactsLoading || dealsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading activities...</div>
      </div>
    );
  }

  const activityTypes = ['all', 'call', 'email', 'meeting', 'task', 'note', 'demo', 'proposal'];
  const statuses = ['all', 'planned', 'completed', 'cancelled'];
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'];

  return (
    <div className="p-4 space-y-6">
      {/* Enhanced Header with KPIs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activities Management</h1>
            <p className="text-gray-600">{filteredActivities.length} activities</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Activity
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-blue-600">Total Activities</p>
                <p className="text-2xl font-bold text-blue-900">{activitiesArray.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm text-yellow-600">Planned</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {activitiesArray.filter((a: any) => a.status === 'planned').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">
                  {activitiesArray.filter((a: any) => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-orange-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-900">
                  {activitiesArray.filter((a: any) => ['high', 'urgent'].includes(a.priority)).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Controls and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">View:</span>
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} rounded-l-md`}
              >
                <List className="h-4 w-4 mr-1 inline" />
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 text-sm ${viewMode === 'calendar' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} border-l`}
              >
                <Calendar className="h-4 w-4 mr-1 inline" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 text-sm ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} rounded-r-md border-l`}
              >
                <MoreVertical className="h-4 w-4 mr-1 inline" />
                Kanban
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {activityTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priority' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Activities Display */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity: any) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{activity.subject}</div>
                        {activity.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{activity.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                        <span className="ml-1">{activity.type?.charAt(0).toUpperCase() + activity.type?.slice(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                        {activity.status?.charAt(0).toUpperCase() + activity.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity.priority)}`}>
                        {activity.priority?.charAt(0).toUpperCase() + activity.priority?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getRelatedName(activity)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {activity.scheduledAt ? new Date(activity.scheduledAt).toLocaleDateString() : 'Not scheduled'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedActivity(activity)}
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(groupActivitiesByStatus()).map(([status, statusActivities]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 capitalize">{status}</h3>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {(statusActivities as any[]).length}
                </span>
              </div>
              <div className="space-y-3">
                {(statusActivities as any[]).map((activity: any) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm cursor-pointer"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{activity.subject}</h4>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 truncate">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {activity.scheduledAt ? new Date(activity.scheduledAt).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center text-gray-500 py-8">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">Calendar View</p>
            <p className="text-sm">Calendar integration coming soon!</p>
          </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{selectedActivity.subject}</h2>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Activity Details</h3>
                  <div className="space-y-3 text-sm">
                    <div><strong>Type:</strong> {selectedActivity.type}</div>
                    <div><strong>Status:</strong> {selectedActivity.status}</div>
                    <div><strong>Priority:</strong> {selectedActivity.priority}</div>
                    <div><strong>Duration:</strong> {selectedActivity.duration || 'Not specified'} minutes</div>
                    <div><strong>Scheduled:</strong> {selectedActivity.scheduledAt ? new Date(selectedActivity.scheduledAt).toLocaleString() : 'Not scheduled'}</div>
                    <div><strong>Related To:</strong> {getRelatedName(selectedActivity)}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                  <div className="space-y-3 text-sm">
                    <div><strong>Direction:</strong> {selectedActivity.direction}</div>
                    <div><strong>Outcome:</strong> {selectedActivity.outcome || 'Not specified'}</div>
                    {selectedActivity.completedAt && (
                      <div><strong>Completed:</strong> {new Date(selectedActivity.completedAt).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              </div>
              {selectedActivity.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedActivity.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activity Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Log New Activity</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500 py-8">
                <Plus className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Activity logging form coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedActivitiesPage;