import api from '@/lib/auth/axios';

/** Redirects the browser to the backend Google OAuth entry point. */
export function loginWithGoogle(): void {
  window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth`;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
}

export const AUTH_ENDPOINTS = {
  verify: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
  graphql: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/graphql`,
};
