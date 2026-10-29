import React from 'react';
import { LOGO_SYSTEM_BYTE, LOGO_WINDTRE_BP } from '../data/assets';
import { PlusCircle } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onNewAnalysis: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewAnalysis }) => {
  return (
    <header className="relative bg-black overflow-hidden select-none z-50">
      {/* Background orange geometric corner */}
      <svg
        className="absolute right-0 top-0 h-full w-24 md:w-36 pointer-events-none opacity-100 z-0"
        viewBox="0 0 70 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M70 0 L52 0 C46 30 30 58 0 80 L70 80Z" fill="#fe6601" />
        <path d="M70 0 L64 0 C60 34 46 60 22 80 L70 80Z" fill="#ff8c2e" opacity="0.7" />
      </svg>

      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between relative z-10 min-h-[78px]">
        {/* Brand Logos */}
        <div className="flex items-center gap-4">
          <img
            src={LOGO_SYSTEM_BYTE}
            alt="System Byte"
            className="h-9 sm:h-10 w-auto object-contain mix-blend-lighten"
          />
          <div className="h-10 w-[1px] bg-neutral-800 hidden sm:block mx-2" />
          <img
            src={LOGO_WINDTRE_BP}
            alt="WINDTRE Business Partner"
            className="h-12 sm:h-14 w-auto object-contain mix-blend-lighten"
          />
        </div>

        {/* Action buttons (compact for history/new) */}
        <div className="flex items-center gap-2 pr-4 sm:pr-8">
          <PWAInstallButton />
          <button
            onClick={onNewAnalysis}
            className="p-2 rounded-lg bg-neutral-900/50 text-neutral-300 border border-neutral-800 hover:text-white transition-colors"
            title="Nuova"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
