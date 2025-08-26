// Advanced click test with multiple approaches
import React, { useRef, useEffect, useState } from 'react';

const AdvancedClickTest = () => {
  const [reactClicks, setReactClicks] = useState(0);
  const [vanillaClicks, setVanillaClicks] = useState(0);
  const vanillaRef = useRef<HTMLButtonElement>(null);

  // React onClick handler
  const handleReactClick = (e: React.MouseEvent) => {
    console.log('ADVANCED TEST: React onClick triggered');
    setReactClicks(prev => prev + 1);
    alert(`React click works! Count: ${reactClicks + 1}`);
  };

  // Vanilla JS event handler
  useEffect(() => {
    const button = vanillaRef.current;
    if (!button) return;

    const handleVanillaClick = (e: MouseEvent) => {
      console.log('ADVANCED TEST: Vanilla JS click triggered');
      setVanillaClicks(prev => prev + 1);
      alert(`Vanilla JS click works! Count: ${vanillaClicks + 1}`);
    };

    button.addEventListener('click', handleVanillaClick);
    return () => button.removeEventListener('click', handleVanillaClick);
  }, [vanillaClicks]);

  return (
    <div className="fixed top-60 left-1/2 transform -translate-x-1/2 z-[13000] bg-green-100 border-2 border-green-600 rounded-lg p-4 shadow-xl">
      <h3 className="font-bold text-green-800 mb-3">ADVANCED CLICK TEST</h3>
      
      {/* React Button */}
      <div className="mb-3">
        <button
          onClick={handleReactClick}
          onMouseDown={() => console.log('React mousedown')}
          className="w-full px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 mb-1"
        >
          React Click Test
        </button>
        <div className="text-xs text-green-700">React clicks: {reactClicks}</div>
      </div>

      {/* Vanilla JS Button */}
      <div>
        <button
          ref={vanillaRef}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 mb-1"
        >
          Vanilla JS Test  
        </button>
        <div className="text-xs text-green-700">Vanilla clicks: {vanillaClicks}</div>
      </div>
    </div>
  );
};

export default AdvancedClickTest;