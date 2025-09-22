import React, { useState } from 'react';
import { Reply, Check, RotateCcw, User } from 'lucide-react';
import { Button } from '../ui';
import { CommentComposer } from './CommentComposer';
import { formatRelative } from '../../lib/date';
import { Comment } from '../../hooks/useCommentsThreads';

interface CommentThreadProps {
  root: Comment;
  replies: Comment[];
  onReply: (body: string) => void;
  onToggleResolve: (newValue: boolean) => void;
  canResolve?: boolean;
  isLoading?: boolean;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  root,
  replies,
  onReply,
  onToggleResolve,
  canResolve = true,
  isLoading = false,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (body: string) => {
    onReply(body);
    setShowReplyForm(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
      {/* Root comment */}
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-sm">
            <User size={18} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-semibold text-gray-900">
                {root.author_name}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {formatRelative(root.created_at)}
              </span>
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                root.is_resolved 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {root.is_resolved ? '✓ Resolved' : '⏳ Open'}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {root.body}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-14">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Reply size={14} className="mr-1" />
            Reply
          </Button>
          {canResolve && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleResolve(!root.is_resolved)}
              disabled={isLoading}
              className={root.is_resolved 
                ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                : "text-green-600 hover:text-green-700 hover:bg-green-50"
              }
            >
              {root.is_resolved ? (
                <>
                  <RotateCcw size={14} className="mr-1" />
                  Reopen
                </>
              ) : (
                <>
                  <Check size={14} className="mr-1" />
                  Mark Resolved
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-14 space-y-3 border-l-2 border-blue-100 pl-5 bg-gradient-to-r from-blue-50/50 to-transparent rounded-r-lg">
          {replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center">
                <User size={14} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {reply.author_name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {formatRelative(reply.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {reply.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <div className="ml-14 border-l-2 border-blue-200 pl-5 bg-blue-50/30 rounded-r-lg p-3">
          <CommentComposer
            onSubmit={handleReply}
            placeholder="Write a thoughtful reply..."
          />
        </div>
      )}
    </div>
  );
};