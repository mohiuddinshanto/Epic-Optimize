'use client';

import React, { useRef, useState } from 'react';
import { useLocale } from '../../context/LocaleContext';

interface DepthCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  maxTilt?: number;
}

export const DepthCard: React.FC<DepthCardProps> = ({
  icon,
  title,
  description,
  className = '',
  maxTilt = 10,
}) => {
  const { t } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * maxTilt, ry: x * maxTilt, active: true });
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
      className={`card-theme card-theme-hover p-7 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between ${className}`}
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

      <div className="pt-6 mt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
        <span>{t.common.enterpriseStandard}</span>
      </div>
    </div>
  );
};
