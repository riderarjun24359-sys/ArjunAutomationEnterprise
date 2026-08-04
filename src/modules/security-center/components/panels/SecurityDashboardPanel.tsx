"use client";

import { Card } from "@/src/design-os/components/Card";
import { useSecurityCenter } from "../../hooks/useSecurityCenter";
import { SECURITY_CENTER_THEME } from "../../constants";

export function SecurityDashboardPanel() {
    const { state, loading } = useSecurityCenter();
    const d = state.dashboard;

    const stats = [
        { label: "Auth Methods", value: d.authMethodsEnabled },
        { label: "MFA Rate", value: `${d.mfaEnrollmentRate}%` },
        { label: "Active Threats", value: d.activeThreats },
        { label: "Audit Events", value: d.auditEventsToday },
        { label: "API Keys", value: d.apiKeysActive },
        { label: "Isolation Score", value: `${d.orgIsolationScore}%` },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.label} hover>
                    <p className={`text-sm font-medium ${SECURITY_CENTER_THEME.text}`}>{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--dos-text-primary)]">
                        {loading ? "—" : stat.value}
                    </p>
                </Card>
            ))}
            <Card className="sm:col-span-2 lg:col-span-3">
                <p className="text-sm text-[var(--dos-text-secondary)]">
                    Secrets valid: {d.secretsValid ? "Yes" : "No"} · Last checked: {d.lastCheckedAt}
                </p>
            </Card>
        </div>
    );
}
