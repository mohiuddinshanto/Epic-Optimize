import React, { useState, useEffect } from 'react';
import { Sun, Moon, Laptop, Menu, X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import { companyInfo } from '../../data/company';

export const Navbar: React.FC = () => {
  const { locale, setLocale, t } = useLocale();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#services', label: t.nav.services, isExternal: false },
    { href: '#process', label: t.nav.process, isExternal: false },
    { href: companyInfo.workShowcaseUrl, label: t.nav.work, isExternal: true },
    { href: '#why-us', label: t.nav.whyUs, isExternal: false },
    { href: '#faq', label: t.nav.faq, isExternal: false },
    { href: '#contact', label: t.nav.contact, isExternal: false },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Scroll Progress Indicator */}
      <div
        className="absolute top-0 left-0 h-[2.5px] bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-100 ease-out z-50"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Slogan */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl tracking-tighter shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              EO
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-theme-primary leading-none">
                Epic Optimize
              </span>
              <span className="text-[11px] font-medium text-cyan-500 tracking-wider uppercase mt-1">
                Grow Smarter. Go Epic.
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) =>
              link.isExternal ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-theme-secondary hover:text-cyan-500 transition-colors rounded-lg hover:bg-[var(--bg-card-subtle)] cursor-pointer"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3.5 py-2 text-sm font-medium text-theme-secondary hover:text-cyan-500 transition-colors rounded-lg hover:bg-[var(--bg-card-subtle)] cursor-pointer"
                >
                  {link.label}
                </button>
              )
            )}
          </nav>

          {/* Right Action Cluster: Language Switcher, Theme Switcher, CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-full p-1 text-xs font-semibold">
              <button
                onClick={() => setLocale('en')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  locale === 'en'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
                title="Switch to English"
                aria-label="English"
              >
                EN
              </button>
              <button
                onClick={() => setLocale('bn')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  locale === 'bn'
                    ? 'bg-cyan-500 text-white shadow-sm font-bangla'
                    : 'text-theme-muted hover:text-theme-primary font-bangla'
                }`}
                title="বাংলায় পরিবর্তন করুন"
                aria-label="Bangla"
              >
                বাংলা
              </button>
            </div>

            {/* Theme Toggle (Light / Dark / System cycle) */}
            <button
              onClick={() => {
                if (theme === 'dark') setTheme('light');
                else if (theme === 'light') setTheme('system');
                else setTheme('dark');
              }}
              className="p-2 rounded-full text-theme-secondary hover:text-cyan-500 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
              title={`Current theme: ${theme} (Click to toggle)`}
              aria-label="Toggle theme mode"
            >
              {theme === 'system' ? (
                <Laptop className="w-4 h-4" />
              ) : resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-cyan-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => handleNavClick('#contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-600/20 hover:shadow-cyan-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t.nav.cta}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button & Mobile Quick Toggles */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}
              className="px-2 py-1 text-xs font-semibold rounded-md bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-theme-primary"
            >
              {locale === 'en' ? 'বাংলা' : 'EN'}
            </button>
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-theme-primary"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-theme-primary hover:bg-[var(--bg-card-subtle)] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) =>
              link.isExternal ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 text-base font-medium text-theme-primary hover:text-cyan-500 rounded-md hover:bg-[var(--bg-card-subtle)]"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </a>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-2.5 text-base font-medium text-theme-primary hover:text-cyan-500 rounded-md hover:bg-[var(--bg-card-subtle)]"
                >
                  {link.label}
                </button>
              )
            )}
            <button
              onClick={() => handleNavClick('#contact')}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-md"
            >
              <span>{t.nav.cta}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
