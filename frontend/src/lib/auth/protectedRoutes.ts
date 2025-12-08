import { ProtectedRoute } from '@/lib/auth/auth-types';

export const protectedRoutes: ProtectedRoute[] = [
  { path: '/about', roles: ['guest', 'user', 'admin'] },
  { path: '/products', roles: ['guest', 'user', 'admin'] },
  { path: '/admin', roles: ['admin'] },
  { path: '/', roles: ['guest', 'user', 'admin'] },
];
