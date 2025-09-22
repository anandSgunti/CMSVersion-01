import React from 'react';
import { FileText, MessageSquare, UserPlus, Send, CheckCircle } from 'lucide-react';
import { AdminActivity } from '../../hooks/useAdminRecentActivity';

interface ActivityListProps {
  activities: AdminActivity[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const getActivityIcon = (eventType: string) => {
    switch (eventType) {
      case 'document_created':
        return FileText;
      case 'comment_added':
        return MessageSquare;
      case 'member_added':
        return UserPlus;
      case 'review_requested':
        return Send;
      case 'review_completed':
        return CheckCircle;
      default:
        return FileText;
    }
  };

  const getActivityColor = (eventType: string) => {
    switch (eventType) {
      case 'document_created':
        return 'bg-blue-100 text-blue-600';
      case 'comment_added':
        return 'bg-green-100 text-green-600';
      case 'member_added':
        return 'bg-purple-100 text-purple-600';
      case 'review_requested':
        return 'bg-orange-100 text-orange-600';
      case 'review_completed':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No recent activity found
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.event_type);
            const colorClass = getActivityColor(activity.event_type);
            
            return (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{activity.user_name}</span>
                      {activity.project_name && (
                        <>
                          <span>•</span>
                          <span>{activity.project_name}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatRelativeTime(activity.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};