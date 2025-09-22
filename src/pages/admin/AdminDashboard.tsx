import React from 'react';
import { Spinner } from '../../components/ui';
import { KpiCards } from '../../components/admin/KpiCards';
import { ActivityList } from '../../components/admin/ActivityList';
import { TopProjects } from '../../components/admin/TopProjects';
import { useAdminCounts } from '../../hooks/useAdminCounts';
import { useAdminRecentActivity } from '../../hooks/useAdminRecentActivity';
import { useAdminTopProjects } from '../../hooks/useAdminTopProjects';

export const AdminDashboard: React.FC = () => {
  const { data: counts, isLoading: countsLoading, error: countsError } = useAdminCounts();
  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useAdminRecentActivity();
  const { data: topProjects, isLoading: projectsLoading, error: projectsError } = useAdminTopProjects();

  if (countsLoading || activitiesLoading || projectsLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (countsError || activitiesError || projectsError) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-red-600">
              {countsError?.message || activitiesError?.message || projectsError?.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of system activity and metrics</p>
        </div>

        {counts && <KpiCards data={counts} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activities && <ActivityList activities={activities} />}
          {topProjects && <TopProjects projects={topProjects} />}
        </div>
      </div>
    </div>
  );
};