import { AUTH_ENDPOINTS } from '@/lib/auth/authActions';

let refreshPromise: Promise<void> | null = null;

export async function refreshAccessToken(
  fetchFn: typeof fetch,
  cookie?: string,
) {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetchFn(AUTH_ENDPOINTS.refresh, {
        method: 'POST',
        credentials: 'include',
        headers: cookie ? { cookie } : undefined,
      });

      if (!res.ok) throw new Error('Refresh failed');
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function fetchWithRefresh(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  let res = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  if (res.status !== 401) return res;

  await refreshAccessToken(fetch);

  res = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  return res;
}
