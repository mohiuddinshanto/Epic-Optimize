import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

export const FAQSection: React.FC = () => {
  const { t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-theme-primary mb-4">
            {t.faq.title}
          </h2>
          <p className="text-base sm:text-lg text-theme-secondary">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion List with depth elevation on active item */}
        <div className="space-y-4">
          {t.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`card-theme rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-cyan-500/50 shadow-xl shadow-cyan-500/10 -translate-y-1 ring-1 ring-cyan-500/30'
                    : 'shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className={`font-display text-base sm:text-lg font-bold transition-colors ${
                    isOpen ? 'text-cyan-500' : 'text-theme-primary'
                  }`}>
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] flex items-center justify-center text-theme-muted shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-cyan-500/15 text-cyan-500' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-theme-secondary leading-relaxed border-t border-[var(--border-subtle)] animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
