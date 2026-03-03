import { create } from 'zustand';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  credits: number;
  plan: 'FREE' | 'PRO' | 'LIFETIME';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    set({ user: response.data.user, isAuthenticated: true });
  },
  register: async (credentials) => {
    await api.post('/auth/register', credentials);
  },
  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
