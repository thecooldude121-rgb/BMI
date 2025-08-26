// Pure JavaScript event test to bypass React completely
import React, { useEffect, useRef } from 'react';

const VanillaJSTest = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create elements using pure DOM manipulation
    const testButton = document.createElement('button');
    testButton.textContent = 'VANILLA JS TEST';
    testButton.style.cssText = `
      padding: 12px 24px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      margin: 8px;
    `;

    const clickCounter = document.createElement('div');
    clickCounter.textContent = 'Clicks: 0';
    clickCounter.style.cssText = `
      font-weight: bold;
      margin: 8px;
      color: #333;
    `;

    let clickCount = 0;

    // Pure JavaScript event handler
    testButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      clickCount++;
      clickCounter.textContent = `Clicks: ${clickCount}`;
      console.log(`VANILLA JS: Click #${clickCount} detected!`);
      alert(`Vanilla JS click successful! Count: ${clickCount}`);
    });

    // Also test mouse events
    testButton.addEventListener('mousedown', () => {
      console.log('VANILLA JS: mousedown detected');
    });

    testButton.addEventListener('mouseup', () => {
      console.log('VANILLA JS: mouseup detected');
    });

    containerRef.current.appendChild(clickCounter);
    containerRef.current.appendChild(testButton);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[11000] bg-red-200 border-2 border-red-600 rounded-lg p-4 shadow-xl">
      <h3 className="font-bold text-red-800 mb-2">VANILLA JS TEST</h3>
      <p className="text-sm text-red-700 mb-2">Pure DOM event handling (bypasses React)</p>
      <div ref={containerRef} />
    </div>
  );
};

export default VanillaJSTest;