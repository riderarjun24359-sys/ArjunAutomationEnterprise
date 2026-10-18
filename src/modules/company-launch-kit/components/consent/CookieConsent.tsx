"use client";

import Link from "next/link";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { ANALYTICS } from "@/src/config/analytics";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import {
    applyConsent,
    getConsentServerSnapshot,
    getConsentSnapshot,
    pushDefaultConsent,
    subscribeConsent,
    writeConsent,
} from "./consent";

/** DOM id for the injected gtag.js, so re-mounts cannot double-inject. */
const GTAG_SCRIPT_ID = "aa-ga4-script";

/**
 * Consent banner + gated analytics loader.
 *
 * Combines both concerns in one client component on purpose: the banner owns
 * the decision, and the analytics tags mount only once that decision exists, so
 * there is no window where GA4 can load without consent.
 *
 * The decision lives in an external store consumed via `useSyncExternalStore`
 * rather than in component state. `localStorage` cannot be read during server
 * render, and this avoids a setState-in-effect cascade that would re-render
 * the whole marketing tree on every visit.
 *
 * Behaviour
 * ---------
 * - `pushDefaultConsent()` runs on mount so default-deny is queued before
 *   gtag.js can execute.
 * - A stored decision is replayed on mount; returning visitors get no banner
 *   and GA4 loads immediately.
 * - Rejecting stores a denial. Nothing loads and the banner stays dismissed —
 *   there is no nagging re-prompt.
 *
 * Accessibility
 * -------------
 * A labelled `role="dialog"` with `aria-modal` and `aria-describedby`. Both
 * actions are real buttons with visible focus rings. Escape is intentionally
 * NOT wired: dismissing without a choice would imply consent.
 */
export function CookieConsent() {
    // null means "no decision stored yet" (and is also the server snapshot).
    const stored = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentServerSnapshot);

    // Declare default-deny on mount, before gtag.js can run.
    useEffect(() => {
        pushDefaultConsent();
        if (stored) applyConsent(stored);
        // `stored` is intentionally read once on mount: replaying the decision
        // on every change would be redundant, writeConsent already applies it.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const decide = useCallback((choice: "accept" | "reject") => {
        const state = writeConsent(choice);
        applyConsent(state);
    }, []);

    const analyticsGranted = stored?.analytics === "granted";
    const showBanner = stored === null;

    return (
        <>
            {showBanner ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-consent-title"
                    aria-describedby="cookie-consent-body"
                    className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]/98 backdrop-blur-xl sm:inset-x-4 sm:bottom-4 sm:rounded-2xl sm:border"
                >
                    <div className="premium-container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-6">
                        <div className="min-w-0">
                            <h2
                                id="cookie-consent-title"
                                className="text-sm font-semibold text-[var(--premium-fg)]"
                            >
                                We use cookies
                            </h2>
                            <p
                                id="cookie-consent-body"
                                className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--premium-fg-muted)]"
                            >
                                We use analytics cookies to understand which pages are useful. Nothing is loaded and
                                nothing is tracked until you choose. Read our{" "}
                                <Link
                                    href={MARKETING_ROUTES.cookies}
                                    className="underline transition-colors hover:text-[var(--premium-accent)]"
                                >
                                    cookie policy
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href={MARKETING_ROUTES.privacy}
                                    className="underline transition-colors hover:text-[var(--premium-accent)]"
                                >
                                    privacy policy
                                </Link>
                                .
                            </p>
                        </div>

                        <div className="flex shrink-0 gap-3">
                            <button
                                type="button"
                                onClick={() => decide("reject")}
                                className="rounded-full border border-[var(--premium-border)] px-5 py-2.5 text-sm font-semibold text-[var(--premium-fg)] transition-colors hover:bg-[var(--premium-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--premium-bg-secondary)]"
                            >
                                Reject
                            </button>
                            <button
                                type="button"
                                onClick={() => decide("accept")}
                                className="rounded-full bg-[var(--dos-brand-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--premium-accent-glow)] transition-colors hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--premium-bg-secondary)]"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/*
                GA4 mounts only after consent. Injection happens in an effect
                rather than during render: appending a <script> to document.head
                is a side effect, and doing it in the render body means React
                can run it twice or discard the work on a re-render.
            */}
            {analyticsGranted && ANALYTICS.ga4Id ? <GtagLoader ga4Id={ANALYTICS.ga4Id} /> : null}
        </>
    );
}

function GtagLoader({ ga4Id }: { ga4Id: string }) {
    useEffect(() => {
        const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
        w.dataLayer = w.dataLayer ?? [];
        w.gtag?.("js", new Date());
        w.gtag?.("config", ga4Id, { anonymize_ip: true });

        if (!document.getElementById(GTAG_SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = GTAG_SCRIPT_ID;
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
            document.head.appendChild(script);
        }
    }, [ga4Id]);

    return null;
}
