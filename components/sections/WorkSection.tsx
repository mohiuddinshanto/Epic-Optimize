import React, { useRef, useState, useEffect } from 'react';
import { ExternalLink, Sparkles, Layers } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import { companyInfo } from '../../data/company';

export const WorkSection: React.FC = () => {
  const { t } = useLocale();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', listener);
    return () => motionQuery.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <section
      id="work"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-24 relative overflow-hidden border-t border-[var(--border-subtle)]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>{t.work.badge}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-theme-primary">
              {t.work.title}
            </h2>

            <p className="text-base sm:text-lg text-theme-secondary max-w-xl leading-relaxed">
              {t.work.subtitle}
            </p>

            <div className="pt-2">
              <a
                href={companyInfo.workShowcaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:via-sky-500 hover:to-blue-500 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-base group"
              >
                <span>{t.work.cta}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-theme-muted font-mono pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>https://work.epicoptimize.com</span>
            </div>
          </div>

          {/* Right: Decorative Motif of Abstract Floating 3D Browser Windows */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px] perspective-[1000px]">
            {/* Back Browser Pane */}
            <div
              className="absolute w-[280px] sm:w-[350px] h-[190px] sm:h-[230px] rounded-2xl border transition-transform duration-300 ease-out shadow-xl backdrop-blur-md overflow-hidden pointer-events-none"
              style={{
                transform: `translate3d(${mouseOffset.x * -25 - 30}px, ${mouseOffset.y * -20 - 25}px, -40px) rotateX(${
                  mouseOffset.y * -15 + 6
                }deg) rotateY(${mouseOffset.x * 15 - 12}deg)`,
                backgroundColor: isDark ? 'rgba(13, 18, 28, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.2)',
              }}
            >
              {/* Browser Header */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]/50">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                <div className="ml-3 h-2 w-32 rounded-full bg-[var(--border-subtle)]" />
              </div>
              {/* Wireframe Mock content */}
              <div className="p-4 space-y-2 opacity-60">
                <div className="h-3 w-3/4 rounded bg-cyan-500/30" />
                <div className="h-2 w-1/2 rounded bg-[var(--border-subtle)]" />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="h-14 rounded-lg bg-[var(--border-subtle)]/40" />
                  <div className="h-14 rounded-lg bg-[var(--border-subtle)]/40" />
                  <div className="h-14 rounded-lg bg-[var(--border-subtle)]/40" />
                </div>
              </div>
            </div>

            {/* Front Browser Pane */}
            <div
              className="relative w-[300px] sm:w-[380px] h-[210px] sm:h-[250px] rounded-2xl border transition-transform duration-200 ease-out shadow-2xl backdrop-blur-xl overflow-hidden pointer-events-none"
              style={{
                transform: `translate3d(${mouseOffset.x * 30 + 15}px, ${mouseOffset.y * 25 + 15}px, 30px) rotateX(${
                  mouseOffset.y * 12 - 4
                }deg) rotateY(${mouseOffset.x * -14 + 8}deg)`,
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.35)',
              }}
            >
              {/* Browser Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[10px] text-cyan-500 font-mono">
                  work.epicoptimize.com
                </div>
                <div className="w-4 h-4 rounded text-theme-muted flex items-center justify-center text-xs">
                  ⚡
                </div>
              </div>
              {/* Wireframe Mock content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-40 rounded bg-cyan-500/40" />
                  <div className="h-2 w-16 rounded bg-emerald-400/50" />
                </div>
                <div className="h-2.5 w-5/6 rounded bg-[var(--border-subtle)]" />
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="h-20 rounded-xl border border-cyan-500/20 bg-gradient-to-tr from-cyan-500/10 to-transparent p-2.5 flex flex-col justify-end">
                    <div className="h-2 w-16 rounded bg-cyan-400/50 mb-1" />
                    <div className="h-1.5 w-10 rounded bg-[var(--border-subtle)]" />
                  </div>
                  <div className="h-20 rounded-xl border border-blue-500/20 bg-gradient-to-tr from-blue-500/10 to-transparent p-2.5 flex flex-col justify-end">
                    <div className="h-2 w-16 rounded bg-blue-400/50 mb-1" />
                    <div className="h-1.5 w-10 rounded bg-[var(--border-subtle)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating 3D Accent Node Badge */}
            <div
              className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-[var(--bg-card)] shadow-lg text-xs font-semibold text-cyan-500 flex items-center gap-1.5 backdrop-blur-md pointer-events-none transition-transform duration-150"
              style={{
                transform: `translate3d(${mouseOffset.x * 45}px, ${mouseOffset.y * 40}px, 60px)`,
              }}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              <span>Live Showcase</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
