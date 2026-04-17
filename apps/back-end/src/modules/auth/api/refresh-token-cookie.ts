import type { CookieOptions } from 'express';
import { EnvironmentVariables, NodeEnv } from '../../../infrastructure/config/env/env.validation.js';

const refreshTokenCookieName = 'teddy_refresh_token';
const durationPattern = /^(\d+)(ms|s|m|h|d)$/;
const durationUnitsInMilliseconds = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
} as const;

export function getRefreshTokenCookieName() {
  return refreshTokenCookieName;
}

export function getRefreshTokenCookieOptions(
  environment: Pick<EnvironmentVariables, 'JWT_REFRESH_EXPIRES_IN' | 'NODE_ENV'>,
): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: environment.NODE_ENV === NodeEnv.Production,
    path: '/auth',
    maxAge: toMilliseconds(environment.JWT_REFRESH_EXPIRES_IN),
  };
}

export function getRefreshTokenClearCookieOptions(
  environment: Pick<EnvironmentVariables, 'NODE_ENV'>,
): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: environment.NODE_ENV === NodeEnv.Production,
    path: '/auth',
  };
}

function toMilliseconds(duration: string) {
  const matchedDuration = durationPattern.exec(duration);
  if (!matchedDuration) {
    return 7 * durationUnitsInMilliseconds.d;
  }

  const [, rawValue, unit] = matchedDuration;
  const durationValue = Number(rawValue);

  if (!Number.isFinite(durationValue) || durationValue <= 0) {
    return 7 * durationUnitsInMilliseconds.d;
  }

  return durationValue * durationUnitsInMilliseconds[unit as keyof typeof durationUnitsInMilliseconds];
}
