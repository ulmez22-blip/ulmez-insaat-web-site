import { NextResponse } from 'next/server';

const LOCALES = ['tr', 'en', 'ku'];
const DEFAULT_LOCALE = 'tr';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and admin (admin stays locale-less/tr for simplicity).
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Prefer a saved cookie choice, otherwise default to Turkish.
  const cookieLocale = request.cookies.get('locale')?.value;
  const locale = LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|admin|.*\\..*).*)'],
};
