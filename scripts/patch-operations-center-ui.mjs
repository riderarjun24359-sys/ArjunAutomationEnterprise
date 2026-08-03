#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-operations-center-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
    { tab: "operationsCenters", plural: "operationsCenters", singular: "OperationsCenter", pascal: "OperationsCenter", db: "eocOperationsCenters", hubField: false, fields: [{ name: "centerKey", type: "string" }, { name: "centerName", type: "string" }, { name: "environment", type: "string" }], display: { title: "centerName", sub: "centerKey" } },
    { tab: "overallHealth", plural: "overallHealth", singular: "OverallHealth", pascal: "OverallHealth", db: "eocOverallHealth", fields: [{ name: "healthKey", type: "string" }, { name: "healthType", type: "select", options: "HEALTH_TYPE_OPTIONS" }, { name: "healthScore", type: "number" }], display: { title: "healthKey", sub: "healthType" } },
    { tab: "moduleHealth", plural: "moduleHealth", singular: "ModuleHealth", pascal: "ModuleHealth", db: "eocModuleHealth", fields: [{ name: "healthKey", type: "string" }, { name: "moduleName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "moduleName", sub: "healthKey" } },
    { tab: "databaseHealth", plural: "databaseHealth", singular: "DatabaseHealth", pascal: "DatabaseHealth", db: "eocDatabaseHealth", fields: [{ name: "healthKey", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "healthKey", sub: "healthKey" } },
    { tab: "jobSchedulers", plural: "jobSchedulers", singular: "JobScheduler", pascal: "JobScheduler", db: "eocJobSchedulers", fields: [{ name: "schedulerKey", type: "string" }, { name: "schedulerName", type: "string" }, { name: "workerPoolSize", type: "number" }], display: { title: "schedulerName", sub: "schedulerKey" } },
    { tab: "recurringJobs", plural: "recurringJobs", singular: "RecurringJob", pascal: "RecurringJob", db: "eocRecurringJobs", fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "jobName", sub: "jobKey" } },
    { tab: "jobRetryQueue", plural: "jobRetryQueue", singular: "JobRetryQueue", pascal: "JobRetryQueue", db: "eocJobRetryQueue", fields: [{ name: "queueKey", type: "string" }, { name: "jobRef", type: "string" }, { name: "priority", type: "number" }], display: { title: "queueKey", sub: "jobRef" } },
    { tab: "jobDeadLetter", plural: "jobDeadLetter", singular: "JobDeadLetter", pascal: "JobDeadLetter", db: "eocJobDeadLetter", fields: [{ name: "deadLetterKey", type: "string" }, { name: "jobRef", type: "string" }, { name: "deadLetterStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "deadLetterKey", sub: "jobRef" } },
    { tab: "platformEvents", plural: "platformEvents", singular: "PlatformEvent", pascal: "PlatformEvent", db: "eocPlatformEvents", fields: [{ name: "eventKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "eventStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "eventKey", sub: "eventType" } },
    { tab: "businessEvents", plural: "businessEvents", singular: "BusinessEvent", pascal: "BusinessEvent", db: "eocBusinessEvents", fields: [{ name: "eventKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "eventStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "eventKey", sub: "eventType" } },
    { tab: "eventSubscriptions", plural: "eventSubscriptions", singular: "EventSubscription", pascal: "EventSubscription", db: "eocEventSubscriptions", fields: [{ name: "subscriptionKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }], display: { title: "subscriptionKey", sub: "eventType" } },
    { tab: "eventReplays", plural: "eventReplays", singular: "EventReplay", pascal: "EventReplay", db: "eocEventReplays", fields: [{ name: "replayKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "replayStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "replayKey", sub: "eventType" } },
    { tab: "alerts", plural: "alerts", singular: "Alert", pascal: "Alert", db: "eocAlerts", fields: [{ name: "alertKey", type: "string" }, { name: "alertSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }, { name: "alertStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "alertKey", sub: "alertSeverity" } },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: "eocEscalationRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "alertSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "ruleName", sub: "ruleKey" } },
    { tab: "alertAcknowledgements", plural: "alertAcknowledgements", singular: "AlertAcknowledgement", pascal: "AlertAcknowledgement", db: "eocAlertAcknowledgements", fields: [{ name: "ackKey", type: "string" }, { name: "ackStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "ackKey", sub: "ackKey" } },
    { tab: "maintenanceWindows", plural: "maintenanceWindows", singular: "MaintenanceWindow", pascal: "MaintenanceWindow", db: "eocMaintenanceWindows", fields: [{ name: "windowKey", type: "string" }, { name: "windowName", type: "string" }], display: { title: "windowName", sub: "windowKey" } },
    { tab: "globalFlags", plural: "globalFlags", singular: "GlobalFlag", pascal: "GlobalFlag", db: "eocGlobalFlags", fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "enabled", type: "boolean" }], display: { title: "flagName", sub: "flagKey" } },
    { tab: "tenantFlags", plural: "tenantFlags", singular: "TenantFlag", pascal: "TenantFlag", db: "eocTenantFlags", fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "enabled", type: "boolean" }], display: { title: "flagName", sub: "flagKey" } },
    { tab: "betaFeatures", plural: "betaFeatures", singular: "BetaFeature", pascal: "BetaFeature", db: "eocBetaFeatures", fields: [{ name: "featureKey", type: "string" }, { name: "featureName", type: "string" }], display: { title: "featureName", sub: "featureKey" } },
    { tab: "rolloutConfigs", plural: "rolloutConfigs", singular: "RolloutConfig", pascal: "RolloutConfig", db: "eocRolloutConfigs", fields: [{ name: "rolloutKey", type: "string" }, { name: "flagKey", type: "string" }, { name: "rolloutPercent", type: "number" }], display: { title: "rolloutKey", sub: "flagKey" } },
    { tab: "platformConfigs", plural: "platformConfigs", singular: "PlatformConfig", pascal: "PlatformConfig", db: "eocPlatformConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }], display: { title: "configName", sub: "configKey" } },
    { tab: "tenantConfigs", plural: "tenantConfigs", singular: "TenantConfig", pascal: "TenantConfig", db: "eocTenantConfigs", fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }], display: { title: "configName", sub: "configKey" } },
    { tab: "secretsMetadata", plural: "secretsMetadata", singular: "SecretsMetadata", pascal: "SecretsMetadata", db: "eocSecretsMetadata", fields: [{ name: "secretKey", type: "string" }, { name: "secretName", type: "string" }], display: { title: "secretName", sub: "secretKey" } },
    { tab: "configVersions", plural: "configVersions", singular: "ConfigVersion", pascal: "ConfigVersion", db: "eocConfigVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }], display: { title: "versionNumber", sub: "versionKey" } },
    { tab: "platformLogs", plural: "platformLogs", singular: "PlatformLog", pascal: "PlatformLog", db: "eocPlatformLogs", fields: [{ name: "logKey", type: "string" }, { name: "logLevel", type: "select", options: "LOG_LEVEL_OPTIONS" }], display: { title: "logKey", sub: "logLevel" } },
    { tab: "platformMetrics", plural: "platformMetrics", singular: "PlatformMetric", pascal: "PlatformMetric", db: "eocPlatformMetrics", fields: [{ name: "metricsKey", type: "string" }, { name: "dependencyHealth", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" } },
    { tab: "traceSummaries", plural: "traceSummaries", singular: "TraceSummary", pascal: "TraceSummary", db: "eocTraceSummaries", fields: [{ name: "traceKey", type: "string" }, { name: "spanCount", type: "number" }], display: { title: "traceKey", sub: "traceKey" } },
    { tab: "serviceRegistry", plural: "serviceRegistry", singular: "ServiceRegistry", pascal: "ServiceRegistry", db: "eocServiceRegistry", fields: [{ name: "serviceKey", type: "string" }, { name: "serviceName", type: "string" }, { name: "cacheStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "serviceName", sub: "serviceKey" } },
    { tab: "operationsMetrics", plural: "operationsMetrics", singular: "OperationsMetric", pascal: "OperationsMetric", db: "eocOperationsMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "operationalScore", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" } },
    { tab: "operationsHealth", plural: "operationsHealth", singular: "OperationsHealth", pascal: "OperationsHealth", db: "eocOperationsHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "healthKey" } },
    { tab: "operationsFailures", plural: "operationsFailures", singular: "OperationsFailure", pascal: "OperationsFailure", db: "eocOperationsFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/integration-platform"\);/, 'const mod = join(root, "src/modules/operations-center");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/integration-platform/g, "operations-center"],
    [/IntegrationPlatform/g, "OperationsCenter"],
    [/integrationPlatform/g, "operationsCenter"],
    [/intgIntegrationHubs/g, "eocOperationsCenters"],
    [/intgAuditLogs/g, "eocAuditLogs"],
    [/databaseService\.intg/g, "databaseService.eoc"],
    [/buildIntegrationHubLookupMaps/g, "buildOperationsCenterLookupMaps"],
    [/buildIntg/g, "buildEoc"],
    [/mapIntg/g, "mapEoc"],
    [/IntgDashboardStats/g, "EocDashboardStats"],
    [/IntgPipelineInfo/g, "EocPipelineInfo"],
    [/IntgSdk/g, "EocSdk"],
    [/INTG_TABS/g, "EOC_TABS"],
    [/INTG_THEME/g, "EOC_THEME"],
    [/INTG_PERMISSIONS/g, "EOC_PERMISSIONS"],
    [/INTG_STATUS_OPTIONS/g, "EOC_STATUS_OPTIONS"],
    [/integrationHubId/g, "operationsCenterId"],
    [/integrationHubOptions/g, "operationsCenterOptions"],
    [/IntegrationHubSelect/g, "OperationsCenterSelect"],
    [/getIntegrationHubs/g, "getOperationsCenters"],
    [/getIntegrationHubOptions/g, "getOperationsCenterOptions"],
    [/Integration Hubs/g, "Operations Centers"],
    [/Integration Hub/g, "Operations Center"],
    [/integration hub/g, "operations center"],
    [/Integration Platform/g, "Operations Center"],
    [/integration platform/g, "operations center"],
    [/integration_hub/g, "operations_center"],
    [/integration_platform/g, "operations_center"],
    [/hubName/g, "centerName"],
    [/hubOpts/g, "centerOpts"],
    [/Sprint 6/g, "Sprint 7"],
    [/indigo-600/g, "emerald-600"],
    [/indigo-500/g, "emerald-500"],
    [/indigo-400/g, "emerald-400"],
    [/indigo-300/g, "emerald-300"],
    [/ring-indigo/g, "ring-emerald"],
    [/bg-indigo/g, "bg-emerald"],
    [/text-indigo/g, "text-emerald"],
    [/hover:bg-indigo/g, "hover:bg-emerald"],
    [/hover:border-indigo/g, "hover:border-emerald"],
    [/PROVIDER_TYPE_OPTIONS/g, "HEALTH_TYPE_OPTIONS"],
    [/CONNECTOR_STATUS_OPTIONS/g, "JOB_STATUS_OPTIONS"],
    [/API_STATUS_OPTIONS/g, "JOB_STATUS_OPTIONS"],
    [/API_VERSION_OPTIONS/g, "LOG_LEVEL_OPTIONS"],
    [/mapConnectedServiceForStats/g, "mapOverallHealthForStats"],
    [/mapPaymentConnectorForStats/g, "mapJobSchedulerForStats"],
    [/mapAccountingConnectorForStats/g, "mapPlatformEventForStats"],
    [/mapPaymentRetryQueueForStats/g, "mapJobRetryQueueForStats"],
    [/mapPaymentTransactionForStats/g, "mapAlertForStats"],
    [/mapConnectorHealthForStats/g, "mapModuleHealthForStats"],
    [/mapIntegrationHealthForStats/g, "mapOperationsHealthForStats"],
    [/mapIntegrationFailureForStats/g, "mapOperationsFailureForStats"],
    [/connectedServices/g, "overallHealth"],
    [/paymentConnectors/g, "jobSchedulers"],
    [/accountingConnectors/g, "platformEvents"],
    [/paymentRetryQueue/g, "jobRetryQueue"],
    [/paymentTransactions/g, "alerts"],
    [/connectorHealth/g, "moduleHealth"],
    [/integrationHealth/g, "operationsHealth"],
    [/integrationFailures/g, "operationsFailures"],
    [/totalIntegrationHubs/g, "totalOperationsCenters"],
    [/activeIntegrationHubs/g, "activeOperationsCenters"],
    [/connectedServiceCount/g, "overallHealthCount"],
    [/activeConnectorCount/g, "activeJobCount"],
    [/pendingRetryCount/g, "pendingRetryCount"],
    [/failedTransactionCount/g, "openAlertCount"],
    [/sdkConnectService/g, "sdkPublishEvent"],
    [/sdkIssueApiKey/g, "sdkScheduleJob"],
    [/sdkRegisterWebhook/g, "sdkTriggerAlert"],
    [/connectService/g, "publishEvent"],
    [/issueApiKey/g, "scheduleJob"],
    [/registerWebhook/g, "triggerAlert"],
    [/IntgSdkConnectServiceInput/g, "EocSdkPublishEventInput"],
    [/IntgSdkConnectServiceResult/g, "EocSdkPublishEventResult"],
    [/IntgSdkIssueApiKeyInput/g, "EocSdkScheduleJobInput"],
    [/IntgSdkIssueApiKeyResult/g, "EocSdkScheduleJobResult"],
    [/IntgSdkRegisterWebhookInput/g, "EocSdkTriggerAlertInput"],
    [/IntgSdkRegisterWebhookResult/g, "EocSdkTriggerAlertResult"],
    [/createConnectedService/g, "createPlatformEvent"],
    [/createApiKey/g, "createJobScheduler"],
    [/createOutgoingWebhook/g, "createAlert"],
    [/Connect external service/g, "Publish platform event"],
    [/Issue API key/g, "Schedule background job"],
    [/Register outgoing webhook/g, "Trigger operational alert"],
    [/connectors, API keys, webhooks/g, "jobs, events, alerts"],
    [/Connector, API, webhook, and marketplace/g, "Jobs, events, alerts, and configuration"],
    [/Integration pipeline/g, "Operations pipeline"],
    [/integration operations/g, "operations center"],
    [/INTG_TABS count/g, "EOC_TABS count"],
    [/Generated integration platform/g, "Generated operations center"],
];

for (const [from, to] of reps) s = s.replace(from, to);

// Fix constants block options
s = s.replace(
    /export const HEALTH_TYPE_OPTIONS = \[[\s\S]*?\] as const;\n\nexport const JOB_STATUS_OPTIONS = \[[\s\S]*?\] as const;\n\nexport const JOB_STATUS_OPTIONS = \[[\s\S]*?\] as const;\n\nexport const LOG_LEVEL_OPTIONS = \[[\s\S]*?\] as const;\n\nexport const EOC_STATUS_OPTIONS = \[[\s\S]*?\] as const;\n\nexport const EOC_PERMISSIONS = \["intg\.view"/,
    `export const HEALTH_TYPE_OPTIONS = [
    { value: "overall", label: "Overall" },
    { value: "module", label: "Module" },
    { value: "database", label: "Database" },
    { value: "queue", label: "Queue" },
    { value: "storage", label: "Storage" },
    { value: "ai", label: "AI" },
    { value: "api", label: "API" },
    { value: "integration", label: "Integration" },
] as const;

export const JOB_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "healthy", label: "Healthy" },
] as const;

export const EVENT_TYPE_OPTIONS = [
    { value: "platform", label: "Platform" },
    { value: "business", label: "Business" },
    { value: "ai", label: "AI" },
    { value: "customer", label: "Customer" },
    { value: "audit", label: "Audit" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const LOG_LEVEL_OPTIONS = [
    { value: "debug", label: "Debug" },
    { value: "info", label: "Info" },
    { value: "warn", label: "Warn" },
    { value: "error", label: "Error" },
] as const;

export const EOC_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
] as const;

export const EOC_PERMISSIONS = ["eoc.view"`
);

s = s.replace(/"intg\.manage"/g, '"eoc.manage"').replace(/"intg\.approve"/g, '"eoc.approve"').replace(/"intg\.admin"/g, '"eoc.admin"');

// Fix overview stats card text
s = s.replace(/Connected services, payment & accounting connectors, public API, webhooks, marketplace, analytics, and ops dashboard/g,
    "System health, background jobs, event bus, alerts, feature flags, configuration, diagnostics, and operations dashboard");
s = s.replace(/active connectors/g, "active jobs");
s = s.replace(/pending retries • \$\{data\.stats\?\.openAlertCount/g, "pending retries • ${data.stats?.openAlertCount");
s = s.replace(/Enterprise Operations Center summary/g, "Enterprise Operations Center summary");

writeFileSync(genPath, s, "utf8");
console.log("Patched generate-operations-center-ui.mjs");
