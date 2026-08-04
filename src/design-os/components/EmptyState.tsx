"use client";

import { cn } from "@/src/lib/cn";

export function EmptyState({ title, description, action, className }: { title: string; description: string; action?: React.ReactNode; className?: string }) {
    return (
        <div className={cn("rounded-[var(--dos-radius-2xl)] border border-dashed border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-8 text-center", className)}>
            <p className="font-semibold text-[var(--dos-text-primary)]">{title}</p>
            <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{description}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}
