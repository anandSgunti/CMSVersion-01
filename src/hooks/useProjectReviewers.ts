import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../providers/SessionProvider';

export interface ProjectReviewer {
  user_id: string;
  name: string;
  email: string;
}

export const useProjectReviewers = (projectId: string) => {
  const { user } = useSession();

  return useQuery({
    queryKey: ['project-reviewers', projectId],
    queryFn: async (): Promise<ProjectReviewer[]> => {
      // First get project members
      const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select('user_id, assigned_at')
        .eq('project_id', projectId);

      if (membersError) {
        throw new Error(membersError.message);
      }

      if (!members || members.length === 0) {
        return [];
      }

      // Get user IDs and fetch their profiles
      const userIds = members.map(m => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id,name,email')
        .in('id', userIds);

      if (profilesError) {
        throw new Error(profilesError.message);
      }

      if (!profiles) {
        return [];
      }

      // Merge data and exclude current user
      const reviewers = profiles
        .map(profile => ({
          user_id: profile.id,
          name: profile.name,
          email: profile.email,
        }))
        .filter(reviewer => reviewer.user_id !== user?.id);

      return reviewers;
    },
    enabled: !!projectId && !!user,
  });
};