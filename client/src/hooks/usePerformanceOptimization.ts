// Performance optimization hook
import { useEffect } from 'react';

export const usePerformanceOptimization = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload commonly used API endpoints
      const commonEndpoints = [
        '/api/accounts',
        '/api/deals',
        '/api/contacts'
      ];

      commonEndpoints.forEach(endpoint => {
        fetch(endpoint, { method: 'HEAD' }).catch(() => {
          // Silent fail - this is just preloading
        });
      });
    };

    // Debounce function for API calls
    const debounceDelay = 300;
    
    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.loading = 'lazy';
      });
    };

    // Run optimizations
    setTimeout(preloadCriticalResources, 1000);
    setTimeout(optimizeImages, 500);

    // Cleanup function
    return () => {
      // Clear any ongoing requests if needed
    };
  }, []);
};

export default usePerformanceOptimization;