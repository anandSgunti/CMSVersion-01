import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface SetUserRoleParams {
  userId: string;
  role: 'admin' | 'user';
}

export const useAdminSetUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: SetUserRoleParams) => {
      const { data, error } = await supabase.rpc('admin_set_user_role', {
        p_user_id: userId,
        p_role: role
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate user list to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });
};