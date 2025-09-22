import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, User } from 'lucide-react';
import { Button, Dialog, Input } from './ui';
import { Template } from '../hooks/useTemplates';
import { useCreateFromTemplate } from '../hooks/useCreateFromTemplate';
import { useToast } from '../providers/ToastProvider';

interface TemplateCardProps {
  template: Template;
  projectId: string;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  projectId 
}) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(`${template.title} Copy`);
  const { showToast } = useToast();
  
  const createFromTemplate = useCreateFromTemplate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const previewText = stripHtml(template.body || '');

  const handleConfirm = async () => {
    try {
      const newDocumentId = await createFromTemplate.mutateAsync({
        templateId: template.id,
        projectId,
        title: newTitle.trim()
      });
      
      setIsDialogOpen(false);
      setNewTitle(`${template.title} Copy`); // Reset for next time
      showToast('Document created successfully!', 'success');
      
      // Navigate to the new document after a brief delay to show the toast
      setTimeout(() => {
        navigate(`/docs/${newDocumentId}`);
      }, 1000);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to create document',
        'error'
      );
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setNewTitle(`${template.title} Copy`); // Reset to default
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200 group">
        {/* Thumbnail/Preview */}
        <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
          <FileText size={32} className="text-blue-400" />
          {previewText && (
            <div className="absolute inset-0 p-3 bg-white/80 text-xs text-gray-600 leading-relaxed">
              {truncateText(previewText, 120)}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {template.title}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <User size={12} />
            <span>{template.author_name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Calendar size={12} />
            <span>{formatDate(template.created_at)}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            Use Template
          </Button>
        </div>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCancel}
        title="Use Template"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Create a new document from "{template.title}" template.
          </p>
          <Input
            label="Document Title"
            value={newTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
            placeholder="Enter document title"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!newTitle.trim() || createFromTemplate.isPending}
            >
              {createFromTemplate.isPending ? 'Creating...' : 'Create Document'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};