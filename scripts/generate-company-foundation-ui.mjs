#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/company-foundation");

const entities = [
    { tab: "companyHubs", plural: "companyHubs", singular: "CompanyHub", pascal: "CompanyHub", db: "cmpCompanyHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "brandProfiles", plural: "brandProfiles", singular: "BrandProfile", pascal: "BrandProfile", db: "cmpBrandProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "brandStatus", type: "select", options: "BRAND_STATUS_OPTIONS" }], display: { title: "profileName", sub: "brandStatus" } },
    { tab: "logoAssets", plural: "logoAssets", singular: "LogoAsset", pascal: "LogoAsset", db: "cmpLogoAssets", fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" } },
    { tab: "themeConfigs", plural: "themeConfigs", singular: "ThemeConfig", pascal: "ThemeConfig", db: "cmpThemeConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "primaryColor", type: "string" }], display: { title: "configName", sub: "primaryColor" } },
    { tab: "brandAssets", plural: "brandAssets", singular: "BrandAsset", pascal: "BrandAsset", db: "cmpBrandAssets", fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetCategory", type: "string" }], display: { title: "assetName", sub: "assetCategory" } },
    { tab: "websitePages", plural: "websitePages", singular: "WebsitePage", pascal: "WebsitePage", db: "cmpWebsitePages", fields: [{ name: "pageKey", type: "string" }, { name: "pageTitle", type: "string" }, { name: "pageSlug", type: "string" }], display: { title: "pageTitle", sub: "pageSlug" } },
    { tab: "websiteFeatures", plural: "websiteFeatures", singular: "WebsiteFeature", pascal: "WebsiteFeature", db: "cmpWebsiteFeatures", fields: [{ name: "featureKey", type: "string" }, { name: "featureName", type: "string" }, { name: "featureType", type: "string" }], display: { title: "featureName", sub: "featureType" } },
    { tab: "websiteSections", plural: "websiteSections", singular: "WebsiteSection", pascal: "WebsiteSection", db: "cmpWebsiteSections", fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "sectionType", type: "string" }], display: { title: "sectionName", sub: "sectionType" } },
    { tab: "demoRequests", plural: "demoRequests", singular: "DemoRequest", pascal: "DemoRequest", db: "cmpDemoRequests", fields: [{ name: "requestKey", type: "string" }, { name: "requestName", type: "string" }, { name: "requestStatus", type: "select", options: "DEMO_REQUEST_STATUS_OPTIONS" }], display: { title: "requestName", sub: "requestStatus" } },
    { tab: "pricingPlans", plural: "pricingPlans", singular: "PricingPlan", pascal: "PricingPlan", db: "cmpPricingPlans", fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "planTier", type: "string" }], display: { title: "planName", sub: "planTier" } },
    { tab: "pricingPackages", plural: "pricingPackages", singular: "PricingPackage", pascal: "PricingPackage", db: "cmpPricingPackages", fields: [{ name: "packageKey", type: "string" }, { name: "packageName", type: "string" }, { name: "packageType", type: "string" }], display: { title: "packageName", sub: "packageType" } },
    { tab: "modulePricing", plural: "modulePricing", singular: "ModulePricing", pascal: "ModulePricing", db: "cmpModulePricing", fields: [{ name: "pricingKey", type: "string" }, { name: "moduleName", type: "string" }, { name: "priceAmount", type: "number" }], display: { title: "moduleName", sub: "priceAmount" } },
    { tab: "discountRules", plural: "discountRules", singular: "DiscountRule", pascal: "DiscountRule", db: "cmpDiscountRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "discountPercent", type: "number" }], display: { title: "ruleName", sub: "discountPercent" } },
    { tab: "proposals", plural: "proposals", singular: "Proposal", pascal: "Proposal", db: "cmpProposals", fields: [{ name: "proposalKey", type: "string" }, { name: "proposalName", type: "string" }, { name: "proposalStatus", type: "select", options: "PROPOSAL_STATUS_OPTIONS" }], display: { title: "proposalName", sub: "proposalStatus" } },
    { tab: "proposalDocuments", plural: "proposalDocuments", singular: "ProposalDocument", pascal: "ProposalDocument", db: "cmpProposalDocuments", fields: [{ name: "documentKey", type: "string" }, { name: "documentName", type: "string" }, { name: "documentType", type: "string" }], display: { title: "documentName", sub: "documentType" } },
    { tab: "proposalContracts", plural: "proposalContracts", singular: "ProposalContract", pascal: "ProposalContract", db: "cmpProposalContracts", fields: [{ name: "contractKey", type: "string" }, { name: "contractName", type: "string" }, { name: "contractStatus", type: "select", options: "CONTRACT_STATUS_OPTIONS" }], display: { title: "contractName", sub: "contractStatus" } },
    { tab: "proposalHistory", plural: "proposalHistory", singular: "ProposalHistory", pascal: "ProposalHistory", db: "cmpProposalHistory", fields: [{ name: "historyKey", type: "string" }, { name: "historyType", type: "string" }, { name: "changedAt", type: "string" }], display: { title: "historyKey", sub: "historyType" } },
    { tab: "portalDashboards", plural: "portalDashboards", singular: "PortalDashboard", pascal: "PortalDashboard", db: "cmpPortalDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardType", type: "string" }], display: { title: "dashboardName", sub: "dashboardType" } },
    { tab: "portalSubscriptions", plural: "portalSubscriptions", singular: "PortalSubscription", pascal: "PortalSubscription", db: "cmpPortalSubscriptions", fields: [{ name: "subscriptionKey", type: "string" }, { name: "planName", type: "string" }, { name: "subscriptionStatus", type: "select", options: "SUBSCRIPTION_STATUS_OPTIONS" }], display: { title: "planName", sub: "subscriptionStatus" } },
    { tab: "portalBilling", plural: "portalBilling", singular: "PortalBilling", pascal: "PortalBilling", db: "cmpPortalBilling", fields: [{ name: "billingKey", type: "string" }, { name: "billingType", type: "string" }, { name: "billingAmount", type: "number" }], display: { title: "billingKey", sub: "billingType" } },
    { tab: "portalSupport", plural: "portalSupport", singular: "PortalSupport", pascal: "PortalSupport", db: "cmpPortalSupport", fields: [{ name: "supportKey", type: "string" }, { name: "supportTitle", type: "string" }, { name: "supportStatus", type: "select", options: "SUPPORT_STATUS_OPTIONS" }], display: { title: "supportTitle", sub: "supportStatus" } },
    { tab: "docGuides", plural: "docGuides", singular: "DocGuide", pascal: "DocGuide", db: "cmpDocGuides", fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideCategory", type: "string" }], display: { title: "guideTitle", sub: "guideCategory" } },
    { tab: "docApiReferences", plural: "docApiReferences", singular: "DocApiReference", pascal: "DocApiReference", db: "cmpDocApiReferences", fields: [{ name: "referenceKey", type: "string" }, { name: "referenceName", type: "string" }, { name: "apiVersion", type: "string" }], display: { title: "referenceName", sub: "apiVersion" } },
    { tab: "docVersions", plural: "docVersions", singular: "DocVersion", pascal: "DocVersion", db: "cmpDocVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionName", type: "string" }, { name: "versionNumber", type: "string" }], display: { title: "versionName", sub: "versionNumber" } },
    { tab: "demoOrganizations", plural: "demoOrganizations", singular: "DemoOrganization", pascal: "DemoOrganization", db: "cmpDemoOrganizations", fields: [{ name: "orgKey", type: "string" }, { name: "orgName", type: "string" }, { name: "orgType", type: "string" }], display: { title: "orgName", sub: "orgType" } },
    { tab: "demoDataSets", plural: "demoDataSets", singular: "DemoDataSet", pascal: "DemoDataSet", db: "cmpDemoDataSets", fields: [{ name: "datasetKey", type: "string" }, { name: "datasetName", type: "string" }, { name: "recordCount", type: "number" }], display: { title: "datasetName", sub: "recordCount" } },
    { tab: "demoUsers", plural: "demoUsers", singular: "DemoUser", pascal: "DemoUser", db: "cmpDemoUsers", fields: [{ name: "userKey", type: "string" }, { name: "userName", type: "string" }, { name: "userRole", type: "string" }], display: { title: "userName", sub: "userRole" } },
    { tab: "companyMetrics", plural: "companyMetrics", singular: "CompanyMetric", pascal: "CompanyMetric", db: "cmpCompanyMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallCompanyScore", type: "number" }, { name: "platformHealthScore", type: "number" }], display: { title: "metricsKey", sub: "overallCompanyScore" } },
    { tab: "companyHealth", plural: "companyHealth", singular: "CompanyHealth", pascal: "CompanyHealth", db: "cmpCompanyHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: "cmpExecutiveKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" } },
    { tab: "companyFailures", plural: "companyFailures", singular: "CompanyFailure", pascal: "CompanyFailure", db: "cmpCompanyFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const CMP_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const BRAND_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
    { value: "pending", label: "Pending" },
] as const;

export const DEMO_REQUEST_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const PROPOSAL_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

export const CONTRACT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "signed", label: "Signed" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const SUBSCRIPTION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "trial", label: "Trial" },
    { value: "cancelled", label: "Cancelled" },
    { value: "expired", label: "Expired" },
] as const;

