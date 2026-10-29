import React from 'react';
import { AnalysisData } from '../types';
import { PhoneCall, Users, Smartphone, HelpCircle, Layers } from 'lucide-react';

interface VoipStepProps {
  data: AnalysisData;
  updateFields: (fields: Partial<AnalysisData>) => void;
}

export const VoipStep: React.FC<VoipStepProps> = ({ data, updateFields }) => {
  const lineTypeOptions = ['ISDN', 'Analogica', 'VoIP', 'Mobile', 'Nessuna'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#e05a00] text-white font-heading font-black text-2xl px-3 py-1 rounded-xl shadow-lg">
          4/4
        </div>
        <div>
          <h2 className="text-2xl font-heading font-black text-white leading-none">Telefonia VoIP</h2>
          <p className="text-sm text-neutral-400 mt-1">Interni, numeri e mobilità per il centralino.</p>
        </div>
      </div>

      <div className="h-[1px] bg-neutral-800 w-full mb-6" />

      {/* Main VoIP question */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Il cliente ha o vuole interni VoIP?
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'si', label: 'Sì' },
            { id: 'no', label: 'No' },
            { id: 'forse', label: 'Da valutare' },
          ].map((item) => {
            const active = data.voip === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateFields({ voip: active ? '' : (item.id as any) })}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#c75000] text-white border-[#fe6601] shadow-lg'
                    : 'bg-[#0d0f13] text-neutral-300 border-[#646b78] hover:border-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional 3CX Sizing Group */}
      {data.voip !== 'no' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Steppers: Interni & Numerazioni */}
          <div className="space-y-6">
            {/* Stepper Interni */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label className="block text-sm font-bold text-white">
                Quanti interni telefonici?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateFields({ interni: Math.max(0, (data.interni || 0) - 1) })}
                  className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#303746] text-[#fe6601] font-black text-2xl hover:bg-[#252b37] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  value={data.interni || 0}
                  onChange={(e) =>
                    updateFields({ interni: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  className="w-20 h-12 bg-[#0d0f13] border border-[#303746] rounded-xl text-center font-black text-white text-xl focus:outline-none focus:border-[#fe6601]"
                />
                <button
                  type="button"
                  onClick={() => updateFields({ interni: (data.interni || 0) + 1 })}
                  className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#303746] text-[#fe6601] font-black text-2xl hover:bg-[#252b37] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stepper Numerazioni */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label className="block text-sm font-bold text-white">
                Quante numerazioni / linee esistenti?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateFields({ numeri: Math.max(0, (data.numeri || 0) - 1) })}
                  className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#303746] text-[#fe6601] font-black text-2xl hover:bg-[#252b37] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  value={data.numeri || 0}
                  onChange={(e) =>
                    updateFields({ numeri: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  className="w-20 h-12 bg-[#0d0f13] border border-[#303746] rounded-xl text-center font-black text-white text-xl focus:outline-none focus:border-[#fe6601]"
                />
                <button
                  type="button"
                  onClick={() => updateFields({ numeri: (data.numeri || 0) + 1 })}
                  className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#303746] text-[#fe6601] font-black text-2xl hover:bg-[#252b37] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Portabilità Question */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Numeri da mantenere (portabilità)?
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
                    onClick={() =>
                      updateFields({ portabilita: data.portabilita === item.id ? '' : (item.id as any) })
                    }
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                      data.portabilita === item.id
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

          {/* Lines, Phones & Mobility */}
          <div className="space-y-6">
            {/* Current Lines */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Linee telefoniche attuali
              </label>
              <div className="flex flex-wrap gap-3">
                {lineTypeOptions.map((opt) => {
                  const active = (data.lineeOggi || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        let current = [...(data.lineeOggi || [])];
                        if (opt === 'Nessuna') {
                          current = current.includes(opt) ? [] : [opt];
                        } else {
                          current = current.filter((x) => x !== 'Nessuna');
                          if (current.includes(opt)) {
                            current = current.filter((x) => x !== opt);
                          } else {
                            current.push(opt);
                          }
                        }
                        updateFields({ lineeOggi: current });
                      }}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
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

            {/* Phones Status */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Telefoni
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'ip', label: 'Già IP / riutilizzabili' },
                  { id: 'nuovi', label: 'Da acquistare' },
                  { id: 'nv', label: 'Non so' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      updateFields({ telefoni: data.telefoni === item.id ? '' : (item.id as any) })
                    }
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                      data.telefoni === item.id
                        ? 'bg-[#c75000] text-white border-[#fe6601]'
                        : 'bg-[#0d0f13] text-neutral-300 border-[#646b78]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobility App */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Serve rispondere fuori sede con app?
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'si', label: 'Sì' },
                  { id: 'no', label: 'No' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      updateFields({ mobilita: data.mobilita === item.id ? '' : (item.id as any) })
                    }
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${
                      data.mobilita === item.id
                        ? 'bg-[#c75000] text-white border-[#fe6601]'
                        : 'bg-[#0d0f13] text-neutral-300 border-[#646b78]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reparti */}
            <div>
              <label htmlFor="reparti" className="block text-sm font-bold text-white mb-2">
                Reparti / gruppi di risposta
              </label>
              <input
                type="text"
                id="reparti"
                value={data.reparti || ''}
                onChange={(e) => updateFields({ reparti: e.target.value })}
                placeholder="Es. vendite, assistenza, amministrazione"
                className="w-full p-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
              />
            </div>

            {/* Note */}
            <div>
              <label htmlFor="note_voip" className="block text-sm font-bold text-white mb-2">
                Note sulla telefonia
              </label>
              <textarea
                id="note_voip"
                rows={2}
                value={data.note_voip || ''}
                onChange={(e) => updateFields({ note_voip: e.target.value })}
                className="w-full p-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601] resize-y"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
