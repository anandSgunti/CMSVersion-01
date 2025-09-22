import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface AdminCounts {
  total_users: number;
  active_projects: number;
  total_documents: number;
  pending_reviews: number;
}

export const useAdminCounts = () => {
  return useQuery({
    queryKey: ['admin-counts'],
    queryFn: async (): Promise<AdminCounts> => {
      const { data, error } = await supabase.rpc('admin_counts');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};