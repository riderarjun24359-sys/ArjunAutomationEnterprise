#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/customer-operated-platform");

const entities = [
    { tab: "operatedHubs", plural: "operatedHubs", singular: "OperatedHub", pascal: "OperatedHub", db: "copOperatedHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "signupFlows", plural: "signupFlows", singular: "SignupFlow", pascal: "SignupFlow", db: "copSignupFlows", fields: [{ name: "flowKey", type: "string" }, { name: "flowName", type: "string" }, { name: "flowStatus", type: "select", options: "FLOW_STATUS_OPTIONS" }], display: { title: "flowName", sub: "flowStatus" } },
    { tab: "orgProvisioning", plural: "orgProvisioning", singular: "OrgProvisioning", pascal: "OrgProvisioning", db: "copOrgProvisioning", fields: [{ name: "provisionKey", type: "string" }, { name: "provisionName", type: "string" }, { name: "provisionStatus", type: "select", options: "PROVISION_STATUS_OPTIONS" }], display: { title: "provisionName", sub: "provisionStatus" } },
    { tab: "domainOnboarding", plural: "domainOnboarding", singular: "DomainOnboarding", pascal: "DomainOnboarding", db: "copDomainOnboarding", fields: [{ name: "domainKey", type: "string" }, { name: "domainName", type: "string" }, { name: "domainStatus", type: "select", options: "DOMAIN_STATUS_OPTIONS" }], display: { title: "domainName", sub: "domainStatus" } },
    { tab: "emailVerifications", plural: "emailVerifications", singular: "EmailVerification", pascal: "EmailVerification", db: "copEmailVerifications", fields: [{ name: "verificationKey", type: "string" }, { name: "emailAddress", type: "string" }, { name: "verificationStatus", type: "select", options: "VERIFICATION_STATUS_OPTIONS" }], display: { title: "emailAddress", sub: "verificationStatus" } },
    { tab: "onboardingWizards", plural: "onboardingWizards", singular: "OnboardingWizard", pascal: "OnboardingWizard", db: "copOnboardingWizards", fields: [{ name: "wizardKey", type: "string" }, { name: "wizardName", type: "string" }, { name: "wizardStatus", type: "select", options: "WIZARD_STATUS_OPTIONS" }], display: { title: "wizardName", sub: "wizardStatus" } },
    { tab: "productionProfiles", plural: "productionProfiles", singular: "ProductionProfile", pascal: "ProductionProfile", db: "copProductionProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileStatus", type: "select", options: "PROFILE_STATUS_OPTIONS" }], display: { title: "profileName", sub: "profileStatus" } },
    { tab: "deploymentJobs", plural: "deploymentJobs", singular: "DeploymentJob", pascal: "DeploymentJob", db: "copDeploymentJobs", fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "jobName", sub: "jobStatus" } },
    { tab: "healthValidations", plural: "healthValidations", singular: "HealthValidation", pascal: "HealthValidation", db: "copHealthValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationName", type: "string" }, { name: "validationStatus", type: "select", options: "VALIDATION_STATUS_OPTIONS" }], display: { title: "validationName", sub: "validationStatus" } },
    { tab: "rollbackAutomations", plural: "rollbackAutomations", singular: "RollbackAutomation", pascal: "RollbackAutomation", db: "copRollbackAutomations", fields: [{ name: "rollbackKey", type: "string" }, { name: "rollbackName", type: "string" }, { name: "rollbackStatus", type: "select", options: "ROLLBACK_STATUS_OPTIONS" }], display: { title: "rollbackName", sub: "rollbackStatus" } },
    { tab: "deploymentAudits", plural: "deploymentAudits", singular: "DeploymentAudit", pascal: "DeploymentAudit", db: "copDeploymentAudits", fields: [{ name: "auditKey", type: "string" }, { name: "auditName", type: "string" }, { name: "auditStatus", type: "select", options: "AUDIT_STATUS_OPTIONS" }], display: { title: "auditName", sub: "auditStatus" } },
    { tab: "centralLogs", plural: "centralLogs", singular: "CentralLog", pascal: "CentralLog", db: "copCentralLogs", fields: [{ name: "logKey", type: "string" }, { name: "logSource", type: "string" }, { name: "logLevel", type: "string" }], display: { title: "logSource", sub: "logLevel" } },
    { tab: "metricsCollectors", plural: "metricsCollectors", singular: "MetricsCollector", pascal: "MetricsCollector", db: "copMetricsCollectors", fields: [{ name: "collectorKey", type: "string" }, { name: "collectorName", type: "string" }, { name: "collectorStatus", type: "select", options: "COLLECTOR_STATUS_OPTIONS" }], display: { title: "collectorName", sub: "collectorStatus" } },
    { tab: "distributedTraces", plural: "distributedTraces", singular: "DistributedTrace", pascal: "DistributedTrace", db: "copDistributedTraces", fields: [{ name: "traceKey", type: "string" }, { name: "traceName", type: "string" }, { name: "traceStatus", type: "select", options: "TRACE_STATUS_OPTIONS" }], display: { title: "traceName", sub: "traceStatus" } },
    { tab: "alertRules", plural: "alertRules", singular: "AlertRule", pascal: "AlertRule", db: "copAlertRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "severity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "ruleName", sub: "severity" } },
    { tab: "incidentTimelines", plural: "incidentTimelines", singular: "IncidentTimeline", pascal: "IncidentTimeline", db: "copIncidentTimelines", fields: [{ name: "incidentKey", type: "string" }, { name: "incidentTitle", type: "string" }, { name: "incidentStatus", type: "select", options: "INCIDENT_STATUS_OPTIONS" }], display: { title: "incidentTitle", sub: "incidentStatus" } },
    { tab: "backupSchedulers", plural: "backupSchedulers", singular: "BackupScheduler", pascal: "BackupScheduler", db: "copBackupSchedulers", fields: [{ name: "scheduleKey", type: "string" }, { name: "scheduleName", type: "string" }, { name: "scheduleStatus", type: "select", options: "SCHEDULE_STATUS_OPTIONS" }], display: { title: "scheduleName", sub: "scheduleStatus" } },
    { tab: "restoreValidations", plural: "restoreValidations", singular: "RestoreValidation", pascal: "RestoreValidation", db: "copRestoreValidations", fields: [{ name: "restoreKey", type: "string" }, { name: "restoreName", type: "string" }, { name: "restoreStatus", type: "select", options: "RESTORE_STATUS_OPTIONS" }], display: { title: "restoreName", sub: "restoreStatus" } },
    { tab: "maintenanceModes", plural: "maintenanceModes", singular: "MaintenanceMode", pascal: "MaintenanceMode", db: "copMaintenanceModes", fields: [{ name: "maintenanceKey", type: "string" }, { name: "maintenanceName", type: "string" }, { name: "maintenanceStatus", type: "select", options: "MAINTENANCE_STATUS_OPTIONS" }], display: { title: "maintenanceName", sub: "maintenanceStatus" } },
    { tab: "featureFlagOps", plural: "featureFlagOps", singular: "FeatureFlagOp", pascal: "FeatureFlagOp", db: "copFeatureFlagOps", fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "flagStatus", type: "select", options: "FLAG_STATUS_OPTIONS" }], display: { title: "flagName", sub: "flagStatus" } },
    { tab: "platformDiagnostics", plural: "platformDiagnostics", singular: "PlatformDiagnostic", pascal: "PlatformDiagnostic", db: "copPlatformDiagnostics", fields: [{ name: "diagnosticKey", type: "string" }, { name: "diagnosticName", type: "string" }, { name: "diagnosticStatus", type: "select", options: "DIAGNOSTIC_STATUS_OPTIONS" }], display: { title: "diagnosticName", sub: "diagnosticStatus" } },
    { tab: "betaOrganizations", plural: "betaOrganizations", singular: "BetaOrganization", pascal: "BetaOrganization", db: "copBetaOrganizations", fields: [{ name: "orgKey", type: "string" }, { name: "orgName", type: "string" }, { name: "betaStatus", type: "select", options: "BETA_STATUS_OPTIONS" }], display: { title: "orgName", sub: "betaStatus" } },
    { tab: "betaInvitations", plural: "betaInvitations", singular: "BetaInvitation", pascal: "BetaInvitation", db: "copBetaInvitations", fields: [{ name: "invitationKey", type: "string" }, { name: "inviteeEmail", type: "string" }, { name: "invitationStatus", type: "select", options: "INVITATION_STATUS_OPTIONS" }], display: { title: "inviteeEmail", sub: "invitationStatus" } },
    { tab: "feedbackCollection", plural: "feedbackCollection", singular: "FeedbackCollection", pascal: "FeedbackCollection", db: "copFeedbackCollection", fields: [{ name: "feedbackKey", type: "string" }, { name: "feedbackTitle", type: "string" }, { name: "feedbackType", type: "string" }], display: { title: "feedbackTitle", sub: "feedbackType" } },
    { tab: "featureRequests", plural: "featureRequests", singular: "FeatureRequest", pascal: "FeatureRequest", db: "copFeatureRequests", fields: [{ name: "requestKey", type: "string" }, { name: "requestTitle", type: "string" }, { name: "requestStatus", type: "select", options: "REQUEST_STATUS_OPTIONS" }], display: { title: "requestTitle", sub: "requestStatus" } },
    { tab: "bugReports", plural: "bugReports", singular: "BugReport", pascal: "BugReport", db: "copBugReports", fields: [{ name: "bugKey", type: "string" }, { name: "bugTitle", type: "string" }, { name: "bugStatus", type: "select", options: "BUG_STATUS_OPTIONS" }], display: { title: "bugTitle", sub: "bugStatus" } },
    { tab: "releaseChannels", plural: "releaseChannels", singular: "ReleaseChannel", pascal: "ReleaseChannel", db: "copReleaseChannels", fields: [{ name: "channelKey", type: "string" }, { name: "channelName", type: "string" }, { name: "channelStatus", type: "select", options: "CHANNEL_STATUS_OPTIONS" }], display: { title: "channelName", sub: "channelStatus" } },
    { tab: "operatedMetrics", plural: "operatedMetrics", singular: "OperatedMetric", pascal: "OperatedMetric", db: "copOperatedMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "productionStatusScore", type: "number" }, { name: "overallOperatedScore", type: "number" }], display: { title: "metricsKey", sub: "overallOperatedScore" } },
    { tab: "operatedHealth", plural: "operatedHealth", singular: "OperatedHealth", pascal: "OperatedHealth", db: "copOperatedHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveBriefings", plural: "executiveBriefings", singular: "ExecutiveBriefing", pascal: "ExecutiveBriefing", db: "copExecutiveBriefings", fields: [{ name: "briefingKey", type: "string" }, { name: "briefingTitle", type: "string" }, { name: "briefingType", type: "string" }], display: { title: "briefingTitle", sub: "briefingType" } },
    { tab: "platformFailures", plural: "platformFailures", singular: "PlatformFailure", pascal: "PlatformFailure", db: "copPlatformFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const COP_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const FLOW_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
] as const;

export const PROVISION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const DOMAIN_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "failed", label: "Failed" },
] as const;

