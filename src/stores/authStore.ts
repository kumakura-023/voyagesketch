import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { User } from '@/types/core';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    // State
    user: null,
    isLoading: false, // 初期値をfalseに変更
    error: null,

    // Actions
    setUser: (user) => set((state) => {
      state.user = user;
    }),

    setLoading: (loading) => set((state) => {
      state.isLoading = loading;
    }),

    setError: (error) => set((state) => {
      state.error = error;
    }),

    clearError: () => set((state) => {
      state.error = null;
    }),
  }))
);