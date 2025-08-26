import { create } from 'zustand';
import { User } from '@/lib/types';
import { mockUsers, mockRepositories } from '@/lib/mock-data';
import { Repository } from '@/lib/types';
interface AuthState {
  currentUser: User | null;
  repositories: Repository[];
  login: (user: User) => void;
  logout: () => void;
  addRepository: (repo: Omit<Repository, 'id' | 'owner' | 'issues' | 'pullRequests' | 'files' | 'stars' | 'forks' | 'watchers' | 'updatedAt' | 'language'>) => void;
}
export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: mockUsers[0], // Default to Ada Lovelace
  repositories: mockRepositories,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  addRepository: (repo) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;
    const newRepo: Repository = {
      ...repo,
      id: `repo-${Date.now()}`,
      owner: currentUser,
      issues: [],
      pullRequests: [],
      files: [{ type: 'file', name: 'README.md', path: 'README.md', content: `# ${repo.name}\n${repo.description}` }],
      stars: 0,
      forks: 0,
      watchers: 1,
      updatedAt: new Date().toISOString(),
      language: 'N/A',
    };
    set((state) => ({
      repositories: [newRepo, ...state.repositories],
    }));
  },
}));