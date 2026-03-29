import { create } from 'zustand';
import type { User } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: any | null; // From supabase auth
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, session: null }),
}));
