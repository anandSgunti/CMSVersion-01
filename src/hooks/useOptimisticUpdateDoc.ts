import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface UpdateDocParams {
  docId: string;
  patch: {
    title?: string;
    body?: string;
  };
  resubmitForReview?: boolean;
}

export const useOptimisticUpdateDoc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docId, patch, resubmitForReview = false }: UpdateDocParams) => {
      // First get the current document to check status and author
      const { data: currentDoc, error: fetchError } = await supabase
        .from('documents')
        .select('status, author_id, title, body, version')
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

      // 🔥 CREATE REVISION BEFORE UPDATING
      if (isAuthor && (patch.title || patch.body)) {
        const hasContentChanges = 
          (patch.title && patch.title !== currentDoc.title) ||
          (patch.body && patch.body !== currentDoc.body);

        if (hasContentChanges) {
          // Save current version as revision
          const { error: revisionError } = await supabase
            .from('document_revisions')
            .insert({
              document_id: docId,
              version: currentDoc.version || 1,
              title: currentDoc.title,
              body: currentDoc.body,
              created_by: user.id,
              summary: `Version ${currentDoc.version || 1} - Auto-saved before update`
            });

          if (revisionError) {
            console.warn('Failed to create revision:', revisionError);
            // Don't fail the main update if revision fails
          }
        }
      }

      // Prepare the update object
      const updateData: any = {
        ...patch,
        updated_at: new Date().toISOString(),
        // Increment version number if content changed
        ...(patch.title || patch.body ? { version: (currentDoc.version || 1) + 1 } : {})
      };

      // 🔥 RESUBMIT FOR REVIEW LOGIC - UPDATE EXISTING REVIEW REQUEST
      if (resubmitForReview && isAuthor && currentDoc.status === 'changes_requested') {
        updateData.status = 'in_review';
        
        // Update the existing review request instead of creating new one
        const { error: reviewError } = await supabase
          .from('review_requests')
          .update({ 
            status: 'in_review',
            updated_at: new Date().toISOString(),
            resubmitted_at: new Date().toISOString()
          })
          .eq('document_id', docId)
          .eq('status', 'changes_requested');

        if (reviewError) {
          console.warn('Failed to update review request:', reviewError);
        }
      }
      // 🔥 AUTO-RESET TO DRAFT FOR APPROVED/PUBLISHED DOCUMENTS
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
        .select('id,title,body,status,updated_at,version')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    
    // 🔥 OPTIMISTIC UPDATES: Update UI immediately before server response
    onMutate: async ({ docId, patch, resubmitForReview }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['doc', docId] });
      
      // Snapshot the previous value
      const previousDoc = queryClient.getQueryData(['doc', docId]);
      
      // Optimistically update the cache
      queryClient.setQueryData(['doc', docId], (old: any) => {
        if (!old) return old;
        
        const updatedDoc = {
          ...old,
          ...patch,
          updated_at: new Date().toISOString(),
          // Increment version if content changed
          ...(patch.title || patch.body ? { version: (old.version || 1) + 1 } : {})
        };

        // Handle status changes optimistically
        if (resubmitForReview && old.status === 'changes_requested') {
          updatedDoc.status = 'in_review';
        } else if (old.status === 'approved' || old.status === 'published') {
          updatedDoc.status = 'draft';
        }

        return updatedDoc;
      });

      // Also update doc-with-project-author cache
      queryClient.setQueryData(['doc-with-project-author', docId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          ...patch,
          updated_at: new Date().toISOString(),
          ...(patch.title || patch.body ? { version: (old.version || 1) + 1 } : {})
        };
      });

      // Return context for rollback
      return { previousDoc };
    },

    // 🔥 ERROR HANDLING: Rollback on error
    onError: (err, variables, context) => {
      // Rollback optimistic update
      if (context?.previousDoc) {
        queryClient.setQueryData(['doc', variables.docId], context.previousDoc);
      }
    },

    // 🔥 SUCCESS: Update all related caches
    onSuccess: (data) => {
      // 🔥 IMMEDIATELY update document caches with fresh data
      queryClient.setQueryData(['doc', data.id], data);
      queryClient.setQueryData(['doc-with-project-author', data.id], (old: any) => {
        if (!old) return old;
        return { ...old, ...data };
      });
      
      // 🔥 FORCE IMMEDIATE REFETCH for real-time UI updates
      queryClient.invalidateQueries({ 
        queryKey: ['doc', data.id],
        refetchType: 'active'
      });
      
      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-to-me'] });
      queryClient.invalidateQueries({ queryKey: ['active-review', data.id] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['document-revisions', data.id] });
    },
  });
};