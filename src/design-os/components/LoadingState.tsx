"use client";

import { cn } from "@/src/lib/cn";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";

export function LoadingState({ label = "Loading...", className }: { label?: string; className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-4 rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-12", className)}>
            <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--dos-brand-primary)]" />
                <span className="text-sm text-[var(--dos-text-secondary)]">{label}</span>
            </div>
            <SkeletonLoader className="h-2 w-48" />
        </div>
    );
}
