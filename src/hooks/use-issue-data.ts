import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Issue } from '@/lib/types';
import { CreateIssuePayload } from '../../worker/types';
import { toast } from 'sonner';
import { REPOSITORY_QUERY_KEY } from './use-repo-data';
export const ISSUES_QUERY_KEY = 'issues';
export const ISSUE_QUERY_KEY = 'issue';
export function useIssues(owner: string, repoName: string) {
  return useQuery<Issue[], Error>({
    queryKey: [ISSUES_QUERY_KEY, owner, repoName],
    queryFn: async () => {
      const response = await apiClient.getIssues(owner, repoName);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch issues');
      }
      return response.data || [];
    },
    enabled: !!owner && !!repoName,
  });
}
export function useIssue(owner: string, repoName: string, issueNumber?: number) {
  return useQuery<Issue, Error>({
    queryKey: [ISSUE_QUERY_KEY, owner, repoName, issueNumber],
    queryFn: async () => {
      const response = await apiClient.getIssue(owner, repoName, issueNumber!);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Issue not found');
      }
      return response.data;
    },
    enabled: !!owner && !!repoName && !!issueNumber,
  });
}
export function useCreateIssue(owner: string, repoName: string) {
  const queryClient = useQueryClient();
  return useMutation<Issue, Error, CreateIssuePayload>({
    mutationFn: async (newIssue) => {
      // The frontend component calling this mutation is responsible for adding 'authorId' to newIssue.
      const response = await apiClient.createIssue(owner, repoName, newIssue);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create issue');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEY, owner, repoName] });
      queryClient.invalidateQueries({ queryKey: [REPOSITORY_QUERY_KEY, owner, repoName] });
      toast.success('Issue created successfully!');
    },
    onError: (error) => {
      toast.error(`Error creating issue: ${error.message}`);
    },
  });
}