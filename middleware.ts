import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!userId;

  const publicPaths = ['/', '/signin', '/signup'];
  const authPaths = ['/signin', '/signup'];
  const protectedPaths = ['/projects', '/api/projects'];

  const isPublicPath = publicPaths.includes(pathname);
  const isAuthPath = authPaths.includes(pathname);
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (!isAuthenticated && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/projects';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
