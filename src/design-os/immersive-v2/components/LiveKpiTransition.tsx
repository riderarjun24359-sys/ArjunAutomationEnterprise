"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { AnimatedCounter } from "@/src/design-os/motion/components/AnimatedCounter";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { liveKpiGlow } from "../variants";
import { cn } from "@/src/lib/cn";

/** Smooth KPI value transition chrome — displays provided live values only. */
export function LiveKpiTransition({
    label,
    value,
    suffix,
    className,
}: {
    label: string;
    value: number;
    suffix?: string;
    className?: string;
}) {
    const reduced = useReducedMotion();
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        if (reduced) return;
        const start = window.setTimeout(() => setPulse(true), 0);
        const stop = window.setTimeout(() => setPulse(false), 850);
        return () => {
            window.clearTimeout(start);
            window.clearTimeout(stop);
        };
    }, [value, reduced]);

    return (
        <m.div
            className={cn(
                "immersive-live-kpi dos-gpu rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border-subtle)] bg-[var(--dos-glass-bg)] p-4 backdrop-blur-md",
                className,
            )}
            variants={reduced ? undefined : liveKpiGlow}
            animate={pulse ? "update" : "rest"}
        >
            <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--dos-text-primary)]">
                <AnimatedCounter value={value} suffix={suffix} />
            </p>
        </m.div>
    );
}
