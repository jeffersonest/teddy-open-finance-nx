import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../features/auth/api/auth-api';
import { useAuthStore } from './auth-store';

export function AuthBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setTokens = useAuthStore((state) => state.setTokens);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const hasAttemptedRefresh = useRef(false);

  useEffect(() => {
    if (hasAttemptedRefresh.current) {
      return;
    }

    hasAttemptedRefresh.current = true;

    if (accessToken) {
      return;
    }

    if (!refreshToken) {
      return;
    }

    authApi
      .refresh(refreshToken)
      .then((result) => {
        setTokens(result.accessToken, refreshToken);
        if (location.pathname === '/login') {
          navigate('/clients', { replace: true });
        }
      })
      .catch(() => {
        logout();
      });
  }, [accessToken, location.pathname, logout, navigate, refreshToken, setTokens]);

  return null;
}
