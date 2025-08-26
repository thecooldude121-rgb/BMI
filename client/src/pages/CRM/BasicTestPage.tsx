import React from 'react';

const BasicTestPage: React.FC = () => {
  const handleLinkClick = (e: React.MouseEvent) => {
    console.log('Link clicked:', e.target);
    // Let the default behavior proceed
  };

  const handleScroll = (e: React.UIEvent) => {
    console.log('Scroll detected:', e.currentTarget.scrollLeft);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>BASIC INTERACTION TEST</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Navigation Test:</h2>
        <a 
          href="/crm/deals" 
          onClick={handleLinkClick}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            margin: '5px'
          }}
        >
          Go to Deals (Standard Link)
        </a>
        
        <button 
          onClick={() => {
            console.log('Button clicked - attempting navigation');
            window.location.href = '/crm/deals';
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Deals (JS Navigation)
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Scroll Test:</h2>
        <div 
          onScroll={handleScroll}
          style={{
            width: '100%',
            height: '200px',
            border: '2px solid #007bff',
            backgroundColor: 'white',
            overflowX: 'scroll',
            overflowY: 'hidden',
            padding: '10px'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '10px',
            width: '1000px',
            height: '150px'
          }}>
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} style={{
                minWidth: '80px',
                height: '120px',
                backgroundColor: `hsl(${i * 36}, 70%, 60%)`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {i}
              </div>
            ))}
          </div>
        </div>
        <p>Scroll horizontally above - should see console logs</p>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#e9ecef',
        border: '1px solid #ced4da',
        borderRadius: '5px'
      }}>
        <h3>Console Instructions:</h3>
        <p>Open browser console (F12) to see interaction logs</p>
        <p>If no logs appear, JavaScript events are being blocked</p>
      </div>
    </div>
  );
};

export default BasicTestPage;