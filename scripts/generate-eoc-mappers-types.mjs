#!/usr/bin/env node
/**
 * Generates operations-center-mappers.ts and types/index.ts for Sprint 7.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "OperationsCenter", key: "center_key", title: "center_name", sub: "center_key", hub: false, orgOnly: false, createFields: ["centerKey", "centerName", "environment"] },
    { pascal: "OverallHealth", key: "health_key", title: "health_key", sub: "health_type", hub: true, orgOnly: false, createFields: ["healthKey", "healthType", "healthScore"] },
    { pascal: "ModuleHealth", key: "health_key", title: "module_name", sub: "health_key", hub: true, orgOnly: false, createFields: ["healthKey", "moduleName", "healthScore"] },
    { pascal: "DatabaseHealth", key: "health_key", title: "health_key", sub: "health_key", hub: true, orgOnly: false, createFields: ["healthKey", "healthScore"] },
    { pascal: "JobScheduler", key: "scheduler_key", title: "scheduler_name", sub: "scheduler_key", hub: true, orgOnly: false, createFields: ["schedulerKey", "schedulerName", "workerPoolSize"] },
    { pascal: "RecurringJob", key: "job_key", title: "job_name", sub: "job_key", hub: true, orgOnly: false, createFields: ["jobKey", "jobName", "jobStatus"] },
    { pascal: "JobRetryQueue", key: "queue_key", title: "queue_key", sub: "job_ref", hub: true, orgOnly: false, createFields: ["queueKey", "jobRef", "priority"] },
    { pascal: "JobDeadLetter", key: "dead_letter_key", title: "dead_letter_key", sub: "job_ref", hub: true, orgOnly: false, createFields: ["deadLetterKey", "jobRef", "deadLetterStatus"] },
    { pascal: "PlatformEvent", key: "event_key", title: "event_key", sub: "event_type", hub: true, orgOnly: false, createFields: ["eventKey", "eventType", "eventStatus"] },
    { pascal: "BusinessEvent", key: "event_key", title: "event_key", sub: "event_type", hub: true, orgOnly: false, createFields: ["eventKey", "eventType", "eventStatus"] },
    { pascal: "EventSubscription", key: "subscription_key", title: "subscription_key", sub: "event_type", hub: true, orgOnly: false, createFields: ["subscriptionKey", "eventType"] },
    { pascal: "EventReplay", key: "replay_key", title: "replay_key", sub: "event_type", hub: true, orgOnly: false, createFields: ["replayKey", "eventType", "replayStatus"] },
    { pascal: "Alert", key: "alert_key", title: "alert_key", sub: "alert_severity", hub: true, orgOnly: false, createFields: ["alertKey", "alertSeverity", "alertStatus"] },
    { pascal: "EscalationRule", key: "rule_key", title: "rule_name", sub: "rule_key", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "alertSeverity"] },
    { pascal: "AlertAcknowledgement", key: "ack_key", title: "ack_key", sub: "ack_key", hub: true, orgOnly: false, createFields: ["ackKey", "ackStatus"] },
    { pascal: "MaintenanceWindow", key: "window_key", title: "window_name", sub: "window_key", hub: true, orgOnly: false, createFields: ["windowKey", "windowName"] },
    { pascal: "GlobalFlag", key: "flag_key", title: "flag_name", sub: "flag_key", hub: true, orgOnly: false, createFields: ["flagKey", "flagName", "enabled"] },
    { pascal: "TenantFlag", key: "flag_key", title: "flag_name", sub: "flag_key", hub: true, orgOnly: false, createFields: ["flagKey", "flagName", "enabled"] },
    { pascal: "BetaFeature", key: "feature_key", title: "feature_name", sub: "feature_key", hub: true, orgOnly: false, createFields: ["featureKey", "featureName"] },
    { pascal: "RolloutConfig", key: "rollout_key", title: "rollout_key", sub: "flag_key", hub: true, orgOnly: false, createFields: ["rolloutKey", "flagKey", "rolloutPercent"] },
    { pascal: "PlatformConfig", key: "config_key", title: "config_name", sub: "config_key", hub: true, orgOnly: false, createFields: ["configKey", "configName"] },
    { pascal: "TenantConfig", key: "config_key", title: "config_name", sub: "config_key", hub: true, orgOnly: false, createFields: ["configKey", "configName"] },
    { pascal: "SecretsMetadata", key: "secret_key", title: "secret_name", sub: "secret_key", hub: true, orgOnly: false, createFields: ["secretKey", "secretName"] },
    { pascal: "ConfigVersion", key: "version_key", title: "version_number", sub: "version_key", hub: true, orgOnly: false, createFields: ["versionKey", "versionNumber"] },
    { pascal: "PlatformLog", key: "log_key", title: "log_key", sub: "log_level", hub: true, orgOnly: false, createFields: ["logKey", "logLevel"] },
    { pascal: "PlatformMetric", key: "metrics_key", title: "metrics_key", sub: "metrics_key", hub: true, orgOnly: false, createFields: ["metricsKey", "dependencyHealth"] },
    { pascal: "TraceSummary", key: "trace_key", title: "trace_key", sub: "trace_key", hub: true, orgOnly: false, createFields: ["traceKey", "spanCount"] },
    { pascal: "ServiceRegistry", key: "service_key", title: "service_name", sub: "service_key", hub: true, orgOnly: false, createFields: ["serviceKey", "serviceName", "cacheStatus"] },
    { pascal: "OperationsMetric", key: "metrics_key", title: "metrics_key", sub: "metrics_key", hub: false, orgOnly: true, createFields: ["metricsKey", "operationalScore"] },
    { pascal: "OperationsHealth", key: "health_key", title: "health_key", sub: "health_key", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "OperationsFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const toCamel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

function buildTypes() {
    let t = `export interface EocDashboardStats {
    totalOperationsCenters: number;
    activeOperationsCenters: number;
    overallHealthCount: number;
    activeJobCount: number;
    pendingRetryCount: number;
    openAlertCount: number;
    openFailureCount: number;
    avgHealthScore: number;
    auditCount: number;
}

export interface EocPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface EocSdkPublishEventInput { operationsCenterId: string; eventKey?: string; eventName?: string; eventType?: string; }
export interface EocSdkPublishEventResult { eventId: string; eventKey: string; eventStatus: string; }
export interface EocSdkScheduleJobInput { operationsCenterId: string; schedulerKey?: string; schedulerName?: string; }
export interface EocSdkScheduleJobResult { schedulerId: string; schedulerKey: string; status: string; }
export interface EocSdkTriggerAlertInput { operationsCenterId: string; alertKey?: string; alertSeverity?: string; }
export interface EocSdkTriggerAlertResult { alertId: string; alertKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "OperationsCenter";
        const numFields = new Set(["healthScore", "queueDepth", "workerPoolSize", "priority", "dependencyHealth", "operationalScore", "overallScore", "spanCount", "rolloutPercent"]);
        const boolFields = new Set(["enabled", "disasterRecoveryMode"]);
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    operationsCenterId: string;\n    ";
        t += `export interface ${e.pascal}Summary {
    id: string;
    ${isHub ? "" : "centerName?: string;\n    "}${summaryFields}
    status: string;
}

export interface Create${e.pascal}Input {
    ${createExtra}${fields}
}

`;
    }
    return t;
}

function buildMappers() {
    const dbImports = entities.map((e) => `DbEoc${e.pascal}`).concat(["DbEocAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["EocDashboardStats", "EocPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/operations-center/types";

export function buildOperationsCenterLookupMaps(centers: DbEocOperationsCenter[]) {
    const centerNameById = new Map(centers.map((c) => [c.id, c.center_name]));
    return { centerNameById };
}

export function buildEocPipelineInfo(): EocPipelineInfo {
    const stages = [
        { key: "monitoring", label: "Monitoring" },
        { key: "healthy", label: "Healthy" },
        { key: "degraded", label: "Degraded" },
        { key: "critical", label: "Critical" },
    ];
    return { stages, currentStage: "healthy", nextStage: "degraded", previousStage: "monitoring" };
}

export function buildEocAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbEocAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "OperationsCenter";
        const numFields = new Set(["healthScore", "queueDepth", "workerPoolSize", "priority", "dependencyHealth", "operationalScore", "overallScore", "spanCount", "rolloutPercent"]);
        const boolFields = new Set(["enabled", "disasterRecoveryMode"]);
        const mapFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const cast = boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string";
            return `        ${f}: record.${snake} as ${cast},`;
        }).join("\n");
        const payloadFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const def = boolFields.has(f) ? "false" : numFields.has(f) ? "0" : "''";
            return `        ${snake}: input.${f} ?? ${def},`;
        }).join("\n");
        const centerLine = e.orgOnly || isHub ? "" : "        center_id: input.operationsCenterId,\n";
        const centerNameLine = isHub ? "" : "        centerName: maps?.centerNameById.get(record.center_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbEoc${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { centerNameById: Map<string, string> }"}): ${e.pascal}Summary {
    return {
        id: record.id,
${centerNameLine}${mapFields}
        status: record.status,
    };
}

export function build${e.pascal}Payload(organizationId: string, input: Create${e.pascal}Input): Record<string, unknown> {
    return {
        organization_id: organizationId,
${centerLine}${payloadFields}
        status: "active",
    };
}

`;
    }

    m += `export function mapOverallHealthForStats(r: DbEocOverallHealth) { return { health_score: r.health_score, status: r.status }; }
export function mapJobSchedulerForStats(r: DbEocJobScheduler) { return { scheduler_status: r.scheduler_status, status: r.status }; }
export function mapPlatformEventForStats(r: DbEocPlatformEvent) { return { event_status: r.event_status, status: r.status }; }
export function mapJobRetryQueueForStats(r: DbEocJobRetryQueue) { return { status: r.status }; }
export function mapAlertForStats(r: DbEocAlert) { return { alert_status: r.alert_status, status: r.status }; }
export function mapModuleHealthForStats(r: DbEocModuleHealth) { return { health_score: r.health_score, status: r.status }; }
export function mapOperationsHealthForStats(r: DbEocOperationsHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapOperationsFailureForStats(r: DbEocOperationsFailure) { return { status: r.status }; }

export function buildEocDashboardStats(input: {
    operationsCenters: OperationsCenterSummary[];
    overallHealth: ReturnType<typeof mapOverallHealthForStats>[];
    jobSchedulers: ReturnType<typeof mapJobSchedulerForStats>[];
    platformEvents: ReturnType<typeof mapPlatformEventForStats>[];
    jobRetryQueue: ReturnType<typeof mapJobRetryQueueForStats>[];
    alerts: ReturnType<typeof mapAlertForStats>[];
    moduleHealth: ReturnType<typeof mapModuleHealthForStats>[];
    operationsHealth: ReturnType<typeof mapOperationsHealthForStats>[];
    operationsFailures: OperationsFailureSummary[];
    auditLogs: AuditEntry[];
}): EocDashboardStats {
    const activeCenters = input.operationsCenters.filter((c) => c.status === "active").length;
    const healthScores = [...input.overallHealth.map((h) => h.health_score), ...input.moduleHealth.map((h) => h.health_score), ...input.operationsHealth.map((h) => h.overall_score)];
    const avgHealthScore = healthScores.length ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length : 0;
    return {
        totalOperationsCenters: input.operationsCenters.length,
        activeOperationsCenters: activeCenters,
        overallHealthCount: input.overallHealth.length,
        activeJobCount: input.jobSchedulers.filter((j) => j.scheduler_status === "active" || j.status === "active").length,
        pendingRetryCount: input.jobRetryQueue.filter((q) => q.status === "pending").length,
        openAlertCount: input.alerts.filter((a) => a.alert_status === "open" || a.status === "active").length,
        openFailureCount: input.operationsFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        avgHealthScore,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

writeFileSync(join(root, "src/modules/operations-center/types/index.ts"), buildTypes(), "utf8");
writeFileSync(join(root, "src/modules/database/lib/operations-center-mappers.ts"), buildMappers(), "utf8");
console.log("Generated EOC types and mappers");
