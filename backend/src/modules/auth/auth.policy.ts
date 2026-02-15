export const AUTH_POLICY = {
  cookies: {
    access: {
      name: 'access_token',
      path: '/',
      sameSite: 'lax' as const,
      httpOnly: true,
    },
    refresh: {
      name: 'refresh_token',
      path: '/',
      sameSite: 'lax' as const,
      httpOnly: true,
    },
  },

  tokens: {
    access: {
      ttlMs: 15 * 60 * 1000,
      jwtExpiry: '15m',
    },
    refresh: {
      ttlMs: 7 * 24 * 60 * 60 * 1000,
    },
  },

  devices: {
    maxPerUser: 3,
  },
};
