export interface ElrDashboardStats {
    totalReadinessHubs: number;
    activeReadinessHubs: number;
    deploymentPlanCount: number;
    backupPolicyCount: number;
    recoveryDrillCount: number;
    openBlockerCount: number;
    openFailureCount: number;
    overallLaunchScore: number;
    securityScore: number;
    reliabilityScore: number;
    performanceScore: number;
    documentationScore: number;
    operationalScore: number;
    auditCount: number;
}

export interface ElrPipelineInfo {
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

export interface ElrSdkValidateEnvironmentInput { readinessHubId: string; validationKey?: string; validationType?: string; }
export interface ElrSdkValidateEnvironmentResult { validationId: string; validationKey: string; status: string; }
export interface ElrSdkRunDeploymentCheckInput { readinessHubId: string; planKey?: string; planName?: string; }
export interface ElrSdkRunDeploymentCheckResult { planId: string; planKey: string; status: string; }
export interface ElrSdkRunRecoveryDrillInput { readinessHubId: string; drillKey?: string; drillType?: string; }
export interface ElrSdkRunRecoveryDrillResult { drillId: string; drillKey: string; status: string; }

export interface ReadinessHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateReadinessHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface EnvironmentValidationSummary {
    id: string;
    hubName?: string;
        validationKey: string;
    validationType: string;
    validationScore: number;
    status: string;
}

export interface CreateEnvironmentValidationInput {
        readinessHubId: string;
        validationKey?: string;
    validationType?: string;
    validationScore?: number;
}

export interface ConfigurationValidationSummary {
    id: string;
    hubName?: string;
        validationKey: string;
    configType: string;
    validationScore: number;
    status: string;
}

export interface CreateConfigurationValidationInput {
        readinessHubId: string;
        validationKey?: string;
    configType?: string;
    validationScore?: number;
}

export interface SecretsValidationSummary {
    id: string;
    hubName?: string;
        validationKey: string;
    secretType: string;
    validationScore: number;
    status: string;
}

export interface CreateSecretsValidationInput {
        readinessHubId: string;
        validationKey?: string;
    secretType?: string;
    validationScore?: number;
}

export interface DeploymentPlanSummary {
    id: string;
    hubName?: string;
        planKey: string;
    planName: string;
    targetVersion: string;
    status: string;
}

export interface CreateDeploymentPlanInput {
        readinessHubId: string;
        planKey?: string;
    planName?: string;
    targetVersion?: string;
}

export interface RollbackPlanSummary {
    id: string;
    hubName?: string;
        planKey: string;
    rollbackVersion: string;
    rollbackReason: string;
    status: string;
}

export interface CreateRollbackPlanInput {
        readinessHubId: string;
        planKey?: string;
    rollbackVersion?: string;
    rollbackReason?: string;
}

export interface VersionRegistrySummary {
    id: string;
    hubName?: string;
        versionKey: string;
    versionNumber: string;
    releaseChannel: string;
    status: string;
}

export interface CreateVersionRegistryInput {
        readinessHubId: string;
        versionKey?: string;
    versionNumber?: string;
    releaseChannel?: string;
}

export interface ReleaseNoteSummary {
    id: string;
    hubName?: string;
        noteKey: string;
    versionRef: string;
    noteSummary: string;
    status: string;
}

export interface CreateReleaseNoteInput {
        readinessHubId: string;
        noteKey?: string;
    versionRef?: string;
    noteSummary?: string;
}

export interface BackupPolicySummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    retentionDays: number;
    status: string;
}

export interface CreateBackupPolicyInput {
        readinessHubId: string;
        policyKey?: string;
    policyName?: string;
    retentionDays?: number;
}

export interface BackupVerificationSummary {
    id: string;
    hubName?: string;
        verificationKey: string;
    backupRef: string;
    verificationScore: number;
    status: string;
}

export interface CreateBackupVerificationInput {
        readinessHubId: string;
        verificationKey?: string;
    backupRef?: string;
    verificationScore?: number;
}

export interface RestoreVerificationSummary {
    id: string;
    hubName?: string;
        verificationKey: string;
    restoreRef: string;
    verificationScore: number;
    status: string;
}

export interface CreateRestoreVerificationInput {
        readinessHubId: string;
        verificationKey?: string;
    restoreRef?: string;
    verificationScore?: number;
}

export interface RecoveryDrillSummary {
    id: string;
    hubName?: string;
        drillKey: string;
    drillType: string;
    drillScore: number;
    status: string;
}

export interface CreateRecoveryDrillInput {
        readinessHubId: string;
        drillKey?: string;
    drillType?: string;
    drillScore?: number;
}

export interface ObservabilityLogSummary {
    id: string;
    hubName?: string;
        logKey: string;
    logLevel: string;
    logSource: string;
    status: string;
}

export interface CreateObservabilityLogInput {
        readinessHubId: string;
        logKey?: string;
    logLevel?: string;
    logSource?: string;
}

export interface ObservabilityMetricSummary {
    id: string;
    hubName?: string;
        metricKey: string;
    metricName: string;
    metricValue: number;
    status: string;
}

