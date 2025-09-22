import React from 'react';
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  Globe, 
  AlertTriangle, 
  Archive, 
  Clock, 
  RotateCcw, 
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';

interface DocumentProgressBarProps {
  currentStatus: string;
  className?: string;
  isReviewMode?: boolean;
  isReviewer?: boolean;
  isAuthor?: boolean;
  // Review Banner Props
  reviewerName?: string;
  dueAt?: string | null;
  canAct?: boolean;
  onApprove?: () => void;
  onRequestChanges?: () => void;
  onRevokeApproval?: () => void;
  onResubmitForReview?: () => void;
  isLoading?: boolean;
}


/** Role-aware theme classes */
const getRoleTheme = (isReviewer?: boolean) => {
  return {
    activeStep: isReviewer 
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
      : 'bg-gradient-to-r from-red-600 to-red-700 text-white',
    completedStep: isReviewer
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      : 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    textAccent: isReviewer ? 'text-blue-700' : 'text-red-700',
  };
};

const workflowSteps = [
  {
    key: 'draft',
    label: 'Draft',
    icon: FileText,
  },
  {
    key: 'in_review',
    label: 'Review',
    icon: Eye,
  },
  {
    key: 'changes_requested',
    label: 'Revision',
    icon: AlertTriangle,
  },
  {
    key: 'approved',
    label: 'Approved',
    icon: CheckCircle,
  },
  {
    key: 'published',
    label: 'Published',
    icon: Globe,
  },
];

export const DocumentProgressBar: React.FC<DocumentProgressBarProps> = ({
  currentStatus,
  className = '',
  isReviewMode = false,
  isReviewer = false,
  isAuthor = false,
  // Review Banner Props
  canAct = false,
  onApprove,
  onRequestChanges,
  onRevokeApproval,
  onResubmitForReview,
  isLoading = false,
}) => {
  const theme = getRoleTheme(isReviewer);

  const getCurrentStepIndex = () => {
    if (currentStatus === 'archived') return workflowSteps.length - 1;
    const index = workflowSteps.findIndex((s) => s.key === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();
  const isArchived = currentStatus === 'archived';

  const getRoleIndicator = () => {
    if (isArchived)
      return (
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          <Archive size={12} />
          <span>Archived</span>
        </div>
      );

    if (!isReviewMode) return null;

    if (isReviewer)
      return (
        <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <Eye size={12} />
          <span>Reviewer</span>
        </div>
      );

    if (isAuthor)
      return (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
          <FileText size={12} />
          <span>Author</span>
        </div>
      );

    return null;
  };


  const renderActionButtons = () => {
    if (!canAct) return null;

    switch (currentStatus) {
      case 'in_review':
        return (
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={onApprove}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white h-9 px-4 border-0 shadow-sm font-medium transition-all duration-200"
            >
              <CheckCircle size={16} className="mr-2" />
              Approve Document
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestChanges}
              disabled={isLoading}
              className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white border-0 h-9 px-4 shadow-sm font-medium transition-all duration-200"
            >
              <AlertTriangle size={16} className="mr-2" />
              Request Changes
            </Button>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-sm font-medium">Document Approved</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRevokeApproval}
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white border-0 h-9 px-4 shadow-sm font-medium transition-all duration-200"
            >
              <RotateCcw size={16} className="mr-2" />
              Revoke Approval
            </Button>
          </div>
        );
      case 'changes_requested':
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
              <AlertTriangle size={16} className="text-rose-600" />
              <span className="text-sm font-medium">Changes Requested</span>
            </div>
            {isAuthor && (
              <Button
                size="sm"
                onClick={onResubmitForReview}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-9 px-4 border-0 shadow-sm font-medium transition-all duration-200"
              >
                <RefreshCw size={16} className="mr-2" />
                Resubmit for Review
              </Button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Bar Widget */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header - Compact */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {isArchived ? 'Archived Document' : 'Document Workflow'}
              </h3>
              <p className="text-xs text-gray-500">Mednet Healthcare Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getRoleIndicator()}
            <div className="text-xs text-gray-500">
              {isArchived ? 'Archived' : `Step ${currentStepIndex + 1} of ${workflowSteps.length}`}
            </div>
          </div>
        </div>

        {/* Slim Progress Bar with Arrows */}
        <div className="px-4 py-4">
          <div className="relative flex items-center">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex && !isArchived;
              const isCompleted = (index < currentStepIndex && !isArchived) || (isArchived && step.key !== 'published');
              const isLast = index === workflowSteps.length - 1;

              return (
                <React.Fragment key={step.key}>
                  {/* Step */}
                  <div className="relative flex-1 group">
                    <div
                      className={`
                        relative h-10 flex items-center justify-center text-sm font-medium transition-all duration-300
                        ${isLast ? 'rounded-r-lg' : ''}
                        ${index === 0 ? 'rounded-l-lg' : ''}
                        ${isCompleted
                          ? theme.completedStep
                          : isActive
                          ? theme.activeStep
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}
                      style={{
                        clipPath: isLast 
                          ? 'none' 
                          : 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)'
                      }}
                    >
                      <div className="flex items-center gap-2 px-3">
                        <Icon size={14} />
                        <span className="hidden sm:inline">{step.label}</span>
                      </div>
                      
                      {/* Completion indicator
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle size={10} className="text-white" />
                        </div>
                      )} */}

                      {/* Active pulse */}
                      {isActive && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg" 
                             style={{
                               clipPath: isLast 
                                 ? 'none' 
                                 : 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)'
                             }} />
                      )}
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {step.label}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Current status indicator */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={12} />
              <span>
                {isArchived 
                  ? 'Document archived' 
                  : `Currently in ${workflowSteps[currentStepIndex].label.toLowerCase()} phase`
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                currentStatus === 'changes_requested' ? 'bg-orange-500 animate-pulse' : 
                currentStepIndex === workflowSteps.length - 1 ? 'bg-green-500' : 
                currentStepIndex > 0 ? (isReviewer ? 'bg-blue-500' : 'bg-red-500') : 
                'bg-gray-300'
              }`} />
              <span className={currentStepIndex > 0 ? theme.textAccent : 'text-gray-500'}>
                {isArchived ? 'Archived' : workflowSteps[currentStepIndex].label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Actions Section */}
      {isReviewMode && canAct && (currentStatus === 'in_review' || currentStatus === 'approved' || currentStatus === 'changes_requested') && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              {renderActionButtons()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentProgressBar;