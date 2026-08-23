"use client";

import Link from "next/link";
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import { Badge } from "@/src/design-os/components/Badge";
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
        <IntelligentContainer material="insight" className="border-[var(--dos-border-subtle)]">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--dos-text-tertiary)]">
                AI Executive Insights
            </h3>
            <div className="mt-6 space-y-4">
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
                            className="group relative rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] bg-[var(--dos-surface-foundation)]/50 p-4 transition-colors hover:border-[var(--dos-border)]"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={priorityVariant[insight.priority]}>{insight.priority}</Badge>
                                <Badge variant="default">{kindLabel[insight.kind]}</Badge>
                            </div>
                            <p className="mt-3 font-semibold text-[var(--dos-text-primary)]">{insight.title}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-[var(--dos-text-secondary)]">{insight.detail}</p>
                            {insight.actionHref && insight.actionLabel ? (
                                <Link
                                    href={insight.actionHref}
                                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)]"
                                >
                                    {insight.actionLabel}
                                    <span aria-hidden="true">→</span>
                                </Link>
                            ) : null}
                        </div>
                    ))
                )}
            </div>
        </IntelligentContainer>
    );
}
