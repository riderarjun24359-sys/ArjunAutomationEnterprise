"use client";

import { Search } from "lucide-react";
import { cn } from "@/src/lib/cn";

export function SmartSearch({ className, onFocus }: { className?: string; onFocus?: () => void }) {
    return (
        <label className={cn("relative block", className)}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dos-text-tertiary)]" />
            <input
                type="search"
                placeholder="Search modules, records, and actions..."
                onFocus={onFocus}
                className="w-full rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--dos-border-focus)] focus:ring-2 focus:ring-[var(--dos-border-focus)]/20"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--dos-border)] px-1.5 py-0.5 text-[10px] text-[var(--dos-text-tertiary)] sm:inline">⌘K</kbd>
        </label>
    );
}
