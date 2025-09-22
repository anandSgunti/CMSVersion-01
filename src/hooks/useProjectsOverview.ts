import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export interface ProjectOverview {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'draft' | 'in_review' | 'archived';
  members_count: number;
  documents_count: number;
  templates_count: number;
  last_activity_at: string | null;
  updated_at: string;
}

export const useProjectsOverview = () => {
  return useQuery({
    queryKey: ['projects-overview'],
    queryFn: async (): Promise<ProjectOverview[]> => {
      // Try preferred view first
      try {
        const { data: viewData, error: viewError } = await supabase
          .from('v_project_overview')
          .select('id,name,status,updated_at,last_activity_at,members_count,documents_count,templates_count')
          .order('last_activity_at', { ascending: false });

        if (!viewError && viewData) {
          return viewData.map(project => ({
            ...project,
            description: null // Add null description since it's not in the view
          }));
        }
      } catch (error) {
        // View doesn't exist, fall back to manual aggregation
      }

      // Fallback: fetch projects and aggregate counts
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id,name,description,status,created_at,updated_at')
        .order('updated_at', { ascending: false });

      if (projectsError) {
        throw new Error(projectsError.message);
      }

      if (!projects || projects.length === 0) {
        return [];
      }

      // Fetch counts for each project
      const projectsWithCounts = await Promise.all(
        projects.map(async (project) => {
          const [membersResult, documentsResult, templatesResult] = await Promise.all([
            supabase
              .from('project_members')
              .select('id', { count: 'exact', head: true })
              .eq('project_id', project.id),
            supabase
              .from('documents')
              .select('id', { count: 'exact', head: true })
              .eq('project_id', project.id)
              .eq('is_template', false),
            supabase
              .from('documents')
              .select('id', { count: 'exact', head: true })
              .eq('project_id', project.id)
              .eq('is_template', true),
          ]);

          return {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status as ProjectOverview['status'],
            members_count: membersResult.count || 0,
            documents_count: documentsResult.count || 0,
            templates_count: templatesResult.count || 0,
            last_activity_at: project.updated_at,
            updated_at: project.updated_at,
          };
        })
      );

      return projectsWithCounts;
    },
  });
};