import { ArrowRight } from 'lucide-react';
import { AnalysisData } from '../types';
import { LOGO_3CX, LOGO_FRITZ, LOGO_WINDTRE_RETAIL } from '../data/assets';

interface IntroStepProps {
  onStart: () => void;
  data: AnalysisData;
  onClear: () => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({ onStart, data, onClear }) => {
  return (
    <div className="space-y-8 animate-fadeIn pt-4">
      {/* Welcome Message Card */}
      <div className="bg-[#1a1d24] rounded-2xl p-6 border border-neutral-800 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-white leading-tight mb-2">
          Il cliente ha una rete <br /> complessa? <br />
          <span className="text-[#fe6601]">Non è un limite.</span>
        </h2>
        
        <p className="text-base text-neutral-300 mb-4 leading-relaxed">
          È un'opportunità per offrire una soluzione più completa.
        </p>

        <div className="space-y-4">
          <p className="text-sm text-neutral-300 leading-relaxed">
            <strong className="text-white font-bold">Con System Byte:</strong> connettività ridondata, protezione della rete e telefonia evoluta con 3CX.
          </p>
        </div>
      </div>

      {/* Partner Grid - Large Tiles */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
        <div className="bg-[#12141a] border border-neutral-800 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-[#fe6601]/50 transition-colors">
          <div className="w-16 h-16 bg-neutral-900 rounded-xl mb-3 flex items-center justify-center border border-neutral-800 group-hover:border-[#fe6601]/30 overflow-hidden">
            <img src={LOGO_3CX} alt="3CX" className="w-12 h-12 object-contain" />
          </div>
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">Centralino</span>
        </div>

        <div className="bg-[#12141a] border border-neutral-800 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-[#fe6601]/50 transition-colors">
          <div className="w-16 h-16 bg-neutral-900 rounded-xl mb-3 flex items-center justify-center border border-neutral-800 group-hover:border-[#fe6601]/30 overflow-hidden">
            <img src={LOGO_FRITZ} alt="FRITZ!" className="w-12 h-12 object-contain scale-110" />
          </div>
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide leading-tight">
            Router e <br /> connettività
          </span>
        </div>

        <div className="bg-[#12141a] border border-neutral-800 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-[#fe6601]/50 transition-colors">
          <div className="w-16 h-16 bg-neutral-900 rounded-xl mb-3 flex items-center justify-center border border-neutral-800 group-hover:border-[#fe6601]/30 overflow-hidden">
            <img src={LOGO_WINDTRE_RETAIL} alt="WINDTRE" className="w-12 h-12 object-contain" />
          </div>
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide leading-tight">
            Canale <br /> commerciale
          </span>
        </div>
      </div>

      {/* Main CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl font-heading font-black text-xl text-white bg-gradient-to-r from-[#ea5e00] to-[#fe6601] hover:from-[#f06708] hover:to-[#ff7b1e] shadow-[0_4px_20px_rgba(234,94,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <span>INIZIA L'ANALISI</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <p className="text-[11px] text-neutral-500 text-center leading-normal max-w-xs mx-auto">
        Strumento riservato ai Business Partner e Negozi WINDTRE per la valutazione tecnica della rete cliente.
      </p>
    </div>
  );
};
