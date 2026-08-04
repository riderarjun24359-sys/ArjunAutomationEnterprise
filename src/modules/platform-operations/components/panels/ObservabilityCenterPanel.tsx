"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { usePlatformOperations } from "../../hooks/usePlatformOperations";
import { PLATFORM_OPERATIONS_THEME } from "../../constants";

export function ObservabilityCenterPanel() {
    const { state, loading } = usePlatformOperations();

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>Recent Logs</p>
                <div className="mt-3 space-y-2">
                    {(loading ? [] : state.logs.slice(0, 8)).map((log) => (
                        <div key={log.id} className="flex items-center justify-between text-sm">
                            <span className="text-[var(--dos-text-primary)]">{log.message}</span>
                            <Badge variant={log.level === "error" || log.level === "fatal" ? "error" : "default"}>{log.level}</Badge>
                        </div>
                    ))}
                </div>
            </Card>
            <Card>
                <p className={`text-sm font-medium ${PLATFORM_OPERATIONS_THEME.text}`}>Metrics</p>
                <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">{state.metrics.length}</p>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">Traces: {state.traces.length}</p>
            </Card>
        </div>
    );
}
