import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface ArchivedDocument {
  id: string;
  title: string;
  body: string;
  project_id: string;
  status: string;
  updated_at: string;
  created_at: string;
  archived_at: string;
  author_name: string;
  projects: {
    name: string;
  };
}

export const useArchivedDocuments = (search = '') => {
  return useQuery({
    queryKey: ['archived-documents', search],
    queryFn: async (): Promise<ArchivedDocument[]> => {
      let query = supabase
        .from('documents')
        .select(`
          id,
          title,
          body,
          project_id,
          status,
          updated_at,
          created_at,
          projects!inner(name),
          profiles!documents_author_id_fkey(name)
        `)
        .eq('is_template', false)
        .eq('status', 'archived')
        .order('updated_at', { ascending: false });

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
        project_id: item.project_id,
        status: item.status,
        updated_at: item.updated_at,
        created_at: item.created_at,
        archived_at: item.updated_at, // When it was archived
        author_name: item.profiles?.name || 'Unknown',
        projects: item.projects,
      }));
    },
  });
};