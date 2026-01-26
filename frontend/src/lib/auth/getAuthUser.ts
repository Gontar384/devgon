import { AuthUser } from '@/lib/auth/auth-types';
import { cookies } from 'next/headers';

export async function getAuthUser(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  let user: AuthUser = { userId: '', email: '', role: 'guest' };

  if (accessToken) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
        {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include',
          headers: {
            Cookie: `access_token=${accessToken}`,
          },
        },
      );

      if (res.ok) {
        user = (await res.json()) as AuthUser;
      }
    } catch (error) {
      console.error('Error getting auth user:', error);
    }
  }

  return user;
}
