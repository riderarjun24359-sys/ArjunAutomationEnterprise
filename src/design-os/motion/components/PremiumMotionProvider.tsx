"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

/** Platform-wide lazy Framer Motion provider — keeps animation bundles deferred. */
export function PremiumMotionProvider({ children }: { children: React.ReactNode }) {
    const reduced = useReducedMotion();
    return (
        <LazyMotion features={domAnimation}>
            <MotionConfig reducedMotion={reduced ? "always" : "user"}>{children}</MotionConfig>
        </LazyMotion>
    );
}
