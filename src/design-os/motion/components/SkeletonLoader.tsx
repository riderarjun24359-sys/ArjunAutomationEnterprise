"use client";

import { cn } from "@/src/lib/cn";

export function SkeletonLoader({ className }: { className?: string }) {
    return (
        <div
            className={cn("animate-pulse rounded-[var(--dos-radius-lg)] bg-[var(--dos-surface-tertiary)]", className)}
            aria-hidden="true"
        />
    );
}
