#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-retail-ui.mjs");
const outPath = join(root, "scripts/generate-launch-foundation-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
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
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/retail"\);/, 'const mod = join(root, "src/modules/launch-foundation");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/retailHubs/g, "launchHubs"],
    [/retailHubOptions/g, "launchHubOptions"],
    [/getRetailHubs/g, "getLaunchHubs"],
    [/getRetailHubOptions/g, "getLaunchHubOptions"],
    [/RetailHubSelect/g, "LaunchHubSelect"],
    [/buildRetailHubLookupMaps/g, "buildLaunchHubLookupMaps"],
    [/retailHubId/g, "launchHubId"],
    [/Retail Hubs/g, "Launch Hubs"],
    [/Retail OS/g, "Launch Foundation"],
    [/retail hub/g, "launch hub"],
    [/RetailHub/g, "LaunchHub"],
    [/RetailMetric/g, "LaunchMetric"],
    [/RetailHealth/g, "LaunchHealth"],
    [/RetailFailure/g, "LaunchFailure"],
    [/RetailPage/g, "LaunchFoundationPage"],
    [/RetailStats/g, "LaunchFoundationStats"],
    [/RetailPanels/g, "LaunchFoundationPanels"],
    [/RetailService/g, "LaunchFoundationService"],
    [/RetailClient/g, "LaunchFoundationClient"],
    [/buildRtl/g, "buildElf"],
    [/mapRtl/g, "mapElf"],
    [/RtlDashboardStats/g, "ElfDashboardStats"],
    [/RtlPipelineInfo/g, "ElfPipelineInfo"],
    [/RtlSdk/g, "ElfSdk"],
    [/RTL_TABS/g, "ELF_TABS"],
    [/RTL_THEME/g, "ELF_THEME"],
    [/RTL_PERMISSIONS/g, "ELF_PERMISSIONS"],
    [/RTL_STATUS_OPTIONS/g, "ELF_STATUS_OPTIONS"],
    [/Program B Sprint 9/g, "Program C Sprint 4"],
    [/lime-600/g, "slate-600"],
    [/lime-500/g, "slate-500"],
    [/lime-400/g, "slate-400"],
    [/lime-300/g, "slate-300"],
    [/ring-lime/g, "ring-slate"],
    [/bg-lime/g, "bg-slate"],
    [/text-lime/g, "text-slate"],
    [/hover:bg-lime/g, "hover:bg-slate"],
    [/hover:border-lime/g, "hover:border-slate"],
    [/mapRetailBrandForStats/g, "mapOrganizationProvisionForStats"],
    [/mapCustomerProfileForStats/g, "mapCustomerRegistryForStats"],
    [/mapRetailMetricForStats/g, "mapLaunchMetricForStats"],
    [/mapSalesOrderForStats/g, "mapImportJobForStats"],
    [/mapPosTransactionForStats/g, "mapGoLiveChecklistForStats"],
    [/mapWarehouseForStats/g, "mapCustomerRegistryForStats"],
    [/mapRetailHealthForStats/g, "mapLaunchHealthForStats"],
    [/mapRetailFailureForStats/g, "mapLaunchFailureForStats"],
    [/retailBrands/g, "organizationProvisions"],
    [/customerProfiles/g, "customerRegistry"],
    [/salesOrders/g, "importJobs"],
    [/posTransactions/g, "goLiveChecklists"],
    [/warehouses/g, "customerRegistry"],
    [/retailMetrics/g, "launchMetrics"],
    [/retailHealth/g, "launchHealth"],
    [/retailFailures/g, "launchFailures"],
    [/totalRetailHubs/g, "totalLaunchHubs"],
    [/activeRetailHubs/g, "activeLaunchHubs"],
    [/retailBrandCount/g, "organizationProvisionCount"],
    [/customerProfileCount/g, "customerRegistryCount"],
    [/salesOrderCount/g, "importJobCount"],
    [/openPosTransactionCount/g, "goLiveChecklistCount"],
    [/overallRetailScore/g, "overallLaunchScore"],
    [/revenueTotalScore/g, "platformHealthScore"],
    [/profitTotalScore/g, "customerHealthScore"],
    [/salesCountScore/g, "deploymentCount"],
    [/inventoryValueScore/g, "subscriptionCount"],
    [/customerRetentionRateScore/g, "supportOpenCount"],
    [/sdkRegisterRetailBrand/g, "sdkProvisionOrganization"],
    [/sdkConfigureCustomerProfile/g, "sdkConfigureWizardProfile"],
    [/sdkRunSalesOrderWorkflow/g, "sdkRunGoLiveWorkflow"],
    [/configureCustomerProfile/g, "configureWizardProfile"],
    [/runSalesOrderWorkflow/g, "runGoLiveWorkflow"],
    [/createRetailBrand/g, "createOrganizationProvision"],
    [/createCustomerProfile/g, "createWizardProfile"],
    [/createSalesOrder/g, "createGoLiveChecklist"],
    [/Configure customer profile/g, "Configure wizard profile"],
    [/Run sales order workflow/g, "Run go-live workflow"],
    [/retail brands, customer profiles, sales orders, warehouses, POS transactions, and product catalogs/g, "organization provisions, wizard profiles, import jobs, go-live checklists, customer registry, and subscription records"],
    [/Retail brands, customer profiles, sales orders, warehouses, POS transactions, product catalogs, and retail business operating system outputs/g, "Organization provisions, wizard profiles, import jobs, go-live checklists, customer registry, subscription records, and launch foundation outputs"],
    [/enterprise_retail_business_os/g, "enterprise_launch_foundation"],
    [/register_retail_brand/g, "provision_organization"],
    [/run_sales_order_workflow/g, "run_go_live_workflow"],
    [/"rtl\.view"/g, '"elf.view"'],
    [/"rtl\.manage"/g, '"elf.manage"'],
    [/"rtl\.approve"/g, '"elf.approve"'],
    [/"rtl\.admin"/g, '"elf.admin"'],
    [/rtlRetailHubs/g, "elfLaunchHubs"],
    [/getRetailFailures/g, "getLaunchFailures"],
    [/retail-mappers/g, "launch-foundation-mappers"],
    [/buildRetailHubPayload/g, "buildLaunchHubPayload"],
    [/mapRetailHubSummary/g, "mapLaunchHubSummary"],
    [/buildRtlAuditPayload/g, "buildElfAuditPayload"],
    [/createRetailClient/g, "createLaunchFoundationClient"],
    [/RetailClient/g, "LaunchFoundationClient"],
    [/databaseService\.rtl/g, "databaseService.elf"],
    [/useRetail/g, "useLaunchFoundation"],
    [/RetailPage/g, "LaunchFoundationPage"],
    [/RetailStats/g, "LaunchFoundationStats"],
    [/RetailPanels/g, "LaunchFoundationPanels"],
    [/retailService/g, "launchFoundationService"],
    [/RetailService/g, "LaunchFoundationService"],
    [/retail\.service/g, "launch-foundation.service"],
    [/@\/src\/modules\/retail\//g, "@/src/modules/launch-foundation/"],
    [/\/retail\/page/g, "/launch-foundation/page"],
    [/app\/\(shell\)\/retail/g, "app/(shell)/launch-foundation"],
    [/openRetailFailureCount/g, "openLaunchFailureCount"],
    [/RtlSdkRegisterRetailBrandInput/g, "ElfSdkProvisionOrganizationInput"],
    [/RtlSdkRegisterRetailBrandResult/g, "ElfSdkProvisionOrganizationResult"],
    [/RtlSdkConfigureCustomerProfileInput/g, "ElfSdkConfigureWizardProfileInput"],
    [/RtlSdkConfigureCustomerProfileResult/g, "ElfSdkConfigureWizardProfileResult"],
    [/RtlSdkRunSalesOrderWorkflowInput/g, "ElfSdkRunGoLiveWorkflowInput"],
    [/RtlSdkRunSalesOrderWorkflowResult/g, "ElfSdkRunGoLiveWorkflowResult"],
    [/createRetailClient/g, "createLaunchFoundationClient"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.elfLaunchFoundationBrands\.listByOrganization/g, "databaseService.elfOrganizationProvisions.listByOrganization");
s = s.replace(/databaseService\.elfStores\.listByOrganization/g, "databaseService.elfTenantProvisions.listByOrganization");
s = s.replace(/databaseService\.elfCashRegisters\.listByOrganization/g, "databaseService.elfIndustryPackAssignments.listByOrganization");
s = s.replace(/databaseService\.elfStoreDepartments\.listByOrganization/g, "databaseService.elfModuleLicenses.listByOrganization");
s = s.replace(/databaseService\.elfCustomerRegistry\.listByOrganization/g, "databaseService.elfCustomerRegistry.listByOrganization");
s = s.replace(/databaseService\.elfLaunchMetrics\.listByOrganization/g, "databaseService.elfLaunchMetrics.listByOrganization");
s = s.replace(/databaseService\.elfImportJobs\.listByOrganization/g, "databaseService.elfImportJobs.listByOrganization");
s = s.replace(/databaseService\.elfGoLiveChecklists\.listByOrganization/g, "databaseService.elfGoLiveChecklists.listByOrganization");
s = s.replace(/databaseService\.elfLaunchHealth\.listByOrganization/g, "databaseService.elfLaunchHealth.listByOrganization");
s = s.replace(/databaseService\.elfLaunchHubs\.listByOrganization/g, "databaseService.elfLaunchHubs.listByOrganization");
s = s.replace(/databaseService\.elfAuditLogs/g, "databaseService.elfAuditLogs");

s = s.replace(
    /async sdkProvisionOrganization\(authUserId: string, email: string, input: ElfSdkProvisionOrganizationInput[\s\S]*?return \{ brandId: created\.id, brandKey: created\.brandKey, status: created\.status \};\n    \}/,
    `async sdkProvisionOrganization(authUserId: string, email: string, input: ElfSdkProvisionOrganizationInput, fullName?: string | null): Promise<ElfSdkProvisionOrganizationResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const created = await this.createOrganizationProvision(authUserId, email, { launchHubId: input.launchHubId, provisionKey: input.provisionKey, provisionName: input.provisionName }, fullName);
        return { provisionId: created.id, provisionKey: created.provisionKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkConfigureWizardProfile\(authUserId: string, email: string, input: ElfSdkConfigureWizardProfileInput[\s\S]*?return \{ profileId: created\.id, profileKey: created\.profileKey, status: created\.status \};\n    \}/,
    `async sdkConfigureWizardProfile(authUserId: string, email: string, input: ElfSdkConfigureWizardProfileInput, fullName?: string | null): Promise<ElfSdkConfigureWizardProfileResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const created = await this.createWizardProfile(authUserId, email, { launchHubId: input.launchHubId, profileKey: input.profileKey, profileName: input.profileName }, fullName);
        return { profileId: created.id, profileKey: created.profileKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkRunGoLiveWorkflow\(authUserId: string, email: string, input: ElfSdkRunGoLiveWorkflowInput[\s\S]*?return \{ orderId: created\.id, orderKey: created\.orderKey, status: created\.status \};\n    \}/,
    `async sdkRunGoLiveWorkflow(authUserId: string, email: string, input: ElfSdkRunGoLiveWorkflowInput, fullName?: string | null): Promise<ElfSdkRunGoLiveWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const created = await this.createGoLiveChecklist(authUserId, email, { launchHubId: input.launchHubId, checklistKey: input.checklistKey, checklistName: input.checklistName }, fullName);
        return { checklistId: created.id, checklistKey: created.checklistKey, status: created.status };
    }`,
);

if (!s.includes("createCommercialSaasClient")) {
    s = s.replace(
        'import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";',
        `import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";`,
    );
}

const elfOptionsBlock = `export const PROVISION_STATUS_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const ELF_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const ELF_THEME)/,
    `$1${elfOptionsBlock}$2`,
);

s = s.replace(/Select launch hub/g, "Select launch hub");
s = s.replace(/REGISTER_STATUS_OPTIONS/g, "PROVISION_STATUS_OPTIONS");
s = s.replace(/SALES_ORDER_STATUS_OPTIONS/g, "IMPORT_STATUS_OPTIONS");
s = s.replace(/POS_STATUS_OPTIONS/g, "DEPLOYMENT_STATUS_OPTIONS");
s = s.replace(/PROMOTION_STATUS_OPTIONS/g, "LICENSE_STATUS_OPTIONS");
s = s.replace(/RETURN_STATUS_OPTIONS/g, "RENEWAL_STATUS_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-launch-foundation-ui.mjs");
