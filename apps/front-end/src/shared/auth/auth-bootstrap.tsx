import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../features/auth/api/auth-api';
import { useAuthStore } from './auth-store';

export function AuthBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const authResolved = useAuthStore((state) => state.authResolved);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setAuthResolved = useAuthStore((state) => state.setAuthResolved);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const hasAttemptedRefresh = useRef(false);

  useEffect(() => {
    if (!hasHydrated || authResolved) {
      return;
    }

    if (accessToken) {
      setAuthResolved(true);
      return;
    }

    if (hasAttemptedRefresh.current) {
      return;
    }

    hasAttemptedRefresh.current = true;

    if (!refreshToken) {
      setAuthResolved(true);
      return;
    }

    authApi
      .refresh(refreshToken)
      .then((result) => {
        setTokens(result.accessToken, refreshToken);
        if (location.pathname === '/login') {
          navigate('/home', { replace: true });
        }
      })
      .catch(() => {
        logout();
      });
  }, [
    accessToken,
    authResolved,
    hasHydrated,
    location.pathname,
    logout,
    navigate,
    refreshToken,
    setAuthResolved,
    setTokens,
  ]);

  return null;
}
