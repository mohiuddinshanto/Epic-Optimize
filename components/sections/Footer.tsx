import React, { useState } from 'react';
import { Globe2, ArrowUp, ExternalLink } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { companyInfo } from '../../data/company';
import { LegalModal } from '../ui/LegalModal';

export const Footer: React.FC = () => {
  const { t, locale, setLocale } = useLocale();
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-slate-900 dark:bg-[#05070b] text-slate-400 py-16 border-t border-slate-800 relative overflow-hidden">
        {/* Subtle animated light orb detail in footer background */}
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  EO
                </div>
                <span className="font-display font-bold text-xl text-white tracking-tight">
                  Epic Optimize
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Available for Q4/Q1</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                {t.footer.tagline}
              </p>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                {t.footer.description}
              </p>
              <div className="pt-2 text-xs text-slate-500 font-mono">
                {companyInfo.address}, {companyInfo.city} {companyInfo.postalCode}, {companyInfo.country}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Navigation
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#services" className="hover:text-cyan-400 transition-colors">
                    {t.nav.services}
                  </a>
                </li>
                <li>
                  <a href="#process" className="hover:text-cyan-400 transition-colors">
                    {t.nav.process}
                  </a>
                </li>
                <li>
                  <a
                    href={companyInfo.workShowcaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                  >
                    <span>{t.nav.work}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="#why-us" className="hover:text-cyan-400 transition-colors">
                    {t.nav.whyUs}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-cyan-400 transition-colors">
                    {t.nav.faq}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-cyan-400 transition-colors">
                    {t.nav.contact}
                  </a>
                </li>
              </ul>
            </div>

            {/* Direct Connect & Testing Helpers */}
            <div className="md:col-span-4 space-y-4">
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Direct Contact
              </p>
              <div className="text-sm space-y-1.5">
                <p>
                  <span className="text-slate-500">Email: </span>
                  <a href={`mailto:${companyInfo.email}`} className="text-slate-300 hover:text-cyan-400">
                    {companyInfo.email}
                  </a>
                </p>
                <p>
                  <span className="text-slate-500">WhatsApp: </span>
                  <a
                    href={companyInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-emerald-400"
                  >
                    {companyInfo.phone}
                  </a>
                </p>
              </div>

              {/* Dev Testing Tool for ?country=BD */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium text-cyan-300">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Geo-Routing Dev Simulator</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Simulate Vercel header <code className="text-cyan-200">x-vercel-ip-country: BD</code>:
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setLocale('bn')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      locale === 'bn' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Simulate BD (?country=BD)
                  </button>
                  <button
                    onClick={() => setLocale('en')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      locale === 'en' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Simulate Global / EN
                  </button>
                </div>
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
              <span className="font-mono text-[11px] text-cyan-400/90 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-md">
                {t.footer.trustNote}
              </span>
              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                title="Scroll to top"
                aria-label="Scroll to top"
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
