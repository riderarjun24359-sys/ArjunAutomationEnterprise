"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { OPERATIONS_PLAYBOOK_SECTIONS } from "../../constants";
import type { ProductionReadinessData } from "../../hooks/useProductionReadiness";

function StatusBadge({ score }: { score: number }) {
    const variant = score >= 85 ? "success" : score >= 70 ? "warning" : "error";
    return <Badge variant={variant}>{score}%</Badge>;
}

export function CtoAuditDashboardPanel({ data }: { data: ProductionReadinessData }) {
    const audit = data.snapshot?.ctoAudit;
    if (!audit) return null;
    const metrics = [
        { label: "Platform Health", value: audit.platformHealth },
        { label: "Security Status", value: audit.securityStatus },
        { label: "Performance", value: audit.performanceStatus },
        { label: "Database Health", value: audit.databaseHealth },
        { label: "AI Health", value: audit.aiHealth },
        { label: "Delivery Health", value: audit.deliveryHealth },
    ];
    return (
        <div className="space-y-6">
            <Card hover className="border-emerald-500/20 bg-gradient-to-br from-[var(--dos-surface-elevated)] to-[var(--dos-surface-secondary)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">CTO Audit Dashboard</p>
                        <p className="mt-2 text-4xl font-bold">{audit.overallScore}%</p>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Enterprise readiness · Risk score {audit.riskScore}%</p>
                    </div>
                    <Badge variant={audit.status === "healthy" ? "success" : audit.status === "degraded" ? "warning" : "error"}>{audit.status}</Badge>
                </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {metrics.map((m) => (
                    <Card key={m.label} hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">{m.label}</p>
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-2xl font-bold">{m.value}%</p>
                            <StatusBadge score={m.value} />
                        </div>
                    </Card>
                ))}
            </div>
            {audit.systemAlerts.length > 0 && (
                <Card>
                    <h3 className="font-semibold">System Alerts</h3>
                    <ul className="mt-4 space-y-2">
                        {audit.systemAlerts.map((a) => (
                            <li key={a.id} className="flex items-start justify-between gap-2 rounded-lg border border-[var(--dos-border)] p-3">
                                <div>
                                    <p className="font-medium">{a.title}</p>
                                    <p className="text-sm text-[var(--dos-text-secondary)]">{a.detail}</p>
                                </div>
                                <Badge variant={a.severity === "critical" ? "error" : "warning"}>{a.severity}</Badge>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
                {audit.pillars.map((p) => (
                    <Card key={p.key}>
                        <div className="flex justify-between">
                            <p className="font-medium">{p.label}</p>
                            <StatusBadge score={p.score} />
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{p.summary}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function ObservabilityPanel({ data }: { data: ProductionReadinessData }) {
    const obs = data.snapshot?.observability;
    if (!obs) return null;
    return (
        <div className="space-y-4">
            <Card><h2 className="text-lg font-semibold">Observability</h2><p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Central logging, error tracking, performance monitoring, health dashboard, request tracing, audit logs.</p></Card>
            <div className="grid gap-4 sm:grid-cols-3">
                <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Logs</p><p className="text-2xl font-bold">{obs.logCount}</p></Card>
                <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Errors</p><p className="text-2xl font-bold">{obs.errorCount}</p></Card>
                <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Traces</p><p className="text-2xl font-bold">{obs.traceCount}</p></Card>
            </div>
            <Card>
                <h3 className="font-semibold">Recent logs</h3>
                <ul className="mt-3 space-y-2 text-sm">
                    {obs.recentLogs.map((l, i) => (
                        <li key={i} className="flex justify-between border-b border-[var(--dos-border)] pb-2">
                            <span><Badge variant={l.level === "error" ? "error" : "info"}>{l.level}</Badge> {l.message}</span>
                            <span className="text-[var(--dos-text-tertiary)]">{l.source}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}

export function ResiliencePanel({ data }: { data: ProductionReadinessData }) {
    const res = data.snapshot?.resilience;
    if (!res) return null;
    return (
        <div className="space-y-4">
            <Card><h2 className="text-lg font-semibold">Resilience</h2><p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Retry policies, timeouts, circuit breakers, graceful degradation, background recovery, queue handling.</p></Card>
            <div className="grid gap-4 sm:grid-cols-2">
                {res.retryPolicies.map((p) => (
                    <Card key={p.name}><p className="font-medium">{p.name}</p><p className="text-sm text-[var(--dos-text-secondary)]">{p.maxAttempts} attempts · Circuit {p.circuitOpen ? "OPEN" : "closed"}</p></Card>
                ))}
            </div>
            <Card>
                <h3 className="font-semibold">Queue stats</h3>
                <ul className="mt-3 space-y-2">
                    {res.queueStats.map((q) => (
                        <li key={q.name} className="flex justify-between text-sm"><span>{q.name}</span><span>{q.pending} pending · {q.failed} failed</span></li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}

export function BackupRecoveryPanel({ data }: { data: ProductionReadinessData }) {
    const br = data.snapshot?.backupRecovery;
    if (!br) return null;
    return (
        <div className="space-y-4">
            <Card><h2 className="text-lg font-semibold">Backup & Recovery</h2><p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Automated backups, restore verification, disaster recovery plan, data integrity validation.</p></Card>
            <div className="space-y-3">
                {br.backups.map((b) => (
                    <Card key={b.id}>
                        <div className="flex justify-between"><span className="font-medium capitalize">{b.type}</span><Badge variant={b.verified ? "success" : "warning"}>{b.status}</Badge></div>
                    </Card>
                ))}
            </div>
            <Card>
                <h3 className="font-semibold">Integrity checks</h3>
                <ul className="mt-3 space-y-2">
                    {br.integrityChecks.map((c) => (
                        <li key={c.name} className="flex justify-between text-sm"><span>{c.name}</span><Badge variant={c.passed ? "success" : "error"}>{c.passed ? "Pass" : "Fail"}</Badge></li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}

export function SecurityHardeningPanel({ data }: { data: ProductionReadinessData }) {
    const sec = data.snapshot?.security;
    if (!sec) return null;
    const items = [
        { label: "Authentication", value: sec.authStatus },
        { label: "Session handling", value: sec.sessionHandling },
        { label: "Rate limiting", value: sec.rateLimiting },
        { label: "Input validation", value: sec.inputValidation },
        { label: "Secret management", value: sec.secretManagement },
        { label: "Dependency scanning", value: sec.dependencyScan },
    ];
    return (
        <div className="space-y-4">
            <Card><h2 className="text-lg font-semibold">Security Hardening</h2><p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Score {sec.score}% — auth, authorization, sessions, secrets, headers, validation, rate limiting.</p></Card>
            <div className="grid gap-3 sm:grid-cols-2">
                {items.map((i) => (
                    <Card key={i.label}><p className="text-sm font-medium">{i.label}</p><p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{i.value}</p></Card>
                ))}
            </div>
            <Card>
                <h3 className="font-semibold">Security headers</h3>
                <ul className="mt-2 space-y-1 font-mono text-xs">{sec.securityHeaders.map((h) => <li key={h}>{h}</li>)}</ul>
            </Card>
        </div>
    );
}

export function ScalabilityPanel({ data }: { data: ProductionReadinessData }) {
    const scale = data.snapshot?.scalability;
    if (!scale) return null;
    return (
        <div className="space-y-4">
            <Card><h2 className="text-lg font-semibold">Scalability</h2><p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Prepared for thousands of concurrent users, clients, and projects.</p></Card>
            <Card hover><p className="text-sm">Concurrent user capacity</p><p className="text-3xl font-bold">{scale.concurrentUsersCapacity.toLocaleString()}+</p></Card>
            <div className="grid gap-3 sm:grid-cols-2">
                <Card><p className="text-sm font-medium">Database</p><p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{scale.databaseOptimization}</p></Card>
                <Card><p className="text-sm font-medium">Caching</p><p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{scale.cachingStrategy}</p></Card>
                <Card><p className="text-sm font-medium">Horizontal scaling</p><p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{scale.horizontalScaling}</p></Card>
            </div>
            <Card><h3 className="font-semibold">Recommendations</h3><ul className="mt-2 list-disc pl-5 text-sm">{scale.recommendations.map((r) => <li key={r}>{r}</li>)}</ul></Card>
        </div>
    );
}

export function OperationsPlaybookPanel() {
    return (
        <div className="space-y-4">
            <Card><h2 className="text-lg font-semibold">Operations Playbook</h2><p className="mt-1 text-sm text-[var(--dos-text-secondary)]">See also docs/OPERATIONS_RUNBOOK.md and docs/DISASTER_RECOVERY.md</p></Card>
            <div className="grid gap-4 sm:grid-cols-2">
                {OPERATIONS_PLAYBOOK_SECTIONS.map((section) => (
                    <Card key={section.id}>
                        <h3 className="font-semibold">{section.label}</h3>
                        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[var(--dos-text-secondary)]">
                            {section.steps.map((s) => <li key={s}>{s}</li>)}
                        </ol>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function ProductionQualityPanel({ data }: { data: ProductionReadinessData }) {
    const qual = data.snapshot?.productionQuality;
    if (!qual) return null;
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">Production Quality Gate</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{qual.overallPassed ? "All quality gates passing" : "Some gates require attention"}</p>
            </Card>
            <div className="grid gap-3 sm:grid-cols-3">
                {qual.dimensions.map((d) => (
                    <Card key={d.name}><p className="text-sm">{d.name}</p><div className="mt-1 flex justify-between"><span className="font-bold">{d.score}%</span><Badge variant={d.passed ? "success" : "warning"}>{d.passed ? "Pass" : "Review"}</Badge></div></Card>
                ))}
            </div>
            <Card>
                <h3 className="font-semibold">Verify scripts</h3>
                <ul className="mt-3 space-y-2">
                    {qual.verifyScripts.map((v) => (
                        <li key={v.name} className="flex justify-between text-sm"><span>{v.name}</span><Badge variant={v.status === "pass" ? "success" : "info"}>{v.status}</Badge></li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}
