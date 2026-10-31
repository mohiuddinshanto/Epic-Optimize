import { notFound } from 'next/navigation';
import { AgencyLandingPage } from '../../components/sections/AgencyLandingPage';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }];
}

export default async function LocalizedPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== 'en' && locale !== 'bn') {
    notFound();
  }

  return <AgencyLandingPage />;
}
