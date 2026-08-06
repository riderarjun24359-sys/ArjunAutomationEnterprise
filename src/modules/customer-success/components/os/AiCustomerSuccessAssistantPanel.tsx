"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { AiCustomerSuccessAssistant } from "../../types/os";

export function AiCustomerSuccessAssistantPanel({ assistant }: { assistant: AiCustomerSuccessAssistant }) {
    if (!assistant.dailySummary) {
        return <EmptyState title="No AI summary" description="Assistant output is generated from the live Customer Success snapshot." />;
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Daily Summary</h3>
                <p className="mt-3 text-sm text-[var(--dos-text-primary)]">{assistant.dailySummary}</p>
                <p className="mt-3 text-xs text-[var(--dos-text-tertiary)]">Generated {new Date(assistant.generatedAt).toLocaleString()}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Executive Summary</h3>
                <p className="mt-3 text-sm text-[var(--dos-text-primary)]">{assistant.executiveSummary}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Customers Needing Attention</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {assistant.customersNeedingAttention.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-tertiary)]">None right now</p>
                    ) : (
                        assistant.customersNeedingAttention.map((c) => <Badge key={c} variant="warning">{c}</Badge>)
                    )}
                </div>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Health Insights</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.healthInsights.map((h) => <li key={h}>• {h}</li>)}
                </ul>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Renewal Recommendations</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.renewalRecommendations.map((h) => <li key={h}>• {h}</li>)}
                </ul>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Expansion Recommendations</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.expansionRecommendations.map((h) => <li key={h}>• {h}</li>)}
                </ul>
            </Card>
        </div>
    );
}
