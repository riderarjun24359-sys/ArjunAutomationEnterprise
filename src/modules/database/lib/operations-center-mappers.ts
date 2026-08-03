import type { DbEocOperationsCenter,
    DbEocOverallHealth,
    DbEocModuleHealth,
    DbEocDatabaseHealth,
    DbEocJobScheduler,
    DbEocRecurringJob,
    DbEocJobRetryQueue,
    DbEocJobDeadLetter,
    DbEocPlatformEvent,
    DbEocBusinessEvent,
    DbEocEventSubscription,
    DbEocEventReplay,
    DbEocAlert,
    DbEocEscalationRule,
    DbEocAlertAcknowledgement,
    DbEocMaintenanceWindow,
    DbEocGlobalFlag,
    DbEocTenantFlag,
    DbEocBetaFeature,
    DbEocRolloutConfig,
    DbEocPlatformConfig,
    DbEocTenantConfig,
    DbEocSecretsMetadata,
    DbEocConfigVersion,
    DbEocPlatformLog,
    DbEocPlatformMetric,
    DbEocTraceSummary,
    DbEocServiceRegistry,
    DbEocOperationsMetric,
    DbEocOperationsHealth,
    DbEocOperationsFailure,
    DbEocAuditLog } from "@/src/modules/database/types/platform";
import type { CreateOperationsCenterInput,
    OperationsCenterSummary,
    CreateOverallHealthInput,
    OverallHealthSummary,
    CreateModuleHealthInput,
    ModuleHealthSummary,
    CreateDatabaseHealthInput,
    DatabaseHealthSummary,
    CreateJobSchedulerInput,
    JobSchedulerSummary,
    CreateRecurringJobInput,
    RecurringJobSummary,
    CreateJobRetryQueueInput,
    JobRetryQueueSummary,
    CreateJobDeadLetterInput,
    JobDeadLetterSummary,
    CreatePlatformEventInput,
    PlatformEventSummary,
    CreateBusinessEventInput,
    BusinessEventSummary,
    CreateEventSubscriptionInput,
    EventSubscriptionSummary,
    CreateEventReplayInput,
    EventReplaySummary,
    CreateAlertInput,
    AlertSummary,
    CreateEscalationRuleInput,
    EscalationRuleSummary,
    CreateAlertAcknowledgementInput,
    AlertAcknowledgementSummary,
    CreateMaintenanceWindowInput,
    MaintenanceWindowSummary,
    CreateGlobalFlagInput,
    GlobalFlagSummary,
    CreateTenantFlagInput,
    TenantFlagSummary,
    CreateBetaFeatureInput,
    BetaFeatureSummary,
    CreateRolloutConfigInput,
    RolloutConfigSummary,
    CreatePlatformConfigInput,
    PlatformConfigSummary,
    CreateTenantConfigInput,
    TenantConfigSummary,
    CreateSecretsMetadataInput,
    SecretsMetadataSummary,
    CreateConfigVersionInput,
    ConfigVersionSummary,
    CreatePlatformLogInput,
    PlatformLogSummary,
    CreatePlatformMetricInput,
    PlatformMetricSummary,
    CreateTraceSummaryInput,
    TraceSummarySummary,
    CreateServiceRegistryInput,
    ServiceRegistrySummary,
    CreateOperationsMetricInput,
    OperationsMetricSummary,
    CreateOperationsHealthInput,
    OperationsHealthSummary,
    CreateOperationsFailureInput,
    OperationsFailureSummary,
    EocDashboardStats,
    EocPipelineInfo,
    AuditEntry } from "@/src/modules/operations-center/types";

export function buildOperationsCenterLookupMaps(centers: DbEocOperationsCenter[]) {
    const centerNameById = new Map(centers.map((c) => [c.id, c.center_name]));
    return { centerNameById };
}

export function buildEocPipelineInfo(): EocPipelineInfo {
    const stages = [
        { key: "monitoring", label: "Monitoring" },
        { key: "healthy", label: "Healthy" },
        { key: "degraded", label: "Degraded" },
        { key: "critical", label: "Critical" },
    ];
    return { stages, currentStage: "healthy", nextStage: "degraded", previousStage: "monitoring" };
}

export function buildEocAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbEocAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapOperationsCenterSummary(record: DbEocOperationsCenter): OperationsCenterSummary {
    return {
        id: record.id,
        centerKey: record.center_key,
        centerName: record.center_name,
        environment: record.environment,
        status: record.status,
    };
}

export function buildOperationsCenterPayload(organizationId: string, input: CreateOperationsCenterInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_key: input.centerKey ?? '',
        center_name: input.centerName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapOverallHealthSummary(record: DbEocOverallHealth, maps?: { centerNameById: Map<string, string> }): OverallHealthSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        healthKey: record.health_key as string,
        healthType: record.health_type as string,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildOverallHealthPayload(organizationId: string, input: CreateOverallHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        health_key: input.healthKey ?? '',
        health_type: input.healthType ?? '',
        health_score: input.healthScore ?? 100,
        status: "active",
    };
}

export function mapModuleHealthSummary(record: DbEocModuleHealth, maps?: { centerNameById: Map<string, string> }): ModuleHealthSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        healthKey: record.health_key as string,
        moduleName: record.module_name as string,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildModuleHealthPayload(organizationId: string, input: CreateModuleHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        health_key: input.healthKey ?? '',
        module_name: input.moduleName ?? '',
        health_score: input.healthScore ?? 100,
        status: "active",
    };
}

export function mapDatabaseHealthSummary(record: DbEocDatabaseHealth, maps?: { centerNameById: Map<string, string> }): DatabaseHealthSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        healthKey: record.health_key as string,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildDatabaseHealthPayload(organizationId: string, input: CreateDatabaseHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        health_key: input.healthKey ?? '',
        health_score: input.healthScore ?? 100,
        status: "active",
    };
}

export function mapJobSchedulerSummary(record: DbEocJobScheduler, maps?: { centerNameById: Map<string, string> }): JobSchedulerSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        schedulerKey: record.scheduler_key as string,
        schedulerName: record.scheduler_name as string,
        workerPoolSize: record.worker_pool_size as number,
        status: record.status,
    };
}

export function buildJobSchedulerPayload(organizationId: string, input: CreateJobSchedulerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        scheduler_key: input.schedulerKey ?? '',
        scheduler_name: input.schedulerName ?? '',
        worker_pool_size: input.workerPoolSize ?? 0,
        status: "active",
    };
}

export function mapRecurringJobSummary(record: DbEocRecurringJob, maps?: { centerNameById: Map<string, string> }): RecurringJobSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        jobKey: record.job_key as string,
        jobName: record.job_name as string,
        jobStatus: record.job_status as string,
        status: record.status,
    };
}

export function buildRecurringJobPayload(organizationId: string, input: CreateRecurringJobInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        job_key: input.jobKey ?? '',
        job_name: input.jobName ?? '',
        job_status: input.jobStatus ?? '',
        status: "active",
    };
}

export function mapJobRetryQueueSummary(record: DbEocJobRetryQueue, maps?: { centerNameById: Map<string, string> }): JobRetryQueueSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        queueKey: record.queue_key as string,
        jobRef: record.job_ref as string,
        priority: record.priority as number,
        status: record.status,
    };
}

export function buildJobRetryQueuePayload(organizationId: string, input: CreateJobRetryQueueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        queue_key: input.queueKey ?? '',
        job_ref: input.jobRef ?? '',
        priority: input.priority ?? '',
        status: "active",
    };
}

export function mapJobDeadLetterSummary(record: DbEocJobDeadLetter, maps?: { centerNameById: Map<string, string> }): JobDeadLetterSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        deadLetterKey: record.dead_letter_key as string,
        jobRef: record.job_ref as string,
        deadLetterStatus: record.dead_letter_status as string,
        status: record.status,
    };
}

export function buildJobDeadLetterPayload(organizationId: string, input: CreateJobDeadLetterInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        dead_letter_key: input.deadLetterKey ?? '',
        job_ref: input.jobRef ?? '',
        dead_letter_status: input.deadLetterStatus ?? '',
        status: "active",
    };
}

export function mapPlatformEventSummary(record: DbEocPlatformEvent, maps?: { centerNameById: Map<string, string> }): PlatformEventSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        eventKey: record.event_key as string,
        eventType: record.event_type as string,
        eventStatus: record.event_status as string,
        status: record.status,
    };
}

export function buildPlatformEventPayload(organizationId: string, input: CreatePlatformEventInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        event_key: input.eventKey ?? '',
        event_type: input.eventType ?? '',
        event_status: input.eventStatus ?? '',
        status: "active",
    };
}

export function mapBusinessEventSummary(record: DbEocBusinessEvent, maps?: { centerNameById: Map<string, string> }): BusinessEventSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        eventKey: record.event_key as string,
        eventType: record.event_type as string,
        eventStatus: record.event_status as string,
        status: record.status,
    };
}

export function buildBusinessEventPayload(organizationId: string, input: CreateBusinessEventInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        event_key: input.eventKey ?? '',
        event_type: input.eventType ?? '',
        event_status: input.eventStatus ?? '',
        status: "active",
    };
}

export function mapEventSubscriptionSummary(record: DbEocEventSubscription, maps?: { centerNameById: Map<string, string> }): EventSubscriptionSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        subscriptionKey: record.subscription_key as string,
        eventType: record.event_type as string,
        status: record.status,
    };
}

export function buildEventSubscriptionPayload(organizationId: string, input: CreateEventSubscriptionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        subscription_key: input.subscriptionKey ?? '',
        event_type: input.eventType ?? '',
        status: "active",
    };
}

export function mapEventReplaySummary(record: DbEocEventReplay, maps?: { centerNameById: Map<string, string> }): EventReplaySummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        replayKey: record.replay_key as string,
        eventType: record.event_type as string,
        replayStatus: record.replay_status as string,
        status: record.status,
    };
}

export function buildEventReplayPayload(organizationId: string, input: CreateEventReplayInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        replay_key: input.replayKey ?? '',
        event_type: input.eventType ?? '',
        replay_status: input.replayStatus ?? '',
        status: "active",
    };
}

export function mapAlertSummary(record: DbEocAlert, maps?: { centerNameById: Map<string, string> }): AlertSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        alertKey: record.alert_key as string,
        alertSeverity: record.alert_severity as string,
        alertStatus: record.alert_status as string,
        status: record.status,
    };
}

export function buildAlertPayload(organizationId: string, input: CreateAlertInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        alert_key: input.alertKey ?? '',
        alert_severity: input.alertSeverity ?? '',
        alert_status: input.alertStatus ?? '',
        status: "active",
    };
}

export function mapEscalationRuleSummary(record: DbEocEscalationRule, maps?: { centerNameById: Map<string, string> }): EscalationRuleSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        alertSeverity: record.alert_severity as string,
        status: record.status,
    };
}

export function buildEscalationRulePayload(organizationId: string, input: CreateEscalationRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        alert_severity: input.alertSeverity ?? '',
        status: "active",
    };
}

export function mapAlertAcknowledgementSummary(record: DbEocAlertAcknowledgement, maps?: { centerNameById: Map<string, string> }): AlertAcknowledgementSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        ackKey: record.ack_key as string,
        ackStatus: record.ack_status as string,
        status: record.status,
    };
}

export function buildAlertAcknowledgementPayload(organizationId: string, input: CreateAlertAcknowledgementInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        ack_key: input.ackKey ?? '',
        ack_status: input.ackStatus ?? '',
        status: "active",
    };
}

export function mapMaintenanceWindowSummary(record: DbEocMaintenanceWindow, maps?: { centerNameById: Map<string, string> }): MaintenanceWindowSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        windowKey: record.window_key as string,
        windowName: record.window_name as string,
        status: record.status,
    };
}

export function buildMaintenanceWindowPayload(organizationId: string, input: CreateMaintenanceWindowInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        window_key: input.windowKey ?? '',
        window_name: input.windowName ?? '',
        status: "active",
    };
}

export function mapGlobalFlagSummary(record: DbEocGlobalFlag, maps?: { centerNameById: Map<string, string> }): GlobalFlagSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        flagKey: record.flag_key as string,
        flagName: record.flag_name as string,
        enabled: record.enabled as boolean,
        status: record.status,
    };
}

export function buildGlobalFlagPayload(organizationId: string, input: CreateGlobalFlagInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        flag_key: input.flagKey ?? '',
        flag_name: input.flagName ?? '',
        enabled: input.enabled ?? false,
        status: "active",
    };
}

export function mapTenantFlagSummary(record: DbEocTenantFlag, maps?: { centerNameById: Map<string, string> }): TenantFlagSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        flagKey: record.flag_key as string,
        flagName: record.flag_name as string,
        enabled: record.enabled as boolean,
        status: record.status,
    };
}

export function buildTenantFlagPayload(organizationId: string, input: CreateTenantFlagInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        flag_key: input.flagKey ?? '',
        flag_name: input.flagName ?? '',
        enabled: input.enabled ?? false,
        status: "active",
    };
}

export function mapBetaFeatureSummary(record: DbEocBetaFeature, maps?: { centerNameById: Map<string, string> }): BetaFeatureSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        featureKey: record.feature_key as string,
        featureName: record.feature_name as string,
        status: record.status,
    };
}

export function buildBetaFeaturePayload(organizationId: string, input: CreateBetaFeatureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        feature_key: input.featureKey ?? '',
        feature_name: input.featureName ?? '',
        status: "active",
    };
}

export function mapRolloutConfigSummary(record: DbEocRolloutConfig, maps?: { centerNameById: Map<string, string> }): RolloutConfigSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        rolloutKey: record.rollout_key as string,
        flagKey: record.flag_key as string,
        rolloutPercent: record.rollout_percent as number,
        status: record.status,
    };
}

export function buildRolloutConfigPayload(organizationId: string, input: CreateRolloutConfigInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        rollout_key: input.rolloutKey ?? '',
        flag_key: input.flagKey ?? '',
        rollout_percent: input.rolloutPercent ?? 0,
        status: "active",
    };
}

export function mapPlatformConfigSummary(record: DbEocPlatformConfig, maps?: { centerNameById: Map<string, string> }): PlatformConfigSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        configKey: record.config_key as string,
        configName: record.config_name as string,
        status: record.status,
    };
}

export function buildPlatformConfigPayload(organizationId: string, input: CreatePlatformConfigInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        config_key: input.configKey ?? '',
        config_name: input.configName ?? '',
        status: "active",
    };
}

export function mapTenantConfigSummary(record: DbEocTenantConfig, maps?: { centerNameById: Map<string, string> }): TenantConfigSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        configKey: record.config_key as string,
        configName: record.config_name as string,
        status: record.status,
    };
}

export function buildTenantConfigPayload(organizationId: string, input: CreateTenantConfigInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        config_key: input.configKey ?? '',
        config_name: input.configName ?? '',
        status: "active",
    };
}

export function mapSecretsMetadataSummary(record: DbEocSecretsMetadata, maps?: { centerNameById: Map<string, string> }): SecretsMetadataSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        secretKey: record.secret_key as string,
        secretName: record.secret_name as string,
        status: record.status,
    };
}

export function buildSecretsMetadataPayload(organizationId: string, input: CreateSecretsMetadataInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        secret_key: input.secretKey ?? '',
        secret_name: input.secretName ?? '',
        status: "active",
    };
}

export function mapConfigVersionSummary(record: DbEocConfigVersion, maps?: { centerNameById: Map<string, string> }): ConfigVersionSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        versionKey: record.version_key as string,
        versionNumber: record.version_number as string,
        status: record.status,
    };
}

export function buildConfigVersionPayload(organizationId: string, input: CreateConfigVersionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        version_key: input.versionKey ?? '',
        version_number: input.versionNumber ?? '',
        status: "active",
    };
}

export function mapPlatformLogSummary(record: DbEocPlatformLog, maps?: { centerNameById: Map<string, string> }): PlatformLogSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        logKey: record.log_key as string,
        logLevel: record.log_level as string,
        status: record.status,
    };
}

export function buildPlatformLogPayload(organizationId: string, input: CreatePlatformLogInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        log_key: input.logKey ?? '',
        log_level: input.logLevel ?? '',
        status: "active",
    };
}

export function mapPlatformMetricSummary(record: DbEocPlatformMetric, maps?: { centerNameById: Map<string, string> }): PlatformMetricSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        metricsKey: record.metrics_key as string,
        dependencyHealth: record.dependency_health as number,
        status: record.status,
    };
}

export function buildPlatformMetricPayload(organizationId: string, input: CreatePlatformMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        metrics_key: input.metricsKey ?? '',
        dependency_health: input.dependencyHealth ?? '',
        status: "active",
    };
}

export function mapTraceSummarySummary(record: DbEocTraceSummary, maps?: { centerNameById: Map<string, string> }): TraceSummarySummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        traceKey: record.trace_key as string,
        spanCount: record.span_count as number,
        status: record.status,
    };
}

export function buildTraceSummaryPayload(organizationId: string, input: CreateTraceSummaryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        trace_key: input.traceKey ?? '',
        span_count: input.spanCount ?? 0,
        status: "active",
    };
}

export function mapServiceRegistrySummary(record: DbEocServiceRegistry, maps?: { centerNameById: Map<string, string> }): ServiceRegistrySummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        serviceKey: record.service_key as string,
        serviceName: record.service_name as string,
        cacheStatus: record.cache_status as string,
        status: record.status,
    };
}

export function buildServiceRegistryPayload(organizationId: string, input: CreateServiceRegistryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        service_key: input.serviceKey ?? '',
        service_name: input.serviceName ?? '',
        cache_status: input.cacheStatus ?? '',
        status: "active",
    };
}

export function mapOperationsMetricSummary(record: DbEocOperationsMetric, maps?: { centerNameById: Map<string, string> }): OperationsMetricSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        metricsKey: record.metrics_key as string,
        operationalScore: record.operational_score as number,
        status: record.status,
    };
}

export function buildOperationsMetricPayload(organizationId: string, input: CreateOperationsMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        operational_score: input.operationalScore ?? 100,
        status: "active",
    };
}

export function mapOperationsHealthSummary(record: DbEocOperationsHealth, maps?: { centerNameById: Map<string, string> }): OperationsHealthSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildOperationsHealthPayload(organizationId: string, input: CreateOperationsHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 100,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapOperationsFailureSummary(record: DbEocOperationsFailure, maps?: { centerNameById: Map<string, string> }): OperationsFailureSummary {
    return {
        id: record.id,
        centerName: maps?.centerNameById.get((record as { center_id?: string }).center_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildOperationsFailurePayload(organizationId: string, input: CreateOperationsFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        center_id: input.operationsCenterId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapOverallHealthForStats(r: DbEocOverallHealth) { return { health_score: r.health_score, status: r.status }; }
export function mapJobSchedulerForStats(r: DbEocJobScheduler) { return { scheduler_status: r.scheduler_status, status: r.status }; }
export function mapPlatformEventForStats(r: DbEocPlatformEvent) { return { event_status: r.event_status, status: r.status }; }
export function mapJobRetryQueueForStats(r: DbEocJobRetryQueue) { return { status: r.status }; }
export function mapAlertForStats(r: DbEocAlert) { return { alert_status: r.alert_status, status: r.status }; }
export function mapModuleHealthForStats(r: DbEocModuleHealth) { return { health_score: r.health_score, status: r.status }; }
export function mapOperationsHealthForStats(r: DbEocOperationsHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapOperationsFailureForStats(r: DbEocOperationsFailure) { return { status: r.status }; }

export function buildEocDashboardStats(input: {
    operationsCenters: OperationsCenterSummary[];
    overallHealth: ReturnType<typeof mapOverallHealthForStats>[];
    jobSchedulers: ReturnType<typeof mapJobSchedulerForStats>[];
    platformEvents: ReturnType<typeof mapPlatformEventForStats>[];
    jobRetryQueue: ReturnType<typeof mapJobRetryQueueForStats>[];
    alerts: ReturnType<typeof mapAlertForStats>[];
    moduleHealth: ReturnType<typeof mapModuleHealthForStats>[];
    operationsHealth: ReturnType<typeof mapOperationsHealthForStats>[];
    operationsFailures: OperationsFailureSummary[];
    auditLogs: AuditEntry[];
}): EocDashboardStats {
    const activeCenters = input.operationsCenters.filter((c) => c.status === "active").length;
    const healthScores = [...input.overallHealth.map((h) => h.health_score), ...input.moduleHealth.map((h) => h.health_score), ...input.operationsHealth.map((h) => h.overall_score)];
    const avgHealthScore = healthScores.length ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length : 0;
    return {
        totalOperationsCenters: input.operationsCenters.length,
        activeOperationsCenters: activeCenters,
        overallHealthCount: input.overallHealth.length,
        activeJobCount: input.jobSchedulers.filter((j) => j.scheduler_status === "active" || j.status === "active").length,
        pendingRetryCount: input.jobRetryQueue.filter((q) => q.status === "pending").length,
        openAlertCount: input.alerts.filter((a) => a.alert_status === "open" || a.status === "active").length,
        openFailureCount: input.operationsFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        avgHealthScore,
        auditCount: input.auditLogs.length,
    };
}
