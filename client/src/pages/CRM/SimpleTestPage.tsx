import React from 'react';

const SimpleTestPage: React.FC = () => {
  console.log('SimpleTestPage rendering');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1>SIMPLE TEST PAGE</h1>
      <p>This is a basic test component</p>
    </div>
  );
};

export default SimpleTestPage;