import React from 'react';
import { FolderOpen, Activity } from 'lucide-react';
import { AdminTopProject } from '../../hooks/useAdminTopProjects';

interface TopProjectsProps {
  projects: AdminTopProject[];
}

export const TopProjects: React.FC<TopProjectsProps> = ({ projects }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Most Active Projects</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {projects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No active projects found
          </div>
        ) : (
          projects.map((project, index) => (
            <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                  <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <FolderOpen size={20} className="text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {project.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Created by {project.created_by_name} • {formatDate(project.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Activity size={16} />
                  <span>{project.activity_count} activities</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};