"use client";

import { useReducedMotion } from "./useReducedMotion";
import { motion as motionTokens } from "@/src/design-os/tokens/motion";

export function useStagger(itemCount: number, delay: keyof typeof motionTokens.stagger = "normal") {
    const reduced = useReducedMotion();
    const staggerDelay = motionTokens.stagger[delay];

    return {
        containerProps: reduced
            ? { initial: "visible", animate: "visible" }
            : { initial: "hidden", animate: "visible", transition: { staggerChildren: staggerDelay } },
        itemProps: (index: number) =>
            reduced
                ? {}
                : { transition: { delay: index * staggerDelay } },
        reduced,
    };
}
