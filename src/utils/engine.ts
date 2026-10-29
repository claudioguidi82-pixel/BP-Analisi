import { AnalysisData, TechnicalAnalysisResult, DecisionCard, SectionGroup, ProjectItem } from '../types';
import { CONTACT } from '../data/assets';

export const INITIAL_DATA: AnalysisData = {
  azienda: '',
  referente: '',
  telCliente: '',
  emailCliente: '',
  negozio: '',
  pos: '',
  bpNome: '',
  bpRecapito: '',
  sedi: 1,
  settore: '',

  lineaAttuale: '',
  doppia: '',
  fwa: '',
  fritz: '',
  continuita: [],
  pc: 0,
  altriDisp: [],
  firewallEsist: '',

  esterno: [],
  ipRichiesto: '',
  note_ip: '',

  voip: '',
  interni: 0,
  numeri: 0,
  portabilita: '',
  lineeOggi: [],
  telefoni: '',
  mobilita: '',
  reparti: '',
  note_voip: '',
};

export function numVal(v: number | string | undefined | null): number {
  const parsed = parseInt(String(v ?? ''), 10);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

export function analyzeProposal(data: AnalysisData): TechnicalAnalysisResult {
  const doppia = data.doppia === 'si';
  const doppiaForse = data.doppia === 'forse';
  const firewall = doppia || doppiaForse || data.firewallEsist !== 'si';
  const firewallObbl = doppia;

  const ext = data.esterno || [];
  const needsFixed =
    ext.includes('VPN / smart working') ||
    ext.includes('Server o gestionale') ||
    data.ipRichiesto === 'si';
  const onlyDyn =
    !needsFixed &&
    (ext.includes('Telecamere / DVR') || ext.includes('Centralino / app telefono'));

  let ip: 'fisso' | 'dyndns' | 'da verificare' | 'nessuno' = 'da verificare';
  if (needsFixed) {
    ip = 'fisso';
  } else if (onlyDyn) {
    ip = 'dyndns';
  } else if (ext.length === 1 && ext[0] === 'Niente' && data.ipRichiesto !== 'si') {
    ip = 'nessuno';
  } else if (ext.length || data.ipRichiesto === 'no') {
    ip = 'nessuno';
  }

  const interni = numVal(data.interni);
  const numeri = numVal(data.numeri);
  const sedi = Math.max(1, numVal(data.sedi));
  const voip = data.voip === 'si' || (data.voip !== 'no' && interni > 0);
  const simultaneousCalls = voip ? Math.max(2, Math.ceil(interni / 3)) : 0;

  // Decision Cards (Top Highlights)
  const decisions: DecisionCard[] = [
    {
      label: 'Firewall',
      value: firewallObbl
        ? 'Incluso (Doppia Linea)'
        : firewall
        ? 'Consigliato (Protezione)'
        : 'Già Presente',
      hot: firewallObbl,
      explanation: firewallObbl
        ? 'Necessario per convogliare le due reti e gestire il failover automatico.'
        : firewall
        ? 'Consigliato per sicurezza perimetrale e adempimenti GDPR.'
        : 'Verificare compatibilità con apparati esistenti.',
    },
    {
      label: 'Doppia Linea',
      value: doppia
        ? 'FTTH/FTTC + FWA'
        : doppiaForse
        ? 'Da Valutare'
        : data.doppia === 'no'
        ? 'Singola Linea'
        : 'Da Definire',
      hot: doppia,
      explanation: doppia
        ? 'Connessione principale ultraveloce e backup FWA outdoor con router dedicati.'
        : 'Continuità garantita per pagamenti e gestionale.',
    },
    {
      label: 'Indirizzo IP',
      value:
        ip === 'fisso'
          ? 'IP Fisso Dedicato'
          : ip === 'dyndns'
          ? 'Servizio DynDNS'
          : ip === 'nessuno'
          ? 'IP Dinamico'
          : 'Da Verificare',
      hot: ip === 'fisso',
      explanation:
        ip === 'fisso'
          ? 'Indispensabile per VPN stabili, telelavoro e server aziendali.'
          : ip === 'dyndns'
          ? 'Soluzione agile per telecamere e centralino senza costi di IP statico.'
          : 'Nessun apparato locale richiede instradamento fisso.',
    },
    {
      label: 'Centralino 3CX',
      value: voip
        ? interni > 0
          ? `${interni} interni (${simultaneousCalls} canali)`
          : '3CX da Configurare'
        : data.voip === 'forse'
        ? 'Da Valutare'
        : data.voip === 'no'
        ? 'Nessun Centralino'
        : 'Da Definire',
      hot: voip,
      explanation: voip
        ? 'Centralino software professionale con app smartphone e code di chiamata.'
        : 'Opzione telefonica non richiesta al momento.',
    },
  ];

  // Section Groups
  const yn = (v?: string) =>
    v === 'si'
      ? 'Sì'
      : v === 'no'
      ? 'No'
      : v === 'forse'
      ? 'Da valutare'
      : v === 'nv'
      ? 'Da verificare'
      : 'Non indicato';

  const listStr = (arr?: string[], fallback = 'Nessuno indicato') =>
    arr && arr.length > 0 ? arr.join(', ') : fallback;

  const sections: SectionGroup[] = [
    {
      title: 'Cliente e Negozio WINDTRE',
      rows: [
        { label: 'Ragione Sociale Cliente', value: data.azienda || 'Non specificata' },
        { label: 'Referente Cliente', value: data.referente || 'Non specificato' },
        { label: 'Telefono Cliente', value: data.telCliente || 'Non specificato' },
        { label: 'Email Cliente', value: data.emailCliente || 'Non specificata' },
        { label: 'Negozio WINDTRE', value: data.negozio || 'Non specificato' },
        { label: 'Codice POS Negozio', value: data.pos || 'Non specificato' },
        { label: 'Nominativo Business Partner (BP)', value: data.bpNome || 'Non specificato' },
        { label: 'Recapito BP', value: data.bpRecapito || 'Non specificato' },
        { label: 'Numero Sedi', value: String(sedi) },
        { label: 'Settore / Attività', value: data.settore || 'Non specificato' },
      ],
    },
    {
      title: 'Rete e Connettività',
      rows: [
        { label: 'Connessione Attuale', value: data.lineaAttuale || 'Non indicata' },
        { label: 'Doppia Linea (Backup)', value: yn(data.doppia) },
        ...(doppia || doppiaForse
          ? [
              {
                label: 'Architettura Prevista',
                value: 'Principale FTTH/FTTC + Backup FWA Outdoor',
              },
              { label: 'Copertura FWA Verificata', value: yn(data.fwa) },
              { label: 'FRITZ!Box già Presenti', value: yn(data.fritz) },
            ]
          : []),
        { label: 'Servizi Critici in Continuità', value: listStr(data.continuita, 'Nessuno') },
        { label: 'Numero Postazioni PC', value: String(numVal(data.pc)) },
        { label: 'Altri Dispositivi in Rete', value: listStr(data.altriDisp, 'Nessuno') },
        { label: 'Firewall Esistente', value: yn(data.firewallEsist) },
      ],
    },
    {
      title: 'Accessi dall’Esterno e Indirizzamento IP',
      rows: [
        { label: 'Da Raggiungere da Fuori Sede', value: listStr(data.esterno, 'Nessun servizio') },
        { label: 'IP Fisso Richiesto / Presente', value: yn(data.ipRichiesto) },
        ...(data.note_ip ? [{ label: 'Note Tecniche IP', value: data.note_ip }] : []),
      ],
    },
    {
      title: 'Telefonia VoIP e Centralino 3CX',
      rows: [
        { label: 'Adozione VoIP / 3CX', value: yn(data.voip) },
        ...(data.voip !== 'no'
          ? [
              { label: 'Numero di Interni', value: String(interni) },
              { label: 'Linee / Numerazioni Attuali', value: String(numeri) },
              { label: 'Portabilità Numeri', value: yn(data.portabilita) },
              { label: 'Linee Telefoniche Attuali', value: listStr(data.lineeOggi, 'Nessuna') },
              {
                label: 'Apparati Telefonici',
                value:
                  data.telefoni === 'ip'
                    ? 'Già IP / Riutilizzabili'
                    : data.telefoni === 'nuovi'
                    ? 'Da acquistare nuovi'
                    : data.telefoni === 'nv'
                    ? 'Da verificare in sede'
                    : 'Da definire',
              },
              { label: 'Mobilità (App Smartphone/PC)', value: yn(data.mobilita) },
              ...(data.reparti ? [{ label: 'Gruppi e Code di Risposta', value: data.reparti }] : []),
              ...(data.note_voip ? [{ label: 'Note Telefonia', value: data.note_voip }] : []),
            ]
          : []),
      ],
    },
  ];

  // Detailed Sizing Project
  const project: ProjectItem[] = [];

  // 1. Firewall
  if (firewall) {
    let desc = '';
    if (doppia) {
      desc =
        'Incluso: indispensabile per convogliare le due reti (primaria e secondaria), bilanciare il carico e commutare istantaneamente (failover automatico) se una linea cade.';
    } else if (doppiaForse) {
      desc =
        'Da includere se il cliente conferma la doppia linea (bonding/failover automatico tra le linee).';
    } else {
      desc =
        'Consigliato come presidio di sicurezza perimetrale della rete aziendale contro intrusioni e malware (misure adeguate ex art. 32 GDPR).';
    }
    if ((doppia || doppiaForse) && data.firewallEsist === 'si') {
      desc += ' Attenzione: verificare se il firewall esistente supporta il Dual-WAN con failover.';
    }
    project.push({ category: 'Firewall & Sicurezza', description: desc });
  } else {
    project.push({
      category: 'Firewall & Sicurezza',
      description: 'Firewall già presente dal cliente: da validare la compatibilità e le rotte.',
    });
  }

  // 2. Connettività
  if (doppia || doppiaForse) {
    project.push({
      category: 'Connettività Ridondata',
      description:
        'Linea principale FTTH/FTTC ad alta velocità abbinata a seconda linea di riserva FWA Outdoor, con router FRITZ!Box compatibili su entrambe (previa verifica di copertura).',
    });
  } else if (data.doppia === 'no') {
    project.push({
      category: 'Connettività',
      description:
        'Singola linea di accesso; valutare una linea di backup FWA se la continuità operativa di POS, cassa e gestionali è prioritaria.',
    });
  } else {
    project.push({
      category: 'Connettività',
      description: 'Configurazione connettività da finalizzare (singola linea o ridondata FTTH+FWA).',
    });
  }

  // 3. IP
  if (ip === 'fisso') {
    project.push({
      category: 'Indirizzamento IP',
      description:
        'IP statico raccomandato per garantire connessioni VPN stabili da remoto, smart working e accesso ai gestionali. Con doppia linea, verificare la configurazione IP pubblico su entrambe.',
    });
  } else if (ip === 'dyndns') {
    project.push({
      category: 'Indirizzamento IP',
      description:
        'Servizio DynDNS dinamico sufficiente per raggiungere telecamere o centralino senza i canoni di un IP statico aggiuntivo.',
    });
  } else if (ip === 'da verificare') {
    project.push({
      category: 'Indirizzamento IP',
      description: 'Necessità di IP statico o DynDNS da accertare in fase di sopralluogo.',
    });
  } else {
    project.push({
      category: 'Indirizzamento IP',
      description: 'Nessun servizio critico esposto all’esterno: non è richiesto IP statico.',
    });
  }

  // 4. Centralino 3CX
  if (voip) {
    project.push({
      category: 'Centralino 3CX',
      description: `Piattaforma 3CX dimensionata per ${
        interni > 0 ? `${interni} interni` : 'numero interni da precisare'
      }${sedi > 1 ? ` distribuiti su ${sedi} sedi` : ''}${
        data.reparti ? ` con configurazione reparti (${data.reparti})` : ''
      }${data.mobilita === 'si' ? ', licenze app mobile iOS/Android per mobilità' : ''}.`,
    });
    project.push({
      category: 'Trunk SIP Professionale',
      description: `Canali voce contemporanei stimati: ${simultaneousCalls} chiamate simultanee (calcolate su base dimensionamento interni)${
        numeri > 0
          ? ` su ${numeri} numerazioni/GNR${data.portabilita === 'si' ? ' con procedura di portabilità' : ''}`
          : ''
      }.`,
    });
    project.push({
      category: 'Licenza & Apparati',
      description:
        data.telefoni === 'nuovi'
          ? 'Fornitura telefoni IP da tavolo/cordless Yealink/Fanvil certificati 3CX.'
          : data.telefoni === 'ip'
          ? 'Riutilizzo dei telefoni IP esistenti previa verifica compatibilità firmware SIP.'
          : 'Valutazione apparati telefonici o uso esclusivo di softphone/cuffie.',
    });
  } else if (data.voip === 'forse') {
    project.push({
      category: 'Telefonia',
      description:
        'Opportunità 3CX da approfondire: quantificare gli interni per quotare canali SIP e licenza 3CX.',
    });
  } else if (data.voip === 'no') {
    project.push({
      category: 'Telefonia',
      description: 'Nessun intervento richiesto sul centralino telefonico o sulle linee voce.',
    });
  } else {
    project.push({
      category: 'Telefonia',
      description: 'Fabbisogno telefonico VoIP non ancora specificato.',
    });
  }

  const disclaimer =
    'Documento e dimensionamento indicativi predisposti da System Byte Srl per negozi WINDTRE. Disponibilità, copertura tecnica e condizioni economiche definitive saranno confermate in fase di preventivazione formale. Il GDPR (art. 32) richiede misure tecniche adeguate al rischio.';

  // Build plain text for copy/whatsapp
  const lines: string[] = [];
  lines.push('RICHIESTA PREVENTIVO – ANALISI ESIGENZE');
  lines.push(`System Byte Srl · Negozi WINDTRE · ${new Date().toLocaleDateString('it-IT')}`);
  lines.push('');

  sections.forEach((sec, idx) => {
    lines.push(`${idx + 1}. ${sec.title.toUpperCase()}`);
    sec.rows.forEach((r) => {
      lines.push(`• ${r.label}: ${r.value}`);
    });
    lines.push('');
  });

  lines.push('PROGETTO TECNICO PROPOSTO:');
  project.forEach((p) => {
    lines.push(`▶ ${p.category}: ${p.description}`);
  });
  lines.push('');
  lines.push(`Contatti: ${CONTACT.COMPANY_NAME} | ${CONTACT.EMAIL} | ${CONTACT.TEL_DISPLAY}`);

  return {
    doppia,
    doppiaForse,
    firewall,
    firewallObbl,
    ip,
    voip,
    interni,
    numeri,
    sedi,
    simultaneousCalls,
    decisions,
    sections,
    project,
    projectTitle: 'Progetto Tecnico Proposto',
    projectSub: 'Soluzione personalizzata formulata per il cliente e pronta per il preventivo.',
    disclaimer,
    summaryText: lines.join('\n'),
  };
}

export function buildMailtoUrl(data: AnalysisData, analysis: TechnicalAnalysisResult): string {
  const clientName = data.azienda.trim() || 'Cliente';
  const subject = `Richiesta Preventivo WINDTRE - ${clientName}`;
  const body = `Buongiorno System Byte,

in allegato e di seguito l'analisi esigenze per il cliente ${clientName} per la predisposizione del preventivo tecnico ed economico.

${analysis.summaryText}

Cordiali saluti,
${data.bpNome || 'Business Partner WINDTRE'}
${data.negozio ? `Negozio: ${data.negozio}` : ''}
${data.pos ? `POS: ${data.pos}` : ''}
${data.bpRecapito ? `Recapito: ${data.bpRecapito}` : ''}`;

  return `mailto:${CONTACT.EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;
}

export function buildWhatsAppUrl(analysis: TechnicalAnalysisResult): string {
  return `https://wa.me/${CONTACT.WA_NUMBER}?text=${encodeURIComponent(analysis.summaryText)}`;
}
