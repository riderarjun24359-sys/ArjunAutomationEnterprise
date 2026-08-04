"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useMissionCore } from "../../hooks/useMissionCore";

export function HealthDashboardPanel() {
    const { health, capabilityHealths, loading } = useMissionCore();

    if (loading || !health) {
        return <p className="text-sm text-[var(--dos-text-secondary)]">Loading health data…</p>;
    }

    const healthyCount = capabilityHealths.filter((h) => h.status === "healthy").length;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
                <KpiCard title="Overall Status" value={health.overall === "healthy" ? 100 : health.overall === "degraded" ? 70 : 40} suffix="%" trend={health.overall === "healthy" ? "up" : "down"} trendLabel={health.overall} />
                <KpiCard title="Healthy Capabilities" value={healthyCount} trend="up" trendLabel={`of ${capabilityHealths.length}`} />
                <KpiCard title="Active Queues" value={health.queues.length} trend="up" trendLabel="Monitored" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {capabilityHealths.map((h) => (
                    <Card key={h.capabilityId}>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-[var(--dos-text-primary)]">{h.capabilityId}</span>
                            <Badge variant={h.status === "healthy" ? "success" : h.status === "degraded" ? "warning" : "error"}>
                                {h.status}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Uptime: {h.uptime}%</p>
                        {h.message && <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{h.message}</p>}
                    </Card>
                ))}
            </div>

            <Card>
                <h3 className="mb-3 font-semibold text-[var(--dos-text-primary)]">Queue Status</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {health.queues.map((q) => (
                        <div key={q.name} className="rounded-lg border border-[var(--dos-border-subtle)] p-3">
                            <p className="font-medium text-[var(--dos-text-primary)]">{q.name}</p>
                            <p className="text-sm text-[var(--dos-text-secondary)]">
                                Pending: {q.pending} · Processing: {q.processing} · Failed: {q.failed}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
