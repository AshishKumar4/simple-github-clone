import { create } from 'zustand';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
interface AuthState {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  currentUser: mockUsers[0], // Default to Ada Lovelace for mock auth
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
}));