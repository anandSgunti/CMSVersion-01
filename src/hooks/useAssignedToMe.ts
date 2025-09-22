import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../providers/SessionProvider';

export interface AssignedToMeDocument {
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

export const useAssignedToMe = (search = '') => {
  const { user } = useSession();

  return useQuery({
    queryKey: ['assigned-to-me', user?.id, search],
    queryFn: async (): Promise<AssignedToMeDocument[]> => {
      if (!user?.id) {
        return [];
      }

      // Get all documents where user is NOT the author but has access
      // This includes documents they are assigned to review, collaborate on, etc.
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
        .neq('author_id', user.id)  // Documents NOT authored by current user
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