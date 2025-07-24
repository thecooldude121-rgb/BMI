import React from 'react';

const MinimalTest: React.FC = () => {
  console.log('MinimalTest component rendered');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '200px' }}>
      <h1 style={{ color: 'black', fontSize: '24px', marginBottom: '10px' }}>
        Minimal Test Component
      </h1>
      <p style={{ color: 'black', fontSize: '16px' }}>
        This is a basic test component to verify rendering works.
      </p>
      <div style={{ marginTop: '20px', color: 'black' }}>
        <strong>Current Time:</strong> {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default MinimalTest;