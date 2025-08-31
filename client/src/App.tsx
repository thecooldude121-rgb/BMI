import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CRMModule from './pages/CRM/CRMModule';

function App() {
  // Fixed: Removed problematic hooks that were causing runtime errors
  // const { preloadRoutes } = useRoutePreloader(); // <- This was undefined
  // const { optimizeTransitions } = useTransitionOptimization(); // <- This was undefined

  return (
    <Router>
      <div className="App">
        <header style={{ padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
          <h1>Business Management Interface</h1>
          <p>Navigate to different modules using the links below.</p>
          <div style={{ marginTop: '2rem' }}>
            <a 
              href="/crm/leads" 
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                margin: '0 8px'
              }}
            >
              View Leads
            </a>
            <a 
              href="/crm/leads/new" 
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                margin: '0 8px'
              }}
            >
              Create Lead
            </a>
            <a 
              href="/crm/leads/2ec7feab-1edb-43c4-8780-a45b51f01c10" 
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#ffc107',
                color: 'black',
                textDecoration: 'none',
                borderRadius: '4px',
                margin: '0 8px'
              }}
            >
              Test Lead Detail
            </a>
          </div>
        </header>

        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/crm" replace />} />
            <Route path="/crm/*" element={<CRMModule />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;