"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function EmptyState({
    title,
    description,
    action,
    className,
}: {
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <m.div
            className={cn(
                "rounded-[var(--dos-radius-2xl)] border border-dashed border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-8 text-center",
                className,
            )}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <p className="font-semibold text-[var(--dos-text-primary)]">{title}</p>
            <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{description}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </m.div>
    );
}
