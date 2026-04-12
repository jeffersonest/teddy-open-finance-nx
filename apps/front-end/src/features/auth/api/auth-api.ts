import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '@teddy-open-finance/contracts';
import { apiClient } from '../../../shared/api/api-client';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  register: (data: { email: string; name: string; password: string }) =>
    apiClient.post<{ message: string }>('/auth/register', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<RefreshTokenResponse>('/auth/refresh', { refreshToken })
      .then((r) => r.data),
};
