// Enhanced lazy loading wrapper with performance optimizations
import React, { Suspense, useEffect, useState } from 'react';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minLoadingTime?: number; // Minimum loading time to prevent flash
  timeout?: number; // Timeout for loading
}

const DefaultLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading module...</p>
      <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
    <div className="text-center space-y-4 max-w-md mx-auto p-6">
      <div className="text-red-500 text-4xl">⚠️</div>
      <h2 className="text-xl font-semibold text-red-800">Module Failed to Load</h2>
      <p className="text-red-600 text-sm">{error.message}</p>
      <button
        onClick={retry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback = <DefaultLoader />,
  minLoadingTime = 200,
  timeout = 10000
}) => {
  const [shouldShowContent, setShouldShowContent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Ensure minimum loading time to prevent flash
    const timer = setTimeout(() => {
      setShouldShowContent(true);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  const ErrorBoundaryWrapper = ({ children }: { children: React.ReactNode }) => {
    try {
      return <>{children}</>;
    } catch (err) {
      setHasError(true);
      setError(err as Error);
      return null;
    }
  };

  const retry = () => {
    setHasError(false);
    setError(null);
    setShouldShowContent(false);
    setTimeout(() => setShouldShowContent(true), minLoadingTime);
  };

  if (hasError && error) {
    return <ErrorFallback error={error} retry={retry} />;
  }

  return (
    <Suspense fallback={fallback}>
      <ErrorBoundaryWrapper>
        {shouldShowContent ? children : fallback}
      </ErrorBoundaryWrapper>
    </Suspense>
  );
};

export default LazyLoader;