"use client";

import { cn } from "@/src/lib/cn";

export function ProgressIndicator({
    value,
    label,
    className,
}: {
    value: number;
    label?: string;
    className?: string;
}) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    return (
        <div className={cn("w-full", className)} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Progress"}>
            {label ? <div className="mb-2 flex items-center justify-between text-xs text-[var(--dos-text-secondary)]"><span>{label}</span><span>{clamped}%</span></div> : null}
            <div className="h-2 overflow-hidden rounded-full bg-[var(--dos-surface-tertiary)]">
                <div
                    className="dos-gpu h-full rounded-full bg-[var(--dos-brand-primary)] transition-[width] duration-[var(--dos-duration-normal)] ease-[var(--dos-easing-default)]"
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    );
}
