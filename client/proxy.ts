import { NextRequest, NextResponse } from 'next/server';
import { JWT_COOKIE_NAME } from './lib/config';

// Routes that require the cookie to be present
const PROTECTED_PREFIXES = ['/', '/user', '/entries'];

// Auth pages a logged-in user shouldn't see again
const AUTH_PAGES = ['/sign-in', '/sign-up'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasCookie = Boolean(req.cookies.get(JWT_COOKIE_NAME)?.value);

  const isProtected = PROTECTED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = AUTH_PAGES.some(page => pathname === page);

  if (isProtected && !hasCookie) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthPage && hasCookie) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
