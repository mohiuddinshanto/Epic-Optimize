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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // 5. Detect country from the hosting platform, then fall back to IP geolocation.
  // Hostinger CDN provides the visitor address in X-Real-IP, not a country header.
  const vercelCountry = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  let detectedCountry = vercelCountry;

  if (!detectedCountry) {
    const clientIp = request.headers.get('x-real-ip')?.trim();
    if (clientIp) {
      try {
        const geoResponse = await fetch(`https://ipwho.is/${encodeURIComponent(clientIp)}`, {
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(1500),
          cache: 'no-store',
        });
        if (geoResponse.ok) {
          const geoData = (await geoResponse.json()) as { success?: boolean; country_code?: string };
          if (geoData.success && geoData.country_code) {
            detectedCountry = geoData.country_code.toUpperCase();
          }
        }
      } catch {
        // Geolocation is best-effort; use the browser language if the lookup fails.
      }
    }
  }

  if (detectedCountry === 'BD') {
    return NextResponse.redirect(
      new URL(`/bn${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  if (detectedCountry) {
    return NextResponse.redirect(
      new URL(`/en${pathname === '/' ? '' : pathname}`, request.url)
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
