import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from './providers/SessionProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './router';

// 🚀 PHASE 1: OPTIMIZED QUERY CLIENT FOR FASTER RESPONSE
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 🔥 FASTER CACHE SETTINGS
      staleTime: 1000 * 30, // 30 seconds (reduced from 5 minutes)
      gcTime: 1000 * 60 * 10, // 10 minutes (reduced from 30)
      
      // 🔥 IMMEDIATE RESPONSIVENESS
      refetchOnWindowFocus: true, // Always get fresh data when returning to tab
      refetchOnReconnect: true,
      networkMode: 'online',
      
      // 🔥 SMART RETRY LOGIC
      retry: (failureCount, error: any) => {
        // Don't retry permission/not found errors
        if (error?.status === 404 || error?.status === 403) {
          return false;
        }
        return failureCount < 1; // Only retry once for faster failures
      },
      retryDelay: 1000, // Fixed 1 second retry delay
    },
    mutations: {
      // 🔥 FAST MUTATION HANDLING
      retry: 0, // No retries for mutations - fail fast
      networkMode: 'online',
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ToastProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;