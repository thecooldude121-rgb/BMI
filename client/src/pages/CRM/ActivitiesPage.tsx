import React, { useState } from 'react';
import { Plus, Filter, Calendar, Phone, Mail, Users, Clock, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const ActivitiesPage: React.FC = () => {
  const { activities, leads, contacts, employees } = useData();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  const filteredActivities = activities.filter(activity => {
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || activity.assignedTo === assigneeFilter;
    return matchesType && matchesStatus && matchesAssignee;
  });

  const getActivityIcon = (type: string) => {
    const icons = {
      call: Phone,
      email: Mail,
      meeting: Users,
      task: CheckCircle,
      note: Calendar,
      demo: Users,
      proposal: Mail
    };
    const IconComponent = icons[type as keyof typeof icons] || Calendar;
    return <IconComponent className="h-5 w-5" />;
  };

  const getActivityColor = (type: string) => {
    const colors = {
      call: 'text-blue-600 bg-blue-100',
      email: 'text-green-600 bg-green-100',
      meeting: 'text-purple-600 bg-purple-100',
      task: 'text-orange-600 bg-orange-100',
      note: 'text-gray-600 bg-gray-100',
      demo: 'text-indigo-600 bg-indigo-100',
      proposal: 'text-red-600 bg-red-100'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  const getRelatedName = (activity: any) => {
    if (activity.leadId) {
      const lead = leads.find(l => l.id === activity.leadId);
      return lead ? `Lead: ${lead.name}` : 'Unknown Lead';
    }
    if (activity.contactId) {
      const contact = contacts.find(c => c.id === activity.contactId);
      return contact ? `Contact: ${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
    }
    return 'No relation';
  };

  const types = ['call', 'email', 'meeting', 'task', 'note', 'demo', 'proposal'];
  const statuses = ['planned', 'completed', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
          <p className="text-gray-600">{filteredActivities.length} of {activities.length} activities</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Assignees</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </select>
      </div>

      {/* Activities Timeline */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredActivities
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                {/* Activity Icon */}
                <div className={`flex-shrink-0 p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{activity.subject}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                    </div>
                  </div>

                  {activity.description && (
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>By {getEmployeeName(activity.createdBy)}</span>
                      <span>Assigned to {getEmployeeName(activity.assignedTo)}</span>
                      <span>{getRelatedName(activity)}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      {activity.duration && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{activity.duration}min</span>
                        </div>
                      )}
                      <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {activity.outcome && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">
                        <strong>Outcome:</strong> {activity.outcome}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500">
            <p className="text-lg font-medium">No activities found</p>
            <p className="text-sm">Try adjusting your filters or log a new activity</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;