export const SUPPORT_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const CMP_PERMISSIONS = ["cmp.view", "cmp.manage", "cmp.approve", "cmp.admin"] as const;

export const CMP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "published", label: "Published" },
    { value: "completed", label: "Completed" },
] as const;


export const CMP_THEME = {
    primary: "emerald-600",
    primaryHover: "emerald-500",
    ring: "emerald-500/20",
    text: "text-emerald-600",
    textDark: "dark:text-emerald-400",
    bg: "bg-emerald-600",
    bgHover: "hover:bg-emerald-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    companyHubId: z.string().min(1),`;
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
    "buildCompanyHubLookupMaps", "buildCmpAuditPayload", "buildCmpDashboardStats", "buildCmpPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapBrandProfileForStats", "mapPortalDashboardForStats", "mapCompanyMetricForStats", "mapWebsitePageForStats", "mapRetailInvoiceForStats", "mapPortalDashboardForStats", "mapCompanyHealthForStats", "mapCompanyFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "CmpDashboardStats", "CmpPipelineInfo", "CmpSdkRegisterFormInput", "CmpSdkRegisterFormResult", "CmpSdkConfigureValidationInput", "CmpSdkConfigureValidationResult", "CmpSdkRunFormSubmissionInput", "CmpSdkRunFormSubmissionResult"]).join(",\n    ");

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
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/company-foundation.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/company-foundation-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/company-foundation/types";

export class CompanyFoundationService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const companyHubs = await databaseService.cmpCompanyHubs.listByOrganization(organizationId);
        return buildCompanyHubLookupMaps(companyHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CmpDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildCmpDashboardStats({ companyHubs: [], brandProfiles: [], portalDashboards: [], companyMetrics: [], websitePages: [], retailInvoices: [], portalDashboards: [], companyHealth: [], companyFailures: [], auditLogs: [] });
        const [companyHubs, brandProfilesRaw, portalDashboardsRaw, companyMetricsRaw, websitePagesRaw, retailInvoicesRaw, portalDashboardsRaw, companyHealthRaw, companyFailures, auditLogs] = await Promise.all([
            this.getCompanyHubs(authUserId, email, fullName),
            databaseService.cmpCampuses.listByOrganization(context.organizationId),
            databaseService.cmpAdmissions.listByOrganization(context.organizationId),
            databaseService.cmpCompanyMetrics.listByOrganization(context.organizationId),
            databaseService.cmpExaminations.listByOrganization(context.organizationId),
            databaseService.cmpFeeInvoices.listByOrganization(context.organizationId),
            databaseService.cmpTeachers.listByOrganization(context.organizationId),
            databaseService.cmpCompanyHealth.listByOrganization(context.organizationId),
            this.getCompanyFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildCmpDashboardStats({
            companyHubs,
            brandProfiles: brandProfilesRaw.map(mapBrandProfileForStats),
            portalDashboards: portalDashboardsRaw.map(mapPortalDashboardForStats),
            companyMetrics: companyMetricsRaw.map(mapCompanyMetricForStats),
            websitePages: websitePagesRaw.map(mapWebsitePageForStats),
            retailInvoices: retailInvoicesRaw.map(mapRetailInvoiceForStats),
            portalDashboards: portalDashboardsRaw.map(mapPortalDashboardForStats),
            companyHealth: companyHealthRaw.map(mapCompanyHealthForStats),
            companyFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): CmpPipelineInfo {
        return buildCmpPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cmpAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getCompanyHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cmpCompanyHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkConfigureBrandProfile(authUserId: string, email: string, input: CmpSdkRegisterFormInput, fullName?: string | null): Promise<CmpSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "configure_brand_profile", moduleSource: "company_foundation", inputPayload: { ...input } });
        const created = await this.createBrandProfile(authUserId, email, { companyHubId: input.companyHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkPublishWebsitePage(authUserId: string, email: string, input: CmpSdkConfigureValidationInput, fullName?: string | null): Promise<CmpSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { companyHubId: input.companyHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkGenerateProposal(authUserId: string, email: string, input: CmpSdkRunFormSubmissionInput, fullName?: string | null): Promise<CmpSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "generate_proposal", moduleSource: "company_foundation", inputPayload: { ...input } });
        const created = await this.createProposal(authUserId, email, { companyHubId: input.companyHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const companyFoundationService = new CompanyFoundationService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "CmpDashboardStats", "CmpPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            companyFoundationService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useCompanyFoundation.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { companyFoundationService } from "@/src/modules/company-foundation/services/company-foundation.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/company-foundation/types";

export function useCompanyFoundation() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CmpDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<CmpPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [companyHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            companyFoundationService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(companyFoundationService.getPipelineInfo()),
${hookFetchCalls}
            companyFoundationService.getAuditLogs(authUserId, email, fullName),
            companyFoundationService.getCompanyHubOptions(authUserId, email, fullName),
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
        companyHubOptions,
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
    }, e.hubField === false ? {} : { companyHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <CompanyHubSelect data={data} {...form.register("companyHubId")} />\n`;
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

writeFileSync(join(mod, "components/CompanyFoundationPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CMP_THEME, DEMO_REQUEST_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/company-foundation/constants";
import type { useCompanyFoundation } from "@/src/modules/company-foundation/hooks/useCompanyFoundation";
import {
${schemaImports}
} from "@/src/modules/company-foundation/schemas";

type RetailData = ReturnType<typeof useCompanyFoundation>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-emerald-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-emerald-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}</div>;
}
function CompanyHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.companyHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Company Foundation summary" description="System health, background jobs, event bus, retailInvoices, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Company Hubs" subtitle={\`\${data.stats?.totalCompanyHubs ?? 0} total\`} meta={\`\${data.stats?.activeCompanyHubs ?? 0} active • \${data.stats?.brandProfileCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.portalDashboardsCount ?? 0} menu categories\`} meta={\`\${data.stats?.websitePageCount ?? 0} websitePages • \${data.stats?.openRetailInvoiceCount ?? 0} open retailInvoices\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallCompanyScore ?? 0).toFixed(1)} overall retail score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
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
        <Card hover><SectionHeader title="Company Foundation audit history" description="Security-first audit trail for jobs, events, retailInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Company Foundation SDK" description="Import from @/src/modules/company-foundation/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-emerald-600 dark:text-emerald-300">
            <ListCard title="createCompanyFoundationClient()" subtitle="Factory for module-scoped Company Foundation client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkConfigureBrandProfile()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: company_foundation" />
            <ListCard title="sdkPublishWebsitePage()" subtitle="Publish website page with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkGenerateProposal()" subtitle="Generate proposal with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-emerald-500">Theme: {CMP_THEME.primary} • Integration hubs loaded: {data.companyHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-emerald-950 p-4 text-xs text-emerald-100">{\`import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";

const intg = createCompanyFoundationClient(userId, email, fullName);
await intg.registerCampus({ companyHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.publishWebsitePage({ companyHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.generateProposal({ companyHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/CompanyFoundationStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { CmpDashboardStats } from "@/src/modules/company-foundation/types";

interface CompanyFoundationStatsProps { stats: CmpDashboardStats | null; }

export function CompanyFoundationStats({ stats }: CompanyFoundationStatsProps) {
    const cards = [
        { title: "Company Hubs", value: String(stats?.totalCompanyHubs ?? 0), detail: \`\${stats?.activeCompanyHubs ?? 0} active • \${stats?.brandProfileCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.portalDashboardsCount ?? 0), detail: \`\${stats?.websitePageCount ?? 0} websitePages • \${stats?.openRetailInvoiceCount ?? 0} open retailInvoices\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallCompanyScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, retailInvoices, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-emerald-600 dark:[&_p:last-child]:text-emerald-400">
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

writeFileSync(join(mod, "components/CompanyFoundationPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    ${panelImports},
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/company-foundation/components/CompanyFoundationPanels";
import { CompanyFoundationStats } from "@/src/modules/company-foundation/components/CompanyFoundationStats";
import { CMP_TABS } from "@/src/modules/company-foundation/constants";
import { useCompanyFoundation } from "@/src/modules/company-foundation/hooks/useCompanyFoundation";

const tabs = [
${tabDefs.map((t) => `    { id: CMP_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function CompanyFoundationPage() {
    const retail = useCompanyFoundation();
    const [activeTab, setActiveTab] = useState<(typeof CMP_TABS)[keyof typeof CMP_TABS]>(CMP_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Company Foundation" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-emerald-900 dark:text-emerald-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-emerald-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">V2 Program A Program F Wave 1</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Company Foundation</h1>
                <p className="mt-3 max-w-2xl text-sm text-emerald-500 dark:text-emerald-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Company Foundation SDK.
                </p>
            </motion.header>
            <CompanyFoundationStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-emerald-600 hover:border-emerald-300 dark:border-slate-800 dark:text-emerald-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === CMP_TABS.${t.id} ? <${t.panel} data={retail} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { companyFoundationService } from "@/src/modules/company-foundation/services/company-foundation.service";
import type { CmpSdkRegisterFormInput, CmpSdkConfigureValidationInput, CmpSdkRunFormSubmissionInput } from "@/src/modules/company-foundation/types";

export class CompanyFoundationClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerCampus(input: CmpSdkConnectServiceInput) {
        return companyFoundationService.sdkConfigureBrandProfile(this.authUserId, this.email, input, this.fullName);
    }

    async publishWebsitePage(input: CmpSdkIssueApiKeyInput) {
        return companyFoundationService.sdkPublishWebsitePage(this.authUserId, this.email, input, this.fullName);
    }

    async generateProposal(input: CmpSdkRegisterWebhookInput) {
        return companyFoundationService.sdkGenerateProposal(this.authUserId, this.email, input, this.fullName);
    }

    async getCompanyHubs() {
        return companyFoundationService.getCompanyHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return companyFoundationService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return companyFoundationService.getPipelineInfo();
    }
}

export function createCompanyFoundationClient(authUserId: string, email: string, fullName?: string | null): CompanyFoundationClient {
    return new CompanyFoundationClient(authUserId, email, fullName);
}

export { companyFoundationService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { CompanyFoundationPage } from "@/src/modules/company-foundation/components/CompanyFoundationPage";
export { CompanyFoundationStats } from "@/src/modules/company-foundation/components/CompanyFoundationStats";
export { companyFoundationService } from "@/src/modules/company-foundation/services/company-foundation.service";
export { useCompanyFoundation } from "@/src/modules/company-foundation/hooks/useCompanyFoundation";
export { createCompanyFoundationClient, CompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
export * from "@/src/modules/company-foundation/types";
export * from "@/src/modules/company-foundation/constants";
`);

console.log(`Generated retail operating system module files. CMP_TABS count: ${tabs.length}`);
