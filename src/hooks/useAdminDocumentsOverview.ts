import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface AdminDocument {
  id: string;
  title: string;
  status: string;
  is_template: boolean;
  project_name: string;
  author_name: string;
  author_email: string;
  created_at: string;
  updated_at: string;
}

interface DocumentFilters {
  project?: string;
  status?: string;
  is_template?: boolean;
}

export const useAdminDocumentsOverview = (
  filters: DocumentFilters = {},
  limit = 50,
  offset = 0
) => {
  return useQuery({
    queryKey: ['admin-documents-overview', filters, limit, offset],
    queryFn: async (): Promise<AdminDocument[]> => {
      const { data, error } = await supabase.rpc('admin_documents_overview', {
        p_project_filter: filters.project || null,
        p_status_filter: filters.status || null,
        p_is_template_filter: filters.is_template ?? null,
        p_limit: limit,
        p_offset: offset
      });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });
};