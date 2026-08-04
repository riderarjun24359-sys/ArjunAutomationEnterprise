"use client";

import { cn } from "@/src/lib/cn";

export function ChartContainer({ title, description, children, className }: { title?: string; description?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-6 shadow-[var(--dos-shadow-sm)]", className)}>
            {title ? <h3 className="text-base font-semibold text-[var(--dos-text-primary)]">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{description}</p> : null}
            <div className="mt-4 [&_.recharts-cartesian-grid_line]:stroke-[var(--dos-border-subtle)] [&_.recharts-text]:fill-[var(--dos-text-secondary)]">
                {children}
            </div>
        </div>
    );
}
