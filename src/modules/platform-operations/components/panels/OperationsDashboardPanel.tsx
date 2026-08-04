"use client";

import { Card } from "@/src/design-os/components/Card";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function OperationsDashboardPanel() {
    const { state, loading } = usePlatformOperations();
    const d = state.dashboard;

    const stats = [
        { label: "Reliability Score", value: `${d.reliabilityScore}%` },
        { label: "Health Score", value: `${d.healthScore}%` },
        { label: "Active Incidents", value: d.activeIncidents },
        { label: "Open Errors", value: d.openErrors },
        { label: "Queue Backlog", value: d.queueBacklog },
        { label: "Backup Success", value: `${d.backupSuccessRate}%` },
        { label: "Avg Response", value: `${d.avgResponseTimeMs}ms` },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.label} hover>
                    <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">
                        {loading ? "—" : stat.value}
                    </p>
                </Card>
            ))}
            <Card className="sm:col-span-2 lg:col-span-3">
                <p className="text-sm text-[var(--dos-text-secondary)]">Last checked: {d.lastCheckedAt}</p>
            </Card>
        </div>
    );
}
