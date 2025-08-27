// Performance optimization hook
import { useEffect, useCallback } from 'react';

export const usePerformanceOptimization = () => {
  // Memoized optimization functions
  const preloadCriticalResources = useCallback(() => {
    // Preload commonly used API endpoints
    const commonEndpoints = [
      '/api/accounts',
      '/api/deals',
      '/api/contacts',
      '/api/activities'
    ];

    commonEndpoints.forEach(endpoint => {
      fetch(endpoint, { method: 'HEAD' }).catch(() => {
        // Silent fail - this is just preloading
      });
    });
  }, []);

  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img:not([loading])') as NodeListOf<HTMLImageElement>;
    images.forEach(img => {
      img.loading = 'lazy';
    });
  }, []);

  const enableServiceWorkerCaching = useCallback(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silent fail if service worker not available
      });
    }
  }, []);

  const optimizeScrollPerformance = useCallback(() => {
    // Add passive event listeners for better scroll performance
    const scrollElements = document.querySelectorAll('[data-scroll-container]');
    scrollElements.forEach(el => {
      el.addEventListener('scroll', () => {}, { passive: true });
    });
  }, []);

  const prefetchRoutes = useCallback(() => {
    // Prefetch commonly accessed routes
    const commonRoutes = ['/crm/accounts', '/crm/deals', '/analytics'];
    commonRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    // Run optimizations with staggered timing to prevent blocking
    const timeouts = [
      setTimeout(enableServiceWorkerCaching, 100),
      setTimeout(optimizeImages, 300),
      setTimeout(preloadCriticalResources, 500),
      setTimeout(optimizeScrollPerformance, 700),
      setTimeout(prefetchRoutes, 1000)
    ];

    // Cleanup function
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [preloadCriticalResources, optimizeImages, enableServiceWorkerCaching, optimizeScrollPerformance, prefetchRoutes]);
};

export default usePerformanceOptimization;