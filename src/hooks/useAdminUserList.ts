import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface AdminUser {
  user_id: string;
  email: string;
  name: string;
  global_role: 'admin' | 'user';
  created_at: string;
  last_login: string | null;
  projects_count: number;
  documents_count: number;
}

export const useAdminUserList = (search = '', limit = 50, offset = 0) => {
  return useQuery({
    queryKey: ['admin-user-list', search, limit, offset],
    queryFn: async (): Promise<AdminUser[]> => {
      const { data, error } = await supabase.rpc('admin_user_list', {
        p_search: search || null,
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