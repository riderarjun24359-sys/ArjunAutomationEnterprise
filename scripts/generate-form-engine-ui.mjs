#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/form-engine");

const entities = [
    { tab: "formHubs", plural: "formHubs", singular: "FormHub", pascal: "FormHub", db: "dfeFormHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "formDefinitions", plural: "formDefinitions", singular: "FormDefinition", pascal: "FormDefinition", db: "dfeFormDefinitions", fields: [{ name: "formKey", type: "string" }, { name: "formName", type: "string" }, { name: "formType", type: "string" }], display: { title: "formName", sub: "formType" } },
    { tab: "formCategories", plural: "formCategories", singular: "FormCategory", pascal: "FormCategory", db: "dfeFormCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" } },
    { tab: "formVersions", plural: "formVersions", singular: "FormVersion", pascal: "FormVersion", db: "dfeFormVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "formDependencies", plural: "formDependencies", singular: "FormDependency", pascal: "FormDependency", db: "dfeFormDependencies", fields: [{ name: "dependencyKey", type: "string" }, { name: "dependencyType", type: "string" }, { name: "dependencyRef", type: "string" }], display: { title: "dependencyKey", sub: "dependencyType" } },
    { tab: "formSections", plural: "formSections", singular: "FormSection", pascal: "FormSection", db: "dfeFormSections", fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "sectionOrder", type: "number" }], display: { title: "sectionName", sub: "sectionOrder" } },
    { tab: "formTabs", plural: "formTabs", singular: "FormTab", pascal: "FormTab", db: "dfeFormTabs", fields: [{ name: "tabKey", type: "string" }, { name: "tabName", type: "string" }, { name: "tabOrder", type: "number" }], display: { title: "tabName", sub: "tabOrder" } },
    { tab: "formGroups", plural: "formGroups", singular: "FormGroup", pascal: "FormGroup", db: "dfeFormGroups", fields: [{ name: "groupKey", type: "string" }, { name: "groupName", type: "string" }, { name: "groupOrder", type: "number" }], display: { title: "groupName", sub: "groupOrder" } },
    { tab: "repeatableSections", plural: "repeatableSections", singular: "RepeatableSection", pascal: "RepeatableSection", db: "dfeRepeatableSections", fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "minInstances", type: "number" }], display: { title: "sectionName", sub: "minInstances" } },
    { tab: "formFields", plural: "formFields", singular: "FormField", pascal: "FormField", db: "dfeFormFields", fields: [{ name: "fieldKey", type: "string" }, { name: "fieldName", type: "string" }, { name: "fieldType", type: "string" }], display: { title: "fieldName", sub: "fieldType" } },
    { tab: "fieldOptions", plural: "fieldOptions", singular: "FieldOption", pascal: "FieldOption", db: "dfeFieldOptions", fields: [{ name: "optionKey", type: "string" }, { name: "optionLabel", type: "string" }, { name: "optionValue", type: "string" }], display: { title: "optionLabel", sub: "optionValue" } },
    { tab: "formulaFields", plural: "formulaFields", singular: "FormulaField", pascal: "FormulaField", db: "dfeFormulaFields", fields: [{ name: "formulaKey", type: "string" }, { name: "formulaName", type: "string" }, { name: "formulaExpression", type: "string" }], display: { title: "formulaName", sub: "formulaExpression" } },
    { tab: "mediaFields", plural: "mediaFields", singular: "MediaField", pascal: "MediaField", db: "dfeMediaFields", fields: [{ name: "mediaKey", type: "string" }, { name: "mediaName", type: "string" }, { name: "mediaType", type: "string" }], display: { title: "mediaName", sub: "mediaType" } },
    { tab: "requiredRules", plural: "requiredRules", singular: "RequiredRule", pascal: "RequiredRule", db: "dfeRequiredRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "fieldRef", type: "string" }], display: { title: "ruleName", sub: "fieldRef" } },
    { tab: "regexRules", plural: "regexRules", singular: "RegexRule", pascal: "RegexRule", db: "dfeRegexRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "pattern", type: "string" }], display: { title: "ruleName", sub: "pattern" } },
    { tab: "rangeRules", plural: "rangeRules", singular: "RangeRule", pascal: "RangeRule", db: "dfeRangeRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "minValue", type: "number" }], display: { title: "ruleName", sub: "minValue" } },
    { tab: "crossFieldRules", plural: "crossFieldRules", singular: "CrossFieldRule", pascal: "CrossFieldRule", db: "dfeCrossFieldRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleExpression", type: "string" }], display: { title: "ruleName", sub: "ruleExpression" } },
    { tab: "formDrafts", plural: "formDrafts", singular: "FormDraft", pascal: "FormDraft", db: "dfeFormDrafts", fields: [{ name: "draftKey", type: "string" }, { name: "draftName", type: "string" }, { name: "draftStatus", type: "string" }], display: { title: "draftName", sub: "draftStatus" } },
    { tab: "formSubmissions", plural: "formSubmissions", singular: "FormSubmission", pascal: "FormSubmission", db: "dfeFormSubmissions", fields: [{ name: "submissionKey", type: "string" }, { name: "submissionName", type: "string" }, { name: "submissionStatus", type: "string" }], display: { title: "submissionName", sub: "submissionStatus" } },
    { tab: "formReviews", plural: "formReviews", singular: "FormReview", pascal: "FormReview", db: "dfeFormReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "reviewName", type: "string" }, { name: "reviewStatus", type: "string" }], display: { title: "reviewName", sub: "reviewStatus" } },
    { tab: "executionAuditEntries", plural: "executionAuditEntries", singular: "ExecutionAuditEntry", pascal: "ExecutionAuditEntry", db: "dfeExecutionAuditEntries", fields: [{ name: "auditKey", type: "string" }, { name: "auditType", type: "string" }, { name: "auditSummary", type: "string" }], display: { title: "auditKey", sub: "auditType" } },
    { tab: "renderProfiles", plural: "renderProfiles", singular: "RenderProfile", pascal: "RenderProfile", db: "dfeRenderProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" } },
    { tab: "themeConfigs", plural: "themeConfigs", singular: "ThemeConfig", pascal: "ThemeConfig", db: "dfeThemeConfigs", fields: [{ name: "themeKey", type: "string" }, { name: "themeName", type: "string" }, { name: "primaryColor", type: "string" }], display: { title: "themeName", sub: "primaryColor" } },
    { tab: "localizationPacks", plural: "localizationPacks", singular: "LocalizationPack", pascal: "LocalizationPack", db: "dfeLocalizationPacks", fields: [{ name: "localeKey", type: "string" }, { name: "localeCode", type: "string" }, { name: "localeName", type: "string" }], display: { title: "localeName", sub: "localeCode" } },
    { tab: "submissionAnalytics", plural: "submissionAnalytics", singular: "SubmissionAnalytics", pascal: "SubmissionAnalytics", db: "dfeSubmissionAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "completionMetrics", plural: "completionMetrics", singular: "CompletionMetric", pascal: "CompletionMetric", db: "dfeCompletionMetrics", fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "completionRate", type: "number" }], display: { title: "metricName", sub: "completionRate" } },
    { tab: "usageTrends", plural: "usageTrends", singular: "UsageTrend", pascal: "UsageTrend", db: "dfeUsageTrends", fields: [{ name: "trendKey", type: "string" }, { name: "trendName", type: "string" }, { name: "trendValue", type: "number" }], display: { title: "trendName", sub: "trendValue" } },
    { tab: "formMetrics", plural: "formMetrics", singular: "FormMetric", pascal: "FormMetric", db: "dfeFormMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "submissionCount", type: "number" }, { name: "overallFormScore", type: "number" }], display: { title: "metricsKey", sub: "overallFormScore" } },
    { tab: "formHealth", plural: "formHealth", singular: "FormHealth", pascal: "FormHealth", db: "dfeFormHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "pendingReviewItems", plural: "pendingReviewItems", singular: "PendingReviewItem", pascal: "PendingReviewItem", db: "dfePendingReviewItems", fields: [{ name: "itemKey", type: "string" }, { name: "itemName", type: "string" }, { name: "reviewType", type: "string" }], display: { title: "itemName", sub: "reviewType" } },
    { tab: "formFailures", plural: "formFailures", singular: "FormFailure", pascal: "FormFailure", db: "dfeFormFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const DFE_TABS = {
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

export const DFE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "Submitted" },
] as const;

export const DFE_PERMISSIONS = ["dfe.view", "dfe.manage", "dfe.approve", "dfe.admin"] as const;


export const DFE_THEME = {
    primary: "amber-600",
    primaryHover: "amber-500",
    ring: "amber-500/20",
    text: "text-amber-600",
    textDark: "dark:text-amber-400",
    bg: "bg-amber-600",
    bgHover: "hover:bg-amber-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    formHubId: z.string().min(1),`;
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
    "buildFormHubLookupMaps", "buildDfeAuditPayload", "buildDfeDashboardStats", "buildDfePipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapFormSectionForStats", "mapRequiredRuleForStats", "mapFormMetricForStats", "mapFormSubmissionForStats", "mapPendingReviewItemForStats", "mapRegexRuleForStats", "mapFormHealthForStats", "mapFormFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "DfeDashboardStats", "DfePipelineInfo", "DfeSdkRegisterFormInput", "DfeSdkRegisterFormResult", "DfeSdkConfigureValidationInput", "DfeSdkConfigureValidationResult", "DfeSdkRunFormSubmissionInput", "DfeSdkRunFormSubmissionResult"]).join(",\n    ");

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
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/form-engine.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/form-engine-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/form-engine/types";

export class FormEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const formHubs = await databaseService.dfeFormHubs.listByOrganization(organizationId);
        return buildFormHubLookupMaps(formHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DfeDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildDfeDashboardStats({ formHubs: [], formSections: [], requiredRules: [], formMetrics: [], formSubmissions: [], pendingReviewItems: [], regexRules: [], formHealth: [], formFailures: [], auditLogs: [] });
        const [formHubs, formSectionsRaw, requiredRulesRaw, formMetricsRaw, formSubmissionsRaw, pendingReviewItemsRaw, regexRulesRaw, formHealthRaw, formFailures, auditLogs] = await Promise.all([
            this.getFormHubs(authUserId, email, fullName),
            databaseService.dfeFormSections.listByOrganization(context.organizationId),
            databaseService.dfeRequiredRules.listByOrganization(context.organizationId),
            databaseService.dfeFormMetrics.listByOrganization(context.organizationId),
            databaseService.dfeFormSubmissions.listByOrganization(context.organizationId),
            databaseService.dfePendingReviewItems.listByOrganization(context.organizationId),
            databaseService.dfeRegexRules.listByOrganization(context.organizationId),
            databaseService.dfeFormHealth.listByOrganization(context.organizationId),
            this.getFormFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildDfeDashboardStats({
            formHubs,
            formSections: formSectionsRaw.map(mapFormSectionForStats),
            requiredRules: requiredRulesRaw.map(mapRequiredRuleForStats),
            formMetrics: formMetricsRaw.map(mapFormMetricForStats),
            formSubmissions: formSubmissionsRaw.map(mapFormSubmissionForStats),
            pendingReviewItems: pendingReviewItemsRaw.map(mapPendingReviewItemForStats),
            regexRules: regexRulesRaw.map(mapRegexRuleForStats),
            formHealth: formHealthRaw.map(mapFormHealthForStats),
            formFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): DfePipelineInfo {
        return buildDfePipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfeAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getFormHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfeFormHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterForm(authUserId: string, email: string, input: DfeSdkRegisterFormInput, fullName?: string | null): Promise<DfeSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_form", moduleSource: "dynamic_form_engine", inputPayload: { ...input } });
        const created = await this.createFormDefinition(authUserId, email, { formHubId: input.formHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigureValidation(authUserId: string, email: string, input: DfeSdkConfigureValidationInput, fullName?: string | null): Promise<DfeSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { formHubId: input.formHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunFormSubmission(authUserId: string, email: string, input: DfeSdkRunFormSubmissionInput, fullName?: string | null): Promise<DfeSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_form_submission", moduleSource: "dynamic_form_engine", inputPayload: { ...input } });
        const created = await this.createFormSubmission(authUserId, email, { formHubId: input.formHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const formEngineService = new FormEngineService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "DfeDashboardStats", "DfePipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            formEngineService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await formEngineService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useFormEngine.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { formEngineService } from "@/src/modules/form-engine/services/form-engine.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/form-engine/types";

export function useFormEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DfeDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<DfePipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [formHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            formEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(formEngineService.getPipelineInfo()),
${hookFetchCalls}
            formEngineService.getAuditLogs(authUserId, email, fullName),
            formEngineService.getFormHubOptions(authUserId, email, fullName),
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
        formHubOptions,
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
    }, e.hubField === false ? {} : { formHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <FormHubSelect data={data} {...form.register("formHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: FormEngineData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise form engine ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
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

writeFileSync(join(mod, "components/FormEnginePanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { DFE_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/form-engine/constants";
import type { useFormEngine } from "@/src/modules/form-engine/hooks/useFormEngine";
import {
${schemaImports}
} from "@/src/modules/form-engine/schemas";

type FormEngineData = ReturnType<typeof useFormEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-amber-600">{meta}</p> : null}</div>;
}
function FormHubSelect({ data, ...props }: { data: FormEngineData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select form engine</option>{data.formHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function FormEngineOverviewPanel({ data }: { data: FormEngineData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Form Engine summary" description="System health, background jobs, event bus, pendingReviewItems, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Form Hubs" subtitle={\`\${data.stats?.totalFormHubs ?? 0} total\`} meta={\`\${data.stats?.activeFormHubs ?? 0} active • \${data.stats?.formSectionCount ?? 0} form sections\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.requiredRuleCount ?? 0} required rules\`} meta={\`\${data.stats?.formSubmissionCount ?? 0} form submissions • \${data.stats?.openPendingReviewCount ?? 0} open pending review items\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallFormScore ?? 0).toFixed(1)} overall form score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first form engine" />
            </div></Card>
            <Card hover><SectionHeader title="Form engine pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Form engine pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function FormEngineAuditLogsPanel({ data }: { data: FormEngineData }) {
    return (
        <Card hover><SectionHeader title="Form Engine audit history" description="Security-first audit trail for jobs, events, pendingReviewItems, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for form engine." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function FormEngineSdkPanel({ data }: { data: FormEngineData }) {
    return (
        <Card hover><SectionHeader title="Shared Form Engine SDK" description="Import from @/src/modules/form-engine/sdk for form registration, validation configuration, and form submission" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createFormEngineClient()" subtitle="Factory for module-scoped Form Engine client with auth context" meta="Primary SDK for enterprise form engine" />
            <ListCard title="sdkRegisterForm()" subtitle="Register form engine with AI orchestration" meta="moduleSource: dynamic_form_engine" />
            <ListCard title="sdkConfigureValidation()" subtitle="Configure validation rule with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunFormSubmission()" subtitle="Run form submission with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {DFE_THEME.primary} • Integration hubs loaded: {data.formHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createFormEngineClient } from "@/src/modules/form-engine/sdk";

const intg = createFormEngineClient(userId, email, fullName);
await intg.registerForm({ formHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureValidation({ formHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runFormSubmission({ formHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/FormEngineStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { DfeDashboardStats } from "@/src/modules/form-engine/types";

interface FormEngineStatsProps { stats: DfeDashboardStats | null; }

export function FormEngineStats({ stats }: FormEngineStatsProps) {
    const cards = [
        { title: "Form Hubs", value: String(stats?.totalFormHubs ?? 0), detail: \`\${stats?.activeFormHubs ?? 0} active • \${stats?.formSectionCount ?? 0} form sections\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.requiredRuleCount ?? 0), detail: \`\${stats?.formSubmissionCount ?? 0} form submissions • \${stats?.openPendingReviewCount ?? 0} open pending review items\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallFormScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, pendingReviewItems, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-amber-600 dark:[&_p:last-child]:text-amber-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "FormEngineOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "FormEngineAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "FormEngineSdkPanel" },
];

writeFileSync(join(mod, "components/FormEnginePage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    FormEngineOverviewPanel,
    ${panelImports},
    FormEngineAuditLogsPanel,
    FormEngineSdkPanel,
} from "@/src/modules/form-engine/components/FormEnginePanels";
import { FormEngineStats } from "@/src/modules/form-engine/components/FormEngineStats";
import { DFE_TABS } from "@/src/modules/form-engine/constants";
import { useFormEngine } from "@/src/modules/form-engine/hooks/useFormEngine";

const tabs = [
${tabDefs.map((t) => `    { id: DFE_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function FormEnginePage() {
    const formEngine = useFormEngine();
    const [activeTab, setActiveTab] = useState<(typeof DFE_TABS)[keyof typeof DFE_TABS]>(DFE_TABS.overview);

    if (formEngine.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Form Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-600">V2 Program A Program B Sprint 3</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Form Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: form sections, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and form engine dashboard with security-first audit and the shared Form Engine SDK.
                </p>
            </motion.header>
            <FormEngineStats stats={formEngine.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-amber-600 text-white" : "border border-slate-200 text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === DFE_TABS.${t.id} ? <${t.panel} data={formEngine} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { formEngineService } from "@/src/modules/form-engine/services/form-engine.service";
import type { DfeSdkRegisterFormInput, DfeSdkConfigureValidationInput, DfeSdkRunFormSubmissionInput } from "@/src/modules/form-engine/types";

export class FormEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerForm(input: DfeSdkConnectServiceInput) {
        return formEngineService.sdkRegisterForm(this.authUserId, this.email, input, this.fullName);
    }

    async configureValidation(input: DfeSdkIssueApiKeyInput) {
        return formEngineService.sdkConfigureValidation(this.authUserId, this.email, input, this.fullName);
    }

    async runFormSubmission(input: DfeSdkRegisterWebhookInput) {
        return formEngineService.sdkRunFormSubmission(this.authUserId, this.email, input, this.fullName);
    }

    async getFormHubs() {
        return formEngineService.getFormHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return formEngineService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return formEngineService.getPipelineInfo();
    }
}

export function createFormEngineClient(authUserId: string, email: string, fullName?: string | null): FormEngineClient {
    return new FormEngineClient(authUserId, email, fullName);
}

export { formEngineService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { FormEnginePage } from "@/src/modules/form-engine/components/FormEnginePage";
export { FormEngineStats } from "@/src/modules/form-engine/components/FormEngineStats";
export { formEngineService } from "@/src/modules/form-engine/services/form-engine.service";
export { useFormEngine } from "@/src/modules/form-engine/hooks/useFormEngine";
export { createFormEngineClient, FormEngineClient } from "@/src/modules/form-engine/sdk";
export * from "@/src/modules/form-engine/types";
export * from "@/src/modules/form-engine/constants";
`);

console.log(`Generated form engine module files. DFE_TABS count: ${tabs.length}`);
