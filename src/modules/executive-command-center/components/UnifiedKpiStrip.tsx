"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import type { ExecutiveKpi } from "../types";

const toneClass: Record<NonNullable<ExecutiveKpi["tone"]>, string> = {
    accent: "text-[var(--dos-brand-primary)]",
    warning: "text-amber-600",
    success: "text-emerald-600",
    neutral: "text-[var(--dos-text-primary)]",
};

export function UnifiedKpiStripSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-busy="true" aria-label="Loading live statistics">
            {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                    <SkeletonLoader className="h-3 w-24" />
                    <SkeletonLoader className="mt-3 h-8 w-16" />
                    <SkeletonLoader className="mt-2 h-3 w-32" />
                </Card>
            ))}
        </div>
    );
}

export function UnifiedKpiStrip({
    kpis,
    empty = false,
}: {
    kpis: ExecutiveKpi[];
    empty?: boolean;
}) {
    if (empty || kpis.length === 0) {
        return (
            <EmptyState
                title="No live statistics yet"
                description="Client, project, task, lead, and revenue metrics will appear here once Supabase data is available for your organization."
            />
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {kpis.map((kpi) => (
                <Card key={kpi.title} hover>
                    <p className="text-sm text-[var(--dos-text-secondary)]">{kpi.title}</p>
                    <p className={`mt-1 text-2xl font-bold ${toneClass[kpi.tone ?? "neutral"]}`}>{kpi.value}</p>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{kpi.detail}</p>
                </Card>
            ))}
        </div>
    );
}
