import enMessages from '../data/messages/en.json';

export type Messages = typeof enMessages;
export type Locale = 'en' | 'bn';
export type Theme = 'dark' | 'light' | 'system';

export interface CompanyInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  responseTimeNote: string;
  workShowcaseUrl: string;
}

export interface NavItem {
  href: string;
  label: string;
  isExternal?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
  honeypot?: string;
}
