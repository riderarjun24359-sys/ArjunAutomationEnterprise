"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function CostUsageCenterPanel() {
    const { state, loading } = useAiFoundation();

    return (
        <div className="space-y-4">
            <Card>
                <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Total Cost</p>
                <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                    {loading ? "—" : `₹${state.dashboard.totalCostUsd.toFixed(2)}`}
                </p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.costUsage.map((c) => (
                    <Card key={c.id} hover>
                        <p className="font-medium text-[var(--dos-text-primary)]">{c.model}</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                            {(c.tokens / 1000).toFixed(0)}K tokens · {c.requests} requests
                        </p>
                        <Badge className="mt-2" variant="info">${c.costUsd.toFixed(2)} · {c.department}</Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
