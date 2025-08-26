import { User, Repository, FileNode } from './types';
import { subDays, subHours } from 'date-fns';
// Mock Users
export const mockUsers: User[] = [
  { id: 'user-1', name: 'Ada Lovelace', username: 'ada', avatarUrl: 'https://i.pravatar.cc/150?u=ada' },
  { id: 'user-2', name: 'Grace Hopper', username: 'grace', avatarUrl: 'https://i.pravatar.cc/150?u=grace' },
  { id: 'user-3', name: 'Alan Turing', username: 'alan', avatarUrl: 'https://i.pravatar.cc/150?u=alan' },
];
const [ada, grace, alan] = mockUsers;
// Mock File Structure
const vertexFiles: FileNode[] = [
  {
    type: 'dir', name: 'src', path: 'src', children: [
      { type: 'dir', name: 'components', path: 'src/components', children: [
        { type: 'file', name: 'Button.tsx', path: 'src/components/Button.tsx', content: 'export const Button = () => <button>Click me</button>;' },
        { type: 'file', name: 'Header.tsx', path: 'src/components/Header.tsx', content: 'export const Header = () => <header>Vertex</header>;' },
      ]},
      { type: 'dir', name: 'pages', path: 'src/pages', children: [
        { type: 'file', name: 'Dashboard.tsx', path: 'src/pages/Dashboard.tsx', content: 'export const Dashboard = () => <div>Dashboard</div>;' },
      ]},
      { type: 'file', name: 'App.tsx', path: 'src/App.tsx', content: 'import React from "react";' },
      { type: 'file', name: 'index.css', path: 'src/index.css', content: 'body { margin: 0; }' },
    ]
  },
  { type: 'file', name: 'README.md', path: 'README.md', content: '# Vertex \n A minimalist, high-performance GitHub clone.' },
  { type: 'file', name: 'package.json', path: 'package.json', content: '{ "name": "vertex", "version": "0.0.1" }' },
];
const edgeRouterFiles: FileNode[] = [
    { type: 'file', name: 'index.js', path: 'index.js', content: 'console.log("hello world");' },
    { type: 'file', name: 'README.md', path: 'README.md', content: '# Edge Router\nHigh performance router for the edge.' },
];
// Mock Repositories
export const mockRepositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'vertex',
    owner: ada,
    description: 'A minimalist, high-performance GitHub clone for code hosting, issue tracking, and collaboration, built entirely on the Cloudflare edge network.',
    stars: 1200,
    forks: 250,
    watchers: 42,
    isPrivate: false,
    updatedAt: subHours(new Date(), 2).toISOString(),
    language: 'TypeScript',
    issues: [
      {
        id: 'issue-1', number: 1, title: 'Implement dark mode', user: grace, state: 'open',
        createdAt: subDays(new Date(), 2).toISOString(), updatedAt: subHours(new Date(), 5).toISOString(),
        labels: [{ id: 'label-1', name: 'enhancement', color: 'a2eeef' }, { id: 'label-2', name: 'ui', color: 'd73a4a' }],
        body: 'The application needs a dark mode option for better user experience at night.',
        assignees: [ada],
        comments: [
          { id: 'comment-1', user: alan, createdAt: subDays(new Date(), 1).toISOString(), body: 'Great idea! I can start working on this.' },
          { id: 'comment-2', user: ada, createdAt: subHours(new Date(), 12).toISOString(), body: 'Thanks @alan! Let me know if you need any help with the color palette.' },
        ],
      },
      {
        id: 'issue-2', number: 2, title: 'Fix login button alignment', user: alan, state: 'open',
        createdAt: subDays(new Date(), 1).toISOString(), updatedAt: subHours(new Date(), 3).toISOString(),
        labels: [{ id: 'label-3', name: 'bug', color: 'd73a4a' }],
        body: 'The login button is misaligned on mobile devices.',
        assignees: [],
        comments: [],
      },
      {
        id: 'issue-3', number: 3, title: 'Setup CI/CD pipeline', user: ada, state: 'closed',
        createdAt: subDays(new Date(), 10).toISOString(), updatedAt: subDays(new Date(), 5).toISOString(),
        labels: [{ id: 'label-4', name: 'devops', color: '0075ca' }],
        body: 'We need to automate our deployment process.',
        assignees: [grace],
        comments: [],
      },
    ],
    pullRequests: [
      { id: 'pr-1', number: 4, title: 'Feat: Add user profile page', user: alan, state: 'open', createdAt: subDays(new Date(), 1).toISOString(), updatedAt: subHours(new Date(), 1).toISOString(), branch: 'feature/profile-page', body: 'This PR adds a new profile page for users.', comments: [], labels: [], assignees: [alan] },
      { id: 'pr-2', number: 5, title: 'Fix: Responsive layout issues', user: grace, state: 'merged', createdAt: subDays(new Date(), 3).toISOString(), updatedAt: subDays(new Date(), 2).toISOString(), branch: 'fix/responsive', body: 'Fixes various layout issues on smaller screens.', comments: [], labels: [], assignees: [] },
    ],
    files: vertexFiles,
  },
  {
    id: 'repo-2',
    name: 'edge-router',
    owner: ada,
    description: 'A high-performance routing library for Cloudflare Workers.',
    stars: 850,
    forks: 120,
    watchers: 25,
    isPrivate: false,
    updatedAt: subDays(new Date(), 2).toISOString(),
    language: 'Rust',
    issues: [],
    pullRequests: [],
    files: edgeRouterFiles,
  },
  {
    id: 'repo-3',
    name: 'personal-blog',
    owner: grace,
    description: 'My personal blog and portfolio website.',
    stars: 50,
    forks: 5,
    watchers: 10,
    isPrivate: true,
    updatedAt: subDays(new Date(), 5).toISOString(),
    language: 'Astro',
    issues: [],
    pullRequests: [],
    files: [],
  },
];