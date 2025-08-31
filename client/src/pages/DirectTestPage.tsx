import React from 'react';

const DirectTestPage: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ff00ff',
      color: 'white',
      fontSize: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🔥 DIRECT TEST PAGE WORKS!</h1>
        <p style={{ fontSize: '30px', marginTop: '20px' }}>
          This bypasses all CRM routing
        </p>
        <p style={{ fontSize: '24px', marginTop: '10px' }}>
          Path: {window.location.pathname}
        </p>
      </div>
    </div>
  );
};

export default DirectTestPage;