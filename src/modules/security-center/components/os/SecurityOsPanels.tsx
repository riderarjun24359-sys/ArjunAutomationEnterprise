"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiSecurityAssistant,
    ApiSecurityItem,
    AuditLogExplorerItem,
    BackupDrItem,
    ComplianceCenterItem,
    MfaManagementItem,
    PermissionManagerItem,
    RbacRoleItem,
    SecurityAlertItem,
    SecurityEventItem,
    SecurityOpsMetric,
    SessionManagementItem,
} from "../../types/os";

export function OpsDashboardPanel({ items }: { items: SecurityOpsMetric[] }) {
    if (items.length === 0) return <EmptyState title="No security ops metrics" description="Ops dashboard builds from live identity health, alerts, MFA, sessions, and backups." />;
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{item.label}</p>
                        <Badge variant={item.status === "healthy" ? "success" : item.status === "watch" ? "warning" : "error"}>{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{item.value}</p>
                    <p className="mt-2 text-xs text-[var(--dos-text-secondary)]">{item.detail}</p>
                </Card>
            ))}
        </div>
    );
}

export function RbacOsPanel({ items }: { items: RbacRoleItem[] }) {
    if (items.length === 0) return <EmptyState title="No roles" description="RBAC loads from settings roles and IDP RBAC roles in Supabase." />;
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={`${item.source}-${item.id}`}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.source} · {item.key}</p>
                        </div>
                        <Badge variant={item.isSystem ? "info" : "success"}>{item.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">{item.permissionCount} permissions</p>
                </Card>
            ))}
        </div>
    );
}

export function PermissionsOsPanel({ items }: { items: PermissionManagerItem[] }) {
    if (items.length === 0) return <EmptyState title="No permissions" description="Permission manager loads permissions, IDP groups, and role grants from Supabase." />;
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.slice(0, 60).map((item) => (
                <Card key={`${item.source}-${item.id}`}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.source} · {item.key}</p>
                        </div>
                        <Badge variant="info">{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                </Card>
            ))}
        </div>
    );
}

export function AuditExplorerPanel({ items }: { items: AuditLogExplorerItem[] }) {
    if (items.length === 0) return <EmptyState title="No audit events" description="Audit explorer loads IDP audit logs and security-related activity logs." />;
    return (
        <div className="space-y-2">
            {items.map((item) => (
                <Card key={`${item.source}-${item.id}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.summary}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                                {item.source} · {item.entityType} · {item.action}
                            </p>
                        </div>
                        <Badge variant="info">{item.securityLevel}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-[var(--dos-text-secondary)]">
                        {new Date(item.occurredAt).toLocaleString()} · actor {item.actor ?? "—"}
                    </p>
                </Card>
            ))}
        </div>
    );
}

export function SecurityEventsPanel({ items }: { items: SecurityEventItem[] }) {
    if (items.length === 0) return <EmptyState title="No security events" description="Security event monitoring loads from live IDP risk events." />;
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-[var(--dos-text-primary)]">{item.eventType}</p>
                        <Badge variant={item.riskScore >= 70 ? "error" : item.riskScore >= 40 ? "warning" : "success"}>
                            Risk {item.riskScore}
                        </Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">Action {item.actionTaken || "—"} · {item.status}</p>
                    {item.riskFactors.length ? (
                        <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{item.riskFactors.join(", ")}</p>
                    ) : null}
                </Card>
            ))}
        </div>
    );
}

export function MfaOsPanel({ items }: { items: MfaManagementItem[] }) {
    if (items.length === 0) return <EmptyState title="No MFA records" description="MFA management loads policies and enrollments from IDP tables." />;
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.kind} · {item.method}</p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "active" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                </Card>
            ))}
        </div>
    );
}

export function SessionsOsPanel({ items }: { items: SessionManagementItem[] }) {
    if (items.length === 0) return <EmptyState title="No sessions" description="Session management loads from live idp_active_sessions." />;
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.deviceName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.ipAddress}</p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "active" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>User {item.userId ?? "—"}</span>
                        <span>Last {new Date(item.lastActiveAt).toLocaleString()}</span>
                        <span className="col-span-2">Expires {item.expiresAt ? new Date(item.expiresAt).toLocaleString() : "—"}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}

export function ApiSecurityOsPanel({ items }: { items: ApiSecurityItem[] }) {
    if (items.length === 0) return <EmptyState title="No API security rows" description="API security center loads INTG API keys and rate limits from Supabase." />;
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.kind}</p>
                        </div>
                        <Badge variant={item.risk === "high" ? "error" : item.risk === "medium" ? "warning" : "success"}>{item.risk}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Status {item.status}</p>
                </Card>
            ))}
        </div>
    );
}

export function ComplianceOsPanel({ items }: { items: ComplianceCenterItem[] }) {
    return (
        <div className="space-y-4">
            <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Frameworks</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {(["ISO 27001", "SOC 2", "GDPR"] as const).map((fw) => (
                        <Badge key={fw} variant="info">
                            {fw}
                        </Badge>
                    ))}
                </div>
            </Card>
            {items.length === 0 ? (
                <EmptyState title="No compliance reviews" description="Compliance center loads ELR compliance reviews and AIX compliance warnings mapped to ISO 27001, SOC 2, and GDPR." />
            ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                    {items.map((item) => (
                        <Card key={item.id}>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{item.framework}</p>
                                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.title} · {item.source}</p>
                                </div>
                                <Badge variant={item.score >= 80 ? "success" : item.score >= 60 ? "warning" : "error"}>Score {item.score}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.summary || item.status}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export function BackupDrOsPanel({ items }: { items: BackupDrItem[] }) {
    if (items.length === 0) return <EmptyState title="No backup/DR records" description="Backup & disaster recovery loads backup configs/runs and DD disaster recovery plans." />;
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.kind}</p>
                        </div>
                        <Badge variant="info">{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                </Card>
            ))}
        </div>
    );
}

export function SecurityAlertsOsPanel({ items }: { items: SecurityAlertItem[] }) {
    if (items.length === 0) return <EmptyState title="No security alerts" description="Security alerts load from live idp_security_alerts." />;
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.alertType}</p>
                        </div>
                        <Badge variant={item.severity.toLowerCase() === "critical" || item.severity.toLowerCase() === "high" ? "error" : "warning"}>
                            {item.severity}
                        </Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.description}</p>
                    <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                        {item.status} · {item.resolvedAt ? "resolved" : "open"} · {new Date(item.createdAt).toLocaleString()}
                    </p>
                </Card>
            ))}
        </div>
    );
}

export function AiSecurityAssistantPanel({ assistant }: { assistant: AiSecurityAssistant }) {
    if (!assistant.dailySummary) {
        return <EmptyState title="No AI summary" description="Assistant output is generated from the live Security Center snapshot." />;
    }
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Daily Summary</h3>
                <p className="mt-3 text-sm text-[var(--dos-text-primary)]">{assistant.dailySummary}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Executive Summary</h3>
                <p className="mt-3 text-sm text-[var(--dos-text-primary)]">{assistant.executiveSummary}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Attention</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {assistant.attentionItems.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-tertiary)]">None right now</p>
                    ) : (
                        assistant.attentionItems.map((c) => (
                            <Badge key={c} variant="warning">
                                {c}
                            </Badge>
                        ))
                    )}
                </div>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Compliance Recommendations</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.complianceRecommendations.map((h) => (
                        <li key={h}>• {h}</li>
                    ))}
                </ul>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Access Insights</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.accessInsights.map((h) => (
                        <li key={h}>• {h}</li>
                    ))}
                </ul>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Incident Insights</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.incidentInsights.length === 0 ? <li>No incidents</li> : assistant.incidentInsights.map((h) => <li key={h}>• {h}</li>)}
                </ul>
            </Card>
        </div>
    );
}
