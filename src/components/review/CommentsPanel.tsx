import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Spinner } from '../ui';
import { CommentComposer } from './CommentComposer';
import { CommentThread } from './CommentThread';
import { useCommentsThreads } from '../../hooks/useCommentsThreads';
import { useAddComment } from '../../hooks/useAddComment';
import { useToggleResolve } from '../../hooks/useToggleResolve';
import { useSession } from '../../providers/SessionProvider';
import { useToast } from '../../providers/ToastProvider';
import { supabase } from '../../lib/supabaseClient';

interface CommentsPanelProps {
  docId: string;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({ docId }) => {
  const { user } = useSession();
  const { showToast } = useToast();
  const { data: commentsData, isLoading, error, refetch } = useCommentsThreads(docId);
  const addComment = useAddComment();
  const toggleResolve = useToggleResolve();

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${docId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `document_id=eq.${docId}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [docId, refetch]);

  const handleNewComment = async (body: string) => {
    try {
      await addComment.mutateAsync({ docId, body, authorId: user!.id });
      showToast('Comment posted successfully', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to post comment',
        'error'
      );
    }
  };

  const handleReply = (threadId: string) => async (body: string) => {
    try {
      await addComment.mutateAsync({ docId, body, parentId: threadId, authorId: user!.id });
      showToast('Reply posted successfully', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to post reply',
        'error'
      );
    }
  };

  const handleToggleResolve = (threadId: string, currentValue: boolean) => async () => {
    try {
      await toggleResolve.mutateAsync({
        threadId,
        docId,
        newValue: !currentValue,
      });
      showToast(
        !currentValue ? 'Thread resolved' : 'Thread reopened',
        'success'
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to update thread',
        'error'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Loading comments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">
          {error instanceof Error ? error.message : 'Failed to load comments'}
        </p>
      </div>
    );
  }

  const { threads = [], activeCount = 0 } = commentsData || {};

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Discussion</h3>
            <p className="text-sm text-gray-500">Collaborate on this document</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {activeCount} active
          </span>
        </div>
      </div>

      {/* New comment composer */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
        <CommentComposer
          onSubmit={handleNewComment}
          placeholder="Share your thoughts or ask a question..."
          isLoading={addComment.isPending}
        />
      </div>

      {/* Comments threads */}
      <div className="space-y-4">
        {threads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No comments yet</h4>
            <p className="text-sm">Be the first to start the discussion!</p>
          </div>
        ) : (
          threads.map((thread) => (
            <CommentThread
              key={thread.root.id}
              root={thread.root}
              replies={thread.replies}
              onReply={handleReply(thread.root.id)}
              onToggleResolve={handleToggleResolve(thread.root.id, thread.root.is_resolved)}
              canResolve={true} // TODO: Add proper permission check
              isLoading={toggleResolve.isPending}
            />
          ))
        )}
      </div>
    </div>
  );
};