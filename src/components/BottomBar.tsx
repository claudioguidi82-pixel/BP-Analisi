import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface BottomBarProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled = false,
}) => {
  // Hide on step 5 (proposal has its own prominent action matrix)
  if (currentStep === 5) return null;

  const isFinalStep = currentStep === 4;

  return (
    <nav className="fixed left-0 right-0 bottom-0 z-40 bg-black/90 backdrop-blur-md pb-[calc(14px+env(safe-area-inset-bottom))] pt-4 px-4 overflow-hidden">
      {/* Decorative orange wave at the very bottom */}
      <svg
        className="absolute left-0 right-0 bottom-0 w-full h-10 pointer-events-none opacity-100 z-0"
        viewBox="0 0 400 46"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 46 L0 30 C80 46 150 14 230 26 C300 36 350 18 400 8 L400 46Z" fill="#fe6601" opacity="0.9" />
        <path d="M0 46 L0 40 C90 50 170 26 250 34 C320 41 360 30 400 24 L400 46Z" fill="#ff8c2e" />
      </svg>

      <div className="max-w-4xl mx-auto flex items-center gap-4 relative z-10">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 rounded-xl border-2 border-white text-white font-heading font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Indietro</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`flex-[1.2] py-4 rounded-xl font-heading font-black text-lg flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(234,94,0,0.4)] transition-all active:scale-[0.98] ${
            isNextDisabled
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#ea5e00] to-[#fe6601] text-white'
          }`}
        >
          <span>{currentStep === 0 ? "Inizia l'analisi" : (isFinalStep ? 'Genera progetto' : 'Avanti')}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
