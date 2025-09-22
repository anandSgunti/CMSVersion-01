import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Share, Lock, RotateCcw, RefreshCw, CheckCircle } from 'lucide-react';
import { Button, Input, Spinner } from '../components/ui';
import { RichTextEditor } from '../components/RichTextEditor';
import { CommentsPanel } from '../components/review/CommentsPanel';
import { DocumentProgressBar } from '../components/docs/DocumentProgressBar';
import { DocumentActionsMenu } from '../components/DocumentActionsMenu';
import { useDoc } from '../hooks/useDoc';
import { useOptimisticUpdateDoc } from '../hooks/useOptimisticUpdateDoc';
import { EditorToolbar } from '../components/EditorToolbar';
import { useToast } from '../providers/ToastProvider';
import { useActiveReview } from '../hooks/useActiveReview';
import { useSession } from '../providers/SessionProvider';

export const DocumentEditorPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const { user } = useSession();
  const { data: document, isLoading, error } = useDoc(docId!);
  const { data: activeReview } = useActiveReview(docId!);
  const updateDoc = useOptimisticUpdateDoc();
  const { showToast } = useToast();

  // Local state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const [previousStatus, setPreviousStatus] = useState('');

  // 🔥 MEMOIZED COMPUTATIONS
  const permissions = useMemo(() => {
    if (!document || !user) return { canEdit: false, isAuthor: false, isReviewer: false };
    
    const isReviewer = !!activeReview && user.id === activeReview.reviewer_id;
    const isAuthor = document.author_id === user.id;
    const isArchived = status === 'archived';
    const canEdit = Boolean(isAuthor && !isReviewer && !isArchived);
    
    return { canEdit, isAuthor, isReviewer, isArchived };
  }, [document, user, activeReview, status]);

  const hasChanges = useMemo(() => {
    if (!document) return false;
    return title !== (document.title ?? '') || body !== (document.body ?? '');
  }, [title, body, document]);

  const showResubmitButton = useMemo(() => {
    return status === 'changes_requested' && permissions.isAuthor && hasChanges;
  }, [status, permissions.isAuthor, hasChanges]);

  // Seed local state from fetched doc
  useEffect(() => {
    if (document) {
      setTitle(document.title ?? '');
      setBody(document.body ?? '');
      setStatus(document.status ?? '');
      setPreviousStatus(document.status ?? '');
    }
  }, [document]);

  // 🔥 OPTIMIZED HANDLERS WITH USECALLBACK
  const handleSave = useCallback(async () => {
    if (!docId || !hasChanges || !permissions.canEdit) return;
    
    const wasApprovedOrPublished = previousStatus === 'approved' || previousStatus === 'published';
    
    try {
      const updatedDoc = await updateDoc.mutateAsync({ docId, patch: { title, body } });
      
      // Check if status was reset to draft
      if (wasApprovedOrPublished && updatedDoc.status === 'draft') {
        showToast(
          'Document saved and status reset to draft. Changes to approved/published documents require re-approval.',
          'warning'
        );
        setStatus('draft');
        setPreviousStatus('draft');
      } else {
        showToast('Document saved successfully!', 'success');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save document', 'error');
    }
  }, [docId, hasChanges, permissions.canEdit, previousStatus, updateDoc, title, body, showToast]);

  const handleResubmitForReview = useCallback(async () => {
    if (!docId || !hasChanges || !permissions.canEdit || status !== 'changes_requested') return;
    
    try {
      const updatedDoc = await updateDoc.mutateAsync({ 
        docId, 
        patch: { title, body }, 
        resubmitForReview: true 
      });
      
      showToast('Document resubmitted for review successfully!', 'success');
      setStatus('in_review');
      setPreviousStatus('in_review');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to resubmit for review', 'error');
    }
  }, [docId, hasChanges, permissions.canEdit, status, updateDoc, title, body, showToast]);

  // 🔥 MEMOIZED CONDITIONAL RENDERING
  const showCommentsPanel = useMemo(() => {
    return ['in_review', 'approved', 'published', 'changes_requested'].includes(status);
  }, [status]);

  const showDraftResetWarning = useMemo(() => {
    return previousStatus !== status && status === 'draft' && ['approved', 'published'].includes(previousStatus);
  }, [previousStatus, status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
        
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Spinner size="lg" className="text-blue-600" />
            <p className="mt-4 text-gray-600 font-medium">Loading your document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link to="/docs">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100/80">
                <ArrowLeft size={16} className="mr-2" />
                Back to Documents
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {error ? 'Unable to Load Document' : 'Document Not Found'}
              </h2>
              <p className="text-gray-600">
                {error instanceof Error ? error.message : 'The document you\'re looking for doesn\'t exist or you don\'t have access to it.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex transition-colors">
      {/* Main editor area */}
      <div className="flex-1 flex flex-col">
        {/* Modern sticky header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-colors">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/docs">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Documents
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                      {document.title || 'Untitled Document'}
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      Last updated: {new Date(document.updated_at).toLocaleDateString()}
                      {/* 🔥 SIMPLIFIED STATUS INDICATORS */}
                      {hasChanges && (
                        <>
                          <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                          <span className="text-orange-600 dark:text-orange-400 font-medium">Unsaved changes</span>
                        </>
                      )}
                      {!hasChanges && (
                        <>
                          <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                          <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                            <CheckCircle size={12} />
                            Saved
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Share size={16} className="mr-2" />
                  Share
                </Button>
                
                <DocumentActionsMenu
                  docId={docId!}
                  docTitle={document.title || 'Untitled Document'}
                  isAuthor={permissions.isAuthor}
                  currentStatus={status}
                />
                
                {/* 🔥 RESUBMIT BUTTON */}
                {showResubmitButton && (
                  <Button
                    size="sm"
                    onClick={handleResubmitForReview}
                    disabled={updateDoc.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white transition-colors shadow-sm"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    {updateDoc.isPending ? 'Resubmitting...' : 'Resubmit for Review'}
                  </Button>
                )}
                
                {/* 🔥 SIMPLE SAVE BUTTON */}
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasChanges || updateDoc.isPending || !permissions.canEdit}
                  title={
                    !permissions.canEdit 
                      ? permissions.isArchived 
                        ? 'Archived documents cannot be edited' 
                        : 'Read-only: you cannot edit this document' 
                      : undefined
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm disabled:bg-gray-300"
                >
                  <Save size={16} className="mr-2" />
                  {updateDoc.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Status banners */}
            {!permissions.canEdit && (
              <div className="mt-4 rounded-xl border border-amber-200/60 dark:border-amber-700/60 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 inline-flex items-center gap-3 shadow-sm">
                <div className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-700 flex items-center justify-center">
                  <Lock size={12} />
                </div>
                <span className="font-medium">
                  Read-only: {
                    permissions.isArchived 
                      ? 'This document is archived and cannot be edited. Use the actions menu to restore it.'
                      : permissions.isReviewer 
                      ? 'You are the assigned reviewer for this document.' 
                      : 'Only the author can edit this document.'
                  }
                </span>
              </div>
            )}

            {showDraftResetWarning && (
              <div className="mt-4 rounded-xl border border-blue-200/60 dark:border-blue-700/60 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-3 text-sm text-blue-800 dark:text-blue-300 inline-flex items-center gap-3 shadow-sm">
                <div className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center">
                  <RotateCcw size={12} />
                </div>
                <span className="font-medium">
                  Status reset to draft - Changes to approved/published documents require re-approval through the review process.
                </span>
              </div>
            )}

            {status === 'changes_requested' && permissions.isAuthor && (
              <div className="mt-4 rounded-xl border border-red-200/60 dark:border-red-700/60 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-300 inline-flex items-center gap-3 shadow-sm">
                <div className="w-5 h-5 rounded-full bg-red-200 dark:bg-red-700 flex items-center justify-center">
                  <RefreshCw size={12} />
                </div>
                <span className="font-medium">
                  Changes have been requested. Make your edits and use "Resubmit for Review" to send back to the reviewer.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Editor content */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full px-6 py-8">
            {/* Document Progress Bar */}
            <div className="w-full mx-auto mb-8">
              <DocumentProgressBar 
                currentStatus={status}
                className=""
              />
            </div>

            {/* Floating toolbar - Hide for archived documents */}
            {!permissions.isArchived && (
              <div className="w-full mx-auto mb-8">
                <EditorToolbar
                  docId={docId!}
                  projectId={document.project_id}
                  status={status}
                  isAuthor={permissions.isAuthor}
                  onStatusChange={(s) => {
                    if (permissions.canEdit) {
                      setStatus(s);
                    }
                  }}
                />
              </div>
            )}

            {/* Main editor container - full width */}
            <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100/60 dark:border-gray-700/60 overflow-hidden backdrop-blur-sm transition-colors">
              {/* Title section */}
              <div className="px-12 py-8 border-b border-gray-50/80 dark:border-gray-700/80">
                <Input
                  label=""
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document title..."
                  className="text-3xl font-bold border-none shadow-none p-0 focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 bg-transparent text-gray-900 dark:text-white"
                  disabled={!permissions.canEdit}
                />
              </div>

              {/* Rich text editor section - full height */}
              <div className="px-12 py-8 min-h-[600px]">
                <RichTextEditor
                  value={body}
                  onChange={(v) => { if (permissions.canEdit) setBody(v); }}
                  placeholder="Start writing your document..."
                  className="w-full min-h-[500px] border-none shadow-none focus:ring-0 dark:bg-gray-800"
                  disabled={!permissions.canEdit}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-24"></div>
      </div>

      {/* Modern comments panel */}
      {showCommentsPanel && (
        <div className="w-180 border-l border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-y-auto transition-colors">
          <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Comments & Review</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Collaborate with your team</p>
          </div>
          <div className="p-6">
            <CommentsPanel docId={docId!} />
          </div>
        </div>
      )}
    </div>
  );
};