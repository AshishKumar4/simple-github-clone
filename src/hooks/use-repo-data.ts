import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Repository } from '@/lib/types';
import { CreateRepositoryPayload } from '../../worker/types';
import { toast } from 'sonner';
export const REPOSITORIES_QUERY_KEY = 'repositories';
export const REPOSITORY_QUERY_KEY = 'repository';
export function useRepositories() {
  return useQuery<Repository[], Error>({
    queryKey: [REPOSITORIES_QUERY_KEY],
    queryFn: async () => {
      const response = await apiClient.getRepositories();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch repositories');
      }
      return response.data || [];
    },
  });
}
export function useRepository(owner: string, repoName: string) {
  return useQuery<Repository, Error>({
    queryKey: [REPOSITORY_QUERY_KEY, owner, repoName],
    queryFn: async () => {
      const response = await apiClient.getRepository(owner, repoName);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch repository');
      }
      if (!response.data) {
        throw new Error('Repository not found');
      }
      return response.data;
    },
    enabled: !!owner && !!repoName, // Only run query if owner and repoName are available
  });
}
export function useCreateRepository() {
  const queryClient = useQueryClient();
  return useMutation<Repository, Error, CreateRepositoryPayload>({
    mutationFn: async (newRepo: CreateRepositoryPayload) => {
      const response = await apiClient.createRepository(newRepo);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create repository');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPOSITORIES_QUERY_KEY] });
      toast.success('Repository created successfully!');
    },
    onError: (error) => {
      toast.error(`Error creating repository: ${error.message}`);
    },
  });
}