import React from 'react';

// Ultra-fast loader with GPU acceleration for better perceived performance
const FastLoader = () => (
  <div 
    className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-150"
    style={{ 
      willChange: 'opacity',
      transform: 'translateZ(0)', // Force GPU acceleration
      backfaceVisibility: 'hidden'
    }}
  >
    <div 
      className="flex flex-col items-center space-y-3"
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="relative h-8 w-8" style={{ transform: 'translateZ(0)' }}>
        <div 
          className="absolute inset-0 rounded-full border-2 border-gray-200"
          style={{ transform: 'translateZ(0)' }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"
          style={{ 
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        ></div>
      </div>
      <div 
        className="text-sm text-gray-600 font-medium"
        style={{ transform: 'translateZ(0)' }}
      >
        Loading...
      </div>
    </div>
  </div>
);

export default FastLoader;