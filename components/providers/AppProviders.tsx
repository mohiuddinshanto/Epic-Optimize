'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '../../context/ThemeContext';
import { LocaleProvider } from '../../context/LocaleContext';
import { CursorGlow } from '../ui/CursorGlow';

const Background3DCanvas = dynamic(
  () => import('../3d/Background3DCanvas').then((mod) => mod.Background3DCanvas),
  { ssr: false }
);

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LocaleProvider>
        {/* Background 3D Node Field and Cursor Glow */}
        <Background3DCanvas />
        <CursorGlow />
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
};
