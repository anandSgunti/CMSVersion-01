import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface Document {
  id: string;
  project_id: string;
  author_id: string;
  title: string;
  body: string;
  status: string;
  updated_at: string;
}

export const useDoc = (docId: string) => {
  return useQuery({
    queryKey: ['doc', docId],
    queryFn: async (): Promise<Document> => {
      const { data, error } = await supabase
        .from('documents')
        .select('id,project_id,author_id,title,body,status,updated_at')
        .eq('id', docId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!docId,
    
    // 🔥 OPTIMIZED CACHING STRATEGY
    staleTime: 1000 * 60 * 2, // 2 minutes - document data stays fresh
    gcTime: 1000 * 60 * 15, // 15 minutes - keep in cache longer for editing
    
    // 🔥 BACKGROUND UPDATES
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 1000 * 30, // Background refetch every 30 seconds while editing
    refetchIntervalInBackground: false, // Don't refetch when tab is not active
    
    // 🔥 ERROR HANDLING
    retry: (failureCount, error: any) => {
      // Don't retry for permission errors
      if (error?.status === 403 || error?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    
    // 🔥 NETWORK OPTIMIZATION
    networkMode: 'online',
  });
};