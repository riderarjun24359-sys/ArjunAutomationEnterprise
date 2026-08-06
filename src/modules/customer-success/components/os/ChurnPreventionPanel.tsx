"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { ChurnPreventionItem } from "../../types/os";

export function ChurnPreventionPanel({ items }: { items: ChurnPreventionItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No churn risks" description="Churn predictions and low-health customers surface here." />;
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[var(--dos-text-primary)]">{item.clientName}</p>
                        <Badge variant="error">Risk {item.riskScore}</Badge>
                        <Badge variant="warning">{item.escalationLevel}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.aiExplanation}</p>
                    <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">Factors: {item.riskFactors.join(" · ") || "—"}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.recommendedActions.map((a) => <Badge key={a} variant="default">{a}</Badge>)}
                    </div>
                </Card>
            ))}
        </div>
    );
}
