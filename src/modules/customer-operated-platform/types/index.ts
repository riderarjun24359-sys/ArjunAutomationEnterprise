export interface CopDashboardStats {
    totalOperatedHubs: number;
    activeOperatedHubs: number;
    signupFlowCount: number;
    deploymentJobCount: number;
    productionProfileCount: number;
    centralLogCount: number;
    openPlatformFailureCount: number;
    overallOperatedScore: number;
    productionStatusScore: number;
    onboardingCompletionRate: number;
    revenueToday: number;
    activeIncidentCount: number;
    pendingApprovalCount: number;
    platformAvailabilityScore: number;
    customerSatisfactionScore: number;
    auditCount: number;
}

export interface CopPipelineInfo {
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

export interface CopSdkLaunchOnboardingInput { operatedHubId: string; flowKey?: string; flowName?: string; }
export interface CopSdkLaunchOnboardingResult { flowId: string; flowKey: string; status: string; }
export interface CopSdkDeployProductionInput { operatedHubId: string; jobKey?: string; jobName?: string; }
export interface CopSdkDeployProductionResult { jobId: string; jobKey: string; status: string; }
export interface CopSdkMonitorPlatformInput { operatedHubId: string; wizardKey?: string; wizardName?: string; }
export interface CopSdkMonitorPlatformResult { wizardId: string; wizardKey: string; status: string; }

export interface OperatedHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateOperatedHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface SignupFlowSummary {
    id: string;
    hubName?: string;
        flowKey: string;
    flowName: string;
    flowStatus: string;
    status: string;
}

export interface CreateSignupFlowInput {
        operatedHubId: string;
        flowKey?: string;
    flowName?: string;
    flowStatus?: string;
}

export interface OrgProvisioningSummary {
    id: string;
    hubName?: string;
        provisionKey: string;
    provisionName: string;
    provisionStatus: string;
    status: string;
}

export interface CreateOrgProvisioningInput {
        operatedHubId: string;
        provisionKey?: string;
    provisionName?: string;
    provisionStatus?: string;
}

export interface DomainOnboardingSummary {
    id: string;
    hubName?: string;
        domainKey: string;
    domainName: string;
    domainStatus: string;
    status: string;
}

export interface CreateDomainOnboardingInput {
        operatedHubId: string;
        domainKey?: string;
    domainName?: string;
    domainStatus?: string;
}

export interface EmailVerificationSummary {
    id: string;
    hubName?: string;
        verificationKey: string;
    emailAddress: string;
    verificationStatus: string;
    status: string;
}

export interface CreateEmailVerificationInput {
        operatedHubId: string;
        verificationKey?: string;
    emailAddress?: string;
    verificationStatus?: string;
}

export interface OnboardingWizardSummary {
    id: string;
    hubName?: string;
        wizardKey: string;
    wizardName: string;
    wizardStatus: string;
    status: string;
}

export interface CreateOnboardingWizardInput {
        operatedHubId: string;
        wizardKey?: string;
    wizardName?: string;
    wizardStatus?: string;
}

export interface ProductionProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    profileStatus: string;
    status: string;
}

export interface CreateProductionProfileInput {
        operatedHubId: string;
        profileKey?: string;
    profileName?: string;
    profileStatus?: string;
}

export interface DeploymentJobSummary {
    id: string;
    hubName?: string;
        jobKey: string;
    jobName: string;
    jobStatus: string;
    status: string;
}

export interface CreateDeploymentJobInput {
        operatedHubId: string;
        jobKey?: string;
    jobName?: string;
    jobStatus?: string;
}

export interface HealthValidationSummary {
    id: string;
    hubName?: string;
        validationKey: string;
    validationName: string;
    validationStatus: string;
    status: string;
}

export interface CreateHealthValidationInput {
        operatedHubId: string;
        validationKey?: string;
    validationName?: string;
    validationStatus?: string;
}

export interface RollbackAutomationSummary {
    id: string;
    hubName?: string;
        rollbackKey: string;
    rollbackName: string;
    rollbackStatus: string;
    status: string;
}

export interface CreateRollbackAutomationInput {
        operatedHubId: string;
        rollbackKey?: string;
    rollbackName?: string;
    rollbackStatus?: string;
}

export interface DeploymentAuditSummary {
    id: string;
    hubName?: string;
        auditKey: string;
    auditName: string;
    auditStatus: string;
    status: string;
}

export interface CreateDeploymentAuditInput {
        operatedHubId: string;
        auditKey?: string;
    auditName?: string;
    auditStatus?: string;
}

export interface CentralLogSummary {
    id: string;
    hubName?: string;
        logKey: string;
    logSource: string;
    logLevel: string;
    status: string;
}

export interface CreateCentralLogInput {
        operatedHubId: string;
        logKey?: string;
    logSource?: string;
    logLevel?: string;
}

export interface MetricsCollectorSummary {
    id: string;
    hubName?: string;
        collectorKey: string;
    collectorName: string;
    collectorStatus: string;
    status: string;
}

export interface CreateMetricsCollectorInput {
        operatedHubId: string;
        collectorKey?: string;
    collectorName?: string;
    collectorStatus?: string;
}

export interface DistributedTraceSummary {
    id: string;
    hubName?: string;
        traceKey: string;
    traceName: string;
    traceStatus: string;
    status: string;
}

