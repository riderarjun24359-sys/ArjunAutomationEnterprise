import { Card } from "@/src/design-os/components/primitives/Card";
import type { OperationsSnapshot } from "../types/snapshot";

interface OperationsPulseProps {
    snapshot: OperationsSnapshot;
}

export function OperationsPulse({ snapshot }: OperationsPulseProps) {
    const { pulse } = snapshot;

    // Determine semantic status for UI elements
    const isDegraded = pulse.systemHealth === "degraded";
    const isCritical = pulse.systemHealth === "critical";
    const needsAttention = pulse.criticalAlerts > 0 || pulse.pendingApprovals > 0;

    return (
        <section aria-labelledby="operations-pulse-heading" className="space-y-4">
            <h2 id="operations-pulse-heading" className="text-lg font-semibold text-[var(--dos-text-primary)]">Operations Pulse</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card variant={isCritical || isDegraded ? "active" : "base"}>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]" id="system-health-label">System Health</p>
                    <p className={`mt-1 text-2xl font-bold ${isCritical ? "text-[var(--dos-tint-critical)]" : isDegraded ? "text-[var(--dos-tint-warning)]" : "text-[var(--dos-tint-success)]"}`} 
                       aria-labelledby="system-health-label">
                        {pulse.systemHealth.charAt(0).toUpperCase() + pulse.systemHealth.slice(1)}
                    </p>
                </Card>
                <Card variant={pulse.criticalAlerts > 0 ? "active" : "base"}>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]" id="critical-alerts-label">Critical Alerts</p>
                    <p className="mt-1 text-2xl font-bold" aria-labelledby="critical-alerts-label">{pulse.criticalAlerts}</p>
                </Card>
                <Card variant={pulse.pendingApprovals > 0 ? "active" : "base"}>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]" id="pending-approvals-label">Pending Approvals</p>
                    <p className="mt-1 text-2xl font-bold" aria-labelledby="pending-approvals-label">{pulse.pendingApprovals}</p>
                </Card>
                <Card variant="base">
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]" id="active-automations-label">Active Automations</p>
                    <p className="mt-1 text-2xl font-bold" aria-labelledby="active-automations-label">{pulse.activeAutomations}</p>
                </Card>
            </div>
        </section>
    );
}
