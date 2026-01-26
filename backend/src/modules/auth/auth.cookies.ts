import { Response } from 'express';
import { AUTH_POLICY } from './auth.policy';
import { CookieKind } from './auth.types';

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
