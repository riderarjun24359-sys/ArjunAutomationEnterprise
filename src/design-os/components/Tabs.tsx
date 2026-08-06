"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function Tabs({
    tabs,
    active,
    onChange,
    className,
}: {
    tabs: { id: string; label: string }[];
    active: string;
    onChange: (id: string) => void;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <div
            className={cn("relative flex gap-1 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-1", className)}
            role="tablist"
        >
            {tabs.map((tab) => {
                const selected = active === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "dos-focus-ring relative z-10 rounded-[var(--dos-radius-md)] px-4 py-2 text-sm font-medium transition-colors",
                            selected ? "text-[var(--dos-text-primary)]" : "text-[var(--dos-text-secondary)] hover:text-[var(--dos-text-primary)]",
                        )}
                    >
                        {selected && !reduced ? (
                            <m.span
                                layoutId="dos-tab-indicator"
                                className="absolute inset-0 -z-10 rounded-[var(--dos-radius-md)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-elevation-1)]"
                                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                        ) : null}
                        {selected && reduced ? (
                            <span className="absolute inset-0 -z-10 rounded-[var(--dos-radius-md)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-elevation-1)]" />
                        ) : null}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
