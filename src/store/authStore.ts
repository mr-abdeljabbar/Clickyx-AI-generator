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
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (token) => set({ accessToken: token }),
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('hasSession', 'true');
    set({
      user: response.data.user,
      accessToken: response.data.accessToken,
      isAuthenticated: true
    });
  },
  register: async (credentials) => {
    await api.post('/auth/register', credentials);
    // Registration doesn't auto-login in this implementation, 
    // but if it did, we would set hasSession here.
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('hasSession');
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
  checkAuth: async () => {
    const { isLoading, isAuthenticated } = useAuthStore.getState();

    // Guard: skip if already authenticated or no prior session
    if (isAuthenticated || localStorage.getItem('hasSession') !== 'true') {
      if (isLoading) set({ isLoading: false });
      return;
    }

    try {
      // Step 1: Refresh the access token using the HTTP-only cookie
      const refreshRes = await api.post('/auth/refresh-token');
      const newToken = refreshRes.data.accessToken;
      set({ accessToken: newToken });

      // Step 2: Fetch current user with the fresh token
      const meRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      set({ user: meRes.data, isAuthenticated: true });
    } catch {
      // Session expired or invalid — clean up silently
      localStorage.removeItem('hasSession');
      set({ user: null, accessToken: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
