import type { AuthenticatedUser } from './authenticated-user.js';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}
