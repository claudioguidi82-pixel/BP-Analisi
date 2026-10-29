import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fe6601]/10 border border-[#fe6601]/30 text-[#fe6601] hover:bg-[#fe6601]/20 transition-all text-xs font-bold"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installa App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fe6601]/10 border border-[#fe6601]/30 text-[#fe6601] hover:bg-[#fe6601]/20 transition-all text-xs font-bold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Installa App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-[#12151c] border border-[#2d3444] p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#fe6601]/20">
                  <Download className="w-6 h-6 text-[#fe6601]" />
                </div>
                <h3 className="text-lg font-heading font-black text-white">Installa su iPhone</h3>
              </div>
              
              <div className="space-y-4 py-2">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <p className="text-sm text-neutral-300">
                    Tocca il tasto <span className="inline-flex items-center justify-center p-1 bg-neutral-800 rounded mx-1"><Share className="w-3.5 h-3.5 text-blue-500" /></span> <strong>Condividi</strong> nella barra di Safari.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <p className="text-sm text-neutral-300">
                    Scorri verso il basso e tocca <strong>Aggiungi alla schermata Home</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-3 rounded-xl bg-neutral-800 text-white font-bold hover:bg-neutral-700 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
