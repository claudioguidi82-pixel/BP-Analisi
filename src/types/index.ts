/**
 * Types for the WINDTRE / System Byte BP Client Analysis App
 */

export interface AnalysisData {
  id?: string;
  createdAt?: string;
  updatedAt?: string;

  // Step 1: Dati Cliente & Negozio
  azienda: string;
  referente: string;
  telCliente: string;
  emailCliente: string;
  negozio: string;
  pos: string;
  bpNome: string;
  bpRecapito: string;
  sedi: number;
  settore: string;

  // Step 2: Rete e Connettività
  lineaAttuale: string; // 'FTTH' | 'FTTC' | 'ADSL' | 'FWA' | 'Nessuna / non so' | ''
  doppia: 'si' | 'no' | 'forse' | ''; // Doppia linea
  fwa?: 'si' | 'no' | 'nv' | ''; // Copertura FWA outdoor verificata
  fritz?: 'si' | 'no' | 'nv' | ''; // FRITZ!Box già presenti
  continuita: string[]; // ['POS / pagamenti', 'Cloud / gestionale', 'Telefoni', 'Telecamere', 'Server interni', 'Niente di critico']
  pc: number;
  altriDisp: string[]; // ['POS', 'Stampanti', 'Server / NAS', 'Access point Wi-Fi', 'Telecamere / DVR', 'Altro']
  firewallEsist: 'si' | 'no' | 'nv' | '';

  // Step 3: Accessi dall'esterno & IP
  esterno: string[]; // ['VPN / smart working', 'Server o gestionale', 'Telecamere / DVR', 'Centralino / app telefono', 'Niente']
  ipRichiesto: 'si' | 'no' | 'nv' | '';
  note_ip: string;

  // Step 4: Telefonia VoIP / 3CX
  voip: 'si' | 'no' | 'forse' | '';
  interni: number;
  numeri: number;
  portabilita: 'si' | 'no' | 'nv' | '';
  lineeOggi: string[]; // ['ISDN', 'Analogica', 'VoIP', 'Mobile', 'Nessuna']
  telefoni: 'ip' | 'nuovi' | 'nv' | '';
  mobilita: 'si' | 'no' | '';
  reparti: string;
  note_voip: string;
}

export interface DecisionCard {
  label: string;
  value: string;
  hot: boolean;
  explanation: string;
}

export interface SectionRow {
  label: string;
  value: string;
}

export interface SectionGroup {
  title: string;
  rows: SectionRow[];
}

export interface ProjectItem {
  category: string;
  description: string;
}

export interface TechnicalAnalysisResult {
  doppia: boolean;
  doppiaForse: boolean;
  firewall: boolean;
  firewallObbl: boolean;
  ip: 'fisso' | 'dyndns' | 'da verificare' | 'nessuno';
  voip: boolean;
  interni: number;
  numeri: number;
  sedi: number;
  simultaneousCalls: number;
  decisions: DecisionCard[];
  sections: SectionGroup[];
  project: ProjectItem[];
  projectTitle: string;
  projectSub: string;
  disclaimer: string;
  summaryText: string;
}

export interface SavedAnalysis {
  id: string;
  data: AnalysisData;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  summaryBadge: string;
}
