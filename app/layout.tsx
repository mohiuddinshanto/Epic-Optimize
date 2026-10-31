import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '../components/providers/AppProviders';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#07090e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://epicoptimize.com'),
  title: 'Epic Optimize | Grow Smarter. Go Epic. — Digital Agency',
  description:
    'Epic Optimize is a modern digital agency in Dhaka, Bangladesh serving global clients. Web & Software Development, SEO, Digital Advertising, Marketing & Brand Identity.',
  keywords: [
    'Digital Agency Dhaka',
    'Web Development Bangladesh',
    'Next.js Agency',
    'SEO Agency Dhaka',
    'Meta Ads Agency',
    'Google Ads Specialist',
    'Full Stack Software Development',
    'Epic Optimize',
  ],
  authors: [{ name: 'Epic Optimize', url: 'https://epicoptimize.com' }],
  creator: 'Epic Optimize',
  publisher: 'Epic Optimize',
  alternates: {
    canonical: 'https://epicoptimize.com',
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
    url: 'https://epicoptimize.com',
    title: 'Epic Optimize | Grow Smarter. Go Epic. — Digital Agency',
    description:
      'Modern digital agency in Dhaka, Bangladesh serving global clients. Web & Software Development, SEO, Digital Advertising, and Brand Identity.',
    siteName: 'Epic Optimize',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Epic Optimize | Grow Smarter. Go Epic.',
    description:
      'Digital agency in Dhaka, Bangladesh for international clients. Web development, SEO, advertising, and branding.',
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
