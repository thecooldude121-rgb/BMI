import React from 'react';
import { useParams } from 'wouter';

const TestAccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#1f2937', fontSize: '18px', marginBottom: '10px' }}>
          AI Growth Test Area
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Ready to test AI recommendations for account {id}
        </p>
      </div>
    </div>
  );
};

export default TestAccountDetailPage;