import { z } from "zod";

export const operationsCentersFormSchema = z.object({
    centerKey: z.string().min(1).optional(),
    centerName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type operationsCentersFormValues = z.infer<typeof operationsCentersFormSchema>;

export const overallHealthFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    healthKey: z.string().min(1).optional(),
    healthType: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type overallHealthFormValues = z.infer<typeof overallHealthFormSchema>;

export const moduleHealthFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    healthKey: z.string().min(1).optional(),
    moduleName: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type moduleHealthFormValues = z.infer<typeof moduleHealthFormSchema>;

export const databaseHealthFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    healthKey: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type databaseHealthFormValues = z.infer<typeof databaseHealthFormSchema>;

export const jobSchedulersFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    schedulerKey: z.string().min(1).optional(),
    schedulerName: z.string().min(1).optional(),
    workerPoolSize: z.number().optional(),
});

export type jobSchedulersFormValues = z.infer<typeof jobSchedulersFormSchema>;

export const recurringJobsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    jobKey: z.string().min(1).optional(),
    jobName: z.string().min(1).optional(),
    jobStatus: z.string().min(1).optional(),
});

export type recurringJobsFormValues = z.infer<typeof recurringJobsFormSchema>;

export const jobRetryQueueFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    queueKey: z.string().min(1).optional(),
    jobRef: z.string().min(1).optional(),
    priority: z.number().optional(),
});

export type jobRetryQueueFormValues = z.infer<typeof jobRetryQueueFormSchema>;

export const jobDeadLetterFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    deadLetterKey: z.string().min(1).optional(),
    jobRef: z.string().min(1).optional(),
    deadLetterStatus: z.string().min(1).optional(),
});

export type jobDeadLetterFormValues = z.infer<typeof jobDeadLetterFormSchema>;

export const platformEventsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    eventKey: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
    eventStatus: z.string().min(1).optional(),
});

export type platformEventsFormValues = z.infer<typeof platformEventsFormSchema>;

export const businessEventsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    eventKey: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
    eventStatus: z.string().min(1).optional(),
});

export type businessEventsFormValues = z.infer<typeof businessEventsFormSchema>;

export const eventSubscriptionsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    subscriptionKey: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
});

export type eventSubscriptionsFormValues = z.infer<typeof eventSubscriptionsFormSchema>;

export const eventReplaysFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    replayKey: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
    replayStatus: z.string().min(1).optional(),
});

export type eventReplaysFormValues = z.infer<typeof eventReplaysFormSchema>;

export const alertsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    alertKey: z.string().min(1).optional(),
    alertSeverity: z.string().min(1).optional(),
    alertStatus: z.string().min(1).optional(),
});

export type alertsFormValues = z.infer<typeof alertsFormSchema>;

export const escalationRulesFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    alertSeverity: z.string().min(1).optional(),
});

export type escalationRulesFormValues = z.infer<typeof escalationRulesFormSchema>;

export const alertAcknowledgementsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    ackKey: z.string().min(1).optional(),
    ackStatus: z.string().min(1).optional(),
});

export type alertAcknowledgementsFormValues = z.infer<typeof alertAcknowledgementsFormSchema>;

export const maintenanceWindowsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    windowKey: z.string().min(1).optional(),
    windowName: z.string().min(1).optional(),
});

export type maintenanceWindowsFormValues = z.infer<typeof maintenanceWindowsFormSchema>;

export const globalFlagsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    flagKey: z.string().min(1).optional(),
    flagName: z.string().min(1).optional(),
    enabled: z.boolean().optional(),
});

export type globalFlagsFormValues = z.infer<typeof globalFlagsFormSchema>;

export const tenantFlagsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    flagKey: z.string().min(1).optional(),
    flagName: z.string().min(1).optional(),
    enabled: z.boolean().optional(),
});

export type tenantFlagsFormValues = z.infer<typeof tenantFlagsFormSchema>;

export const betaFeaturesFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    featureKey: z.string().min(1).optional(),
    featureName: z.string().min(1).optional(),
});

export type betaFeaturesFormValues = z.infer<typeof betaFeaturesFormSchema>;

export const rolloutConfigsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    rolloutKey: z.string().min(1).optional(),
    flagKey: z.string().min(1).optional(),
    rolloutPercent: z.number().optional(),
});

export type rolloutConfigsFormValues = z.infer<typeof rolloutConfigsFormSchema>;

export const platformConfigsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    configKey: z.string().min(1).optional(),
    configName: z.string().min(1).optional(),
});

export type platformConfigsFormValues = z.infer<typeof platformConfigsFormSchema>;

export const tenantConfigsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    configKey: z.string().min(1).optional(),
    configName: z.string().min(1).optional(),
});

export type tenantConfigsFormValues = z.infer<typeof tenantConfigsFormSchema>;

export const secretsMetadataFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    secretKey: z.string().min(1).optional(),
    secretName: z.string().min(1).optional(),
});

export type secretsMetadataFormValues = z.infer<typeof secretsMetadataFormSchema>;

export const configVersionsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
});

export type configVersionsFormValues = z.infer<typeof configVersionsFormSchema>;

export const platformLogsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    logKey: z.string().min(1).optional(),
    logLevel: z.string().min(1).optional(),
});

export type platformLogsFormValues = z.infer<typeof platformLogsFormSchema>;

export const platformMetricsFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    metricsKey: z.string().min(1).optional(),
    dependencyHealth: z.number().optional(),
});

export type platformMetricsFormValues = z.infer<typeof platformMetricsFormSchema>;

export const traceSummariesFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    traceKey: z.string().min(1).optional(),
    spanCount: z.number().optional(),
});

export type traceSummariesFormValues = z.infer<typeof traceSummariesFormSchema>;

export const serviceRegistryFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    serviceKey: z.string().min(1).optional(),
    serviceName: z.string().min(1).optional(),
    cacheStatus: z.string().min(1).optional(),
});

export type serviceRegistryFormValues = z.infer<typeof serviceRegistryFormSchema>;

export const operationsMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    operationalScore: z.number().optional(),
});

export type operationsMetricsFormValues = z.infer<typeof operationsMetricsFormSchema>;

export const operationsHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type operationsHealthFormValues = z.infer<typeof operationsHealthFormSchema>;

export const operationsFailuresFormSchema = z.object({
    operationsCenterId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type operationsFailuresFormValues = z.infer<typeof operationsFailuresFormSchema>;
