import axios from 'axios';
import { refreshAccessToken } from '@/lib/auth/refresh-manager';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      throw error;
    }

    original._retry = true;

    try {
      await refreshAccessToken(fetch);
      return api(original);
    } catch {
      window.location.href = '/';
      throw error;
    }
  },
);

export default api;
