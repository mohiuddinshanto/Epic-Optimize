import React from 'react';
import { SectionBadge } from './SectionBadge';

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-16 ${
        isCenter ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'
      } ${className}`}
    >
      {badge && (
        <div className="mb-4">
          <SectionBadge icon={badgeIcon}>{badge}</SectionBadge>
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-theme-primary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-theme-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
