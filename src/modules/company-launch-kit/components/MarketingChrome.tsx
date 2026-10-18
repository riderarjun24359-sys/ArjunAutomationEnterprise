"use client";

import dynamic from "next/dynamic";
import { PremiumHeader } from "@/src/modules/company-launch-kit/components/premium/PremiumHeader";
import { PremiumFooter } from "@/src/modules/company-launch-kit/components/premium/PremiumFooter";

/**
 * Note: this chrome no longer mounts the analytics tags directly.
 *
 * It previously rendered `AnalyticsScripts`, which loaded GA4 unconditionally.
 * That was replaced by `CookieConsent` (components/consent/CookieConsent.tsx),
 * which renders the consent banner and mounts the tags only after consent is
 * granted. If this chrome is ever re-wired into a layout, it must include
 * `CookieConsent` — otherwise analytics would either be missing or, if an
 * ungated loader were reintroduced, would fire without consent.
 */
export function MarketingHeaderChrome() {
    return <PremiumHeader />;
}

export function MarketingFooterChrome() {
    return <PremiumFooter />;
}
