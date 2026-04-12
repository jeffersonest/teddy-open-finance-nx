import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthenticatedUser } from '@teddy-open-finance/contracts';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthenticatedUser | null;
  setAuth: (accessToken: string, refreshToken: string, user: AuthenticatedUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
        window.location.href = '/login';
      },
      isAuthenticated: () => !!get().accessToken,
    }),
    { name: 'teddy-auth' },
  ),
);
