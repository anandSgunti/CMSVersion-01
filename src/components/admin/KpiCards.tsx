import React from 'react';
import { Users, FolderOpen, FileText, Clock } from 'lucide-react';
import { AdminCounts } from '../../hooks/useAdminCounts';

interface KpiCardsProps {
  data: AdminCounts;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data }) => {
  const kpis = [
    {
      title: 'Total Users',
      value: data.total_users ?? 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Projects',
      value: data.active_projects ?? 0,
      icon: FolderOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Total Documents',
      value: data.total_documents ?? 0,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Reviews',
      value: data.pending_reviews ?? 0,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};