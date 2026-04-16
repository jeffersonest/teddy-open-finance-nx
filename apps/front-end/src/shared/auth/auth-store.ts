import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthenticatedUser } from '@teddy-open-finance/contracts';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthenticatedUser | null;
  hasHydrated: boolean;
  authResolved: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: AuthenticatedUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setAuthResolved: (authResolved: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      authResolved: false,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, authResolved: true }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, authResolved: true }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setAuthResolved: (authResolved) => set({ authResolved }),
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null, authResolved: true });
        window.location.href = '/login';
      },
      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: 'teddy-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
