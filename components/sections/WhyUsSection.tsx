import React, { useRef, useState } from 'react';
import { Smartphone, Zap, Sparkles, MessageSquare, Globe2 } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

// Floating 3D Depth Card
const DepthCard: React.FC<{
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 10, ry: x * 10, active: true });
  };

  const onMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(6px)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="card-theme card-theme-hover p-7 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div
          style={{ transform: tilt.active ? 'translateZ(20px)' : 'translateZ(0px)' }}
          className="w-12 h-12 rounded-xl bg-[var(--bg-card-subtle)] flex items-center justify-center mb-5 transition-transform duration-200"
        >
          {icon}
        </div>
        <h3 className="font-display text-lg font-bold text-theme-primary mb-2">
          {title}
        </h3>
        <p className="text-sm text-theme-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export const WhyUsSection: React.FC = () => {
  const { t } = useLocale();

  const getReasonIcon = (id: string) => {
    switch (id) {
      case 'mobile-first':
        return <Smartphone className="w-6 h-6 text-cyan-500" />;
      case 'fast-performance':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'single-partner':
        return <Sparkles className="w-6 h-6 text-sky-500" />;
      case 'clear-comms':
        return <MessageSquare className="w-6 h-6 text-blue-500" />;
      case 'remote-collab':
        return <Globe2 className="w-6 h-6 text-teal-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-cyan-500" />;
    }
  };

  return (
    <section id="why-us" className="py-24 section-alt border-t border-[var(--border-subtle)] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
            {t.whyUs.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-theme-primary mb-4">
            {t.whyUs.title}
          </h2>
          <p className="text-base sm:text-lg text-theme-secondary">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* 5 Reasons Grid with 3D Depth Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.whyUs.reasons.map((reason) => (
            <DepthCard
              key={reason.id}
              icon={getReasonIcon(reason.id)}
              title={reason.title}
              description={reason.description}
            >
              {null}
            </DepthCard>
          ))}
        </div>
      </div>
    </section>
  );
};
