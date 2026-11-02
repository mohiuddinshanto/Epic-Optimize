export function ReferenceDesignPage({ locale = 'en' }: { locale?: 'en' | 'bn' }) {
  return (
    <iframe
      src={`/epic-optimize-design.html?locale=${locale}`}
      title="Epic Optimize"
      className="fixed inset-0 z-[100] h-dvh w-full border-0 bg-[#0c0c0e]"
      allow="clipboard-write"
    />
  );
}
