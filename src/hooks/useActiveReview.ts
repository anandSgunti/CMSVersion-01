import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface ActiveReview {
  id: string;
  status: string;
  reviewer_id: string;
  requester_id: string;
  message: string | null;
  due_at: string | null;
  updated_at: string;
  reviewer_name: string;
  reviewer_email: string;
}

export const useActiveReview = (docId: string) => {
  return useQuery({
    queryKey: ['active-review', docId],
    queryFn: async (): Promise<ActiveReview | null> => {
      const { data, error } = await supabase
        .from('review_requests')
        .select(`
          id,
          status,
          reviewer_id,
          requester_id,
          message,
          due_at,
          updated_at,
          profiles!review_requests_reviewer_id_fkey(name, email)
        `)
        .eq('document_id', docId)
        .in('status', ['requested', 'in_review', 'approved'])
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        status: data.status,
        reviewer_id: data.reviewer_id,
        requester_id: data.requester_id,
        message: data.message,
        due_at: data.due_at,
        updated_at: data.updated_at,
        reviewer_name: data.profiles?.name || 'Unknown',
        reviewer_email: data.profiles?.email || '',
      };
    },
    enabled: !!docId,
  });
};