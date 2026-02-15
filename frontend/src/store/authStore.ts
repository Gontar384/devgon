'use client';
import { create } from 'zustand';
import { AuthUser } from '@/lib/auth/auth-types';
import api from '@/lib/auth/axios';

interface AuthState {
  user: AuthUser;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { userId: '', email: '', role: 'guest' },
  isLoading: true,

  fetchUser: async () => {
    set({ isLoading: true });

    try {
      const response = await api.get<AuthUser>('/api/auth/me');
      set({ user: response.data, isLoading: false });
    } catch {
      set({ user: { userId: '', email: '', role: 'guest' }, isLoading: false });
    }
  },
}));
