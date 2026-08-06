"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { activityItem, staggerContainer } from "@/src/design-os/motion/variants";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export interface ActivityItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type?: "info" | "success" | "warning";
}

export function ActivityFeed({ items, className }: { items: ActivityItem[]; className?: string }) {
    const reduced = useReducedMotion();

    return (
        <m.ul
            className={cn("space-y-3", className)}
            variants={reduced ? undefined : staggerContainer}
            initial={reduced ? false : "hidden"}
            animate="visible"
        >
            {items.map((item) => (
                <m.li
                    key={item.id}
                    layout={!reduced}
                    variants={reduced ? undefined : activityItem}
                    className="dos-gpu flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] bg-[var(--dos-surface-elevated)] p-3 shadow-[var(--dos-elevation-1)] transition-shadow hover:shadow-[var(--dos-elevation-2)]"
                >
                    <div
                        className={cn(
                            "mt-1 h-2 w-2 shrink-0 rounded-full",
                            item.type === "success"
                                ? "bg-[var(--dos-success)]"
                                : item.type === "warning"
                                  ? "bg-[var(--dos-warning)]"
                                  : "bg-[var(--dos-brand-primary)]",
                        )}
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                        <p className="text-xs text-[var(--dos-text-secondary)]">{item.description}</p>
                        <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.time}</p>
                    </div>
                </m.li>
            ))}
        </m.ul>
    );
}
