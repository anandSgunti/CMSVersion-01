import { useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface CreateFromTemplateParams {
  templateId: string;
  projectId: string;
  title: string;
}

export const useCreateFromTemplate = () => {
  return useMutation({
    mutationFn: async ({ templateId, projectId, title }: CreateFromTemplateParams): Promise<string> => {
      const { data, error } = await supabase.rpc('create_document_from_template', {
        p_template_id: templateId,
        p_project_id: projectId,
        p_title: title
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to create document from template');
      }

      return data;
    },
  });
};