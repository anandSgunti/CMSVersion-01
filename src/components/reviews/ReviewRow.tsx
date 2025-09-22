import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatRelative } from '../../lib/date';

export type DocStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'archived';

export type ReviewStatus =
  | 'requested'
  | 'in_review'
  | 'approved'
  | 'changes_requested'
  | 'declined';

interface ReviewRowProps {
  /** The document to open when the row is clicked */
  docId: string;
  /** The specific review row (carried in route state; optional to use later) */
  reviewId: string;
  title: string;
  projectName: string;
  /** Document workflow status (for the badge) */
  docStatus: DocStatus;
  /** Review status (shown subtly next to the badge, optional) */
  // reviewStatus: ReviewStatus;
  dueAt: string | null;
  updatedAt: string; // ISO
}

const humanize = (s: string) => s.replace(/_/g, ' ');

const DueLabel: React.FC<{ dueAt: string | null }> = ({ dueAt }) => {
  if (!dueAt) return <span className="text-gray-600">No due date</span>;
  const due = new Date(dueAt);
  const isOverdue = due.getTime() < Date.now();
  return (
    <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
      {isOverdue ? 'Overdue: ' : 'Due: '} {formatRelative(dueAt)}
    </span>
  );
};

export const ReviewRow: React.FC<ReviewRowProps> = ({
  docId,
  reviewId,
  title,
  projectName,
  docStatus,
  // reviewStatus,
  dueAt,
  updatedAt,
}) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    // Opens the exact document under review; carries reviewId for optional use
    navigate(`/reviews/${docId}`, { state: { reviewId } });
  };

  return (
    <tr
      onClick={handleOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
      role="button"
      tabIndex={0}
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      aria-label={`Open review for ${title}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={20} className="text-red-500" />
          <div className="text-sm font-medium text-gray-900">{title}</div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {projectName}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <StatusBadge status={docStatus} type="document" />
          <span className="text-xs text-gray-500 hidden sm:inline">
            {/* ({humanize(reviewStatus)}) */}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <DueLabel dueAt={dueAt} />
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatRelative(updatedAt)}
      </td>
    </tr>
  );
};

export default ReviewRow;
