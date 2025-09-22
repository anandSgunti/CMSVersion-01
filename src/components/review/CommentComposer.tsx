import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button, Textarea } from '../ui';

interface CommentComposerProps {
  onSubmit: (body: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({
  onSubmit,
  placeholder = "Add a comment...",
  isLoading = false,
}) => {
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim()) {
      onSubmit(body.trim());
      setBody('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={body}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={!body.trim() || isLoading}
        >
          <Send size={14} className="mr-1" />
          {isLoading ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  );
};