export interface CreateObservabilityMetricInput {
        readinessHubId: string;
        metricKey?: string;
    metricName?: string;
    metricValue?: number;
}

export interface TraceRecordSummary {
    id: string;
    hubName?: string;
        traceKey: string;
    traceName: string;
    latencyMs: number;
    status: string;
}

export interface CreateTraceRecordInput {
        readinessHubId: string;
        traceKey?: string;
    traceName?: string;
    latencyMs?: number;
}

export interface SlaMonitorSummary {
    id: string;
    hubName?: string;
        monitorKey: string;
    slaTarget: number;
    currentValue: number;
    status: string;
}

export interface CreateSlaMonitorInput {
        readinessHubId: string;
        monitorKey?: string;
    slaTarget?: number;
    currentValue?: number;
}

export interface SecurityChecklistSummary {
    id: string;
    hubName?: string;
        checklistKey: string;
    checklistName: string;
    completionScore: number;
    status: string;
}

export interface CreateSecurityChecklistInput {
        readinessHubId: string;
        checklistKey?: string;
    checklistName?: string;
    completionScore?: number;
}

export interface VulnerabilityReviewSummary {
    id: string;
    hubName?: string;
        reviewKey: string;
    vulnerabilityRef: string;
    severity: string;
    status: string;
}

export interface CreateVulnerabilityReviewInput {
        readinessHubId: string;
        reviewKey?: string;
    vulnerabilityRef?: string;
    severity?: string;
}

export interface PermissionAuditSummary {
    id: string;
    hubName?: string;
        auditKey: string;
    auditScope: string;
    findingCount: number;
    status: string;
}

export interface CreatePermissionAuditInput {
        readinessHubId: string;
        auditKey?: string;
    auditScope?: string;
    findingCount?: number;
}

export interface ComplianceReviewSummary {
    id: string;
    hubName?: string;
        reviewKey: string;
    complianceType: string;
    reviewScore: number;
    status: string;
}

export interface CreateComplianceReviewInput {
        readinessHubId: string;
        reviewKey?: string;
    complianceType?: string;
    reviewScore?: number;
}

export interface AdminGuideSummary {
    id: string;
    hubName?: string;
        guideKey: string;
    guideTitle: string;
    guideVersion: string;
    status: string;
}

export interface CreateAdminGuideInput {
        readinessHubId: string;
        guideKey?: string;
    guideTitle?: string;
    guideVersion?: string;
}

export interface UserGuideSummary {
    id: string;
    hubName?: string;
        guideKey: string;
    guideTitle: string;
    guideVersion: string;
    status: string;
}

export interface CreateUserGuideInput {
        readinessHubId: string;
        guideKey?: string;
    guideTitle?: string;
    guideVersion?: string;
}

export interface DeploymentGuideSummary {
    id: string;
    hubName?: string;
        guideKey: string;
    guideTitle: string;
    guideVersion: string;
    status: string;
}

export interface CreateDeploymentGuideInput {
        readinessHubId: string;
        guideKey?: string;
    guideTitle?: string;
    guideVersion?: string;
}

export interface LaunchScoreMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    securityScore: number;
    overallLaunchScore: number;
    status: string;
}

export interface CreateLaunchScoreMetricInput {
        metricsKey?: string;
    securityScore?: number;
    overallLaunchScore?: number;
}

export interface ReadinessValidationSummary {
    id: string;
    hubName?: string;
        validationKey: string;
    validationType: string;
    validationScore: number;
    status: string;
}

export interface CreateReadinessValidationInput {
        readinessHubId: string;
        validationKey?: string;
    validationType?: string;
    validationScore?: number;
}

export interface LaunchBlockerSummary {
    id: string;
    hubName?: string;
        blockerKey: string;
    blockerTitle: string;
    blockerSeverity: string;
    status: string;
}

export interface CreateLaunchBlockerInput {
        readinessHubId: string;
        blockerKey?: string;
    blockerTitle?: string;
    blockerSeverity?: string;
}

export interface ScoreSnapshotSummary {
    id: string;
    hubName?: string;
        snapshotKey: string;
    snapshotDate: string;
    overallLaunchScore: number;
    status: string;
}

export interface CreateScoreSnapshotInput {
        readinessHubId: string;
        snapshotKey?: string;
    snapshotDate?: string;
    overallLaunchScore?: number;
}

export interface LaunchHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateLaunchHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface CriticalIssueSummary {
    id: string;
    hubName?: string;
        issueKey: string;
    issueTitle: string;
    issueSeverity: string;
    status: string;
}

export interface CreateCriticalIssueInput {
        readinessHubId: string;
        issueKey?: string;
    issueTitle?: string;
    issueSeverity?: string;
}

export interface ReadinessWarningSummary {
    id: string;
    hubName?: string;
        warningKey: string;
    warningType: string;
    warningMessage: string;
    status: string;
}

export interface CreateReadinessWarningInput {
        readinessHubId: string;
        warningKey?: string;
    warningType?: string;
    warningMessage?: string;
}

export interface LaunchFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateLaunchFailureInput {
        readinessHubId: string;
        failureKey?: string;
    failureType?: string;
}