export const VERIFICATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "expired", label: "Expired" },
] as const;

export const WIZARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
] as const;

export const PROFILE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const JOB_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const VALIDATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const ROLLBACK_STATUS_OPTIONS = [
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const AUDIT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const COLLECTOR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "failed", label: "Failed" },
] as const;

export const TRACE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const INCIDENT_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "investigating", label: "Investigating" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const SCHEDULE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "disabled", label: "Disabled" },
] as const;

export const RESTORE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "validated", label: "Validated" },
    { value: "failed", label: "Failed" },
] as const;

export const MAINTENANCE_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
] as const;

export const FLAG_STATUS_OPTIONS = [
    { value: "enabled", label: "Enabled" },
    { value: "disabled", label: "Disabled" },
    { value: "rollout", label: "Rollout" },
] as const;

export const DIAGNOSTIC_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const BETA_STATUS_OPTIONS = [
    { value: "invited", label: "Invited" },
    { value: "active", label: "Active" },
    { value: "graduated", label: "Graduated" },
    { value: "churned", label: "Churned" },
] as const;

export const INVITATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "expired", label: "Expired" },
] as const;

export const REQUEST_STATUS_OPTIONS = [
    { value: "submitted", label: "Submitted" },
    { value: "reviewing", label: "Reviewing" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
] as const;

export const BUG_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const CHANNEL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const COP_PERMISSIONS = ["cop.view", "cop.manage", "cop.approve", "cop.admin"] as const;

export const COP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "deployed", label: "Deployed" },
    { value: "completed", label: "Completed" },
] as const;


