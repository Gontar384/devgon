import { ProtectedRoute } from '@/lib/auth/auth-types';

export const protectedRoutes: ProtectedRoute[] = [
  { path: '/', roles: ['guest', 'user', 'admin'] },
  { path: '/about', roles: ['guest', 'user', 'admin'] },
  { path: '/products', roles: ['user', 'admin'] },
];
