import { Repository, Issue } from './types';
import { CreateRepositoryPayload, CreateIssuePayload } from '../../worker/types';
// A generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
const API_BASE_URL = '/api';
async function fetchApi<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || `Request failed with status ${response.status}` };
    }
    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'An unknown network error occurred' };
  }
}
export const apiClient = {
  getRepositories: async (): Promise<ApiResponse<Repository[]>> => {
    return fetchApi<Repository[]>('/repos');
  },
  getRepository: async (owner: string, repoName: string): Promise<ApiResponse<Repository>> => {
    return fetchApi<Repository>(`/repos/${owner}/${repoName}`);
  },
  createRepository: async (payload: CreateRepositoryPayload): Promise<ApiResponse<Repository>> => {
    return fetchApi<Repository>('/repos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
  getIssues: async (owner: string, repoName: string): Promise<ApiResponse<Issue[]>> => {
    return fetchApi<Issue[]>(`/repos/${owner}/${repoName}/issues`);
  },
  getIssue: async (owner: string, repoName: string, issueNumber: number): Promise<ApiResponse<Issue>> => {
    return fetchApi<Issue>(`/repos/${owner}/${repoName}/issues/${issueNumber}`);
  },
  createIssue: async (owner: string, repoName: string, payload: CreateIssuePayload): Promise<ApiResponse<Issue>> => {
    return fetchApi<Issue>(`/repos/${owner}/${repoName}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
};