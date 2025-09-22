import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export const useCollaboratorsCount = (docId: string) => {
  return useQuery({
    queryKey: ['collaborators-count', docId],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('document_permissions')
        .select('user_id', { count: 'exact', head: true })
        .eq('document_id', docId);

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    },
    enabled: !!docId,
  });
};