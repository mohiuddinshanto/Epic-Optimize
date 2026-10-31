import React, { useRef, useState } from 'react';
import { Code2, Search, Target, TrendingUp, Palette, ArrowUpRight } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

// 3D Tilt Card with dynamic glare and elevated icon-in-depth layer
const TiltCard: React.FC<{
  children: (props: { iconTransform: string }) => React.ReactNode;
  className?: string;
  isFeatured?: boolean;
}> = ({ children, className = '', isFeatured = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 14;
    const rotateY = (x - 0.5) * 14;
    setTilt({
      rotateX,
      rotateY,
      glareX: x * 100,
      glareY: y * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(8px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-2xl p-7 transition-all duration-300 group overflow-hidden ${className}`}
    >
      {/* Dynamic Glare Overlay */}
      {tilt.active && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-20 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, ${
              isFeatured ? 0.25 : 0.18
            }), transparent 60%)`,
          }}
        />
      )}
      {children({
        iconTransform: tilt.active ? 'translateZ(24px)' : 'translateZ(0px)',
      })}
    </div>
  );
};

export const ServicesSection: React.FC = () => {
  const { t } = useLocale();

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'web-dev':
        return <Code2 className="w-6 h-6 text-cyan-500" />;
      case 'seo':
        return <Search className="w-6 h-6 text-sky-500" />;
      case 'digital-ads':
        return <Target className="w-6 h-6 text-blue-500" />;
      case 'digital-marketing':
        return <TrendingUp className="w-6 h-6 text-indigo-500" />;
      case 'brand-identity':
        return <Palette className="w-6 h-6 text-teal-500" />;
      default:
        return <Code2 className="w-6 h-6 text-cyan-500" />;
    }
  };

  const handleConsultService = (serviceTitle: string) => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const select = document.querySelector('select[name="service"]') as HTMLSelectElement | null;
      if (select) {
        select.value = serviceTitle;
      }
    }
  };

  return (
    <section id="services" className="py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
            {t.services.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-theme-primary mb-4">
            {t.services.title}
          </h2>
          <p className="text-base sm:text-lg text-theme-secondary">
            {t.services.subtitle}
          </p>
        </div>

        {/* 5 Service Cards Grid with 3D Tilt and Glare */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.services.items.map((service, index) => {
            const isFeatured = index === 0;
            return (
              <TiltCard
                key={service.id}
                isFeatured={isFeatured}
                className={
                  isFeatured
                    ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-cyan-500/30 shadow-xl shadow-cyan-950/20 hover:shadow-cyan-500/20'
                    : 'card-theme card-theme-hover shadow-sm hover:shadow-xl hover:shadow-cyan-500/10'
                }
              >
                {({ iconTransform }) => (
                  <div className="flex flex-col h-full justify-between" style={{ transformStyle: 'preserve-3d' }}>
                    <div>
                      {/* Icon & Action Header with 3D Icon-in-Depth elevation */}
                      <div className="flex items-center justify-between mb-6">
                        <div
                          style={{
                            transform: iconTransform,
                            transition: 'transform 0.15s ease-out',
                          }}
                          className={`p-3 rounded-xl shadow-sm ${
                            isFeatured ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[var(--bg-card-subtle)] text-cyan-500'
                          }`}
                        >
                          {getServiceIcon(service.id)}
                        </div>
                        <button
                          onClick={() => handleConsultService(service.title)}
                          className="p-2 rounded-lg text-theme-muted hover:text-cyan-500 transition-colors cursor-pointer"
                          aria-label={`Consult for ${service.title}`}
                        >
                          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>

                      {/* Content */}
                      <h3
                        className={`font-display text-xl font-bold mb-3 ${
                          isFeatured ? 'text-white' : 'text-theme-primary'
                        }`}
                      >
                        {service.title}
                      </h3>

                      <p
                        className={`text-sm leading-relaxed mb-6 ${
                          isFeatured ? 'text-slate-300' : 'text-theme-secondary'
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>

                    {/* Tech & Service Tags */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border-subtle)]">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                            isFeatured
                              ? 'bg-slate-800 text-cyan-200'
                              : 'bg-[var(--bg-card-subtle)] text-theme-secondary'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
