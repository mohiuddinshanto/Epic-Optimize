'use client';

import React, { useRef, useState } from 'react';

interface TiltCardRenderProps {
  iconTransform: string;
}

interface TiltCardProps {
  children: ((props: TiltCardRenderProps) => React.ReactNode) | React.ReactNode;
  className?: string;
  isFeatured?: boolean;
  maxTilt?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  isFeatured = false,
  maxTilt = 14,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    active: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * maxTilt;
    const rotateY = (x - 0.5) * maxTilt;
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
        transition: tilt.active
          ? 'transform 0.1s ease-out'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-2xl transition-all duration-300 group overflow-hidden ${className}`}
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
      {typeof children === 'function'
        ? children({
            iconTransform: tilt.active ? 'translateZ(24px)' : 'translateZ(0px)',
          })
        : children}
    </div>
  );
};
