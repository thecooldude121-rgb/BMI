import React from 'react';
import { useLocation } from 'wouter';

const DebugRouter: React.FC = () => {
  const [location] = useLocation();
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'red', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>Current Location: {location}</div>
      <div>Timestamp: {new Date().getTime()}</div>
    </div>
  );
};

export default DebugRouter;