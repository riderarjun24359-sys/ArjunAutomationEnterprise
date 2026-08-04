"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { customerOperatedPlatformService } from "@/src/modules/customer-operated-platform/services/customer-operated-platform.service";
import type {
    OperatedHubSummary,
    CreateOperatedHubInput,
    SignupFlowSummary,
    CreateSignupFlowInput,
    OrgProvisioningSummary,
    CreateOrgProvisioningInput,
    DomainOnboardingSummary,
    CreateDomainOnboardingInput,
    EmailVerificationSummary,
    CreateEmailVerificationInput,
    OnboardingWizardSummary,
    CreateOnboardingWizardInput,
    ProductionProfileSummary,
    CreateProductionProfileInput,
    DeploymentJobSummary,
    CreateDeploymentJobInput,
    HealthValidationSummary,
    CreateHealthValidationInput,
    RollbackAutomationSummary,
    CreateRollbackAutomationInput,
    DeploymentAuditSummary,
    CreateDeploymentAuditInput,
    CentralLogSummary,
    CreateCentralLogInput,
    MetricsCollectorSummary,
    CreateMetricsCollectorInput,
    DistributedTraceSummary,
    CreateDistributedTraceInput,
    AlertRuleSummary,
    CreateAlertRuleInput,
    IncidentTimelineSummary,
    CreateIncidentTimelineInput,
    BackupSchedulerSummary,
    CreateBackupSchedulerInput,
    RestoreValidationSummary,
    CreateRestoreValidationInput,
    MaintenanceModeSummary,
    CreateMaintenanceModeInput,
    FeatureFlagOpSummary,
    CreateFeatureFlagOpInput,
    PlatformDiagnosticSummary,
    CreatePlatformDiagnosticInput,
    BetaOrganizationSummary,
    CreateBetaOrganizationInput,
    BetaInvitationSummary,
    CreateBetaInvitationInput,
    FeedbackCollectionSummary,
    CreateFeedbackCollectionInput,
    FeatureRequestSummary,
    CreateFeatureRequestInput,
    BugReportSummary,
    CreateBugReportInput,
    ReleaseChannelSummary,
    CreateReleaseChannelInput,
    OperatedMetricSummary,
    CreateOperatedMetricInput,
    OperatedHealthSummary,
    CreateOperatedHealthInput,
    ExecutiveBriefingSummary,
    CreateExecutiveBriefingInput,
    PlatformFailureSummary,
    CreatePlatformFailureInput,
    AuditEntry,
    CopDashboardStats,
    CopPipelineInfo,
} from "@/src/modules/customer-operated-platform/types";

