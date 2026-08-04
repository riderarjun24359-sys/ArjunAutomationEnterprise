#!/usr/bin/env node
/**
 * Generates customer-operated-platform-mappers.ts and types/index.ts.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "OperatedHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "SignupFlow", key: "flow_key", title: "flow_name", sub: "flow_status", hub: true, orgOnly: false, createFields: ["flowKey", "flowName", "flowStatus"] },
    { pascal: "OrgProvisioning", key: "provision_key", title: "provision_name", sub: "provision_status", hub: true, orgOnly: false, createFields: ["provisionKey", "provisionName", "provisionStatus"] },
    { pascal: "DomainOnboarding", key: "domain_key", title: "domain_name", sub: "domain_status", hub: true, orgOnly: false, createFields: ["domainKey", "domainName", "domainStatus"] },
    { pascal: "EmailVerification", key: "verification_key", title: "email_address", sub: "verification_status", hub: true, orgOnly: false, createFields: ["verificationKey", "emailAddress", "verificationStatus"] },
    { pascal: "OnboardingWizard", key: "wizard_key", title: "wizard_name", sub: "wizard_status", hub: true, orgOnly: false, createFields: ["wizardKey", "wizardName", "wizardStatus"] },
    { pascal: "ProductionProfile", key: "profile_key", title: "profile_name", sub: "profile_status", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileStatus"] },
    { pascal: "DeploymentJob", key: "job_key", title: "job_name", sub: "job_status", hub: true, orgOnly: false, createFields: ["jobKey", "jobName", "jobStatus"] },
    { pascal: "HealthValidation", key: "validation_key", title: "validation_name", sub: "validation_status", hub: true, orgOnly: false, createFields: ["validationKey", "validationName", "validationStatus"] },
    { pascal: "RollbackAutomation", key: "rollback_key", title: "rollback_name", sub: "rollback_status", hub: true, orgOnly: false, createFields: ["rollbackKey", "rollbackName", "rollbackStatus"] },
    { pascal: "DeploymentAudit", key: "audit_key", title: "audit_name", sub: "audit_status", hub: true, orgOnly: false, createFields: ["auditKey", "auditName", "auditStatus"] },
    { pascal: "CentralLog", key: "log_key", title: "log_source", sub: "log_level", hub: true, orgOnly: false, createFields: ["logKey", "logSource", "logLevel"] },
    { pascal: "MetricsCollector", key: "collector_key", title: "collector_name", sub: "collector_status", hub: true, orgOnly: false, createFields: ["collectorKey", "collectorName", "collectorStatus"] },
    { pascal: "DistributedTrace", key: "trace_key", title: "trace_name", sub: "trace_status", hub: true, orgOnly: false, createFields: ["traceKey", "traceName", "traceStatus"] },
    { pascal: "AlertRule", key: "rule_key", title: "rule_name", sub: "severity", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "severity"] },
    { pascal: "IncidentTimeline", key: "incident_key", title: "incident_title", sub: "incident_status", hub: true, orgOnly: false, createFields: ["incidentKey", "incidentTitle", "incidentStatus"] },
    { pascal: "BackupScheduler", key: "schedule_key", title: "schedule_name", sub: "schedule_status", hub: true, orgOnly: false, createFields: ["scheduleKey", "scheduleName", "scheduleStatus"] },
    { pascal: "RestoreValidation", key: "restore_key", title: "restore_name", sub: "restore_status", hub: true, orgOnly: false, createFields: ["restoreKey", "restoreName", "restoreStatus"] },
    { pascal: "MaintenanceMode", key: "maintenance_key", title: "maintenance_name", sub: "maintenance_status", hub: true, orgOnly: false, createFields: ["maintenanceKey", "maintenanceName", "maintenanceStatus"] },
    { pascal: "FeatureFlagOp", key: "flag_key", title: "flag_name", sub: "flag_status", hub: true, orgOnly: false, createFields: ["flagKey", "flagName", "flagStatus"] },
    { pascal: "PlatformDiagnostic", key: "diagnostic_key", title: "diagnostic_name", sub: "diagnostic_status", hub: true, orgOnly: false, createFields: ["diagnosticKey", "diagnosticName", "diagnosticStatus"] },
    { pascal: "BetaOrganization", key: "org_key", title: "org_name", sub: "beta_status", hub: true, orgOnly: false, createFields: ["orgKey", "orgName", "betaStatus"] },
    { pascal: "BetaInvitation", key: "invitation_key", title: "invitee_email", sub: "invitation_status", hub: true, orgOnly: false, createFields: ["invitationKey", "inviteeEmail", "invitationStatus"] },
    { pascal: "FeedbackCollection", key: "feedback_key", title: "feedback_title", sub: "feedback_type", hub: true, orgOnly: false, createFields: ["feedbackKey", "feedbackTitle", "feedbackType"] },
    { pascal: "FeatureRequest", key: "request_key", title: "request_title", sub: "request_status", hub: true, orgOnly: false, createFields: ["requestKey", "requestTitle", "requestStatus"] },
    { pascal: "BugReport", key: "bug_key", title: "bug_title", sub: "bug_status", hub: true, orgOnly: false, createFields: ["bugKey", "bugTitle", "bugStatus"] },
    { pascal: "ReleaseChannel", key: "channel_key", title: "channel_name", sub: "channel_status", hub: true, orgOnly: false, createFields: ["channelKey", "channelName", "channelStatus"] },
    { pascal: "OperatedMetric", key: "metrics_key", title: "metrics_key", sub: "overall_operated_score", hub: false, orgOnly: true, createFields: ["metricsKey", "productionStatusScore", "overallOperatedScore"] },
    { pascal: "OperatedHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "ExecutiveBriefing", key: "briefing_key", title: "briefing_title", sub: "briefing_type", hub: true, orgOnly: false, createFields: ["briefingKey", "briefingTitle", "briefingType"] },
    { pascal: "PlatformFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "productionStatusScore", "overallOperatedScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface CopDashboardStats {
    totalOperatedHubs: number;
    activeOperatedHubs: number;
    signupFlowCount: number;
    deploymentJobCount: number;
    productionProfileCount: number;
    centralLogCount: number;
    openPlatformFailureCount: number;
    overallOperatedScore: number;
    productionStatusScore: number;
    onboardingCompletionRate: number;
    revenueToday: number;
    activeIncidentCount: number;
    pendingApprovalCount: number;
    platformAvailabilityScore: number;
    customerSatisfactionScore: number;
    auditCount: number;
}

export interface CopPipelineInfo {
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

export interface CopSdkLaunchOnboardingInput { operatedHubId: string; flowKey?: string; flowName?: string; }
export interface CopSdkLaunchOnboardingResult { flowId: string; flowKey: string; status: string; }
export interface CopSdkDeployProductionInput { operatedHubId: string; jobKey?: string; jobName?: string; }
export interface CopSdkDeployProductionResult { jobId: string; jobKey: string; status: string; }
export interface CopSdkMonitorPlatformInput { operatedHubId: string; wizardKey?: string; wizardName?: string; }
export interface CopSdkMonitorPlatformResult { wizardId: string; wizardKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "OperatedHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    operatedHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbCop${e.pascal}`).concat(["DbCopAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["CopDashboardStats", "CopPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/customer-operated-platform/types";

export function buildOperatedHubLookupMaps(hubs: DbCopOperatedHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildCopPipelineInfo(): CopPipelineInfo {
    const stages = [
        { key: "onboarding", label: "Onboarding" },
        { key: "production", label: "Production" },
        { key: "observability", label: "Observability" },
        { key: "operations", label: "Operations" },
        { key: "beta", label: "Beta" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "production", nextStage: "observability", previousStage: "onboarding" };
}

export function buildCopAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbCopAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "OperatedHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.operatedHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbCop${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapSignupFlowForStats(r: DbCopSignupFlow) { return { flow_status: r.flow_status, status: r.status }; }
export function mapDeploymentJobForStats(r: DbCopDeploymentJob) { return { job_status: r.job_status, status: r.status }; }
export function mapProductionProfileForStats(r: DbCopProductionProfile) { return { profile_status: r.profile_status, status: r.status }; }
export function mapCentralLogForStats(r: DbCopCentralLog) { return { log_level: r.log_level, status: r.status }; }
export function mapOperatedMetricForStats(r: DbCopOperatedMetric) {
    return {
        production_status_score: r.production_status_score,
        onboarding_completion_rate: r.onboarding_completion_rate,
        revenue_today: r.revenue_today,
        active_incident_count: r.active_incident_count,
        pending_approval_count: r.pending_approval_count,
        platform_availability_score: r.platform_availability_score,
        customer_satisfaction_score: r.customer_satisfaction_score,
        overall_operated_score: r.overall_operated_score,
        status: r.status,
    };
}
export function mapOperatedHealthForStats(r: DbCopOperatedHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapPlatformFailureForStats(r: DbCopPlatformFailure) { return { status: r.status }; }

export function buildCopDashboardStats(input: {
    operatedHubs: OperatedHubSummary[];
    signupFlows: ReturnType<typeof mapSignupFlowForStats>[];
    deploymentJobs: ReturnType<typeof mapDeploymentJobForStats>[];
    productionProfiles: ReturnType<typeof mapProductionProfileForStats>[];
    centralLogs: ReturnType<typeof mapCentralLogForStats>[];
    operatedMetrics: ReturnType<typeof mapOperatedMetricForStats>[];
    operatedHealth: ReturnType<typeof mapOperatedHealthForStats>[];
    platformFailures: PlatformFailureSummary[];
    auditLogs: AuditEntry[];
}): CopDashboardStats {
    const activeHubs = input.operatedHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.operatedMetrics[0];
    const latestHealth = input.operatedHealth[0];
    return {
        totalOperatedHubs: input.operatedHubs.length,
        activeOperatedHubs: activeHubs,
        signupFlowCount: input.signupFlows.length,
        deploymentJobCount: input.deploymentJobs.length,
        productionProfileCount: input.productionProfiles.length,
        centralLogCount: input.centralLogs.length,
        openPlatformFailureCount: input.platformFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallOperatedScore: latestMetrics?.overall_operated_score ?? latestHealth?.overall_score ?? 0,
        productionStatusScore: latestMetrics?.production_status_score ?? 0,
        onboardingCompletionRate: latestMetrics?.onboarding_completion_rate ?? 0,
        revenueToday: latestMetrics?.revenue_today ?? 0,
        activeIncidentCount: latestMetrics?.active_incident_count ?? 0,
        pendingApprovalCount: latestMetrics?.pending_approval_count ?? 0,
        platformAvailabilityScore: latestMetrics?.platform_availability_score ?? 0,
        customerSatisfactionScore: latestMetrics?.customer_satisfaction_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/customer-operated-platform/types"), { recursive: true });
writeFileSync(join(root, "src/modules/customer-operated-platform/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/customer-operated-platform-mappers.ts"), buildMappers(), "utf8");
console.log("Generated COP types and mappers");
