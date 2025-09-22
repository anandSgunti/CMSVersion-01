import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface CreateTemplateParams {
  projectId: string;
  title: string;
  body?: string;
}

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, title, body = '' }: CreateTemplateParams): Promise<string> => {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          title,
          body,
          is_template: true,
          status: 'published', // Templates are typically published immediately
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.id;
    },
    onSuccess: (_, variables) => {
      // Invalidate templates list for this project
      queryClient.invalidateQueries({ queryKey: ['templates', variables.projectId] });
    },
  });
};