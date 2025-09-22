import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface AdminTopProject {
  id: string;
  name: string;
  activity_count: number;
  created_by_name: string;
  created_at: string;
}

export const useAdminTopProjects = (since = '7 days', limit = 5) => {
  return useQuery({
    queryKey: ['admin-top-projects', since, limit],
    queryFn: async (): Promise<AdminTopProject[]> => {
      const { data, error } = await supabase.rpc('admin_top_projects', {
        p_since: since,
        p_limit: limit
      });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });
};