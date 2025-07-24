import React, { useState, useEffect } from 'react';
import { Activity, Filter, Search, Plus } from 'lucide-react';

interface ActivityData {
  id: string;
  subject: string;
  type: string;
  status: string;
  priority: string;
  description?: string;
  scheduledAt?: string;
  completedAt?: string;
  leadId?: string;
  dealId?: string;
  contactId?: string;
  accountId?: string;
}

const WorkingActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log('🚀 Fetching activities from API...');
        const response = await fetch('/api/activities');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✅ Activities loaded:', data.length);
        setActivities(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading activities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Activities</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">{activities.length} activities found</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Activity
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg border">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Create your first activity to get started.</p>
          </div>
        ) : (
          <div className="divide-y">
            {activities.slice(0, 20).map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.type === 'email' ? 'bg-green-100 text-green-800' :
                        activity.type === 'call' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.priority === 'high' ? 'bg-red-100 text-red-800' :
                        activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {activity.priority}
                      </span>
                      {(activity.leadId || activity.dealId || activity.contactId || activity.accountId) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {activity.leadId ? 'Lead' : activity.dealId ? 'Deal' : activity.contactId ? 'Contact' : 'Account'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {activity.scheduledAt ? new Date(activity.scheduledAt).toLocaleDateString() : 
                       activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : 
                       'No date'}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <button className="px-2 py-1 text-xs border rounded hover:bg-gray-50">
                        View
                      </button>
                      {activity.status === 'planned' && (
                        <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activities.length > 20 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Load more activities...
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkingActivitiesPage;