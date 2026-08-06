"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { SECURITY_OS_TABS, SECURITY_OS_THEME } from "@/src/modules/security-center/constants/os";
import { useSecurityCenterOs } from "@/src/modules/security-center/hooks/useSecurityCenterOs";
import { listSecurityOsPlatformLinks } from "@/src/modules/security-center/integrations/platform-bridges";
import type { SecurityOsTab } from "@/src/modules/security-center/types/os";
import {
    AiSecurityAssistantPanel,
    ApiSecurityOsPanel,
    AuditExplorerPanel,
    BackupDrOsPanel,
    ComplianceOsPanel,
    MfaOsPanel,
    OpsDashboardPanel,
    PermissionsOsPanel,
    RbacOsPanel,
    SecurityAlertsOsPanel,
    SecurityEventsPanel,
    SessionsOsPanel,
} from "@/src/modules/security-center/components/os/SecurityOsPanels";

const TABS: Array<{ id: SecurityOsTab; label: string }> = [
    { id: SECURITY_OS_TABS.ops, label: "Ops Dashboard" },
    { id: SECURITY_OS_TABS.rbac, label: "RBAC" },
    { id: SECURITY_OS_TABS.permissions, label: "Permissions" },
    { id: SECURITY_OS_TABS.audit, label: "Audit Explorer" },
    { id: SECURITY_OS_TABS.events, label: "Event Monitoring" },
    { id: SECURITY_OS_TABS.mfa, label: "MFA" },
    { id: SECURITY_OS_TABS.sessions, label: "Sessions" },
    { id: SECURITY_OS_TABS.apiSecurity, label: "API Security" },
    { id: SECURITY_OS_TABS.compliance, label: "Compliance" },
    { id: SECURITY_OS_TABS.backup, label: "Backup & DR" },
    { id: SECURITY_OS_TABS.alerts, label: "Alerts" },
    { id: SECURITY_OS_TABS.assistant, label: "AI Assistant" },
];

function Skeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <SkeletonLoader className="h-8 w-72" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i}>
                        <SkeletonLoader className="h-16 w-full" />
                    </Card>
                ))}
            </div>
            <Card>
                <SkeletonLoader className="h-64 w-full" />
            </Card>
        </PageTransition>
    );
}

export function SecurityCenterOsPage() {
    const { snapshot, loading, error } = useSecurityCenterOs();
    const [tab, setTab] = useState<SecurityOsTab>(SECURITY_OS_TABS.ops);
    const links = listSecurityOsPlatformLinks();

    if (loading) return <Skeleton />;
    if (error) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Unable to load Security & Compliance Center" description={error} />
            </PageTransition>
        );
    }
    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Sign in required" description="Sign in to access Security & Compliance Center." />
            </PageTransition>
        );
    }

    const stats = [
        { label: "Security Score", value: String(snapshot.stats.securityScore) },
        { label: "Roles", value: String(snapshot.stats.roles) },
        { label: "Open Alerts", value: String(snapshot.stats.openAlerts) },
        { label: "Sessions", value: String(snapshot.stats.activeSessions) },
        { label: "MFA", value: String(snapshot.stats.mfaEnrollments) },
        { label: "Compliance", value: String(snapshot.stats.complianceControls) },
        { label: "Backups", value: String(snapshot.stats.backupConfigs) },
        { label: "Audit Events", value: String(snapshot.stats.auditEvents) },
    ];

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div>
                <Badge variant="info">{SECURITY_OS_THEME.badge}</Badge>
                <h1 className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)] sm:text-3xl">{SECURITY_OS_THEME.title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{SECURITY_OS_THEME.subtitle}</p>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                    Data: {snapshot.source} · Org {snapshot.organizationId ?? "—"}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label}>
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{s.label}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{s.value}</p>
                    </Card>
                ))}
            </div>

            <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Platform integrations</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {links.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="rounded-full border border-[var(--dos-border)] px-3 py-1 text-xs text-[var(--dos-text-secondary)] hover:border-[var(--dos-brand-primary)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </Card>

            <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                            tab === t.id
                                ? "bg-[var(--dos-brand-primary)] text-white"
                                : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === SECURITY_OS_TABS.ops ? <OpsDashboardPanel items={snapshot.opsDashboard} /> : null}
            {tab === SECURITY_OS_TABS.rbac ? <RbacOsPanel items={snapshot.rbac} /> : null}
            {tab === SECURITY_OS_TABS.permissions ? <PermissionsOsPanel items={snapshot.permissions} /> : null}
            {tab === SECURITY_OS_TABS.audit ? <AuditExplorerPanel items={snapshot.auditTrail} /> : null}
            {tab === SECURITY_OS_TABS.events ? <SecurityEventsPanel items={snapshot.securityEvents} /> : null}
            {tab === SECURITY_OS_TABS.mfa ? <MfaOsPanel items={snapshot.mfa} /> : null}
            {tab === SECURITY_OS_TABS.sessions ? <SessionsOsPanel items={snapshot.sessions} /> : null}
            {tab === SECURITY_OS_TABS.apiSecurity ? <ApiSecurityOsPanel items={snapshot.apiSecurity} /> : null}
            {tab === SECURITY_OS_TABS.compliance ? <ComplianceOsPanel items={snapshot.compliance} /> : null}
            {tab === SECURITY_OS_TABS.backup ? <BackupDrOsPanel items={snapshot.backupDr} /> : null}
            {tab === SECURITY_OS_TABS.alerts ? <SecurityAlertsOsPanel items={snapshot.alerts} /> : null}
            {tab === SECURITY_OS_TABS.assistant ? <AiSecurityAssistantPanel assistant={snapshot.assistant} /> : null}
        </PageTransition>
    );
}
