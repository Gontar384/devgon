import api from '@/lib/auth/axios';

export function loginWithGoogle(): void {
  window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth`;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
}
