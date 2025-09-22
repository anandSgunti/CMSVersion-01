import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface AdminActivity {
  id: string;
  event_type: string;
  description: string;
  user_name: string;
  user_email: string;
  project_name: string | null;
  document_title: string | null;
  created_at: string;
}

export const useAdminRecentActivity = (since = '7 days', limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['admin-recent-activity', since, limit, offset],
    queryFn: async (): Promise<AdminActivity[]> => {
      const { data, error } = await supabase.rpc('admin_recent_activity', {
        p_since: since,
        p_limit: limit,
        p_offset: offset
      });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });
};