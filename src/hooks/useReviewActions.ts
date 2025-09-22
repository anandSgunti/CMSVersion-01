import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface ReviewActionParams {
  docId: string;
  message?: string;
}

export const useReviewActions = () => {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: async ({ docId, message }: ReviewActionParams) => {
      // Step 1: Update document status to approved
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', docId)
        .eq('status', 'in_review')
        .select();

      if (docError) {
        throw new Error(docError.message);
      }

      // Step 2: Update review request status to approved
      const { error: reviewError } = await supabase
        .from('review_requests')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('document_id', docId)
        .eq('status', 'in_review');

      if (reviewError) {
        throw new Error(reviewError.message);
      }

      return docData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doc', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['active-review', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
    },
  });

  const requestChanges = useMutation({
    mutationFn: async ({ docId, message }: ReviewActionParams) => {
      // Step 1: Update document status to changes_requested
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .update({ 
          status: 'changes_requested',
          updated_at: new Date().toISOString()
        })
        .eq('id', docId)
        .in('status', ['in_review', 'approved'])
        .select();

      if (docError) {
        throw new Error(docError.message);
      }

      // Step 2: Update review request status to changes_requested
      const { error: reviewError } = await supabase
        .from('review_requests')
        .update({ 
          status: 'changes_requested',
          updated_at: new Date().toISOString()
        })
        .eq('document_id', docId)
        .in('status', ['in_review', 'approved']);

      if (reviewError) {
        throw new Error(reviewError.message);
      }

      return docData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doc', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['active-review', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
    },
  });

  const revokeApproval = useMutation({
    mutationFn: async ({ docId, message }: ReviewActionParams) => {
      // Step 1: Update document status back to in_review
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .update({ 
          status: 'in_review',
          updated_at: new Date().toISOString()
        })
        .eq('id', docId)
        .eq('status', 'approved')
        .select();

      if (docError) {
        throw new Error(docError.message);
      }

      // Step 2: Update review request status back to in_review
      const { error: reviewError } = await supabase
        .from('review_requests')
        .update({ 
          status: 'in_review',
          updated_at: new Date().toISOString()
        })
        .eq('document_id', docId)
        .eq('status', 'approved');

      if (reviewError) {
        throw new Error(reviewError.message);
      }

      return docData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doc', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['active-review', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
    },
  });

  const resubmitForReview = useMutation({
    mutationFn: async ({ docId, message }: ReviewActionParams) => {
      // Step 1: Update document status back to in_review
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .update({ 
          status: 'in_review',
          updated_at: new Date().toISOString()
        })
        .eq('id', docId)
        .eq('status', 'changes_requested')
        .select();

      if (docError) {
        throw new Error(docError.message);
      }

      // Step 2: Update review request status back to in_review
      const { error: reviewError } = await supabase
        .from('review_requests')
        .update({ 
          status: 'in_review',
          updated_at: new Date().toISOString()
        })
        .eq('document_id', docId)
        .eq('status', 'changes_requested');

      if (reviewError) {
        throw new Error(reviewError.message);
      }

      return docData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doc', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['active-review', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
    },
  });

  return { approve, requestChanges, revokeApproval, resubmitForReview };
};