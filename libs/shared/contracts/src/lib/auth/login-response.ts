import type { AuthenticatedUser } from './authenticated-user.js';

/**
 * Response returned by `POST /auth/login` on success.
 */
export interface LoginResponse {
  /** Bearer token to be sent on the `Authorization` header. */
  accessToken: string;
  user: AuthenticatedUser;
}
