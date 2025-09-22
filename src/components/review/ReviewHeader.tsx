import React from 'react';
import { Share } from 'lucide-react';
import { Button } from '../ui';
import { StatusBadge } from '../common/StatusBadge';
import { formatRelative } from '../../lib/date';

interface ReviewHeaderProps {
  title: string;
  status: string;
  projectName: string;
  updatedAt: string;
  collaboratorsCount: number;
  onShare?: () => void;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  title,
  status,
  projectName,
  updatedAt,
  collaboratorsCount,
  onShare,
}) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} type="document" />
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share size={16} className="mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Last edited {formatRelative(updatedAt)} • {projectName} • {collaboratorsCount} collaborator{collaboratorsCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
};