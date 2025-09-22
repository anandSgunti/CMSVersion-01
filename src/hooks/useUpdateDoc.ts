import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface UpdateDocParams {
  docId: string;
  patch: {
    title?: string;
    body?: string;
  };
  resubmitForReview?: boolean; // New option for resubmit functionality
}

export const useUpdateDoc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docId, patch, resubmitForReview = false }: UpdateDocParams) => {
      // First get the current document to check status and author
      const { data: currentDoc, error: fetchError } = await supabase
        .from('documents')
        .select('status, author_id')
        .eq('id', docId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if user is the author
      const isAuthor = currentDoc.author_id === user.id;

      // Prepare the update object
      const updateData: any = {
        ...patch,
        updated_at: new Date().toISOString()
      };

      // 🔥 NEW: Resubmit for Review Logic (only when status is 'changes_requested')
      if (resubmitForReview && isAuthor && currentDoc.status === 'changes_requested') {
        updateData.status = 'in_review';
        
        // Reactivate the existing review request instead of cancelling
        await supabase
          .from('review_requests')
          .update({ 
            status: 'in_review',
            updated_at: new Date().toISOString()
          })
          .eq('document_id', docId)
          .eq('status', 'changes_requested');
      }
      // 🔥 EXISTING: Auto-reset to draft for approved/published documents
      else if (isAuthor && (currentDoc.status === 'approved' || currentDoc.status === 'published')) {
        updateData.status = 'draft';
        
        // Cancel any active review requests when reverting to draft
        await supabase
          .from('review_requests')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('document_id', docId)
          .in('status', ['requested', 'in_review', 'approved']);
      }

      // Update the document
      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', docId)
        .select('id,title,body,status,updated_at')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['doc', data.id] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', data.id] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-to-me'] });
      queryClient.invalidateQueries({ queryKey: ['active-review', data.id] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
  });
};