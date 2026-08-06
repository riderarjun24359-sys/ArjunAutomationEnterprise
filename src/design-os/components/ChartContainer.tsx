"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { chartReveal } from "@/src/design-os/motion/variants";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function ChartContainer({
    title,
    description,
    children,
    className,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <m.div
            className={cn(
                "dos-gpu rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-6 shadow-[var(--dos-elevation-1)]",
                className,
            )}
            variants={reduced ? undefined : chartReveal}
            initial={reduced ? false : "hidden"}
            animate="visible"
        >
            {title ? <h3 className="text-base font-semibold text-[var(--dos-text-primary)]">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{description}</p> : null}
            <div className="mt-4 [&_.recharts-cartesian-grid_line]:stroke-[var(--dos-border-subtle)] [&_.recharts-text]:fill-[var(--dos-text-secondary)]">
                {children}
            </div>
        </m.div>
    );
}
