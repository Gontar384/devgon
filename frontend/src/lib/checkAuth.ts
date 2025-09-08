import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthUser, ProtectedRoute } from '@/lib/types/auth-types';

export const protectedRoutes: ProtectedRoute[] = [
  { path: '/products', roles: ['user', 'admin'] },
];

export async function checkAuth(currentPath: string): Promise<AuthUser> {
  const route = protectedRoutes.find((r) => currentPath.startsWith(r.path));

  const token = (await cookies()).get('auth_token')?.value;

  let user: AuthUser = { userId: '', email: '', role: 'guest' };

  if (token) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
        {
          headers: { cookie: `auth_token=${token}` },
          cache: 'no-store',
        },
      );

      if (res.ok) {
        user = (await res.json()) as AuthUser;
      }
    } catch {
      console.error('Error while checking auth');
    }
  }

  if (route && !route.roles.includes(user.role)) {
    redirect('/');
  }

  return user;
}
