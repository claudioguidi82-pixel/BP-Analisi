import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Users, Calendar, Activity, Eye, ShieldCheck } from 'lucide-react';
import { fetchLiveAccessStats, LiveAccessStats, COUNTER_NAMESPACE } from '../utils/analytics';

interface AccessStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessStatsModal: React.FC<AccessStatsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<LiveAccessStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveAccessStats();
      setStats(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#12151c] border border-[#2d3444] rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222938] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fe6601]/20 flex items-center justify-center text-[#fe6601]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Statistiche Accessi Reali
              </h3>
              <p className="text-[11px] text-neutral-400">
                CounterAPI live (senza chiavi API o cookie)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total */}
          <div className="bg-[#181d27] border border-[#283142] rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <Eye className="w-4 h-4 text-orange-400 mb-1 opacity-80" />
            <div className="text-2xl font-black text-white tracking-tight">
              {stats?.total !== null && stats?.total !== undefined ? stats.total : (loading ? '...' : '-')}
            </div>
            <div className="text-[10px] uppercase font-semibold text-neutral-400 mt-0.5">
              Totale
            </div>
          </div>

          {/* Today */}
          <div className="bg-[#181d27] border border-[#283142] rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <Calendar className="w-4 h-4 text-emerald-400 mb-1 opacity-80" />
            <div className="text-2xl font-black text-white tracking-tight">
              {stats?.day !== null && stats?.day !== undefined ? stats.day : (loading ? '...' : '-')}
            </div>
            <div className="text-[10px] uppercase font-semibold text-neutral-400 mt-0.5">
              Oggi
            </div>
          </div>

          {/* Active now */}
          <div className="bg-[#181d27] border border-[#283142] rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <div className="relative mb-1">
              <Users className="w-4 h-4 text-sky-400 opacity-80" />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {stats?.active !== null && stats?.active !== undefined ? stats.active : (loading ? '...' : '-')}
            </div>
            <div className="text-[10px] uppercase font-semibold text-neutral-400 mt-0.5">
              Attivi (5m)
            </div>
          </div>
        </div>

        {/* Metadata info */}
        <div className="bg-[#0e1117] rounded-xl p-3 border border-[#1f2633] text-xs space-y-1.5 text-neutral-300">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Namespace:</span>
            <code className="text-[#fe6601] bg-black/40 px-1.5 py-0.5 rounded font-mono text-[11px]">
              {COUNTER_NAMESPACE}
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Site Key rilevata:</span>
            <span className="font-semibold text-white font-mono text-[11px]">
              {stats?.siteKey || 'calibro'}
            </span>
          </div>
          {stats?.updatedAt && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Ultimo aggiornamento:</span>
              <span className="text-neutral-300 text-[11px]">{stats.updatedAt}</span>
            </div>
          )}
        </div>

        {/* Privacy note */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-400 px-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Contatore anonimo e GDPR-compliant, nessun dato personale memorizzato.</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1a202c] text-neutral-200 hover:text-white border border-[#2d3748] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Aggiorna dati</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#fe6601] hover:bg-[#ff7b1e] text-white shadow transition-all"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
