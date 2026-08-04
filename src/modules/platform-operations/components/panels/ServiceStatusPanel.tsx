"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function ServiceStatusPanel() {
    const { state, loading } = usePlatformOperations();

    return (
        <div className="space-y-4">
            {state.incidents.length > 0 && (
                <Card>
                    <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>Active Incidents</p>
                    {state.incidents.map((inc) => (
                        <div key={inc.id} className="mt-2 flex items-center justify-between">
                            <span className="text-[var(--dos-text-primary)]">{inc.title}</span>
                            <Badge variant={inc.severity === "critical" ? "error" : "warning"}>{inc.status}</Badge>
                        </div>
                    ))}
                </Card>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.serviceStatuses.map((s) => (
                    <Card key={s.id} hover>
                        <p className="font-medium text-[var(--dos-text-primary)]">{s.name}</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                            {loading ? "—" : `${s.uptime.toFixed(1)}% uptime`}
                        </p>
                        <Badge className="mt-2" variant={s.status === "healthy" ? "success" : "warning"}>{s.status}</Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}
