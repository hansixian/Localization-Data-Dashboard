import { create } from 'zustand';

export type Role = 'admin' | 'internal' | 'external';

export interface User {
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  users: User[];
  login: (email: string) => void;
  logout: () => void;
  addUser: (user: User) => void;
}

const initialUsers: User[] = [
  { email: 'hansixian@bytedance.com', name: 'Hansixian', role: 'admin' },
  { email: 'admin@bytedance.com', name: 'Admin User', role: 'admin' },
  { email: 'internal@bytedance.com', name: 'Internal User', role: 'internal' },
  { email: 'external@bytedance.com', name: 'External User', role: 'external' },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  users: initialUsers,
  login: (email) => set((state) => {
    const foundUser = state.users.find(u => u.email === email);
    if (foundUser) {
      return { user: foundUser };
    }
    // If not found, default to a viewer role or reject. For mock, let's just create a viewer.
    return { user: { email, name: email.split('@')[0], role: 'external' } };
  }),
  logout: () => set({ user: null }),
  addUser: (newUser) => set((state) => ({ users: [...state.users, newUser] })),
}));
