#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("IfrFrameworkHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/launch-readiness-repositories\";";
    const elrImportEnd = da.indexOf(anchor) + anchor.length;
    const ifrImport = `
import {
    IfrFrameworkHubRepository,
    IfrIndustryRegistrationRepository,
    IfrIndustryMetadataRepository,
    IfrIndustryVersionRepository,
    IfrIndustryDependencyRepository,
    IfrBusinessTypeRepository,
    IfrBusinessSizeRepository,
    IfrOperatingModelRepository,
    IfrIndustryProfileRepository,
    IfrDashboardTemplateRepository,
    IfrWorkflowTemplateRepository,
    IfrRoleTemplateRepository,
    IfrReportTemplateRepository,
    IfrDynamicConfigurationRepository,
    IfrFeatureConfigurationRepository,
    IfrBusinessRuleRepository,
    IfrValidationRuleRepository,
    IfrIndustryContextRepository,
    IfrAiContextRepository,
    IfrTerminologyEntryRepository,
    IfrDemoProfileRepository,
    IfrProductionProfileRepository,
    IfrEnterpriseProfileRepository,
    IfrSharedApiRepository,
    IfrContextApiRepository,
    IfrConfigurationApiRepository,
    IfrExtensionPointRepository,
    IfrFrameworkMetricRepository,
    IfrFrameworkHealthRepository,
    IfrCompatibilityCheckRepository,
    IfrFrameworkFailureRepository,
    IfrAuditLogRepository,
} from "@/src/modules/database/repositories/industry-framework-repositories";
`;
    da = da.slice(0, elrImportEnd) + ifrImport + da.slice(elrImportEnd);

    const elrProp = "    readonly elrAuditLogs: ElrAuditLogRepository;";
    const ifrProps = `    readonly ifrFrameworkHubs: IfrFrameworkHubRepository;
    readonly ifrIndustryRegistrations: IfrIndustryRegistrationRepository;
    readonly ifrIndustryMetadata: IfrIndustryMetadataRepository;
    readonly ifrIndustryVersions: IfrIndustryVersionRepository;
    readonly ifrIndustryDependencies: IfrIndustryDependencyRepository;
    readonly ifrBusinessTypes: IfrBusinessTypeRepository;
    readonly ifrBusinessSizes: IfrBusinessSizeRepository;
    readonly ifrOperatingModels: IfrOperatingModelRepository;
    readonly ifrIndustryProfiles: IfrIndustryProfileRepository;
    readonly ifrDashboardTemplates: IfrDashboardTemplateRepository;
    readonly ifrWorkflowTemplates: IfrWorkflowTemplateRepository;
    readonly ifrRoleTemplates: IfrRoleTemplateRepository;
    readonly ifrReportTemplates: IfrReportTemplateRepository;
    readonly ifrDynamicConfigurations: IfrDynamicConfigurationRepository;
    readonly ifrFeatureConfigurations: IfrFeatureConfigurationRepository;
    readonly ifrBusinessRules: IfrBusinessRuleRepository;
    readonly ifrValidationRules: IfrValidationRuleRepository;
    readonly ifrIndustryContexts: IfrIndustryContextRepository;
    readonly ifrAiContexts: IfrAiContextRepository;
    readonly ifrTerminologyEntries: IfrTerminologyEntryRepository;
    readonly ifrDemoProfiles: IfrDemoProfileRepository;
    readonly ifrProductionProfiles: IfrProductionProfileRepository;
    readonly ifrEnterpriseProfiles: IfrEnterpriseProfileRepository;
    readonly ifrSharedApis: IfrSharedApiRepository;
    readonly ifrContextApis: IfrContextApiRepository;
    readonly ifrConfigurationApis: IfrConfigurationApiRepository;
    readonly ifrExtensionPoints: IfrExtensionPointRepository;
    readonly ifrFrameworkMetrics: IfrFrameworkMetricRepository;
    readonly ifrFrameworkHealth: IfrFrameworkHealthRepository;
    readonly ifrCompatibilityChecks: IfrCompatibilityCheckRepository;
    readonly ifrFrameworkFailures: IfrFrameworkFailureRepository;
    readonly ifrAuditLogs: IfrAuditLogRepository;`;
    da = da.replace(elrProp, elrProp + "\n" + ifrProps);

    const elrCtor = "        this.elrAuditLogs = new ElrAuditLogRepository();";
    const ifrCtor = `        this.ifrFrameworkHubs = new IfrFrameworkHubRepository();
        this.ifrIndustryRegistrations = new IfrIndustryRegistrationRepository();
        this.ifrIndustryMetadata = new IfrIndustryMetadataRepository();
        this.ifrIndustryVersions = new IfrIndustryVersionRepository();
        this.ifrIndustryDependencies = new IfrIndustryDependencyRepository();
        this.ifrBusinessTypes = new IfrBusinessTypeRepository();
        this.ifrBusinessSizes = new IfrBusinessSizeRepository();
        this.ifrOperatingModels = new IfrOperatingModelRepository();
        this.ifrIndustryProfiles = new IfrIndustryProfileRepository();
        this.ifrDashboardTemplates = new IfrDashboardTemplateRepository();
        this.ifrWorkflowTemplates = new IfrWorkflowTemplateRepository();
        this.ifrRoleTemplates = new IfrRoleTemplateRepository();
        this.ifrReportTemplates = new IfrReportTemplateRepository();
        this.ifrDynamicConfigurations = new IfrDynamicConfigurationRepository();
        this.ifrFeatureConfigurations = new IfrFeatureConfigurationRepository();
        this.ifrBusinessRules = new IfrBusinessRuleRepository();
        this.ifrValidationRules = new IfrValidationRuleRepository();
        this.ifrIndustryContexts = new IfrIndustryContextRepository();
        this.ifrAiContexts = new IfrAiContextRepository();
        this.ifrTerminologyEntries = new IfrTerminologyEntryRepository();
        this.ifrDemoProfiles = new IfrDemoProfileRepository();
        this.ifrProductionProfiles = new IfrProductionProfileRepository();
        this.ifrEnterpriseProfiles = new IfrEnterpriseProfileRepository();
        this.ifrSharedApis = new IfrSharedApiRepository();
        this.ifrContextApis = new IfrContextApiRepository();
        this.ifrConfigurationApis = new IfrConfigurationApiRepository();
        this.ifrExtensionPoints = new IfrExtensionPointRepository();
        this.ifrFrameworkMetrics = new IfrFrameworkMetricRepository();
        this.ifrFrameworkHealth = new IfrFrameworkHealthRepository();
        this.ifrCompatibilityChecks = new IfrCompatibilityCheckRepository();
        this.ifrFrameworkFailures = new IfrFrameworkFailureRepository();
        this.ifrAuditLogs = new IfrAuditLogRepository();`;
    da = da.replace(elrCtor, elrCtor + "\n" + ifrCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("ifrFrameworkHubs")) {
    ds = ds.replace(
        "    elrAuditLogs: databaseAccess.elrAuditLogs,",
        `    elrAuditLogs: databaseAccess.elrAuditLogs,
    ifrFrameworkHubs: databaseAccess.ifrFrameworkHubs,
    ifrIndustryRegistrations: databaseAccess.ifrIndustryRegistrations,
    ifrIndustryMetadata: databaseAccess.ifrIndustryMetadata,
    ifrIndustryVersions: databaseAccess.ifrIndustryVersions,
    ifrIndustryDependencies: databaseAccess.ifrIndustryDependencies,
    ifrBusinessTypes: databaseAccess.ifrBusinessTypes,
    ifrBusinessSizes: databaseAccess.ifrBusinessSizes,
    ifrOperatingModels: databaseAccess.ifrOperatingModels,
    ifrIndustryProfiles: databaseAccess.ifrIndustryProfiles,
    ifrDashboardTemplates: databaseAccess.ifrDashboardTemplates,
    ifrWorkflowTemplates: databaseAccess.ifrWorkflowTemplates,
    ifrRoleTemplates: databaseAccess.ifrRoleTemplates,
    ifrReportTemplates: databaseAccess.ifrReportTemplates,
    ifrDynamicConfigurations: databaseAccess.ifrDynamicConfigurations,
    ifrFeatureConfigurations: databaseAccess.ifrFeatureConfigurations,
    ifrBusinessRules: databaseAccess.ifrBusinessRules,
    ifrValidationRules: databaseAccess.ifrValidationRules,
    ifrIndustryContexts: databaseAccess.ifrIndustryContexts,
    ifrAiContexts: databaseAccess.ifrAiContexts,
    ifrTerminologyEntries: databaseAccess.ifrTerminologyEntries,
    ifrDemoProfiles: databaseAccess.ifrDemoProfiles,
    ifrProductionProfiles: databaseAccess.ifrProductionProfiles,
    ifrEnterpriseProfiles: databaseAccess.ifrEnterpriseProfiles,
    ifrSharedApis: databaseAccess.ifrSharedApis,
    ifrContextApis: databaseAccess.ifrContextApis,
    ifrConfigurationApis: databaseAccess.ifrConfigurationApis,
    ifrExtensionPoints: databaseAccess.ifrExtensionPoints,
    ifrFrameworkMetrics: databaseAccess.ifrFrameworkMetrics,
    ifrFrameworkHealth: databaseAccess.ifrFrameworkHealth,
    ifrCompatibilityChecks: databaseAccess.ifrCompatibilityChecks,
    ifrFrameworkFailures: databaseAccess.ifrFrameworkFailures,
    ifrAuditLogs: databaseAccess.ifrAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for IFR");
