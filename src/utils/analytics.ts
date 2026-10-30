/**
 * Analytics and Tracking Module for BP Analisi
 * Supports Google Analytics 4 (gtag.js) and lightweight event logging.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    GA_MEASUREMENT_ID?: string;
    getAnalyticsLog?: () => AnalyticsEventRecord[];
  }
}

export interface AnalyticsEventRecord {
  event: string;
  params?: Record<string, any>;
  timestamp: string;
}

const STORAGE_KEY = 'bp_analisi_analytics_log_v1';
const MAX_LOCAL_LOGS = 50;

/**
 * Persist lightweight event log in sessionStorage/localStorage for diagnostics
 */
function recordLocalEvent(event: string, params?: Record<string, any>) {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const logs: AnalyticsEventRecord[] = raw ? JSON.parse(raw) : [];
    logs.unshift({
      event,
      params,
      timestamp: new Date().toISOString(),
    });
    if (logs.length > MAX_LOCAL_LOGS) {
      logs.length = MAX_LOCAL_LOGS;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // ignore storage restrictions
  }
}

// Expose inspection helper for console debugging
if (typeof window !== 'undefined') {
  window.getAnalyticsLog = () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
}

// CounterAPI Configuration
export const COUNTER_NAMESPACE = 'claud_aistudio_live_v1';

/**
 * Determine siteKey based on hostname:
 * window.location.hostname.includes("bpanalisiw3") ? "bpanalisiw3" : "calibro"
 */
export function getSiteKey(): string {
  if (typeof window === 'undefined') return 'calibro';
  try {
    return window.location.hostname.includes('bpanalisiw3') ? 'bpanalisiw3' : 'calibro';
  } catch {
    return 'calibro';
  }
}

/**
 * Send CounterAPI data on app startup:
 * - total counter
 * - day counter (YYYYMMDD)
 * - 5-minute active bucket
 */
/**
 * Send CounterAPI data on app startup:
 * - total counter
 * - day counter (YYYYMMDD)
 * - 5-minute active bucket
 */
export function initCounterMonitoring(): void {
  if (typeof window === 'undefined') return;
  try {
    const siteKey = window.location.hostname.includes('bpanalisiw3') ? 'bpanalisiw3' : 'calibro';
    
    // Total visits counter
    fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${siteKey}_total/up`, { mode: 'cors' }).catch(() => {});
    
    // Day counter
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${siteKey}_day_${day}/up`, { mode: 'cors' }).catch(() => {});
    
    // 5-minute active bucket
    const bucket = Math.floor(Date.now() / 300000);
    fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${siteKey}_active_${bucket}/up`, { mode: 'cors' }).catch(() => {});

    // Maintain local persistent backup counts
    try {
      const totalKey = 'bp_counter_total';
      const prevTotal = parseInt(localStorage.getItem(totalKey) || '0', 10);
      localStorage.setItem(totalKey, String(prevTotal + 1));

      const dayKey = `bp_counter_day_${day}`;
      const prevDay = parseInt(localStorage.getItem(dayKey) || '0', 10);
      localStorage.setItem(dayKey, String(prevDay + 1));

      const activeKey = `bp_counter_active_${bucket}`;
      localStorage.setItem(activeKey, '1');
    } catch {}
  } catch {
    // silent catch
  }
}

/**
 * Periodically keep the active 5-minute bucket updated
 */
function initActiveBucketInterval(): void {
  if (typeof window === 'undefined') return;
  setInterval(() => {
    try {
      const siteKey = window.location.hostname.includes('bpanalisiw3') ? 'bpanalisiw3' : 'calibro';
      const bucket = Math.floor(Date.now() / 300000);
      fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${siteKey}_active_${bucket}/up`, { mode: 'cors' }).catch(() => {});
      try {
        localStorage.setItem(`bp_counter_active_${bucket}`, '1');
      } catch {}
    } catch {}
  }, 300000);
}

// Auto-run at app opening
if (typeof window !== 'undefined') {
  initCounterMonitoring();
  initActiveBucketInterval();
}

/**
 * Live Stats interface for reading real counters
 */
export interface LiveAccessStats {
  siteKey: string;
  total: number | null;
  day: number | null;
  active: number | null;
  updatedAt: string;
}

