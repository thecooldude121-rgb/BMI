import React from 'react';
import { Route, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Simple Lead Management Page */}
        <Route path="/crm/leads" component={() => (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ 
              backgroundColor: '#d1ecf1', 
              border: '1px solid #bee5eb', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '20px' 
            }}>
              <h1 style={{ color: '#0c5460', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                ✅ Lead Management Page is Working!
              </h1>
              <p style={{ color: '#0c5460', margin: '0' }}>
                Successfully loaded the lead management interface
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h2 style={{ marginBottom: '20px' }}>Lead Management Interface</h2>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <a 
                  href="/crm/leads/new" 
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Create New Lead
                </a>
              </div>
              <p>Lead list and management features would go here...</p>
            </div>
          </div>
        )} />

        {/* Simple Lead Creation Page */}
        <Route path="/crm/leads/new" component={() => (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ 
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '20px' 
            }}>
              <h1 style={{ color: '#155724', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                ✅ Lead Creation Page is Working!
              </h1>
              <p style={{ color: '#155724', margin: '0' }}>
                Ready to create new leads
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h2 style={{ marginBottom: '20px' }}>Create New Lead</h2>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <a 
                  href="/crm/leads" 
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Back to Lead List
                </a>
              </div>
              <p>Lead creation form would go here...</p>
            </div>
          </div>
        )} />

        {/* Simple Test Page */}
        <Route path="/test-leads" component={() => (
          <div style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            padding: '40px', 
            textAlign: 'center', 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>
              🚀 TEST LEADS PAGE IS VISIBLE!
            </h1>
            <p style={{ fontSize: '18px', margin: '0' }}>
              Path: /test-leads
            </p>
            <p style={{ fontSize: '16px', margin: '10px 0 0 0' }}>
              This should be clearly visible with red background
            </p>
          </div>
        )} />

        {/* Default Route */}
        <Route path="/" component={() => (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Business Management Platform</h1>
            <div style={{ marginTop: '20px' }}>
              <a href="/crm/leads" style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Go to Leads
              </a>
              <a href="/test-leads" style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Test Page
              </a>
            </div>
          </div>
        )} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;