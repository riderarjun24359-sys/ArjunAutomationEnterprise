"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { cn } from "@/src/lib/cn";

/** Premium empty-state shell with interactive onboarding moment affordance. */
export function DelightEmptyState({
    title,
    description,
    action,
    momentLabel = "Start here",
    className,
}: {
    title: string;
    description: string;
    action?: React.ReactNode;
    momentLabel?: string;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <div className={cn("immersive-delight-empty relative", className)}>
            {!reduced ? (
                <m.div
                    className="pointer-events-none absolute -inset-1 rounded-[var(--dos-radius-3xl)] bg-gradient-to-br from-[var(--dos-brand-primary)]/10 via-transparent to-[var(--dos-brand-secondary)]/10"
                    animate={{ opacity: [0.45, 0.8, 0.45] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden="true"
                />
            ) : null}
            <EmptyState
                title={title}
                description={description}
                action={
                    action ?? (
                        <span className="inline-flex items-center rounded-[var(--dos-radius-full)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--dos-text-secondary)]">
                            {momentLabel}
                        </span>
                    )
                }
                className="relative"
            />
        </div>
    );
}
