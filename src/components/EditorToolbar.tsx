import React, { useState } from 'react';
import { Send, Globe, Languages, Sparkles } from 'lucide-react';
import { Button, Dialog, Select, Textarea, Input } from './ui';
import { useProjectReviewers } from '../hooks/useProjectReviewers';
import { useRequestReview } from '../hooks/useRequestReview';
import { usePublishDocument } from '../hooks/usePublishDocument';
import { useToast } from '../providers/ToastProvider';

interface EditorToolbarProps {
  docId: string;
  projectId: string;
  status: string;
  isAuthor: boolean; // 🔥 NEW PROP
  onStatusChange: (status: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  docId,
  projectId,
  status,
  isAuthor, // 🔥 NEW PROP
  onStatusChange,
}) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [message, setMessage] = useState('');
  const [dueAt, setDueAt] = useState('');
  const { showToast } = useToast();

  const { data: reviewers, isLoading: reviewersLoading } = useProjectReviewers(projectId);
  const requestReview = useRequestReview();
  const publishDocument = usePublishDocument();

  const handleSendForReview = () => {
    setIsReviewDialogOpen(true);
  };

  const handleConfirmReview = async () => {
    if (!selectedReviewer) return;

    try {
      await requestReview.mutateAsync({
        docId,
        reviewerId: selectedReviewer,
        message: message.trim() || undefined,
        dueAt: dueAt || undefined,
      });

      setIsReviewDialogOpen(false);
      setSelectedReviewer('');
      setMessage('');
      setDueAt('');
      onStatusChange('in_review');
      showToast('Review requested successfully!', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to request review',
        'error'
      );
    }
  };

  const handleCancelReview = () => {
    setIsReviewDialogOpen(false);
    setSelectedReviewer('');
    setMessage('');
    setDueAt('');
  };

  const handlePublish = async () => {
    try {
      await publishDocument.mutateAsync({ docId });
      onStatusChange('published');
      showToast('Document published successfully!', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to publish document',
        'error'
      );
    }
  };

  const handleTranslate = () => {
    showToast('Translation feature coming soon!', 'info');
  };

  const handleAIOptimization = () => {
    showToast('AI Content Optimization feature coming soon!', 'info');
  };

  const reviewerOptions = reviewers?.map(reviewer => ({
    value: reviewer.user_id,
    label: `${reviewer.name} (${reviewer.email})`,
  })) || [];

  // 🔥 HIDE TOOLBAR IF NOT AUTHOR
  if (!isAuthor) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {status === 'approved' && (
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={publishDocument.isPending}
            >
              <Globe size={16} className="mr-2" />
              {publishDocument.isPending ? 'Publishing...' : 'Publish'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendForReview}
            disabled={reviewersLoading || !reviewers?.length || status === 'published'}
          >
            <Send size={16} className="mr-2" />
            Send for Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslate}
          >
            <Languages size={16} className="mr-2" />
            Translate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAIOptimization}
          >
            <Sparkles size={16} className="mr-2" />
            AI Optimize
          </Button>
        </div>
      </div>

      <Dialog
        isOpen={isReviewDialogOpen}
        onClose={handleCancelReview}
        title="Send for Review"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Request a review for this document from a project member.
          </p>
          
          <Select
            label="Select Reviewer"
            value={selectedReviewer}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedReviewer(e.target.value)}
            options={[
              { value: '', label: 'Choose a reviewer...' },
              ...reviewerOptions
            ]}
          />

          <Textarea
            label="Message (Optional)"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            placeholder="Add a message for the reviewer..."
            rows={3}
          />

          <Input
            label="Due Date (Optional)"
            type="datetime-local"
            value={dueAt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueAt(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancelReview}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReview}
              disabled={!selectedReviewer || requestReview.isPending}
            >
              {requestReview.isPending ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};