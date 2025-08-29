import React from 'react';

const TestLeadsPage: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ff0000',
      color: 'white',
      fontSize: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🚀 TEST LEADS PAGE IS VISIBLE!</h1>
        <p style={{ fontSize: '24px', marginTop: '20px' }}>
          Path: {window.location.pathname}
        </p>
        <p style={{ fontSize: '20px', marginTop: '10px' }}>
          This should be clearly visible with red background
        </p>
      </div>
    </div>
  );
};

export default TestLeadsPage;