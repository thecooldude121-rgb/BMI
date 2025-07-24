import React from 'react';

const TestApp: React.FC = () => {
  console.log('TestApp component is rendering!');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'green', fontSize: '24px' }}>✅ React App is Working!</h1>
      <p style={{ fontSize: '16px', marginTop: '10px' }}>
        If you can see this, React is working correctly.
      </p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
        <h2>Debug Information:</h2>
        <p>Current URL: {window.location.href}</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TestApp;