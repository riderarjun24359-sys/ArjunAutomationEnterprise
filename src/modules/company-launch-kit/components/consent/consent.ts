/**
 * Cookie consent — Google Consent Mode v2.
 *
 * WHY
 * ---
 * GA4 was loading unconditionally, so every visitor — including EU and UK
 * visitors with no consent given — was tracked. That is a GDPR exposure and a
 * direct breach of Google's own EU policy, and the site collects contact form
 * data on top of it.
 *
 * HOW IT WORKS
 * ------------
 * 1. On mount we push a `default` consent state of DENIED for every storage
 *    category. This must happen BEFORE gtag.js loads, or Google records the
 *    page view as consented.
 * 2. If a stored choice exists we replay it immediately, so returning visitors
 *    are not re-prompted and GA4 loads without a flash of the banner.
 * 3. GA4 only loads once `analytics_storage` is granted.
 *
 * STORAGE
 * -------
 * localStorage is used rather than a cookie so the value is not itself a
 * tracking cookie. It is wrapped in try/catch because Safari private mode and
 * some embedded webviews throw on access.
 */

export const CONSENT_STORAGE_KEY = "aa_consent_v1";

export type ConsentDecision = "granted" | "denied";

export interface ConsentState {
    /** Consent Mode v2 signals, all "granted" or all "denied" per decision. */
    essential: ConsentDecision;
    analytics: ConsentDecision;
    marketing: ConsentDecision;
    /** ISO timestamp of when the decision was made. */
    decidedAt: string;
}

export const DEFAULT_CONSENT: ConsentState = {
    essential: "denied",
    analytics: "denied",
    marketing: "denied",
    decidedAt: "",
};

/**
 * Maps our state onto the Consent Mode v2 signal names.
 * `essential` maps to the storage categories that are strictly necessary for
 * the site to function and are always granted once a decision exists.
 */
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

/** Reads the stored decision. Returns null when absent or unreadable. */
export function readConsent(): ConsentState | null {
    try {
        const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<ConsentState>;
        if (parsed.analytics !== "granted" && parsed.analytics !== "denied") return null;
        return {
            essential: parsed.essential === "granted" ? "granted" : "denied",
            analytics: parsed.analytics,
            marketing: parsed.marketing === "granted" ? "granted" : "denied",
            decidedAt: parsed.decidedAt ?? "",
        };
    } catch {
        // Private mode / storage disabled — treat as "no decision yet" so the
        // banner still shows and nothing is loaded behind the user's back.
        return null;
    }
}

export function writeConsent(decision: "accept" | "reject"): ConsentState {
    const granted = decision === "accept";
    const state: ConsentState = {
        essential: granted ? "granted" : "denied",
        analytics: granted ? "granted" : "denied",
        marketing: granted ? "granted" : "denied",
        decidedAt: new Date().toISOString(),
    };
    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Non-fatal: the decision still applies to this page view.
    }
    return state;
}

/**
 * Declares the gtag queue and pushes the default-deny state.
 *
 * Must run before gtag.js is injected. Creates `window.dataLayer` and a
 * `window.gtag` shim if the tag has not loaded yet, so queued calls are not lost.
 */
export function pushDefaultConsent(): void {
    const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

    w.dataLayer = w.dataLayer ?? [];

    if (typeof w.gtag !== "function") {
        /**
         * CRITICAL: this must push the `arguments` object, NOT a rest array.
         *
         * gtag.js only parses `arguments` objects when replaying the dataLayer
         * queue. A shim written as
         *
         *     w.gtag = (...args) => w.dataLayer.push(args);   // WRONG
         *
         * loads gtag.js successfully, populates window.dataLayer, and then
         * gtag.js silently discards every entry. Nothing throws, nothing
         * appears in the console, and analytics records nothing, forever.
         * Verified empirically on this project: the `arguments` form sends the
         * /g/collect beacon; the rest-array form sends zero requests.
         */
        w.gtag = function gtag() {
            w.dataLayer?.push(arguments);
        };
    }

    w.gtag("consent", "default", {
        ...consentSignals(DEFAULT_CONSENT),
        wait_for_update: 500,
        url: window.location.origin,
    });
}

/** Applies a decision to the already-loaded gtag, if present. */
export function applyConsent(state: ConsentState): void {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("consent", "update", consentSignals(state));
}
