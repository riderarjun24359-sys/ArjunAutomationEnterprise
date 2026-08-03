#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/launch-readiness");

const entities = [
    { tab: "readinessHubs", plural: "readinessHubs", singular: "ReadinessHub", pascal: "ReadinessHub", db: "elrReadinessHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "environmentValidations", plural: "environmentValidations", singular: "EnvironmentValidation", pascal: "EnvironmentValidation", db: "elrEnvironmentValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" } },
    { tab: "configurationValidations", plural: "configurationValidations", singular: "ConfigurationValidation", pascal: "ConfigurationValidation", db: "elrConfigurationValidations", fields: [{ name: "validationKey", type: "string" }, { name: "configType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "configType" } },
    { tab: "secretsValidations", plural: "secretsValidations", singular: "SecretsValidation", pascal: "SecretsValidation", db: "elrSecretsValidations", fields: [{ name: "validationKey", type: "string" }, { name: "secretType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "secretType" } },
    { tab: "deploymentPlans", plural: "deploymentPlans", singular: "DeploymentPlan", pascal: "DeploymentPlan", db: "elrDeploymentPlans", fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "targetVersion", type: "string" }], display: { title: "planName", sub: "targetVersion" } },
    { tab: "rollbackPlans", plural: "rollbackPlans", singular: "RollbackPlan", pascal: "RollbackPlan", db: "elrRollbackPlans", fields: [{ name: "planKey", type: "string" }, { name: "rollbackVersion", type: "string" }, { name: "rollbackReason", type: "string" }], display: { title: "planKey", sub: "rollbackVersion" } },
    { tab: "versionRegistry", plural: "versionRegistry", singular: "VersionRegistry", pascal: "VersionRegistry", db: "elrVersionRegistry", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "releaseNotes", plural: "releaseNotes", singular: "ReleaseNote", pascal: "ReleaseNote", db: "elrReleaseNotes", fields: [{ name: "noteKey", type: "string" }, { name: "versionRef", type: "string" }, { name: "noteSummary", type: "string" }], display: { title: "noteKey", sub: "versionRef" } },
    { tab: "backupPolicies", plural: "backupPolicies", singular: "BackupPolicy", pascal: "BackupPolicy", db: "elrBackupPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "retentionDays", type: "number" }], display: { title: "policyName", sub: "policyKey" } },
    { tab: "backupVerifications", plural: "backupVerifications", singular: "BackupVerification", pascal: "BackupVerification", db: "elrBackupVerifications", fields: [{ name: "verificationKey", type: "string" }, { name: "backupRef", type: "string" }, { name: "verificationScore", type: "number" }], display: { title: "verificationKey", sub: "backupRef" } },
    { tab: "restoreVerifications", plural: "restoreVerifications", singular: "RestoreVerification", pascal: "RestoreVerification", db: "elrRestoreVerifications", fields: [{ name: "verificationKey", type: "string" }, { name: "restoreRef", type: "string" }, { name: "verificationScore", type: "number" }], display: { title: "verificationKey", sub: "restoreRef" } },
    { tab: "recoveryDrills", plural: "recoveryDrills", singular: "RecoveryDrill", pascal: "RecoveryDrill", db: "elrRecoveryDrills", fields: [{ name: "drillKey", type: "string" }, { name: "drillType", type: "string" }, { name: "drillScore", type: "number" }], display: { title: "drillKey", sub: "drillType" } },
    { tab: "observabilityLogs", plural: "observabilityLogs", singular: "ObservabilityLog", pascal: "ObservabilityLog", db: "elrObservabilityLogs", fields: [{ name: "logKey", type: "string" }, { name: "logLevel", type: "select", options: "LOG_LEVEL_OPTIONS" }, { name: "logSource", type: "string" }], display: { title: "logKey", sub: "logLevel" } },
    { tab: "observabilityMetrics", plural: "observabilityMetrics", singular: "ObservabilityMetric", pascal: "ObservabilityMetric", db: "elrObservabilityMetrics", fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "metricValue", type: "number" }], display: { title: "metricName", sub: "metricKey" } },
    { tab: "traceRecords", plural: "traceRecords", singular: "TraceRecord", pascal: "TraceRecord", db: "elrTraceRecords", fields: [{ name: "traceKey", type: "string" }, { name: "traceName", type: "string" }, { name: "latencyMs", type: "number" }], display: { title: "traceName", sub: "traceKey" } },
    { tab: "slaMonitors", plural: "slaMonitors", singular: "SlaMonitor", pascal: "SlaMonitor", db: "elrSlaMonitors", fields: [{ name: "monitorKey", type: "string" }, { name: "slaTarget", type: "number" }, { name: "currentValue", type: "number" }], display: { title: "monitorKey", sub: "slaTarget" } },
    { tab: "securityChecklists", plural: "securityChecklists", singular: "SecurityChecklist", pascal: "SecurityChecklist", db: "elrSecurityChecklists", fields: [{ name: "checklistKey", type: "string" }, { name: "checklistName", type: "string" }, { name: "completionScore", type: "number" }], display: { title: "checklistName", sub: "completionScore" } },
    { tab: "vulnerabilityReviews", plural: "vulnerabilityReviews", singular: "VulnerabilityReview", pascal: "VulnerabilityReview", db: "elrVulnerabilityReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "vulnerabilityRef", type: "string" }, { name: "severity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "reviewKey", sub: "severity" } },
    { tab: "permissionAudits", plural: "permissionAudits", singular: "PermissionAudit", pascal: "PermissionAudit", db: "elrPermissionAudits", fields: [{ name: "auditKey", type: "string" }, { name: "auditScope", type: "string" }, { name: "findingCount", type: "number" }], display: { title: "auditKey", sub: "auditScope" } },
    { tab: "complianceReviews", plural: "complianceReviews", singular: "ComplianceReview", pascal: "ComplianceReview", db: "elrComplianceReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "complianceType", type: "string" }, { name: "reviewScore", type: "number" }], display: { title: "reviewKey", sub: "complianceType" } },
    { tab: "adminGuides", plural: "adminGuides", singular: "AdminGuide", pascal: "AdminGuide", db: "elrAdminGuides", fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" } },
    { tab: "userGuides", plural: "userGuides", singular: "UserGuide", pascal: "UserGuide", db: "elrUserGuides", fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" } },
    { tab: "deploymentGuides", plural: "deploymentGuides", singular: "DeploymentGuide", pascal: "DeploymentGuide", db: "elrDeploymentGuides", fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" } },
    { tab: "launchScoreMetrics", plural: "launchScoreMetrics", singular: "LaunchScoreMetric", pascal: "LaunchScoreMetric", db: "elrLaunchScoreMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "documentationScore", type: "number" }, { name: "overallLaunchScore", type: "number" }], display: { title: "metricsKey", sub: "overallLaunchScore" } },
    { tab: "readinessValidations", plural: "readinessValidations", singular: "ReadinessValidation", pascal: "ReadinessValidation", db: "elrReadinessValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" } },
    { tab: "launchBlockers", plural: "launchBlockers", singular: "LaunchBlocker", pascal: "LaunchBlocker", db: "elrLaunchBlockers", fields: [{ name: "blockerKey", type: "string" }, { name: "blockerTitle", type: "string" }, { name: "blockerSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "blockerTitle", sub: "blockerSeverity" } },
    { tab: "scoreSnapshots", plural: "scoreSnapshots", singular: "ScoreSnapshot", pascal: "ScoreSnapshot", db: "elrScoreSnapshots", fields: [{ name: "snapshotKey", type: "string" }, { name: "snapshotDate", type: "string" }, { name: "overallLaunchScore", type: "number" }], display: { title: "snapshotKey", sub: "snapshotDate" } },
    { tab: "launchHealth", plural: "launchHealth", singular: "LaunchHealth", pascal: "LaunchHealth", db: "elrLaunchHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "criticalIssues", plural: "criticalIssues", singular: "CriticalIssue", pascal: "CriticalIssue", db: "elrCriticalIssues", fields: [{ name: "issueKey", type: "string" }, { name: "issueTitle", type: "string" }, { name: "issueSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "issueTitle", sub: "issueSeverity" } },
    { tab: "readinessWarnings", plural: "readinessWarnings", singular: "ReadinessWarning", pascal: "ReadinessWarning", db: "elrReadinessWarnings", fields: [{ name: "warningKey", type: "string" }, { name: "warningType", type: "string" }, { name: "warningMessage", type: "string" }], display: { title: "warningKey", sub: "warningType" } },
    { tab: "launchFailures", plural: "launchFailures", singular: "LaunchFailure", pascal: "LaunchFailure", db: "elrLaunchFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const ELR_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const LOG_LEVEL_OPTIONS = [
    { value: "debug", label: "Debug" },
    { value: "info", label: "Info" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "critical", label: "Critical" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const ELR_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
] as const;

export const ELR_PERMISSIONS = ["elr.view", "elr.manage", "elr.approve", "elr.admin"] as const;


export const ELR_THEME = {
    primary: "rose-600",
    primaryHover: "rose-500",
    ring: "rose-500/20",
    text: "text-rose-600",
    textDark: "dark:text-rose-400",
    bg: "bg-rose-600",
    bgHover: "hover:bg-rose-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    readinessHubId: z.string().min(1),`;
    const fieldLines = e.fields.map((f) => {
        if (f.type === "number") return `    ${f.name}: z.number().optional(),`;
        if (f.type === "boolean") return `    ${f.name}: z.boolean().optional(),`;
        return `    ${f.name}: z.string().min(1).optional(),`;
    }).join("\n");
    const schemaName = e.tab.replace(/([A-Z])/g, (m) => m.toLowerCase());
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `export const ${camel}FormSchema = z.object({${hubId}
${fieldLines}
});

export type ${camel}FormValues = z.infer<typeof ${camel}FormSchema>;`;
});
writeFileSync(join(mod, "schemas/index.ts"), `import { z } from "zod";\n\n${schemaLines.join("\n\n")}\n`);

// --- service ---
const mapperImports = [
    "buildReadinessHubLookupMaps", "buildElrAuditPayload", "buildElrDashboardStats", "buildElrPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapDeploymentPlanForStats", "mapBackupPolicyForStats", "mapLaunchScoreMetricForStats", "mapRecoveryDrillForStats", "mapLaunchBlockerForStats", "mapReadinessValidationForStats", "mapLaunchHealthForStats", "mapLaunchFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "ElrDashboardStats", "ElrPipelineInfo", "ElrSdkConnectServiceInput", "ElrSdkConnectServiceResult", "ElrSdkIssueApiKeyInput", "ElrSdkIssueApiKeyResult", "ElrSdkRegisterWebhookInput", "ElrSdkRegisterWebhookResult"]).join(",\n    ");

const serviceMethods = entities.map((e) => {
    const maps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const mapCall = e.orgOnly ? `map${e.pascal}Summary` : `(r) => map${e.pascal}Summary(r, maps)`;
    const createMaps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const createReturn = e.orgOnly ? `return map${e.pascal}Summary(created);` : `return map${e.pascal}Summary(created, maps);`;
    return `
    async get${e.pascal}s(authUserId: string, email: string, fullName?: string | null): Promise<${e.pascal}Summary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];${maps}
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${mapCall});
    }

    async create${e.pascal}(authUserId: string, email: string, input: Create${e.pascal}Input, fullName?: string | null): Promise<${e.pascal}Summary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(build${e.pascal}Payload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.plural}");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/launch-readiness.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/launch-readiness-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/launch-readiness/types";

export class LaunchReadinessService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const readinessHubs = await databaseService.elrLaunchReadinesss.listByOrganization(organizationId);
        return buildReadinessHubLookupMaps(readinessHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<ElrDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildElrDashboardStats({ readinessHubs: [], deploymentPlans: [], recoveryDrills: [], launchBlockers: [], launchFailures: [], auditLogs: [] });
        const [readinessHubs, deploymentPlansRaw, backupPoliciesRaw, launchScoreMetricsRaw, recoveryDrillsRaw, launchBlockersRaw, readinessValidationsRaw, launchHealthRaw, launchFailures, auditLogs] = await Promise.all([
            this.getReadinessHubs(authUserId, email, fullName),
            databaseService.elrDeploymentPlans.listByOrganization(context.organizationId),
            databaseService.elrBackupPolicies.listByOrganization(context.organizationId),
            databaseService.elrLaunchScoreMetrics.listByOrganization(context.organizationId),
            databaseService.elrRecoveryDrills.listByOrganization(context.organizationId),
            databaseService.elrLaunchBlockers.listByOrganization(context.organizationId),
            databaseService.elrReadinessValidations.listByOrganization(context.organizationId),
            databaseService.elrLaunchHealth.listByOrganization(context.organizationId),
            this.getExecutiveFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildElrDashboardStats({
            readinessHubs,
            deploymentPlans: deploymentPlansRaw.map(mapDeploymentPlanForStats),
            backupPolicies: backupPoliciesRaw.map(mapBackupPolicyForStats),
            launchScoreMetrics: launchScoreMetricsRaw.map(mapLaunchScoreMetricForStats),
            recoveryDrills: recoveryDrillsRaw.map(mapRecoveryDrillForStats),
            launchBlockers: launchBlockersRaw.map(mapLaunchBlockerForStats),
            readinessValidations: readinessValidationsRaw.map(mapReadinessValidationForStats),
            launchHealth: launchHealthRaw.map(mapLaunchHealthForStats),
            launchFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): ElrPipelineInfo {
        return buildElrPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elrAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getReadinessHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elrLaunchReadinesss.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkValidateEnvironment(authUserId: string, email: string, input: ElrSdkConnectServiceInput, fullName?: string | null): Promise<ElrSdkConnectServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "validate_environment", moduleSource: "launch_readiness", inputPayload: { ...input } });
        const created = await this.createEnvironmentValidation(authUserId, email, { readinessHubId: input.readinessHubId, serviceKey: input.serviceKey, serviceName: input.serviceName, providerType: input.providerType, connectorStatus: "connected" }, fullName);
        return { serviceId: created.id, serviceKey: created.serviceKey, connectorStatus: created.connectorStatus };
    }

    async sdkRunDeploymentCheck(authUserId: string, email: string, input: ElrSdkIssueApiKeyInput, fullName?: string | null): Promise<ElrSdkIssueApiKeyResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.keyName, limit: 3 });
        const created = await this.createDeploymentPlan(authUserId, email, { readinessHubId: input.readinessHubId, keyName: input.keyName, apiVersion: input.apiVersion }, fullName);
        return { apiKeyId: created.id, keyName: created.keyName, status: created.status };
    }

    async sdkRunRecoveryDrill(authUserId: string, email: string, input: ElrSdkRegisterWebhookInput, fullName?: string | null): Promise<ElrSdkRegisterWebhookResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_recovery_drill", moduleSource: "launch_readiness", inputPayload: { ...input } });
        const created = await this.createRecoveryDrill(authUserId, email, { readinessHubId: input.readinessHubId, webhookKey: input.webhookKey, webhookName: input.webhookName, targetUrl: input.targetUrl }, fullName);
        return { webhookId: created.id, webhookKey: created.webhookKey, status: created.status };
    }
}

export const launchReadinessService = new LaunchReadinessService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "ElrDashboardStats", "ElrPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            launchReadinessService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useLaunchReadiness.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { launchReadinessService } from "@/src/modules/launch-readiness/services/launch-readiness.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/launch-readiness/types";

export function useLaunchReadiness() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ElrDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<ElrPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [readinessHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            launchReadinessService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(launchReadinessService.getPipelineInfo()),
${hookFetchCalls}
            launchReadinessService.getAuditLogs(authUserId, email, fullName),
            launchReadinessService.getReadinessHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${hookReturnProps},
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${hookApplySets}
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

${hookCreates}

    return {
        loading,
        stats,
        pipeline,
${hookReturnFields}
        auditLogs,
        readinessHubOptions,
        refresh,
    };
}
`);

// --- panels ---
const label = (tab) => tab.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const panelImports = entities.map((e) => `${e.pascal}sPanel`).join(",\n    ");
const schemaImports = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `    ${camel}FormSchema,\n    type ${camel}FormValues,`;
}).join("\n");

const panelFns = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    const panelName = `${e.pascal}sPanel`;
    const defaults = e.fields.reduce((acc, f) => {
        acc[f.name] = f.type === "number" ? 0 : f.type === "boolean" ? false : "";
        return acc;
    }, e.hubField === false ? {} : { readinessHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: LaunchReadinessData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise launch readiness ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.plural}.length === 0 ? <EmptyState title="No ${label(e.tab).toLowerCase()}" description="Create the first ${label(e.tab).toLowerCase()} record." /> : data.${e.plural}.map((item) => (
                    <ListCard key={item.id} title={String(item.${titleField})} subtitle={\`\${item.hubName ? item.hubName + " • " : ""}\${item.${subField}}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ${label(e.tab).toLowerCase()}" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.create${e.pascal}(v))}>
${hubSelect}${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
}).join("\n\n");

writeFileSync(join(mod, "components/LaunchReadinessPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ELR_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/launch-readiness/constants";
import type { useLaunchReadiness } from "@/src/modules/launch-readiness/hooks/useLaunchReadiness";
import {
${schemaImports}
} from "@/src/modules/launch-readiness/schemas";

type LaunchReadinessData = ReturnType<typeof useLaunchReadiness>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-rose-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-rose-600">{meta}</p> : null}</div>;
}
function ReadinessHubSelect({ data, ...props }: { data: LaunchReadinessData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select launch readiness</option>{data.readinessHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function LaunchReadinessOverviewPanel({ data }: { data: LaunchReadinessData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Launch Readiness summary" description="System health, background jobs, event bus, launchBlockers, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Readiness Hubs" subtitle={\`\${data.stats?.totalLaunchReadinesss ?? 0} total\`} meta={\`\${data.stats?.activeLaunchReadinesss ?? 0} active • \${data.stats?.deploymentPlansCount ?? 0} deployment plans\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.backupPolicyCount ?? 0} backup policies\`} meta={\`\${data.stats?.recoveryDrillCount ?? 0} recovery drills • \${data.stats?.openBlockerCount ?? 0} open blockers\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallLaunchScore ?? 0).toFixed(1)} overall launch score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first launch readiness" />
            </div></Card>
            <Card hover><SectionHeader title="Launch readiness pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Launch readiness pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function LaunchReadinessAuditLogsPanel({ data }: { data: LaunchReadinessData }) {
    return (
        <Card hover><SectionHeader title="Launch Readiness audit history" description="Security-first audit trail for jobs, events, launchBlockers, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for launch readiness." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function LaunchReadinessSdkPanel({ data }: { data: LaunchReadinessData }) {
    return (
        <Card hover><SectionHeader title="Shared Launch Readiness SDK" description="Import from @/src/modules/launch-readiness/sdk for environment validation, deployment check, and recovery drill" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createLaunchReadinessClient()" subtitle="Factory for module-scoped Launch Readiness client with auth context" meta="Primary SDK for enterprise launch readiness" />
            <ListCard title="sdkValidateEnvironment()" subtitle="Validate production environment with AI orchestration" meta="moduleSource: launch_readiness" />
            <ListCard title="sdkRunDeploymentCheck()" subtitle="Run deployment readiness check with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunRecoveryDrill()" subtitle="Run recovery drill with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {ELR_THEME.primary} • Integration hubs loaded: {data.readinessHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createLaunchReadinessClient } from "@/src/modules/launch-readiness/sdk";

const intg = createLaunchReadinessClient(userId, email, fullName);
await intg.validateEnvironment({ readinessHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runDeploymentCheck({ readinessHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runRecoveryDrill({ readinessHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/LaunchReadinessStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { ElrDashboardStats } from "@/src/modules/launch-readiness/types";

interface LaunchReadinessStatsProps { stats: ElrDashboardStats | null; }

export function LaunchReadinessStats({ stats }: LaunchReadinessStatsProps) {
    const cards = [
        { title: "Readiness Hubs", value: String(stats?.totalLaunchReadinesss ?? 0), detail: \`\${stats?.activeLaunchReadinesss ?? 0} active • \${stats?.deploymentPlansCount ?? 0} deployment plans\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.backupPolicyCount ?? 0), detail: \`\${stats?.recoveryDrillCount ?? 0} recovery drills • \${stats?.openBlockerCount ?? 0} open blockers\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallLaunchScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, launchBlockers, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-rose-600 dark:[&_p:last-child]:text-rose-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "LaunchReadinessOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "LaunchReadinessAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "LaunchReadinessSdkPanel" },
];

writeFileSync(join(mod, "components/LaunchReadinessPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    LaunchReadinessOverviewPanel,
    ${panelImports},
    LaunchReadinessAuditLogsPanel,
    LaunchReadinessSdkPanel,
} from "@/src/modules/launch-readiness/components/LaunchReadinessPanels";
import { LaunchReadinessStats } from "@/src/modules/launch-readiness/components/LaunchReadinessStats";
import { ELR_TABS } from "@/src/modules/launch-readiness/constants";
import { useLaunchReadiness } from "@/src/modules/launch-readiness/hooks/useLaunchReadiness";

const tabs = [
${tabDefs.map((t) => `    { id: ELR_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function LaunchReadinessPage() {
    const launchReadiness = useLaunchReadiness();
    const [activeTab, setActiveTab] = useState<(typeof ELR_TABS)[keyof typeof ELR_TABS]>(ELR_TABS.overview);

    if (launchReadiness.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Launch Readiness" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-600">V2 Program A Sprint 9</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Launch Readiness</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: deployment plans, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and launch readiness dashboard with security-first audit and the shared Launch Readiness SDK.
                </p>
            </motion.header>
            <LaunchReadinessStats stats={launchReadiness.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-rose-600 text-white" : "border border-slate-200 text-slate-600 hover:border-rose-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === ELR_TABS.${t.id} ? <${t.panel} data={launchReadiness} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { launchReadinessService } from "@/src/modules/launch-readiness/services/launch-readiness.service";
import type { ElrSdkConnectServiceInput, ElrSdkIssueApiKeyInput, ElrSdkRegisterWebhookInput } from "@/src/modules/launch-readiness/types";

export class LaunchReadinessClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async validateEnvironment(input: ElrSdkConnectServiceInput) {
        return launchReadinessService.sdkValidateEnvironment(this.authUserId, this.email, input, this.fullName);
    }

    async runDeploymentCheck(input: ElrSdkIssueApiKeyInput) {
        return launchReadinessService.sdkRunDeploymentCheck(this.authUserId, this.email, input, this.fullName);
    }

    async runRecoveryDrill(input: ElrSdkRegisterWebhookInput) {
        return launchReadinessService.sdkRunRecoveryDrill(this.authUserId, this.email, input, this.fullName);
    }

    async getReadinessHubs() {
        return launchReadinessService.getReadinessHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return launchReadinessService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return launchReadinessService.getPipelineInfo();
    }
}

export function createLaunchReadinessClient(authUserId: string, email: string, fullName?: string | null): LaunchReadinessClient {
    return new LaunchReadinessClient(authUserId, email, fullName);
}

export { launchReadinessService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { LaunchReadinessPage } from "@/src/modules/launch-readiness/components/LaunchReadinessPage";
export { LaunchReadinessStats } from "@/src/modules/launch-readiness/components/LaunchReadinessStats";
export { launchReadinessService } from "@/src/modules/launch-readiness/services/launch-readiness.service";
export { useLaunchReadiness } from "@/src/modules/launch-readiness/hooks/useLaunchReadiness";
export { createLaunchReadinessClient, LaunchReadinessClient } from "@/src/modules/launch-readiness/sdk";
export * from "@/src/modules/launch-readiness/types";
export * from "@/src/modules/launch-readiness/constants";
`);

console.log(`Generated launch readiness module files. ELR_TABS count: ${tabs.length}`);
