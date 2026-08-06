"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { ProgressIndicator } from "@/src/design-os/motion/components/ProgressIndicator";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function LoadingState({
    label = "Loading...",
    progress,
    className,
}: {
    label?: string;
    progress?: number;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <m.div
            className={cn(
                "flex flex-col items-center justify-center gap-4 rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-12 shadow-[var(--dos-elevation-1)]",
                className,
            )}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1" aria-hidden="true">
                    <span className="dos-thinking-dot" />
                    <span className="dos-thinking-dot" />
                    <span className="dos-thinking-dot" />
                </span>
                <span className="text-sm text-[var(--dos-text-secondary)]">{label}</span>
            </div>
            {typeof progress === "number" ? <ProgressIndicator value={progress} className="w-56" /> : <SkeletonLoader className="h-2 w-48" />}
        </m.div>
    );
}
