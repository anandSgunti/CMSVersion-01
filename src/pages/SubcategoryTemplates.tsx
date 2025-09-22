import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Button, Spinner, Input, EmptyState } from '../components/ui';
import { useTemplates } from '../hooks/useTemplates';
import { useSubcategories } from '../hooks/useSubcategories';
import { TemplateCard } from '../components/TemplateCard';
import { CreateTemplateDialog } from '../components/CreateTemplateDialog';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '../providers/ToastProvider';

export const SubcategoryTemplates: React.FC = () => {
  const { projectId, subcategoryId } = useParams();
  const { showToast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const { data: templates, isLoading, error } = useTemplates(projectId!, search);
  const { data: subcategories } = useSubcategories(projectId!);
  const { data: profile } = useProfile();
  const isAdmin = profile?.global_role === 'admin';
  
  // Find current subcategory
  const currentSubcategory = subcategories?.find(s => s.id === subcategoryId);
  
  // Filter templates for this subcategory
  const subcategoryTemplates = templates?.filter(t => t.subcategory_id === subcategoryId) || [];
  
  if (!projectId || !subcategoryId) {
    showToast('Invalid project or subcategory ID', 'error');
    return null;
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={`/projects/${projectId}/templates`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Template Gallery
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentSubcategory?.name || 'Subcategory'} Templates
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Templates in this category
            </p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="bg-gradient-primary text-white shadow-elegant"
            >
              <Plus size={16} className="mr-2" />
              Create Template
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search templates in this category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-red-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Spinner size="lg" className="text-primary" />
              <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
                Loading templates...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
              Error Loading Templates
            </h2>
            <p className="text-red-600 dark:text-red-400">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        )}

        {/* Templates Grid */}
        {!isLoading && !error && (
          <>
            {subcategoryTemplates.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700">
                <EmptyState
                  icon={Plus}
                  title="No Templates Yet"
                  description={
                    isAdmin 
                      ? "Create your first template in this category to get started."
                      : "No templates are available in this category yet."
                  }
                  action={
                    isAdmin ? (
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-gradient-primary hover:opacity-90 text-white shadow-elegant"
                      >
                        <Plus size={16} className="mr-2" />
                        Create First Template
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategoryTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    projectId={projectId!}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateTemplateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        projectId={projectId!}
        subcategoryId={subcategoryId}
      />
    </div>
  );
};