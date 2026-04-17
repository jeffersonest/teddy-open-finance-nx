import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '@teddy-open-finance/contracts';
import { apiClient } from '../../../shared/api/api-client';

export const authApi = {
  login: (credentials: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', credentials).then((response) => response.data),

  register: (registrationData: { email: string; name: string; password: string }) =>
    apiClient
      .post<{ message: string }>('/auth/register', registrationData)
      .then((response) => response.data),

  refresh: () => apiClient.post<RefreshTokenResponse>('/auth/refresh').then((response) => response.data),
};
