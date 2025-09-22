import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface Comment {
  id: string;
  author_id: string;
  author_name: string;
  body: string;
  is_resolved: boolean;
  created_at: string;
  parent_id?: string;
}

export interface CommentThread {
  root: Comment;
  replies: Comment[];
}

export interface CommentsData {
  threads: CommentThread[];
  activeCount: number;
}

export const useCommentsThreads = (docId: string) => {
  return useQuery({
    queryKey: ['comments-threads', docId],
    queryFn: async (): Promise<CommentsData> => {
      // Get top-level comments
      const { data: topLevel, error: topError } = await supabase
        .from('comments')
        .select(`
          id,
          author_id,
          body,
          is_resolved,
          created_at,
          profiles!comments_author_id_fkey(name)
        `)
        .eq('document_id', docId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (topError) {
        throw new Error(topError.message);
      }

      if (!topLevel || topLevel.length === 0) {
        return { threads: [], activeCount: 0 };
      }

      // Get replies for all top-level comments
      const topLevelIds = topLevel.map(c => c.id);
      const { data: replies, error: repliesError } = await supabase
        .from('comments')
        .select(`
          id,
          parent_id,
          author_id,
          body,
          created_at,
          profiles!comments_author_id_fkey(name)
        `)
        .eq('document_id', docId)
        .in('parent_id', topLevelIds)
        .order('created_at', { ascending: true });

      if (repliesError) {
        throw new Error(repliesError.message);
      }

      // Group replies by parent_id
      const repliesByParent = (replies || []).reduce((acc, reply) => {
        const parentId = reply.parent_id!;
        if (!acc[parentId]) acc[parentId] = [];
        acc[parentId].push({
          id: reply.id,
          author_id: reply.author_id,
          author_name: reply.profiles?.name || 'Unknown',
          body: reply.body,
          is_resolved: false,
          created_at: reply.created_at,
          parent_id: reply.parent_id,
        });
        return acc;
      }, {} as Record<string, Comment[]>);

      // Build threads
      const threads: CommentThread[] = topLevel.map(comment => ({
        root: {
          id: comment.id,
          author_id: comment.author_id,
          author_name: comment.profiles?.name || 'Unknown',
          body: comment.body,
          is_resolved: comment.is_resolved,
          created_at: comment.created_at,
        },
        replies: repliesByParent[comment.id] || [],
      }));

      const activeCount = threads.filter(t => !t.root.is_resolved).length;

      return { threads, activeCount };
    },
    enabled: !!docId,
  });
};