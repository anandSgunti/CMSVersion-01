import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface PublishDocumentParams {
  docId: string;
}

export const usePublishDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docId }: PublishDocumentParams) => {
      const { data, error } = await supabase
        .from('documents')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', docId)
        .select('id, status, published_at')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['doc', data.id] });
      queryClient.invalidateQueries({ queryKey: ['doc-with-project-author', data.id] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
    },
  });
};