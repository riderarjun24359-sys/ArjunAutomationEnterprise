"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { launchReadinessService } from "@/src/modules/launch-readiness/services/launch-readiness.service";
import type {
    ReadinessHubSummary,
    CreateReadinessHubInput,
    EnvironmentValidationSummary,
    CreateEnvironmentValidationInput,
    ConfigurationValidationSummary,
    CreateConfigurationValidationInput,
    SecretsValidationSummary,
    CreateSecretsValidationInput,
    DeploymentPlanSummary,
    CreateDeploymentPlanInput,
    RollbackPlanSummary,
    CreateRollbackPlanInput,
    VersionRegistrySummary,
    CreateVersionRegistryInput,
    ReleaseNoteSummary,
    CreateReleaseNoteInput,
    BackupPolicySummary,
    CreateBackupPolicyInput,
    BackupVerificationSummary,
    CreateBackupVerificationInput,
    RestoreVerificationSummary,
    CreateRestoreVerificationInput,
    RecoveryDrillSummary,
    CreateRecoveryDrillInput,
    ObservabilityLogSummary,
    CreateObservabilityLogInput,
    ObservabilityMetricSummary,
    CreateObservabilityMetricInput,
    TraceRecordSummary,
    CreateTraceRecordInput,
    SlaMonitorSummary,
    CreateSlaMonitorInput,
    SecurityChecklistSummary,
    CreateSecurityChecklistInput,
    VulnerabilityReviewSummary,
    CreateVulnerabilityReviewInput,
    PermissionAuditSummary,
    CreatePermissionAuditInput,
    ComplianceReviewSummary,
    CreateComplianceReviewInput,
    AdminGuideSummary,
    CreateAdminGuideInput,
    UserGuideSummary,
    CreateUserGuideInput,
    DeploymentGuideSummary,
    CreateDeploymentGuideInput,
    LaunchScoreMetricSummary,
    CreateLaunchScoreMetricInput,
    ReadinessValidationSummary,
    CreateReadinessValidationInput,
    LaunchBlockerSummary,
    CreateLaunchBlockerInput,
    ScoreSnapshotSummary,
    CreateScoreSnapshotInput,
    LaunchHealthSummary,
    CreateLaunchHealthInput,
    CriticalIssueSummary,
    CreateCriticalIssueInput,
    ReadinessWarningSummary,
    CreateReadinessWarningInput,
    LaunchFailureSummary,
    CreateLaunchFailureInput,
    AuditEntry,
    ElrDashboardStats,
    ElrPipelineInfo,
} from "@/src/modules/launch-readiness/types";

