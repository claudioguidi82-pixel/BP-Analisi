import React, { useState } from 'react';
import { SavedAnalysis } from '../types';
import { X, FolderOpen, Trash2, Download, Building, Calendar, ArrowRight } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedAnalysis[];
  onSelect: (item: SavedAnalysis) => void;
  onDelete: (id: string) => void;
  onDownloadPdf: (item: SavedAnalysis) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onSelect,
  onDelete,
  onDownloadPdf,
}) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12151c] border border-[#2d3444] rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#252b37] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#fe6601]" />
            <h3 className="text-base font-heading font-bold text-white">
              Archivio Analisi Clienti ({savedList.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1f242e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {savedList.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Building className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold text-neutral-300">Nessuna analisi salvata</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Quando completi una scheda cliente, premi &quot;Salva Bozza&quot; per conservarla in archivio e
                consultarla in qualsiasi momento.
              </p>
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-[#0d0f13] border border-[#232731] hover:border-[#384152] transition-colors rounded-xl flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white truncate">
                      {item.clientName || 'Cliente senza nome'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#fe6601]/20 text-[#ff8c2e] border border-[#fe6601]/30 shrink-0">
                      {item.summaryBadge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString('it-IT')}
                    </span>
                    {item.data.referente && <span>Ref: {item.data.referente}</span>}
                    {item.data.bpNome && <span>BP: {item.data.bpNome}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {pendingDeleteId === item.id ? (
                    <div className="flex items-center gap-1 bg-red-950/40 p-1 rounded-lg border border-red-500/30">
                      <span className="text-[10px] text-red-300 font-medium px-1">Eliminare?</span>
                      <button
                        onClick={() => {
                          onDelete(item.id);
                          setPendingDeleteId(null);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white"
                      >
                        Sì
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(null)}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1e232d] text-neutral-300"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onDownloadPdf(item)}
                        title="Scarica PDF"
                        className="p-2 rounded-lg bg-[#181c24] border border-[#2b313f] text-neutral-300 hover:text-white hover:border-[#fe6601] transition-colors"
                      >
                        <Download className="w-4 h-4 text-[#fe6601]" />
                      </button>

                      <button
                        onClick={() => onSelect(item)}
                        title="Apri nel wizard"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#fe6601] hover:bg-[#ff7717] text-white text-xs font-bold transition-all shadow"
                      >
                        <span>Apri</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => setPendingDeleteId(item.id)}
                        title="Elimina"
                        className="p-2 rounded-lg bg-[#181c24] border border-[#2b313f] text-neutral-500 hover:text-red-400 hover:border-red-500/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#252b37] bg-[#0c0e12] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1a1e27] text-neutral-300 hover:text-white border border-[#2e3544]"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
