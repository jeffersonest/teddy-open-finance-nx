import axios from 'axios';
import { useAuthStore } from '../auth/auth-store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
let refreshRequest: Promise<string | null> | null = null;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const responseStatus = error.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');
    if (isRefreshEndpoint) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (responseStatus === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        if (!refreshRequest) {
          refreshRequest = axios
            .post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
            .then((refreshResponse) => refreshResponse.data.accessToken as string)
            .catch(() => null)
            .finally(() => {
              refreshRequest = null;
            });
        }

        const nextAccessToken = await refreshRequest;
        if (!nextAccessToken) {
          logout();
          return Promise.reject(error);
        }

        setTokens(nextAccessToken, refreshToken);
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        logout();
      }
    }

    return Promise.reject(error);
  },
);
