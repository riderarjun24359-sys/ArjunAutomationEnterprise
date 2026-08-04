"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/cn";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <select
                className={cn(
                    "h-10 w-full appearance-none rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 pr-10 text-sm text-[var(--dos-text-primary)] outline-none focus:border-[var(--dos-border-focus)]",
                    className,
                )}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dos-text-tertiary)]" />
        </div>
    );
}
