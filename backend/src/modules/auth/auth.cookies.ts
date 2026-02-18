import { Response } from 'express';
import { AUTH_POLICY } from './auth.policy';
import { CookieKind } from './auth.types';

/**
 * Sets an HttpOnly auth cookie with environment-aware configuration.
 * In production, sets `secure: true` and scopes the cookie to `COOKIE_DOMAIN`.
 * In development, domain is omitted to allow localhost usage.
 */
export function setAuthCookie(res: Response, kind: CookieKind, value: string) {
  const policy = AUTH_POLICY.cookies[kind];
  const ttl =
    kind === 'access'
      ? AUTH_POLICY.tokens.access.ttlMs
      : AUTH_POLICY.tokens.refresh.ttlMs;

  res.cookie(policy.name, value, {
    httpOnly: policy.httpOnly,
    sameSite: policy.sameSite,
    path: policy.path,
    secure: process.env.NODE_ENV === 'production',
    domain:
      process.env.NODE_ENV === 'production'
        ? process.env.COOKIE_DOMAIN
        : undefined,
    maxAge: ttl,
  });
}

/**
 * Clears an auth cookie by overwriting it with an empty value and maxAge 0.
 * Uses identical options to setAuthCookie to ensure the browser removes it.
 */
export function clearAuthCookie(res: Response, kind: CookieKind) {
  const policy = AUTH_POLICY.cookies[kind];

  res.cookie(policy.name, '', {
    httpOnly: policy.httpOnly,
    sameSite: policy.sameSite,
    path: policy.path,
    secure: process.env.NODE_ENV === 'production',
    domain:
      process.env.NODE_ENV === 'production'
        ? process.env.COOKIE_DOMAIN
        : undefined,
    maxAge: 0,
  });
}
