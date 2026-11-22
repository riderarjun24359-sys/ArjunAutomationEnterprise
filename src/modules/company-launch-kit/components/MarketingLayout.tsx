import type { ReactNode } from "react";
import { MarketingFooterStatic } from "@/src/modules/company-launch-kit/components/MarketingFooterStatic";
import { MarketingHeader } from "@/src/modules/company-launch-kit/components/MarketingHeader";
import { WhatsAppFloat } from "@/src/modules/company-launch-kit/components/WhatsAppFloat";

export function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="premium-theme min-h-screen pb-2">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white focus:outline-none">Skip to content</a>
            <MarketingHeader />
            <main id="main-content" className="min-h-[60vh]">{children}</main>
            <MarketingFooterStatic />
            <WhatsAppFloat />
        </div>
    );
}
