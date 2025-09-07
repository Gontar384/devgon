import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type UserRole = 'guest' | 'user' | 'admin';

export interface ProtectedRoute {
  path: string;
  roles: UserRole[];
}

export const protectedRoutes: ProtectedRoute[] = [
  { path: '/products', roles: ['guest'] },
];

export type AuthUser = {
  userId: string;
  email: string;
  role: UserRole;
};

export async function checkAuth(currentPath: string): Promise<AuthUser> {
  const route = protectedRoutes.find((r) => currentPath.startsWith(r.path));
  if (!route) return { userId: '', email: '', role: 'guest' };

  const token = (await cookies()).get('auth_token')?.value;
  if (!token) redirect('/');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
      {
        headers: { cookie: `auth_token=${token}` },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      throw new Error('Invalid token');
    }

    const user = (await res.json()) as AuthUser;

    if (!route.roles.includes(user.role)) redirect('/');

    return user;
  } catch {
    redirect('/');
  }
}
