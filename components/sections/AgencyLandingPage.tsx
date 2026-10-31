'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { ServicesSection } from './ServicesSection';
import { ProcessSection } from './ProcessSection';
import { WorkSection } from './WorkSection';
import { WhyUsSection } from './WhyUsSection';
import { FAQSection } from './FAQSection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';

export const AgencyLandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <ServicesSection />
        <ProcessSection />
        <WorkSection />
        <WhyUsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};
