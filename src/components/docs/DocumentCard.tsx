import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, User, Calendar } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatRelative } from '../../lib/date';
import { MyDocument } from '../../hooks/useMyDocuments';

interface DocumentCardProps {
  document: MyDocument;
  onClick?: () => void;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (document.status === 'in_review') {
      navigate(`/reviews/${document.id}`);
    } else {
      navigate(`/docs/${document.id}`);
    }
  };

  const previewText = stripHtml(document.body || '');

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 cursor-pointer group"
    >
      {/* Thumbnail/Preview */}
      <div className="h-32 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center relative overflow-hidden">
        <FileText size={32} className="text-red-400 dark:text-red-500" />
        {previewText && (
          <div className="absolute inset-0 p-3 bg-white/80 dark:bg-gray-800/80 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {truncateText(previewText, 120)}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-2 line-clamp-2">
          {document.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <User size={12} />
          <span>{document.author_name}</span>
        </div>
        
        <div className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          {document.projects.name}
        </div>
        
        <div className="flex items-center justify-between">
          <StatusBadge status={document.status} type="document" />
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>{formatRelative(document.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};