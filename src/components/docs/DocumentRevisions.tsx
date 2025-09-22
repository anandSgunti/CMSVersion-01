import React, { useState } from 'react';
import { History, Eye, User, Calendar, FileText } from 'lucide-react';
import { Button, Dialog } from '../ui';
import { useDocumentRevisions } from '../../hooks/useDocumentRevisions';
import { formatRelative } from '../../lib/date';

interface DocumentRevisionsProps {
  docId: string;
}

export const DocumentRevisions: React.FC<DocumentRevisionsProps> = ({ docId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<any>(null);
  const { data: revisions, isLoading } = useDocumentRevisions(docId);

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="hover:bg-gray-50"
      >
        <History size={16} className="mr-2" />
        Version History
        {revisions && revisions.length > 0 && (
          <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded-full">
            {revisions.length}
          </span>
        )}
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedRevision(null);
        }}
        title="Document Version History"
      >
        <div className="max-w-4xl w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading revisions...</span>
            </div>
          ) : !revisions || revisions.length === 0 ? (
            <div className="text-center py-8">
              <History size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No previous versions found</p>
            </div>
          ) : selectedRevision ? (
            // Show selected revision details
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Version {selectedRevision.version_number}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {selectedRevision.created_by_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatRelative(selectedRevision.created_at)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRevision(null)}
                >
                  Back to List
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Title</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-800">{selectedRevision.title}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Content</h4>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-96 overflow-y-auto">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedRevision.body }}
                    />
                  </div>
                </div>

                {selectedRevision.change_summary && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Change Summary</h4>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-blue-800">{selectedRevision.change_summary}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Show revisions list
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Track all changes made to this document over time.
              </p>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {revisions.map((revision) => (
                  <div
                    key={revision.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            Version {revision.version_number}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {formatRelative(revision.created_at)}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-gray-800 mb-1">
                          {revision.title}
                        </h4>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {truncateText(stripHtml(revision.body), 120)}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {revision.created_by_name}
                          </span>
                          {revision.summary && (
                            <span className="flex items-center gap-1">
                              <FileText size={12} />
                              {truncateText(revision.summary, 50)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRevision(revision)}
                        className="ml-4"
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};