import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AgencyLandingPage } from '../../components/sections/AgencyLandingPage';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') notFound();

  const isBangla = locale === 'bn';
  const title = isBangla
    ? 'এপিক অপটিমাইজ | ঢাকা, বাংলাদেশে ওয়েব উন্নয়ন, SEO ও ডিজিটাল বিপণন'
    : 'Epic Optimize | Web Development, SEO & Digital Marketing in Dhaka';
  const description = isBangla
    ? 'এপিক অপটিমাইজ ঢাকাভিত্তিক একটি ডিজিটাল এজেন্সি। আমরা বিশ্বজুড়ে ব্যবসার জন্য ওয়েব ও সফটওয়্যার উন্নয়ন, SEO, ডিজিটাল বিজ্ঞাপন এবং ব্র্যান্ড পরিচিতি গড়ে তুলি।'
    : 'Epic Optimize is a Dhaka, Bangladesh digital agency delivering web and software development, SEO, digital advertising, and brand identity for businesses worldwide.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://epicoptimize.com/${locale}`,
      languages: {
        en: 'https://epicoptimize.com/en',
        bn: 'https://epicoptimize.com/bn',
        'x-default': 'https://epicoptimize.com/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: isBangla ? 'bn_BD' : 'en_US',
      url: `https://epicoptimize.com/${locale}`,
      title,
      description,
      siteName: 'Epic Optimize',
      images: [{ url: '/epic.png', alt: 'Epic Optimize logo' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/epic.png'] },
  };
}

export default async function LocalizedPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== 'en' && locale !== 'bn') {
    notFound();
  }

  return <AgencyLandingPage />;
}
