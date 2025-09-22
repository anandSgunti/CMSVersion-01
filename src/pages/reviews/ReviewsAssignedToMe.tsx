import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import { Spinner, EmptyState } from '../../components/ui';
import { useMyReviews } from '../../hooks/useMyReviews';
import { ReviewRow } from '../../components/reviews/ReviewRow';

export const ReviewsAssignedToMe: React.FC = () => {
  const { data: reviews, isLoading, error } = useMyReviews();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-1">Review assignments</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-gray-600">Loading reviews...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Reviews
            </h2>
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        )}

        {!isLoading && !error && reviews && (
          <>
            {reviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <EmptyState
                  icon={ClipboardCheck}
                  title="No Reviews Assigned"
                  description="You don't have any review requests assigned to you at the moment."
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <ReviewRow
                        key={review.review_id}
                        docId={review.doc_id}
                        reviewId={review.review_id}
                        title={review.title}
                        projectName={review.project_name}
                        docStatus={review.doc_status}
                        reviewStatus={review.review_status}
                        dueAt={review.due_at}
                        updatedAt={review.updated_at}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};