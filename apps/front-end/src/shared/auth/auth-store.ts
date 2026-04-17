import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthenticatedUser } from '@teddy-open-finance/contracts';

interface AuthState {
  accessToken: string | null;
  user: AuthenticatedUser | null;
  hasHydrated: boolean;
  authResolved: boolean;
  setAuth: (accessToken: string, user: AuthenticatedUser) => void;
  setTokens: (accessToken: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setAuthResolved: (authResolved: boolean) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      authResolved: false,
      setAuth: (accessToken, user) => set({ accessToken, user, authResolved: true }),
      setTokens: (accessToken) => set({ accessToken, authResolved: true }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setAuthResolved: (authResolved) => set({ authResolved }),
      logout: async () => {
        set({ accessToken: null, user: null, authResolved: true });
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        }).catch(() => undefined);
        window.location.href = '/login';
      },
      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: 'teddy-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
