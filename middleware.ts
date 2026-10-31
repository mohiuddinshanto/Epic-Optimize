import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'baiduspider',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'slackbot',
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Skip static assets, internal Next.js chunks, images, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Check if the path already starts with a supported locale
  const pathnameIsMissingLocale =
    !/^\/(en|bn)(\/|$)/.test(pathname);

  // If already localized (e.g., /en or /bn), continue normally
  if (!pathnameIsMissingLocale) {
    return NextResponse.next();
  }

  // 3. Search Engine Bot Check: Never force redirect search engine crawlers
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const isSearchCrawler = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));
  if (isSearchCrawler) {
    return NextResponse.redirect(new URL(`/en${pathname === '/' ? '' : pathname}`, request.url));
  }

  // 4. Manual Preference Cookie check
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie === 'bn' || localeCookie === 'en') {
    return NextResponse.redirect(
      new URL(`/${localeCookie}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  // 5. Local Dev & Testing Override:
  const countryParam = searchParams.get('country')?.toUpperCase();
  const envSimulatedCountry = process.env.SIMULATE_COUNTRY?.toUpperCase();
  const vercelCountry = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  const detectedCountry = countryParam || envSimulatedCountry || vercelCountry;

  if (detectedCountry === 'BD') {
    return NextResponse.redirect(
      new URL(`/bn${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  // 6. Accept-Language header check
  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() || '';
  if (acceptLanguage.includes('bn') || acceptLanguage.includes('bengali')) {
    return NextResponse.redirect(
      new URL(`/bn${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  // 7. Default fallback to /en for all international visitors
  return NextResponse.redirect(
    new URL(`/en${pathname === '/' ? '' : pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
