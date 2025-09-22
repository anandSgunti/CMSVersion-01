import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Users, Clock, MoreHorizontal } from 'lucide-react';
import { Button, Spinner, Input } from '../components/ui';
import { ReviewHeader } from '../components/review/ReviewHeader';

import { CommentsPanel } from '../components/review/CommentsPanel';
import { RichTextEditor } from '../components/RichTextEditor';
import { useDocWithProjectAuthor } from '../hooks/useDocWithProjectAuthor';
import { useCollaboratorsCount } from '../hooks/useCollaboratorsCount';
import { useActiveReview } from '../hooks/useActiveReview';
import { useReviewActions } from '../hooks/useReviewActions';
import { useUpdateDoc } from '../hooks/useUpdateDoc';
import { DocumentProgressBar } from '../components/docs/DocumentProgressBar';

import { useSession } from '../providers/SessionProvider';
import { useToast } from '../providers/ToastProvider';

export const ReviewWorkspace: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const { user } = useSession();
  const { showToast } = useToast();

  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [hasChanges, setHasChanges] = React.useState(false);

  const {
    data: document,
    isLoading: docLoading,
    error: docError,
  } = useDocWithProjectAuthor(docId!);

  const { data: collaboratorsCount = 0 } = useCollaboratorsCount(docId!);
  const { data: activeReview } = useActiveReview(docId!);
  const { approve, requestChanges, revokeApproval, resubmitForReview } = useReviewActions();
  const updateDoc = useUpdateDoc();

  // Seed local state from fetched document
  React.useEffect(() => {
    if (document) {
      setTitle(document.title ?? '');
      setBody(document.body ?? '');
      setHasChanges(false);
    }
  }, [document]);

  // Track local changes
  React.useEffect(() => {
    if (!document) return;
    setHasChanges(title !== (document.title ?? '') || body !== (document.body ?? ''));
  }, [title, body, document]);

  // --- Permissions (author can edit anytime, reviewer cannot) ---
  const isReviewer = !!activeReview && !!user && activeReview.reviewer_id === user.id;
  const isAuthor = !!document && !!user && document.author_id === user.id;

  // Reviewer can NEVER edit. Author can edit unless they are also the reviewer.
  const canEdit = Boolean(isAuthor && !isReviewer);

  // Only the assigned reviewer (or add admin later) can approve/request changes
  const canAct = Boolean(activeReview && user && activeReview.reviewer_id === user.id);

  const handleSave = async () => {
    if (!docId || !hasChanges) return;
    try {
      await updateDoc.mutateAsync({
        docId,
        patch: { title, body },
      });
      showToast('Document saved successfully!', 'success');
      setHasChanges(false);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to save document',
        'error'
      );
    }
  };

  const handleApprove = async () => {
    if (!docId) return;
    try {
      await approve.mutateAsync({ docId });
      showToast('Document approved successfully', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to approve document',
        'error'
      );
    }
  };

  const handleRequestChanges = async () => {
    if (!docId) return;
    try {
      await requestChanges.mutateAsync({ docId });
      showToast('Changes requested successfully', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to request changes',
        'error'
      );
    }
  };

  const handleRevokeApproval = async () => {
    if (!docId) return;
    try {
      await revokeApproval.mutateAsync({ docId });
      showToast('Approval revoked successfully', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to revoke approval',
        'error'
      );
    }
  };

  const handleResubmitForReview = async () => {
    if (!docId) return;
    try {
      await resubmitForReview.mutateAsync({ docId });
      showToast('Document resubmitted for review', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to resubmit for review',
        'error'
      );
    }
  };

  if (docLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Modern header skeleton */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-64 h-8 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading content */}
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Spinner size="lg" className="text-blue-600" />
            <p className="mt-4 text-gray-600 font-medium">Loading review workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (docError || !document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link to="/docs">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100/80">
                <ArrowLeft size={16} className="mr-2" />
                Back to Reviews
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Document</h2>
              <p className="text-gray-600">
                {docError instanceof Error
                  ? docError.message
                  : 'Document not found or access denied'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = approve.isPending || requestChanges.isPending || revokeApproval.isPending || resubmitForReview.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Main review area */}
      <div className="flex-1 flex flex-col">
        {/* Modern sticky header with review context */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/docs">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100/80 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Documents
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                      {document.title || 'Untitled Document'}
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        Review Mode
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {collaboratorsCount} collaborator{collaboratorsCount !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(document.updated_at).toLocaleDateString()}
                      </span>
                      {hasChanges && (
                        <>
                          <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                          <span className="text-orange-600 font-medium">Unsaved changes</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hover:bg-gray-50">
                  <MoreHorizontal size={16} />
                </Button>
                {hasChanges && canEdit && (
                  <Button
                    onClick={handleSave}
                    disabled={updateDoc.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                    size="sm"
                  >
                    {updateDoc.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full width content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 pr-4">

            {/* Progress Bar with Review Actions */}
            <div className="mb-8">
              <DocumentProgressBar 
                currentStatus={document.status}
                className=""
                isReviewMode={true}
                isReviewer={isReviewer}
                isAuthor={isAuthor}
                reviewerName={activeReview?.reviewer_name}
                dueAt={activeReview?.due_at}
                canAct={canAct}
                onApprove={handleApprove}
                onRequestChanges={handleRequestChanges}
                onRevokeApproval={handleRevokeApproval}
                onResubmitForReview={handleResubmitForReview}
                isLoading={isLoading}
              />
            </div>

            {/* Review Header */}
            <div className="mb-8">
              <ReviewHeader
                title={document.title}
                status={document.status}
                projectName={document.project_name}
                updatedAt={document.updated_at}
                collaboratorsCount={collaboratorsCount}
              />
            </div>

            {/* Main document container - Full width responsive */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100/60 overflow-hidden backdrop-blur-sm w-full">
              {/* Title section */}
              <div className="px-4 sm:px-8 lg:px-12 py-6 border-b border-gray-50/80">
                <Input
                  label=""
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document title..."
                  className="text-3xl font-bold border-none shadow-none p-0 focus:ring-0 placeholder:text-gray-300 bg-transparent"
                  disabled={!canEdit}
                />
                {!canEdit && (
                  <div className="mt-4 rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 text-sm text-blue-800 inline-flex items-center gap-3 shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center">
                      <Eye size={12} />
                    </div>
                    <span className="font-medium">
                      {isReviewer ? 'You are reviewing this document in read-only mode.' : 'Document is in review mode.'}
                    </span>
                  </div>
                )}
              </div>

            {/* Rich text editor section */}
            <div className="px-4 sm:px-8 lg:px-12 py-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Document Content
                  </label>
                </div>
                <RichTextEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Document content..."
                  className="w-full min-h-[600px] border-none shadow-none focus:ring-0"
                  disabled={!canEdit}
                />
              </div>

              {/* Footer with last updated info */}
              {document.updated_at && (
                <div className="px-4 sm:px-8 lg:px-12 py-4 bg-gray-50/30 border-t border-gray-50/80">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>
                        Last updated: {new Date(document.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    {hasChanges && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="font-medium">Unsaved changes</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Spacing at bottom */}
            <div className="h-24"></div>
          </div>
        </div>
      </div>

      {/* Modern comments panel - Fixed width sidebar */}
      <div className="w-180 min-w-180 flex-shrink-0 border-l border-gray-200/50 bg-white/50 backdrop-blur-sm overflow-y-auto">
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4">
          <h3 className="font-semibold text-gray-900">Review Comments</h3>
          <p className="text-xs text-gray-500 mt-1">Feedback and collaboration</p>
        </div>
        <div className="p-4">
          <CommentsPanel docId={docId!} />
        </div>
      </div>
    </div>
  );
};