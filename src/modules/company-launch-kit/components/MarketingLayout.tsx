import type { ReactNode } from "react";
import { MarketingFooterStatic } from "@/src/modules/company-launch-kit/components/MarketingFooterStatic";
import { MarketingHeaderStatic } from "@/src/modules/company-launch-kit/components/MarketingHeaderStatic";
import { WhatsAppFloat } from "@/src/modules/company-launch-kit/components/WhatsAppFloat";
import { CookieConsent } from "@/src/modules/company-launch-kit/components/consent/CookieConsent";
import { MobileBottomBar } from "@/src/modules/company-launch-kit/components/MobileBottomBar";

export function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="premium-theme min-h-screen bg-white text-slate-900">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
            >
                Skip to main content
            </a>
            <MarketingHeaderStatic />
            <main id="main-content" className="aa-page-content min-h-[60vh] pb-16 sm:pb-0">
                {children}
            </main>
            <MarketingFooterStatic />
            <WhatsAppFloat />
            <MobileBottomBar />
            <CookieConsent />
        </div>
    );
}
