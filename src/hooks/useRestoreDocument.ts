import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface RestoreDocumentParams {
  docId: string;
}

export const useRestoreDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docId }: RestoreDocumentParams) => {
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
        throw new Error('Only the document author can restore this document');
      }

      if (document.status !== 'archived') {
        throw new Error('Only archived documents can be restored');
      }

      // Update document status to published
      const { data, error } = await supabase
        .from('documents')
        .update({ 
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', docId)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['doc', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', variables.docId] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      queryClient.invalidateQueries({ queryKey: ['archived-documents'] });
    },
  });
};