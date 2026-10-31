import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryParam = searchParams.get('country')?.toUpperCase();
  const envCountry = process.env.SIMULATE_COUNTRY?.toUpperCase();
  const vercelCountry = request.headers.get('x-vercel-ip-country')?.toUpperCase();

  const detectedCountry = countryParam || envCountry || vercelCountry || 'UNKNOWN';
  const suggestedLocale = detectedCountry === 'BD' ? 'bn' : 'en';

  return NextResponse.json({
    country: detectedCountry,
    suggestedLocale,
    source: countryParam
      ? 'query'
      : envCountry
      ? 'env'
      : vercelCountry
      ? 'vercel-header'
      : 'default',
  });
}
