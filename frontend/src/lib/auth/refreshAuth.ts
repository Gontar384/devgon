import api from '@/lib/axios';

export async function refreshAuth() {
  try {
    await api.get('/api/auth/refresh');
  } catch {
    console.error('Error refreshing auth');
  }
}
