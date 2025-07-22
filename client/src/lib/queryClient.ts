import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
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

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
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