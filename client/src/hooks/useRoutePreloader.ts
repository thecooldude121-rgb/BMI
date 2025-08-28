import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { cacheWarmer } from '@/utils/cacheWarmer';

// Enhanced route preloader with intelligent caching
export const useRoutePreloader = () => {
  const hasPreloaded = useRef(false);
  const [location] = useLocation();

  useEffect(() => {
    if (hasPreloaded.current) return;
    hasPreloaded.current = true;

    // Start warming critical caches immediately
    setTimeout(() => {
      cacheWarmer.warmCriticalCaches();
    }, 100);

    // Clean up stale cache periodically
    const cleanupInterval = setInterval(() => {
      cacheWarmer.invalidateStaleData();
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  // Warm cache for specific routes when navigating
  useEffect(() => {
    if (location) {
      setTimeout(() => {
        cacheWarmer.warmRouteSpecificCache(location);
      }, 50);
    }
  }, [location]);
};

export default useRoutePreloader;