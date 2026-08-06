"use client";

import Link from "next/link";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { AiExecutiveInsight } from "../types";

const priorityVariant: Record<AiExecutiveInsight["priority"], "error" | "warning" | "info"> = {
    P1: "error",
    P2: "warning",
    P3: "info",
};

const kindLabel: Record<AiExecutiveInsight["kind"], string> = {
    insight: "Insight",
    risk: "Risk",
    recommendation: "Action",
    opportunity: "Opportunity",
};

export function AiExecutiveInsightsPanel({ insights }: { insights: AiExecutiveInsight[] }) {
    return (
        <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                AI Executive Insights
            </h3>
            <div className="mt-4 space-y-3">
                {insights.length === 0 ? (
                    <EmptyState
                        className="border-0 bg-transparent p-4"
                        title="No insights yet"
                        description="Insights are generated from live KPIs, charts, and operational signals."
                    />
                ) : (
                    insights.map((insight) => (
                        <div
                            key={insight.id}
                            className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={priorityVariant[insight.priority]}>{insight.priority}</Badge>
                                <Badge variant="default">{kindLabel[insight.kind]}</Badge>
                            </div>
                            <p className="mt-2 font-medium text-[var(--dos-text-primary)]">{insight.title}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{insight.detail}</p>
                            {insight.actionHref && insight.actionLabel ? (
                                <Link
                                    href={insight.actionHref}
                                    className="mt-2 inline-block text-xs font-medium text-[var(--dos-brand-primary)] underline-offset-2 hover:underline"
                                >
                                    {insight.actionLabel} →
                                </Link>
                            ) : null}
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
