import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface Template {
  id: string;
  title: string;
  body: string;
  created_at: string;
  author_name: string;
  subcategory_id?: string;
  subcategory_name?: string;
}

export const useTemplates = (projectId: string, search = '') => {
  return useQuery({
    queryKey: ['templates', projectId, search],
    queryFn: async (): Promise<Template[]> => {
      let query = supabase
        .from('documents')
        .select(`
          id,
          title,
          body,
          created_at,
          subcategory_id,
          profiles!documents_author_id_fkey(name),
          subcategories(name)
        `)
        .eq('project_id', projectId)
        .eq('is_template', true)
        .order('created_at', { ascending: false });

      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        body: item.body,
        created_at: item.created_at,
        author_name: item.profiles?.name || 'Unknown',
        subcategory_id: item.subcategory_id,
        subcategory_name: item.subcategories?.name,
      }));
    },
    enabled: !!projectId,
  });
};