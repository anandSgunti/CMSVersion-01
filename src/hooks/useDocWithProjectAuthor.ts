import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface DocWithProjectAuthor {
  id: string;
  title: string;
  body: string;
  status: string;
  updated_at: string;
  project_id: string;
  project_name: string;
  author_id: string;
  author_name: string;
}

export const useDocWithProjectAuthor = (docId: string) => {
  return useQuery({
    queryKey: ['doc-with-project-author', docId],
    queryFn: async (): Promise<DocWithProjectAuthor> => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          title,
          body,
          status,
          updated_at,
          project_id,
          projects!inner(name),
          profiles!documents_author_id_fkey(id, name)
        `)
        .eq('id', docId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Document not found');
      }

      return {
        id: data.id,
        title: data.title,
        body: data.body,
        status: data.status,
        updated_at: data.updated_at,
        project_id: data.project_id,
        project_name: data.projects.name,
        author_id: data.profiles?.id || '',
        author_name: data.profiles?.name || 'Unknown',
      };
    },
    enabled: !!docId,
  });
};