"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { SuccessPlanItem } from "../../types/os";

export function SuccessPlansPanel({ items }: { items: SuccessPlanItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No success plans" description="Plans are built from CS engagements, onboarding milestones, and QBR reviews." />;
    }

    return (
        <div className="space-y-3">
            {items.map((plan) => (
                <Card key={plan.id}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{plan.title}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{plan.clientName} · Owner {plan.successOwner}</p>
                        </div>
                        <Badge variant="info">{plan.progressPercent}%</Badge>
                    </div>
                    <p className="mt-2 text-xs text-[var(--dos-text-secondary)]">Status: {plan.status}</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Goals</p>
                            <ul className="mt-1 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                                {plan.goals.map((g) => <li key={g}>• {g}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Milestones</p>
                            <ul className="mt-1 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                                {plan.milestones.length === 0 ? <li>No milestones</li> : plan.milestones.map((m) => <li key={m.name}>• {m.name} ({m.status})</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">AI Suggestions</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                            {plan.aiSuggestions.map((s) => <Badge key={s} variant="default">{s}</Badge>)}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
