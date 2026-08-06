"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { PerformanceReviewItem } from "../../types/os";

export function PerformancePanel({ items }: { items: PerformanceReviewItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No performance reviews" description="KPI/OKR reviews load from live performance_reviews in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.employeeName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.reviewPeriod}</p>
                        </div>
                        <Badge variant={item.kpiScore >= 80 ? "success" : item.kpiScore >= 60 ? "warning" : "error"}>
                            KPI {item.kpiScore}
                        </Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.okrSummary}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Rating {item.rating}</span>
                        <span>Status {item.status}</span>
                        <span className="col-span-2">Reviewer {item.reviewerName ?? "—"}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
