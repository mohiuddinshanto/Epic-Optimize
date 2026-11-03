import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { companyInfo } from '../../data/company';
import { LegalModal } from '../ui/LegalModal';

export const Footer: React.FC = () => {
  const { t } = useLocale();
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[var(--bg-card)] text-theme-secondary py-16 border-t border-[var(--border-subtle)] relative overflow-hidden">
        {/* Subtle animated light orb detail in footer background */}
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[var(--border-subtle)]">
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/epic.png"
                  alt="Epic Optimize logo"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-xl bg-white object-contain p-0.5 shadow-sm"
                />
                <span className="font-display font-bold text-xl text-theme-primary tracking-tight">
                  Epic Optimize
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{t.common.availableForProjects}</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                {t.footer.tagline}
              </p>
              <p className="text-sm text-theme-secondary max-w-sm leading-relaxed">
                {t.footer.description}
              </p>
              <div className="pt-2 text-xs text-theme-muted font-mono">
                {t.contact.direct.address}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-semibold text-theme-primary uppercase tracking-wider">
                {t.common.navigation}
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#services" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    {t.nav.services}
                  </a>
                </li>
                <li>
                  <a href="#process" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    {t.nav.process}
                  </a>
                </li>
                <li>
                  <a
                    href={companyInfo.workShowcaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <span>{t.nav.work}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="#why-us" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    {t.nav.whyUs}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    {t.nav.faq}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    {t.nav.contact}
                  </a>
                </li>
              </ul>
            </div>

            {/* Direct Connect & Testing Helpers */}
            <div className="md:col-span-4 space-y-4">
              <p className="text-xs font-semibold text-theme-primary uppercase tracking-wider">
                {t.common.directContact}
              </p>
              <div className="text-sm space-y-1.5">
                <p>
                  <span className="text-theme-muted">{t.common.emailInquiry}: </span>
                  <a href={`mailto:${companyInfo.email}`} className="text-theme-secondary hover:text-cyan-500">
                    {companyInfo.email}
                  </a>
                </p>
                <p>
                  <span className="text-theme-muted">{t.contact.direct.whatsappLabel}: </span>
                  <a
                    href={companyInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-secondary hover:text-emerald-500"
                  >
                    {companyInfo.phone}
                  </a>
                </p>
              </div>

            </div>
          </div>

          {/* Bottom Bar: Rights, Legal Policies & Trust Notice */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span>© {new Date().getFullYear()} Epic Optimize. {t.footer.rights}</span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <button
                onClick={() => setLegalModalType('privacy')}
                className="hover:text-cyan-400 underline-offset-4 hover:underline cursor-pointer"
              >
                {t.footer.privacy}
              </button>
              <button
                onClick={() => setLegalModalType('terms')}
                className="hover:text-cyan-400 underline-offset-4 hover:underline cursor-pointer"
              >
                {t.footer.terms}
              </button>
            </div>

            {/* Trust rule badge */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-md dark:text-cyan-300 dark:bg-cyan-950/60 dark:border-cyan-800/40">
                {t.footer.trustNote}
              </span>
              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-[var(--bg-card-subtle)] hover:bg-[var(--border-subtle)] text-theme-secondary hover:text-theme-primary transition-colors cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                title={t.common.scrollToTop}
                aria-label={t.common.scrollToTop}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
    </>
  );
};
