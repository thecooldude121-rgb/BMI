import React, { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';

const TestAccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [location] = useLocation();

  useEffect(() => {
    console.log('TestAccountDetailPage mounted');
    console.log('Account ID from params:', id);
    console.log('Current location:', location);
  }, [id, location]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h1 style={{ color: '#2563eb', fontSize: '24px', marginBottom: '10px' }}>
          ACCOUNT DETAIL PAGE WORKING!
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Account ID: {id || 'No ID found'}
        </p>
        <p style={{ color: '#10b981', fontSize: '14px', marginTop: '10px' }}>
          Navigation successful - routing is working correctly!
        </p>
        <p style={{ color: '#333', fontSize: '12px', marginTop: '10px' }}>
          Current URL: {location}
        </p>
        <p style={{ color: '#333', fontSize: '12px', marginTop: '5px' }}>
          Timestamp: {new Date().toLocaleTimeString()}
        </p>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#1f2937', fontSize: '18px', marginBottom: '10px' }}>
          AI Growth Test Area
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Ready to test AI recommendations for account {id}
        </p>
        
        <button 
          onClick={() => window.location.href = '/crm/accounts'}
          style={{ 
            marginTop: '15px', 
            padding: '10px 20px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Back to Accounts List
        </button>
      </div>
    </div>
  );
};

export default TestAccountDetailPage;