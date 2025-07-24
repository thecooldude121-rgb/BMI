import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';

const CRMTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const endpoints = [
    { name: 'Activities', url: '/api/activities' },
    { name: 'Leads', url: '/api/leads' },
    { name: 'Contacts', url: '/api/contacts' },
    { name: 'Accounts', url: '/api/accounts' },
    { name: 'Deals', url: '/api/deals' },
    { name: 'Tasks', url: '/api/tasks' }
  ];

  useEffect(() => {
    const testEndpoints = async () => {
      const results: Record<string, any> = {};
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing ${endpoint.name}...`);
          const response = await fetch(endpoint.url);
          const data = await response.json();
          
          results[endpoint.name] = {
            status: response.status,
            isArray: Array.isArray(data),
            count: Array.isArray(data) ? data.length : 'N/A',
            firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
            error: null
          };
        } catch (error) {
          results[endpoint.name] = {
            status: 'Error',
            error: String(error),
            count: 0
          };
        }
      }
      
      setTestResults(results);
      setLoading(false);
    };

    testEndpoints();
  }, []);

  const crmRoutes = [
    { name: 'Gamification', path: '/crm' },
    { name: 'Leads', path: '/crm/leads' },
    { name: 'Contacts', path: '/crm/contacts' },
    { name: 'Accounts', path: '/crm/accounts' },
    { name: 'Deals', path: '/crm/deals' },
    { name: 'Pipeline', path: '/crm/pipeline' },
    { name: 'Tasks', path: '/crm/tasks' },
    { name: 'Activities', path: '/crm/activities' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">CRM Module Test Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Test Results */}
        <div>
          <h2 className="text-xl font-semibold mb-4">API Endpoints Test</h2>
          {loading ? (
            <p>Testing endpoints...</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(testResults).map(([name, result]) => (
                <div key={name} className="border p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{name}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      result.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Count: <span className="font-mono">{result.count}</span></p>
                    <p>Is Array: <span className="font-mono">{String(result.isArray)}</span></p>
                    {result.error && (
                      <p className="text-red-600">Error: {result.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Test */}
        <div>
          <h2 className="text-xl font-semibold mb-4">CRM Navigation Test</h2>
          <div className="space-y-2">
            {crmRoutes.map((route) => (
              <Link key={route.path} href={route.path}>
                <div className="border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="font-medium">{route.name}</span>
                  <span className="text-gray-500 ml-2">{route.path}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Raw Data Preview */}
      {!loading && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Sample Data Preview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(testResults).map(([name, result]) => 
              result.firstItem && (
                <div key={name} className="border p-3 rounded-lg">
                  <h3 className="font-medium mb-2">{name} - First Record</h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.firstItem, null, 2)}
                  </pre>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMTestPage;