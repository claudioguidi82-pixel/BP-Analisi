import React from 'react';
import { ChevronRight } from 'lucide-react';
import { LOGO_3CX, LOGO_FRITZ, LOGO_WINDTRE_BP } from '../data/assets';

interface IntroStepProps {
  onStart: () => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({ onStart }) => {
  return (
    <div className="space-y-6 animate-fadeIn pt-2">
      {/* Welcome Message Card */}
      <div className="bg-[#1a1d24] rounded-2xl p-6 border border-[#2d3444] shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-white leading-[1.1] mb-4">
          Il cliente ha una rete <br /> complessa? <br />
          <span className="text-[#fe6601]">Non è un limite.</span>
        </h2>
        
        <p className="text-base text-neutral-400 mb-4 leading-relaxed font-medium">
          È un'opportunità per offrire una soluzione più completa.
        </p>

        <p className="text-sm text-neutral-300 leading-relaxed">
          <strong className="text-white font-bold">Con System Byte:</strong> connettività ridondata, protezione della rete e telefonia evoluta con 3CX.
        </p>
      </div>

      {/* Partner Grid - 3 Column Layout */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#12141a] border border-[#2d3444] rounded-2xl py-5 px-2 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-black rounded-xl mb-3 flex items-center justify-center border border-[#2d3444] overflow-hidden">
            <img src={LOGO_3CX} alt="3CX" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-tight leading-tight">Centralino</span>
        </div>

        <div className="bg-[#12141a] border border-[#2d3444] rounded-2xl py-5 px-2 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-black rounded-xl mb-3 flex items-center justify-center border border-[#2d3444] overflow-hidden">
            <img src={LOGO_FRITZ} alt="FRITZ!" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-tight leading-tight">
            Router e <br /> connettività
          </span>
        </div>

        <div className="bg-[#12141a] border border-[#2d3444] rounded-2xl py-5 px-2 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-black rounded-xl mb-3 flex items-center justify-center border border-[#2d3444] overflow-hidden">
            <img src={LOGO_WINDTRE_BP} alt="WINDTRE" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-tight leading-tight">
            Canale <br /> commerciale
          </span>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="space-y-4 pt-4 pb-2">
        <h3 className="text-2xl font-heading font-black text-white leading-tight">
          Ascolta • Analizza • Progetta
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Rispondi alle domande insieme al cliente: alla fine l'app prepara il progetto da inviare a System Byte per il preventivo.
        </p>
      </div>

      {/* Progettazione Card */}
      <div className="bg-[#1a1d24] rounded-2xl p-5 border border-[#fe6601]/40 shadow-lg text-center">
        <p className="text-sm font-bold text-white leading-relaxed">
          Tu segui il cliente. System Byte ti aiuta a progettare la soluzione.
        </p>
      </div>

      {/* Brands Disclaimer */}
      <p className="text-[10px] text-neutral-500 leading-normal px-2">
        I marchi WINDTRE, 3CX e FRITZ! appartengono ai rispettivi titolari. Disponibilità, compatibilità, copertura, costi e condizioni vanno confermati in fase di analisi.
      </p>

      {/* Main CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4.5 px-6 rounded-2xl font-heading font-black text-xl text-white bg-gradient-to-r from-[#ea5e00] to-[#fe6601] shadow-[0_4px_20px_rgba(234,94,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Inizia l'analisi</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
