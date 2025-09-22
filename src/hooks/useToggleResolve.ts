import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface ToggleResolveParams {
  threadId: string;
  docId: string;
  newValue: boolean;
}

export const useToggleResolve = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadId, newValue }: ToggleResolveParams) => {
      console.log('Attempting to toggle resolve for threadId:', threadId, 'newValue:', newValue);
      
      const { data, error } = await supabase
        .from('comments')
        .update({
          is_resolved: newValue,
          resolved_at: newValue ? new Date().toISOString() : null,
        })
        .eq('id', threadId)
        .is('parent_id', null)
        .select('id, is_resolved');

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        console.warn('No matching comment thread found for threadId:', threadId);
        throw new Error('Comment thread not found');
      }

      console.log('Successfully updated comment thread:', data[0]);
      return data[0];
    },
    onSuccess: (_, variables) => {
      // Invalidate comments for this document
      queryClient.invalidateQueries({ queryKey: ['comments-threads', variables.docId] });
    },
  });
};