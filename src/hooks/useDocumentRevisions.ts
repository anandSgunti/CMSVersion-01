import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface DocumentRevision {
  id: string;
  document_id: string;
  version_number: number;
  title: string;
  body: string;
  created_by: string;
  created_at: string;
  change_summary: string;
  created_by_name: string;
}

export const useDocumentRevisions = (docId: string) => {
  return useQuery({
    queryKey: ['document-revisions', docId],
    queryFn: async (): Promise<DocumentRevision[]> => {
      const { data, error } = await supabase
        .from('document_revisions')
        .select(`
          id,
          document_id,
          version_number,
          title,
          body,
          created_by,
          created_at,
          change_summary,
          profiles!document_revisions_created_by_fkey(name)
        `)
        .eq('document_id', docId)
        .order('version_number', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(item => ({
        id: item.id,
        document_id: item.document_id,
        version: item.version,
        title: item.title,
        body: item.body,
        created_by: item.created_by,
        created_at: item.created_at,
        summary: item.summary,
        created_by_name: item.profiles?.name || 'Unknown',
      }));
    },
    enabled: !!docId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};