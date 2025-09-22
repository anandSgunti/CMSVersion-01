import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../providers/SessionProvider';

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  global_role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export const useProfile = () => {
  const { user } = useSession();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id,email,name,avatar_url,global_role,created_at,updated_at,last_login')
        .eq('id', user!.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!user,
  });
};