export function useLaunchReadiness() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ElrDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<ElrPipelineInfo | null>(null);
    const [readinessHubs, setReadinessHubs] = useState<ReadinessHubSummary[]>([]);
    const [environmentValidations, setEnvironmentValidations] = useState<EnvironmentValidationSummary[]>([]);
    const [configurationValidations, setConfigurationValidations] = useState<ConfigurationValidationSummary[]>([]);
    const [secretsValidations, setSecretsValidations] = useState<SecretsValidationSummary[]>([]);
    const [deploymentPlans, setDeploymentPlans] = useState<DeploymentPlanSummary[]>([]);
    const [rollbackPlans, setRollbackPlans] = useState<RollbackPlanSummary[]>([]);
    const [versionRegistry, setVersionRegistrys] = useState<VersionRegistrySummary[]>([]);
    const [releaseNotes, setReleaseNotes] = useState<ReleaseNoteSummary[]>([]);
    const [backupPolicies, setBackupPolicys] = useState<BackupPolicySummary[]>([]);
    const [backupVerifications, setBackupVerifications] = useState<BackupVerificationSummary[]>([]);
    const [restoreVerifications, setRestoreVerifications] = useState<RestoreVerificationSummary[]>([]);
    const [recoveryDrills, setRecoveryDrills] = useState<RecoveryDrillSummary[]>([]);
    const [observabilityLogs, setObservabilityLogs] = useState<ObservabilityLogSummary[]>([]);
    const [observabilityMetrics, setObservabilityMetrics] = useState<ObservabilityMetricSummary[]>([]);
    const [traceRecords, setTraceRecords] = useState<TraceRecordSummary[]>([]);
    const [slaMonitors, setSlaMonitors] = useState<SlaMonitorSummary[]>([]);
    const [securityChecklists, setSecurityChecklists] = useState<SecurityChecklistSummary[]>([]);
    const [vulnerabilityReviews, setVulnerabilityReviews] = useState<VulnerabilityReviewSummary[]>([]);
    const [permissionAudits, setPermissionAudits] = useState<PermissionAuditSummary[]>([]);
    const [complianceReviews, setComplianceReviews] = useState<ComplianceReviewSummary[]>([]);
    const [adminGuides, setAdminGuides] = useState<AdminGuideSummary[]>([]);
    const [userGuides, setUserGuides] = useState<UserGuideSummary[]>([]);
    const [deploymentGuides, setDeploymentGuides] = useState<DeploymentGuideSummary[]>([]);
    const [launchScoreMetrics, setLaunchScoreMetrics] = useState<LaunchScoreMetricSummary[]>([]);
    const [readinessValidations, setReadinessValidations] = useState<ReadinessValidationSummary[]>([]);
    const [launchBlockers, setLaunchBlockers] = useState<LaunchBlockerSummary[]>([]);
    const [scoreSnapshots, setScoreSnapshots] = useState<ScoreSnapshotSummary[]>([]);
    const [launchHealth, setLaunchHealths] = useState<LaunchHealthSummary[]>([]);
    const [criticalIssues, setCriticalIssues] = useState<CriticalIssueSummary[]>([]);
    const [readinessWarnings, setReadinessWarnings] = useState<ReadinessWarningSummary[]>([]);
    const [launchFailures, setLaunchFailures] = useState<LaunchFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [readinessHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
readinessHubsList,
            environmentValidationsList,
            configurationValidationsList,
            secretsValidationsList,
            deploymentPlansList,
            rollbackPlansList,
            versionRegistryList,
            releaseNotesList,
            backupPoliciesList,
            backupVerificationsList,
            restoreVerificationsList,
            recoveryDrillsList,
            observabilityLogsList,
            observabilityMetricsList,
            traceRecordsList,
            slaMonitorsList,
            securityChecklistsList,
            vulnerabilityReviewsList,
            permissionAuditsList,
            complianceReviewsList,
            adminGuidesList,
            userGuidesList,
            deploymentGuidesList,
            launchScoreMetricsList,
            readinessValidationsList,
            launchBlockersList,
            scoreSnapshotsList,
            launchHealthList,
            criticalIssuesList,
            readinessWarningsList,
            launchFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            launchReadinessService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(launchReadinessService.getPipelineInfo()),
            launchReadinessService.getReadinessHubs(authUserId, email, fullName),
            launchReadinessService.getEnvironmentValidations(authUserId, email, fullName),
            launchReadinessService.getConfigurationValidations(authUserId, email, fullName),
            launchReadinessService.getSecretsValidations(authUserId, email, fullName),
            launchReadinessService.getDeploymentPlans(authUserId, email, fullName),
            launchReadinessService.getRollbackPlans(authUserId, email, fullName),
            launchReadinessService.getVersionRegistrys(authUserId, email, fullName),
            launchReadinessService.getReleaseNotes(authUserId, email, fullName),
            launchReadinessService.getBackupPolicys(authUserId, email, fullName),
            launchReadinessService.getBackupVerifications(authUserId, email, fullName),
            launchReadinessService.getRestoreVerifications(authUserId, email, fullName),
            launchReadinessService.getRecoveryDrills(authUserId, email, fullName),
            launchReadinessService.getObservabilityLogs(authUserId, email, fullName),
            launchReadinessService.getObservabilityMetrics(authUserId, email, fullName),
            launchReadinessService.getTraceRecords(authUserId, email, fullName),
            launchReadinessService.getSlaMonitors(authUserId, email, fullName),
            launchReadinessService.getSecurityChecklists(authUserId, email, fullName),
            launchReadinessService.getVulnerabilityReviews(authUserId, email, fullName),
            launchReadinessService.getPermissionAudits(authUserId, email, fullName),
            launchReadinessService.getComplianceReviews(authUserId, email, fullName),
            launchReadinessService.getAdminGuides(authUserId, email, fullName),
            launchReadinessService.getUserGuides(authUserId, email, fullName),
            launchReadinessService.getDeploymentGuides(authUserId, email, fullName),
            launchReadinessService.getLaunchScoreMetrics(authUserId, email, fullName),
            launchReadinessService.getReadinessValidations(authUserId, email, fullName),
            launchReadinessService.getLaunchBlockers(authUserId, email, fullName),
            launchReadinessService.getScoreSnapshots(authUserId, email, fullName),
            launchReadinessService.getLaunchHealths(authUserId, email, fullName),
            launchReadinessService.getCriticalIssues(authUserId, email, fullName),
            launchReadinessService.getReadinessWarnings(authUserId, email, fullName),
            launchReadinessService.getLaunchFailures(authUserId, email, fullName),
            launchReadinessService.getAuditLogs(authUserId, email, fullName),
            launchReadinessService.getReadinessHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
readinessHubsList,
            environmentValidationsList,
            configurationValidationsList,
            secretsValidationsList,
            deploymentPlansList,
            rollbackPlansList,
            versionRegistryList,
            releaseNotesList,
            backupPoliciesList,
            backupVerificationsList,
            restoreVerificationsList,
            recoveryDrillsList,
            observabilityLogsList,
            observabilityMetricsList,
            traceRecordsList,
            slaMonitorsList,
            securityChecklistsList,
            vulnerabilityReviewsList,
            permissionAuditsList,
            complianceReviewsList,
            adminGuidesList,
            userGuidesList,
            deploymentGuidesList,
            launchScoreMetricsList,
            readinessValidationsList,
            launchBlockersList,
            scoreSnapshotsList,
            launchHealthList,
            criticalIssuesList,
            readinessWarningsList,
            launchFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setReadinessHubs(result.readinessHubsList);
        setEnvironmentValidations(result.environmentValidationsList);
        setConfigurationValidations(result.configurationValidationsList);
        setSecretsValidations(result.secretsValidationsList);
        setDeploymentPlans(result.deploymentPlansList);
        setRollbackPlans(result.rollbackPlansList);
        setVersionRegistrys(result.versionRegistryList);
        setReleaseNotes(result.releaseNotesList);
        setBackupPolicys(result.backupPoliciesList);
        setBackupVerifications(result.backupVerificationsList);
        setRestoreVerifications(result.restoreVerificationsList);
        setRecoveryDrills(result.recoveryDrillsList);
        setObservabilityLogs(result.observabilityLogsList);
        setObservabilityMetrics(result.observabilityMetricsList);
        setTraceRecords(result.traceRecordsList);
        setSlaMonitors(result.slaMonitorsList);
        setSecurityChecklists(result.securityChecklistsList);
        setVulnerabilityReviews(result.vulnerabilityReviewsList);
        setPermissionAudits(result.permissionAuditsList);
        setComplianceReviews(result.complianceReviewsList);
        setAdminGuides(result.adminGuidesList);
        setUserGuides(result.userGuidesList);
        setDeploymentGuides(result.deploymentGuidesList);
        setLaunchScoreMetrics(result.launchScoreMetricsList);
        setReadinessValidations(result.readinessValidationsList);
        setLaunchBlockers(result.launchBlockersList);
        setScoreSnapshots(result.scoreSnapshotsList);
        setLaunchHealths(result.launchHealthList);
        setCriticalIssues(result.criticalIssuesList);
        setReadinessWarnings(result.readinessWarningsList);
        setLaunchFailures(result.launchFailuresList);
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

    const createReadinessHub = useCallback(async (input: CreateReadinessHubInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createReadinessHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEnvironmentValidation = useCallback(async (input: CreateEnvironmentValidationInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createEnvironmentValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createConfigurationValidation = useCallback(async (input: CreateConfigurationValidationInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createConfigurationValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSecretsValidation = useCallback(async (input: CreateSecretsValidationInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createSecretsValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentPlan = useCallback(async (input: CreateDeploymentPlanInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createDeploymentPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRollbackPlan = useCallback(async (input: CreateRollbackPlanInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createRollbackPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVersionRegistry = useCallback(async (input: CreateVersionRegistryInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createVersionRegistry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReleaseNote = useCallback(async (input: CreateReleaseNoteInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createReleaseNote(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBackupPolicy = useCallback(async (input: CreateBackupPolicyInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createBackupPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBackupVerification = useCallback(async (input: CreateBackupVerificationInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createBackupVerification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRestoreVerification = useCallback(async (input: CreateRestoreVerificationInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createRestoreVerification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRecoveryDrill = useCallback(async (input: CreateRecoveryDrillInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createRecoveryDrill(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createObservabilityLog = useCallback(async (input: CreateObservabilityLogInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createObservabilityLog(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createObservabilityMetric = useCallback(async (input: CreateObservabilityMetricInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createObservabilityMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTraceRecord = useCallback(async (input: CreateTraceRecordInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createTraceRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSlaMonitor = useCallback(async (input: CreateSlaMonitorInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createSlaMonitor(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSecurityChecklist = useCallback(async (input: CreateSecurityChecklistInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createSecurityChecklist(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVulnerabilityReview = useCallback(async (input: CreateVulnerabilityReviewInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createVulnerabilityReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPermissionAudit = useCallback(async (input: CreatePermissionAuditInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createPermissionAudit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceReview = useCallback(async (input: CreateComplianceReviewInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createComplianceReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdminGuide = useCallback(async (input: CreateAdminGuideInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createAdminGuide(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUserGuide = useCallback(async (input: CreateUserGuideInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createUserGuide(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentGuide = useCallback(async (input: CreateDeploymentGuideInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createDeploymentGuide(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLaunchScoreMetric = useCallback(async (input: CreateLaunchScoreMetricInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createLaunchScoreMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReadinessValidation = useCallback(async (input: CreateReadinessValidationInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createReadinessValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLaunchBlocker = useCallback(async (input: CreateLaunchBlockerInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createLaunchBlocker(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createScoreSnapshot = useCallback(async (input: CreateScoreSnapshotInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createScoreSnapshot(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLaunchHealth = useCallback(async (input: CreateLaunchHealthInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createLaunchHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCriticalIssue = useCallback(async (input: CreateCriticalIssueInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createCriticalIssue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReadinessWarning = useCallback(async (input: CreateReadinessWarningInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createReadinessWarning(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLaunchFailure = useCallback(async (input: CreateLaunchFailureInput) => { if (!user) throw new Error("Authentication required"); await launchReadinessService.createLaunchFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        readinessHubs,
        createReadinessHub,
        environmentValidations,
        createEnvironmentValidation,
        configurationValidations,
        createConfigurationValidation,
        secretsValidations,
        createSecretsValidation,
        deploymentPlans,
        createDeploymentPlan,
        rollbackPlans,
        createRollbackPlan,
        versionRegistry,
        createVersionRegistry,
        releaseNotes,
        createReleaseNote,
        backupPolicies,
        createBackupPolicy,
        backupVerifications,
        createBackupVerification,
        restoreVerifications,
        createRestoreVerification,
        recoveryDrills,
        createRecoveryDrill,
        observabilityLogs,
        createObservabilityLog,
        observabilityMetrics,
        createObservabilityMetric,
        traceRecords,
        createTraceRecord,
        slaMonitors,
        createSlaMonitor,
        securityChecklists,
        createSecurityChecklist,
        vulnerabilityReviews,
        createVulnerabilityReview,
        permissionAudits,
        createPermissionAudit,
        complianceReviews,
        createComplianceReview,
        adminGuides,
        createAdminGuide,
        userGuides,
        createUserGuide,
        deploymentGuides,
        createDeploymentGuide,
        launchScoreMetrics,
        createLaunchScoreMetric,
        readinessValidations,
        createReadinessValidation,
        launchBlockers,
        createLaunchBlocker,
        scoreSnapshots,
        createScoreSnapshot,
        launchHealth,
        createLaunchHealth,
        criticalIssues,
        createCriticalIssue,
        readinessWarnings,
        createReadinessWarning,
        launchFailures,
        createLaunchFailure,
        auditLogs,
        readinessHubOptions,
        refresh,
    };
}
