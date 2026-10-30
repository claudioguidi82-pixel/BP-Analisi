import React, { useState, useEffect } from 'react';
import { AnalysisData } from './types';
import { INITIAL_DATA, analyzeProposal } from './utils/engine';
import { Header } from './components/Header';
import { StepProgress } from './components/StepProgress';
import { IntroStep } from './components/IntroStep';
import { CustomerStep } from './components/CustomerStep';
import { NetworkStep } from './components/NetworkStep';
import { ExternalAccessStep } from './components/ExternalAccessStep';
import { VoipStep } from './components/VoipStep';
import { ProposalStep } from './components/ProposalStep';
import { BottomBar } from './components/BottomBar';

const DRAFT_KEY = 'sb_analisi_active_draft_v2';

import { Hero } from './components/Hero';
import { Analytics } from './utils/analytics';

const STEP_NAMES = [
  'Introduzione',
  'Dati Cliente',
  'Rete e Connettività',
  'Accessi Esterni e IP',
  'Telefonia VoIP e 3CX',
  'Progetto e Riepilogo',
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [data, setData] = useState<AnalysisData>(INITIAL_DATA);
  const [errorField, setErrorField] = useState<string | null>(null);

  // Track step views
  useEffect(() => {
    Analytics.trackStep(currentStep, STEP_NAMES[currentStep] || `Step ${currentStep}`, data.azienda);
    if (currentStep === 5 && data.azienda) {
      Analytics.trackProposalGenerated({
        customer: data.azienda,
        hasDualLine: data.doppia === 'si',
        hasVoip: data.voip === 'si' || (data.voip !== 'no' && (data.interni || 0) > 0),
        interni: data.interni || 0,
        pcCount: data.pc || 0,
      });
    }
  }, [currentStep]);

  // Load active draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.data) {
          setData(parsed.data);
          if (typeof parsed.step === 'number') {
            setCurrentStep(parsed.step);
          }
        }
      }
    } catch (e) {
      console.error('Error loading saved analysis data', e);
    }
  }, []);

  // Save active draft whenever data or step changes
  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          data,
          step: currentStep,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error('Error writing draft', e);
    }
  }, [data, currentStep]);

  const updateFields = (fields: Partial<AnalysisData>) => {
    setData((prev) => ({ ...prev, ...fields }));
    if (fields.azienda && errorField === 'azienda') {
      setErrorField(null);
    }
  };

  const safeScrollToTop = () => {
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      try {
        window.scrollTo(0, 0);
      } catch {}
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      safeScrollToTop();
      return;
    }

    if (currentStep === 1) {
      // Validate customer company name
      if (!data.azienda.trim()) {
        setErrorField('azienda');
        const el = document.getElementById('azienda');
        if (el) {
          try {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus();
          } catch {
            el.focus();
          }
        }
        return;
      }
      setErrorField(null);
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      safeScrollToTop();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      safeScrollToTop();
    }
  };

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Reset form without native confirm dialog
  const executeReset = () => {
    Analytics.trackNewAnalysisReset();
    setData(INITIAL_DATA);
    setCurrentStep(0);
    setErrorField(null);
    setIsResetConfirmOpen(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    safeScrollToTop();
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const analysisResult = analyzeProposal(data);

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f4f5f7] flex flex-col font-sans">
      <Header
        onNewAnalysis={handleReset}
      />

      {/* Progress line (only for steps 1-4) */}
      {currentStep > 0 && currentStep < 5 && (
        <StepProgress currentStep={currentStep} totalSteps={4} />
      )}

      {/* Hero section with main title */}
      {currentStep < 5 && <Hero />}

      <main 
        className={`flex-1 relative z-10 w-full max-w-4xl mx-auto bg-[#121418] rounded-t-[22px] border-t-2 border-[#fe6601] shadow-[0_-6px_18px_rgba(0,0,0,0.45)] px-4 sm:px-6 py-6 pb-32 ${
          currentStep < 5 ? '-mt-4' : 'mt-6'
        }`}
      >
        {currentStep === 0 && (
          <IntroStep
            onStart={() => {
              setCurrentStep(1);
              safeScrollToTop();
            }}
          />
        )}

        {currentStep === 1 && (
          <CustomerStep
            data={data}
            updateFields={updateFields}
            errorField={errorField}
          />
        )}

        {currentStep === 2 && (
          <NetworkStep
            data={data}
            updateFields={updateFields}
          />
        )}

        {currentStep === 3 && (
          <ExternalAccessStep
            data={data}
            updateFields={updateFields}
          />
        )}

        {currentStep === 4 && (
          <VoipStep
            data={data}
            updateFields={updateFields}
          />
        )}

        {currentStep === 5 && (
          <ProposalStep
            data={data}
            analysis={analysisResult}
            onEdit={() => {
              setCurrentStep(1);
              safeScrollToTop();
            }}
            onNew={handleReset}
          />
        )}
      </main>

      <BottomBar
        currentStep={currentStep}
        totalSteps={5}
        onBack={handleBack}
        onNext={handleNext}
      />

      {/* In-app Reset Confirmation Modal (safe for iframes) */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12151c] border border-[#2d3444] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-heading font-bold text-white">
              Iniziare una nuova analisi?
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              I dati attuali andranno persi. Vuoi procedere?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1a1e27] text-neutral-300 hover:text-white border border-[#2e3544]"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={executeReset}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#fe6601] hover:bg-[#ff7b1e] text-white shadow"
              >
                Sì, ricomincia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
