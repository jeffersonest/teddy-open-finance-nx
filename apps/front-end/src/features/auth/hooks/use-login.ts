import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '@teddy-open-finance/contracts';
import { useAuthStore } from '../../../shared/auth/auth-store';
import { authApi } from '../api/auth-api';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (result) => {
      setAuth(result.accessToken, result.refreshToken, result.user);
      navigate('/');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (registrationData: { email: string; name: string; password: string }) =>
      authApi.register(registrationData),
  });
}
