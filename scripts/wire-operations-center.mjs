#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

// Wire data-access.ts
const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("EocOperationsCenterRepository")) {
    const intgImportEnd = da.indexOf("} from \"@/src/modules/database/repositories/integration-platform-repositories\";");
    const eocImport = `import {
    EocOperationsCenterRepository,
    EocOverallHealthRepository,
    EocModuleHealthRepository,
    EocDatabaseHealthRepository,
    EocJobSchedulerRepository,
    EocRecurringJobRepository,
    EocJobRetryQueueRepository,
    EocJobDeadLetterRepository,
    EocPlatformEventRepository,
    EocBusinessEventRepository,
    EocEventSubscriptionRepository,
    EocEventReplayRepository,
    EocAlertRepository,
    EocEscalationRuleRepository,
    EocAlertAcknowledgementRepository,
    EocMaintenanceWindowRepository,
    EocGlobalFlagRepository,
    EocTenantFlagRepository,
    EocBetaFeatureRepository,
    EocRolloutConfigRepository,
    EocPlatformConfigRepository,
    EocTenantConfigRepository,
    EocSecretsMetadataRepository,
    EocConfigVersionRepository,
    EocPlatformLogRepository,
    EocPlatformMetricRepository,
    EocTraceSummaryRepository,
    EocServiceRegistryRepository,
    EocOperationsMetricRepository,
    EocOperationsHealthRepository,
    EocOperationsFailureRepository,
    EocAuditLogRepository,
} from "@/src/modules/database/repositories/operations-center-repositories";\n`;
    da = da.slice(0, intgImportEnd) + eocImport + da.slice(intgImportEnd);

    const intgProp = "    readonly intgAuditLogs: IntgAuditLogRepository;";
    const eocProps = `    readonly eocOperationsCenters: EocOperationsCenterRepository;
    readonly eocOverallHealth: EocOverallHealthRepository;
    readonly eocModuleHealth: EocModuleHealthRepository;
    readonly eocDatabaseHealth: EocDatabaseHealthRepository;
    readonly eocJobSchedulers: EocJobSchedulerRepository;
    readonly eocRecurringJobs: EocRecurringJobRepository;
    readonly eocJobRetryQueue: EocJobRetryQueueRepository;
    readonly eocJobDeadLetter: EocJobDeadLetterRepository;
    readonly eocPlatformEvents: EocPlatformEventRepository;
    readonly eocBusinessEvents: EocBusinessEventRepository;
    readonly eocEventSubscriptions: EocEventSubscriptionRepository;
    readonly eocEventReplays: EocEventReplayRepository;
    readonly eocAlerts: EocAlertRepository;
    readonly eocEscalationRules: EocEscalationRuleRepository;
    readonly eocAlertAcknowledgements: EocAlertAcknowledgementRepository;
    readonly eocMaintenanceWindows: EocMaintenanceWindowRepository;
    readonly eocGlobalFlags: EocGlobalFlagRepository;
    readonly eocTenantFlags: EocTenantFlagRepository;
    readonly eocBetaFeatures: EocBetaFeatureRepository;
    readonly eocRolloutConfigs: EocRolloutConfigRepository;
    readonly eocPlatformConfigs: EocPlatformConfigRepository;
    readonly eocTenantConfigs: EocTenantConfigRepository;
    readonly eocSecretsMetadata: EocSecretsMetadataRepository;
    readonly eocConfigVersions: EocConfigVersionRepository;
    readonly eocPlatformLogs: EocPlatformLogRepository;
    readonly eocPlatformMetrics: EocPlatformMetricRepository;
    readonly eocTraceSummaries: EocTraceSummaryRepository;
    readonly eocServiceRegistry: EocServiceRegistryRepository;
    readonly eocOperationsMetrics: EocOperationsMetricRepository;
    readonly eocOperationsHealth: EocOperationsHealthRepository;
    readonly eocOperationsFailures: EocOperationsFailureRepository;
    readonly eocAuditLogs: EocAuditLogRepository;`;
    da = da.replace(intgProp, intgProp + "\n" + eocProps);

    const intgCtor = "        this.intgAuditLogs = new IntgAuditLogRepository();";
    const eocCtor = `        this.eocOperationsCenters = new EocOperationsCenterRepository();
        this.eocOverallHealth = new EocOverallHealthRepository();
        this.eocModuleHealth = new EocModuleHealthRepository();
        this.eocDatabaseHealth = new EocDatabaseHealthRepository();
        this.eocJobSchedulers = new EocJobSchedulerRepository();
        this.eocRecurringJobs = new EocRecurringJobRepository();
        this.eocJobRetryQueue = new EocJobRetryQueueRepository();
        this.eocJobDeadLetter = new EocJobDeadLetterRepository();
        this.eocPlatformEvents = new EocPlatformEventRepository();
        this.eocBusinessEvents = new EocBusinessEventRepository();
        this.eocEventSubscriptions = new EocEventSubscriptionRepository();
        this.eocEventReplays = new EocEventReplayRepository();
        this.eocAlerts = new EocAlertRepository();
        this.eocEscalationRules = new EocEscalationRuleRepository();
        this.eocAlertAcknowledgements = new EocAlertAcknowledgementRepository();
        this.eocMaintenanceWindows = new EocMaintenanceWindowRepository();
        this.eocGlobalFlags = new EocGlobalFlagRepository();
        this.eocTenantFlags = new EocTenantFlagRepository();
        this.eocBetaFeatures = new EocBetaFeatureRepository();
        this.eocRolloutConfigs = new EocRolloutConfigRepository();
        this.eocPlatformConfigs = new EocPlatformConfigRepository();
        this.eocTenantConfigs = new EocTenantConfigRepository();
        this.eocSecretsMetadata = new EocSecretsMetadataRepository();
        this.eocConfigVersions = new EocConfigVersionRepository();
        this.eocPlatformLogs = new EocPlatformLogRepository();
        this.eocPlatformMetrics = new EocPlatformMetricRepository();
        this.eocTraceSummaries = new EocTraceSummaryRepository();
        this.eocServiceRegistry = new EocServiceRegistryRepository();
        this.eocOperationsMetrics = new EocOperationsMetricRepository();
        this.eocOperationsHealth = new EocOperationsHealthRepository();
        this.eocOperationsFailures = new EocOperationsFailureRepository();
        this.eocAuditLogs = new EocAuditLogRepository();`;
    da = da.replace(intgCtor, intgCtor + "\n" + eocCtor);

    writeFileSync(daPath, da, "utf8");
}

