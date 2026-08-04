"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useAiFoundation } from "../../hooks/useAiFoundation";
import { AI_FOUNDATION_THEME } from "../../constants";

export function ExecutiveDashboardPanel() {
    const { state, loading } = useAiFoundation();
    const { dashboard } = state;

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card hover>
                    <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>AI Health</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{loading ? "—" : `${dashboard.aiHealthScore}%`}</p>
                </Card>
                <Card hover>
                    <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Active Agents</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{loading ? "—" : dashboard.activeAgents}</p>
                </Card>
                <Card hover>
                    <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Quality Score</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{loading ? "—" : `${dashboard.qualityScore}%`}</p>
                </Card>
                <Card hover>
                    <p className={`text-sm font-medium ${AI_FOUNDATION_THEME.text}`}>Total Cost</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{loading ? "—" : `$${dashboard.totalCostUsd.toFixed(2)}`}</p>
                </Card>
            </div>
            <Card>
                <div className="flex items-center justify-between">
                    <p className="font-medium text-[var(--dos-text-primary)]">Model Health</p>
                    <Badge variant={dashboard.modelHealth === "healthy" ? "success" : dashboard.modelHealth === "degraded" ? "warning" : "error"}>
                        {dashboard.modelHealth}
                    </Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                    {(dashboard.totalTokens / 1000000).toFixed(2)}M tokens · Risk score {dashboard.riskScore}
                </p>
            </Card>
        </div>
    );
}
