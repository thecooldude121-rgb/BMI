import React from 'react';

const SimpleNavigationTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>NAVIGATION TEST SUCCESS</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Test Links:</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <a href="/crm/deals/kanban" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            Original Kanban
          </a>
          <a href="/crm/deals/kanban-test" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            Kanban Test
          </a>
          <a href="/crm/deals" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            Deals List
          </a>
          <a href="/crm" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            CRM Home
          </a>
        </div>
      </div>

      <div style={{
        width: '100%',
        height: '300px',
        border: '3px solid #007bff',
        backgroundColor: 'white',
        overflowX: 'scroll',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          width: '1200px',
          height: '200px'
        }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{
              minWidth: '140px',
              height: '180px',
              backgroundColor: `hsl(${i * 45}, 70%, 60%)`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '8px'
            }}>
              Box {i}
            </div>
          ))}
        </div>
      </div>
      
      <p style={{ marginTop: '20px', color: '#666' }}>
        Scroll horizontally in the blue bordered area above to test scrolling
      </p>
    </div>
  );
};

export default SimpleNavigationTest;