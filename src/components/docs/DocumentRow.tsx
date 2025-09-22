import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatRelative } from '../../lib/date';

interface DocumentRowProps {
  id: string;
  title: string;
  projectName: string;
  status: string;
  updatedAt: string;
  authorName?: string; // Optional - shows author info for assigned documents
}

export const DocumentRow: React.FC<DocumentRowProps> = ({
  id,
  title,
  projectName,
  status,
  updatedAt,
  authorName,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (status === 'in_review') {
      navigate(`/reviews/${id}`);
    } else {
      navigate(`/docs/${id}`);
    }
  };

  return (
    <tr
      onClick={handleClick}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-red-500" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{title}</div>
            {authorName && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                by {authorName}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {projectName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={status} type="document" />
      </td>
      {authorName !== undefined && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          {authorName}
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatRelative(updatedAt)}
      </td>
    </tr>
  );
};