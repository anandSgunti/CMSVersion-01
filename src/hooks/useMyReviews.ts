// hooks/useMyReviews.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../providers/SessionProvider';

type Row = {
  review_id: string;
  doc_id: string;
  title: string | null;
  project_name: string | null;
  review_status: 'requested'|'in_review'|'approved'|'changes_requested'|'declined';
  doc_status: 'draft'|'in_review'|'approved'|'changes_requested'|'published'|'archived';
  due_at: string | null;
  updated_at: string;
};

export const useMyReviews = () => {
  const { user } = useSession();

  return useQuery({
    queryKey: ['my-reviews', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<Row[]> => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('review_requests')
        .select(`
          id,
          status,
          due_at,
          updated_at,
          document_id,
          documents!inner(
            id,
            title,
            status,
            project_id,
            projects:projects!documents_project_id_fkey(name)
          )
        `)
        .eq('reviewer_id', user.id)
        .in('status', ['requested','in_review'])   // show only active items
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((r: any) => ({
        review_id: r.id,
        doc_id: r.document_id,                                      // <-- use this to navigate
        title: r.documents?.title ?? null,
        project_name: r.documents?.projects?.name ?? null,
        review_status: r.status,
        doc_status: r.documents?.status ?? 'draft',
        due_at: r.due_at,
        updated_at: r.updated_at,
      }));
    },
  });
};
