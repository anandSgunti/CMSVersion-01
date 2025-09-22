import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText } from 'lucide-react';
import { Template } from '../hooks/useTemplates';
import { TemplateCard } from './TemplateCard';
import { getFolderThumbnail } from '../config/folderThumbnails';

interface SubcategoryFolderProps {
  subcategoryName: string;
  templates: Template[];
  projectId: string;
  isExpanded?: boolean;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};


export const SubcategoryFolder: React.FC<SubcategoryFolderProps> = ({
  subcategoryName,
  templates,
  projectId,
  isExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const thumbnail = getFolderThumbnail(subcategoryName);

  // Create a preview for the folder based on first few templates
  const previewTemplates = templates.slice(0, 3);
  const previewText = previewTemplates.map(t => t.title).join(', ');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
      {/* Thumbnail/Preview */}
      <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center relative overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail.image} 
            alt={thumbnail.alt || `${subcategoryName} folder thumbnail`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default design if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          expanded ? (
            <FolderOpen size={32} className="text-blue-400 dark:text-blue-500" />
          ) : (
            <Folder size={32} className="text-blue-400 dark:text-blue-500" />
          )
        )}
        <div className={`${thumbnail ? 'hidden' : ''}`}>
          {expanded ? (
            <FolderOpen size={32} className="text-blue-400 dark:text-blue-500" />
          ) : (
            <Folder size={32} className="text-blue-400 dark:text-blue-500" />
          )}
        </div>
        {previewText && !thumbnail && (
          <div className="absolute inset-0 p-3 bg-white/80 dark:bg-gray-800/80 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {truncateText(previewText, 120)}
          </div>
        )}
      </div>
      
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
      >
        {expanded ? (
          <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
        )}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
            {subcategoryName}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FileText size={12} />
            <span>{templates.length} template{templates.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </button>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-900/50">
          {templates.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No templates in this category
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  projectId={projectId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};