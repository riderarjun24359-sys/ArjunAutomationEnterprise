"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MarketingFooterChrome, MarketingHeaderChrome } from "@/src/modules/company-launch-kit/components/MarketingChrome";

/** Defers interactive header/footer until idle — tiny client boundary. */
export function MarketingDeferredChrome({ children }: { children: ReactNode }) {
    const [showHeader, setShowHeader] = useState(false);
    const [showFooter, setShowFooter] = useState(false);

    useEffect(() => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 800));
        const headerTimer = idle(() => setShowHeader(true));
        const footerTimer = window.setTimeout(() => setShowFooter(true), 2500);
        return () => {
            if (window.cancelIdleCallback) window.cancelIdleCallback(headerTimer as number);
            clearTimeout(footerTimer);
        };
    }, []);

    return (
        <>
            {showHeader ? <MarketingHeaderChrome /> : <MarketingHeaderPlaceholder />}
            {children}
            {showFooter ? <MarketingFooterChrome /> : null}
        </>
    );
}

function MarketingHeaderPlaceholder() {
    return (
        <header className="sticky top-0 z-50 bg-transparent">
            <div className="premium-container flex items-center justify-between py-4">
                <span className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">AA</span>
                    <span className="font-display text-lg font-semibold">Arjun Automation</span>
                </span>
            </div>
        </header>
    );
}
