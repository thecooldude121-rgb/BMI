import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - cache stays fresh longer
      gcTime: 1000 * 60 * 90, // 90 minutes - keep in memory longer for instant page switches
      retry: (failureCount, error) => {
        // Smarter retry logic - don't retry on 4xx errors
        if ((error as any)?.status >= 400 && (error as any)?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always', // Refresh when reconnecting
      refetchOnMount: false, // Use cache if available for faster loads
      networkMode: 'online', // Optimize for online performance
      // Disable automatic background refetch for better performance
      refetchInterval: false,
      refetchIntervalInBackground: false
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest(url: string, options: RequestOptions = {}) {
  const { method = 'GET', headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config).catch(error => {
    console.error('Fetch error for URL:', url, 'Error:', error);
    throw new Error(`Network error: ${error.message || 'Unknown network error'}`);
  });

  if (!response.ok) {
    console.error(`HTTP error for URL: ${url}, Status: ${response.status}, StatusText: ${response.statusText}`);
    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
  }

  // Handle empty responses (like DELETE)
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

// Set default query function
queryClient.setQueryDefaults([], {
  queryFn: async ({ queryKey }: any) => {
    const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
    return apiRequest(url);
  },
});