/**
 * Public projection of the authenticated user as it travels in the JWT
 * payload and in the `LoginResponse`. Never includes the password hash.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}
