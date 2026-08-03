"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { operationsCenterService } from "@/src/modules/operations-center/services/operations-center.service";
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
} from "@/src/modules/operations-center/types";

export function useOperationsCenter() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<EocDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<EocPipelineInfo | null>(null);
    const [operationsCenters, setOperationsCenters] = useState<OperationsCenterSummary[]>([]);
    const [overallHealth, setOverallHealths] = useState<OverallHealthSummary[]>([]);
    const [moduleHealth, setModuleHealths] = useState<ModuleHealthSummary[]>([]);
    const [databaseHealth, setDatabaseHealths] = useState<DatabaseHealthSummary[]>([]);
    const [jobSchedulers, setJobSchedulers] = useState<JobSchedulerSummary[]>([]);
    const [recurringJobs, setRecurringJobs] = useState<RecurringJobSummary[]>([]);
    const [jobRetryQueue, setJobRetryQueues] = useState<JobRetryQueueSummary[]>([]);
    const [jobDeadLetter, setJobDeadLetters] = useState<JobDeadLetterSummary[]>([]);
    const [platformEvents, setPlatformEvents] = useState<PlatformEventSummary[]>([]);
    const [businessEvents, setBusinessEvents] = useState<BusinessEventSummary[]>([]);
    const [eventSubscriptions, setEventSubscriptions] = useState<EventSubscriptionSummary[]>([]);
    const [eventReplays, setEventReplays] = useState<EventReplaySummary[]>([]);
    const [alerts, setAlerts] = useState<AlertSummary[]>([]);
    const [escalationRules, setEscalationRules] = useState<EscalationRuleSummary[]>([]);
    const [alertAcknowledgements, setAlertAcknowledgements] = useState<AlertAcknowledgementSummary[]>([]);
    const [maintenanceWindows, setMaintenanceWindows] = useState<MaintenanceWindowSummary[]>([]);
    const [globalFlags, setGlobalFlags] = useState<GlobalFlagSummary[]>([]);
    const [tenantFlags, setTenantFlags] = useState<TenantFlagSummary[]>([]);
    const [betaFeatures, setBetaFeatures] = useState<BetaFeatureSummary[]>([]);
    const [rolloutConfigs, setRolloutConfigs] = useState<RolloutConfigSummary[]>([]);
    const [platformConfigs, setPlatformConfigs] = useState<PlatformConfigSummary[]>([]);
    const [tenantConfigs, setTenantConfigs] = useState<TenantConfigSummary[]>([]);
    const [secretsMetadata, setSecretsMetadatas] = useState<SecretsMetadataSummary[]>([]);
    const [configVersions, setConfigVersions] = useState<ConfigVersionSummary[]>([]);
    const [platformLogs, setPlatformLogs] = useState<PlatformLogSummary[]>([]);
    const [platformMetrics, setPlatformMetrics] = useState<PlatformMetricSummary[]>([]);
    const [traceSummaries, setTraceSummarys] = useState<TraceSummarySummary[]>([]);
    const [serviceRegistry, setServiceRegistrys] = useState<ServiceRegistrySummary[]>([]);
    const [operationsMetrics, setOperationsMetrics] = useState<OperationsMetricSummary[]>([]);
    const [operationsHealth, setOperationsHealths] = useState<OperationsHealthSummary[]>([]);
    const [operationsFailures, setOperationsFailures] = useState<OperationsFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [operationsCenterOptions, setOperationsCenterOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
operationsCentersList,
            overallHealthList,
            moduleHealthList,
            databaseHealthList,
            jobSchedulersList,
            recurringJobsList,
            jobRetryQueueList,
            jobDeadLetterList,
            platformEventsList,
            businessEventsList,
            eventSubscriptionsList,
            eventReplaysList,
            alertsList,
            escalationRulesList,
            alertAcknowledgementsList,
            maintenanceWindowsList,
            globalFlagsList,
            tenantFlagsList,
            betaFeaturesList,
            rolloutConfigsList,
            platformConfigsList,
            tenantConfigsList,
            secretsMetadataList,
            configVersionsList,
            platformLogsList,
            platformMetricsList,
            traceSummariesList,
            serviceRegistryList,
            operationsMetricsList,
            operationsHealthList,
            operationsFailuresList,
            auditLogsList,
            centerOpts,
        ] = await Promise.all([
            operationsCenterService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(operationsCenterService.getPipelineInfo()),
            operationsCenterService.getOperationsCenters(authUserId, email, fullName),
            operationsCenterService.getOverallHealths(authUserId, email, fullName),
            operationsCenterService.getModuleHealths(authUserId, email, fullName),
            operationsCenterService.getDatabaseHealths(authUserId, email, fullName),
            operationsCenterService.getJobSchedulers(authUserId, email, fullName),
            operationsCenterService.getRecurringJobs(authUserId, email, fullName),
            operationsCenterService.getJobRetryQueues(authUserId, email, fullName),
            operationsCenterService.getJobDeadLetters(authUserId, email, fullName),
            operationsCenterService.getPlatformEvents(authUserId, email, fullName),
            operationsCenterService.getBusinessEvents(authUserId, email, fullName),
            operationsCenterService.getEventSubscriptions(authUserId, email, fullName),
            operationsCenterService.getEventReplays(authUserId, email, fullName),
            operationsCenterService.getAlerts(authUserId, email, fullName),
            operationsCenterService.getEscalationRules(authUserId, email, fullName),
            operationsCenterService.getAlertAcknowledgements(authUserId, email, fullName),
            operationsCenterService.getMaintenanceWindows(authUserId, email, fullName),
            operationsCenterService.getGlobalFlags(authUserId, email, fullName),
            operationsCenterService.getTenantFlags(authUserId, email, fullName),
            operationsCenterService.getBetaFeatures(authUserId, email, fullName),
            operationsCenterService.getRolloutConfigs(authUserId, email, fullName),
            operationsCenterService.getPlatformConfigs(authUserId, email, fullName),
            operationsCenterService.getTenantConfigs(authUserId, email, fullName),
            operationsCenterService.getSecretsMetadatas(authUserId, email, fullName),
            operationsCenterService.getConfigVersions(authUserId, email, fullName),
            operationsCenterService.getPlatformLogs(authUserId, email, fullName),
            operationsCenterService.getPlatformMetrics(authUserId, email, fullName),
            operationsCenterService.getTraceSummarys(authUserId, email, fullName),
            operationsCenterService.getServiceRegistrys(authUserId, email, fullName),
            operationsCenterService.getOperationsMetrics(authUserId, email, fullName),
            operationsCenterService.getOperationsHealths(authUserId, email, fullName),
            operationsCenterService.getOperationsFailures(authUserId, email, fullName),
            operationsCenterService.getAuditLogs(authUserId, email, fullName),
            operationsCenterService.getOperationsCenterOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
operationsCentersList,
            overallHealthList,
            moduleHealthList,
            databaseHealthList,
            jobSchedulersList,
            recurringJobsList,
            jobRetryQueueList,
            jobDeadLetterList,
            platformEventsList,
            businessEventsList,
            eventSubscriptionsList,
            eventReplaysList,
            alertsList,
            escalationRulesList,
            alertAcknowledgementsList,
            maintenanceWindowsList,
            globalFlagsList,
            tenantFlagsList,
            betaFeaturesList,
            rolloutConfigsList,
            platformConfigsList,
            tenantConfigsList,
            secretsMetadataList,
            configVersionsList,
            platformLogsList,
            platformMetricsList,
            traceSummariesList,
            serviceRegistryList,
            operationsMetricsList,
            operationsHealthList,
            operationsFailuresList,
            auditLogsList,
            centerOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setOperationsCenters(result.operationsCentersList);
        setOverallHealths(result.overallHealthList);
        setModuleHealths(result.moduleHealthList);
        setDatabaseHealths(result.databaseHealthList);
        setJobSchedulers(result.jobSchedulersList);
        setRecurringJobs(result.recurringJobsList);
        setJobRetryQueues(result.jobRetryQueueList);
        setJobDeadLetters(result.jobDeadLetterList);
        setPlatformEvents(result.platformEventsList);
        setBusinessEvents(result.businessEventsList);
        setEventSubscriptions(result.eventSubscriptionsList);
        setEventReplays(result.eventReplaysList);
        setAlerts(result.alertsList);
        setEscalationRules(result.escalationRulesList);
        setAlertAcknowledgements(result.alertAcknowledgementsList);
        setMaintenanceWindows(result.maintenanceWindowsList);
        setGlobalFlags(result.globalFlagsList);
        setTenantFlags(result.tenantFlagsList);
        setBetaFeatures(result.betaFeaturesList);
        setRolloutConfigs(result.rolloutConfigsList);
        setPlatformConfigs(result.platformConfigsList);
        setTenantConfigs(result.tenantConfigsList);
        setSecretsMetadatas(result.secretsMetadataList);
        setConfigVersions(result.configVersionsList);
        setPlatformLogs(result.platformLogsList);
        setPlatformMetrics(result.platformMetricsList);
        setTraceSummarys(result.traceSummariesList);
        setServiceRegistrys(result.serviceRegistryList);
        setOperationsMetrics(result.operationsMetricsList);
        setOperationsHealths(result.operationsHealthList);
        setOperationsFailures(result.operationsFailuresList);
        setAuditLogs(result.auditLogsList);
        setOperationsCenterOptions(result.centerOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createOperationsCenter = useCallback(async (input: CreateOperationsCenterInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createOperationsCenter(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOverallHealth = useCallback(async (input: CreateOverallHealthInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createOverallHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModuleHealth = useCallback(async (input: CreateModuleHealthInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createModuleHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDatabaseHealth = useCallback(async (input: CreateDatabaseHealthInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createDatabaseHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createJobScheduler = useCallback(async (input: CreateJobSchedulerInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createJobScheduler(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRecurringJob = useCallback(async (input: CreateRecurringJobInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createRecurringJob(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createJobRetryQueue = useCallback(async (input: CreateJobRetryQueueInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createJobRetryQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createJobDeadLetter = useCallback(async (input: CreateJobDeadLetterInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createJobDeadLetter(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlatformEvent = useCallback(async (input: CreatePlatformEventInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createPlatformEvent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessEvent = useCallback(async (input: CreateBusinessEventInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createBusinessEvent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEventSubscription = useCallback(async (input: CreateEventSubscriptionInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createEventSubscription(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEventReplay = useCallback(async (input: CreateEventReplayInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createEventReplay(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAlert = useCallback(async (input: CreateAlertInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createAlert(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEscalationRule = useCallback(async (input: CreateEscalationRuleInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createEscalationRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAlertAcknowledgement = useCallback(async (input: CreateAlertAcknowledgementInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createAlertAcknowledgement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMaintenanceWindow = useCallback(async (input: CreateMaintenanceWindowInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createMaintenanceWindow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGlobalFlag = useCallback(async (input: CreateGlobalFlagInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createGlobalFlag(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTenantFlag = useCallback(async (input: CreateTenantFlagInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createTenantFlag(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBetaFeature = useCallback(async (input: CreateBetaFeatureInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createBetaFeature(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRolloutConfig = useCallback(async (input: CreateRolloutConfigInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createRolloutConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlatformConfig = useCallback(async (input: CreatePlatformConfigInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createPlatformConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTenantConfig = useCallback(async (input: CreateTenantConfigInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createTenantConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSecretsMetadata = useCallback(async (input: CreateSecretsMetadataInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createSecretsMetadata(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createConfigVersion = useCallback(async (input: CreateConfigVersionInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createConfigVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlatformLog = useCallback(async (input: CreatePlatformLogInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createPlatformLog(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlatformMetric = useCallback(async (input: CreatePlatformMetricInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createPlatformMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTraceSummary = useCallback(async (input: CreateTraceSummaryInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createTraceSummary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createServiceRegistry = useCallback(async (input: CreateServiceRegistryInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createServiceRegistry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationsMetric = useCallback(async (input: CreateOperationsMetricInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createOperationsMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationsHealth = useCallback(async (input: CreateOperationsHealthInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createOperationsHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationsFailure = useCallback(async (input: CreateOperationsFailureInput) => { if (!user) throw new Error("Authentication required"); await operationsCenterService.createOperationsFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        operationsCenters,
        createOperationsCenter,
        overallHealth,
        createOverallHealth,
        moduleHealth,
        createModuleHealth,
        databaseHealth,
        createDatabaseHealth,
        jobSchedulers,
        createJobScheduler,
        recurringJobs,
        createRecurringJob,
        jobRetryQueue,
        createJobRetryQueue,
        jobDeadLetter,
        createJobDeadLetter,
        platformEvents,
        createPlatformEvent,
        businessEvents,
        createBusinessEvent,
        eventSubscriptions,
        createEventSubscription,
        eventReplays,
        createEventReplay,
        alerts,
        createAlert,
        escalationRules,
        createEscalationRule,
        alertAcknowledgements,
        createAlertAcknowledgement,
        maintenanceWindows,
        createMaintenanceWindow,
        globalFlags,
        createGlobalFlag,
        tenantFlags,
        createTenantFlag,
        betaFeatures,
        createBetaFeature,
        rolloutConfigs,
        createRolloutConfig,
        platformConfigs,
        createPlatformConfig,
        tenantConfigs,
        createTenantConfig,
        secretsMetadata,
        createSecretsMetadata,
        configVersions,
        createConfigVersion,
        platformLogs,
        createPlatformLog,
        platformMetrics,
        createPlatformMetric,
        traceSummaries,
        createTraceSummary,
        serviceRegistry,
        createServiceRegistry,
        operationsMetrics,
        createOperationsMetric,
        operationsHealth,
        createOperationsHealth,
        operationsFailures,
        createOperationsFailure,
        auditLogs,
        operationsCenterOptions,
        refresh,
    };
}
