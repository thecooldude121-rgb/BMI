import React, { useEffect } from 'react';

const PureHTMLTest: React.FC = () => {
  useEffect(() => {
    console.log('PureHTMLTest component mounted');
    
    const container = document.querySelector('.scroll-test-container');
    if (container) {
      container.addEventListener('scroll', (e) => {
        console.log('Scroll detected! ScrollLeft:', (e.target as HTMLElement).scrollLeft);
      });
    }
    
    // Test click handlers
    const links = document.querySelectorAll('.test-nav-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        console.log('Navigation link clicked:', (e.target as HTMLElement).textContent);
      });
    });
  }, []);

  const handleDirectNavigation = () => {
    console.log('Direct JS navigation triggered');
    window.location.href = '/crm/deals';
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>
        SIMPLE INTERACTION TEST
      </h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
        Testing navigation and scrolling without complex dependencies
      </p>

      {/* Navigation Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Navigation Test:</h2>
        
        <a 
          href="/crm/deals" 
          className="test-nav-link"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          Standard Link to Deals
        </a>
        
        <button 
          onClick={handleDirectNavigation}
          style={{
            padding: '12px 24px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          JS Button Navigation
        </button>
      </div>

      {/* Scroll Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Scroll Test:</h2>
        <p>Try scrolling horizontally in the container below:</p>
        
        <div 
          className="scroll-test-container"
          style={{
            border: '3px solid #3498db',
            borderRadius: '8px',
            padding: '20px',
            overflowX: 'auto',
            overflowY: 'hidden',
            backgroundColor: '#ecf0f1'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '15px',
            width: '1000px',
            minWidth: '1000px'
          }}>
            {[1,2,3,4,5,6,7,8].map(num => (
              <div 
                key={num}
                style={{
                  minWidth: '110px',
                  height: '120px',
                  backgroundColor: `hsl(${num * 45}, 70%, 60%)`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  flexShrink: 0
                }}
              >
                Stage {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div style={{
        backgroundColor: '#d5f4e6',
        border: '1px solid #27ae60',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3 style={{ marginTop: 0, color: '#27ae60' }}>Test Status:</h3>
        <p><strong>Navigation:</strong> Click links above - should navigate to other pages</p>
        <p><strong>Scrolling:</strong> Scroll horizontally to see all 8 colored stages</p>
        <p><strong>Console:</strong> Open browser console (F12) to see interaction logs</p>
        <p><strong>If working:</strong> The issue is with complex components, not basic interactions</p>
      </div>
    </div>
  );
};

export default PureHTMLTest;