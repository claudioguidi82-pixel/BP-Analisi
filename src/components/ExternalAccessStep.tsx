import React from 'react';
import { AnalysisData } from '../types';
import { Globe, Lock, Info } from 'lucide-react';

interface ExternalAccessStepProps {
  data: AnalysisData;
  updateFields: (fields: Partial<AnalysisData>) => void;
}

export const ExternalAccessStep: React.FC<ExternalAccessStepProps> = ({ data, updateFields }) => {
  const externalOptions = [
    'VPN / smart working',
    'Server o gestionale',
    'Telecamere / DVR',
    'Centralino / app telefono',
    'Niente',
  ];

  const needsFixed =
    (data.esterno || []).includes('VPN / smart working') ||
    (data.esterno || []).includes('Server o gestionale') ||
    data.ipRichiesto === 'si';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#e05a00] text-white font-heading font-black text-2xl px-3 py-1 rounded-xl shadow-lg">
          3/4
        </div>
        <div>
          <h2 className="text-2xl font-heading font-black text-white leading-none">Accessi esterni</h2>
          <p className="text-sm text-neutral-400 mt-1">Serve a decidere tra IP fisso e DynDNS.</p>
        </div>
      </div>

      <div className="h-[1px] bg-neutral-800 w-full mb-6" />

      {/* External Reachability */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Cosa deve essere raggiungibile da fuori sede?
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          {externalOptions.map((opt) => {
            const active = (data.esterno || []).includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  let current = [...(data.esterno || [])];
                  if (opt === 'Niente') {
                    current = current.includes(opt) ? [] : [opt];
                  } else {
                    current = current.filter((x) => x !== 'Niente');
                    if (current.includes(opt)) {
                      current = current.filter((x) => x !== opt);
                    } else {
                      current.push(opt);
                    }
                  }
                  updateFields({ esterno: current });
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

      {/* IP Static Requirement */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Il cliente ha già un IP fisso o lo richiede?
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'si', label: 'Sì' },
            { id: 'no', label: 'No' },
            { id: 'nv', label: 'Non so' },
          ].map((item) => {
            const active = data.ipRichiesto === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  updateFields({ ipRichiesto: active ? '' : (item.id as any) })
                }
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#c75000] text-white border-[#fe6601]'
                    : 'bg-[#0d0f13] text-neutral-300 border-[#646b78]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Architectural Helper */}
        <div className="p-4 rounded-xl bg-[#1a1d23] border border-neutral-800 text-sm text-neutral-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
            <Info className="w-4 h-4 text-[#fe6601]" />
            <span>Info</span>
          </div>
          <p className="leading-relaxed">
            {needsFixed ? (
              <span className="text-[#ff8c2e]">
                L’IP fisso è consigliato per VPN e smart working.
              </span>
            ) : (
              <span>
                Per accessi occasionali (telecamere/centralino) un hostname <strong>DynDNS</strong> può essere sufficiente.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Notes on External Access */}
      <div className="space-y-2">
        <label htmlFor="note_ip" className="block text-sm font-bold text-white mb-2">
          Note sugli accessi
        </label>
        <textarea
          id="note_ip"
          rows={3}
          value={data.note_ip}
          onChange={(e) => updateFields({ note_ip: e.target.value })}
          className="w-full p-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601] resize-y"
        />
      </div>
    </div>
  );
};
