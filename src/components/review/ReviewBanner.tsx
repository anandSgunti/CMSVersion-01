import React from 'react';
import { Clock, CheckCircle, AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from '../ui';
import { formatRelative } from '../../lib/date';

interface ReviewBannerProps {
  reviewerName: string;
  dueAt: string | null;
  canAct: boolean;
  documentStatus: string;
  onApprove: () => void;
  onRequestChanges: () => void;
  onRevokeApproval: () => void;
  onResubmitForReview: () => void;
  isLoading?: boolean;
}

export const ReviewBanner: React.FC<ReviewBannerProps> = ({
  reviewerName,
  dueAt,
  canAct,
  documentStatus,
  onApprove,
  onRequestChanges,
  onRevokeApproval,
  onResubmitForReview,
  isLoading = false,
}) => {
  const getBannerColor = () => {
    switch (documentStatus) {
      case 'in_review':
        return 'bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'changes_requested':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getBannerMessage = () => {
    switch (documentStatus) {
      case 'in_review':
        return `This document is under review by ${reviewerName}`;
      case 'approved':
        return `This document has been approved by ${reviewerName}`;
      case 'changes_requested':
        return `Changes have been requested by ${reviewerName}`;
      default:
        return `This document is being reviewed by ${reviewerName}`;
    }
  };

  const getMessageColor = () => {
    switch (documentStatus) {
      case 'in_review':
        return 'text-yellow-800';
      case 'approved':
        return 'text-green-800';
      case 'changes_requested':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  const getDueDateColor = () => {
    switch (documentStatus) {
      case 'in_review':
        return 'text-yellow-700';
      case 'approved':
        return 'text-green-700';
      case 'changes_requested':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getIcon = () => {
    switch (documentStatus) {
      case 'in_review':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'changes_requested':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const Icon = getIcon();

  const renderActionButtons = () => {
    if (!canAct) return null;

    switch (documentStatus) {
      case 'in_review':
        return (
          <>
            <Button
              size="sm"
              onClick={onApprove}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle size={16} className="mr-1" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestChanges}
              disabled={isLoading}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <AlertTriangle size={16} className="mr-1" />
              Request Changes
            </Button>
          </>
        );
      case 'approved':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={onRevokeApproval}
            disabled={isLoading}
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            <RotateCcw size={16} className="mr-1" />
            Revoke Approval
          </Button>
        );
      case 'changes_requested':
        return (
          <Button
            size="sm"
            onClick={onResubmitForReview}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw size={16} className="mr-1" />
            Resubmit for Review
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm">
              <Icon size={20} className="text-yellow-600" />
            </div>
            <div>
              <span className="text-base font-semibold text-yellow-900 block">
                {getBannerMessage()}
              </span>
              <span className="text-sm text-yellow-700">
                Document under evaluation
              </span>
            </div>
          </div>
          {dueAt && (
            <div className="text-sm text-yellow-700 ml-13">
              Due: {formatRelative(dueAt)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};