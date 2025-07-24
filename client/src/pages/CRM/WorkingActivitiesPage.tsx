import React, { useState, useEffect } from 'react';

const WorkingActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🚀 Fetching activities...');
        const response = await fetch('/api/activities');
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Data received:', data.length, 'activities');
        console.log('📦 Sample activity:', data[0]);
        
        setActivities(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Activities</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Activities</h1>
        <div className="bg-red-100 p-3 rounded text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      
      <div className="bg-green-100 p-3 mb-4 rounded text-green-700">
        ✅ Successfully loaded {activities.length} activities
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p>No activities found in the response</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 10).map((activity: any) => (
            <div key={activity.id} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{activity.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.type} • {activity.status}
                  </p>
                  {activity.description && (
                    <p className="text-sm text-gray-500 mt-2">{activity.description}</p>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {activity.dealId && <div>Deal: {activity.dealId.slice(0, 8)}...</div>}
                  {activity.leadId && <div>Lead: {activity.leadId.slice(0, 8)}...</div>}
                  {activity.contactId && <div>Contact: {activity.contactId.slice(0, 8)}...</div>}
                  {activity.accountId && <div>Account: {activity.accountId.slice(0, 8)}...</div>}
                </div>
              </div>
            </div>
          ))}
          
          {activities.length > 10 && (
            <div className="text-center py-4">
              <p className="text-gray-500">
                Showing first 10 of {activities.length} activities
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkingActivitiesPage;