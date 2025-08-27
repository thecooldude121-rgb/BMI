// Lazy loading wrapper with loading states
import React, { Suspense } from 'react';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Loading module...</p>
    </div>
  </div>
);

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback = <DefaultLoader /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyLoader;