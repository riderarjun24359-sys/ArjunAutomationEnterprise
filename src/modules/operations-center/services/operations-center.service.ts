import {
    buildOperationsCenterLookupMaps,
    buildEocAuditPayload,
    buildEocDashboardStats,
    buildEocPipelineInfo,
    mapAuditEntry,
    buildOperationsCenterPayload,
    mapOperationsCenterSummary,
    buildOverallHealthPayload,
    mapOverallHealthSummary,
    buildModuleHealthPayload,
    mapModuleHealthSummary,
    buildDatabaseHealthPayload,
    mapDatabaseHealthSummary,
    buildJobSchedulerPayload,
    mapJobSchedulerSummary,
    buildRecurringJobPayload,
    mapRecurringJobSummary,
    buildJobRetryQueuePayload,
    mapJobRetryQueueSummary,
    buildJobDeadLetterPayload,
    mapJobDeadLetterSummary,
    buildPlatformEventPayload,
    mapPlatformEventSummary,
    buildBusinessEventPayload,
    mapBusinessEventSummary,
    buildEventSubscriptionPayload,
    mapEventSubscriptionSummary,
    buildEventReplayPayload,
    mapEventReplaySummary,
    buildAlertPayload,
    mapAlertSummary,
    buildEscalationRulePayload,
    mapEscalationRuleSummary,
    buildAlertAcknowledgementPayload,
    mapAlertAcknowledgementSummary,
    buildMaintenanceWindowPayload,
    mapMaintenanceWindowSummary,
    buildGlobalFlagPayload,
    mapGlobalFlagSummary,
    buildTenantFlagPayload,
    mapTenantFlagSummary,
    buildBetaFeaturePayload,
    mapBetaFeatureSummary,
    buildRolloutConfigPayload,
    mapRolloutConfigSummary,
    buildPlatformConfigPayload,
    mapPlatformConfigSummary,
    buildTenantConfigPayload,
    mapTenantConfigSummary,
    buildSecretsMetadataPayload,
    mapSecretsMetadataSummary,
    buildConfigVersionPayload,
    mapConfigVersionSummary,
    buildPlatformLogPayload,
    mapPlatformLogSummary,
    buildPlatformMetricPayload,
    mapPlatformMetricSummary,
    buildTraceSummaryPayload,
    mapTraceSummarySummary,
    buildServiceRegistryPayload,
    mapServiceRegistrySummary,
    buildOperationsMetricPayload,
    mapOperationsMetricSummary,
    buildOperationsHealthPayload,
    mapOperationsHealthSummary,
    buildOperationsFailurePayload,
    mapOperationsFailureSummary,
    mapOverallHealthForStats,
    mapJobSchedulerForStats,
    mapPlatformEventForStats,
    mapJobRetryQueueForStats,
    mapAlertForStats,
    mapModuleHealthForStats,
    mapOperationsHealthForStats,
    mapOperationsFailureForStats,
} from "@/src/modules/database/lib/operations-center-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    OperationsCenterSummary,
    CreateOperationsCenterInput,
    OverallHealthSummary,
    CreateOverallHealthInput,
    ModuleHealthSummary,
    CreateModuleHealthInput,
    DatabaseHealthSummary,
    CreateDatabaseHealthInput,
    JobSchedulerSummary,
    CreateJobSchedulerInput,
    RecurringJobSummary,
    CreateRecurringJobInput,
    JobRetryQueueSummary,
    CreateJobRetryQueueInput,
    JobDeadLetterSummary,
    CreateJobDeadLetterInput,
    PlatformEventSummary,
    CreatePlatformEventInput,
    BusinessEventSummary,
    CreateBusinessEventInput,
    EventSubscriptionSummary,
    CreateEventSubscriptionInput,
    EventReplaySummary,
    CreateEventReplayInput,
    AlertSummary,
    CreateAlertInput,
    EscalationRuleSummary,
    CreateEscalationRuleInput,
    AlertAcknowledgementSummary,
    CreateAlertAcknowledgementInput,
    MaintenanceWindowSummary,
    CreateMaintenanceWindowInput,
    GlobalFlagSummary,
    CreateGlobalFlagInput,
    TenantFlagSummary,
    CreateTenantFlagInput,
    BetaFeatureSummary,
    CreateBetaFeatureInput,
    RolloutConfigSummary,
    CreateRolloutConfigInput,
    PlatformConfigSummary,
    CreatePlatformConfigInput,
    TenantConfigSummary,
    CreateTenantConfigInput,
    SecretsMetadataSummary,
    CreateSecretsMetadataInput,
    ConfigVersionSummary,
    CreateConfigVersionInput,
    PlatformLogSummary,
    CreatePlatformLogInput,
    PlatformMetricSummary,
    CreatePlatformMetricInput,
    TraceSummarySummary,
    CreateTraceSummaryInput,
    ServiceRegistrySummary,
    CreateServiceRegistryInput,
    OperationsMetricSummary,
    CreateOperationsMetricInput,
    OperationsHealthSummary,
    CreateOperationsHealthInput,
    OperationsFailureSummary,
    CreateOperationsFailureInput,
    AuditEntry,
    EocDashboardStats,
    EocPipelineInfo,
    EocSdkPublishEventInput,
    EocSdkPublishEventResult,
    EocSdkScheduleJobInput,
    EocSdkScheduleJobResult,
    EocSdkTriggerAlertInput,
    EocSdkTriggerAlertResult,
} from "@/src/modules/operations-center/types";

export class OperationsCenterService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const integrationHubs = await databaseService.eocOperationsCenters.listByOrganization(organizationId);
        return buildOperationsCenterLookupMaps(integrationHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<EocDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildEocDashboardStats({ operationsCenters: [], overallHealth: [], jobSchedulers: [], platformEvents: [], jobRetryQueue: [], alerts: [], moduleHealth: [], operationsHealth: [], operationsFailures: [], auditLogs: [] });
        const [operationsCenters, overallHealthRaw, jobSchedulersRaw, platformEventsRaw, jobRetryQueueRaw, alertsRaw, moduleHealthRaw, operationsHealthRaw, operationsFailures, auditLogs] = await Promise.all([
            this.getOperationsCenters(authUserId, email, fullName),
            databaseService.eocOverallHealth.listByOrganization(context.organizationId),
            databaseService.eocJobSchedulers.listByOrganization(context.organizationId),
            databaseService.eocPlatformEvents.listByOrganization(context.organizationId),
            databaseService.eocJobRetryQueue.listByOrganization(context.organizationId),
            databaseService.eocAlerts.listByOrganization(context.organizationId),
            databaseService.eocModuleHealth.listByOrganization(context.organizationId),
            databaseService.eocOperationsHealth.listByOrganization(context.organizationId),
            this.getOperationsFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildEocDashboardStats({
            operationsCenters,
            overallHealth: overallHealthRaw.map(mapOverallHealthForStats),
            jobSchedulers: jobSchedulersRaw.map(mapJobSchedulerForStats),
            platformEvents: platformEventsRaw.map(mapPlatformEventForStats),
            jobRetryQueue: jobRetryQueueRaw.map(mapJobRetryQueueForStats),
            alerts: alertsRaw.map(mapAlertForStats),
            moduleHealth: moduleHealthRaw.map(mapModuleHealthForStats),
            operationsHealth: operationsHealthRaw.map(mapOperationsHealthForStats),
            operationsFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): EocPipelineInfo {
        return buildEocPipelineInfo();
    }

    async getOperationsCenters(authUserId: string, email: string, fullName?: string | null): Promise<OperationsCenterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocOperationsCenters.listByOrganization(context.organizationId)).map((r) => mapOperationsCenterSummary(r));
    }

    async createOperationsCenter(authUserId: string, email: string, input: CreateOperationsCenterInput, fullName?: string | null): Promise<OperationsCenterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocOperationsCenters.create(buildOperationsCenterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationsCenters");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "operations_centers", "create", `OperationsCenter created`, created.id));
        return mapOperationsCenterSummary(created);
    }

    async getOverallHealths(authUserId: string, email: string, fullName?: string | null): Promise<OverallHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocOverallHealth.listByOrganization(context.organizationId)).map((r) => mapOverallHealthSummary(r, maps));
    }

    async createOverallHealth(authUserId: string, email: string, input: CreateOverallHealthInput, fullName?: string | null): Promise<OverallHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocOverallHealth.create(buildOverallHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create overallHealth");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "overall_health", "create", `OverallHealth created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOverallHealthSummary(created, maps);
    }

    async getModuleHealths(authUserId: string, email: string, fullName?: string | null): Promise<ModuleHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocModuleHealth.listByOrganization(context.organizationId)).map((r) => mapModuleHealthSummary(r, maps));
    }

    async createModuleHealth(authUserId: string, email: string, input: CreateModuleHealthInput, fullName?: string | null): Promise<ModuleHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocModuleHealth.create(buildModuleHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create moduleHealth");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "module_health", "create", `ModuleHealth created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleHealthSummary(created, maps);
    }

    async getDatabaseHealths(authUserId: string, email: string, fullName?: string | null): Promise<DatabaseHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocDatabaseHealth.listByOrganization(context.organizationId)).map((r) => mapDatabaseHealthSummary(r, maps));
    }

    async createDatabaseHealth(authUserId: string, email: string, input: CreateDatabaseHealthInput, fullName?: string | null): Promise<DatabaseHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocDatabaseHealth.create(buildDatabaseHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create databaseHealth");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "database_health", "create", `DatabaseHealth created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDatabaseHealthSummary(created, maps);
    }

    async getJobSchedulers(authUserId: string, email: string, fullName?: string | null): Promise<JobSchedulerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocJobSchedulers.listByOrganization(context.organizationId)).map((r) => mapJobSchedulerSummary(r, maps));
    }

    async createJobScheduler(authUserId: string, email: string, input: CreateJobSchedulerInput, fullName?: string | null): Promise<JobSchedulerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocJobSchedulers.create(buildJobSchedulerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create jobSchedulers");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "job_schedulers", "create", `JobScheduler created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapJobSchedulerSummary(created, maps);
    }

    async getRecurringJobs(authUserId: string, email: string, fullName?: string | null): Promise<RecurringJobSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocRecurringJobs.listByOrganization(context.organizationId)).map((r) => mapRecurringJobSummary(r, maps));
    }

    async createRecurringJob(authUserId: string, email: string, input: CreateRecurringJobInput, fullName?: string | null): Promise<RecurringJobSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocRecurringJobs.create(buildRecurringJobPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create recurringJobs");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "recurring_jobs", "create", `RecurringJob created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRecurringJobSummary(created, maps);
    }

    async getJobRetryQueues(authUserId: string, email: string, fullName?: string | null): Promise<JobRetryQueueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocJobRetryQueue.listByOrganization(context.organizationId)).map((r) => mapJobRetryQueueSummary(r, maps));
    }

    async createJobRetryQueue(authUserId: string, email: string, input: CreateJobRetryQueueInput, fullName?: string | null): Promise<JobRetryQueueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocJobRetryQueue.create(buildJobRetryQueuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create jobRetryQueue");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "job_retry_queue", "create", `JobRetryQueue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapJobRetryQueueSummary(created, maps);
    }

    async getJobDeadLetters(authUserId: string, email: string, fullName?: string | null): Promise<JobDeadLetterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocJobDeadLetter.listByOrganization(context.organizationId)).map((r) => mapJobDeadLetterSummary(r, maps));
    }

    async createJobDeadLetter(authUserId: string, email: string, input: CreateJobDeadLetterInput, fullName?: string | null): Promise<JobDeadLetterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocJobDeadLetter.create(buildJobDeadLetterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create jobDeadLetter");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "job_dead_letter", "create", `JobDeadLetter created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapJobDeadLetterSummary(created, maps);
    }

    async getPlatformEvents(authUserId: string, email: string, fullName?: string | null): Promise<PlatformEventSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocPlatformEvents.listByOrganization(context.organizationId)).map((r) => mapPlatformEventSummary(r, maps));
    }

    async createPlatformEvent(authUserId: string, email: string, input: CreatePlatformEventInput, fullName?: string | null): Promise<PlatformEventSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocPlatformEvents.create(buildPlatformEventPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create platformEvents");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "platform_events", "create", `PlatformEvent created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlatformEventSummary(created, maps);
    }

    async getBusinessEvents(authUserId: string, email: string, fullName?: string | null): Promise<BusinessEventSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocBusinessEvents.listByOrganization(context.organizationId)).map((r) => mapBusinessEventSummary(r, maps));
    }

    async createBusinessEvent(authUserId: string, email: string, input: CreateBusinessEventInput, fullName?: string | null): Promise<BusinessEventSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocBusinessEvents.create(buildBusinessEventPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessEvents");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "business_events", "create", `BusinessEvent created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessEventSummary(created, maps);
    }

    async getEventSubscriptions(authUserId: string, email: string, fullName?: string | null): Promise<EventSubscriptionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocEventSubscriptions.listByOrganization(context.organizationId)).map((r) => mapEventSubscriptionSummary(r, maps));
    }

    async createEventSubscription(authUserId: string, email: string, input: CreateEventSubscriptionInput, fullName?: string | null): Promise<EventSubscriptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocEventSubscriptions.create(buildEventSubscriptionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create eventSubscriptions");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "event_subscriptions", "create", `EventSubscription created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEventSubscriptionSummary(created, maps);
    }

    async getEventReplays(authUserId: string, email: string, fullName?: string | null): Promise<EventReplaySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocEventReplays.listByOrganization(context.organizationId)).map((r) => mapEventReplaySummary(r, maps));
    }

    async createEventReplay(authUserId: string, email: string, input: CreateEventReplayInput, fullName?: string | null): Promise<EventReplaySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocEventReplays.create(buildEventReplayPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create eventReplays");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "event_replays", "create", `EventReplay created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEventReplaySummary(created, maps);
    }

    async getAlerts(authUserId: string, email: string, fullName?: string | null): Promise<AlertSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocAlerts.listByOrganization(context.organizationId)).map((r) => mapAlertSummary(r, maps));
    }

    async createAlert(authUserId: string, email: string, input: CreateAlertInput, fullName?: string | null): Promise<AlertSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocAlerts.create(buildAlertPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create alerts");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "alerts", "create", `Alert created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAlertSummary(created, maps);
    }

    async getEscalationRules(authUserId: string, email: string, fullName?: string | null): Promise<EscalationRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocEscalationRules.listByOrganization(context.organizationId)).map((r) => mapEscalationRuleSummary(r, maps));
    }

    async createEscalationRule(authUserId: string, email: string, input: CreateEscalationRuleInput, fullName?: string | null): Promise<EscalationRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocEscalationRules.create(buildEscalationRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create escalationRules");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "escalation_rules", "create", `EscalationRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEscalationRuleSummary(created, maps);
    }

    async getAlertAcknowledgements(authUserId: string, email: string, fullName?: string | null): Promise<AlertAcknowledgementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocAlertAcknowledgements.listByOrganization(context.organizationId)).map((r) => mapAlertAcknowledgementSummary(r, maps));
    }

    async createAlertAcknowledgement(authUserId: string, email: string, input: CreateAlertAcknowledgementInput, fullName?: string | null): Promise<AlertAcknowledgementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocAlertAcknowledgements.create(buildAlertAcknowledgementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create alertAcknowledgements");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "alert_acknowledgements", "create", `AlertAcknowledgement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAlertAcknowledgementSummary(created, maps);
    }

    async getMaintenanceWindows(authUserId: string, email: string, fullName?: string | null): Promise<MaintenanceWindowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocMaintenanceWindows.listByOrganization(context.organizationId)).map((r) => mapMaintenanceWindowSummary(r, maps));
    }

    async createMaintenanceWindow(authUserId: string, email: string, input: CreateMaintenanceWindowInput, fullName?: string | null): Promise<MaintenanceWindowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocMaintenanceWindows.create(buildMaintenanceWindowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create maintenanceWindows");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "maintenance_windows", "create", `MaintenanceWindow created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMaintenanceWindowSummary(created, maps);
    }

    async getGlobalFlags(authUserId: string, email: string, fullName?: string | null): Promise<GlobalFlagSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocGlobalFlags.listByOrganization(context.organizationId)).map((r) => mapGlobalFlagSummary(r, maps));
    }

    async createGlobalFlag(authUserId: string, email: string, input: CreateGlobalFlagInput, fullName?: string | null): Promise<GlobalFlagSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocGlobalFlags.create(buildGlobalFlagPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create globalFlags");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "global_flags", "create", `GlobalFlag created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGlobalFlagSummary(created, maps);
    }

    async getTenantFlags(authUserId: string, email: string, fullName?: string | null): Promise<TenantFlagSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocTenantFlags.listByOrganization(context.organizationId)).map((r) => mapTenantFlagSummary(r, maps));
    }

    async createTenantFlag(authUserId: string, email: string, input: CreateTenantFlagInput, fullName?: string | null): Promise<TenantFlagSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocTenantFlags.create(buildTenantFlagPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tenantFlags");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "tenant_flags", "create", `TenantFlag created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantFlagSummary(created, maps);
    }

    async getBetaFeatures(authUserId: string, email: string, fullName?: string | null): Promise<BetaFeatureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocBetaFeatures.listByOrganization(context.organizationId)).map((r) => mapBetaFeatureSummary(r, maps));
    }

    async createBetaFeature(authUserId: string, email: string, input: CreateBetaFeatureInput, fullName?: string | null): Promise<BetaFeatureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocBetaFeatures.create(buildBetaFeaturePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create betaFeatures");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "beta_features", "create", `BetaFeature created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBetaFeatureSummary(created, maps);
    }

    async getRolloutConfigs(authUserId: string, email: string, fullName?: string | null): Promise<RolloutConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocRolloutConfigs.listByOrganization(context.organizationId)).map((r) => mapRolloutConfigSummary(r, maps));
    }

    async createRolloutConfig(authUserId: string, email: string, input: CreateRolloutConfigInput, fullName?: string | null): Promise<RolloutConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocRolloutConfigs.create(buildRolloutConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rolloutConfigs");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "rollout_configs", "create", `RolloutConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRolloutConfigSummary(created, maps);
    }

    async getPlatformConfigs(authUserId: string, email: string, fullName?: string | null): Promise<PlatformConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocPlatformConfigs.listByOrganization(context.organizationId)).map((r) => mapPlatformConfigSummary(r, maps));
    }

    async createPlatformConfig(authUserId: string, email: string, input: CreatePlatformConfigInput, fullName?: string | null): Promise<PlatformConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocPlatformConfigs.create(buildPlatformConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create platformConfigs");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "platform_configs", "create", `PlatformConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlatformConfigSummary(created, maps);
    }

    async getTenantConfigs(authUserId: string, email: string, fullName?: string | null): Promise<TenantConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocTenantConfigs.listByOrganization(context.organizationId)).map((r) => mapTenantConfigSummary(r, maps));
    }

    async createTenantConfig(authUserId: string, email: string, input: CreateTenantConfigInput, fullName?: string | null): Promise<TenantConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocTenantConfigs.create(buildTenantConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tenantConfigs");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "tenant_configs", "create", `TenantConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantConfigSummary(created, maps);
    }

    async getSecretsMetadatas(authUserId: string, email: string, fullName?: string | null): Promise<SecretsMetadataSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocSecretsMetadata.listByOrganization(context.organizationId)).map((r) => mapSecretsMetadataSummary(r, maps));
    }

    async createSecretsMetadata(authUserId: string, email: string, input: CreateSecretsMetadataInput, fullName?: string | null): Promise<SecretsMetadataSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocSecretsMetadata.create(buildSecretsMetadataPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create secretsMetadata");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "secrets_metadata", "create", `SecretsMetadata created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSecretsMetadataSummary(created, maps);
    }

    async getConfigVersions(authUserId: string, email: string, fullName?: string | null): Promise<ConfigVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocConfigVersions.listByOrganization(context.organizationId)).map((r) => mapConfigVersionSummary(r, maps));
    }

    async createConfigVersion(authUserId: string, email: string, input: CreateConfigVersionInput, fullName?: string | null): Promise<ConfigVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocConfigVersions.create(buildConfigVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create configVersions");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "config_versions", "create", `ConfigVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapConfigVersionSummary(created, maps);
    }

    async getPlatformLogs(authUserId: string, email: string, fullName?: string | null): Promise<PlatformLogSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocPlatformLogs.listByOrganization(context.organizationId)).map((r) => mapPlatformLogSummary(r, maps));
    }

    async createPlatformLog(authUserId: string, email: string, input: CreatePlatformLogInput, fullName?: string | null): Promise<PlatformLogSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocPlatformLogs.create(buildPlatformLogPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create platformLogs");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "platform_logs", "create", `PlatformLog created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlatformLogSummary(created, maps);
    }

    async getPlatformMetrics(authUserId: string, email: string, fullName?: string | null): Promise<PlatformMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocPlatformMetrics.listByOrganization(context.organizationId)).map((r) => mapPlatformMetricSummary(r, maps));
    }

    async createPlatformMetric(authUserId: string, email: string, input: CreatePlatformMetricInput, fullName?: string | null): Promise<PlatformMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocPlatformMetrics.create(buildPlatformMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create platformMetrics");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "platform_metrics", "create", `PlatformMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlatformMetricSummary(created, maps);
    }

    async getTraceSummarys(authUserId: string, email: string, fullName?: string | null): Promise<TraceSummarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocTraceSummaries.listByOrganization(context.organizationId)).map((r) => mapTraceSummarySummary(r, maps));
    }

    async createTraceSummary(authUserId: string, email: string, input: CreateTraceSummaryInput, fullName?: string | null): Promise<TraceSummarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocTraceSummaries.create(buildTraceSummaryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create traceSummaries");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "trace_summaries", "create", `TraceSummary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTraceSummarySummary(created, maps);
    }

    async getServiceRegistrys(authUserId: string, email: string, fullName?: string | null): Promise<ServiceRegistrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocServiceRegistry.listByOrganization(context.organizationId)).map((r) => mapServiceRegistrySummary(r, maps));
    }

    async createServiceRegistry(authUserId: string, email: string, input: CreateServiceRegistryInput, fullName?: string | null): Promise<ServiceRegistrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocServiceRegistry.create(buildServiceRegistryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create serviceRegistry");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "service_registry", "create", `ServiceRegistry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapServiceRegistrySummary(created, maps);
    }

    async getOperationsMetrics(authUserId: string, email: string, fullName?: string | null): Promise<OperationsMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eocOperationsMetrics.listByOrganization(context.organizationId)).map((r) => mapOperationsMetricSummary(r));
    }

    async createOperationsMetric(authUserId: string, email: string, input: CreateOperationsMetricInput, fullName?: string | null): Promise<OperationsMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocOperationsMetrics.create(buildOperationsMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationsMetrics");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "operations_metrics", "create", `OperationsMetric created`, created.id));
        return mapOperationsMetricSummary(created);
    }

    async getOperationsHealths(authUserId: string, email: string, fullName?: string | null): Promise<OperationsHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eocOperationsHealth.listByOrganization(context.organizationId)).map((r) => mapOperationsHealthSummary(r));
    }

    async createOperationsHealth(authUserId: string, email: string, input: CreateOperationsHealthInput, fullName?: string | null): Promise<OperationsHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocOperationsHealth.create(buildOperationsHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationsHealth");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "operations_health", "create", `OperationsHealth created`, created.id));
        return mapOperationsHealthSummary(created);
    }

    async getOperationsFailures(authUserId: string, email: string, fullName?: string | null): Promise<OperationsFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.eocOperationsFailures.listByOrganization(context.organizationId)).map((r) => mapOperationsFailureSummary(r, maps));
    }

    async createOperationsFailure(authUserId: string, email: string, input: CreateOperationsFailureInput, fullName?: string | null): Promise<OperationsFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.eocOperationsFailures.create(buildOperationsFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationsFailures");
        await databaseService.eocAuditLogs.create(buildEocAuditPayload(context.organizationId, "operations_failures", "create", `OperationsFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOperationsFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eocAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getOperationsCenterOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.eocOperationsCenters.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.center_name }));
    }

    async sdkPublishEvent(authUserId: string, email: string, input: EocSdkPublishEventInput, fullName?: string | null): Promise<EocSdkPublishEventResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "publish_event", moduleSource: "enterprise_operations_center", inputPayload: { ...input } });
        const created = await this.createPlatformEvent(authUserId, email, { operationsCenterId: input.operationsCenterId, eventKey: input.eventKey, eventType: input.eventType }, fullName);
        return { eventId: created.id, eventKey: created.eventKey, eventStatus: created.eventStatus };
    }

    async sdkScheduleJob(authUserId: string, email: string, input: EocSdkScheduleJobInput, fullName?: string | null): Promise<EocSdkScheduleJobResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.schedulerName ?? "job", limit: 3 });
        const created = await this.createJobScheduler(authUserId, email, { operationsCenterId: input.operationsCenterId, schedulerKey: input.schedulerKey, schedulerName: input.schedulerName }, fullName);
        return { schedulerId: created.id, schedulerKey: created.schedulerKey, status: created.status };
    }

    async sdkTriggerAlert(authUserId: string, email: string, input: EocSdkTriggerAlertInput, fullName?: string | null): Promise<EocSdkTriggerAlertResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "trigger_alert", moduleSource: "enterprise_operations_center", inputPayload: { ...input } });
        const created = await this.createAlert(authUserId, email, { operationsCenterId: input.operationsCenterId, alertKey: input.alertKey, alertSeverity: input.alertSeverity }, fullName);
        return { alertId: created.id, alertKey: created.alertKey, status: created.status };
    }
}

export const operationsCenterService = new OperationsCenterService();
