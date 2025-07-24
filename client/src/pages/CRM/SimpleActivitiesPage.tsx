import React from 'react';
import { useQuery } from '@tanstack/react-query';

const SimpleActivitiesPage: React.FC = () => {
  console.log('🎯 SimpleActivitiesPage loading...');
  
  // Add immediate test
  React.useEffect(() => {
    console.log('🚀 Component mounted, testing API directly...');
    fetch('/api/activities')
      .then(res => {
        console.log('📡 Direct API test status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('📦 Direct API test data:', data.length, 'activities');
      })
      .catch(err => {
        console.error('❌ Direct API test error:', err);
      });
  }, []);

  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      console.log('🚀 Fetching activities...');
      const response = await fetch('/api/activities');
      console.log('📡 Activities response:', response.status);
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      console.log('📦 Activities received:', data.length);
      return data;
    }
  });

  console.log('🔄 Loading:', isLoading);
  console.log('❌ Error:', error);
  console.log('📋 Activities:', activities.length);
  console.log('📋 Activities type:', typeof activities);
  console.log('📋 Activities is array:', Array.isArray(activities));
  console.log('📋 Activities raw:', activities);

  if (isLoading) {
    return <div className="p-4">Loading activities...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activities Debug Page</h1>
      <div className="bg-yellow-100 p-3 mb-4 rounded">
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
        <p><strong>Activities Length:</strong> {activities.length}</p>
        <p><strong>Activities Type:</strong> {typeof activities} (Array: {Array.isArray(activities) ? 'Yes' : 'No'})</p>
      </div>
      <p className="mb-4">{activities.length} activities found</p>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p>No activities found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.slice(0, 5).map((activity: any) => (
            <div key={activity.id} className="bg-white p-3 rounded border">
              <h3 className="font-medium">{activity.subject}</h3>
              <p className="text-sm text-gray-600">
                Type: {activity.type} | Status: {activity.status}
              </p>
              {activity.dealId && <p className="text-xs text-blue-600">Deal: {activity.dealId}</p>}
              {activity.leadId && <p className="text-xs text-green-600">Lead: {activity.leadId}</p>}
            </div>
          ))}
          {activities.length > 5 && (
            <p className="text-sm text-gray-500">... and {activities.length - 5} more</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleActivitiesPage;