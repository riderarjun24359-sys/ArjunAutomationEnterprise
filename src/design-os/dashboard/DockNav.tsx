"use client";

import { cn } from "@/src/lib/cn";

export function DockNav({ items, className }: { items: { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }[]; className?: string }) {
    return (
        <nav className={cn("dos-glass fixed bottom-6 left-1/2 z-[var(--dos-z-sticky)] flex -translate-x-1/2 gap-1 rounded-[var(--dos-radius-full)] border border-[var(--dos-border)] p-1.5 shadow-[var(--dos-shadow-lg)]", className)}>
            {items.map((item) => (
                <button key={item.label} type="button" onClick={item.onClick} className={cn("flex flex-col items-center gap-0.5 rounded-[var(--dos-radius-full)] px-4 py-2 text-xs transition", item.active ? "bg-[var(--dos-brand-primary)] text-white" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)]")} aria-label={item.label}>
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
