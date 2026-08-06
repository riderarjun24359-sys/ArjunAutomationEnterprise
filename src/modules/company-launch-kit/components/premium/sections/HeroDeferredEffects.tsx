"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

const ParticleField = dynamic(
    () => import("@/src/modules/company-launch-kit/components/premium/ui/ParticleField").then((m) => m.ParticleField),
    { ssr: false },
);

/** Non-critical hero effects loaded after idle — keeps LCP off the main thread. */
export function HeroDeferredEffects() {
    const reduced = useReducedMotion();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (reduced) return;
        const schedule = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
        const id = schedule(() => setShow(true));
        return () => {
            if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
            else clearTimeout(id as number);
        };
    }, [reduced]);

    if (!show || reduced) return null;

    return <ParticleField className="absolute inset-0 h-full w-full opacity-35" count={24} />;
}
