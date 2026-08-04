import type { ReactNode } from "react";
import { MarketingHeader } from "@/src/modules/company-launch-kit/components/MarketingHeader";
import { MarketingFooter } from "@/src/modules/company-launch-kit/components/MarketingFooter";
import { AnalyticsScripts } from "@/src/modules/company-launch-kit/components/AnalyticsScripts";

export function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-indigo-700 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
            >
                Skip to main content
            </a>
            <MarketingHeader />
            <main id="main-content" className="min-h-[60vh] bg-white text-slate-900">
                {children}
            </main>
            <MarketingFooter />
            <AnalyticsScripts />
        </>
    );
}
