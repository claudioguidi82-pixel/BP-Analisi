import React from 'react';
import { LOGO_3CX, LOGO_FRITZ, LOGO_WINDTRE_RETAIL } from '../data/assets';

interface PartnerBadgesProps {
  mini?: boolean;
}

export const PartnerBadges: React.FC<PartnerBadgesProps> = ({ mini = false }) => {
  if (mini) {
    return (
      <div className="flex items-center justify-center gap-4 py-2 opacity-80">
        <div className="flex items-center gap-1.5 bg-[#14171d] px-2.5 py-1 rounded-lg border border-[#232731]">
          <img src={LOGO_3CX} alt="3CX" className="h-6 w-auto object-contain rounded" />
          <span className="text-[11px] font-semibold text-neutral-400">3CX</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#14171d] px-2.5 py-1 rounded-lg border border-[#232731]">
          <img src={LOGO_FRITZ} alt="FRITZ!" className="h-6 w-auto object-contain rounded" />
          <span className="text-[11px] font-semibold text-neutral-400">FRITZ!</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#14171d] px-2.5 py-1 rounded-lg border border-[#232731]">
          <img src={LOGO_WINDTRE_RETAIL} alt="WINDTRE" className="h-6 w-auto object-contain rounded" />
          <span className="text-[11px] font-semibold text-neutral-400">WINDTRE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
      <div className="bg-[#14171e] border border-[#262c37] hover:border-[#384152] transition-colors rounded-xl p-3.5 flex items-center sm:flex-col justify-center sm:text-center gap-3">
        <img
          src={LOGO_3CX}
          alt="3CX Phone System"
          className="h-10 w-auto object-contain rounded-md shrink-0"
        />
        <div>
          <div className="text-sm font-bold text-white tracking-wide">3CX</div>
          <div className="text-xs text-neutral-400">Centralino & Telefonia Cloud</div>
        </div>
      </div>

      <div className="bg-[#14171e] border border-[#262c37] hover:border-[#384152] transition-colors rounded-xl p-3.5 flex items-center sm:flex-col justify-center sm:text-center gap-3">
        <img
          src={LOGO_FRITZ}
          alt="AVM FRITZ!"
          className="h-10 w-auto object-contain rounded-md shrink-0"
        />
        <div>
          <div className="text-sm font-bold text-white tracking-wide">AVM FRITZ!</div>
          <div className="text-xs text-neutral-400">Router, Mesh & Backup FWA</div>
        </div>
      </div>

      <div className="bg-[#14171e] border border-[#262c37] hover:border-[#384152] transition-colors rounded-xl p-3.5 flex items-center sm:flex-col justify-center sm:text-center gap-3">
        <img
          src={LOGO_WINDTRE_RETAIL}
          alt="WINDTRE Canale Commerciale"
          className="h-10 w-auto object-contain rounded-md shrink-0"
        />
        <div>
          <div className="text-sm font-bold text-white tracking-wide">WINDTRE</div>
          <div className="text-xs text-neutral-400">Canale Commerciale & Rete</div>
        </div>
      </div>
    </div>
  );
};
