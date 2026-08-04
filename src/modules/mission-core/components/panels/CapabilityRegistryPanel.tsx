"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { useMissionCore } from "../../hooks/useMissionCore";
import type { CapabilityDefinition } from "../../types";

export function CapabilityRegistryPanel() {
    const { capabilities, loading } = useMissionCore();

    if (loading) return <p className="text-sm text-[var(--dos-text-secondary)]">Loading capabilities…</p>;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap: CapabilityDefinition) => (
                <Card key={cap.id} hover>
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[var(--dos-text-primary)]">{cap.name}</h3>
                        <Badge variant={cap.status === "planned" ? "warning" : cap.health.status === "healthy" ? "success" : "error"}>
                            {cap.status}
                        </Badge>
                    </div>
                    <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{cap.route} · v{cap.version}</p>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                        APIs: {cap.apis.join(", ") || "—"}
                    </p>
                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                        Events: {cap.events.join(", ") || "—"}
                    </p>
                    {cap.dependencies.length > 0 && (
                        <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                            Depends on: {cap.dependencies.join(", ")}
                        </p>
                    )}
                </Card>
            ))}
        </div>
    );
}
