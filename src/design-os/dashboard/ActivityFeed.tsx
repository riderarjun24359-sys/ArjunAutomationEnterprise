"use client";

import { cn } from "@/src/lib/cn";

export interface ActivityItem { id: string; title: string; description: string; time: string; type?: "info" | "success" | "warning" }

export function ActivityFeed({ items, className }: { items: ActivityItem[]; className?: string }) {
    return (
        <ul className={cn("space-y-3", className)}>
            {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] p-3">
                    <div className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", item.type === "success" ? "bg-[var(--dos-success)]" : item.type === "warning" ? "bg-[var(--dos-warning)]" : "bg-[var(--dos-brand-primary)]")} />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                        <p className="text-xs text-[var(--dos-text-secondary)]">{item.description}</p>
                        <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.time}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
