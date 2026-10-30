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
const COUNTER_NAMESPACE = 'claud_aistudio_live_v1';

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
 * Send a non-blocking background GET request to CounterAPI with silent error catch
 */
function sendCounter(key: string) {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${key}/up`, {
        method: 'GET',
        mode: 'cors',
      }).catch(() => {});
    }
  } catch {
    // silent catch
  }
}

/**
 * On app startup (once per sessionStorage "_mon_init"):
 * - total counter
 * - day counter (YYYYMMDD)
 */
function initStartupCounters() {
  if (typeof window === 'undefined') return;
  try {
    if (!sessionStorage.getItem('_mon_init')) {
      sessionStorage.setItem('_mon_init', '1');
      const siteKey = getSiteKey();
      const dayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      sendCounter(`${siteKey}_total`);
      sendCounter(`${siteKey}_day_${dayStr}`);
    }
  } catch {
    // silent catch
  }
}

/**
 * On startup and every 5 minutes (using bucket = Math.floor(Date.now()/300000) saved in sessionStorage):
 * - active bucket counter
 */
function pingActiveBucket() {
  if (typeof window === 'undefined') return;
  try {
    const bucket = Math.floor(Date.now() / 300000);
    const lastBucket = sessionStorage.getItem('_mon_bucket');
    if (lastBucket !== String(bucket)) {
      sessionStorage.setItem('_mon_bucket', String(bucket));
      const siteKey = getSiteKey();
      sendCounter(`${siteKey}_active_${bucket}`);
    }
  } catch {
    // silent catch
  }
}

function initActiveTracking() {
  if (typeof window === 'undefined') return;
  pingActiveBucket();
  // Check every 60 seconds to catch each new 5-minute bucket promptly
  setInterval(() => {
    pingActiveBucket();
  }, 60000);
}

// Auto-run startup counters and active bucket tracking when script loads in browser
if (typeof window !== 'undefined') {
  initStartupCounters();
  initActiveTracking();
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

    // 2. CounterAPI background increment (non-blocking, silent catch)
    const siteKey = getSiteKey();
    sendCounter(`${siteKey}_evt_${eventName}`);

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
