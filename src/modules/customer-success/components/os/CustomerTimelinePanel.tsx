"use client";

import { useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { CustomerTimelineItem } from "../../types/os";

const SOURCES = ["all", "crm", "projects", "tasks", "meetings", "support", "billing", "notes", "activities"] as const;

export function CustomerTimelinePanel({ items }: { items: CustomerTimelineItem[] }) {
    const [source, setSource] = useState<(typeof SOURCES)[number]>("all");
    const filtered = source === "all" ? items : items.filter((i) => i.source === source);

    return (
        <Card>
            <div className="flex flex-wrap gap-1.5">
                {SOURCES.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setSource(s)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            source === s ? "bg-[var(--dos-brand-primary)] text-white" : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
            <div className="mt-4 max-h-[32rem] space-y-2 overflow-y-auto">
                {filtered.length === 0 ? (
                    <EmptyState className="border-0 bg-transparent p-4" title="No timeline events" description="CRM, projects, tasks, meetings, support, billing, notes, and activities unify here." />
                ) : (
                    filtered.map((item) => (
                        <div key={item.id} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                            <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                                <Badge variant="default">{item.source}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                            <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{item.relativeTime} · {item.clientName}</p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
