#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/launch-foundation");

const entities = [
    { tab: "launchHubs", plural: "launchHubs", singular: "LaunchHub", pascal: "LaunchHub", db: "elfLaunchHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "organizationProvisions", plural: "organizationProvisions", singular: "OrganizationProvision", pascal: "OrganizationProvision", db: "elfOrganizationProvisions", fields: [{ name: "provisionKey", type: "string" }, { name: "provisionName", type: "string" }, { name: "provisionStatus", type: "select", options: "PROVISION_STATUS_OPTIONS" }], display: { title: "provisionName", sub: "provisionStatus" } },
    { tab: "tenantProvisions", plural: "tenantProvisions", singular: "TenantProvision", pascal: "TenantProvision", db: "elfTenantProvisions", fields: [{ name: "provisionKey", type: "string" }, { name: "tenantRef", type: "string" }, { name: "provisionStatus", type: "select", options: "PROVISION_STATUS_OPTIONS" }], display: { title: "provisionKey", sub: "tenantRef" } },
    { tab: "industryPackAssignments", plural: "industryPackAssignments", singular: "IndustryPackAssignment", pascal: "IndustryPackAssignment", db: "elfIndustryPackAssignments", fields: [{ name: "assignmentKey", type: "string" }, { name: "packName", type: "string" }, { name: "packType", type: "string" }], display: { title: "packName", sub: "packType" } },
    { tab: "moduleLicenses", plural: "moduleLicenses", singular: "ModuleLicense", pascal: "ModuleLicense", db: "elfModuleLicenses", fields: [{ name: "licenseKey", type: "string" }, { name: "moduleName", type: "string" }, { name: "licenseStatus", type: "select", options: "LICENSE_STATUS_OPTIONS" }], display: { title: "moduleName", sub: "licenseStatus" } },
    { tab: "wizardProfiles", plural: "wizardProfiles", singular: "WizardProfile", pascal: "WizardProfile", db: "elfWizardProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" } },
    { tab: "wizardBranding", plural: "wizardBranding", singular: "WizardBranding", pascal: "WizardBranding", db: "elfWizardBranding", fields: [{ name: "brandingKey", type: "string" }, { name: "brandingName", type: "string" }, { name: "brandColor", type: "string" }], display: { title: "brandingName", sub: "brandColor" } },
    { tab: "wizardDepartments", plural: "wizardDepartments", singular: "WizardDepartment", pascal: "WizardDepartment", db: "elfWizardDepartments", fields: [{ name: "departmentKey", type: "string" }, { name: "departmentName", type: "string" }, { name: "departmentType", type: "string" }], display: { title: "departmentName", sub: "departmentType" } },
    { tab: "wizardSettings", plural: "wizardSettings", singular: "WizardSetting", pascal: "WizardSetting", db: "elfWizardSettings", fields: [{ name: "settingKey", type: "string" }, { name: "settingName", type: "string" }, { name: "settingValue", type: "string" }], display: { title: "settingName", sub: "settingValue" } },
    { tab: "importJobs", plural: "importJobs", singular: "ImportJob", pascal: "ImportJob", db: "elfImportJobs", fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "select", options: "IMPORT_STATUS_OPTIONS" }], display: { title: "jobName", sub: "jobStatus" } },
    { tab: "importValidations", plural: "importValidations", singular: "ImportValidation", pascal: "ImportValidation", db: "elfImportValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" } },
    { tab: "importPreviews", plural: "importPreviews", singular: "ImportPreview", pascal: "ImportPreview", db: "elfImportPreviews", fields: [{ name: "previewKey", type: "string" }, { name: "previewName", type: "string" }, { name: "recordCount", type: "number" }], display: { title: "previewName", sub: "recordCount" } },
    { tab: "importHistory", plural: "importHistory", singular: "ImportHistory", pascal: "ImportHistory", db: "elfImportHistory", fields: [{ name: "historyKey", type: "string" }, { name: "historyType", type: "string" }, { name: "importedAt", type: "string" }], display: { title: "historyKey", sub: "historyType" } },
    { tab: "goLiveChecklists", plural: "goLiveChecklists", singular: "GoLiveChecklist", pascal: "GoLiveChecklist", db: "elfGoLiveChecklists", fields: [{ name: "checklistKey", type: "string" }, { name: "checklistName", type: "string" }, { name: "completionScore", type: "number" }], display: { title: "checklistName", sub: "completionScore" } },
    { tab: "goLiveScores", plural: "goLiveScores", singular: "GoLiveScore", pascal: "GoLiveScore", db: "elfGoLiveScores", fields: [{ name: "scoreKey", type: "string" }, { name: "scoreType", type: "string" }, { name: "goLiveScore", type: "number" }], display: { title: "scoreKey", sub: "scoreType" } },
    { tab: "deploymentStatuses", plural: "deploymentStatuses", singular: "DeploymentStatus", pascal: "DeploymentStatus", db: "elfDeploymentStatuses", fields: [{ name: "statusKey", type: "string" }, { name: "deploymentName", type: "string" }, { name: "deploymentStatus", type: "select", options: "DEPLOYMENT_STATUS_OPTIONS" }], display: { title: "deploymentName", sub: "deploymentStatus" } },
    { tab: "readinessValidations", plural: "readinessValidations", singular: "ReadinessValidation", pascal: "ReadinessValidation", db: "elfReadinessValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" } },
    { tab: "customerHealthScores", plural: "customerHealthScores", singular: "CustomerHealthScore", pascal: "CustomerHealthScore", db: "elfCustomerHealthScores", fields: [{ name: "scoreKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "scoreKey", sub: "customerRef" } },
    { tab: "platformAdoption", plural: "platformAdoption", singular: "PlatformAdoption", pascal: "PlatformAdoption", db: "elfPlatformAdoption", fields: [{ name: "adoptionKey", type: "string" }, { name: "featureName", type: "string" }, { name: "adoptionRate", type: "number" }], display: { title: "featureName", sub: "adoptionRate" } },
    { tab: "featureUsage", plural: "featureUsage", singular: "FeatureUsage", pascal: "FeatureUsage", db: "elfFeatureUsage", fields: [{ name: "usageKey", type: "string" }, { name: "featureName", type: "string" }, { name: "usageCount", type: "number" }], display: { title: "featureName", sub: "usageCount" } },
    { tab: "renewalTracking", plural: "renewalTracking", singular: "RenewalTracking", pascal: "RenewalTracking", db: "elfRenewalTracking", fields: [{ name: "renewalKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "renewalStatus", type: "select", options: "RENEWAL_STATUS_OPTIONS" }], display: { title: "renewalKey", sub: "customerRef" } },
    { tab: "supportTickets", plural: "supportTickets", singular: "SupportTicket", pascal: "SupportTicket", db: "elfSupportTickets", fields: [{ name: "ticketKey", type: "string" }, { name: "ticketTitle", type: "string" }, { name: "ticketStatus", type: "select", options: "TICKET_STATUS_OPTIONS" }], display: { title: "ticketTitle", sub: "ticketStatus" } },
    { tab: "knowledgeBaseArticles", plural: "knowledgeBaseArticles", singular: "KnowledgeBaseArticle", pascal: "KnowledgeBaseArticle", db: "elfKnowledgeBaseArticles", fields: [{ name: "articleKey", type: "string" }, { name: "articleTitle", type: "string" }, { name: "articleCategory", type: "string" }], display: { title: "articleTitle", sub: "articleCategory" } },
    { tab: "incidentTracking", plural: "incidentTracking", singular: "IncidentTracking", pascal: "IncidentTracking", db: "elfIncidentTracking", fields: [{ name: "incidentKey", type: "string" }, { name: "incidentTitle", type: "string" }, { name: "incidentSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "incidentTitle", sub: "incidentSeverity" } },
    { tab: "customerRegistry", plural: "customerRegistry", singular: "CustomerRegistry", pascal: "CustomerRegistry", db: "elfCustomerRegistry", fields: [{ name: "customerKey", type: "string" }, { name: "customerName", type: "string" }, { name: "customerTier", type: "string" }], display: { title: "customerName", sub: "customerTier" } },
    { tab: "subscriptionRecords", plural: "subscriptionRecords", singular: "SubscriptionRecord", pascal: "SubscriptionRecord", db: "elfSubscriptionRecords", fields: [{ name: "subscriptionKey", type: "string" }, { name: "planName", type: "string" }, { name: "subscriptionStatus", type: "select", options: "SUBSCRIPTION_STATUS_OPTIONS" }], display: { title: "planName", sub: "subscriptionStatus" } },
    { tab: "licenseManagement", plural: "licenseManagement", singular: "LicenseManagement", pascal: "LicenseManagement", db: "elfLicenseManagement", fields: [{ name: "licenseKey", type: "string" }, { name: "licenseType", type: "string" }, { name: "licenseStatus", type: "select", options: "LICENSE_STATUS_OPTIONS" }], display: { title: "licenseKey", sub: "licenseType" } },
    { tab: "launchMetrics", plural: "launchMetrics", singular: "LaunchMetric", pascal: "LaunchMetric", db: "elfLaunchMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "platformHealthScore", type: "number" }, { name: "overallLaunchScore", type: "number" }], display: { title: "metricsKey", sub: "overallLaunchScore" } },
    { tab: "launchHealth", plural: "launchHealth", singular: "LaunchHealth", pascal: "LaunchHealth", db: "elfLaunchHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "missionControlKpis", plural: "missionControlKpis", singular: "MissionControlKpi", pascal: "MissionControlKpi", db: "elfMissionControlKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" } },
    { tab: "launchFailures", plural: "launchFailures", singular: "LaunchFailure", pascal: "LaunchFailure", db: "elfLaunchFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const ELF_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const PROVISION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "failed", label: "Failed" },
    { value: "suspended", label: "Suspended" },
] as const;

export const LICENSE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "suspended", label: "Suspended" },
    { value: "pending", label: "Pending" },
] as const;

export const IMPORT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const DEPLOYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "deploying", label: "Deploying" },
    { value: "deployed", label: "Deployed" },
    { value: "failed", label: "Failed" },
] as const;

export const RENEWAL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "at_risk", label: "At Risk" },
    { value: "churned", label: "Churned" },
] as const;

export const TICKET_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const SUBSCRIPTION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "trial", label: "Trial" },
    { value: "cancelled", label: "Cancelled" },
    { value: "expired", label: "Expired" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const ELF_PERMISSIONS = ["elf.view", "elf.manage", "elf.approve", "elf.admin"] as const;

export const ELF_STATUS_OPTIONS = [
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


export const ELF_THEME = {
    primary: "slate-600",
    primaryHover: "slate-500",
    ring: "slate-500/20",
    text: "text-slate-600",
    textDark: "dark:text-slate-400",
    bg: "bg-slate-600",
    bgHover: "hover:bg-slate-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    launchHubId: z.string().min(1),`;
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
    "buildLaunchHubLookupMaps", "buildElfAuditPayload", "buildElfDashboardStats", "buildElfPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapOrganizationProvisionForStats", "mapCustomerRegistryForStats", "mapLaunchMetricForStats", "mapImportJobForStats", "mapRetailInvoiceForStats", "mapCustomerRegistryForStats", "mapLaunchHealthForStats", "mapLaunchFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "ElfDashboardStats", "ElfPipelineInfo", "ElfSdkRegisterFormInput", "ElfSdkRegisterFormResult", "ElfSdkConfigureValidationInput", "ElfSdkConfigureValidationResult", "ElfSdkRunFormSubmissionInput", "ElfSdkRunFormSubmissionResult"]).join(",\n    ");

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
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/launch-foundation.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/launch-foundation-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/launch-foundation/types";

export class LaunchFoundationService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const launchHubs = await databaseService.elfLaunchHubs.listByOrganization(organizationId);
        return buildLaunchHubLookupMaps(launchHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<ElfDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildElfDashboardStats({ launchHubs: [], organizationProvisions: [], customerRegistry: [], launchMetrics: [], importJobs: [], retailInvoices: [], customerRegistry: [], launchHealth: [], launchFailures: [], auditLogs: [] });
        const [launchHubs, organizationProvisionsRaw, customerRegistryRaw, launchMetricsRaw, importJobsRaw, retailInvoicesRaw, customerRegistryRaw, launchHealthRaw, launchFailures, auditLogs] = await Promise.all([
            this.getLaunchHubs(authUserId, email, fullName),
            databaseService.elfCampuses.listByOrganization(context.organizationId),
            databaseService.elfAdmissions.listByOrganization(context.organizationId),
            databaseService.elfLaunchMetrics.listByOrganization(context.organizationId),
            databaseService.elfExaminations.listByOrganization(context.organizationId),
            databaseService.elfFeeInvoices.listByOrganization(context.organizationId),
            databaseService.elfTeachers.listByOrganization(context.organizationId),
            databaseService.elfLaunchHealth.listByOrganization(context.organizationId),
            this.getLaunchFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildElfDashboardStats({
            launchHubs,
            organizationProvisions: organizationProvisionsRaw.map(mapOrganizationProvisionForStats),
            customerRegistry: customerRegistryRaw.map(mapCustomerRegistryForStats),
            launchMetrics: launchMetricsRaw.map(mapLaunchMetricForStats),
            importJobs: importJobsRaw.map(mapImportJobForStats),
            retailInvoices: retailInvoicesRaw.map(mapRetailInvoiceForStats),
            customerRegistry: customerRegistryRaw.map(mapCustomerRegistryForStats),
            launchHealth: launchHealthRaw.map(mapLaunchHealthForStats),
            launchFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): ElfPipelineInfo {
        return buildElfPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elfAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getLaunchHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elfLaunchHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkProvisionOrganization(authUserId: string, email: string, input: ElfSdkRegisterFormInput, fullName?: string | null): Promise<ElfSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "provision_organization", moduleSource: "enterprise_launch_foundation", inputPayload: { ...input } });
        const created = await this.createOrganizationProvision(authUserId, email, { launchHubId: input.launchHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigureWizardProfile(authUserId: string, email: string, input: ElfSdkConfigureValidationInput, fullName?: string | null): Promise<ElfSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { launchHubId: input.launchHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunGoLiveWorkflow(authUserId: string, email: string, input: ElfSdkRunFormSubmissionInput, fullName?: string | null): Promise<ElfSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_go_live_workflow", moduleSource: "enterprise_launch_foundation", inputPayload: { ...input } });
        const created = await this.createGoLiveChecklist(authUserId, email, { launchHubId: input.launchHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const launchFoundationService = new LaunchFoundationService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "ElfDashboardStats", "ElfPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            launchFoundationService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useLaunchFoundation.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { launchFoundationService } from "@/src/modules/launch-foundation/services/launch-foundation.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/launch-foundation/types";

export function useLaunchFoundation() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ElfDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<ElfPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [launchHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            launchFoundationService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(launchFoundationService.getPipelineInfo()),
${hookFetchCalls}
            launchFoundationService.getAuditLogs(authUserId, email, fullName),
            launchFoundationService.getLaunchHubOptions(authUserId, email, fullName),
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
        launchHubOptions,
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
    }, e.hubField === false ? {} : { launchHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <LaunchHubSelect data={data} {...form.register("launchHubId")} />\n`;
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

writeFileSync(join(mod, "components/LaunchFoundationPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ELF_THEME, IMPORT_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/launch-foundation/constants";
import type { useLaunchFoundation } from "@/src/modules/launch-foundation/hooks/useLaunchFoundation";
import {
${schemaImports}
} from "@/src/modules/launch-foundation/schemas";

type RetailData = ReturnType<typeof useLaunchFoundation>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-slate-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-slate-600">{meta}</p> : null}</div>;
}
function LaunchHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.launchHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Launch Foundation summary" description="System health, background jobs, event bus, retailInvoices, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Launch Hubs" subtitle={\`\${data.stats?.totalLaunchHubs ?? 0} total\`} meta={\`\${data.stats?.activeLaunchHubs ?? 0} active • \${data.stats?.organizationProvisionCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.customerRegistryCount ?? 0} menu categories\`} meta={\`\${data.stats?.importJobCount ?? 0} importJobs • \${data.stats?.openRetailInvoiceCount ?? 0} open retailInvoices\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallLaunchScore ?? 0).toFixed(1)} overall retail score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
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
        <Card hover><SectionHeader title="Launch Foundation audit history" description="Security-first audit trail for jobs, events, retailInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Launch Foundation SDK" description="Import from @/src/modules/launch-foundation/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createLaunchFoundationClient()" subtitle="Factory for module-scoped Launch Foundation client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkProvisionOrganization()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: enterprise_launch_foundation" />
            <ListCard title="sdkConfigureWizardProfile()" subtitle="Configure wizard profile with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunGoLiveWorkflow()" subtitle="Run go-live workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {ELF_THEME.primary} • Integration hubs loaded: {data.launchHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";

const intg = createLaunchFoundationClient(userId, email, fullName);
await intg.registerCampus({ launchHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureWizardProfile({ launchHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runGoLiveWorkflow({ launchHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/LaunchFoundationStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { ElfDashboardStats } from "@/src/modules/launch-foundation/types";

interface LaunchFoundationStatsProps { stats: ElfDashboardStats | null; }

export function LaunchFoundationStats({ stats }: LaunchFoundationStatsProps) {
    const cards = [
        { title: "Launch Hubs", value: String(stats?.totalLaunchHubs ?? 0), detail: \`\${stats?.activeLaunchHubs ?? 0} active • \${stats?.organizationProvisionCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.customerRegistryCount ?? 0), detail: \`\${stats?.importJobCount ?? 0} importJobs • \${stats?.openRetailInvoiceCount ?? 0} open retailInvoices\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallLaunchScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, retailInvoices, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-slate-600 dark:[&_p:last-child]:text-slate-400">
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

writeFileSync(join(mod, "components/LaunchFoundationPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    ${panelImports},
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/launch-foundation/components/LaunchFoundationPanels";
import { LaunchFoundationStats } from "@/src/modules/launch-foundation/components/LaunchFoundationStats";
import { ELF_TABS } from "@/src/modules/launch-foundation/constants";
import { useLaunchFoundation } from "@/src/modules/launch-foundation/hooks/useLaunchFoundation";

const tabs = [
${tabDefs.map((t) => `    { id: ELF_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function LaunchFoundationPage() {
    const retail = useLaunchFoundation();
    const [activeTab, setActiveTab] = useState<(typeof ELF_TABS)[keyof typeof ELF_TABS]>(ELF_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Launch Foundation" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-600">V2 Program A Program C Sprint 4</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Launch Foundation</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Launch Foundation SDK.
                </p>
            </motion.header>
            <LaunchFoundationStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-slate-600 text-white" : "border border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === ELF_TABS.${t.id} ? <${t.panel} data={retail} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { launchFoundationService } from "@/src/modules/launch-foundation/services/launch-foundation.service";
import type { ElfSdkRegisterFormInput, ElfSdkConfigureValidationInput, ElfSdkRunFormSubmissionInput } from "@/src/modules/launch-foundation/types";

export class LaunchFoundationClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerCampus(input: ElfSdkConnectServiceInput) {
        return launchFoundationService.sdkProvisionOrganization(this.authUserId, this.email, input, this.fullName);
    }

    async configureWizardProfile(input: ElfSdkIssueApiKeyInput) {
        return launchFoundationService.sdkConfigureWizardProfile(this.authUserId, this.email, input, this.fullName);
    }

    async runGoLiveWorkflow(input: ElfSdkRegisterWebhookInput) {
        return launchFoundationService.sdkRunGoLiveWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getLaunchHubs() {
        return launchFoundationService.getLaunchHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return launchFoundationService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return launchFoundationService.getPipelineInfo();
    }
}

export function createLaunchFoundationClient(authUserId: string, email: string, fullName?: string | null): LaunchFoundationClient {
    return new LaunchFoundationClient(authUserId, email, fullName);
}

export { launchFoundationService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { LaunchFoundationPage } from "@/src/modules/launch-foundation/components/LaunchFoundationPage";
export { LaunchFoundationStats } from "@/src/modules/launch-foundation/components/LaunchFoundationStats";
export { launchFoundationService } from "@/src/modules/launch-foundation/services/launch-foundation.service";
export { useLaunchFoundation } from "@/src/modules/launch-foundation/hooks/useLaunchFoundation";
export { createLaunchFoundationClient, LaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";
export * from "@/src/modules/launch-foundation/types";
export * from "@/src/modules/launch-foundation/constants";
`);

console.log(`Generated retail operating system module files. ELF_TABS count: ${tabs.length}`);
