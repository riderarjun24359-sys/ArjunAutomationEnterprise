import type { ReactNode } from "react";
import { MarketingFooterStatic } from "@/src/modules/company-launch-kit/components/MarketingFooterStatic";
import { MarketingHeaderStatic } from "@/src/modules/company-launch-kit/components/MarketingHeaderStatic";
import { WhatsAppFloat } from "@/src/modules/company-launch-kit/components/WhatsAppFloat";
import { AnalyticsScripts } from "@/src/modules/company-launch-kit/components/AnalyticsScripts";

export function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="premium-theme min-h-screen">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--dos-brand-primary)] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
            >
                Skip to main content
            </a>
            <MarketingHeaderStatic />
            <main id="main-content" className="min-h-[60vh]">
                {children}
            </main>
            <MarketingFooterStatic />
            {/* Renders nothing until a real phone number / analytics ID is configured. */}
            <WhatsAppFloat />
            <AnalyticsScripts />
        </div>
    );
}
