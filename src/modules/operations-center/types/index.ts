export interface EocDashboardStats {
    totalOperationsCenters: number;
    activeOperationsCenters: number;
    overallHealthCount: number;
    activeJobCount: number;
    pendingRetryCount: number;
    openAlertCount: number;
    openFailureCount: number;
    avgHealthScore: number;
    auditCount: number;
}

export interface EocPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface EocSdkPublishEventInput { operationsCenterId: string; eventKey?: string; eventName?: string; eventType?: string; }
export interface EocSdkPublishEventResult { eventId: string; eventKey: string; eventStatus: string; }
export interface EocSdkScheduleJobInput { operationsCenterId: string; schedulerKey?: string; schedulerName?: string; }
export interface EocSdkScheduleJobResult { schedulerId: string; schedulerKey: string; status: string; }
export interface EocSdkTriggerAlertInput { operationsCenterId: string; alertKey?: string; alertSeverity?: string; }
export interface EocSdkTriggerAlertResult { alertId: string; alertKey: string; status: string; }

export interface OperationsCenterSummary {
    id: string;
    centerKey: string;
    centerName: string;
    environment: string;
    status: string;
}

export interface CreateOperationsCenterInput {
        centerKey?: string;
    centerName?: string;
    environment?: string;
}

export interface OverallHealthSummary {
    id: string;
    centerName?: string;
        healthKey: string;
    healthType: string;
    healthScore: number;
    status: string;
}

export interface CreateOverallHealthInput {
    operationsCenterId: string;
        healthKey?: string;
    healthType?: string;
    healthScore?: number;
}

export interface ModuleHealthSummary {
    id: string;
    centerName?: string;
        healthKey: string;
    moduleName: string;
    healthScore: number;
    status: string;
}

export interface CreateModuleHealthInput {
    operationsCenterId: string;
        healthKey?: string;
    moduleName?: string;
    healthScore?: number;
}

export interface DatabaseHealthSummary {
    id: string;
    centerName?: string;
        healthKey: string;
    healthScore: number;
    status: string;
}

export interface CreateDatabaseHealthInput {
    operationsCenterId: string;
        healthKey?: string;
    healthScore?: number;
}

export interface JobSchedulerSummary {
    id: string;
    centerName?: string;
        schedulerKey: string;
    schedulerName: string;
    workerPoolSize: number;
    status: string;
}

export interface CreateJobSchedulerInput {
    operationsCenterId: string;
        schedulerKey?: string;
    schedulerName?: string;
    workerPoolSize?: number;
}

export interface RecurringJobSummary {
    id: string;
    centerName?: string;
        jobKey: string;
    jobName: string;
    jobStatus: string;
    status: string;
}

export interface CreateRecurringJobInput {
    operationsCenterId: string;
        jobKey?: string;
    jobName?: string;
    jobStatus?: string;
}

export interface JobRetryQueueSummary {
    id: string;
    centerName?: string;
        queueKey: string;
    jobRef: string;
    priority: number;
    status: string;
}

export interface CreateJobRetryQueueInput {
    operationsCenterId: string;
        queueKey?: string;
    jobRef?: string;
    priority?: number;
}

export interface JobDeadLetterSummary {
    id: string;
    centerName?: string;
        deadLetterKey: string;
    jobRef: string;
    deadLetterStatus: string;
    status: string;
}

export interface CreateJobDeadLetterInput {
    operationsCenterId: string;
        deadLetterKey?: string;
    jobRef?: string;
    deadLetterStatus?: string;
}

export interface PlatformEventSummary {
    id: string;
    centerName?: string;
        eventKey: string;
    eventType: string;
    eventStatus: string;
    status: string;
}

export interface CreatePlatformEventInput {
    operationsCenterId: string;
        eventKey?: string;
    eventType?: string;
    eventStatus?: string;
}

export interface BusinessEventSummary {
    id: string;
    centerName?: string;
        eventKey: string;
    eventType: string;
    eventStatus: string;
    status: string;
}

export interface CreateBusinessEventInput {
    operationsCenterId: string;
        eventKey?: string;
    eventType?: string;
    eventStatus?: string;
}

export interface EventSubscriptionSummary {
    id: string;
    centerName?: string;
        subscriptionKey: string;
    eventType: string;
    status: string;
}

export interface CreateEventSubscriptionInput {
    operationsCenterId: string;
        subscriptionKey?: string;
    eventType?: string;
}

export interface EventReplaySummary {
    id: string;
    centerName?: string;
        replayKey: string;
    eventType: string;
    replayStatus: string;
    status: string;
}

export interface CreateEventReplayInput {
    operationsCenterId: string;
        replayKey?: string;
    eventType?: string;
    replayStatus?: string;
}

export interface AlertSummary {
    id: string;
    centerName?: string;
        alertKey: string;
    alertSeverity: string;
    alertStatus: string;
    status: string;
}

