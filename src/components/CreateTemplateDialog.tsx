import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, Input, Textarea } from './ui';
import { useCreateTemplate } from '../hooks/useCreateTemplate';
import { useToast } from '../providers/ToastProvider';

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const CreateTemplateDialog: React.FC<CreateTemplateDialogProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const createTemplate = useCreateTemplate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showToast('Template title is required', 'error');
      return;
    }

    try {
      const templateId = await createTemplate.mutateAsync({
        projectId,
        title: title.trim(),
        body: description.trim(),
      });
      
      showToast('Template created successfully!', 'success');
      onClose();
      setTitle('');
      setDescription('');
      
      // Navigate to edit the template
      setTimeout(() => {
        navigate(`/docs/${templateId}`);
      }, 1000);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to create template',
        'error'
      );
    }
  };

  const handleCancel = () => {
    onClose();
    setTitle('');
    setDescription('');
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleCancel} title="Create New Template">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-600">
          Create a new document template that can be used to generate new documents.
        </p>
        
        <Input
          label="Template Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Enter template title"
          required
        />
        
        <Textarea
          label="Initial Content (Optional)"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Add some initial content for the template..."
          rows={4}
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!title.trim() || createTemplate.isPending}
          >
            {createTemplate.isPending ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};