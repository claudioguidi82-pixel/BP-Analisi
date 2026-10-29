import React from 'react';
import { AnalysisData } from '../types';
import { Building2, User, Phone, Mail, Store, CreditCard, Briefcase, MapPin } from 'lucide-react';

interface CustomerStepProps {
  data: AnalysisData;
  updateFields: (fields: Partial<AnalysisData>) => void;
  errorField?: string | null;
}

export const CustomerStep: React.FC<CustomerStepProps> = ({ data, updateFields, errorField }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#e05a00] text-white font-heading font-black text-2xl px-3 py-1 rounded-xl shadow-lg">
          1/4
        </div>
        <div>
          <h2 className="text-2xl font-heading font-black text-white leading-none">Dati cliente</h2>
          <p className="text-sm text-neutral-400 mt-1">Chi è il cliente e chi lo segue.</p>
        </div>
      </div>

      <div className="h-[1px] bg-neutral-800 w-full mb-6" />

      {/* Customer Information Group */}
      <div className="space-y-6">
        {/* Ragione Sociale (Mandatory) */}
        <div>
          <label
            htmlFor="azienda"
            className="block text-sm font-bold text-white mb-2"
          >
            Ragione sociale cliente W3 <span className="text-[#fe6601]">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
              <Building2 className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="azienda"
              value={data.azienda}
              onChange={(e) => updateFields({ azienda: e.target.value })}
              placeholder="Inserisci la ragione sociale"
              className={`w-full pl-12 pr-4 py-4 bg-[#0d0f13] border rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all ${
                errorField === 'azienda'
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-[#2d3340] focus:border-[#fe6601] focus:ring-[#fe6601]/25'
              }`}
            />
          </div>
          {errorField === 'azienda' && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <span>!</span> È necessario inserire la ragione sociale del cliente per procedere.
            </p>
          )}
        </div>

        {/* Referente */}
        <div>
          <label htmlFor="referente" className="block text-sm font-bold text-white mb-2">
            Referente del cliente
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="referente"
              value={data.referente}
              onChange={(e) => updateFields({ referente: e.target.value })}
              placeholder="Nome e cognome del referente"
              className="w-full pl-12 pr-4 py-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
            />
          </div>
        </div>

        {/* Telefono */}
        <div>
          <label htmlFor="telCliente" className="block text-sm font-bold text-white mb-2">
            Telefono cliente
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              id="telCliente"
              value={data.telCliente}
              onChange={(e) => updateFields({ telCliente: e.target.value })}
              placeholder="Inserisci il numero di telefono"
              className="w-full pl-12 pr-4 py-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="emailCliente" className="block text-sm font-bold text-white mb-2">
            Email cliente
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              id="emailCliente"
              value={data.emailCliente}
              onChange={(e) => updateFields({ emailCliente: e.target.value })}
              placeholder="Inserisci l'email del cliente"
              className="w-full pl-12 pr-4 py-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
            />
          </div>
        </div>

        {/* Negozio */}
        <div>
          <label htmlFor="negozio" className="block text-sm font-bold text-white mb-2">
            Ragione sociale negozio WINDTRE
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
              <Store className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="negozio"
              value={data.negozio}
              onChange={(e) => updateFields({ negozio: e.target.value })}
              placeholder="Inserisci la ragione sociale del negozio"
              className="w-full pl-12 pr-4 py-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
            />
          </div>
        </div>

        {/* Codice POS */}
        <div>
          <label htmlFor="pos" className="block text-sm font-bold text-white mb-2">
            POS
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
              <CreditCard className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="pos"
              value={data.pos}
              onChange={(e) => updateFields({ pos: e.target.value })}
              placeholder="Codice POS del negozio"
              className="w-full pl-12 pr-4 py-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* BP Nome */}
          <div>
            <label htmlFor="bpNome" className="block text-sm font-bold text-white mb-2">
              Nominativo BP
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                id="bpNome"
                value={data.bpNome}
                onChange={(e) => updateFields({ bpNome: e.target.value })}
                placeholder="Nome e cognome del BP"
                className="w-full pl-12 pr-4 py-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
              />
            </div>
          </div>

          {/* BP Recapito */}
          <div>
            <label htmlFor="bpRecapito" className="block text-sm font-bold text-white mb-2">
              Recapito BP
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="text"
                id="bpRecapito"
                value={data.bpRecapito}
                onChange={(e) => updateFields({ bpRecapito: e.target.value })}
                placeholder="Telefono o email del BP"
                className="w-full pl-12 pr-4 py-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
              />
            </div>
          </div>
        </div>

        {/* Sedi Stepper */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <label className="block text-sm font-bold text-white">
              Quante sedi ha il cliente?
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateFields({ sedi: Math.max(1, (data.sedi || 1) - 1) })}
              className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#303746] text-[#fe6601] font-black text-2xl hover:bg-[#252b37] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={data.sedi || 1}
              onChange={(e) => updateFields({ sedi: Math.max(1, parseInt(e.target.value, 10) || 1) })}
              className="w-20 h-12 bg-[#0d0f13] border border-[#303746] rounded-xl text-center font-black text-white text-xl focus:outline-none focus:border-[#fe6601]"
            />
            <button
              type="button"
              onClick={() => updateFields({ sedi: (data.sedi || 1) + 1 })}
              className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#303746] text-[#fe6601] font-black text-2xl hover:bg-[#252b37] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Settore */}
        <div>
          <label htmlFor="settore" className="block text-sm font-bold text-white mb-2">
            Settore / attività
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fe6601]">
              <Briefcase className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="settore"
              value={data.settore}
              onChange={(e) => updateFields({ settore: e.target.value })}
              placeholder="Es. ristorazione, studio medico..."
              className="w-full pl-12 pr-4 py-4 bg-[#0d0f13] border border-[#2d3340] rounded-[10px] text-base text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe6601]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