export interface CreateAlertInput {
    operationsCenterId: string;
        alertKey?: string;
    alertSeverity?: string;
    alertStatus?: string;
}

export interface EscalationRuleSummary {
    id: string;
    centerName?: string;
        ruleKey: string;
    ruleName: string;
    alertSeverity: string;
    status: string;
}

export interface CreateEscalationRuleInput {
    operationsCenterId: string;
        ruleKey?: string;
    ruleName?: string;
    alertSeverity?: string;
}

export interface AlertAcknowledgementSummary {
    id: string;
    centerName?: string;
        ackKey: string;
    ackStatus: string;
    status: string;
}

export interface CreateAlertAcknowledgementInput {
    operationsCenterId: string;
        ackKey?: string;
    ackStatus?: string;
}

export interface MaintenanceWindowSummary {
    id: string;
    centerName?: string;
        windowKey: string;
    windowName: string;
    status: string;
}

export interface CreateMaintenanceWindowInput {
    operationsCenterId: string;
        windowKey?: string;
    windowName?: string;
}

export interface GlobalFlagSummary {
    id: string;
    centerName?: string;
        flagKey: string;
    flagName: string;
    enabled: boolean;
    status: string;
}

export interface CreateGlobalFlagInput {
    operationsCenterId: string;
        flagKey?: string;
    flagName?: string;
    enabled?: boolean;
}

export interface TenantFlagSummary {
    id: string;
    centerName?: string;
        flagKey: string;
    flagName: string;
    enabled: boolean;
    status: string;
}

export interface CreateTenantFlagInput {
    operationsCenterId: string;
        flagKey?: string;
    flagName?: string;
    enabled?: boolean;
}

export interface BetaFeatureSummary {
    id: string;
    centerName?: string;
        featureKey: string;
    featureName: string;
    status: string;
}

export interface CreateBetaFeatureInput {
    operationsCenterId: string;
        featureKey?: string;
    featureName?: string;
}

export interface RolloutConfigSummary {
    id: string;
    centerName?: string;
        rolloutKey: string;
    flagKey: string;
    rolloutPercent: number;
    status: string;
}

export interface CreateRolloutConfigInput {
    operationsCenterId: string;
        rolloutKey?: string;
    flagKey?: string;
    rolloutPercent?: number;
}

export interface PlatformConfigSummary {
    id: string;
    centerName?: string;
        configKey: string;
    configName: string;
    status: string;
}

export interface CreatePlatformConfigInput {
    operationsCenterId: string;
        configKey?: string;
    configName?: string;
}

export interface TenantConfigSummary {
    id: string;
    centerName?: string;
        configKey: string;
    configName: string;
    status: string;
}

export interface CreateTenantConfigInput {
    operationsCenterId: string;
        configKey?: string;
    configName?: string;
}

export interface SecretsMetadataSummary {
    id: string;
    centerName?: string;
        secretKey: string;
    secretName: string;
    status: string;
}

export interface CreateSecretsMetadataInput {
    operationsCenterId: string;
        secretKey?: string;
    secretName?: string;
}

export interface ConfigVersionSummary {
    id: string;
    centerName?: string;
        versionKey: string;
    versionNumber: string;
    status: string;
}

export interface CreateConfigVersionInput {
    operationsCenterId: string;
        versionKey?: string;
    versionNumber?: string;
}

export interface PlatformLogSummary {
    id: string;
    centerName?: string;
        logKey: string;
    logLevel: string;
    status: string;
}

export interface CreatePlatformLogInput {
    operationsCenterId: string;
        logKey?: string;
    logLevel?: string;
}

export interface PlatformMetricSummary {
    id: string;
    centerName?: string;
        metricsKey: string;
    dependencyHealth: number;
    status: string;
}

export interface CreatePlatformMetricInput {
    operationsCenterId: string;
        metricsKey?: string;
    dependencyHealth?: number;
}

export interface TraceSummarySummary {
    id: string;
    centerName?: string;
        traceKey: string;
    spanCount: number;
    status: string;
}

export interface CreateTraceSummaryInput {
    operationsCenterId: string;
        traceKey?: string;
    spanCount?: number;
}

export interface ServiceRegistrySummary {
    id: string;
    centerName?: string;
        serviceKey: string;
    serviceName: string;
    cacheStatus: string;
    status: string;
}

export interface CreateServiceRegistryInput {
    operationsCenterId: string;
        serviceKey?: string;
    serviceName?: string;
    cacheStatus?: string;
}

export interface OperationsMetricSummary {
    id: string;
    centerName?: string;
        metricsKey: string;
    operationalScore: number;
    status: string;
}

export interface CreateOperationsMetricInput {
    metricsKey?: string;
    operationalScore?: number;
}

export interface OperationsHealthSummary {
    id: string;
    centerName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateOperationsHealthInput {
    healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface OperationsFailureSummary {
    id: string;
    centerName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateOperationsFailureInput {
    operationsCenterId: string;
        failureKey?: string;
    failureType?: string;
}