export function useCustomerOperatedPlatform() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CopDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<CopPipelineInfo | null>(null);
    const [operatedHubs, setOperatedHubs] = useState<OperatedHubSummary[]>([]);
    const [signupFlows, setSignupFlows] = useState<SignupFlowSummary[]>([]);
    const [orgProvisioning, setOrgProvisionings] = useState<OrgProvisioningSummary[]>([]);
    const [domainOnboarding, setDomainOnboardings] = useState<DomainOnboardingSummary[]>([]);
    const [emailVerifications, setEmailVerifications] = useState<EmailVerificationSummary[]>([]);
    const [onboardingWizards, setOnboardingWizards] = useState<OnboardingWizardSummary[]>([]);
    const [productionProfiles, setProductionProfiles] = useState<ProductionProfileSummary[]>([]);
    const [deploymentJobs, setDeploymentJobs] = useState<DeploymentJobSummary[]>([]);
    const [healthValidations, setHealthValidations] = useState<HealthValidationSummary[]>([]);
    const [rollbackAutomations, setRollbackAutomations] = useState<RollbackAutomationSummary[]>([]);
    const [deploymentAudits, setDeploymentAudits] = useState<DeploymentAuditSummary[]>([]);
    const [centralLogs, setCentralLogs] = useState<CentralLogSummary[]>([]);
    const [metricsCollectors, setMetricsCollectors] = useState<MetricsCollectorSummary[]>([]);
    const [distributedTraces, setDistributedTraces] = useState<DistributedTraceSummary[]>([]);
    const [alertRules, setAlertRules] = useState<AlertRuleSummary[]>([]);
    const [incidentTimelines, setIncidentTimelines] = useState<IncidentTimelineSummary[]>([]);
    const [backupSchedulers, setBackupSchedulers] = useState<BackupSchedulerSummary[]>([]);
    const [restoreValidations, setRestoreValidations] = useState<RestoreValidationSummary[]>([]);
    const [maintenanceModes, setMaintenanceModes] = useState<MaintenanceModeSummary[]>([]);
    const [featureFlagOps, setFeatureFlagOps] = useState<FeatureFlagOpSummary[]>([]);
    const [platformDiagnostics, setPlatformDiagnostics] = useState<PlatformDiagnosticSummary[]>([]);
    const [betaOrganizations, setBetaOrganizations] = useState<BetaOrganizationSummary[]>([]);
    const [betaInvitations, setBetaInvitations] = useState<BetaInvitationSummary[]>([]);
    const [feedbackCollection, setFeedbackCollections] = useState<FeedbackCollectionSummary[]>([]);
    const [featureRequests, setFeatureRequests] = useState<FeatureRequestSummary[]>([]);
    const [bugReports, setBugReports] = useState<BugReportSummary[]>([]);
    const [releaseChannels, setReleaseChannels] = useState<ReleaseChannelSummary[]>([]);
    const [operatedMetrics, setOperatedMetrics] = useState<OperatedMetricSummary[]>([]);
    const [operatedHealth, setOperatedHealths] = useState<OperatedHealthSummary[]>([]);
    const [executiveBriefings, setExecutiveBriefings] = useState<ExecutiveBriefingSummary[]>([]);
    const [platformFailures, setPlatformFailures] = useState<PlatformFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [operatedHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
operatedHubsList,
            signupFlowsList,
            orgProvisioningList,
            domainOnboardingList,
            emailVerificationsList,
            onboardingWizardsList,
            productionProfilesList,
            deploymentJobsList,
            healthValidationsList,
            rollbackAutomationsList,
            deploymentAuditsList,
            centralLogsList,
            metricsCollectorsList,
            distributedTracesList,
            alertRulesList,
            incidentTimelinesList,
            backupSchedulersList,
            restoreValidationsList,
            maintenanceModesList,
            featureFlagOpsList,
            platformDiagnosticsList,
            betaOrganizationsList,
            betaInvitationsList,
            feedbackCollectionList,
            featureRequestsList,
            bugReportsList,
            releaseChannelsList,
            operatedMetricsList,
            operatedHealthList,
            executiveBriefingsList,
            platformFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            customerOperatedPlatformService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(customerOperatedPlatformService.getPipelineInfo()),
            customerOperatedPlatformService.getOperatedHubs(authUserId, email, fullName),
            customerOperatedPlatformService.getSignupFlows(authUserId, email, fullName),
            customerOperatedPlatformService.getOrgProvisionings(authUserId, email, fullName),
            customerOperatedPlatformService.getDomainOnboardings(authUserId, email, fullName),
            customerOperatedPlatformService.getEmailVerifications(authUserId, email, fullName),
            customerOperatedPlatformService.getOnboardingWizards(authUserId, email, fullName),
            customerOperatedPlatformService.getProductionProfiles(authUserId, email, fullName),
            customerOperatedPlatformService.getDeploymentJobs(authUserId, email, fullName),
            customerOperatedPlatformService.getHealthValidations(authUserId, email, fullName),
            customerOperatedPlatformService.getRollbackAutomations(authUserId, email, fullName),
            customerOperatedPlatformService.getDeploymentAudits(authUserId, email, fullName),
            customerOperatedPlatformService.getCentralLogs(authUserId, email, fullName),
            customerOperatedPlatformService.getMetricsCollectors(authUserId, email, fullName),
            customerOperatedPlatformService.getDistributedTraces(authUserId, email, fullName),
            customerOperatedPlatformService.getAlertRules(authUserId, email, fullName),
            customerOperatedPlatformService.getIncidentTimelines(authUserId, email, fullName),
            customerOperatedPlatformService.getBackupSchedulers(authUserId, email, fullName),
            customerOperatedPlatformService.getRestoreValidations(authUserId, email, fullName),
            customerOperatedPlatformService.getMaintenanceModes(authUserId, email, fullName),
            customerOperatedPlatformService.getFeatureFlagOps(authUserId, email, fullName),
            customerOperatedPlatformService.getPlatformDiagnostics(authUserId, email, fullName),
            customerOperatedPlatformService.getBetaOrganizations(authUserId, email, fullName),
            customerOperatedPlatformService.getBetaInvitations(authUserId, email, fullName),
            customerOperatedPlatformService.getFeedbackCollections(authUserId, email, fullName),
            customerOperatedPlatformService.getFeatureRequests(authUserId, email, fullName),
            customerOperatedPlatformService.getBugReports(authUserId, email, fullName),
            customerOperatedPlatformService.getReleaseChannels(authUserId, email, fullName),
            customerOperatedPlatformService.getOperatedMetrics(authUserId, email, fullName),
            customerOperatedPlatformService.getOperatedHealths(authUserId, email, fullName),
            customerOperatedPlatformService.getExecutiveBriefings(authUserId, email, fullName),
            customerOperatedPlatformService.getPlatformFailures(authUserId, email, fullName),
            customerOperatedPlatformService.getAuditLogs(authUserId, email, fullName),
            customerOperatedPlatformService.getOperatedHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
operatedHubsList,
            signupFlowsList,
            orgProvisioningList,
            domainOnboardingList,
            emailVerificationsList,
            onboardingWizardsList,
            productionProfilesList,
            deploymentJobsList,
            healthValidationsList,
            rollbackAutomationsList,
            deploymentAuditsList,
            centralLogsList,
            metricsCollectorsList,
            distributedTracesList,
            alertRulesList,
            incidentTimelinesList,
            backupSchedulersList,
            restoreValidationsList,
            maintenanceModesList,
            featureFlagOpsList,
            platformDiagnosticsList,
            betaOrganizationsList,
            betaInvitationsList,
            feedbackCollectionList,
            featureRequestsList,
            bugReportsList,
            releaseChannelsList,
            operatedMetricsList,
            operatedHealthList,
            executiveBriefingsList,
            platformFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setOperatedHubs(result.operatedHubsList);
        setSignupFlows(result.signupFlowsList);
        setOrgProvisionings(result.orgProvisioningList);
        setDomainOnboardings(result.domainOnboardingList);
        setEmailVerifications(result.emailVerificationsList);
        setOnboardingWizards(result.onboardingWizardsList);
        setProductionProfiles(result.productionProfilesList);
        setDeploymentJobs(result.deploymentJobsList);
        setHealthValidations(result.healthValidationsList);
        setRollbackAutomations(result.rollbackAutomationsList);
        setDeploymentAudits(result.deploymentAuditsList);
        setCentralLogs(result.centralLogsList);
        setMetricsCollectors(result.metricsCollectorsList);
        setDistributedTraces(result.distributedTracesList);
        setAlertRules(result.alertRulesList);
        setIncidentTimelines(result.incidentTimelinesList);
        setBackupSchedulers(result.backupSchedulersList);
        setRestoreValidations(result.restoreValidationsList);
        setMaintenanceModes(result.maintenanceModesList);
        setFeatureFlagOps(result.featureFlagOpsList);
        setPlatformDiagnostics(result.platformDiagnosticsList);
        setBetaOrganizations(result.betaOrganizationsList);
        setBetaInvitations(result.betaInvitationsList);
        setFeedbackCollections(result.feedbackCollectionList);
        setFeatureRequests(result.featureRequestsList);
        setBugReports(result.bugReportsList);
        setReleaseChannels(result.releaseChannelsList);
        setOperatedMetrics(result.operatedMetricsList);
        setOperatedHealths(result.operatedHealthList);
        setExecutiveBriefings(result.executiveBriefingsList);
        setPlatformFailures(result.platformFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createOperatedHub = useCallback(async (input: CreateOperatedHubInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createOperatedHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSignupFlow = useCallback(async (input: CreateSignupFlowInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createSignupFlow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOrgProvisioning = useCallback(async (input: CreateOrgProvisioningInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createOrgProvisioning(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDomainOnboarding = useCallback(async (input: CreateDomainOnboardingInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createDomainOnboarding(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEmailVerification = useCallback(async (input: CreateEmailVerificationInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createEmailVerification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOnboardingWizard = useCallback(async (input: CreateOnboardingWizardInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createOnboardingWizard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProductionProfile = useCallback(async (input: CreateProductionProfileInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createProductionProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentJob = useCallback(async (input: CreateDeploymentJobInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createDeploymentJob(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHealthValidation = useCallback(async (input: CreateHealthValidationInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createHealthValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRollbackAutomation = useCallback(async (input: CreateRollbackAutomationInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createRollbackAutomation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentAudit = useCallback(async (input: CreateDeploymentAuditInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createDeploymentAudit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCentralLog = useCallback(async (input: CreateCentralLogInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createCentralLog(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMetricsCollector = useCallback(async (input: CreateMetricsCollectorInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createMetricsCollector(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDistributedTrace = useCallback(async (input: CreateDistributedTraceInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createDistributedTrace(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAlertRule = useCallback(async (input: CreateAlertRuleInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createAlertRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIncidentTimeline = useCallback(async (input: CreateIncidentTimelineInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createIncidentTimeline(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBackupScheduler = useCallback(async (input: CreateBackupSchedulerInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createBackupScheduler(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRestoreValidation = useCallback(async (input: CreateRestoreValidationInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createRestoreValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMaintenanceMode = useCallback(async (input: CreateMaintenanceModeInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createMaintenanceMode(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeatureFlagOp = useCallback(async (input: CreateFeatureFlagOpInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createFeatureFlagOp(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlatformDiagnostic = useCallback(async (input: CreatePlatformDiagnosticInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createPlatformDiagnostic(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBetaOrganization = useCallback(async (input: CreateBetaOrganizationInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createBetaOrganization(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBetaInvitation = useCallback(async (input: CreateBetaInvitationInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createBetaInvitation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeedbackCollection = useCallback(async (input: CreateFeedbackCollectionInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createFeedbackCollection(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeatureRequest = useCallback(async (input: CreateFeatureRequestInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createFeatureRequest(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBugReport = useCallback(async (input: CreateBugReportInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createBugReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReleaseChannel = useCallback(async (input: CreateReleaseChannelInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createReleaseChannel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperatedMetric = useCallback(async (input: CreateOperatedMetricInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createOperatedMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperatedHealth = useCallback(async (input: CreateOperatedHealthInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createOperatedHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveBriefing = useCallback(async (input: CreateExecutiveBriefingInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createExecutiveBriefing(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlatformFailure = useCallback(async (input: CreatePlatformFailureInput) => { if (!user) throw new Error("Authentication required"); await customerOperatedPlatformService.createPlatformFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        operatedHubs,
        createOperatedHub,
        signupFlows,
        createSignupFlow,
        orgProvisioning,
        createOrgProvisioning,
        domainOnboarding,
        createDomainOnboarding,
        emailVerifications,
        createEmailVerification,
        onboardingWizards,
        createOnboardingWizard,
        productionProfiles,
        createProductionProfile,
        deploymentJobs,
        createDeploymentJob,
        healthValidations,
        createHealthValidation,
        rollbackAutomations,
        createRollbackAutomation,
        deploymentAudits,
        createDeploymentAudit,
        centralLogs,
        createCentralLog,
        metricsCollectors,
        createMetricsCollector,
        distributedTraces,
        createDistributedTrace,
        alertRules,
        createAlertRule,
        incidentTimelines,
        createIncidentTimeline,
        backupSchedulers,
        createBackupScheduler,
        restoreValidations,
        createRestoreValidation,
        maintenanceModes,
        createMaintenanceMode,
        featureFlagOps,
        createFeatureFlagOp,
        platformDiagnostics,
        createPlatformDiagnostic,
        betaOrganizations,
        createBetaOrganization,
        betaInvitations,
        createBetaInvitation,
        feedbackCollection,
        createFeedbackCollection,
        featureRequests,
        createFeatureRequest,
        bugReports,
        createBugReport,
        releaseChannels,
        createReleaseChannel,
        operatedMetrics,
        createOperatedMetric,
        operatedHealth,
        createOperatedHealth,
        executiveBriefings,
        createExecutiveBriefing,
        platformFailures,
        createPlatformFailure,
        auditLogs,
        operatedHubOptions,
        refresh,
    };
}
