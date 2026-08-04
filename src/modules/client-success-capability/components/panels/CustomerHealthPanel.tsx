"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";

export function CustomerHealthPanel() {
    const { health } = useClientSuccessCapability();

    if (!health) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to view health metrics.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Customer Health</h2>
                <p className="text-sm text-[var(--dos-text-secondary)]">Health score, CSAT, engagement, renewal probability, and risk alerts.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <KpiCard title="Health Score" value={health.healthScore} suffix="/100" trend={health.trends[0]?.direction === "up" ? "up" : undefined} trendLabel={`${health.trends[0]?.value ?? 0}%`} />
                <KpiCard title="CSAT" value={Math.round(health.csat * 10)} suffix="/50" />
                <KpiCard title="Engagement" value={health.engagement} suffix="%" />
                <KpiCard title="Renewal Probability" value={health.renewalProbability} suffix="%" />
            </div>

            {health.riskAlerts.length > 0 && (
                <Card>
                    <h3 className="mb-3 font-semibold text-[var(--dos-error)]">Risk Alerts</h3>
                    {health.riskAlerts.map((alert) => (
                        <div key={alert.id} className="mb-2 flex items-center gap-2">
                            <Badge variant={alert.severity === "high" ? "error" : alert.severity === "medium" ? "warning" : "default"}>{alert.severity}</Badge>
                            <span className="text-sm">{alert.message}</span>
                        </div>
                    ))}
                </Card>
            )}

            <Card>
                <h3 className="mb-3 font-semibold">Trends</h3>
                {health.trends.map((t) => (
                    <div key={t.metric} className="mb-2 flex justify-between">
                        <span>{t.metric}</span>
                        <Badge variant={t.direction === "up" ? "success" : t.direction === "down" ? "error" : "default"}>
                            {t.direction} {Math.abs(t.value)}%
                        </Badge>
                    </div>
                ))}
            </Card>
        </div>
    );
}
