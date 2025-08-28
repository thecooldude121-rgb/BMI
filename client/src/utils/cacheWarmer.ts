import { queryClient } from '@/lib/queryClient';

// Cache warmer to preload critical data for instant transitions
export class CacheWarmer {
  private static instance: CacheWarmer;
  private warmingInProgress = false;

  static getInstance(): CacheWarmer {
    if (!this.instance) {
      this.instance = new CacheWarmer();
    }
    return this.instance;
  }

  async warmCriticalCaches(): Promise<void> {
    if (this.warmingInProgress) return;
    this.warmingInProgress = true;

    const criticalQueries = [
      // Primary CRM data
      { queryKey: ['/api/accounts'], priority: 1 },
      { queryKey: ['/api/deals'], priority: 1 },
      { queryKey: ['/api/activities/metrics'], priority: 1 },
      
      // Secondary data
      { queryKey: ['/api/contacts'], priority: 2 },
      { queryKey: ['/api/activities'], priority: 2 },
      { queryKey: ['/api/leads'], priority: 2 },
      
      // Analytics data
      { queryKey: ['/api/analytics/dashboard'], priority: 3 },
      { queryKey: ['/api/analytics/pipeline'], priority: 3 }
    ];

    // Sort by priority and warm high-priority caches first
    criticalQueries.sort((a, b) => a.priority - b.priority);

    for (const query of criticalQueries) {
      try {
        // Use timeout for each prefetch to prevent blocking
        await Promise.race([
          queryClient.prefetchQuery({
            queryKey: query.queryKey,
            staleTime: 1000 * 60 * 10, // Keep warm for 10 minutes
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Prefetch timeout')), 2000)
          )
        ]);
        
        // Small delay between requests to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        // Silent fail for cache warming
        console.debug('Cache warming failed for:', query.queryKey);
      }
    }

    this.warmingInProgress = false;
  }

  warmRouteSpecificCache(route: string): Promise<void> {
    const routeCacheMap: Record<string, string[]> = {
      '/crm/accounts': ['/api/accounts', '/api/contacts/by-account'],
      '/crm/deals': ['/api/deals', '/api/activities'],
      '/crm/activities': ['/api/activities', '/api/activities/metrics'],
      '/analytics': ['/api/analytics/dashboard', '/api/analytics/pipeline'],
      '/lead-generation': ['/api/leads', '/api/companies']
    };

    const queries = routeCacheMap[route] || [];
    
    return Promise.all(
      queries.map(queryKey =>
        queryClient.prefetchQuery({ queryKey: [queryKey] }).catch(() => {})
      )
    ).then(() => {});
  }

  invalidateStaleData(): void {
    // Remove queries that haven't been used in 30 minutes
    queryClient.getQueryCache().getAll().forEach(query => {
      if (query.state.dataUpdatedAt < Date.now() - 30 * 60 * 1000) {
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }
}

export const cacheWarmer = CacheWarmer.getInstance();