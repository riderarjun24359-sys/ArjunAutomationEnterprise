/**
 * Cookie consent — Google Consent Mode v2.
 * The decision is exposed as a stable external store for useSyncExternalStore.
 */
export const CONSENT_STORAGE_KEY = "aa_consent_v1";

export type ConsentDecision = "granted" | "denied";

export interface ConsentState {
    essential: ConsentDecision;
    analytics: ConsentDecision;
    marketing: ConsentDecision;
    decidedAt: string;
}

export const DEFAULT_CONSENT: ConsentState = {
    essential: "denied",
    analytics: "denied",
    marketing: "denied",
    decidedAt: "",
};

export function consentSignals(state: ConsentState): Record<string, ConsentDecision> {
    return {
        ad_storage: state.marketing,
        ad_user_data: state.marketing,
        ad_personalization: state.marketing,
        analytics_storage: state.analytics,
        functionality_storage: state.essential,
        personalization_storage: state.marketing,
        security_storage: "granted",
    };
}

let memoryFallback: ConsentState | null = null;
let cache: { raw: string | null; value: ConsentState | null } = {
    raw: "__aa_consent_cache_uninitialized__",
    value: null,
};

export function readConsent(): ConsentState | null {
    let raw: string | null;
    try {
        raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch {
        // Some webviews allow writes but block reads. Always retain the
        // in-memory decision so Accept/Reject can dismiss the banner.
        return memoryFallback;
    }

    if (raw === cache.raw) return cache.value;

    let value: ConsentState | null = null;
    if (raw) {
        try {
            const parsed = JSON.parse(raw) as Partial<ConsentState>;
            if (parsed.analytics === "granted" || parsed.analytics === "denied") {
                value = {
                    essential: parsed.essential === "granted" ? "granted" : "denied",
                    analytics: parsed.analytics,
                    marketing: parsed.marketing === "granted" ? "granted" : "denied",
                    decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
                };
            }
        } catch {
            value = null;
        }
    }

    cache = { raw, value };
    if (value) memoryFallback = value;
    return value;
}

export function writeConsent(decision: "accept" | "reject"): ConsentState {
    const granted = decision === "accept";
    const state: ConsentState = {
        essential: granted ? "granted" : "denied",
        analytics: granted ? "granted" : "denied",
        marketing: granted ? "granted" : "denied",
        decidedAt: new Date().toISOString(),
    };

    // Update the in-memory snapshot FIRST. Even if storage is unavailable,
    // the external-store subscribers immediately receive the new decision.
    memoryFallback = state;
    cache = { raw: null, value: state };

    try {
        const raw = JSON.stringify(state);
        window.localStorage.setItem(CONSENT_STORAGE_KEY, raw);
        cache = { raw, value: state };
    } catch {
        // In-memory state remains authoritative for this page session.
    }

    emitConsentChange();
    return state;
}

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeConsent(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getConsentSnapshot(): ConsentState | null {
    return readConsent();
}

export function getConsentServerSnapshot(): null {
    return null;
}

function emitConsentChange(): void {
    for (const listener of listeners) listener();
}

export function pushDefaultConsent(): void {
    const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer ?? [];

    if (typeof w.gtag !== "function") {
        // gtag.js expects the arguments object in the dataLayer queue.
        // eslint-disable-next-line prefer-rest-params
        w.gtag = function gtag() {
            // eslint-disable-next-line prefer-rest-params
            w.dataLayer?.push(arguments);
        };
    }

    w.gtag("consent", "default", {
        ...consentSignals(DEFAULT_CONSENT),
        wait_for_update: 500,
        url: window.location.origin,
    });
}

export function applyConsent(state: ConsentState): void {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("consent", "update", consentSignals(state));
}
