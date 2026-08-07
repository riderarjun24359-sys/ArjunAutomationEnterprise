"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiAgentMonitor,
    AlertCenter,
    BackupAndRecovery,
    ExecutiveOperationsDashboard,
    InfrastructureMonitoring,
    LogsAndAudit,
    PerformanceAnalytics,
    SecurityCenterBoard,
    SystemHealthDashboard,
} from "../types";

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

function Table({ headers, rows, empty }: { headers: string[]; rows: string[][]; empty: string }) {
    if (!rows.length) {
        return <EmptyState title={empty} description="Live tenant data will appear when records exist in Supabase." />;
    }
    return (
        <div className="overflow-x-auto rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)]">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-tertiary)]">
                    <tr>
                        {headers.map((h) => (
                            <th key={h} className="px-3 py-2 font-medium">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t border-[var(--dos-border)]">
                            {row.map((cell, j) => (
                                <td key={j} className="px-3 py-2 text-[var(--dos-text-secondary)]">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function SystemHealthPanel({ health }: { health: SystemHealthDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Overall" value={health.overallScore ?? "—"} />
                {health.domains.map((d) => (
                    <Metric key={d.domain} label={d.domain} value={d.score ?? "—"} />
                ))}
                <Metric label="Background jobs" value={health.backgroundJobs} />
                <Metric label="Queue depth" value={health.queueDepth} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">System Health Dashboard</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    API health · Database health · Queue health · Storage health · Background jobs
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Domain", "Score", "Status", "Detail", "Checked"]}
                        rows={health.domains.map((d) => [
                            d.domain,
                            d.score == null ? "—" : String(d.score),
                            d.status,
                            d.detail,
                            d.lastCheckAt || "—",
                        ])}
                        empty="No health domains"
                    />
                    <Table
                        headers={["Module", "Score", "Status", "Checked"]}
                        rows={health.moduleRows.map((m) => [
                            m.name,
                            String(m.score),
                            m.status,
                            m.lastCheckAt,
                        ])}
                        empty="No module health"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiAgentMonitorPanel({ agents }: { agents: AiAgentMonitor }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Active agents" value={agents.activeAgents} />
                <Metric label="Success/failure rate" value={agents.avgSuccessRate == null ? "—" : `${agents.avgSuccessRate}%`} />
                <Metric label="Token usage" value={agents.totalTokenUsage.toLocaleString()} />
                <Metric label="Cost tracking" value={`$${agents.totalCostUsd}`} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Agent Monitor</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Agent status · Running tasks · Success/failure rate · Token usage · Cost tracking
                </p>
                <Table
                    headers={["Agent", "Status", "Model", "Running tasks", "Success %", "Tokens", "Cost"]}
                    rows={agents.rows.map((r) => [
                        r.name,
                        r.status,
                        r.model,
                        String(r.runningTasks),
                        r.successRate == null ? "—" : String(r.successRate),
                        String(r.tokenUsage),
                        `$${r.estimatedCostUsd}`,
                    ])}
                    empty="No AI agents"
                />
            </Card>
        </div>
    );
}

export function InfrastructurePanel({ infrastructure }: { infrastructure: InfrastructureMonitoring }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="CPU" value={infrastructure.cpuPercent == null ? "—" : `${infrastructure.cpuPercent}%`} />
                <Metric
                    label="Memory"
                    value={infrastructure.memoryPercent == null ? "—" : `${infrastructure.memoryPercent}%`}
                />
                <Metric
                    label="Response times"
                    value={infrastructure.avgResponseMs == null ? "—" : `${infrastructure.avgResponseMs} ms`}
                />
                <Metric
                    label="Error rates"
                    value={infrastructure.errorRate == null ? "—" : `${infrastructure.errorRate}%`}
                />
                <Metric
                    label="Availability"
                    value={
                        infrastructure.availabilityPercent == null
                            ? "—"
                            : `${infrastructure.availabilityPercent}%`
                    }
                />
                <Metric label="Failures" value={infrastructure.failures} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Infrastructure Monitoring</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    CPU · Memory · Response times · Error rates · Availability
                </p>
                <Table
                    headers={["Service", "Status", "Heartbeat", "URL"]}
                    rows={infrastructure.services.map((s) => [s.name, s.status, s.lastHeartbeat, s.url])}
                    empty="No services registered"
                />
            </Card>
        </div>
    );
}

export function SecurityCenterPanel({ security }: { security: SecurityCenterBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Login activity" value={security.loginActivity.length} />
                <Metric label="RBAC audit" value={security.rbacAudit.length} />
                <Metric label="Suspicious events" value={security.suspiciousEvents} />
                <Metric label="Security alerts" value={security.securityAlerts} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Security Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Login activity · RBAC audit · Suspicious events · Security alerts
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Title", "Detail", "At"]}
                        rows={security.loginActivity.map((l) => [l.title, l.detail, l.createdAt])}
                        empty="No login activity"
                    />
                    <Table
                        headers={["Action", "Summary", "Level", "At"]}
                        rows={security.rbacAudit.map((a) => [a.action, a.summary, a.securityLevel, a.createdAt])}
                        empty="No RBAC audit"
                    />
                </div>
            </Card>
        </div>
    );
}

export function LogsAndAuditPanel({ logs }: { logs: LogsAndAudit }) {
    const [query, setQuery] = useState("");
    const [kind, setKind] = useState("all");
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return logs.rows.filter((r) => {
            if (kind !== "all" && r.kind !== kind) return false;
            if (!q) return true;
            return `${r.message} ${r.source} ${r.level} ${r.kind}`.toLowerCase().includes(q);
        });
    }, [logs.rows, query, kind]);

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {logs.byKind.map((k) => (
                    <Metric key={k.kind} label={k.kind} value={k.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Logs & Audit</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Application logs · Workflow logs · AI execution logs · Search & filtering
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search & filtering…"
                        className="min-w-[220px] flex-1 rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    />
                    <select
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    >
                        <option value="all">All kinds</option>
                        {logs.byKind.map((k) => (
                            <option key={k.kind} value={k.kind}>
                                {k.kind}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                    <Table
                        headers={["Kind", "Level", "Source", "Message", "At"]}
                        rows={filtered.map((r) => [r.kind, r.level, r.source, r.message, r.createdAt])}
                        empty="No logs"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AlertCenterPanel({ alerts }: { alerts: AlertCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Critical alerts" value={alerts.critical} />
                <Metric label="Warning alerts" value={alerts.warning} />
                <Metric label="Notification history" value={alerts.notificationHistory.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Alert Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Critical alerts · Warning alerts · Notification history
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Title", "Severity", "Status", "Message", "Triggered"]}
                        rows={alerts.rows.map((r) => [
                            r.title,
                            r.severity,
                            r.status,
                            r.message,
                            r.triggeredAt,
                        ])}
                        empty="No alerts"
                    />
                    <Table
                        headers={["By", "Note", "At"]}
                        rows={alerts.notificationHistory.map((n) => [n.acknowledgedBy, n.note, n.at])}
                        empty="No notification history"
                    />
                </div>
            </Card>
        </div>
    );
}

export function BackupRecoveryPanel({ backup }: { backup: BackupAndRecovery }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Backup status" value={backup.configs.filter((c) => c.enabled).length} />
                <Metric label="Runs" value={backup.runs.length} />
                <Metric label="DR mode" value={backup.disasterRecoveryMode ? "ON" : "OFF"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Backup & Recovery</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Backup status · Restore workflows · Disaster recovery checklist
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {backup.restoreWorkflows.map((w) => (
                        <Badge key={w} variant="info">
                            {w}
                        </Badge>
                    ))}
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Config", "Enabled", "Schedule", "Destination"]}
                        rows={backup.configs.map((c) => [
                            c.name,
                            c.enabled ? "yes" : "no",
                            c.schedule,
                            c.destination,
                        ])}
                        empty="No backup configs"
                    />
                    <Table
                        headers={["Checklist", "Ready"]}
                        rows={backup.disasterRecoveryChecklist.map((c) => [
                            c.item,
                            c.ready ? "yes" : "no",
                        ])}
                        empty="No checklist"
                    />
                </div>
                <div className="mt-4">
                    <Table
                        headers={["Status", "Started", "Size", "Path", "Error"]}
                        rows={backup.runs.map((r) => [
                            r.status,
                            r.startedAt,
                            String(r.sizeBytes),
                            r.path,
                            r.error || "—",
                        ])}
                        empty="No backup runs"
                    />
                </div>
            </Card>
        </div>
    );
}

export function PerformanceAnalyticsPanel({ performance }: { performance: PerformanceAnalytics }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Slow pages" value={performance.slowPages.length} />
                <Metric label="Slow queries" value={performance.slowQueries.length} />
                <Metric
                    label="Avg trace"
                    value={performance.avgTraceMs == null ? "—" : `${performance.avgTraceMs} ms`}
                />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Performance Analytics</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Slow pages · Slow queries · Optimization suggestions
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--dos-text-secondary)]">
                    {performance.suggestions.map((s) => (
                        <li key={s}>{s}</li>
                    ))}
                </ul>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Page/Trace", "Duration ms", "Status"]}
                        rows={performance.slowPages.map((p) => [p.name, String(p.durationMs), p.status])}
                        empty="No slow pages"
                    />
                    <Table
                        headers={["Query", "Duration ms", "Status"]}
                        rows={performance.slowQueries.map((q) => [q.name, String(q.durationMs), q.status])}
                        empty="No slow queries"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ExecutiveOperationsPanel({ executive }: { executive: ExecutiveOperationsDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Overall platform health" value={executive.platformHealth ?? "—"} />
                <Metric label="SLA" value={executive.slaPercent == null ? "—" : `${executive.slaPercent}%`} />
                <Metric label="Uptime" value={executive.uptimePercent == null ? "—" : `${executive.uptimePercent}%`} />
                <Metric label="Active customers" value={executive.activeCustomers} />
                <Metric label="Automation health" value={executive.automationHealth ?? "—"} />
                <Metric label="Open alerts" value={executive.openAlerts} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive Operations Dashboard</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Overall platform health · SLA · Uptime · Active customers · Automation health
                </p>
                <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">{executive.summary}</p>
            </Card>
        </div>
    );
}
