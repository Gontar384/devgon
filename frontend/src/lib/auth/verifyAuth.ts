import { redirect } from 'next/navigation';
import { protectedRoutes } from '@/lib/auth/protectedRoutes';
import { getAuthUser } from '@/lib/auth/getAuthUser';

export async function verifyAuth(currentPath: string): Promise<void> {
  const route = protectedRoutes.find((r) => currentPath.startsWith(r.path));
  if (!route) return;

  const user = await getAuthUser();
  if (!user) return;

  if (!route.roles.includes(user.role)) {
    redirect('/');
  }
}
