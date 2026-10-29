import React, { useState } from 'react';
import { AnalysisData, TechnicalAnalysisResult } from '../types';
import { buildMailtoUrl, buildWhatsAppUrl } from '../utils/engine';
import { downloadPdf, generatePdfDocument } from '../utils/pdfGenerator';
import { PartnerBadges } from './PartnerBadges';
import { CONTACT } from '../data/assets';
import {
  Download,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  Copy,
  Edit3,
  BookmarkPlus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProposalStepProps {
  data: AnalysisData;
  analysis: TechnicalAnalysisResult;
  onEdit: () => void;
  onNew: () => void;
}

export const ProposalStep: React.FC<ProposalStepProps> = ({
  data,
  analysis,
  onEdit,
  onNew,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(analysis.summaryText);
      showToast('Testo dell’analisi copiato negli appunti!');
    } catch (err) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = analysis.summaryText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Testo dell’analisi copiato!');
    }
  };

  const handleSharePdf = async () => {
    try {
      const { blob, filename } = generatePdfDocument(data, analysis);
      const file = new File([blob], filename, { type: 'application/pdf' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Analisi Cliente - ${data.azienda}`,
          text: `DESTINATARIO: ${CONTACT.EMAIL}\n\n${analysis.summaryText}`,
        });
      } else {
        // Fallback for desktop: download and show instructions
        downloadPdf(data, analysis);
        showToast(`PDF scaricato. Invialo a: ${CONTACT.EMAIL}`);
      }
    } catch (e) {
      downloadPdf(data, analysis);
    }
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      downloadPdf(data, analysis);
      showToast('PDF generato e scaricato correttamente!');
      // Trigger subtle celebration confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#fe6601', '#ff8c2e', '#ffffff'],
      });
    } catch (e) {
      console.error(e);
      showToast('Errore durante la generazione del PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1b1f27] border border-[#fe6601] text-white px-5 py-2.5 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#fe6601]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#fe6601] text-white font-heading font-black text-xl px-4 py-2 rounded-xl shadow-lg">
          Progetto pronto
        </div>
        <p className="text-sm text-neutral-400">Controlla il riepilogo e scarica il PDF.</p>
      </div>

      <div className="h-[1px] bg-neutral-800 w-full mb-6" />

      {/* The 4 Core Technical Decisions - Grid of Badges */}
      <div className="grid grid-cols-2 gap-3">
        {analysis.decisions.map((dec, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 border transition-all ${
              dec.hot
                ? 'bg-[#fe6601]/10 border-[#fe6601]'
                : 'bg-[#1a1d23] border-[#2f343e]'
            }`}
          >
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              {dec.label}
            </div>
            <div
              className={`text-sm font-heading font-black ${
                dec.hot ? 'text-[#ff8c2e]' : 'text-white'
              }`}
            >
              {dec.value}
            </div>
          </div>
        ))}
      </div>

      {/* Proposed Sizing Breakdown */}
      <section className="space-y-4">
        <h3 className="text-lg font-heading font-black text-white pl-3 border-l-4 border-[#fe6601]">
          {analysis.projectTitle}
        </h3>
        <p className="text-xs text-neutral-500">{analysis.projectSub}</p>

        <ul className="space-y-0 border-t border-[#2f343e]">
          {analysis.project.map((p, idx) => (
            <li
              key={idx}
              className="py-4 border-b border-[#2f343e] space-y-1"
            >
              <span className="text-sm font-black text-white block">
                {p.category}
              </span>
              <p className="text-sm text-neutral-300 leading-relaxed">{p.description}</p>
            </li>
          ))}
        </ul>

        <p className="text-sm text-neutral-300 pt-4 leading-relaxed italic">
          {analysis.disclaimer}
        </p>
      </section>

      {/* Action Buttons Matrix - CORRECTED FOR RECIPIENTS & NUMBER */}
      <div className="space-y-3 pt-4">
        {/* Email Primary - using mailto: to guarantee recipient is set in mail app */}
        <a
          href={buildMailtoUrl(data, analysis)}
          className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-[#ea5e00] to-[#fe6601] text-white font-heading font-black text-xl shadow-[0_4px_14px_rgba(254,102,1,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Invia per email con PDF</span>
        </a>

        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp with fixed recipient number */}
          <a
            href={buildWhatsAppUrl(analysis)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-4 px-2 rounded-xl bg-[#15803d] text-white font-heading font-black text-lg active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>WhatsApp</span>
          </a>

          {/* Chiama ora */}
          <a
            href={`tel:${CONTACT.TEL}`}
            className="flex items-center justify-center py-4 px-2 rounded-xl bg-[#1a1d23] border border-[#2f343e] text-white font-heading font-black text-lg active:scale-[0.98] transition-all"
          >
            <span>Chiama ora</span>
          </a>

          {/* Salva Richiesta PDF - Using system share to allow file sharing/attachment */}
          <button
            onClick={handleSharePdf}
            className="flex items-center justify-center py-4 px-2 rounded-xl bg-[#1a1d23] border border-[#2f343e] text-white font-heading font-black text-base active:scale-[0.98] transition-all"
          >
            <span>Salva Richiesta PDF</span>
          </button>

          {/* Copia testo */}
          <button
            onClick={handleCopyText}
            className="flex items-center justify-center py-4 px-2 rounded-xl bg-[#1a1d23] border border-[#2f343e] text-white font-heading font-black text-base active:scale-[0.98] transition-all"
          >
            <span>Copia testo</span>
          </button>
        </div>

        {/* Modifica Dati */}
        <button
          onClick={onEdit}
          className="w-full py-4 rounded-xl bg-[#1a1d23] border border-[#2f343e] text-white font-heading font-black text-lg active:scale-[0.98] transition-all"
        >
          Modifica dati
        </button>
      </div>

      {/* Partner Logos & Footer */}
      <div className="space-y-4 text-center pt-4">
        <PartnerBadges mini={true} />
        <p className="text-[13px] text-neutral-400 font-medium">
          Email: {CONTACT.EMAIL} <br /> 
          Tel/WhatsApp: {CONTACT.TEL_DISPLAY}
        </p>
      </div>

      {/* New Analysis - Separated Section */}
      <div className="pt-8 border-t border-neutral-800">
        <button
          type="button"
          onClick={onNew}
          className="w-full py-5 rounded-2xl border-2 border-red-600/30 text-red-500 font-heading font-black text-xl bg-[#1a1010] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Nuova analisi (cancella questi dati)</span>
        </button>
      </div>
    </div>
  );
};
