import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '@teddy-open-finance/contracts';
import { useAuthStore } from '../../../shared/auth/auth-store';
import { authApi } from '../api/auth-api';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user);
      navigate('/dashboard');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { email: string; name: string; password: string }) =>
      authApi.register(data),
  });
}
