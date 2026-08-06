"use client";

import { useEffect, useState, type ComponentType } from "react";

/** Loads below-fold home sections after load + idle — keeps TBT off the critical path. */
export function DeferredHomeSections() {
    const [Sections, setSections] = useState<ComponentType | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = () => {
            void import("@/src/modules/company-launch-kit/components/premium/PremiumHomeSections").then((mod) => {
                if (!cancelled) setSections(() => mod.PremiumHomeSections);
            });
        };

        const schedule = () => {
            if (window.requestIdleCallback) {
                window.requestIdleCallback(load, { timeout: 8000 });
            } else {
                window.setTimeout(load, 5000);
            }
        };

        if (document.readyState === "complete") {
            schedule();
        } else {
            window.addEventListener("load", schedule, { once: true });
        }

        return () => {
            cancelled = true;
        };
    }, []);

    return Sections ? <Sections /> : null;
}
