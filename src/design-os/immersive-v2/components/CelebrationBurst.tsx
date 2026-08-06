"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { celebrationBurst } from "../variants";
import { cn } from "@/src/lib/cn";

export function CelebrationBurst({
    active,
    className,
}: {
    active: boolean;
    className?: string;
}) {
    const reduced = useReducedMotion();
    if (!active || reduced) return null;

    return (
        <m.div
            className={cn("immersive-celebration pointer-events-none absolute inset-0 flex items-center justify-center", className)}
            variants={celebrationBurst}
            initial="hidden"
            animate="visible"
            aria-hidden="true"
        >
            <span className="h-24 w-24 rounded-full bg-[var(--dos-success)]/25 blur-2xl" />
            <span className="absolute h-3 w-3 rounded-full bg-[var(--dos-brand-primary)]" />
            <span className="absolute translate-x-8 -translate-y-6 h-2 w-2 rounded-full bg-[var(--dos-brand-secondary)]" />
            <span className="absolute -translate-x-10 translate-y-4 h-2.5 w-2.5 rounded-full bg-[var(--dos-brand-accent)]" />
        </m.div>
    );
}
