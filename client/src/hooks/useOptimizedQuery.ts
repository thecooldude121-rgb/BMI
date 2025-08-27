// Optimized query hook with caching and performance improvements
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

interface OptimizedQueryOptions {
  queryKey: string[];
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retry?: number;
  retryDelay?: number;
  keepPreviousData?: boolean;
}

export const useOptimizedQuery = <TData = unknown>(
  options: OptimizedQueryOptions
) => {
  const queryClient = useQueryClient();

  // Memoized query options for performance
  const optimizedOptions = useMemo(() => ({
    queryKey: options.queryKey,
    enabled: options.enabled ?? true,
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    cacheTime: options.cacheTime ?? 10 * 60 * 1000, // 10 minutes default
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    refetchOnMount: options.refetchOnMount ?? true,
    retry: options.retry ?? 1,
    retryDelay: options.retryDelay ?? 1000,
    keepPreviousData: options.keepPreviousData ?? true,
  }), [options]);

  // Optimized query with enhanced caching
  const query = useQuery<TData>(optimizedOptions);

  // Memoized prefetch function
  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: options.queryKey,
      staleTime: optimizedOptions.staleTime,
    });
  }, [queryClient, options.queryKey, optimizedOptions.staleTime]);

  // Memoized invalidate function
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: options.queryKey });
  }, [queryClient, options.queryKey]);

  // Memoized set data function
  const setData = useCallback((data: TData | ((prev: TData | undefined) => TData)) => {
    queryClient.setQueryData(options.queryKey, data);
  }, [queryClient, options.queryKey]);

  return {
    ...query,
    prefetch,
    invalidate,
    setData,
  };
};

export default useOptimizedQuery;