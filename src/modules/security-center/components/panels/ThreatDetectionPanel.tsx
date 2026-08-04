"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";

export function ThreatDetectionPanel() {
    const { state } = useSecurityCenter();

    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Threat Detection</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    AI-first monitoring suggestions from identity and platform signals.
                </p>
            </Card>
            <div className="space-y-3">
                {state.threatAlerts.map((alert) => (
                    <Card key={alert.id} hover>
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-[var(--dos-text-primary)]">{alert.title}</p>
                            <Badge variant={alert.severity === "critical" ? "error" : alert.severity === "high" ? "warning" : "default"}>
                                {alert.severity}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{alert.description}</p>
                        {alert.aiSuggestion && (
                            <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                                AI: {alert.aiSuggestion}
                            </p>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
