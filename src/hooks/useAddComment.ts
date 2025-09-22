import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface AddCommentParams {
  docId: string;
  body: string;
  parentId?: string;
  authorId: string;
}

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docId, body, parentId, authorId }: AddCommentParams) => {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          document_id: docId,
          author_id: authorId,
          body: body.trim(),
          parent_id: parentId || null,
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate comments for this document
      queryClient.invalidateQueries({ queryKey: ['comments-threads', variables.docId] });
    },
  });
};