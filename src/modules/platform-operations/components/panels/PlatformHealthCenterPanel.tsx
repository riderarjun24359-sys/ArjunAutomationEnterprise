"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function PlatformHealthCenterPanel() {
    const { state, loading } = usePlatformOperations();
    const { healthScore } = state;

    return (
        <div className="space-y-4">
            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>Live Health Score</p>
                        <p className="mt-1 text-3xl font-bold text-[var(--dos-text-primary)]">
                            {loading ? "—" : `${healthScore.score}%`}
                        </p>
                    </div>
                    <Badge variant={healthScore.overall === "healthy" ? "success" : healthScore.overall === "degraded" ? "warning" : "error"}>
                        {healthScore.overall}
                    </Badge>
                </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {healthScore.components.map((c) => (
                    <Card key={c.id} hover>
                        <p className="font-medium text-[var(--dos-text-primary)]">{c.name}</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                            {c.uptime.toFixed(1)}% uptime · {c.latencyMs}ms
                        </p>
                        <Badge className="mt-2" variant={c.status === "healthy" ? "success" : "warning"}>{c.status}</Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
