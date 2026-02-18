import { NextRequest, NextResponse } from 'next/server';
import { ProtectedRoute } from '@/lib/auth/auth-types';
import { AUTH_ENDPOINTS } from '@/lib/auth/authActions';

/**
 * Next.js middleware that protects routes requiring specific roles.
 * For each protected path, forwards the request's cookies to the auth
 * verify endpoint. On success, passes through any Set-Cookie headers
 * from the response (e.g. refreshed session tokens). Redirects to "/"
 * on auth failure, missing role, or network error.
 */
export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const protectedRoutes: ProtectedRoute[] = [
    { path: '/admin', roles: ['admin'] },
  ];

  const route = protectedRoutes.find((r) => pathname.startsWith(r.path));
  if (!route) return NextResponse.next();

  const cookieHeader = req.headers.get('cookie') ?? '';

  try {
    const verifyRes = await fetch(AUTH_ENDPOINTS.verify, {
      method: 'GET',
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!verifyRes.ok) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const user = await verifyRes.json();

    if (!route.roles.includes(user.role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const response = NextResponse.next();

    const setCookieHeaders = verifyRes.headers.getSetCookie();
    setCookieHeaders.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/:path*'],
};
