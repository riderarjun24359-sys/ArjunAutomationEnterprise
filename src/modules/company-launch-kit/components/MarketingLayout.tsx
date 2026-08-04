"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { PremiumHeader } from "@/src/modules/company-launch-kit/components/premium/PremiumHeader";
import { PremiumFooter } from "@/src/modules/company-launch-kit/components/premium/PremiumFooter";
import { PageTransition } from "@/src/modules/company-launch-kit/components/premium/ui/PageTransition";
import { ScrollProgress } from "@/src/modules/company-launch-kit/components/premium/ui/ScrollProgress";
import { AnalyticsScripts } from "@/src/modules/company-launch-kit/components/AnalyticsScripts";

const CursorGlow = dynamic(
    () => import("@/src/modules/company-launch-kit/components/premium/ui/CursorGlow").then((m) => m.CursorGlow),
    { ssr: false },
);

export function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-indigo-700 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
            >
                Skip to main content
            </a>
            <ScrollProgress />
            <CursorGlow />
            <PremiumHeader />
            <main id="main-content" className="premium-theme min-h-[60vh]">
                <PageTransition>{children}</PageTransition>
            </main>
            <PremiumFooter />
            <AnalyticsScripts />
        </>
    );
}
