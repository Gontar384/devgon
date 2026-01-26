import { NextRequest, NextResponse } from 'next/server';
import { ProtectedRoute } from '@/lib/auth/auth-types';
import { AUTH_ENDPOINTS } from '@/lib/auth/authActions';
import { fetchWithRefresh } from '@/lib/auth/refresh-manager';

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const protectedRoutes: ProtectedRoute[] = [
    { path: '/admin', roles: ['admin'] },
  ];

  const route = protectedRoutes.find((r) => pathname.startsWith(r.path));
  if (!route) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get('cookie') ?? '';
  if (!cookieHeader.includes('access_token')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  let user;
  try {
    const verifyRes = await fetchWithRefresh(AUTH_ENDPOINTS.verify, {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!verifyRes.ok) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    user = await verifyRes.json();
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!route.roles.includes(user.role)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