// Wire database-service.ts
const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("eocOperationsCenters")) {
    ds = ds.replace(
        "    intgAuditLogs: databaseAccess.intgAuditLogs,",
        `    intgAuditLogs: databaseAccess.intgAuditLogs,
    eocOperationsCenters: databaseAccess.eocOperationsCenters,
    eocOverallHealth: databaseAccess.eocOverallHealth,
    eocModuleHealth: databaseAccess.eocModuleHealth,
    eocDatabaseHealth: databaseAccess.eocDatabaseHealth,
    eocJobSchedulers: databaseAccess.eocJobSchedulers,
    eocRecurringJobs: databaseAccess.eocRecurringJobs,
    eocJobRetryQueue: databaseAccess.eocJobRetryQueue,
    eocJobDeadLetter: databaseAccess.eocJobDeadLetter,
    eocPlatformEvents: databaseAccess.eocPlatformEvents,
    eocBusinessEvents: databaseAccess.eocBusinessEvents,
    eocEventSubscriptions: databaseAccess.eocEventSubscriptions,
    eocEventReplays: databaseAccess.eocEventReplays,
    eocAlerts: databaseAccess.eocAlerts,
    eocEscalationRules: databaseAccess.eocEscalationRules,
    eocAlertAcknowledgements: databaseAccess.eocAlertAcknowledgements,
    eocMaintenanceWindows: databaseAccess.eocMaintenanceWindows,
    eocGlobalFlags: databaseAccess.eocGlobalFlags,
    eocTenantFlags: databaseAccess.eocTenantFlags,
    eocBetaFeatures: databaseAccess.eocBetaFeatures,
    eocRolloutConfigs: databaseAccess.eocRolloutConfigs,
    eocPlatformConfigs: databaseAccess.eocPlatformConfigs,
    eocTenantConfigs: databaseAccess.eocTenantConfigs,
    eocSecretsMetadata: databaseAccess.eocSecretsMetadata,
    eocConfigVersions: databaseAccess.eocConfigVersions,
    eocPlatformLogs: databaseAccess.eocPlatformLogs,
    eocPlatformMetrics: databaseAccess.eocPlatformMetrics,
    eocTraceSummaries: databaseAccess.eocTraceSummaries,
    eocServiceRegistry: databaseAccess.eocServiceRegistry,
    eocOperationsMetrics: databaseAccess.eocOperationsMetrics,
    eocOperationsHealth: databaseAccess.eocOperationsHealth,
    eocOperationsFailures: databaseAccess.eocOperationsFailures,
    eocAuditLogs: databaseAccess.eocAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for EOC");
