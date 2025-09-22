import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  created_at: string;
}

export const useSubcategories = (projectId: string) => {
  return useQuery({
    queryKey: ['subcategories', projectId],
    queryFn: async (): Promise<Subcategory[]> => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('project_id', projectId)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!projectId,
  });
};