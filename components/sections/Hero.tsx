import React, { useRef, useState } from 'react';
import { ArrowRight, MapPin, MousePointerClick, ExternalLink } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { companyInfo } from '../../data/company';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';

// Magnetic Button component for tactile micro-interactions
const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}> = ({ children, className = '', onClick, href, target, rel }) => {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.25;
    const deltaY = (e.clientY - centerY) * 0.25;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: offset.x === 0 && offset.y === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out',
  };

  if (href) {
    return (
      <a
        ref={btnRef as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={className}
    >
      {children}
    </button>
  );
};

export const Hero: React.FC = () => {
  const { t } = useLocale();

  const handleScrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex items-center overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column (Text-first, prioritized for immediate LCP) */}
          <div className="lg:col-span-7 z-10">
            {/* Location & Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 mb-6 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-cyan-500" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-theme-primary leading-[1.12] mb-6">
              {t.hero.headline}
            </h1>

            {/* Subheadline / Value Proposition */}
            <p className="text-lg sm:text-xl text-theme-secondary max-w-2xl leading-relaxed mb-8">
              {t.hero.subheadline}
            </p>

            {/* Action Buttons with Magnetic hover micro-interactions */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <MagneticButton
                onClick={handleScrollToContact}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:via-sky-500 hover:to-blue-500 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-500/35 cursor-pointer text-base select-none"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                href={companyInfo.workShowcaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-theme-primary bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] cursor-pointer text-base shadow-sm select-none"
              >
                <span>{t.hero.secondaryCta}</span>
                <ExternalLink className="w-4 h-4 text-cyan-500" />
              </MagneticButton>
            </div>

            {/* Studio Tagline Bar */}
            <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-subtle)]">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <p className="text-sm font-semibold tracking-wide uppercase text-theme-muted">
                {t.hero.tagline}
              </p>
              <span className="text-theme-muted">•</span>
              <p className="text-xs text-theme-muted">
                {t.hero.locationBadge}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive 3D Hero Scene */}
          <div className="lg:col-span-5 relative w-full h-[400px] sm:h-[480px] lg:h-[540px] flex flex-col items-center justify-center">
            <Hero3DCanvas />

            {/* Interaction hint pill */}
            <div className="absolute bottom-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[var(--bg-card)] text-theme-muted border border-[var(--border-subtle)] shadow-sm pointer-events-none">
              <MousePointerClick className="w-3 h-3 text-cyan-500" />
              <span>{t.hero.canvasHint}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
