import { CompanyInfo } from '../types';
import enMessages from './messages/en.json';
import bnMessages from './messages/bn.json';

export const companyInfo: CompanyInfo = {
  name: 'Epic Optimize',
  tagline: 'Grow Smarter. Go Epic.',
  email: 'epicoptimize@gmail.com',
  phone: '+880 1987-363537',
  whatsappNumber: '+8801987363537',
  whatsappUrl: 'https://wa.me/8801987363537?text=Hello%20Epic%20Optimize%2C%20I%20would%20like%20to%20discuss%20a%20project.',
  address: 'Orbit Mustakim Tower, Jatrabari',
  city: 'Dhaka',
  postalCode: '1236',
  country: 'Bangladesh',
  responseTimeNote: 'Typical response time: Within 12-24 hours on business days (Dhaka Time, GMT+6).',
  workShowcaseUrl: 'https://work.epicoptimize.com',
};

export const messagesData = {
  en: enMessages,
  bn: bnMessages,
};

export const serviceList = [
  'Web & Software Development',
  'SEO (Search Engine Optimization)',
  'Digital Advertising (Meta & Google)',
  'Digital Marketing',
  'Brand Identity',
] as const;