export interface CreateDistributedTraceInput {
        operatedHubId: string;
        traceKey?: string;
    traceName?: string;
    traceStatus?: string;
}

export interface AlertRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    severity: string;
    status: string;
}

export interface CreateAlertRuleInput {
        operatedHubId: string;
        ruleKey?: string;
    ruleName?: string;
    severity?: string;
}

export interface IncidentTimelineSummary {
    id: string;
    hubName?: string;
        incidentKey: string;
    incidentTitle: string;
    incidentStatus: string;
    status: string;
}

export interface CreateIncidentTimelineInput {
        operatedHubId: string;
        incidentKey?: string;
    incidentTitle?: string;
    incidentStatus?: string;
}

export interface BackupSchedulerSummary {
    id: string;
    hubName?: string;
        scheduleKey: string;
    scheduleName: string;
    scheduleStatus: string;
    status: string;
}

export interface CreateBackupSchedulerInput {
        operatedHubId: string;
        scheduleKey?: string;
    scheduleName?: string;
    scheduleStatus?: string;
}

export interface RestoreValidationSummary {
    id: string;
    hubName?: string;
        restoreKey: string;
    restoreName: string;
    restoreStatus: string;
    status: string;
}

export interface CreateRestoreValidationInput {
        operatedHubId: string;
        restoreKey?: string;
    restoreName?: string;
    restoreStatus?: string;
}

export interface MaintenanceModeSummary {
    id: string;
    hubName?: string;
        maintenanceKey: string;
    maintenanceName: string;
    maintenanceStatus: string;
    status: string;
}

export interface CreateMaintenanceModeInput {
        operatedHubId: string;
        maintenanceKey?: string;
    maintenanceName?: string;
    maintenanceStatus?: string;
}

export interface FeatureFlagOpSummary {
    id: string;
    hubName?: string;
        flagKey: string;
    flagName: string;
    flagStatus: string;
    status: string;
}

export interface CreateFeatureFlagOpInput {
        operatedHubId: string;
        flagKey?: string;
    flagName?: string;
    flagStatus?: string;
}

export interface PlatformDiagnosticSummary {
    id: string;
    hubName?: string;
        diagnosticKey: string;
    diagnosticName: string;
    diagnosticStatus: string;
    status: string;
}

export interface CreatePlatformDiagnosticInput {
        operatedHubId: string;
        diagnosticKey?: string;
    diagnosticName?: string;
    diagnosticStatus?: string;
}

export interface BetaOrganizationSummary {
    id: string;
    hubName?: string;
        orgKey: string;
    orgName: string;
    betaStatus: string;
    status: string;
}

export interface CreateBetaOrganizationInput {
        operatedHubId: string;
        orgKey?: string;
    orgName?: string;
    betaStatus?: string;
}

export interface BetaInvitationSummary {
    id: string;
    hubName?: string;
        invitationKey: string;
    inviteeEmail: string;
    invitationStatus: string;
    status: string;
}

export interface CreateBetaInvitationInput {
        operatedHubId: string;
        invitationKey?: string;
    inviteeEmail?: string;
    invitationStatus?: string;
}

export interface FeedbackCollectionSummary {
    id: string;
    hubName?: string;
        feedbackKey: string;
    feedbackTitle: string;
    feedbackType: string;
    status: string;
}

export interface CreateFeedbackCollectionInput {
        operatedHubId: string;
        feedbackKey?: string;
    feedbackTitle?: string;
    feedbackType?: string;
}

export interface FeatureRequestSummary {
    id: string;
    hubName?: string;
        requestKey: string;
    requestTitle: string;
    requestStatus: string;
    status: string;
}

export interface CreateFeatureRequestInput {
        operatedHubId: string;
        requestKey?: string;
    requestTitle?: string;
    requestStatus?: string;
}

export interface BugReportSummary {
    id: string;
    hubName?: string;
        bugKey: string;
    bugTitle: string;
    bugStatus: string;
    status: string;
}

export interface CreateBugReportInput {
        operatedHubId: string;
        bugKey?: string;
    bugTitle?: string;
    bugStatus?: string;
}

export interface ReleaseChannelSummary {
    id: string;
    hubName?: string;
        channelKey: string;
    channelName: string;
    channelStatus: string;
    status: string;
}

export interface CreateReleaseChannelInput {
        operatedHubId: string;
        channelKey?: string;
    channelName?: string;
    channelStatus?: string;
}

export interface OperatedMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    productionStatusScore: number;
    overallOperatedScore: number;
    status: string;
}

export interface CreateOperatedMetricInput {
        metricsKey?: string;
    productionStatusScore?: number;
    overallOperatedScore?: number;
}

export interface OperatedHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateOperatedHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface ExecutiveBriefingSummary {
    id: string;
    hubName?: string;
        briefingKey: string;
    briefingTitle: string;
    briefingType: string;
    status: string;
}

export interface CreateExecutiveBriefingInput {
        operatedHubId: string;
        briefingKey?: string;
    briefingTitle?: string;
    briefingType?: string;
}

export interface PlatformFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreatePlatformFailureInput {
        operatedHubId: string;
        failureKey?: string;
    failureType?: string;
}

