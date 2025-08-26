// Basic click test to diagnose React event handling
import React, { useState } from 'react';

const ClickTest = () => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState('');

  const handleClick = () => {
    const timestamp = new Date().toLocaleTimeString();
    setClickCount(prev => prev + 1);
    setLastClick(timestamp);
    console.log(`CLICK TEST: Button clicked at ${timestamp}`);
    alert(`Click successful! Count: ${clickCount + 1}`);
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000] bg-yellow-200 border-2 border-yellow-600 rounded-lg p-4 shadow-xl">
      <h3 className="font-bold text-yellow-800 mb-2">CLICK TEST</h3>
      <div className="text-sm text-yellow-700 mb-3">
        <div>Clicks: {clickCount}</div>
        <div>Last: {lastClick || 'None'}</div>
      </div>
      <button 
        onClick={handleClick}
        onMouseDown={() => console.log('Mouse down detected')}
        onMouseUp={() => console.log('Mouse up detected')}
        className="w-full px-4 py-2 bg-yellow-600 text-white rounded font-bold hover:bg-yellow-700 cursor-pointer"
        style={{ userSelect: 'none' }}
      >
        TEST CLICK
      </button>
    </div>
  );
};

export default ClickTest;