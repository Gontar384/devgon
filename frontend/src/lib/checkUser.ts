import { cookies } from 'next/headers';
import { AuthUser } from '@/lib/types/auth-types';

export async function getAuthUser(): Promise<AuthUser> {
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
        user = await res.json();
      }
    } catch {
      console.error('Error fetching auth user');
    }
  }

  return user;
}
