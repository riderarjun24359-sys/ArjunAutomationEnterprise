#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-launch-readiness-ui.mjs");
const outPath = join(root, "scripts/generate-industry-framework-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
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
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/launch-readiness"\);/, 'const mod = join(root, "src/modules/industry-framework");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/readinessHubs/g, "frameworkHubs"],
    [/readinessHubOptions/g, "frameworkHubOptions"],
    [/getReadinessHubs/g, "getFrameworkHubs"],
    [/getReadinessHubOptions/g, "getFrameworkHubOptions"],
    [/ReadinessHubSelect/g, "FrameworkHubSelect"],
    [/buildReadinessHubLookupMaps/g, "buildFrameworkHubLookupMaps"],
    [/readinessHubId/g, "frameworkHubId"],
    [/Readiness Hubs/g, "Framework Hubs"],
    [/Readiness Hub/g, "Industry Framework"],
    [/readiness hub/g, "framework hub"],
    [/launch-readiness/g, "industry-framework"],
    [/launchReadiness/g, "industryFramework"],
    [/LaunchReadiness/g, "IndustryFramework"],
    [/Launch Readiness/g, "Industry Framework"],
    [/launch readiness/g, "industry framework"],
    [/databaseService\.elr/g, "databaseService.ifr"],
    [/buildElr/g, "buildIfr"],
    [/mapElr/g, "mapIfr"],
    [/ElrDashboardStats/g, "IfrDashboardStats"],
    [/ElrPipelineInfo/g, "IfrPipelineInfo"],
    [/ElrSdk/g, "IfrSdk"],
    [/ELR_TABS/g, "IFR_TABS"],
    [/ELR_THEME/g, "IFR_THEME"],
    [/ELR_PERMISSIONS/g, "IFR_PERMISSIONS"],
    [/ELR_STATUS_OPTIONS/g, "IFR_STATUS_OPTIONS"],
    [/Sprint 9/g, "Program B Sprint 1"],
    [/rose-600/g, "teal-600"],
    [/rose-500/g, "teal-500"],
    [/rose-400/g, "teal-400"],
    [/rose-300/g, "teal-300"],
    [/ring-rose/g, "ring-teal"],
    [/bg-rose/g, "bg-teal"],
    [/text-rose/g, "text-teal"],
    [/hover:bg-rose/g, "hover:bg-teal"],
    [/hover:border-rose/g, "hover:border-teal"],
    [/mapDeploymentPlanForStats/g, "mapDashboardTemplateForStats"],
    [/mapBackupPolicyForStats/g, "mapWorkflowTemplateForStats"],
    [/mapLaunchScoreMetricForStats/g, "mapFrameworkMetricForStats"],
    [/mapRecoveryDrillForStats/g, "mapIndustryProfileForStats"],
    [/mapLaunchBlockerForStats/g, "mapCompatibilityCheckForStats"],
    [/mapReadinessValidationForStats/g, "mapValidationRuleForStats"],
    [/mapLaunchHealthForStats/g, "mapFrameworkHealthForStats"],
    [/mapLaunchFailureForStats/g, "mapFrameworkFailureForStats"],
    [/deploymentPlans/g, "dashboardTemplates"],
    [/backupPolicies/g, "workflowTemplates"],
    [/launchScoreMetrics/g, "frameworkMetrics"],
    [/recoveryDrills/g, "industryProfiles"],
    [/launchBlockers/g, "compatibilityChecks"],
    [/readinessValidations/g, "validationRules"],
    [/launchHealth/g, "frameworkHealth"],
    [/launchFailures/g, "frameworkFailures"],
    [/totalReadinessHubs/g, "totalFrameworkHubs"],
    [/activeReadinessHubs/g, "activeFrameworkHubs"],
    [/deploymentPlanCount/g, "dashboardTemplateCount"],
    [/backupPolicyCount/g, "workflowTemplateCount"],
    [/recoveryDrillCount/g, "industryProfileCount"],
    [/openBlockerCount/g, "openCompatibilityCount"],
    [/overallLaunchScore/g, "overallFrameworkScore"],
    [/securityScore/g, "templateScore"],
    [/reliabilityScore/g, "profileScore"],
    [/performanceScore/g, "compatibilityScore"],
    [/documentationScore/g, "sdkScore"],
    [/operationalScore/g, "frameworkHealthScore"],
    [/sdkValidateEnvironment/g, "sdkRegisterIndustry"],
    [/sdkRunDeploymentCheck/g, "sdkConfigureTemplate"],
    [/sdkRunRecoveryDrill/g, "sdkRunCompatibilityCheck"],
    [/validateEnvironment/g, "registerIndustry"],
    [/runDeploymentCheck/g, "configureTemplate"],
    [/runRecoveryDrill/g, "runCompatibilityCheck"],
    [/ElrSdkValidateEnvironmentInput/g, "IfrSdkRegisterIndustryInput"],
    [/ElrSdkValidateEnvironmentResult/g, "IfrSdkRegisterIndustryResult"],
    [/ElrSdkRunDeploymentCheckInput/g, "IfrSdkConfigureTemplateInput"],
    [/ElrSdkRunDeploymentCheckResult/g, "IfrSdkConfigureTemplateResult"],
    [/ElrSdkRunRecoveryDrillInput/g, "IfrSdkRunCompatibilityCheckInput"],
    [/ElrSdkRunRecoveryDrillResult/g, "IfrSdkRunCompatibilityCheckResult"],
    [/createEnvironmentValidation/g, "createIndustryRegistration"],
    [/createDeploymentPlan/g, "createDashboardTemplate"],
    [/createRecoveryDrill/g, "createIndustryProfile"],
    [/Validate production environment/g, "Register industry profile"],
    [/Run deployment readiness check/g, "Configure industry template"],
    [/Run recovery drill/g, "Run compatibility check"],
    [/validations, deployments, recovery drills/g, "registrations, templates, compatibility checks"],
    [/Validations, deployments, recovery drills, and launch readiness outputs/g, "Registrations, templates, compatibility checks, and industry framework outputs"],
    [/Launch readiness pipeline/g, "Industry framework pipeline"],
    [/Generated launch readiness/g, "Generated industry framework"],
    [/Enterprise launch readiness platform: production validation, deployment readiness, backup and recovery, observability, security and compliance, documentation, launch scoring, and launch dashboard with security-first audit and the shared Launch Readiness SDK\./g,
        "Enterprise industry framework core: industry registry, profile engine, template engine, configuration engine, context engine, deployment profiles, industry SDK, and framework dashboard with security-first audit and the shared Industry Framework SDK."],
    [/environment validation, deployment check, and recovery drill/g, "industry registration, template configuration, and compatibility check"],
    [/validate_environment/g, "register_industry"],
    [/run_recovery_drill/g, "run_compatibility_check"],
    [/runDeploymentCheck/g, "configureTemplate"],
    [/validateEnvironment/g, "registerIndustry"],
    [/runRecoveryDrill/g, "runCompatibilityCheck"],
    [/"elr\.view"/g, '"ifr.view"'],
    [/"elr\.manage"/g, '"ifr.manage"'],
    [/"elr\.approve"/g, '"ifr.approve"'],
    [/"elr\.admin"/g, '"ifr.admin"'],
    [/launch_readiness/g, "industry_framework"],
    [/moduleSource: launch_readiness/g, "moduleSource: industry_framework"],
    [/deployment plans/g, "dashboard templates"],
    [/backup policies/g, "workflow templates"],
    [/recovery drills/g, "industry profiles"],
    [/open blockers/g, "open compatibility issues"],
    [/overall launch score/g, "overall framework score"],
    [/Launch Readiness summary/g, "Industry Framework summary"],
    [/Security-first launch readiness/g, "Security-first industry framework"],
    [/totalIndustryFrameworks/g, "totalFrameworkHubs"],
    [/activeIndustryFrameworks/g, "activeFrameworkHubs"],
    [/dashboardTemplatesCount/g, "dashboardTemplateCount"],
    [/ifrIndustryFrameworks/g, "ifrFrameworkHubs"],
    [/getLaunchFailures/g, "getFrameworkFailures"],
    [/launch-readiness-mappers/g, "industry-framework-mappers"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.ifrDeploymentPlans\.listByOrganization/g, "databaseService.ifrDashboardTemplates.listByOrganization");
s = s.replace(/databaseService\.ifrBackupPolicies\.listByOrganization/g, "databaseService.ifrWorkflowTemplates.listByOrganization");
s = s.replace(/databaseService\.ifrLaunchScoreMetrics\.listByOrganization/g, "databaseService.ifrFrameworkMetrics.listByOrganization");
s = s.replace(/databaseService\.ifrRecoveryDrills\.listByOrganization/g, "databaseService.ifrIndustryProfiles.listByOrganization");
s = s.replace(/databaseService\.ifrLaunchBlockers\.listByOrganization/g, "databaseService.ifrCompatibilityChecks.listByOrganization");
s = s.replace(/databaseService\.ifrReadinessValidations\.listByOrganization/g, "databaseService.ifrValidationRules.listByOrganization");
s = s.replace(/databaseService\.ifrLaunchHealth\.listByOrganization/g, "databaseService.ifrFrameworkHealth.listByOrganization");
s = s.replace(/databaseService\.ifrReadinessHubs\.listByOrganization/g, "databaseService.ifrFrameworkHubs.listByOrganization");

const ifrOptionsBlock = `export const RELEASE_CHANNEL_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const IFR_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const IFR_THEME)/,
    `$1${ifrOptionsBlock}$2`,
);

s = s.replace(
    /import \{ IFR_THEME, RELEASE_CHANNEL_OPTIONS, LOG_LEVEL_OPTIONS, ALERT_SEVERITY_OPTIONS \}/g,
    "import { IFR_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS }",
);

s = s.replace(/Select readiness hub/g, "Select framework hub");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-industry-framework-ui.mjs");
