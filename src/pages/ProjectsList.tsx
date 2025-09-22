import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PanelsTopLeft, Heart, Microscope, Shield, Globe2 } from 'lucide-react';
import { Button, Spinner, EmptyState } from '../components/ui';
import { useProjectsOverview } from '../hooks/useProjectsOverview';
import { useProfile } from '../hooks/useProfile';
import { ProjectCard } from '../components/projects/ProjectCard';
import { GlobalSearchBar } from '../components/search/GlobalSearchBar';
import { useToast } from '../providers/ToastProvider';

export const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: projects, isLoading, error } = useProjectsOverview();
  const { data: profile } = useProfile();

  const isAdmin = profile?.global_role === 'admin';

  const handleProjectClick = (projectId: string) => {
    try {
      navigate(`/projects/${projectId}/templates`);
    } catch (error) {
      showToast('Failed to navigate to project templates', 'error');
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Global Template Search */}
        <div className="mb-12">
          <GlobalSearchBar 
               placeholder="Search templates across all projects..." 
        
            />
        </div>

        {/* Projects Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white"> Projects</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Active  initiatives and  documentation workspaces
            </p>
          </div>
          {isAdmin && (
            <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-elegant">
              <Plus size={16} className="mr-2" />
              New  Project
            </Button>
          )}
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Spinner size="lg" className="text-primary" />
              <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
                Loading your projects...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <PanelsTopLeft className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
              Error Loading Projects
            </h2>
            <p className="text-red-600 dark:text-red-400">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        )}

        {!isLoading && !error && projects && (
          <>
            {projects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700">
                <EmptyState
                  icon={PanelsTopLeft}
                  title="No Research Projects Yet"
                  description={
                    isAdmin 
                      ? "Create your first research project to get started with Mednet's healthcare innovation platform."
                      : "No research projects are available yet. Contact an administrator to create projects or request access."
                  }
                  action={
                    isAdmin ? (
                      <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-elegant">
                        <Plus size={16} className="mr-2" />
                        Create First Project
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project.id)}
                    />
                  ))}
                </div>
                
                {/* Project Stats */}
                {/* <div className="mt-12 bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors rounded-2xl p-6 border border-primary/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        {projects.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Active Projects
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        {projects.reduce((sum, p) => sum + p.documents_count, 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Documents
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        {projects.reduce((sum, p) => sum + p.templates_count, 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Templates
                      </div>
                    </div>
                  </div>
                </div> */}
              </>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Shield size={14} />
            <span>Your Secure Healthcare Innovation Platform</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            © 2025 Mednet Health. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};