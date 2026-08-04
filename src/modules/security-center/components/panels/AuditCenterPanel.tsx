"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";

export function AuditCenterPanel() {
    const { state, loading } = useSecurityCenter();

    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Audit Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    {loading ? "Loading…" : `${state.auditEvents.length} events via AuditRepository`}
                </p>
            </Card>
            <div className="space-y-2">
                {state.auditEvents.slice(0, 20).map((event) => (
                    <Card key={event.id}>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-[var(--dos-text-primary)]">{event.action}</p>
                            <Badge variant="info">{event.type}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{event.createdAt}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
