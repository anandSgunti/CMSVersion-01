import React, { useState } from 'react';
import { MoreHorizontal, Archive, Trash2, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button, Dialog } from './ui';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { useArchiveDocument } from '../hooks/useArchiveDocument';
import { useRestoreDocument } from '../hooks/useRestoreDocument';
import { useToast } from '../providers/ToastProvider';
import { useNavigate } from 'react-router-dom';

interface DocumentActionsMenuProps {
  docId: string;
  docTitle: string;
  isAuthor: boolean;
  currentStatus: string;
}

export const DocumentActionsMenu: React.FC<DocumentActionsMenuProps> = ({
  docId,
  docTitle,
  isAuthor,
  currentStatus,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const deleteDocument = useDeleteDocument();
  const archiveDocument = useArchiveDocument();
  const restoreDocument = useRestoreDocument();

  const handleDelete = async () => {
    try {
      await deleteDocument.mutateAsync({ docId });
      showToast('Document deleted successfully', 'success');
      navigate('/docs');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to delete document',
        'error'
      );
    }
    setIsDeleteDialogOpen(false);
  };

  const handleArchive = async () => {
    try {
      await archiveDocument.mutateAsync({ docId });
      showToast('Document archived successfully', 'success');
      navigate('/docs');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to archive document',
        'error'
      );
    }
    setIsArchiveDialogOpen(false);
  };

  const handleRestore = async () => {
    try {
      await restoreDocument.mutateAsync({ docId });
      showToast('Document restored to published status', 'success');
      // Stay on the same page since it's now published and editable
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to restore document',
        'error'
      );
    }
    setIsRestoreDialogOpen(false);
  };

  // Don't show menu if user is not the author
  if (!isAuthor) {
    return null;
  }

  const isArchived = currentStatus === 'archived';

  return (
    <>
      <div className="relative">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="hover:bg-gray-50"
        >
          <MoreHorizontal size={16} />
        </Button>

        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <div className="py-1">
                {isArchived ? (
                  <button
                    onClick={() => {
                      setIsRestoreDialogOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Restore Document
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsArchiveDialogOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Archive size={16} />
                    Archive Document
                  </button>
                )}
                
                <div className="border-t border-gray-100 my-1" />
                
                <button
                  onClick={() => {
                    setIsDeleteDialogOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Document
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Restore Confirmation Dialog */}
      <Dialog
        isOpen={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        title="Restore Document"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <RotateCcw size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                Restore "{docTitle}"?
              </p>
              <p className="text-gray-600 text-sm mt-1">
                This document will be restored to published status and will be available for editing and collaboration again.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsRestoreDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRestore}
              disabled={restoreDocument.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {restoreDocument.isPending ? 'Restoring...' : 'Restore Document'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog
        isOpen={isArchiveDialogOpen}
        onClose={() => setIsArchiveDialogOpen(false)}
        title="Archive Document"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Archive size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                Archive "{docTitle}"?
              </p>
              <p className="text-gray-600 text-sm mt-1">
                This document will be moved to the archived section and will become read-only. You can restore it later if needed.
                Any active reviews will be cancelled.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsArchiveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleArchive}
              disabled={archiveDocument.isPending}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {archiveDocument.isPending ? 'Archiving...' : 'Archive Document'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Document"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                Permanently delete "{docTitle}"?
              </p>
              <p className="text-gray-600 text-sm mt-1">
                This action cannot be undone. The document and all its comments, reviews, and history will be permanently deleted.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={deleteDocument.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteDocument.isPending ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};