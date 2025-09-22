import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../providers/SessionProvider';

export interface MyDocument {
  id: string;
  title: string;
  body: string;
  project_id: string;
  status: string;
  updated_at: string;
  created_at: string;
  author_name: string;
  projects: {
    name: string;
  };
}

export const useMyDocuments = (search = '') => {
  const { user } = useSession();

  return useQuery({
    queryKey: ['my-documents', user?.id, search],
    queryFn: async (): Promise<MyDocument[]> => {
      if (!user?.id) {
        return [];
      }

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
        .eq('author_id', user.id)  // Only documents authored by current user
        .eq('is_template', false)
        .neq('status', 'archived')  // Exclude archived documents
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
        author_name: item.profiles?.name || 'Unknown',
        projects: item.projects,
      }));
    },
    enabled: !!user?.id,
  });
};