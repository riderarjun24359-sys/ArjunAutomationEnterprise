#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-launch-foundation-ui.mjs");
const outPath = join(root, "scripts/generate-customer-success-delivery-ui.mjs");
let s = readFileSync(genPath, "utf8");

// --- Phase 1: Company Foundation transformations (from patch-company-foundation-ui.mjs) ---

const cmpEntitiesBlock = `const entities = [
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
s = s.replace(/const entities = \[[\s\S]*?\];/, cmpEntitiesBlock);

const cmpReps = [
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
    [/customerHealthScore/g, "websiteAnalyticsScore"],
    [/deploymentCount/g, "demoRequestCount"],
    [/subscriptionCount/g, "activeCustomerCount"],
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
];

for (const [from, to] of cmpReps) s = s.replace(from, to);

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

// --- Phase 2: Customer Success & Delivery transformations ---

const csdEntitiesBlock = `const entities = [
    { tab: "deliveryHubs", plural: "deliveryHubs", singular: "DeliveryHub", pascal: "DeliveryHub", db: "csdDeliveryHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "customerHealthScores", plural: "customerHealthScores", singular: "CustomerHealthScore", pascal: "CustomerHealthScore", db: "csdCustomerHealthScores", fields: [{ name: "scoreKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "scoreKey", sub: "customerRef" } },
    { tab: "adoptionAnalytics", plural: "adoptionAnalytics", singular: "AdoptionAnalytic", pascal: "AdoptionAnalytic", db: "csdAdoptionAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "featureName", type: "string" }, { name: "adoptionRate", type: "number" }], display: { title: "featureName", sub: "adoptionRate" } },
    { tab: "successPlans", plural: "successPlans", singular: "SuccessPlan", pascal: "SuccessPlan", db: "csdSuccessPlans", fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "planStatus", type: "select", options: "PLAN_STATUS_OPTIONS" }], display: { title: "planName", sub: "planStatus" } },
    { tab: "customerTimelines", plural: "customerTimelines", singular: "CustomerTimeline", pascal: "CustomerTimeline", db: "csdCustomerTimelines", fields: [{ name: "timelineKey", type: "string" }, { name: "timelineName", type: "string" }, { name: "timelineType", type: "string" }], display: { title: "timelineName", sub: "timelineType" } },
    { tab: "renewalForecasts", plural: "renewalForecasts", singular: "RenewalForecast", pascal: "RenewalForecast", db: "csdRenewalForecasts", fields: [{ name: "forecastKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "forecastStatus", type: "select", options: "RENEWAL_STATUS_OPTIONS" }], display: { title: "forecastKey", sub: "customerRef" } },
    { tab: "supportTickets", plural: "supportTickets", singular: "SupportTicket", pascal: "SupportTicket", db: "csdSupportTickets", fields: [{ name: "ticketKey", type: "string" }, { name: "ticketTitle", type: "string" }, { name: "ticketStatus", type: "select", options: "TICKET_STATUS_OPTIONS" }], display: { title: "ticketTitle", sub: "ticketStatus" } },
    { tab: "liveChatSessions", plural: "liveChatSessions", singular: "LiveChatSession", pascal: "LiveChatSession", db: "csdLiveChatSessions", fields: [{ name: "sessionKey", type: "string" }, { name: "sessionTitle", type: "string" }, { name: "sessionStatus", type: "select", options: "SESSION_STATUS_OPTIONS" }], display: { title: "sessionTitle", sub: "sessionStatus" } },
    { tab: "knowledgeBaseArticles", plural: "knowledgeBaseArticles", singular: "KnowledgeBaseArticle", pascal: "KnowledgeBaseArticle", db: "csdKnowledgeBaseArticles", fields: [{ name: "articleKey", type: "string" }, { name: "articleTitle", type: "string" }, { name: "articleCategory", type: "string" }], display: { title: "articleTitle", sub: "articleCategory" } },
    { tab: "slaPolicies", plural: "slaPolicies", singular: "SlaPolicy", pascal: "SlaPolicy", db: "csdSlaPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyType", type: "string" }], display: { title: "policyName", sub: "policyType" } },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: "csdEscalationRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" } },
    { tab: "deploymentAutomations", plural: "deploymentAutomations", singular: "DeploymentAutomation", pascal: "DeploymentAutomation", db: "csdDeploymentAutomations", fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" } },
    { tab: "environmentManagement", plural: "environmentManagement", singular: "EnvironmentManagement", pascal: "EnvironmentManagement", db: "csdEnvironmentManagement", fields: [{ name: "environmentKey", type: "string" }, { name: "environmentName", type: "string" }, { name: "environmentType", type: "string" }], display: { title: "environmentName", sub: "environmentType" } },
    { tab: "deploymentTracking", plural: "deploymentTracking", singular: "DeploymentTracking", pascal: "DeploymentTracking", db: "csdDeploymentTracking", fields: [{ name: "trackingKey", type: "string" }, { name: "deploymentName", type: "string" }, { name: "deploymentStatus", type: "select", options: "DEPLOYMENT_STATUS_OPTIONS" }], display: { title: "deploymentName", sub: "deploymentStatus" } },
    { tab: "upgradeManagement", plural: "upgradeManagement", singular: "UpgradeManagement", pascal: "UpgradeManagement", db: "csdUpgradeManagement", fields: [{ name: "upgradeKey", type: "string" }, { name: "upgradeName", type: "string" }, { name: "upgradeStatus", type: "select", options: "UPGRADE_STATUS_OPTIONS" }], display: { title: "upgradeName", sub: "upgradeStatus" } },
    { tab: "releaseTracking", plural: "releaseTracking", singular: "ReleaseTracking", pascal: "ReleaseTracking", db: "csdReleaseTracking", fields: [{ name: "releaseKey", type: "string" }, { name: "releaseName", type: "string" }, { name: "releaseStatus", type: "select", options: "RELEASE_STATUS_OPTIONS" }], display: { title: "releaseName", sub: "releaseStatus" } },
    { tab: "trainingPortals", plural: "trainingPortals", singular: "TrainingPortal", pascal: "TrainingPortal", db: "csdTrainingPortals", fields: [{ name: "portalKey", type: "string" }, { name: "portalName", type: "string" }, { name: "portalType", type: "string" }], display: { title: "portalName", sub: "portalType" } },
    { tab: "videoLibrary", plural: "videoLibrary", singular: "VideoLibrary", pascal: "VideoLibrary", db: "csdVideoLibrary", fields: [{ name: "videoKey", type: "string" }, { name: "videoTitle", type: "string" }, { name: "videoCategory", type: "string" }], display: { title: "videoTitle", sub: "videoCategory" } },
    { tab: "productTours", plural: "productTours", singular: "ProductTour", pascal: "ProductTour", db: "csdProductTours", fields: [{ name: "tourKey", type: "string" }, { name: "tourName", type: "string" }, { name: "tourType", type: "string" }], display: { title: "tourName", sub: "tourType" } },
    { tab: "certifications", plural: "certifications", singular: "Certification", pascal: "Certification", db: "csdCertifications", fields: [{ name: "certificationKey", type: "string" }, { name: "certificationName", type: "string" }, { name: "certificationType", type: "string" }], display: { title: "certificationName", sub: "certificationType" } },
    { tab: "progressTracking", plural: "progressTracking", singular: "ProgressTracking", pascal: "ProgressTracking", db: "csdProgressTracking", fields: [{ name: "progressKey", type: "string" }, { name: "learnerRef", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressKey", sub: "learnerRef" } },
    { tab: "learningAnalytics", plural: "learningAnalytics", singular: "LearningAnalytic", pascal: "LearningAnalytic", db: "csdLearningAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "metricName", type: "string" }, { name: "completionRate", type: "number" }], display: { title: "metricName", sub: "completionRate" } },
    { tab: "deliveryWorkflows", plural: "deliveryWorkflows", singular: "DeliveryWorkflow", pascal: "DeliveryWorkflow", db: "csdDeliveryWorkflows", fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowStatus", type: "select", options: "WORKFLOW_STATUS_OPTIONS" }], display: { title: "workflowName", sub: "workflowStatus" } },
    { tab: "onboardingAutomation", plural: "onboardingAutomation", singular: "OnboardingAutomation", pascal: "OnboardingAutomation", db: "csdOnboardingAutomation", fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" } },
    { tab: "implementationTracking", plural: "implementationTracking", singular: "ImplementationTracking", pascal: "ImplementationTracking", db: "csdImplementationTracking", fields: [{ name: "trackingKey", type: "string" }, { name: "implementationName", type: "string" }, { name: "implementationStatus", type: "select", options: "IMPLEMENTATION_STATUS_OPTIONS" }], display: { title: "implementationName", sub: "implementationStatus" } },
    { tab: "resourceAssignments", plural: "resourceAssignments", singular: "ResourceAssignment", pascal: "ResourceAssignment", db: "csdResourceAssignments", fields: [{ name: "assignmentKey", type: "string" }, { name: "resourceName", type: "string" }, { name: "resourceType", type: "string" }], display: { title: "resourceName", sub: "resourceType" } },
    { tab: "milestoneTracking", plural: "milestoneTracking", singular: "MilestoneTracking", pascal: "MilestoneTracking", db: "csdMilestoneTracking", fields: [{ name: "milestoneKey", type: "string" }, { name: "milestoneName", type: "string" }, { name: "milestoneStatus", type: "select", options: "MILESTONE_STATUS_OPTIONS" }], display: { title: "milestoneName", sub: "milestoneStatus" } },
    { tab: "operationsMetrics", plural: "operationsMetrics", singular: "OperationsMetric", pascal: "OperationsMetric", db: "csdOperationsMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "customerHealthScore", type: "number" }, { name: "overallDeliveryScore", type: "number" }], display: { title: "metricsKey", sub: "overallDeliveryScore" } },
    { tab: "operationsHealth", plural: "operationsHealth", singular: "OperationsHealth", pascal: "OperationsHealth", db: "csdOperationsHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: "csdExecutiveKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" } },
    { tab: "deliveryFailures", plural: "deliveryFailures", singular: "DeliveryFailure", pascal: "DeliveryFailure", db: "csdDeliveryFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/company-foundation"\);/, 'const mod = join(root, "src/modules/customer-success-delivery");');
s = s.replace(/const entities = \[[\s\S]*?\];/, csdEntitiesBlock);

const csdReps = [
    [/companyHubs/g, "deliveryHubs"],
    [/companyHubOptions/g, "deliveryHubOptions"],
    [/getCompanyHubs/g, "getDeliveryHubs"],
    [/getCompanyHubOptions/g, "getDeliveryHubOptions"],
    [/CompanyHubSelect/g, "DeliveryHubSelect"],
    [/buildCompanyHubLookupMaps/g, "buildDeliveryHubLookupMaps"],
    [/companyHubId/g, "deliveryHubId"],
    [/Company Hubs/g, "Delivery Hubs"],
    [/Company Foundation/g, "Customer Success & Delivery"],
    [/company hub/g, "delivery hub"],
    [/CompanyHub/g, "DeliveryHub"],
    [/CompanyMetric/g, "OperationsMetric"],
    [/CompanyHealth/g, "OperationsHealth"],
    [/CompanyFailure/g, "DeliveryFailure"],
    [/CompanyFoundationPage/g, "CustomerSuccessDeliveryPage"],
    [/CompanyFoundationStats/g, "CustomerSuccessDeliveryStats"],
    [/CompanyFoundationPanels/g, "CustomerSuccessDeliveryPanels"],
    [/CompanyFoundationService/g, "CustomerSuccessDeliveryService"],
    [/CompanyFoundationClient/g, "CustomerSuccessDeliveryClient"],
    [/buildCmp/g, "buildCsd"],
    [/mapCmp/g, "mapCsd"],
    [/CmpDashboardStats/g, "CsdDashboardStats"],
    [/CmpPipelineInfo/g, "CsdPipelineInfo"],
    [/CmpSdk/g, "CsdSdk"],
    [/CMP_TABS/g, "CSD_TABS"],
    [/CMP_THEME/g, "CSD_THEME"],
    [/CMP_PERMISSIONS/g, "CSD_PERMISSIONS"],
    [/CMP_STATUS_OPTIONS/g, "CSD_STATUS_OPTIONS"],
    [/Program F Wave 1/g, "Program F Wave 3"],
    [/emerald-600/g, "sky-600"],
    [/emerald-500/g, "sky-500"],
    [/emerald-400/g, "sky-400"],
    [/emerald-300/g, "sky-300"],
    [/ring-emerald/g, "ring-sky"],
    [/bg-emerald/g, "bg-sky"],
    [/text-emerald/g, "text-sky"],
    [/hover:bg-emerald/g, "hover:bg-sky"],
    [/hover:border-emerald/g, "hover:border-sky"],
    [/mapBrandProfileForStats/g, "mapCustomerHealthScoreForStats"],
    [/mapPortalDashboardForStats/g, "mapSupportTicketForStats"],
    [/mapCompanyMetricForStats/g, "mapOperationsMetricForStats"],
    [/mapWebsitePageForStats/g, "mapDeploymentTrackingForStats"],
    [/mapPricingPlanForStats/g, "mapTrainingPortalForStats"],
    [/mapRetailInvoiceForStats/g, "mapTrainingPortalForStats"],
    [/mapCompanyHealthForStats/g, "mapOperationsHealthForStats"],
    [/mapCompanyFailureForStats/g, "mapDeliveryFailureForStats"],
    [/brandProfiles/g, "customerHealthScores"],
    [/portalDashboards/g, "supportTickets"],
    [/websitePages/g, "deploymentTracking"],
    [/pricingPlans/g, "trainingPortals"],
    [/proposals/g, "deliveryWorkflows"],
    [/companyMetrics/g, "operationsMetrics"],
    [/companyHealth/g, "operationsHealth"],
    [/companyFailures/g, "deliveryFailures"],
    [/totalCompanyHubs/g, "totalDeliveryHubs"],
    [/activeCompanyHubs/g, "activeDeliveryHubs"],
    [/brandProfileCount/g, "customerHealthScoreCount"],
    [/portalDashboardCount/g, "supportTicketCount"],
    [/websitePageCount/g, "deploymentTrackingCount"],
    [/pricingPlanCount/g, "trainingPortalCount"],
    [/proposalCount/g, "deliveryWorkflowCount"],
    [/openCompanyFailureCount/g, "openDeliveryFailureCount"],
    [/overallCompanyScore/g, "overallDeliveryScore"],
    [/websiteAnalyticsScore/g, "adoptionRateScore"],
    [/demoRequestCount/g, "renewalForecastCount"],
    [/activeCustomerCount/g, "openTicketCount"],
    [/revenueTotal/g, "slaComplianceScore"],
    [/platformHealthScore/g, "deploymentStatusScore"],
    [/supportOpenCount/g, "liveChatSessionCount"],
    [/sdkConfigureBrandProfile/g, "sdkTrackCustomerHealth"],
    [/sdkPublishWebsitePage/g, "sdkOpenSupportTicket"],
    [/sdkGenerateProposal/g, "sdkRunDeliveryWorkflow"],
    [/configureBrandProfile/g, "trackCustomerHealth"],
    [/publishWebsitePage/g, "openSupportTicket"],
    [/generateProposal/g, "runDeliveryWorkflow"],
    [/createBrandProfile/g, "createCustomerHealthScore"],
    [/createWebsitePage/g, "createSupportTicket"],
    [/createProposal/g, "createDeliveryWorkflow"],
    [/Configure brand profile/g, "Track customer health"],
    [/Publish website page/g, "Open support ticket"],
    [/Generate proposal/g, "Run delivery workflow"],
    [/brand profiles, website pages, pricing plans, proposals, portal dashboards, and documentation/g, "customer health scores, support tickets, deployment tracking, training portals, delivery workflows, and operations metrics"],
    [/Brand profiles, website pages, pricing plans, proposals, portal dashboards, documentation, and company foundation outputs/g, "Customer health scores, support tickets, deployment tracking, training portals, delivery workflows, operations metrics, and customer success delivery outputs"],
    [/company_foundation/g, "customer_success_delivery"],
    [/configure_brand_profile/g, "track_customer_health"],
    [/generate_proposal/g, "run_delivery_workflow"],
    [/"cmp\.view"/g, '"csd.view"'],
    [/"cmp\.manage"/g, '"csd.manage"'],
    [/"cmp\.approve"/g, '"csd.approve"'],
    [/"cmp\.admin"/g, '"csd.admin"'],
    [/cmpCompanyHubs/g, "csdDeliveryHubs"],
    [/getCompanyFailures/g, "getDeliveryFailures"],
    [/company-foundation-mappers/g, "customer-success-delivery-mappers"],
    [/buildCompanyHubPayload/g, "buildDeliveryHubPayload"],
    [/mapCompanyHubSummary/g, "mapDeliveryHubSummary"],
    [/buildCmpAuditPayload/g, "buildCsdAuditPayload"],
    [/createCompanyFoundationClient/g, "createCustomerSuccessDeliveryClient"],
    [/databaseService\.cmp/g, "databaseService.csd"],
    [/useCompanyFoundation/g, "useCustomerSuccessDelivery"],
    [/companyFoundationService/g, "customerSuccessDeliveryService"],
    [/company-foundation\.service/g, "customer-success-delivery.service"],
    [/@\/src\/modules\/company-foundation\//g, "@/src/modules/customer-success-delivery/"],
    [/\/company-foundation\/page/g, "/customer-success-delivery/page"],
    [/app\/\(shell\)\/company-foundation/g, "app/(shell)/customer-success-delivery"],
    [/CmpSdkConfigureBrandProfileInput/g, "CsdSdkTrackCustomerHealthInput"],
    [/CmpSdkConfigureBrandProfileResult/g, "CsdSdkTrackCustomerHealthResult"],
    [/CmpSdkPublishWebsitePageInput/g, "CsdSdkOpenSupportTicketInput"],
    [/CmpSdkPublishWebsitePageResult/g, "CsdSdkOpenSupportTicketResult"],
    [/CmpSdkGenerateProposalInput/g, "CsdSdkRunDeliveryWorkflowInput"],
    [/CmpSdkGenerateProposalResult/g, "CsdSdkRunDeliveryWorkflowResult"],
    [/CmpSdkRegisterFormInput/g, "CsdSdkTrackCustomerHealthInput"],
    [/CmpSdkRegisterFormResult/g, "CsdSdkTrackCustomerHealthResult"],
    [/CmpSdkConfigureValidationInput/g, "CsdSdkOpenSupportTicketInput"],
    [/CmpSdkConfigureValidationResult/g, "CsdSdkOpenSupportTicketResult"],
    [/CmpSdkRunFormSubmissionInput/g, "CsdSdkRunDeliveryWorkflowInput"],
    [/CmpSdkRunFormSubmissionResult/g, "CsdSdkRunDeliveryWorkflowResult"],
    [/ElfSdkRegisterFormInput/g, "CsdSdkTrackCustomerHealthInput"],
    [/ElfSdkRegisterFormResult/g, "CsdSdkTrackCustomerHealthResult"],
    [/ElfSdkConfigureValidationInput/g, "CsdSdkOpenSupportTicketInput"],
    [/ElfSdkConfigureValidationResult/g, "CsdSdkOpenSupportTicketResult"],
    [/ElfSdkRunFormSubmissionInput/g, "CsdSdkRunDeliveryWorkflowInput"],
    [/ElfSdkRunFormSubmissionResult/g, "CsdSdkRunDeliveryWorkflowResult"],
    [/ElfSdkConnectServiceInput/g, "CsdSdkTrackCustomerHealthInput"],
    [/ElfSdkIssueApiKeyInput/g, "CsdSdkOpenSupportTicketInput"],
    [/ElfSdkRegisterWebhookInput/g, "CsdSdkRunDeliveryWorkflowInput"],
    [/retailInvoices/g, "trainingPortals"],
    [/openRetailInvoiceCount/g, "trainingPortalCount"],
    [/mapRetailInvoiceForStats/g, "mapTrainingPortalForStats"],
];

for (const [from, to] of csdReps) s = s.replace(from, to);

const frameworkImports = `import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
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
import { crmService } from "@/src/modules/crm/services/crm.service";`;

s = s.replace(
    /import { createAiOrchestrationClient } from "@\/src\/modules\/ai-orchestration\/sdk";\r?\nimport { createKnowledgeClient } from "@\/src\/modules\/knowledge\/sdk";/,
    frameworkImports,
);

s = s.replace(
    /"mapCustomerHealthScoreForStats", "mapSupportTicketForStats", "mapOperationsMetricForStats", "mapDeploymentTrackingForStats", "mapTrainingPortalForStats", "mapTrainingPortalForStats", "mapOperationsHealthForStats", "mapDeliveryFailureForStats"/,
    '"mapCustomerHealthScoreForStats", "mapSupportTicketForStats", "mapOperationsMetricForStats", "mapDeploymentTrackingForStats", "mapTrainingPortalForStats", "mapOperationsHealthForStats", "mapDeliveryFailureForStats"',
);

s = s.replace(
    /"AuditEntry", "CsdDashboardStats", "CsdPipelineInfo", "CsdSdkRegisterFormInput", "CsdSdkRegisterFormResult", "CsdSdkConfigureValidationInput", "CsdSdkConfigureValidationResult", "CsdSdkRunFormSubmissionInput", "CsdSdkRunFormSubmissionResult"/,
    '"AuditEntry", "CsdDashboardStats", "CsdPipelineInfo", "CsdSdkTrackCustomerHealthInput", "CsdSdkTrackCustomerHealthResult", "CsdSdkOpenSupportTicketInput", "CsdSdkOpenSupportTicketResult", "CsdSdkRunDeliveryWorkflowInput", "CsdSdkRunDeliveryWorkflowResult"',
);

s = s.replace(
    /async getDashboardStats\(authUserId: string, email: string, fullName\?: string \| null\): Promise<CsdDashboardStats> \{[\s\S]*?getPipelineInfo\(\): CsdPipelineInfo/,
    `async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CsdDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildCsdDashboardStats({ deliveryHubs: [], customerHealthScores: [], supportTickets: [], deploymentTracking: [], trainingPortals: [], operationsMetrics: [], operationsHealth: [], deliveryFailures: [], auditLogs: [] });
        const [deliveryHubs, customerHealthScoresRaw, supportTicketsRaw, deploymentTrackingRaw, trainingPortalsRaw, operationsMetricsRaw, operationsHealthRaw, deliveryFailures, auditLogs] = await Promise.all([
            this.getDeliveryHubs(authUserId, email, fullName),
            databaseService.csdCustomerHealthScores.listByOrganization(context.organizationId),
            databaseService.csdSupportTickets.listByOrganization(context.organizationId),
            databaseService.csdDeploymentTracking.listByOrganization(context.organizationId),
            databaseService.csdTrainingPortals.listByOrganization(context.organizationId),
            databaseService.csdOperationsMetrics.listByOrganization(context.organizationId),
            databaseService.csdOperationsHealth.listByOrganization(context.organizationId),
            this.getDeliveryFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildCsdDashboardStats({
            deliveryHubs,
            customerHealthScores: customerHealthScoresRaw.map(mapCustomerHealthScoreForStats),
            supportTickets: supportTicketsRaw.map(mapSupportTicketForStats),
            deploymentTracking: deploymentTrackingRaw.map(mapDeploymentTrackingForStats),
            trainingPortals: trainingPortalsRaw.map(mapTrainingPortalForStats),
            operationsMetrics: operationsMetricsRaw.map(mapOperationsMetricForStats),
            operationsHealth: operationsHealthRaw.map(mapOperationsHealthForStats),
            deliveryFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): CsdPipelineInfo`,
);

s = s.replace(
    /async sdkTrackCustomerHealth\(authUserId: string, email: string, input: CsdSdk[\s\S]*?return \{ formId: created\.id, formKey: created\.formKey, status: created\.status \};\r?\n    \}/,
    `async sdkTrackCustomerHealth(authUserId: string, email: string, input: CsdSdkTrackCustomerHealthInput, fullName?: string | null): Promise<CsdSdkTrackCustomerHealthResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createCustomerHealthScore(authUserId, email, { deliveryHubId: input.deliveryHubId, scoreKey: input.scoreKey, customerRef: input.customerRef }, fullName);
        return { scoreId: created.id, scoreKey: created.scoreKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkOpenSupportTicket\(authUserId: string, email: string, input: CsdSdk[\s\S]*?return \{ ruleId: created\.id, ruleKey: created\.ruleKey, status: created\.status \};\r?\n    \}/,
    `async sdkOpenSupportTicket(authUserId: string, email: string, input: CsdSdkOpenSupportTicketInput, fullName?: string | null): Promise<CsdSdkOpenSupportTicketResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createSupportTicket(authUserId, email, { deliveryHubId: input.deliveryHubId, ticketKey: input.ticketKey, ticketTitle: input.ticketTitle }, fullName);
        return { ticketId: created.id, ticketKey: created.ticketKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkRunDeliveryWorkflow\(authUserId: string, email: string, input: CsdSdk[\s\S]*?return \{ submissionId: created\.id, submissionKey: created\.submissionKey, status: created\.status \};\r?\n    \}/,
    `async sdkRunDeliveryWorkflow(authUserId: string, email: string, input: CsdSdkRunDeliveryWorkflowInput, fullName?: string | null): Promise<CsdSdkRunDeliveryWorkflowResult> {
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
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createDeliveryWorkflow(authUserId, email, { deliveryHubId: input.deliveryHubId, workflowKey: input.workflowKey, workflowName: input.workflowName }, fullName);
        return { workflowId: created.id, workflowKey: created.workflowKey, status: created.status };
    }`,
);

s = s.replace(
    /import type \{ CsdSdkRegisterFormInput, CsdSdkConfigureValidationInput, CsdSdkRunFormSubmissionInput \}/,
    "import type { CsdSdkTrackCustomerHealthInput, CsdSdkOpenSupportTicketInput, CsdSdkRunDeliveryWorkflowInput }",
);

s = s.replace(/async registerCampus\(input: CsdSdkConnectServiceInput\)/, "async trackCustomerHealth(input: CsdSdkTrackCustomerHealthInput)");
s = s.replace(/async configureWizardProfile\(input: CsdSdkIssueApiKeyInput\)/, "async openSupportTicket(input: CsdSdkOpenSupportTicketInput)");
s = s.replace(/async runGoLiveWorkflow\(input: CsdSdkRegisterWebhookInput\)/, "async runDeliveryWorkflow(input: CsdSdkRunDeliveryWorkflowInput)");
s = s.replace(/async openSupportTicket\(input: CsdSdkIssueApiKeyInput\)/, "async openSupportTicket(input: CsdSdkOpenSupportTicketInput)");
s = s.replace(/async runDeliveryWorkflow\(input: CsdSdkRegisterWebhookInput\)/, "async runDeliveryWorkflow(input: CsdSdkRunDeliveryWorkflowInput)");

const csdOptionsBlock = `export const PLAN_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
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

export const SESSION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "waiting", label: "Waiting" },
    { value: "ended", label: "Ended" },
    { value: "missed", label: "Missed" },
] as const;

export const AUTOMATION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "failed", label: "Failed" },
    { value: "completed", label: "Completed" },
] as const;

export const DEPLOYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "deploying", label: "Deploying" },
    { value: "deployed", label: "Deployed" },
    { value: "failed", label: "Failed" },
] as const;

export const UPGRADE_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const RELEASE_STATUS_OPTIONS = [
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In Progress" },
    { value: "released", label: "Released" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const WORKFLOW_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const IMPLEMENTATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "blocked", label: "Blocked" },
] as const;

export const MILESTONE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "missed", label: "Missed" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const CSD_PERMISSIONS = ["csd.view", "csd.manage", "csd.approve", "csd.admin"] as const;

export const CSD_STATUS_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const CSD_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const CSD_THEME)/,
    `$1${csdOptionsBlock}$2`,
);

s = s.replace(/Select company hub/g, "Select delivery hub");
s = s.replace(/BRAND_STATUS_OPTIONS/g, "PLAN_STATUS_OPTIONS");
s = s.replace(/DEMO_REQUEST_STATUS_OPTIONS/g, "SESSION_STATUS_OPTIONS");
s = s.replace(/PROPOSAL_STATUS_OPTIONS/g, "WORKFLOW_STATUS_OPTIONS");
s = s.replace(/CONTRACT_STATUS_OPTIONS/g, "IMPLEMENTATION_STATUS_OPTIONS");
s = s.replace(/SUBSCRIPTION_STATUS_OPTIONS/g, "UPGRADE_STATUS_OPTIONS");
s = s.replace(/SUPPORT_STATUS_OPTIONS/g, "MILESTONE_STATUS_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-customer-success-delivery-ui.mjs");
