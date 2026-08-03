#!/usr/bin/env node
/**
 * Generates launch-readiness-mappers.ts and types/index.ts for Sprint 9.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "ReadinessHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "EnvironmentValidation", key: "validation_key", title: "validation_key", sub: "validation_type", hub: true, orgOnly: false, createFields: ["validationKey", "validationType", "validationScore"] },
    { pascal: "ConfigurationValidation", key: "validation_key", title: "validation_key", sub: "config_type", hub: true, orgOnly: false, createFields: ["validationKey", "configType", "validationScore"] },
    { pascal: "SecretsValidation", key: "validation_key", title: "validation_key", sub: "secret_type", hub: true, orgOnly: false, createFields: ["validationKey", "secretType", "validationScore"] },
    { pascal: "DeploymentPlan", key: "plan_key", title: "plan_name", sub: "target_version", hub: true, orgOnly: false, createFields: ["planKey", "planName", "targetVersion"] },
    { pascal: "RollbackPlan", key: "plan_key", title: "plan_key", sub: "rollback_version", hub: true, orgOnly: false, createFields: ["planKey", "rollbackVersion", "rollbackReason"] },
    { pascal: "VersionRegistry", key: "version_key", title: "version_number", sub: "release_channel", hub: true, orgOnly: false, createFields: ["versionKey", "versionNumber", "releaseChannel"] },
    { pascal: "ReleaseNote", key: "note_key", title: "note_key", sub: "version_ref", hub: true, orgOnly: false, createFields: ["noteKey", "versionRef", "noteSummary"] },
    { pascal: "BackupPolicy", key: "policy_key", title: "policy_name", sub: "policy_key", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "retentionDays"] },
    { pascal: "BackupVerification", key: "verification_key", title: "verification_key", sub: "backup_ref", hub: true, orgOnly: false, createFields: ["verificationKey", "backupRef", "verificationScore"] },
    { pascal: "RestoreVerification", key: "verification_key", title: "verification_key", sub: "restore_ref", hub: true, orgOnly: false, createFields: ["verificationKey", "restoreRef", "verificationScore"] },
    { pascal: "RecoveryDrill", key: "drill_key", title: "drill_key", sub: "drill_type", hub: true, orgOnly: false, createFields: ["drillKey", "drillType", "drillScore"] },
    { pascal: "ObservabilityLog", key: "log_key", title: "log_key", sub: "log_level", hub: true, orgOnly: false, createFields: ["logKey", "logLevel", "logSource"] },
    { pascal: "ObservabilityMetric", key: "metric_key", title: "metric_name", sub: "metric_key", hub: true, orgOnly: false, createFields: ["metricKey", "metricName", "metricValue"] },
    { pascal: "TraceRecord", key: "trace_key", title: "trace_name", sub: "trace_key", hub: true, orgOnly: false, createFields: ["traceKey", "traceName", "latencyMs"] },
    { pascal: "SlaMonitor", key: "monitor_key", title: "monitor_key", sub: "sla_target", hub: true, orgOnly: false, createFields: ["monitorKey", "slaTarget", "currentValue"] },
    { pascal: "SecurityChecklist", key: "checklist_key", title: "checklist_name", sub: "completion_score", hub: true, orgOnly: false, createFields: ["checklistKey", "checklistName", "completionScore"] },
    { pascal: "VulnerabilityReview", key: "review_key", title: "review_key", sub: "severity", hub: true, orgOnly: false, createFields: ["reviewKey", "vulnerabilityRef", "severity"] },
    { pascal: "PermissionAudit", key: "audit_key", title: "audit_key", sub: "audit_scope", hub: true, orgOnly: false, createFields: ["auditKey", "auditScope", "findingCount"] },
    { pascal: "ComplianceReview", key: "review_key", title: "review_key", sub: "compliance_type", hub: true, orgOnly: false, createFields: ["reviewKey", "complianceType", "reviewScore"] },
    { pascal: "AdminGuide", key: "guide_key", title: "guide_title", sub: "guide_version", hub: true, orgOnly: false, createFields: ["guideKey", "guideTitle", "guideVersion"] },
    { pascal: "UserGuide", key: "guide_key", title: "guide_title", sub: "guide_version", hub: true, orgOnly: false, createFields: ["guideKey", "guideTitle", "guideVersion"] },
    { pascal: "DeploymentGuide", key: "guide_key", title: "guide_title", sub: "guide_version", hub: true, orgOnly: false, createFields: ["guideKey", "guideTitle", "guideVersion"] },
    { pascal: "LaunchScoreMetric", key: "metrics_key", title: "metrics_key", sub: "overall_launch_score", hub: false, orgOnly: true, createFields: ["metricsKey", "securityScore", "overallLaunchScore"] },
    { pascal: "ReadinessValidation", key: "validation_key", title: "validation_key", sub: "validation_type", hub: true, orgOnly: false, createFields: ["validationKey", "validationType", "validationScore"] },
    { pascal: "LaunchBlocker", key: "blocker_key", title: "blocker_title", sub: "blocker_severity", hub: true, orgOnly: false, createFields: ["blockerKey", "blockerTitle", "blockerSeverity"] },
    { pascal: "ScoreSnapshot", key: "snapshot_key", title: "snapshot_key", sub: "snapshot_date", hub: true, orgOnly: false, createFields: ["snapshotKey", "snapshotDate", "overallLaunchScore"] },
    { pascal: "LaunchHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "CriticalIssue", key: "issue_key", title: "issue_title", sub: "issue_severity", hub: true, orgOnly: false, createFields: ["issueKey", "issueTitle", "issueSeverity"] },
    { pascal: "ReadinessWarning", key: "warning_key", title: "warning_key", sub: "warning_type", hub: true, orgOnly: false, createFields: ["warningKey", "warningType", "warningMessage"] },
    { pascal: "LaunchFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "validationScore", "retentionDays", "verificationScore", "drillScore", "metricValue",
    "latencyMs", "slaTarget", "currentValue", "completionScore", "findingCount", "reviewScore",
    "securityScore", "overallLaunchScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface ElrDashboardStats {
    totalReadinessHubs: number;
    activeReadinessHubs: number;
    deploymentPlanCount: number;
    backupPolicyCount: number;
    recoveryDrillCount: number;
    openBlockerCount: number;
    openFailureCount: number;
    overallLaunchScore: number;
    securityScore: number;
    reliabilityScore: number;
    performanceScore: number;
    documentationScore: number;
    operationalScore: number;
    auditCount: number;
}

export interface ElrPipelineInfo {
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

export interface ElrSdkValidateEnvironmentInput { readinessHubId: string; validationKey?: string; validationType?: string; }
export interface ElrSdkValidateEnvironmentResult { validationId: string; validationKey: string; status: string; }
export interface ElrSdkRunDeploymentCheckInput { readinessHubId: string; planKey?: string; planName?: string; }
export interface ElrSdkRunDeploymentCheckResult { planId: string; planKey: string; status: string; }
export interface ElrSdkRunRecoveryDrillInput { readinessHubId: string; drillKey?: string; drillType?: string; }
export interface ElrSdkRunRecoveryDrillResult { drillId: string; drillKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "ReadinessHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    readinessHubId: string;\n    ";
        t += `export interface ${e.pascal}Summary {
    id: string;
    ${isHub ? "" : "hubName?: string;\n    "}${summaryFields}
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
    const dbImports = entities.map((e) => `DbElr${e.pascal}`).concat(["DbElrAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["ElrDashboardStats", "ElrPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/launch-readiness/types";

export function buildReadinessHubLookupMaps(hubs: DbElrReadinessHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildElrPipelineInfo(): ElrPipelineInfo {
    const stages = [
        { key: "validate", label: "Validate" },
        { key: "deploy", label: "Deploy" },
        { key: "recover", label: "Recover" },
        { key: "launch", label: "Launch" },
    ];
    return { stages, currentStage: "deploy", nextStage: "recover", previousStage: "validate" };
}

export function buildElrAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbElrAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "ReadinessHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.readinessHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbElr${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
    return {
        id: record.id,
${hubNameLine}${mapFields}
        status: record.status,
    };
}

export function build${e.pascal}Payload(organizationId: string, input: Create${e.pascal}Input): Record<string, unknown> {
    return {
        organization_id: organizationId,
${hubLine}${payloadFields}
        status: "active",
    };
}

`;
    }

    m += `export function mapDeploymentPlanForStats(r: DbElrDeploymentPlan) { return { status: r.status }; }
export function mapBackupPolicyForStats(r: DbElrBackupPolicy) { return { status: r.status }; }
export function mapLaunchScoreMetricForStats(r: DbElrLaunchScoreMetric) {
    return {
        security_score: r.security_score,
        reliability_score: r.reliability_score,
        performance_score: r.performance_score,
        documentation_score: r.documentation_score,
        operational_score: r.operational_score,
        overall_launch_score: r.overall_launch_score,
        status: r.status,
    };
}
export function mapRecoveryDrillForStats(r: DbElrRecoveryDrill) { return { drill_score: r.drill_score, status: r.status }; }
export function mapLaunchBlockerForStats(r: DbElrLaunchBlocker) { return { blocker_severity: r.blocker_severity, status: r.status }; }
export function mapReadinessValidationForStats(r: DbElrReadinessValidation) { return { validation_score: r.validation_score, status: r.status }; }
export function mapLaunchHealthForStats(r: DbElrLaunchHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapLaunchFailureForStats(r: DbElrLaunchFailure) { return { status: r.status }; }

export function buildElrDashboardStats(input: {
    readinessHubs: ReadinessHubSummary[];
    deploymentPlans: ReturnType<typeof mapDeploymentPlanForStats>[];
    backupPolicies: ReturnType<typeof mapBackupPolicyForStats>[];
    launchScoreMetrics: ReturnType<typeof mapLaunchScoreMetricForStats>[];
    recoveryDrills: ReturnType<typeof mapRecoveryDrillForStats>[];
    launchBlockers: ReturnType<typeof mapLaunchBlockerForStats>[];
    readinessValidations: ReturnType<typeof mapReadinessValidationForStats>[];
    launchHealth: ReturnType<typeof mapLaunchHealthForStats>[];
    launchFailures: LaunchFailureSummary[];
    auditLogs: AuditEntry[];
}): ElrDashboardStats {
    const activeHubs = input.readinessHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.launchScoreMetrics[0];
    const latestHealth = input.launchHealth[0];
    return {
        totalReadinessHubs: input.readinessHubs.length,
        activeReadinessHubs: activeHubs,
        deploymentPlanCount: input.deploymentPlans.length,
        backupPolicyCount: input.backupPolicies.length,
        recoveryDrillCount: input.recoveryDrills.length,
        openBlockerCount: input.launchBlockers.filter((b) => b.status === "open" || b.blocker_severity === "critical").length,
        openFailureCount: input.launchFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallLaunchScore: latestMetrics?.overall_launch_score ?? latestHealth?.overall_score ?? 0,
        securityScore: latestMetrics?.security_score ?? 0,
        reliabilityScore: latestMetrics?.reliability_score ?? 0,
        performanceScore: latestMetrics?.performance_score ?? 0,
        documentationScore: latestMetrics?.documentation_score ?? 0,
        operationalScore: latestMetrics?.operational_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/launch-readiness/types"), { recursive: true });
writeFileSync(join(root, "src/modules/launch-readiness/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/launch-readiness-mappers.ts"), buildMappers(), "utf8");
console.log("Generated ELR types and mappers");
