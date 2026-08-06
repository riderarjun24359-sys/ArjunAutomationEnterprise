"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { AiCrmInsight } from "../types/enterprise";

const priorityVariant: Record<AiCrmInsight["priority"], "error" | "warning" | "info"> = {
    P1: "error",
    P2: "warning",
    P3: "info",
};

const kindLabel: Record<AiCrmInsight["kind"], string> = {
    next_best_action: "Next best action",
    follow_up: "Follow-up",
    churn_risk: "Churn risk",
    upsell: "Upsell",
    health: "Health",
};

export function AiCrmAssistantPanel({
    insights,
    onOpenClient,
}: {
    insights: AiCrmInsight[];
    onOpenClient?: (clientId: string) => void;
}) {
    return (
        <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">AI CRM Assistant</h3>
            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Next actions, follow-ups, churn risk, upsell, and health signals from live KPIs</p>
            <div className="mt-4 space-y-3">
                {insights.length === 0 ? (
                    <EmptyState className="border-0 bg-transparent p-4" title="No AI insights" description="Insights appear once clients, leads, and activity exist in Supabase." />
                ) : (
                    insights.map((insight) => (
                        <div key={insight.id} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant={priorityVariant[insight.priority]}>{insight.priority}</Badge>
                                <Badge variant="default">{kindLabel[insight.kind]}</Badge>
                                {typeof insight.healthScore === "number" ? <Badge variant="info">Health {insight.healthScore}</Badge> : null}
                            </div>
                            <p className="mt-2 font-medium text-[var(--dos-text-primary)]">{insight.title}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{insight.detail}</p>
                            {insight.clientId && onOpenClient ? (
                                <button
                                    type="button"
                                    className="mt-2 text-xs font-medium text-[var(--dos-brand-primary)]"
                                    onClick={() => onOpenClient(insight.clientId!)}
                                >
                                    {insight.actionLabel ?? "Open client"} →
                                </button>
                            ) : null}
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
