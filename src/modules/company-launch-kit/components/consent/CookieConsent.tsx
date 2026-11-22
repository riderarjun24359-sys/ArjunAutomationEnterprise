"use client";

import Link from "next/link";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { ANALYTICS } from "@/src/config/analytics";
import {
    applyConsent,
    getConsentServerSnapshot,
    getConsentSnapshot,
    pushDefaultConsent,
    subscribeConsent,
    writeConsent,
} from "./consent";

const GTAG_SCRIPT_ID = "aa-ga4-script";

export function CookieConsent() {
    const stored = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentServerSnapshot);

    useEffect(() => {
        pushDefaultConsent();
        if (stored) applyConsent(stored);
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
                <div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-body"
                    className="fixed inset-x-2 bottom-[4.75rem] z-[60] border border-slate-200 bg-white shadow-xl sm:inset-x-4 sm:bottom-4 sm:rounded-2xl">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-6">
                        <div className="min-w-0">
                            <h2 id="cookie-consent-title" className="text-sm font-semibold text-slate-950">We use cookies</h2>
                            <p id="cookie-consent-body" className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
                                We use analytics cookies to understand which pages are useful. Nothing is loaded or tracked until you choose. Read our{" "}
                                <Link href="/cookies" className="underline hover:text-blue-700">cookie policy</Link> and{" "}
                                <Link href="/privacy" className="underline hover:text-blue-700">privacy policy</Link>.
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-3">
                            <button type="button" onClick={() => decide("reject")} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Reject</button>
                            <button type="button" onClick={() => decide("accept")} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Accept</button>
                        </div>
                    </div>
                </div>
            ) : null}
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
