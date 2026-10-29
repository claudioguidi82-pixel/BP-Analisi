import React from 'react';
import { AnalysisData } from '../types';
import { Wifi, ShieldAlert, Cpu, Server, Check } from 'lucide-react';

interface NetworkStepProps {
  data: AnalysisData;
  updateFields: (fields: Partial<AnalysisData>) => void;
}

export const NetworkStep: React.FC<NetworkStepProps> = ({ data, updateFields }) => {
  const lineOptions = ['FTTH', 'FTTC', 'ADSL', 'FWA', 'Nessuna / non so'];

  const continuityOptions = [
    'POS / pagamenti',
    'Cloud / gestionale',
    'Telefoni',
    'Telecamere',
    'Server interni',
    'Niente di critico',
  ];

  const deviceOptions = [
    'POS',
    'Stampanti',
    'Server / NAS',
    'Access point Wi-Fi',
    'Telecamere / DVR',
    'Altro',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#e05a00] text-white font-heading font-black text-2xl px-3 py-1 rounded-xl shadow-lg">
          2/4
        </div>
        <div>
          <h2 className="text-2xl font-heading font-black text-white leading-none">Rete e connettività</h2>
          <p className="text-sm text-neutral-400 mt-1">Linee oggi attive e cosa deve restare sempre online.</p>
        </div>
      </div>

      <div className="h-[1px] bg-neutral-800 w-full mb-6" />

      {/* Primary Line Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-white mb-2">
          Che tipo di connessione ha attiva oggi il cliente?
        </label>
        <div className="flex flex-wrap gap-3">
          {lineOptions.map((opt) => {
            const active = data.lineaAttuale === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => updateFields({ lineaAttuale: active ? '' : opt })}
                className={`relative px-4 py-3 rounded-full text-sm font-bold transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#c75000] text-white border-[#fe6601] shadow-lg'
                    : 'bg-[#0d0f13] text-neutral-300 border-[#646b78] hover:border-white'
                }`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Line (Failover Backup) */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Vuole la doppia linea (connessione principale + linea di backup)?
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'si', label: 'Sì' },
            { id: 'no', label: 'No' },
            { id: 'forse', label: 'Da valutare' },
          ].map((item) => {
            const active = data.doppia === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateFields({ doppia: active ? '' : (item.id as any) })}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#c75000] text-white border-[#fe6601] shadow-lg'
                    : 'bg-[#0d0f13] text-neutral-300 border-[#646b78] hover:border-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Technical Callout if Yes */}
        {data.doppia === 'si' && (
          <div className="bg-[#1a1d23] border-l-4 border-[#fe6601] p-4 rounded-r-xl text-sm text-neutral-300">
            <strong className="text-white">Nota:</strong> Con doppia linea verrà preventivato un <strong>firewall</strong> per convogliare le due reti e bilanciare/commutare in caso di caduta di una linea.
          </div>
        )}

        {/* Sub-questions for Dual Line */}
        {(data.doppia === 'si' || data.doppia === 'forse') && (
          <div className="space-y-6 animate-fadeIn">
            <div className="h-[1px] bg-neutral-800 w-full" />
            
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Copertura FWA outdoor verificata?
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'si', label: 'Sì' },
                  { id: 'no', label: 'No' },
                  { id: 'nv', label: 'Da verificare' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateFields({ fwa: data.fwa === item.id ? '' : (item.id as any) })}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                      data.fwa === item.id
                        ? 'bg-[#c75000] text-white border-[#fe6601]'
                        : 'bg-[#0d0f13] text-neutral-300 border-[#646b78]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-3">
                FRITZ!Box già presenti?
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'si', label: 'Sì' },
                  { id: 'no', label: 'No' },
                  { id: 'nv', label: 'Non so' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateFields({ fritz: data.fritz === item.id ? '' : (item.id as any) })}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                      data.fritz === item.id
                        ? 'bg-[#c75000] text-white border-[#fe6601]'
                        : 'bg-[#0d0f13] text-neutral-300 border-[#646b78]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Continuity Requirements */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-white mb-2">
          Quali servizi vuoi che fossero sempre garantiti?
        </label>
        <div className="flex flex-wrap gap-3">
          {continuityOptions.map((opt) => {
            const active = (data.continuita || []).includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  let current = [...(data.continuita || [])];
                  if (opt === 'Niente di critico') {
                    current = current.includes(opt) ? [] : [opt];
                  } else {
                    current = current.filter((x) => x !== 'Niente di critico');
                    if (current.includes(opt)) {
                      current = current.filter((x) => x !== opt);
                    } else {
                      current.push(opt);
                    }
                  }
                  updateFields({ continuita: current });
                }}
                className={`px-4 py-3 rounded-full text-sm font-bold transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#c75000] text-white border-[#fe6601] shadow-lg'
                    : 'bg-[#0d0f13] text-neutral-300 border-[#646b78] hover:border-white'
                }`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Computers & Network Devices */}
      <div className="space-y-6">
        {/* Postazioni PC */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <label className="block text-sm font-bold text-white">
            Quanti PC / postazioni?
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateFields({ pc: Math.max(0, (data.pc || 0) - 1) })}
              className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#303746] text-[#fe6601] font-black text-2xl hover:bg-[#252b37] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              −
            </button>
            <input
              type="number"
              min="0"
              value={data.pc || 0}
              onChange={(e) => updateFields({ pc: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className="w-20 h-12 bg-[#0d0f13] border border-[#303746] rounded-xl text-center font-black text-white text-xl focus:outline-none focus:border-[#fe6601]"
            />
            <button
              type="button"
              onClick={() => updateFields({ pc: (data.pc || 0) + 1 })}
              className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#303746] text-[#fe6601] font-black text-2xl hover:bg-[#252b37] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Other Devices */}
        <div>
          <label className="block text-sm font-bold text-white mb-3">
            Altri dispositivi in rete
          </label>
          <div className="flex flex-wrap gap-3">
            {deviceOptions.map((opt) => {
              const active = (data.altriDisp || []).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const current = [...(data.altriDisp || [])];
                    if (current.includes(opt)) {
                      updateFields({ altriDisp: current.filter((x) => x !== opt) });
                    } else {
                      updateFields({ altriDisp: [...current, opt] });
                    }
                  }}
                  className={`px-4 py-3 rounded-full text-sm font-bold transition-all border ${
                    active
                      ? 'bg-[#c75000] text-white border-[#fe6601]'
                      : 'bg-[#0d0f13] text-neutral-300 border-[#646b78]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Existing Firewall */}
        <div>
          <label className="block text-sm font-bold text-white mb-3">
            Ha già un firewall?
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'si', label: 'Sì' },
              { id: 'no', label: 'No' },
              { id: 'nv', label: 'Non so' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  updateFields({ firewallEsist: data.firewallEsist === item.id ? '' : (item.id as any) })
                }
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${
                  data.firewallEsist === item.id
                    ? 'bg-[#c75000] text-white border-[#fe6601]'
                    : 'bg-[#0d0f13] text-neutral-300 border-[#646b78]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
