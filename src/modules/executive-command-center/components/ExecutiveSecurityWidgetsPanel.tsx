"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { ExecutiveSecurityWidgets } from "@/src/modules/security-center/types/os";

export function ExecutiveSecurityWidgetsPanel({ widgets }: { widgets: ExecutiveSecurityWidgets | null }) {
    if (!widgets) {
        return (
            <EmptyState
                title="Security widgets unavailable"
                description="Widgets load from the Security & Compliance Center snapshot."
            />
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                Security & Compliance Widgets
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Security Score</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.securityScore}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Open Alerts</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.openAlerts}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Active Sessions</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.activeSessions}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">MFA Coverage</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.mfaCoverage}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Compliance Avg</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.complianceAvgScore}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Unresolved Risks</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.unresolvedRisks}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">API Keys at Risk</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.apiKeysAtRisk}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Recent Audit</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.recentAuditCount}</p>
                </Card>
            </div>
        </section>
    );
}
