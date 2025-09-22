import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface DeleteDocumentParams {
  docId: string;
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docId }: DeleteDocumentParams) => {
      // First check if user is the author
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('author_id')
        .eq('id', docId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || document.author_id !== user.id) {
        throw new Error('Only the document author can delete this document');
      }

      // Delete related records first (cascade)
      // Delete comments
      await supabase
        .from('comments')
        .delete()
        .eq('document_id', docId);

      // Delete review requests
      await supabase
        .from('review_requests')
        .delete()
        .eq('document_id', docId);

      // Delete document permissions
      await supabase
        .from('document_permissions')
        .delete()
        .eq('document_id', docId);

      // Finally delete the document
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      return { docId };
    },
    onSuccess: () => {
      // Invalidate all document-related queries
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      queryClient.invalidateQueries({ queryKey: ['archived-documents'] });
      queryClient.invalidateQueries({ queryKey: ['doc'] });
    },
  });
};