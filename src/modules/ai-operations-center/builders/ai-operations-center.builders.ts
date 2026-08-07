import {
    AOC_HEALTH_DOMAINS,
    AOC_LOG_KINDS,
    type AocAlertSeverity,
    type AocHealthDomain,
    type AocLogKind,
} from "../constants";
import type {
    AiAgentMonitor,
    AiOperationsCenterRawData,
    AiOperationsCenterSnapshot,
    AlertCenter,
    BackupAndRecovery,
    ExecutiveOperationsDashboard,
    InfrastructureMonitoring,
    LogsAndAudit,
    PerformanceAnalytics,
    SecurityCenterBoard,
    SystemHealthDashboard,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function money(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

export function classifyHealthDomain(type: string, name = ""): AocHealthDomain {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("database") || s.includes("postgres") || s.includes("supabase") || s.includes("sql")) {
        return "database";
    }
    if (s.includes("queue") || s.includes("retry") || s.includes("dead") || s.includes("bus")) return "queue";
    if (s.includes("storage") || s.includes("blob") || s.includes("s3") || s.includes("bucket")) return "storage";
    if (s.includes("job") || s.includes("scheduler") || s.includes("worker") || s.includes("background")) {
        return "background_jobs";
    }
    if (s.includes("api") || s.includes("service") || s.includes("gateway") || s.includes("http")) return "api";
    return "api";
}

export function classifyAlertSeverity(severity: string): AocAlertSeverity {
    const s = severity.toLowerCase();
    if (s.includes("crit") || s.includes("fatal") || s.includes("p0") || s.includes("sev1")) return "critical";
    if (s.includes("warn") || s.includes("p1") || s.includes("sev2") || s.includes("high")) return "warning";
    return "info";
}

export function classifyLogKind(level: string, source: string, message = ""): AocLogKind {
    const s = `${level} ${source} ${message}`.toLowerCase();
    if (s.includes("workflow") || s.includes("automation") || s.includes("dwe")) return "workflow";
    if (s.includes("ai") || s.includes("agent") || s.includes("llm") || s.includes("token")) return "ai_execution";
    return "application";
}

export function isSuspiciousEvent(action: string, title: string, detail = "", securityLevel = ""): boolean {
    const s = `${action} ${title} ${detail} ${securityLevel}`.toLowerCase();
    return (
        s.includes("fail")
        || s.includes("suspicious")
        || s.includes("breach")
        || s.includes("unauthorized")
        || s.includes("denied")
        || s.includes("threat")
        || s.includes("anomaly")
        || s.includes("high")
        || s.includes("critical")
    );
}

export const aocPure = {
    avg,
    money,
    classifyHealthDomain,
    classifyAlertSeverity,
    classifyLogKind,
    isSuspiciousEvent,
};

export function buildSystemHealthDashboard(data: AiOperationsCenterRawData): SystemHealthDashboard {
    const domains = AOC_HEALTH_DOMAINS.map((domain) => {
        if (domain === "database" && data.databaseHealth[0]) {
            const d = data.databaseHealth[0];
            return {
                domain,
                score: d.health_score,
                status: d.status,
                detail: `pool ${d.connection_pool_used}`,
                lastCheckAt: d.last_check_at,
            };
        }
        if (domain === "queue") {
            return {
                domain,
                score: data.retryQueue.length ? Math.max(0, 100 - data.retryQueue.length * 5) : 100,
                status: data.deadLetters.length ? "degraded" : "healthy",
                detail: `retry ${data.retryQueue.length} · dead ${data.deadLetters.length}`,
                lastCheckAt: data.retryQueue[0]?.status ? new Date().toISOString() : "",
            };
        }
        if (domain === "background_jobs") {
            const active = data.recurringJobs.filter((j) => /active|running|ok/i.test(j.job_status || j.status)).length;
            return {
                domain,
                score: data.jobSchedulers.length || data.recurringJobs.length ? 90 : null,
                status: `${active} active`,
                detail: `schedulers ${data.jobSchedulers.length} · jobs ${data.recurringJobs.length}`,
                lastCheckAt: data.recurringJobs[0]?.last_run_at || "",
            };
        }

        const match =
            data.overallHealth.find((h) => classifyHealthDomain(h.health_type) === domain)
            ?? data.moduleHealth.find((m) => classifyHealthDomain(m.module_name, m.module_name) === domain)
            ?? data.services.find((s) => classifyHealthDomain(s.service_name, s.cache_status) === domain);

        if (match && "health_score" in match) {
            return {
                domain,
                score: Number((match as { health_score: number }).health_score),
                status: match.status,
                detail: "module_name" in match ? String((match as { module_name?: string }).module_name ?? domain) : domain,
                lastCheckAt: "last_check_at" in match ? String((match as { last_check_at?: string }).last_check_at ?? "") : "",
            };
        }
        if (match && "service_name" in match) {
            return {
                domain,
                score: /up|active|healthy|ok/i.test(match.status) ? 95 : 60,
                status: match.status,
                detail: match.service_name,
                lastCheckAt: match.last_heartbeat_at,
            };
        }

        const overall = data.overallHealth[0];
        return {
            domain,
            score: overall?.health_score ?? data.opsHealth[0]?.overall_score ?? null,
            status: overall?.status ?? "unknown",
            detail: overall?.health_type ?? "derived",
            lastCheckAt: overall?.last_check_at ?? "",
        };
    });

    return {
        domains,
        overallScore: avg(domains.map((d) => d.score).filter((n): n is number => n != null))
            ?? data.opsHealth[0]?.overall_score
            ?? null,
        moduleRows: data.moduleHealth.map((m) => ({
            name: m.module_name,
            score: m.health_score,
            status: m.status,
            lastCheckAt: m.last_check_at,
        })),
        backgroundJobs: data.recurringJobs.length + data.jobSchedulers.length,
        queueDepth: data.retryQueue.length + data.deadLetters.length,
    };
}

export function buildAiAgentMonitor(data: AiOperationsCenterRawData): AiAgentMonitor {
    const execByStatus = data.workflowExecutions;
    const completed = execByStatus.filter((e) => /complete|success|done/i.test(e.status)).length;
    const failed = execByStatus.filter((e) => /fail|error/i.test(e.status)).length;
    const globalSuccess = completed + failed > 0 ? Math.round((completed / (completed + failed)) * 1000) / 10 : null;

    const rows = data.aiAgents.map((a, idx) => {
        const tokenUsage = a.max_tokens * Math.max(1, Math.floor(execByStatus.length / Math.max(1, data.aiAgents.length)));
        const costPer1k = /gpt-4|opus|sonnet/i.test(a.model) ? 0.03 : 0.002;
        return {
            id: a.id,
            name: a.name,
            status: a.status,
            model: a.model,
            runningTasks: execByStatus.filter((e) => /run|active|progress/i.test(e.status)).length
                ? Math.max(0, Math.ceil(execByStatus.filter((e) => /run|active|progress/i.test(e.status)).length / Math.max(1, data.aiAgents.length - idx)))
                : /active|running/i.test(a.status)
                  ? 1
                  : 0,
            successRate: globalSuccess,
            tokenUsage,
            estimatedCostUsd: money((tokenUsage / 1000) * costPer1k),
        };
    });

    return {
        rows,
        activeAgents: rows.filter((r) => /active|running|enabled|online/i.test(r.status) || r.runningTasks > 0).length,
        totalTokenUsage: rows.reduce((s, r) => s + r.tokenUsage, 0),
        totalCostUsd: money(rows.reduce((s, r) => s + r.estimatedCostUsd, 0)),
        avgSuccessRate: avg(rows.map((r) => r.successRate).filter((n): n is number => n != null)),
    };
}

export function buildInfrastructureMonitoring(data: AiOperationsCenterRawData): InfrastructureMonitoring {
    const metric = data.platformMetrics[0];
    const ops = data.opsHealth[0];
    const avgResponse = avg(data.traces.map((t) => t.duration_ms).filter((n) => n > 0));
    const failCount = data.opsFailures.length + data.deadLetters.length;
    const totalSignals = failCount + data.services.length + data.traces.length;
    const errorRate = totalSignals > 0 ? Math.round((failCount / totalSignals) * 1000) / 10 : null;

    return {
        cpuPercent: metric?.cpu_percent ?? null,
        memoryPercent: metric?.memory_percent ?? null,
        avgResponseMs: avgResponse,
        errorRate,
        availabilityPercent: ops?.uptime_percent ?? metric?.dependency_health ?? null,
        services: data.services.map((s) => ({
            name: s.service_name,
            status: s.status,
            lastHeartbeat: s.last_heartbeat_at,
            url: s.service_url,
        })),
        failures: failCount,
    };
}

export function buildSecurityCenter(data: AiOperationsCenterRawData): SecurityCenterBoard {
    const loginActivity = data.activityLogs
        .filter((a) => /login|sign.?in|auth|session/i.test(`${a.action} ${a.title} ${a.entity_type}`))
        .map((a) => ({
            id: a.id,
            title: a.title || a.action,
            detail: a.detail,
            createdAt: a.created_at,
        }));

    const rbacAudit = [
        ...data.eocAudit
            .filter((a) => /rbac|role|permission|member|access|security/i.test(`${a.action} ${a.summary} ${a.entity_type}`))
            .map((a) => ({
                id: a.id,
                action: a.action,
                summary: a.summary,
                securityLevel: a.security_level,
                createdAt: a.created_at,
            })),
        ...data.auditLogs.slice(0, 20).map((a) => ({
            id: a.id,
            action: a.action,
            summary: a.summary,
            securityLevel: "audit",
            createdAt: a.created_at,
        })),
    ];

    const suspiciousEvents = [
        ...data.activityLogs.filter((a) => isSuspiciousEvent(a.action, a.title, a.detail)),
        ...data.eocAudit.filter((a) => isSuspiciousEvent(a.action, a.summary, "", a.security_level)),
    ].length;

    const securityAlerts = data.alerts.filter((a) =>
        /security|auth|breach|rbac|threat/i.test(`${a.alert_title} ${a.alert_message} ${a.alert_severity}`),
    ).length;

    return {
        loginActivity: loginActivity.length
            ? loginActivity
            : data.activityLogs.slice(0, 15).map((a) => ({
                  id: a.id,
                  title: a.title || a.action,
                  detail: a.detail,
                  createdAt: a.created_at,
              })),
        rbacAudit,
        suspiciousEvents,
        securityAlerts,
    };
}

export function buildLogsAndAudit(data: AiOperationsCenterRawData): LogsAndAudit {
    const rows = [
        ...data.platformLogs.map((l) => ({
            id: l.id,
            kind: classifyLogKind(l.log_level, l.service_name, l.message),
            level: l.log_level,
            message: l.message,
            source: l.service_name,
            createdAt: l.logged_at,
        })),
        ...data.automationLogs.map((l) => ({
            id: l.id,
            kind: "workflow" as AocLogKind,
            level: l.level,
            message: l.message,
            source: l.workflow_id || "workflow",
            createdAt: l.created_at,
        })),
        ...data.workflowExecutions.map((e) => ({
            id: e.id,
            kind: "ai_execution" as AocLogKind,
            level: e.error_message ? "error" : "info",
            message: e.error_message || `execution ${e.status} (${e.duration_ms}ms)`,
            source: e.workflow_id,
            createdAt: e.started_at,
        })),
        ...data.eocAudit.map((a) => ({
            id: `audit-${a.id}`,
            kind: "application" as AocLogKind,
            level: a.security_level || "info",
            message: a.summary || a.action,
            source: a.entity_type,
            createdAt: a.created_at,
        })),
    ];

    return {
        rows,
        byKind: AOC_LOG_KINDS.map((kind) => ({
            kind,
            count: rows.filter((r) => r.kind === kind).length,
        })),
    };
}

export function buildAlertCenter(data: AiOperationsCenterRawData): AlertCenter {
    const rows = data.alerts.map((a) => ({
        id: a.id,
        title: a.alert_title,
        severity: classifyAlertSeverity(a.alert_severity),
        message: a.alert_message,
        status: a.alert_status || a.status,
        triggeredAt: a.triggered_at,
        silenced: a.silenced,
    }));

    return {
        rows,
        critical: rows.filter((r) => r.severity === "critical").length,
        warning: rows.filter((r) => r.severity === "warning").length,
        notificationHistory: data.alertAcks.map((a) => ({
            id: a.id,
            note: a.ack_note,
            acknowledgedBy: a.acknowledged_by,
            at: a.acknowledged_at,
        })),
    };
}

export function buildBackupAndRecovery(data: AiOperationsCenterRawData): BackupAndRecovery {
    const latestOps = data.opsHealth[0];
    const successfulRuns = data.backupRuns.filter((r) => /success|complete|ok/i.test(r.status)).length;
    return {
        configs: data.backupConfigs.map((c) => ({
            id: c.id,
            name: c.name,
            enabled: c.is_enabled,
            schedule: c.schedule_cron,
            destination: c.destination,
        })),
        runs: data.backupRuns.map((r) => ({
            id: r.id,
            status: r.status,
            startedAt: r.started_at,
            sizeBytes: r.size_bytes,
            error: r.error_message,
            path: r.storage_path,
        })),
        restoreWorkflows: [
            "Validate latest successful backup checksum",
            "Restore to isolated recovery environment",
            "Run smoke tests and tenant integrity checks",
            "Promote recovered environment after founder approval",
        ],
        disasterRecoveryChecklist: [
            { item: "Backup configs enabled", ready: data.backupConfigs.some((c) => c.is_enabled) },
            { item: "Recent successful backup run", ready: successfulRuns > 0 },
            { item: "Retention policy configured", ready: data.backupConfigs.some((c) => c.retention_count > 0) },
            { item: "Disaster recovery mode documented", ready: latestOps != null },
            { item: "Operations health monitored", ready: (latestOps?.overall_score ?? 0) > 0 },
        ],
        disasterRecoveryMode: Boolean(latestOps?.disaster_recovery_mode),
    };
}

export function buildPerformanceAnalytics(data: AiOperationsCenterRawData): PerformanceAnalytics {
    const slowTraces = [...data.traces].sort((a, b) => b.duration_ms - a.duration_ms);
    const slowPages = slowTraces.slice(0, 10).map((t) => ({
        id: t.id,
        name: `trace ${t.trace_id}`,
        durationMs: t.duration_ms,
        status: t.status,
    }));
    const slowQueries = data.opsFailures
        .filter((f) => /query|db|sql|latency|slow/i.test(`${f.failure_type} ${f.error_message}`))
        .map((f) => ({
            id: f.id,
            name: f.failure_type,
            durationMs: 0,
            status: f.status,
        }));
    if (!slowQueries.length) {
        for (const d of data.databaseHealth.slice(0, 5)) {
            slowQueries.push({
                id: d.id,
                name: `db pool ${d.connection_pool_used}`,
                durationMs: Math.round((100 - d.health_score) * 10),
                status: d.status,
            });
        }
    }

    const suggestions = [
        data.platformMetrics[0] && data.platformMetrics[0].cpu_percent > 80
            ? "CPU elevated — scale workers or reduce background job concurrency."
            : "CPU within expected range.",
        data.platformMetrics[0] && data.platformMetrics[0].memory_percent > 80
            ? "Memory pressure detected — review cache TTLs and large payload handlers."
            : "Memory utilization healthy.",
        slowPages[0] && slowPages[0].durationMs > 2000
            ? `Slowest trace ${slowPages[0].durationMs}ms — profile spans and optimize hot paths.`
            : "No severe slow-page outliers in current traces.",
        data.retryQueue.length > 10
            ? "Retry queue growing — inspect dead-letter jobs and fix root failures."
            : "Retry queue depth is manageable.",
    ];

    return {
        slowPages,
        slowQueries,
        suggestions,
        avgTraceMs: avg(data.traces.map((t) => t.duration_ms).filter((n) => n > 0)),
    };
}

export function buildExecutiveOperationsDashboard(data: AiOperationsCenterRawData): ExecutiveOperationsDashboard {
    const health = buildSystemHealthDashboard(data);
    const infra = buildInfrastructureMonitoring(data);
    const alerts = buildAlertCenter(data);
    const agents = buildAiAgentMonitor(data);
    const activeCustomers = data.clients.filter((c) => /active|customer|won|live/i.test(c.status)).length
        || data.clients.length;
    const automationHealth = data.dweHealth[0]?.overall_score ?? agents.avgSuccessRate ?? null;
    const sla = infra.availabilityPercent ?? health.overallScore;
    const ops = data.opsHealth[0];

    return {
        platformHealth: health.overallScore ?? ops?.overall_score ?? null,
        slaPercent: sla,
        uptimePercent: ops?.uptime_percent ?? infra.availabilityPercent ?? null,
        activeCustomers,
        automationHealth,
        openAlerts: data.opsMetrics[0]?.open_alerts ?? alerts.critical + alerts.warning,
        summary:
            ops?.summary
            || `Platform health ${health.overallScore ?? "—"}, uptime ${ops?.uptime_percent ?? "—"}%, alerts ${alerts.critical + alerts.warning}.`,
    };
}

export function createEmptyAiOperationsCenterSnapshot(
    accessGranted: boolean,
    reason?: string,
): AiOperationsCenterSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason: reason,
        fetchedAt: new Date().toISOString(),
        health: {
            domains: AOC_HEALTH_DOMAINS.map((domain) => ({
                domain,
                score: null,
                status: "unknown",
                detail: "",
                lastCheckAt: "",
            })),
            overallScore: null,
            moduleRows: [],
            backgroundJobs: 0,
            queueDepth: 0,
        },
        agents: { rows: [], activeAgents: 0, totalTokenUsage: 0, totalCostUsd: 0, avgSuccessRate: null },
        infrastructure: {
            cpuPercent: null,
            memoryPercent: null,
            avgResponseMs: null,
            errorRate: null,
            availabilityPercent: null,
            services: [],
            failures: 0,
        },
        security: { loginActivity: [], rbacAudit: [], suspiciousEvents: 0, securityAlerts: 0 },
        logs: { rows: [], byKind: AOC_LOG_KINDS.map((kind) => ({ kind, count: 0 })) },
        alerts: { rows: [], critical: 0, warning: 0, notificationHistory: [] },
        backup: {
            configs: [],
            runs: [],
            restoreWorkflows: [],
            disasterRecoveryChecklist: [],
            disasterRecoveryMode: false,
        },
        performance: { slowPages: [], slowQueries: [], suggestions: [], avgTraceMs: null },
        executive: {
            platformHealth: null,
            slaPercent: null,
            uptimePercent: null,
            activeCustomers: 0,
            automationHealth: null,
            openAlerts: 0,
            summary: "",
        },
    };
}

export function buildAiOperationsCenterSnapshot(data: AiOperationsCenterRawData): AiOperationsCenterSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        health: buildSystemHealthDashboard(data),
        agents: buildAiAgentMonitor(data),
        infrastructure: buildInfrastructureMonitoring(data),
        security: buildSecurityCenter(data),
        logs: buildLogsAndAudit(data),
        alerts: buildAlertCenter(data),
        backup: buildBackupAndRecovery(data),
        performance: buildPerformanceAnalytics(data),
        executive: buildExecutiveOperationsDashboard(data),
    };
}
