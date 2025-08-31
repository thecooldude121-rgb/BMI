import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        border: '1px solid #bee5eb', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ color: '#0c5460', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
          ✅ Simple App is Working!
        </h1>
        <p style={{ color: '#0c5460', margin: '0' }}>
          This is a basic React component without any routing
        </p>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2>Test Interface</h2>
        <p>If you can see this, React is working properly.</p>
        <button 
          onClick={() => alert('Button clicked!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default SimpleApp;