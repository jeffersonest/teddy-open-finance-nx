import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if ((error as { response?: { status?: number } })?.response?.status === 401) {
          return false;
        }

        return failureCount < 2;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});
