import { Repository, User, Issue } from '../src/lib/types';
export interface CreateRepositoryPayload {
    name: string;
    description?: string;
    isPrivate: boolean;
    ownerId: string; // To link to a user
}
export interface RepositoryResponse {
    success: boolean;
    data?: Repository;
    error?: string;
}
export interface ListRepositoriesResponse {
    success: boolean;
    data?: Repository[];
    error?: string;
}
export interface CreateIssuePayload {
    title: string;
    body: string;
    authorId: string;
}
export interface IssueResponse {
    success: boolean;
    data?: Issue;
    error?: string;
}
export interface ListIssuesResponse {
    success: boolean;
    data?: Issue[];
    error?: string;
}
// Durable Object state for repositories
export interface DORepositoryState {
    [repoId: string]: Repository;
}
// Durable Object state for users (if managed globally)
export interface DOUserState {
    [userId: string]: User;
}
// Global Durable Object state
export interface GlobalDOState {
    repositories: DORepositoryState;
    // Potentially other global states like users, if not managed by separate DOs
}