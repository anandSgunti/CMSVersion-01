import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface GlobalTemplate {
  id: string;
  title: string;
  body: string;
  created_at: string;
  author_name: string;
  project_id: string;
  project_name: string;
}

export const useGlobalTemplateSearch = (search: string) => {
  return useQuery({
    queryKey: ['global-template-search', search],
    queryFn: async (): Promise<GlobalTemplate[]> => {
      if (!search.trim()) {
        return [];
      }

      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          title,
          body,
          created_at,
          project_id,
          profiles!documents_author_id_fkey(name),
          projects!inner(name)
        `)
        .eq('is_template', true)
        .or(`title.ilike.%${search}%,body.ilike.%${search}%`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        body: item.body,
        created_at: item.created_at,
        author_name: item.profiles?.name || 'Unknown',
        project_id: item.project_id,
        project_name: item.projects?.name || 'Unknown Project',
      }));
    },
    enabled: search.trim().length > 0,
  });
};