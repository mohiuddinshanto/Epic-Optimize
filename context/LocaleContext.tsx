'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, Messages } from '../types';
import { messagesData } from '../data/company';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Messages;
  formatNumber: (n: number | string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Helper to convert English digits to Bengali numerals
export function toBengaliNumerals(val: string | number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/[0-9]/g, (w) => bengaliDigits[+w]);
}

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children, initialLocale }) => {
  // Keep the first render identical on the server and client. Reading the URL,
  // cookies, or localStorage in the state initializer caused Bengali routes to
  // render English HTML on the server and Bengali HTML during hydration.
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? 'en');

  useEffect(() => {
    if (!initialLocale) {
      const pathname = window.location.pathname;
      let detectedLocale: Locale | undefined;

      if (pathname === '/bn' || pathname.startsWith('/bn/')) detectedLocale = 'bn';
      else if (pathname === '/en' || pathname.startsWith('/en/')) detectedLocale = 'en';

      if (!detectedLocale) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang === 'bn' || urlLang === 'en') detectedLocale = urlLang;
      }

      if (!detectedLocale && new URLSearchParams(window.location.search).get('country')?.toUpperCase() === 'BD') {
        detectedLocale = 'bn';
      }

      if (!detectedLocale) {
        const cookieLocale = document.cookie.match(/(?:^|; )NEXT_LOCALE=(bn|en)(?:;|$)/)?.[1];
        if (cookieLocale === 'bn' || cookieLocale === 'en') detectedLocale = cookieLocale;
      }

      if (!detectedLocale) {
        const storedLocale = localStorage.getItem('NEXT_LOCALE');
        if (storedLocale === 'bn' || storedLocale === 'en') detectedLocale = storedLocale;
      }

      if (!detectedLocale && navigator.language?.toLowerCase().startsWith('bn')) {
        detectedLocale = 'bn';
      }

      if (detectedLocale) setLocaleState(detectedLocale);
    }
  }, [initialLocale]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;

    if (locale === 'bn') {
      root.classList.add('locale-bn');
    } else {
      root.classList.remove('locale-bn');
    }

    // Set cookie for 1 year
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem('NEXT_LOCALE', locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const toggleLocale = () => {
    setLocaleState((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const formatNumber = (n: number | string): string => {
    if (locale === 'bn') {
      return toBengaliNumerals(n);
    }
    return String(n);
  };

  const currentTranslations = (messagesData[locale] || messagesData.en) as Messages;

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t: currentTranslations,
        formatNumber,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
