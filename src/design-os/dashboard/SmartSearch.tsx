"use client";

import { Search } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { useExecutiveShellStore } from "@/src/store/executive.store";

export function SmartSearch({ className }: { className?: string; onFocus?: () => void }) {
    const setOpen = useExecutiveShellStore((s) => s.setCommandPaletteOpen);

    return (
        <label className={cn("relative block", className)}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dos-text-tertiary)]" />
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] py-2.5 pl-10 pr-4 text-left text-sm text-[var(--dos-text-tertiary)] outline-none transition hover:border-[var(--dos-border-focus)] focus:border-[var(--dos-border-focus)] focus:ring-2 focus:ring-[var(--dos-border-focus)]/20"
            >
                Search clients, projects, invoices, tasks, knowledge...
            </button>
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--dos-border)] px-1.5 py-0.5 text-[10px] text-[var(--dos-text-tertiary)] sm:inline">⌘K</kbd>
        </label>
    );
}
