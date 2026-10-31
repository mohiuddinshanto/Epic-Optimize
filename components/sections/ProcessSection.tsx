import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

export const ProcessSection: React.FC = () => {
  const { t, formatNumber } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress of section in viewport
      const totalDist = rect.height + windowHeight;
      const currentDist = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);
      setScrollProgress(progress);

      // Map progress to active step (0 to 4)
      const step = Math.min(Math.floor(progress * 5), 4);
      setActiveStep(step);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-24 section-alt border-y border-[var(--border-subtle)] relative scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
            {t.process.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-theme-primary mb-4">
            {t.process.title}
          </h2>
          <p className="text-base sm:text-lg text-theme-secondary">
            {t.process.subtitle}
          </p>
        </div>

        {/* 3D Glowing Timeline Path (Connecting bar above cards) */}
        <div className="hidden md:block relative mb-8 px-6">
          <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden relative">
            {/* Glowing animated scroll progress line */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 rounded-full transition-all duration-150 shadow-md shadow-cyan-500/50"
              style={{ width: `${Math.max(scrollProgress * 100, 15)}%` }}
            />
          </div>
          {/* Moving 3D Pulse Marker along the line */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-5 rounded-full bg-cyan-400 border-2 border-white dark:border-slate-900 shadow-lg shadow-cyan-500 transition-all duration-150"
            style={{ left: `${Math.max(scrollProgress * 100, 5)}%` }}
          />
        </div>

        {/* 5-Step Timeline Grid with Active Step Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {t.process.steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;

            return (
              <div
                key={step.number}
                className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'card-theme border-cyan-500 shadow-xl shadow-cyan-500/15 -translate-y-2 ring-1 ring-cyan-500/30'
                    : isCompleted
                    ? 'card-theme border-cyan-500/40 opacity-90'
                    : 'card-theme border-[var(--border-subtle)] opacity-75 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Step Number & Connector Dot */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`font-display text-3xl font-extrabold transition-colors ${
                      isActive ? 'text-cyan-500' : 'text-theme-primary'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/40 scale-110'
                        : isCompleted
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-[var(--bg-card-subtle)] text-theme-muted'
                    }`}
                  >
                    {idx + 1}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="font-display text-lg font-bold text-theme-primary mb-3">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-theme-secondary leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Bottom status bar */}
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-medium text-theme-muted">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${isActive || isCompleted ? 'text-cyan-500' : 'text-theme-muted'}`}
                    />
                    <span>Phase {formatNumber(idx + 1)}</span>
                  </div>
                  {idx < 4 && <ChevronRight className="w-3.5 h-3.5 text-theme-muted hidden md:inline" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