/**
 * Read counter value directly from CounterAPI without incrementing,
 * with fallback to persistent local counter if network/endpoint is unavailable.
 */
export async function readCounter(keySuffix: string): Promise<number | null> {
  if (typeof window === 'undefined') return null;
  try {
    const siteKey = window.location.hostname.includes('bpanalisiw3') ? 'bpanalisiw3' : 'calibro';
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${siteKey}_${keySuffix}`, {
      mode: 'cors',
    });
    if (res.ok) {
      const json = await res.json();
      if (typeof json.count === 'number') {
        return json.count;
      }
    }
  } catch {
    // silent catch
  }

  // Fallback to local storage counter
  try {
    const val = localStorage.getItem(`bp_counter_${keySuffix}`);
    if (val !== null) {
      return parseInt(val, 10);
    }
    if (keySuffix.startsWith('active_')) {
      return 1;
    }
  } catch {}

  return null;
}

/**
 * Read complete live access stats (Total, Today, Active now)
 */
export async function fetchLiveAccessStats(): Promise<LiveAccessStats> {
  const siteKey = typeof window !== 'undefined' && window.location.hostname.includes('bpanalisiw3') ? 'bpanalisiw3' : 'calibro';
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const bucket = Math.floor(Date.now() / 300000);

  const [total, dayCount, active] = await Promise.all([
    readCounter('total'),
    readCounter(`day_${day}`),
    readCounter(`active_${bucket}`),
  ]);

  return {
    siteKey,
    total,
    day: dayCount,
    active,
    updatedAt: new Date().toLocaleTimeString('it-IT'),
  };
}

// Expose diagnostic helpers on window object
if (typeof window !== 'undefined') {
  (window as any).fetchLiveAccessStats = fetchLiveAccessStats;
  (window as any).readCounter = readCounter;
}

/**
 * Dispatch an analytics event to Google Analytics (gtag), local log, and CounterAPI
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    // 1. Google Analytics (gtag.js)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        app_name: 'BP Analisi',
        ...params,
      });
    } else if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        app_name: 'BP Analisi',
        ...params,
      });
    }

    // 2. CounterAPI background tracking (mode: "cors", silent catch)
    if (typeof window !== 'undefined') {
      const siteKey = window.location.hostname.includes('bpanalisiw3') ? 'bpanalisiw3' : 'calibro';
      fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${siteKey}_evt_${eventName}/up`, { mode: 'cors' }).catch(() => {});
    }

    // 3. Record local diagnostic log
    recordLocalEvent(eventName, params);
  } catch (err) {
    // Silent fail so tracking never breaks user experience
    console.debug('[Analytics] Event tracking error:', err);
  }
}

/**
 * Predefined tracking helper methods
 */
export const Analytics = {
  // Track step navigation in wizard
  trackStep(stepIndex: number, stepName: string, customerCompany?: string) {
    trackEvent('page_view', {
      page_title: `Step ${stepIndex}: ${stepName}`,
      step_index: stepIndex,
      step_name: stepName,
      customer_company: customerCompany || undefined,
    });
  },

  // Track customer validation success
  trackCustomerIdentified(company: string, sector?: string) {
    trackEvent('customer_identified', {
      customer_company: company,
      sector: sector || 'Non specificato',
    });
  },

  // Track proposal generation
  trackProposalGenerated(params: {
    customer: string;
    hasDualLine: boolean;
    hasVoip: boolean;
    interni: number;
    pcCount: number;
  }) {
    trackEvent('proposal_generated', params);
  },

  // Track action buttons on Proposal step
  trackPdfDownload(customer: string) {
    trackEvent('download_pdf', {
      customer_company: customer,
      content_type: 'application/pdf',
    });
  },

  trackEmailClick(customer: string, recipient: string) {
    trackEvent('send_email_click', {
      customer_company: customer,
      recipient,
    });
  },

  trackWhatsAppClick(customer: string) {
    trackEvent('send_whatsapp_click', {
      customer_company: customer,
    });
  },

  trackPhoneCallClick() {
    trackEvent('phone_call_click', {
      action: 'call_support',
    });
  },

  trackNewAnalysisReset() {
    trackEvent('new_analysis_reset', {
      action: 'reset_wizard',
    });
  },

  trackEditDataClick() {
    trackEvent('edit_data_click', {
      action: 'return_to_edit',
    });
  },
};
