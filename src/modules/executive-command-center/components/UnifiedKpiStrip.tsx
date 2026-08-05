"use client";

import { Card } from "@/src/design-os/components/Card";
import type { ExecutiveKpi } from "../types";

const toneClass: Record<NonNullable<ExecutiveKpi["tone"]>, string> = {
    accent: "text-[var(--dos-brand-primary)]",
    warning: "text-amber-600",
    success: "text-emerald-600",
    neutral: "text-[var(--dos-text-primary)]",
};

export function UnifiedKpiStrip({ kpis }: { kpis: ExecutiveKpi[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
