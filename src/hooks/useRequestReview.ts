import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface RequestReviewParams {
  docId: string;
  reviewerId: string;
  message?: string;
  dueAt?: string;
}

export const useRequestReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docId, reviewerId, message, dueAt }: RequestReviewParams) => {
      // 🔥 CHECK FOR EXISTING REVIEW REQUEST WITH SAME REVIEWER
      const { data: existingReview, error: checkError } = await supabase
        .from('review_requests')
        .select('id, status')
        .eq('document_id', docId)
        .eq('reviewer_id', reviewerId)
        .in('status', ['requested', 'in_review', 'changes_requested', 'approved'])
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(checkError.message);
      }

      // 🔥 UPDATE EXISTING REVIEW REQUEST IF FOUND
      if (existingReview) {
        const { data, error } = await supabase
          .from('review_requests')
          .update({
            status: 'requested',
            message: message || null,
            due_at: dueAt ? new Date(dueAt).toISOString() : null,
            updated_at: new Date().toISOString(),
            re_requested_at: new Date().toISOString()
          })
          .eq('id', existingReview.id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        // Update document status
        await supabase
          .from('documents')
          .update({ 
            status: 'in_review',
            updated_at: new Date().toISOString()
          })
          .eq('id', docId);

        return data;
      }

      // 🔥 CREATE NEW REVIEW REQUEST IF NO EXISTING ONE FOUND
      const { data, error } = await supabase.rpc('request_review', {
        p_document_id: docId,
        p_reviewer_id: reviewerId,
        p_message: message ?? null,
        p_due_at: dueAt ? new Date(dueAt).toISOString() : null
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    
    // 🔥 ADD CACHE INVALIDATION ON SUCCESS
    onSuccess: (data, variables) => {
      // Invalidate reviews cache for the reviewer
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      
      // Invalidate document queries
      queryClient.invalidateQueries({ queryKey: ['doc', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['active-review', variables.docId] });
      
      // Invalidate document lists
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-to-me'] });
    }
  });
};