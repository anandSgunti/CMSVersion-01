import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Folder, FolderOpen,Shield } from 'lucide-react';
import { Button, Spinner, Input, EmptyState } from '../components/ui';
import { useTemplates } from '../hooks/useTemplates';
import { useSubcategories } from '../hooks/useSubcategories';
import { TemplateCard } from '../components/TemplateCard';
import { CreateTemplateDialog } from '../components/CreateTemplateDialog';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '../providers/ToastProvider';
import { getFolderThumbnail } from '../config/folderThumbnails';

// -----------------------------------------------------------------------------
// TemplateGallery (folders column grid → click reveals templates inside)
// -----------------------------------------------------------------------------

export default function TemplateGallery() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const { data: templates, isLoading, error } = useTemplates(projectId!, search);
  const { data: subcategories, isLoading: subcategoriesLoading } = useSubcategories(projectId!);
  const { data: profile } = useProfile();
  const isAdmin = profile?.global_role === 'admin';

  useEffect(() => {
    if (!projectId) showToast('Invalid project ID', 'error');
  }, [projectId, showToast]);

  // Counts for folder pills
  const countsBySubcat = useMemo(() => {
    const map = new Map<string, number>();
    (subcategories || []).forEach((s: any) => map.set(String(s.id), 0));
    (templates || []).forEach((t: any) => {
      if (t.subcategory_id) map.set(String(t.subcategory_id), (map.get(String(t.subcategory_id)) || 0) + 1);
    });
    return map;
  }, [subcategories, templates]);

  // Templates shown inside the active folder
  const visibleTemplates = useMemo(() => {
    if (!templates) return [] as any[];
    if (!activeFolderId) return [] as any[];
    return templates.filter((t: any) => t.subcategory_id === activeFolderId);
  }, [templates, activeFolderId]);

  // Folder Card (matches document-card feel)
  const FolderCard: React.FC<{
    id: string;
    name: string;
    count: number;
    onClick: () => void;
  }> = ({ id, name, count, onClick }) => {
    const thumbnail = getFolderThumbnail(name, id);
    
    return (
      <button
        onClick={onClick}
        className="rounded-2xl border bg-white dark:bg-gray-800 shadow-card text-left overflow-hidden transition-all border-gray-200 dark:border-gray-700 hover:border-red-300 hover:shadow-lg"
        aria-label={`Open ${name} folder`}
      >
        <div className="h-28 bg-gradient-to-b from-red-50 to-white dark:from-red-900/10 dark:to-gray-800 flex items-center justify-center relative overflow-hidden">
          {thumbnail ? (
            <img 
              src={thumbnail.image} 
              alt={thumbnail.alt || `${name} folder thumbnail`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default design if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center ${thumbnail ? 'hidden' : ''}`}>
            <Folder size={22} />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{name}</h3>
          </div>
          <div className="text-xs text-gray-500">{count} template{count === 1 ? '' : 's'}</div>
        </div>
      </button>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Template Gallery</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Choose a template to create a new document</p>
          </div>
          {isAdmin && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-primary text-white">
              <Plus size={16} className="mr-2" />
              Create Template
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={activeFolderId ? 'Search within this folder…' : 'Search templates…'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-red-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
            />
          </div>
        </div>

        {/* Folders grid */}
        {!subcategoriesLoading && subcategories && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Folders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {subcategories.map((s: any) => (
                <FolderCard
                  key={s.id}
                  id={s.id}
                  name={s.name}
                  count={countsBySubcat.get(String(s.id)) || 0}
                  onClick={() => navigate(`/projects/${projectId}/subcategories/${s.id}/templates`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading / Error states */}
        {(isLoading || subcategoriesLoading) && (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /><span className="ml-3 text-gray-600 dark:text-gray-300">Loading…</span></div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Error Loading Templates</h2>
            <p className="text-red-600 dark:text-red-300">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
          </div>
        )}

        {/* Active folder panel with its templates */}
        {activeFolderId && !isLoading && !error && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-card mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className="text-red-600" size={18} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {(subcategories || []).find((s: any) => s.id === activeFolderId)?.name}
                </h3>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActiveFolderId(null)}>Close</Button>
            </div>

            {visibleTemplates.length > 0 ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleTemplates.map((t: any) => (
                  <TemplateCard key={t.id} template={t} projectId={projectId!} />
                ))}
              </div>
            ) : (
              <div className="p-10">
                <EmptyState
                  icon={Folder}
                  title="No templates in this folder"
                  description="Create a new template or move one into this folder to see it here."
                />
              </div>
            )}
          </div>
        )}

         <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Shield size={14} />
            <span>Your Secure Healthcare Innovation Platform</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            © 2025 Mednet Health. All rights reserved.
          </div>
        </div>

        {/* If no folder is open, show nothing below (keeps UI clean). */}
      </div>

      <CreateTemplateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        projectId={projectId!}
      />
    </div>
  );
}
