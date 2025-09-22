import React, { useState } from 'react';
import { FileText, Search, Grid, List, Archive, Eye, UserCheck, Shield, Stethoscope, Users } from 'lucide-react';
import { Spinner, EmptyState, Input, Button } from '../../components/ui';
import { useMyDocuments } from '../../hooks/useMyDocuments';
import { useAssignedToMe } from '../../hooks/useAssignedToMe';
import { useArchivedDocuments } from '../../hooks/useArchivedDocuments';
import { useMyReviews } from '../../hooks/useMyReviews';
import { DocumentRow } from '../../components/docs/DocumentRow';
import { DocumentCard } from '../../components/docs/DocumentCard';
import { ReviewRow } from '../../components/reviews/ReviewRow';
import { useToast } from '../../providers/ToastProvider';

type TabType = 'my-documents' | 'assigned-to-me' | 'reviews' | 'archived';

export const MyDocuments: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<TabType>('my-documents');

  const { data: documents, isLoading: documentsLoading, error: documentsError } = useMyDocuments(search);
  const { data: assignedToMe, isLoading: assignedLoading, error: assignedError } = useAssignedToMe(search);
  const { data: archivedDocuments, isLoading: archivedLoading, error: archivedError } = useArchivedDocuments(search);
  const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useMyReviews();

  const getCurrentData = () => {
    switch (activeTab) {
      case 'my-documents':
        return { data: documents, isLoading: documentsLoading, error: documentsError };
      case 'assigned-to-me':
        return { data: assignedToMe, isLoading: assignedLoading, error: assignedError };
      case 'archived':
        return { data: archivedDocuments, isLoading: archivedLoading, error: archivedError };
      case 'reviews':
        return { data: reviews, isLoading: reviewsLoading, error: reviewsError };
      default:
        return { data: [], isLoading: false, error: null };
    }
  };

  const { data, isLoading, error } = getCurrentData();

  const tabs = [
    {
      id: 'my-documents' as TabType,
      label: 'Documents',
      icon: FileText,
      count: documents?.length || 0,
      description: 'Documents created by me',
      color: 'text-primary bg-red-50 border-red-200',
    },
    {
      id: 'assigned-to-me' as TabType,
      label: 'Collaborative',
      icon: Users,
      count: assignedToMe?.length || 0,
      description: 'Shared Documents',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'reviews' as TabType,
      label: 'Reviews',
      icon: Stethoscope,
      count: reviews?.length || 0,
      description: 'My review assignments',
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      id: 'archived' as TabType,
      label: 'Archive',
      icon: Archive,
      count: archivedDocuments?.length || 0,
      description: 'Archived documents',
      color: 'text-gray-600 bg-gray-50 border-gray-200',
    },
  ];

  const getTabDescription = (tabId: TabType) => {
    switch (tabId) {
      case 'my-documents':
        return "Research documents you've authored and are responsible for";
      case 'assigned-to-me':
        return "Collaborative research projects shared with you by colleagues";
      case 'reviews':
        return "Documents requiring your expert review and approval";
      case 'archived':
        return "Previously active documents moved to archive for reference";
      default:
        return "";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Spinner size="lg" className="text-primary" />
            <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
              Loading {
                activeTab === 'my-documents' ? 'your research documents' : 
                activeTab === 'assigned-to-me' ? 'collaborative projects' :
                activeTab === 'archived' ? 'archived documents' : 
                'Reviews'
              }...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
            Error Loading {
              activeTab === 'my-documents' ? 'Research Documents' : 
              activeTab === 'assigned-to-me' ? 'Collaborative Projects' :
              activeTab === 'archived' ? 'Archived Documents' : 
              'Reviews'
            }
          </h2>
          <p className="text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      );
    }

    if (!data || data.length === 0) {
      const currentTab = tabs.find(tab => tab.id === activeTab);
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700">
          {search ? (
            <EmptyState
              icon={currentTab?.icon || FileText}
              title={`No ${activeTab === 'reviews' ? 'Reviews' : 'Documents'} Found`}
              description="No items match your search criteria. Try adjusting your search terms or clearing the search to see all items."
            />
          ) : (
            <EmptyState
              icon={currentTab?.icon || FileText}
              title={
                activeTab === 'my-documents' 
                  ? 'No Research Documents Yet'
                  : activeTab === 'assigned-to-me'
                  ? 'No Collaborative Projects'
                  : activeTab === 'archived'
                  ? 'No Archived Documents'
                  : 'No Reviews'
              }
              description={getTabDescription(activeTab)}
            />
          )}
        </div>
      );
    }

    // Render Reviews differently (table only)
    if (activeTab === 'reviews') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-25 border-b border-green-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Review Queue</h3>
                <p className="text-sm text-green-700"> Documents awaiting your expert review</p>
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Research Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reviews.map((review) => (
                <ReviewRow
                  key={review.review_id}
                  docId={review.doc_id}
                  reviewId={review.review_id}
                  title={review.title || 'Untitled Document'}
                  projectName={review.project_name || 'Unknown Project'}
                  docStatus={review.doc_status}
                  reviewStatus={review.review_status}
                  dueAt={review.due_at}
                  updatedAt={review.updated_at}
                />
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Render Documents with grid/list view
    return (
      <>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((doc: any) => (
              <DocumentCard 
                key={doc.id} 
                document={doc} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Research Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'assigned-to-me' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Principal Investigator
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((doc: any) => (
                  <DocumentRow
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    projectName={doc.projects.name}
                    status={doc.status}
                    updatedAt={doc.updated_at}
                    authorName={activeTab === 'assigned-to-me' ? doc.author_name : undefined}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* J&J Branded Header */}
        {/* <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-elegant">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-white">
                     Workspace
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Johnson & Johnson Healthcare Documents
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your documents, collaborate on healthcare innovation, 
            and track review assignments across J&J's global network.
          </p>
        </div> */}

        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 p-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative p-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? `${tab.color} shadow-lg transform scale-[1.02]`
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? 'bg-white/50' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{tab.label}</div>
                        {tab.count > 0 && (
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            isActive ? 'bg-white/60 text-gray-700' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                          }`}>
                            {tab.count} items
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs opacity-80 ${isActive ? '' : 'text-gray-500'}`}>
                      {tab.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Search and Controls - Hide for reviews tab */}
        {activeTab !== 'reviews' && (
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={`Search ${
                  activeTab === 'my-documents' ? 'your documents' :
                  activeTab === 'assigned-to-me' ? 'collaborative projects' :
                  'archived documents'
                }...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-red-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
              />
            </div>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-none ${viewMode === 'grid' ? 'bg-red-100 text-red-700' : 'text-gray-600'}`}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-none border-l ${viewMode === 'list' ? 'bg-red-100 text-red-700' : 'text-gray-600'}`}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        )}

        {renderContent()}

        {/* Footer with stats */}
        {/* {!isLoading && !error && data && data.length > 0 && (
        <div className="mt-12 bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors rounded-2xl p-6 border border-primary/10">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {tabs.map((tab) => (
                <div key={tab.id}>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {tab.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {tab.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Shield size={14} />
            <span>Your Secure Healthcare Innovation Platform</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            © 2025 Mednet Health. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
};