"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { IMMERSIVE_PERFORMANCE } from "../constants";

/** Applies immersive performance CSS flags; never invents business data. */
export function useImmersivePerformance() {
    const reduced = useReducedMotion();

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.immersiveV2 = "1";
        root.dataset.immersiveFps = String(IMMERSIVE_PERFORMANCE.targetFps);
        root.dataset.immersiveGpu = IMMERSIVE_PERFORMANCE.preferGpu ? "1" : "0";
        root.dataset.immersiveReduced = reduced ? "1" : "0";
        return () => {
            delete root.dataset.immersiveV2;
            delete root.dataset.immersiveFps;
            delete root.dataset.immersiveGpu;
            delete root.dataset.immersiveReduced;
        };
    }, [reduced]);

    return {
        reduced,
        targetFps: IMMERSIVE_PERFORMANCE.targetFps,
        preferGpu: IMMERSIVE_PERFORMANCE.preferGpu,
        zeroLayoutShift: IMMERSIVE_PERFORMANCE.zeroLayoutShift,
    };
}
