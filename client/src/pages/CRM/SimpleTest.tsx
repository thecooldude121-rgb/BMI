import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-600">✅ CRM Module is Loading!</h1>
      <p className="mt-2">If you can see this, the CRM routing is working.</p>
      <div className="mt-4">
        <p>Current URL: {window.location.pathname}</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default SimpleTest;