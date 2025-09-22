import React from 'react';
import { Users, FileText, File } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatRelative } from '../../lib/date';
import { ProjectOverview } from '../../hooks/useProjectsOverview';

interface ProjectCardProps {
  project: ProjectOverview;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {project.description}
            </p>
          )}
        </div>
        <StatusBadge status={project.status} type="project" />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{project.members_count} member{project.members_count !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText size={14} />
          <span>{project.documents_count} document{project.documents_count !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1">
          <File size={14} />
          <span>{project.templates_count} template{project.templates_count !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>
        <span className="text-xs text-gray-500">
          {formatRelative(project.last_activity_at || project.updated_at)}
        </span>
      </div>
    </div>
  );
};