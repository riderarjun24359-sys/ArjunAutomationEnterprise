#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-launch-foundation-ui.mjs");
const outPath = join(root, "scripts/generate-company-foundation-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
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
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/launch-foundation"\);/, 'const mod = join(root, "src/modules/company-foundation");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/launchHubs/g, "companyHubs"],
    [/launchHubOptions/g, "companyHubOptions"],
    [/getLaunchHubs/g, "getCompanyHubs"],
    [/getLaunchHubOptions/g, "getCompanyHubOptions"],
    [/LaunchHubSelect/g, "CompanyHubSelect"],
    [/buildLaunchHubLookupMaps/g, "buildCompanyHubLookupMaps"],
    [/launchHubId/g, "companyHubId"],
    [/Launch Hubs/g, "Company Hubs"],
    [/Launch Foundation/g, "Company Foundation"],
    [/launch hub/g, "company hub"],
    [/LaunchHub/g, "CompanyHub"],
    [/LaunchMetric/g, "CompanyMetric"],
    [/LaunchHealth/g, "CompanyHealth"],
    [/LaunchFailure/g, "CompanyFailure"],
    [/LaunchFoundationPage/g, "CompanyFoundationPage"],
    [/LaunchFoundationStats/g, "CompanyFoundationStats"],
    [/LaunchFoundationPanels/g, "CompanyFoundationPanels"],
    [/LaunchFoundationService/g, "CompanyFoundationService"],
    [/LaunchFoundationClient/g, "CompanyFoundationClient"],
    [/buildElf/g, "buildCmp"],
    [/mapElf/g, "mapCmp"],
    [/ElfDashboardStats/g, "CmpDashboardStats"],
    [/ElfPipelineInfo/g, "CmpPipelineInfo"],
    [/ElfSdk/g, "CmpSdk"],
    [/ELF_TABS/g, "CMP_TABS"],
    [/ELF_THEME/g, "CMP_THEME"],
    [/ELF_PERMISSIONS/g, "CMP_PERMISSIONS"],
    [/ELF_STATUS_OPTIONS/g, "CMP_STATUS_OPTIONS"],
    [/Program C Sprint 4/g, "Program F Wave 1"],
    [/slate-600/g, "emerald-600"],
    [/slate-500/g, "emerald-500"],
    [/slate-400/g, "emerald-400"],
    [/slate-300/g, "emerald-300"],
    [/ring-slate/g, "ring-emerald"],
    [/bg-slate/g, "bg-emerald"],
    [/text-slate/g, "text-emerald"],
    [/hover:bg-slate/g, "hover:bg-emerald"],
    [/hover:border-slate/g, "hover:border-emerald"],
    [/mapOrganizationProvisionForStats/g, "mapBrandProfileForStats"],
    [/mapCustomerRegistryForStats/g, "mapPortalDashboardForStats"],
    [/mapLaunchMetricForStats/g, "mapCompanyMetricForStats"],
    [/mapImportJobForStats/g, "mapWebsitePageForStats"],
    [/mapGoLiveChecklistForStats/g, "mapPricingPlanForStats"],
    [/mapLaunchHealthForStats/g, "mapCompanyHealthForStats"],
    [/mapLaunchFailureForStats/g, "mapCompanyFailureForStats"],
    [/organizationProvisions/g, "brandProfiles"],
    [/customerRegistry/g, "portalDashboards"],
    [/importJobs/g, "websitePages"],
    [/goLiveChecklists/g, "pricingPlans"],
    [/launchMetrics/g, "companyMetrics"],
    [/launchHealth/g, "companyHealth"],
    [/launchFailures/g, "companyFailures"],
    [/totalLaunchHubs/g, "totalCompanyHubs"],
    [/activeLaunchHubs/g, "activeCompanyHubs"],
    [/organizationProvisionCount/g, "brandProfileCount"],
    [/customerRegistryCount/g, "portalDashboardCount"],
    [/importJobCount/g, "websitePageCount"],
    [/openLaunchFailureCount/g, "openCompanyFailureCount"],
    [/overallLaunchScore/g, "overallCompanyScore"],
    [/platformHealthScore/g, "platformHealthScore"],
    [/customerHealthScore/g, "websiteAnalyticsScore"],
    [/deploymentCount/g, "demoRequestCount"],
    [/subscriptionCount/g, "activeCustomerCount"],
    [/supportOpenCount/g, "supportOpenCount"],
    [/goLiveScore/g, "revenueTotal"],
    [/sdkProvisionOrganization/g, "sdkConfigureBrandProfile"],
    [/sdkConfigureWizardProfile/g, "sdkPublishWebsitePage"],
    [/sdkRunGoLiveWorkflow/g, "sdkGenerateProposal"],
    [/configureWizardProfile/g, "publishWebsitePage"],
    [/runGoLiveWorkflow/g, "generateProposal"],
    [/createOrganizationProvision/g, "createBrandProfile"],
    [/createWizardProfile/g, "createWebsitePage"],
    [/createGoLiveChecklist/g, "createProposal"],
    [/Configure wizard profile/g, "Publish website page"],
    [/Run go-live workflow/g, "Generate proposal"],
    [/organization provisions, wizard profiles, import jobs, go-live checklists, customer registry, and subscription records/g, "brand profiles, website pages, pricing plans, proposals, portal dashboards, and documentation"],
    [/Organization provisions, wizard profiles, import jobs, go-live checklists, customer registry, subscription records, and launch foundation outputs/g, "Brand profiles, website pages, pricing plans, proposals, portal dashboards, documentation, and company foundation outputs"],
    [/enterprise_launch_foundation/g, "company_foundation"],
    [/provision_organization/g, "configure_brand_profile"],
    [/run_go_live_workflow/g, "generate_proposal"],
    [/"elf\.view"/g, '"cmp.view"'],
    [/"elf\.manage"/g, '"cmp.manage"'],
    [/"elf\.approve"/g, '"cmp.approve"'],
    [/"elf\.admin"/g, '"cmp.admin"'],
    [/elfLaunchHubs/g, "cmpCompanyHubs"],
    [/getLaunchFailures/g, "getCompanyFailures"],
    [/launch-foundation-mappers/g, "company-foundation-mappers"],
    [/buildLaunchHubPayload/g, "buildCompanyHubPayload"],
    [/mapLaunchHubSummary/g, "mapCompanyHubSummary"],
    [/buildElfAuditPayload/g, "buildCmpAuditPayload"],
    [/createLaunchFoundationClient/g, "createCompanyFoundationClient"],
    [/databaseService\.elf/g, "databaseService.cmp"],
    [/useLaunchFoundation/g, "useCompanyFoundation"],
    [/launchFoundationService/g, "companyFoundationService"],
    [/launch-foundation\.service/g, "company-foundation.service"],
    [/@\/src\/modules\/launch-foundation\//g, "@/src/modules/company-foundation/"],
    [/\/launch-foundation\/page/g, "/company-foundation/page"],
    [/app\/\(shell\)\/launch-foundation/g, "app/(shell)/company-foundation"],
    [/ElfSdkProvisionOrganizationInput/g, "CmpSdkConfigureBrandProfileInput"],
    [/ElfSdkProvisionOrganizationResult/g, "CmpSdkConfigureBrandProfileResult"],
    [/ElfSdkConfigureWizardProfileInput/g, "CmpSdkPublishWebsitePageInput"],
    [/ElfSdkConfigureWizardProfileResult/g, "CmpSdkPublishWebsitePageResult"],
    [/ElfSdkRunGoLiveWorkflowInput/g, "CmpSdkGenerateProposalInput"],
    [/ElfSdkRunGoLiveWorkflowResult/g, "CmpSdkGenerateProposalResult"],
    [/pricingPlanCount/g, "pricingPlanCount"],
    [/proposalCount/g, "proposalCount"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(
    /async sdkConfigureBrandProfile\(authUserId: string, email: string, input: CmpSdkConfigureBrandProfileInput[\s\S]*?return \{ provisionId: created\.id, provisionKey: created\.provisionKey, status: created\.status \};\n    \}/,
    `async sdkConfigureBrandProfile(authUserId: string, email: string, input: CmpSdkConfigureBrandProfileInput, fullName?: string | null): Promise<CmpSdkConfigureBrandProfileResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        const created = await this.createBrandProfile(authUserId, email, { companyHubId: input.companyHubId, profileKey: input.profileKey, profileName: input.profileName }, fullName);
        return { profileId: created.id, profileKey: created.profileKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkPublishWebsitePage\(authUserId: string, email: string, input: CmpSdkPublishWebsitePageInput[\s\S]*?return \{ profileId: created\.id, profileKey: created\.profileKey, status: created\.status \};\n    \}/,
    `async sdkPublishWebsitePage(authUserId: string, email: string, input: CmpSdkPublishWebsitePageInput, fullName?: string | null): Promise<CmpSdkPublishWebsitePageResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createWebsitePage(authUserId, email, { companyHubId: input.companyHubId, pageKey: input.pageKey, pageTitle: input.pageTitle }, fullName);
        return { pageId: created.id, pageKey: created.pageKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkGenerateProposal\(authUserId: string, email: string, input: CmpSdkGenerateProposalInput[\s\S]*?return \{ checklistId: created\.id, checklistKey: created\.checklistKey, status: created\.status \};\n    \}/,
    `async sdkGenerateProposal(authUserId: string, email: string, input: CmpSdkGenerateProposalInput, fullName?: string | null): Promise<CmpSdkGenerateProposalResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const elf = createLaunchFoundationClient(authUserId, email, fullName);
        await elf.getLaunchHubs();
        const created = await this.createProposal(authUserId, email, { companyHubId: input.companyHubId, proposalKey: input.proposalKey, proposalName: input.proposalName }, fullName);
        return { proposalId: created.id, proposalKey: created.proposalKey, status: created.status };
    }`,
);

if (!s.includes("createLaunchFoundationClient")) {
    s = s.replace(
        'import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";',
        `import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";`,
    );
}

const cmpOptionsBlock = `export const BRAND_STATUS_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const CMP_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const CMP_THEME)/,
    `$1${cmpOptionsBlock}$2`,
);

s = s.replace(/Select launch hub/g, "Select company hub");
s = s.replace(/PROVISION_STATUS_OPTIONS/g, "BRAND_STATUS_OPTIONS");
s = s.replace(/IMPORT_STATUS_OPTIONS/g, "DEMO_REQUEST_STATUS_OPTIONS");
s = s.replace(/DEPLOYMENT_STATUS_OPTIONS/g, "PROPOSAL_STATUS_OPTIONS");
s = s.replace(/LICENSE_STATUS_OPTIONS/g, "CONTRACT_STATUS_OPTIONS");
s = s.replace(/RENEWAL_STATUS_OPTIONS/g, "SUPPORT_STATUS_OPTIONS");
s = s.replace(/TICKET_STATUS_OPTIONS/g, "SUPPORT_STATUS_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-company-foundation-ui.mjs");