export const COP_THEME = {
    primary: "violet-600",
    primaryHover: "violet-500",
    ring: "violet-500/20",
    text: "text-violet-600",
    textDark: "dark:text-violet-400",
    bg: "bg-violet-600",
    bgHover: "hover:bg-violet-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    operatedHubId: z.string().min(1),`;
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
    "buildOperatedHubLookupMaps", "buildCopAuditPayload", "buildCopDashboardStats", "buildCopPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapSignupFlowForStats", "mapDeploymentJobForStats", "mapOperatedMetricForStats", "mapProductionProfileForStats", "mapCentralLogForStats", "mapDeploymentJobForStats", "mapOperatedHealthForStats", "mapPlatformFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "CopDashboardStats", "CopPipelineInfo", "CopSdkTrackCustomerHealthInput", "CopSdkTrackCustomerHealthResult", "CopSdkOpenSupportTicketInput", "CopSdkOpenSupportTicketResult", "CopSdkRunDeliveryWorkflowInput", "CopSdkRunDeliveryWorkflowResult"]).join(",\n    ");

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
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/customer-operated-platform.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/customer-operated-platform-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";
import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    ${typeImports},
} from "@/src/modules/customer-operated-platform/types";

export class CustomerOperatedPlatformService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const operatedHubs = await databaseService.copOperatedHubs.listByOrganization(organizationId);
        return buildOperatedHubLookupMaps(operatedHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CopDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildCopDashboardStats({ operatedHubs: [], signupFlows: [], deploymentJobs: [], productionProfiles: [], centralLogs: [], operatedMetrics: [], operatedHealth: [], platformFailures: [], auditLogs: [] });
        const [operatedHubs, signupFlowsRaw, deploymentJobsRaw, productionProfilesRaw, centralLogsRaw, operatedMetricsRaw, operatedHealthRaw, platformFailures, auditLogs] = await Promise.all([
            this.getOperatedHubs(authUserId, email, fullName),
            databaseService.copSignupFlows.listByOrganization(context.organizationId),
            databaseService.copDeploymentJobs.listByOrganization(context.organizationId),
            databaseService.copProductionProfiles.listByOrganization(context.organizationId),
            databaseService.copCentralLogs.listByOrganization(context.organizationId),
            databaseService.copOperatedMetrics.listByOrganization(context.organizationId),
            databaseService.copOperatedHealth.listByOrganization(context.organizationId),
            this.getPlatformFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildCopDashboardStats({
            operatedHubs,
            signupFlows: signupFlowsRaw.map(mapSignupFlowForStats),
            deploymentJobs: deploymentJobsRaw.map(mapDeploymentJobForStats),
            productionProfiles: productionProfilesRaw.map(mapProductionProfileForStats),
            centralLogs: centralLogsRaw.map(mapCentralLogForStats),
            operatedMetrics: operatedMetricsRaw.map(mapOperatedMetricForStats),
            operatedHealth: operatedHealthRaw.map(mapOperatedHealthForStats),
            platformFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): CopPipelineInfo {
        return buildCopPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.copAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getOperatedHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.copOperatedHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkLaunchOnboarding(authUserId: string, email: string, input: CopSdkLaunchOnboardingInput, fullName?: string | null): Promise<CopSdkLaunchOnboardingResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createSignupFlow(authUserId, email, { operatedHubId: input.operatedHubId, flowKey: input.flowKey, flowName: input.flowName }, fullName);
        return { flowId: created.id, flowKey: created.flowKey, status: created.status };
    }

    async sdkDeployProduction(authUserId: string, email: string, input: CopSdkDeployProductionInput, fullName?: string | null): Promise<CopSdkDeployProductionResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createDeploymentJob(authUserId, email, { operatedHubId: input.operatedHubId, jobKey: input.jobKey, jobName: input.jobName }, fullName);
        return { jobId: created.id, jobKey: created.jobKey, status: created.status };
    }

    async sdkMonitorPlatform(authUserId: string, email: string, input: CopSdkMonitorPlatformInput, fullName?: string | null): Promise<CopSdkMonitorPlatformResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const launch = createLaunchFoundationClient(authUserId, email, fullName);
        await launch.getLaunchHubs();
        const company = createCompanyFoundationClient(authUserId, email, fullName);
        await company.getCompanyHubs();
        const csd = createCustomerSuccessDeliveryClient(authUserId, email, fullName);
        await csd.getDeliveryHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createOnboardingWizard(authUserId, email, { operatedHubId: input.operatedHubId, wizardKey: input.wizardKey, wizardName: input.wizardName }, fullName);
        return { wizardId: created.id, wizardKey: created.wizardKey, status: created.status };
    }
}

export const customerOperatedPlatformService = new CustomerOperatedPlatformService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "CopDashboardStats", "CopPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            customerOperatedPlatformService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useCustomerOperatedPlatform.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { customerOperatedPlatformService } from "@/src/modules/customer-operated-platform/services/customer-operated-platform.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/customer-operated-platform/types";

export function useCustomerOperatedPlatform() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CopDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<CopPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [operatedHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            customerOperatedPlatformService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(customerOperatedPlatformService.getPipelineInfo()),
${hookFetchCalls}
            customerOperatedPlatformService.getAuditLogs(authUserId, email, fullName),
            customerOperatedPlatformService.getOperatedHubOptions(authUserId, email, fullName),
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
        operatedHubOptions,
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
    }, e.hubField === false ? {} : { operatedHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: RetailData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise retail operating system ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
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

writeFileSync(join(mod, "components/CustomerOperatedPlatformPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { COP_THEME, PROVISION_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/customer-operated-platform/constants";
import type { useCustomerOperatedPlatform } from "@/src/modules/customer-operated-platform/hooks/useCustomerOperatedPlatform";
import {
${schemaImports}
} from "@/src/modules/customer-operated-platform/schemas";

type RetailData = ReturnType<typeof useCustomerOperatedPlatform>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-violet-500/20 focus:ring-4 dark:border-slate-800 dark:bg-violet-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-violet-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-violet-600">{meta}</p> : null}</div>;
}
function OperatedHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.operatedHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Customer Operated Platform summary" description="System health, background jobs, event bus, centralLogs, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Operated Hubs" subtitle={\`\${data.stats?.totalOperatedHubs ?? 0} total\`} meta={\`\${data.stats?.activeOperatedHubs ?? 0} active • \${data.stats?.signupFlowCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.deploymentJobsCount ?? 0} menu categories\`} meta={\`\${data.stats?.productionProfilesCount ?? 0} productionProfiles • \${data.stats?.centralLogCount ?? 0} open centralLogs\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallOperatedScore ?? 0).toFixed(1)} overall retail score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first retail operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Retail operating system pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Retail operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Customer Operated Platform audit history" description="Security-first audit trail for jobs, events, centralLogs, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Customer Operated Platform SDK" description="Import from @/src/modules/customer-operated-platform/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-violet-600 dark:text-violet-300">
            <ListCard title="createCustomerOperatedPlatformClient()" subtitle="Factory for module-scoped Customer Operated Platform client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkLaunchOnboarding()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: customer_operated_platform" />
            <ListCard title="sdkDeployProduction()" subtitle="Deploy production job with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkMonitorPlatform()" subtitle="Monitor platform health with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-violet-500">Theme: {COP_THEME.primary} • Integration hubs loaded: {data.operatedHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-violet-950 p-4 text-xs text-violet-100">{\`import { createCustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";

const intg = createCustomerOperatedPlatformClient(userId, email, fullName);
await intg.registerCampus({ operatedHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.deployProduction({ operatedHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.monitorPlatform({ operatedHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/CustomerOperatedPlatformStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { CopDashboardStats } from "@/src/modules/customer-operated-platform/types";

interface CustomerOperatedPlatformStatsProps { stats: CopDashboardStats | null; }

export function CustomerOperatedPlatformStats({ stats }: CustomerOperatedPlatformStatsProps) {
    const cards = [
        { title: "Operated Hubs", value: String(stats?.totalOperatedHubs ?? 0), detail: \`\${stats?.activeOperatedHubs ?? 0} active • \${stats?.signupFlowCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.deploymentJobsCount ?? 0), detail: \`\${stats?.productionProfilesCount ?? 0} productionProfiles • \${stats?.centralLogCount ?? 0} open centralLogs\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallOperatedScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, centralLogs, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-violet-600 dark:[&_p:last-child]:text-violet-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "RetailOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "RetailAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "RetailSdkPanel" },
];

writeFileSync(join(mod, "components/CustomerOperatedPlatformPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    ${panelImports},
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/customer-operated-platform/components/CustomerOperatedPlatformPanels";
import { CustomerOperatedPlatformStats } from "@/src/modules/customer-operated-platform/components/CustomerOperatedPlatformStats";
import { COP_TABS } from "@/src/modules/customer-operated-platform/constants";
import { useCustomerOperatedPlatform } from "@/src/modules/customer-operated-platform/hooks/useCustomerOperatedPlatform";

const tabs = [
${tabDefs.map((t) => `    { id: COP_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function CustomerOperatedPlatformPage() {
    const retail = useCustomerOperatedPlatform();
    const [activeTab, setActiveTab] = useState<(typeof COP_TABS)[keyof typeof COP_TABS]>(COP_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Customer Operated Platform" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-violet-900 dark:text-violet-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-violet-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-600">V2 Program A Launch Ready to Customer Operated</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Customer Operated Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-violet-500 dark:text-violet-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Customer Operated Platform SDK.
                </p>
            </motion.header>
            <CustomerOperatedPlatformStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-slate-200 text-violet-600 hover:border-violet-300 dark:border-slate-800 dark:text-violet-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === COP_TABS.${t.id} ? <${t.panel} data={retail} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { customerOperatedPlatformService } from "@/src/modules/customer-operated-platform/services/customer-operated-platform.service";
import type { CopSdkTrackCustomerHealthInput, CopSdkOpenSupportTicketInput, CopSdkRunDeliveryWorkflowInput } from "@/src/modules/customer-operated-platform/types";

export class CustomerOperatedPlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async launchOnboarding(input: CopSdkTrackCustomerHealthInput) {
        return customerOperatedPlatformService.sdkLaunchOnboarding(this.authUserId, this.email, input, this.fullName);
    }

    async deployProduction(input: CopSdkOpenSupportTicketInput) {
        return customerOperatedPlatformService.sdkDeployProduction(this.authUserId, this.email, input, this.fullName);
    }

    async monitorPlatform(input: CopSdkRunDeliveryWorkflowInput) {
        return customerOperatedPlatformService.sdkMonitorPlatform(this.authUserId, this.email, input, this.fullName);
    }

    async getOperatedHubs() {
        return customerOperatedPlatformService.getOperatedHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return customerOperatedPlatformService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return customerOperatedPlatformService.getPipelineInfo();
    }
}

export function createCustomerOperatedPlatformClient(authUserId: string, email: string, fullName?: string | null): CustomerOperatedPlatformClient {
    return new CustomerOperatedPlatformClient(authUserId, email, fullName);
}

export { customerOperatedPlatformService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { CustomerOperatedPlatformPage } from "@/src/modules/customer-operated-platform/components/CustomerOperatedPlatformPage";
export { CustomerOperatedPlatformStats } from "@/src/modules/customer-operated-platform/components/CustomerOperatedPlatformStats";
export { customerOperatedPlatformService } from "@/src/modules/customer-operated-platform/services/customer-operated-platform.service";
export { useCustomerOperatedPlatform } from "@/src/modules/customer-operated-platform/hooks/useCustomerOperatedPlatform";
export { createCustomerOperatedPlatformClient, CustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";
export * from "@/src/modules/customer-operated-platform/types";
export * from "@/src/modules/customer-operated-platform/constants";
`);

console.log(`Generated retail operating system module files. COP_TABS count: ${tabs.length}`);
