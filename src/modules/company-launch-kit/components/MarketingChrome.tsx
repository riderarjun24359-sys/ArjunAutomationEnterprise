"use client";

import dynamic from "next/dynamic";
import { PremiumHeader } from "@/src/modules/company-launch-kit/components/premium/PremiumHeader";
import { PremiumFooter } from "@/src/modules/company-launch-kit/components/premium/PremiumFooter";
import { AnalyticsScripts } from "@/src/modules/company-launch-kit/components/AnalyticsScripts";

export function MarketingHeaderChrome() {
    return <PremiumHeader />;
}

export function MarketingFooterChrome() {
    return (
        <>
            <PremiumFooter />
            <AnalyticsScripts />
        </>
    );
}
