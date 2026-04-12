export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string;
}

export abstract class TokenIssuer {
  abstract issueAccessToken(payload: AccessTokenPayload): string;
  abstract issueRefreshToken(payload: RefreshTokenPayload): string;
  abstract verifyRefreshToken(token: string): RefreshTokenPayload;
}
