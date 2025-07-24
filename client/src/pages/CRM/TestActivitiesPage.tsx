import React, { useState, useEffect } from 'react';

const TestActivitiesPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Direct fetch without any processing
    console.log('🔥 TestActivitiesPage mounted, starting fetch...');
    
    fetch('/api/activities')
      .then(response => {
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        return response.text(); // Get as text first
      })
      .then(text => {
        console.log('📄 Response text length:', text.length);
        console.log('📄 First 200 chars:', text.substring(0, 200));
        
        try {
          const json = JSON.parse(text);
          console.log('✅ Parsed JSON successfully');
          console.log('📊 Is Array?', Array.isArray(json));
          console.log('📊 Array Length:', Array.isArray(json) ? json.length : 'N/A');
          setData(json);
        } catch (e) {
          console.error('❌ JSON parse error:', e);
          setError('Failed to parse response as JSON');
        }
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        setError(String(err));
      })
      .finally(() => {
        console.log('✅ Fetch complete');
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Activities Page</h1>
      
      <div className="space-y-2 mb-4">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Data Type:</strong> {data === null ? 'null' : typeof data}</p>
        <p><strong>Is Array:</strong> {Array.isArray(data) ? 'Yes' : 'No'}</p>
        <p><strong>Length:</strong> {Array.isArray(data) ? data.length : 'N/A'}</p>
      </div>

      {!loading && !error && Array.isArray(data) && (
        <>
          <h2 className="text-lg font-semibold mb-2">Activities: {data.length}</h2>
          {data.length > 0 && (
            <div className="bg-gray-100 p-3 rounded">
              <h3 className="font-medium mb-1">First Activity:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(data[0], null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestActivitiesPage;