"use client";

import { cn } from "@/src/lib/cn";

export function Tabs({ tabs, active, onChange, className }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; className?: string }) {
    return (
        <div className={cn("flex gap-1 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-1", className)} role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active === tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "rounded-[var(--dos-radius-md)] px-4 py-2 text-sm font-medium transition",
                        active === tab.id
                            ? "bg-[var(--dos-surface-elevated)] text-[var(--dos-text-primary)] shadow-[var(--dos-shadow-sm)]"
                            : "text-[var(--dos-text-secondary)] hover:text-[var(--dos-text-primary)]",
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
