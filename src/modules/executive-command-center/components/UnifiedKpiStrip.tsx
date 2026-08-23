"use client";

import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import type { ExecutiveKpi } from "../types";

const toneClass: Record<NonNullable<ExecutiveKpi["tone"]>, string> = {
    accent: "text-[var(--dos-brand-primary)]",
    warning: "text-[var(--dos-text-warning)]",
    success: "text-[var(--dos-text-success)]",
    neutral: "text-[var(--dos-text-primary)]",
};

export function UnifiedKpiStripSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-busy="true" aria-label="Loading live statistics">
            {Array.from({ length: 5 }).map((_, i) => (
                <IntelligentContainer key={i} material="base">
                    <SkeletonLoader className="h-3 w-24" />
                    <SkeletonLoader className="mt-3 h-8 w-16" />
                    <SkeletonLoader className="mt-2 h-3 w-32" />
                </IntelligentContainer>
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
            <IntelligentContainer material="base">
                <EmptyState
                    className="border-0 bg-transparent p-4"
                    title="No live statistics yet"
                    description="Client, project, task, lead, and revenue metrics will appear here once Supabase data is available for your organization."
                />
            </IntelligentContainer>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {kpis.map((kpi) => (
                <IntelligentContainer key={kpi.title} material="base" className="p-5">
                    <p className="text-xs uppercase tracking-widest text-[var(--dos-text-tertiary)]">{kpi.title}</p>
                    <p className={`mt-2 text-2xl font-semibold tracking-tight ${toneClass[kpi.tone ?? "neutral"]}`}>{kpi.value}</p>
                    <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{kpi.detail}</p>
                </IntelligentContainer>
            ))}
        </div>
    );
}
