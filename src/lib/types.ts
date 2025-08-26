export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}
export interface Label {
  id: string;
  name: string;
  color: string;
}
export interface Comment {
  id: string;
  user: User;
  createdAt: string;
  body: string;
}
export type IssueStatus = 'open' | 'closed' | 'not_planned';
export interface Issue {
  id: string;
  number: number;
  title: string;
  user: User;
  state: IssueStatus;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  labels: Label[];
  body: string;
  assignees: User[];
}
export type PullRequestStatus = 'open' | 'closed' | 'merged';
export interface PullRequest {
  id: string;
  number: number;
  title: string;
  user: User;
  state: PullRequestStatus;
  createdAt: string;
  updatedAt: string;
  branch: string;
  body: string; // Added for pull request description
  comments: Comment[]; // Added for pull request comments
  labels: Label[]; // Added for labels
  assignees: User[]; // Added for assignees
}
export interface FileNode {
  type: 'file' | 'dir';
  name: string;
  path: string;
  content?: string;
  children?: FileNode[];
}
export interface Repository {
  id: string;
  name: string;
  owner: User;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  issues: Issue[];
  pullRequests: PullRequest[];
  files: FileNode[];
  isPrivate: boolean;
  updatedAt: string;
  language: string;
}