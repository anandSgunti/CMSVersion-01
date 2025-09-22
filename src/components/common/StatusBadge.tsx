import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'project' | 'document';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'document' }) => {
  const getStatusStyles = () => {
    if (type === 'project') {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'in_review':
          return 'bg-yellow-100 text-yellow-800';
        case 'draft':
          return 'bg-gray-100 text-gray-800';
        case 'archived':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'draft':
          return 'bg-gray-100 text-gray-800';
        case 'in_review':
          return 'bg-yellow-100 text-yellow-800';
        case 'approved':
          return 'bg-green-100 text-green-800';
        case 'changes_requested':
          return 'bg-red-100 text-red-800';
        case 'published':
          return 'bg-blue-100 text-blue-800';
        case 'archived':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}>
      {formatStatus(status)}
    </span>
  );
};