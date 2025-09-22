import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface ArchiveDocumentParams {
  docId: string;
}

export const useArchiveDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docId }: ArchiveDocumentParams) => {
      // First check if user is the author
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('author_id, status')
        .eq('id', docId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || document.author_id !== user.id) {
        throw new Error('Only the document author can archive this document');
      }

      // Update document status to archived
      const { data, error } = await supabase
        .from('documents')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', docId)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // Cancel any active review requests
      await supabase
        .from('review_requests')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('document_id', docId)
        .in('status', ['requested', 'in_review']);

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['doc', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      queryClient.invalidateQueries({ queryKey: ['archived-documents'] });
      queryClient.invalidateQueries({ queryKey: ['active-review', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
  });
};