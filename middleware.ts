import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { locales, defaultLocale } from './src/i18n.config';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const PUBLIC_PATHS = ['/login', '/register', '/api/auth'];

function isPublicPath(path: string) {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
}

function getLocaleFromPath(path: string) {
  const pathSegments = path.split('/').filter(Boolean);
  return pathSegments.length > 0 && locales.includes(pathSegments[0] as any)
    ? pathSegments[0]
    : null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // API route protection
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Handle internationalization
  const pathnameHasLocale = getLocaleFromPath(pathname);
  
  // If the path already has a valid locale, do nothing
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to the path with the default locale if the path doesn't have a locale
  const locale = defaultLocale;
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  // Forward the search params
  newUrl.search = request.nextUrl.search;
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*|api/auth).*)',
    '/api/:path*'
  ],
}; 