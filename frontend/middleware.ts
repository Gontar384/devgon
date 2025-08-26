import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const privateRoutes = new Set(['/account']);
  const publicRoutes = new Set(['/login', '/register']);

  const pathname = request.nextUrl.pathname;

  const isLoggedIn = true;

  if (!isLoggedIn && privateRoutes.has(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  } else if (isLoggedIn && publicRoutes.has(pathname)) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}
