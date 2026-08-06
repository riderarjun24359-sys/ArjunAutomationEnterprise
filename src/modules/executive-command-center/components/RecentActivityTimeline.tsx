"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { filterActivityTimeline } from "../services/activity-timeline.service";
import type { ActivityModuleFilter, ActivityTimelineItem } from "../types";

const FILTERS: Array<{ id: "all" | ActivityModuleFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "crm", label: "CRM" },
    { id: "projects", label: "Projects" },
    { id: "tasks", label: "Tasks" },
    { id: "finance", label: "Finance" },
    { id: "system", label: "System" },
];

export function RecentActivityTimeline({ items }: { items: ActivityTimelineItem[] }) {
    const [module, setModule] = useState<"all" | ActivityModuleFilter>("all");
    const filtered = filterActivityTimeline(items, module);

    return (
        <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                    Recent Activity Timeline
                </h3>
                <div className="flex flex-wrap gap-1.5">
                    {FILTERS.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setModule(f.id)}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                                module === f.id
                                    ? "bg-[var(--dos-brand-primary)] text-white"
                                    : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-secondary)]"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 max-h-[28rem] space-y-0 overflow-y-auto">
                {filtered.length === 0 ? (
                    <EmptyState
                        className="border-0 bg-transparent p-4"
                        title="No activity yet"
                        description="Live activity and audit events from Supabase will appear here."
                    />
                ) : (
                    <ol className="relative border-l border-[var(--dos-border)] pl-4">
                        {filtered.map((item) => (
                            <li key={item.id} className="relative mb-4 ml-1">
                                <span className="absolute -left-[1.4rem] mt-1.5 h-3 w-3 rounded-full border border-[var(--dos-border)] bg-[var(--dos-brand-primary)]" />
                                <div className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <p className="font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                                        <Badge variant="default">{item.module}</Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                                    <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                                        {item.relativeTime} · {item.source}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
            <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                Need more context?{" "}
                <Link href="/analytics" className="text-[var(--dos-brand-primary)] underline-offset-2 hover:underline">
                    Open analytics
                </Link>
            </p>
        </Card>
    );
}
