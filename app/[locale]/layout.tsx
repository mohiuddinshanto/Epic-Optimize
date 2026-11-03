import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { AppProviders } from '../../components/providers/AppProviders';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://epicoptimize.com'),
  title: 'Epic Optimize | Web Development, SEO & Digital Marketing in Dhaka',
  description:
    'Epic Optimize is a Dhaka, Bangladesh digital agency delivering web and software development, SEO, digital advertising, and brand identity for businesses worldwide.',
  keywords: [
    'Epic Optimize',
    'Epic Optimize Bangladesh',
    'Epic Optimize Dhaka',
    'digital agency Dhaka',
    'web development Bangladesh',
    'software development Dhaka',
    'SEO agency Bangladesh',
    'digital marketing agency Dhaka',
    'Google Ads agency Bangladesh',
    'Meta Ads agency Bangladesh',
  ],
  authors: [{ name: 'Epic Optimize', url: 'https://epicoptimize.com' }],
  creator: 'Epic Optimize',
  publisher: 'Epic Optimize',
  alternates: {
    canonical: 'https://epicoptimize.com/en',
    languages: {
      en: '/en',
      bn: '/bn',
      'x-default': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'bn_BD',
    url: 'https://epicoptimize.com/en',
    title: 'Epic Optimize | Web Development, SEO & Digital Marketing in Dhaka',
    description:
      'Web development, software, SEO, digital advertising, and brand identity from Epic Optimize in Dhaka, serving businesses worldwide.',
    siteName: 'Epic Optimize',
    images: [{ url: '/epic.png', alt: 'Epic Optimize logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Epic Optimize | Web Development, SEO & Digital Marketing in Dhaka',
    description:
      'Web development, software, SEO, digital advertising, and brand identity from Dhaka, Bangladesh.',
    images: ['/epic.png'],
  },
  icons: { icon: '/epic.png' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Epic Optimize',
  alternateName: 'এপিক অপটিমাইজ',
  slogan: 'Grow Smarter. Go Epic.',
  url: 'https://epicoptimize.com',
  logo: 'https://epicoptimize.com/epic.png',
  description:
    'Digital agency in Dhaka, Bangladesh specializing in web and software development, SEO, digital advertising, marketing, and brand identity.',
  email: 'epicoptimize@gmail.com',
  telephone: '+8801987363537',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Orbit Mustakim Tower, Jatrabari',
    addressLocality: 'Dhaka',
    postalCode: '1236',
    addressCountry: 'BD',
  },
  areaServed: 'Worldwide',
  serviceType: [
    'Web & Software Development',
    'Search Engine Optimization',
    'Digital Advertising (Meta & Google)',
    'Digital Marketing & CRO',
    'Brand Identity & Design',
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale === 'bn' ? 'bn' : 'en'} className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "try { if (localStorage.getItem('epic_theme') === 'light') document.documentElement.classList.remove('dark'); } catch (_) {}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col selection:bg-orange-500/30 selection:text-orange-200 relative">
        <AppProviders initialLocale={locale === 'bn' ? 'bn' : 'en'}>{children}</AppProviders>
      </body>
    </html>
  );
}
