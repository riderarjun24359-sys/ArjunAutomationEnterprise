#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/industry-framework");

const entities = [
    { tab: "frameworkHubs", plural: "frameworkHubs", singular: "FrameworkHub", pascal: "FrameworkHub", db: "ifrFrameworkHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "industryRegistrations", plural: "industryRegistrations", singular: "IndustryRegistration", pascal: "IndustryRegistration", db: "ifrIndustryRegistrations", fields: [{ name: "registrationKey", type: "string" }, { name: "industryCode", type: "string" }, { name: "industryName", type: "string" }], display: { title: "industryName", sub: "industryCode" } },
    { tab: "industryMetadata", plural: "industryMetadata", singular: "IndustryMetadata", pascal: "IndustryMetadata", db: "ifrIndustryMetadata", fields: [{ name: "metadataKey", type: "string" }, { name: "metadataType", type: "string" }, { name: "metadataValue", type: "string" }], display: { title: "metadataKey", sub: "metadataType" } },
    { tab: "industryVersions", plural: "industryVersions", singular: "IndustryVersion", pascal: "IndustryVersion", db: "ifrIndustryVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "industryDependencies", plural: "industryDependencies", singular: "IndustryDependency", pascal: "IndustryDependency", db: "ifrIndustryDependencies", fields: [{ name: "dependencyKey", type: "string" }, { name: "dependencyType", type: "string" }, { name: "dependencyRef", type: "string" }], display: { title: "dependencyKey", sub: "dependencyType" } },
    { tab: "businessTypes", plural: "businessTypes", singular: "BusinessType", pascal: "BusinessType", db: "ifrBusinessTypes", fields: [{ name: "typeKey", type: "string" }, { name: "typeName", type: "string" }, { name: "typeCategory", type: "string" }], display: { title: "typeName", sub: "typeCategory" } },
    { tab: "businessSizes", plural: "businessSizes", singular: "BusinessSize", pascal: "BusinessSize", db: "ifrBusinessSizes", fields: [{ name: "sizeKey", type: "string" }, { name: "sizeLabel", type: "string" }, { name: "employeeRange", type: "string" }], display: { title: "sizeLabel", sub: "employeeRange" } },
    { tab: "operatingModels", plural: "operatingModels", singular: "OperatingModel", pascal: "OperatingModel", db: "ifrOperatingModels", fields: [{ name: "modelKey", type: "string" }, { name: "modelName", type: "string" }, { name: "modelType", type: "string" }], display: { title: "modelName", sub: "modelType" } },
    { tab: "industryProfiles", plural: "industryProfiles", singular: "IndustryProfile", pascal: "IndustryProfile", db: "ifrIndustryProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileScore", type: "number" }], display: { title: "profileName", sub: "profileScore" } },
    { tab: "dashboardTemplates", plural: "dashboardTemplates", singular: "DashboardTemplate", pascal: "DashboardTemplate", db: "ifrDashboardTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateVersion", type: "string" }], display: { title: "templateName", sub: "templateVersion" } },
    { tab: "workflowTemplates", plural: "workflowTemplates", singular: "WorkflowTemplate", pascal: "WorkflowTemplate", db: "ifrWorkflowTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "workflowType", type: "string" }], display: { title: "templateName", sub: "workflowType" } },
    { tab: "roleTemplates", plural: "roleTemplates", singular: "RoleTemplate", pascal: "RoleTemplate", db: "ifrRoleTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "roleName", type: "string" }, { name: "permissionsCount", type: "number" }], display: { title: "roleName", sub: "permissionsCount" } },
    { tab: "reportTemplates", plural: "reportTemplates", singular: "ReportTemplate", pascal: "ReportTemplate", db: "ifrReportTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "reportName", type: "string" }, { name: "reportFormat", type: "string" }], display: { title: "reportName", sub: "reportFormat" } },
    { tab: "dynamicConfigurations", plural: "dynamicConfigurations", singular: "DynamicConfiguration", pascal: "DynamicConfiguration", db: "ifrDynamicConfigurations", fields: [{ name: "configKey", type: "string" }, { name: "configType", type: "string" }, { name: "configValue", type: "string" }], display: { title: "configKey", sub: "configType" } },
    { tab: "featureConfigurations", plural: "featureConfigurations", singular: "FeatureConfiguration", pascal: "FeatureConfiguration", db: "ifrFeatureConfigurations", fields: [{ name: "featureKey", type: "string" }, { name: "featureName", type: "string" }, { name: "enabled", type: "boolean" }], display: { title: "featureName", sub: "featureKey" } },
    { tab: "businessRules", plural: "businessRules", singular: "BusinessRule", pascal: "BusinessRule", db: "ifrBusinessRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" } },
    { tab: "validationRules", plural: "validationRules", singular: "ValidationRule", pascal: "ValidationRule", db: "ifrValidationRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "ruleName", sub: "validationScore" } },
    { tab: "industryContexts", plural: "industryContexts", singular: "IndustryContext", pascal: "IndustryContext", db: "ifrIndustryContexts", fields: [{ name: "contextKey", type: "string" }, { name: "contextType", type: "string" }, { name: "contextPayload", type: "string" }], display: { title: "contextKey", sub: "contextType" } },
    { tab: "aiContexts", plural: "aiContexts", singular: "AiContext", pascal: "AiContext", db: "ifrAiContexts", fields: [{ name: "contextKey", type: "string" }, { name: "contextType", type: "string" }, { name: "tokenCount", type: "number" }], display: { title: "contextKey", sub: "contextType" } },
    { tab: "terminologyEntries", plural: "terminologyEntries", singular: "TerminologyEntry", pascal: "TerminologyEntry", db: "ifrTerminologyEntries", fields: [{ name: "termKey", type: "string" }, { name: "termLabel", type: "string" }, { name: "termDefinition", type: "string" }], display: { title: "termLabel", sub: "termKey" } },
    { tab: "demoProfiles", plural: "demoProfiles", singular: "DemoProfile", pascal: "DemoProfile", db: "ifrDemoProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "demoDurationDays", type: "number" }], display: { title: "profileName", sub: "demoDurationDays" } },
    { tab: "productionProfiles", plural: "productionProfiles", singular: "ProductionProfile", pascal: "ProductionProfile", db: "ifrProductionProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "deploymentTarget", type: "string" }], display: { title: "profileName", sub: "deploymentTarget" } },
    { tab: "enterpriseProfiles", plural: "enterpriseProfiles", singular: "EnterpriseProfile", pascal: "EnterpriseProfile", db: "ifrEnterpriseProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "complianceTier", type: "string" }], display: { title: "profileName", sub: "complianceTier" } },
    { tab: "sharedApis", plural: "sharedApis", singular: "SharedApi", pascal: "SharedApi", db: "ifrSharedApis", fields: [{ name: "apiKey", type: "string" }, { name: "apiName", type: "string" }, { name: "apiVersion", type: "string" }], display: { title: "apiName", sub: "apiVersion" } },
    { tab: "contextApis", plural: "contextApis", singular: "ContextApi", pascal: "ContextApi", db: "ifrContextApis", fields: [{ name: "apiKey", type: "string" }, { name: "apiName", type: "string" }, { name: "contextType", type: "string" }], display: { title: "apiName", sub: "contextType" } },
    { tab: "configurationApis", plural: "configurationApis", singular: "ConfigurationApi", pascal: "ConfigurationApi", db: "ifrConfigurationApis", fields: [{ name: "apiKey", type: "string" }, { name: "apiName", type: "string" }, { name: "configScope", type: "string" }], display: { title: "apiName", sub: "configScope" } },
    { tab: "extensionPoints", plural: "extensionPoints", singular: "ExtensionPoint", pascal: "ExtensionPoint", db: "ifrExtensionPoints", fields: [{ name: "extensionKey", type: "string" }, { name: "extensionName", type: "string" }, { name: "hookType", type: "string" }], display: { title: "extensionName", sub: "hookType" } },
    { tab: "frameworkMetrics", plural: "frameworkMetrics", singular: "FrameworkMetric", pascal: "FrameworkMetric", db: "ifrFrameworkMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "templateScore", type: "number" }, { name: "overallFrameworkScore", type: "number" }], display: { title: "metricsKey", sub: "overallFrameworkScore" } },
    { tab: "frameworkHealth", plural: "frameworkHealth", singular: "FrameworkHealth", pascal: "FrameworkHealth", db: "ifrFrameworkHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "compatibilityChecks", plural: "compatibilityChecks", singular: "CompatibilityCheck", pascal: "CompatibilityCheck", db: "ifrCompatibilityChecks", fields: [{ name: "checkKey", type: "string" }, { name: "checkType", type: "string" }, { name: "checkScore", type: "number" }], display: { title: "checkKey", sub: "checkType" } },
    { tab: "frameworkFailures", plural: "frameworkFailures", singular: "FrameworkFailure", pascal: "FrameworkFailure", db: "ifrFrameworkFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const IFR_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const IFR_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
] as const;

export const IFR_PERMISSIONS = ["ifr.view", "ifr.manage", "ifr.approve", "ifr.admin"] as const;


export const IFR_THEME = {
    primary: "teal-600",
    primaryHover: "teal-500",
    ring: "teal-500/20",
    text: "text-teal-600",
    textDark: "dark:text-teal-400",
    bg: "bg-teal-600",
    bgHover: "hover:bg-teal-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    frameworkHubId: z.string().min(1),`;
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
    "buildFrameworkHubLookupMaps", "buildIfrAuditPayload", "buildIfrDashboardStats", "buildIfrPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapDashboardTemplateForStats", "mapWorkflowTemplateForStats", "mapFrameworkMetricForStats", "mapIndustryProfileForStats", "mapCompatibilityCheckForStats", "mapValidationRuleForStats", "mapFrameworkHealthForStats", "mapFrameworkFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "IfrDashboardStats", "IfrPipelineInfo", "IfrSdkConnectServiceInput", "IfrSdkConnectServiceResult", "IfrSdkIssueApiKeyInput", "IfrSdkIssueApiKeyResult", "IfrSdkRegisterWebhookInput", "IfrSdkRegisterWebhookResult"]).join(",\n    ");

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
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/industry-framework.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/industry-framework-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/industry-framework/types";

export class IndustryFrameworkService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const frameworkHubs = await databaseService.ifrFrameworkHubs.listByOrganization(organizationId);
        return buildFrameworkHubLookupMaps(frameworkHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<IfrDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildIfrDashboardStats({ frameworkHubs: [], dashboardTemplates: [], industryProfiles: [], compatibilityChecks: [], frameworkFailures: [], auditLogs: [] });
        const [frameworkHubs, dashboardTemplatesRaw, workflowTemplatesRaw, frameworkMetricsRaw, industryProfilesRaw, compatibilityChecksRaw, validationRulesRaw, frameworkHealthRaw, frameworkFailures, auditLogs] = await Promise.all([
            this.getFrameworkHubs(authUserId, email, fullName),
            databaseService.ifrDashboardTemplates.listByOrganization(context.organizationId),
            databaseService.ifrWorkflowTemplates.listByOrganization(context.organizationId),
            databaseService.ifrFrameworkMetrics.listByOrganization(context.organizationId),
            databaseService.ifrIndustryProfiles.listByOrganization(context.organizationId),
            databaseService.ifrCompatibilityChecks.listByOrganization(context.organizationId),
            databaseService.ifrValidationRules.listByOrganization(context.organizationId),
            databaseService.ifrFrameworkHealth.listByOrganization(context.organizationId),
            this.getExecutiveFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildIfrDashboardStats({
            frameworkHubs,
            dashboardTemplates: dashboardTemplatesRaw.map(mapDashboardTemplateForStats),
            workflowTemplates: workflowTemplatesRaw.map(mapWorkflowTemplateForStats),
            frameworkMetrics: frameworkMetricsRaw.map(mapFrameworkMetricForStats),
            industryProfiles: industryProfilesRaw.map(mapIndustryProfileForStats),
            compatibilityChecks: compatibilityChecksRaw.map(mapCompatibilityCheckForStats),
            validationRules: validationRulesRaw.map(mapValidationRuleForStats),
            frameworkHealth: frameworkHealthRaw.map(mapFrameworkHealthForStats),
            frameworkFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): IfrPipelineInfo {
        return buildIfrPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ifrAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getFrameworkHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ifrFrameworkHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterIndustry(authUserId: string, email: string, input: IfrSdkConnectServiceInput, fullName?: string | null): Promise<IfrSdkConnectServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_industry", moduleSource: "industry_framework", inputPayload: { ...input } });
        const created = await this.createIndustryRegistration(authUserId, email, { frameworkHubId: input.frameworkHubId, serviceKey: input.serviceKey, serviceName: input.serviceName, providerType: input.providerType, connectorStatus: "connected" }, fullName);
        return { serviceId: created.id, serviceKey: created.serviceKey, connectorStatus: created.connectorStatus };
    }

    async sdkConfigureTemplate(authUserId: string, email: string, input: IfrSdkIssueApiKeyInput, fullName?: string | null): Promise<IfrSdkIssueApiKeyResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.keyName, limit: 3 });
        const created = await this.createDashboardTemplate(authUserId, email, { frameworkHubId: input.frameworkHubId, keyName: input.keyName, apiVersion: input.apiVersion }, fullName);
        return { apiKeyId: created.id, keyName: created.keyName, status: created.status };
    }

    async sdkRunCompatibilityCheck(authUserId: string, email: string, input: IfrSdkRegisterWebhookInput, fullName?: string | null): Promise<IfrSdkRegisterWebhookResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_compatibility_check", moduleSource: "industry_framework", inputPayload: { ...input } });
        const created = await this.createIndustryProfile(authUserId, email, { frameworkHubId: input.frameworkHubId, webhookKey: input.webhookKey, webhookName: input.webhookName, targetUrl: input.targetUrl }, fullName);
        return { webhookId: created.id, webhookKey: created.webhookKey, status: created.status };
    }
}

export const industryFrameworkService = new IndustryFrameworkService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "IfrDashboardStats", "IfrPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            industryFrameworkService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useIndustryFramework.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { industryFrameworkService } from "@/src/modules/industry-framework/services/industry-framework.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/industry-framework/types";

export function useIndustryFramework() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<IfrDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<IfrPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [frameworkHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            industryFrameworkService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(industryFrameworkService.getPipelineInfo()),
${hookFetchCalls}
            industryFrameworkService.getAuditLogs(authUserId, email, fullName),
            industryFrameworkService.getFrameworkHubOptions(authUserId, email, fullName),
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
        frameworkHubOptions,
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
    }, e.hubField === false ? {} : { frameworkHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <FrameworkHubSelect data={data} {...form.register("frameworkHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: IndustryFrameworkData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise industry framework ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
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

writeFileSync(join(mod, "components/IndustryFrameworkPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { IFR_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/industry-framework/constants";
import type { useIndustryFramework } from "@/src/modules/industry-framework/hooks/useIndustryFramework";
import {
${schemaImports}
} from "@/src/modules/industry-framework/schemas";

type IndustryFrameworkData = ReturnType<typeof useIndustryFramework>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-teal-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-teal-600">{meta}</p> : null}</div>;
}
function FrameworkHubSelect({ data, ...props }: { data: IndustryFrameworkData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select industry framework</option>{data.frameworkHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function IndustryFrameworkOverviewPanel({ data }: { data: IndustryFrameworkData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Industry Framework summary" description="System health, background jobs, event bus, compatibilityChecks, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Framework Hubs" subtitle={\`\${data.stats?.totalFrameworkHubs ?? 0} total\`} meta={\`\${data.stats?.activeFrameworkHubs ?? 0} active • \${data.stats?.dashboardTemplateCount ?? 0} dashboard templates\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.workflowTemplateCount ?? 0} workflow templates\`} meta={\`\${data.stats?.industryProfileCount ?? 0} industry profiles • \${data.stats?.openCompatibilityCount ?? 0} open compatibility issues\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallFrameworkScore ?? 0).toFixed(1)} overall framework score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first industry framework" />
            </div></Card>
            <Card hover><SectionHeader title="Industry framework pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Industry framework pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function IndustryFrameworkAuditLogsPanel({ data }: { data: IndustryFrameworkData }) {
    return (
        <Card hover><SectionHeader title="Industry Framework audit history" description="Security-first audit trail for jobs, events, compatibilityChecks, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for industry framework." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function IndustryFrameworkSdkPanel({ data }: { data: IndustryFrameworkData }) {
    return (
        <Card hover><SectionHeader title="Shared Industry Framework SDK" description="Import from @/src/modules/industry-framework/sdk for industry registration, template configuration, and compatibility check" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createIndustryFrameworkClient()" subtitle="Factory for module-scoped Industry Framework client with auth context" meta="Primary SDK for enterprise industry framework" />
            <ListCard title="sdkRegisterIndustry()" subtitle="Register industry profile with AI orchestration" meta="moduleSource: industry_framework" />
            <ListCard title="sdkConfigureTemplate()" subtitle="Configure industry template with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunCompatibilityCheck()" subtitle="Run compatibility check with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {IFR_THEME.primary} • Integration hubs loaded: {data.frameworkHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";

const intg = createIndustryFrameworkClient(userId, email, fullName);
await intg.registerIndustry({ frameworkHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureTemplate({ frameworkHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runCompatibilityCheck({ frameworkHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/IndustryFrameworkStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { IfrDashboardStats } from "@/src/modules/industry-framework/types";

interface IndustryFrameworkStatsProps { stats: IfrDashboardStats | null; }

export function IndustryFrameworkStats({ stats }: IndustryFrameworkStatsProps) {
    const cards = [
        { title: "Framework Hubs", value: String(stats?.totalFrameworkHubs ?? 0), detail: \`\${stats?.activeFrameworkHubs ?? 0} active • \${stats?.dashboardTemplateCount ?? 0} dashboard templates\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.workflowTemplateCount ?? 0), detail: \`\${stats?.industryProfileCount ?? 0} industry profiles • \${stats?.openCompatibilityCount ?? 0} open compatibility issues\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallFrameworkScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, compatibilityChecks, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-teal-600 dark:[&_p:last-child]:text-teal-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "IndustryFrameworkOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "IndustryFrameworkAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "IndustryFrameworkSdkPanel" },
];

writeFileSync(join(mod, "components/IndustryFrameworkPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    IndustryFrameworkOverviewPanel,
    ${panelImports},
    IndustryFrameworkAuditLogsPanel,
    IndustryFrameworkSdkPanel,
} from "@/src/modules/industry-framework/components/IndustryFrameworkPanels";
import { IndustryFrameworkStats } from "@/src/modules/industry-framework/components/IndustryFrameworkStats";
import { IFR_TABS } from "@/src/modules/industry-framework/constants";
import { useIndustryFramework } from "@/src/modules/industry-framework/hooks/useIndustryFramework";

const tabs = [
${tabDefs.map((t) => `    { id: IFR_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function IndustryFrameworkPage() {
    const industryFramework = useIndustryFramework();
    const [activeTab, setActiveTab] = useState<(typeof IFR_TABS)[keyof typeof IFR_TABS]>(IFR_TABS.overview);

    if (industryFramework.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Industry Framework" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-600">V2 Program A Program B Sprint 1</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Industry Framework</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dashboard templates, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and industry framework dashboard with security-first audit and the shared Industry Framework SDK.
                </p>
            </motion.header>
            <IndustryFrameworkStats stats={industryFramework.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-600 hover:border-teal-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === IFR_TABS.${t.id} ? <${t.panel} data={industryFramework} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { industryFrameworkService } from "@/src/modules/industry-framework/services/industry-framework.service";
import type { IfrSdkConnectServiceInput, IfrSdkIssueApiKeyInput, IfrSdkRegisterWebhookInput } from "@/src/modules/industry-framework/types";

export class IndustryFrameworkClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerIndustry(input: IfrSdkConnectServiceInput) {
        return industryFrameworkService.sdkRegisterIndustry(this.authUserId, this.email, input, this.fullName);
    }

    async configureTemplate(input: IfrSdkIssueApiKeyInput) {
        return industryFrameworkService.sdkConfigureTemplate(this.authUserId, this.email, input, this.fullName);
    }

    async runCompatibilityCheck(input: IfrSdkRegisterWebhookInput) {
        return industryFrameworkService.sdkRunCompatibilityCheck(this.authUserId, this.email, input, this.fullName);
    }

    async getFrameworkHubs() {
        return industryFrameworkService.getFrameworkHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return industryFrameworkService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return industryFrameworkService.getPipelineInfo();
    }
}

export function createIndustryFrameworkClient(authUserId: string, email: string, fullName?: string | null): IndustryFrameworkClient {
    return new IndustryFrameworkClient(authUserId, email, fullName);
}

export { industryFrameworkService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { IndustryFrameworkPage } from "@/src/modules/industry-framework/components/IndustryFrameworkPage";
export { IndustryFrameworkStats } from "@/src/modules/industry-framework/components/IndustryFrameworkStats";
export { industryFrameworkService } from "@/src/modules/industry-framework/services/industry-framework.service";
export { useIndustryFramework } from "@/src/modules/industry-framework/hooks/useIndustryFramework";
export { createIndustryFrameworkClient, IndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
export * from "@/src/modules/industry-framework/types";
export * from "@/src/modules/industry-framework/constants";
`);

console.log(`Generated industry framework module files. IFR_TABS count: ${tabs.length}`);
