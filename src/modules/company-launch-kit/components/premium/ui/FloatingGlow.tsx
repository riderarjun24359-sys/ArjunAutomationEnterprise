"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type FloatingGlowProps = {
    className?: string;
    color?: string;
};

export function FloatingGlow({ className, color = "rgba(99,102,241,0.3)" }: FloatingGlowProps) {
    const reduced = useReducedMotion();

    return (
        <motion.div
            className={cn("pointer-events-none absolute rounded-full blur-[60px]", className)}
            style={{ background: color }}
            animate={reduced ? undefined : { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
        />
    );
}
