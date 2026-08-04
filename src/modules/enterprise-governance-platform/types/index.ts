export interface EgpDashboardStats {
    totalGovernanceHubs: number;
    activeGovernanceHubs: number;
    organizationGovernanceCount: number;
    complianceControlCount: number;
    auditFindingCount: number;
    riskRegisterCount: number;
    dataClassificationCount: number;
    openGovernanceFailureCount: number;
    overallGovernanceScore: number;
    governanceHealthScore: number;
    complianceScore: number;
    enterpriseRiskScore: number;
    auditSummaryScore: number;
    dataGovernanceHealthScore: number;
    auditCount: number;
}

export interface EgpPipelineInfo {
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

export interface EgpSdkRunGovernanceServiceInput { governanceHubId: string; governanceKey?: string; governanceName?: string; }
export interface EgpSdkRunGovernanceServiceResult { governanceId: string; governanceKey: string; status: string; }
export interface EgpSdkRunComplianceServiceInput { governanceHubId: string; controlKey?: string; controlName?: string; }
export interface EgpSdkRunComplianceServiceResult { controlId: string; controlKey: string; status: string; }
export interface EgpSdkRunAuditServiceInput { governanceHubId: string; findingKey?: string; findingTitle?: string; }
export interface EgpSdkRunAuditServiceResult { findingId: string; findingKey: string; status: string; }
export interface EgpSdkRunDataGovernanceServiceInput { governanceHubId: string; classificationKey?: string; classificationName?: string; }
export interface EgpSdkRunDataGovernanceServiceResult { classificationId: string; classificationKey: string; status: string; }
export interface EgpSdkRunRiskManagementServiceInput { governanceHubId: string; riskKey?: string; riskTitle?: string; }
export interface EgpSdkRunRiskManagementServiceResult { riskId: string; riskKey: string; status: string; }
export interface EgpSdkRunDashboardServiceInput { governanceHubId: string; dashboardKey?: string; dashboardName?: string; }
export interface EgpSdkRunDashboardServiceResult { dashboardId: string; dashboardKey: string; status: string; }

export interface GovernanceHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateGovernanceHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface OrganizationGovernanceSummary {
    id: string;
    hubName?: string;
        governanceKey: string;
    governanceName: string;
    governanceStatus: string;
    status: string;
}

export interface CreateOrganizationGovernanceInput {
        governanceHubId: string;
        governanceKey?: string;
    governanceName?: string;
    governanceStatus?: string;
}

export interface GovernancePolicySummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    policyStatus: string;
    status: string;
}

export interface CreateGovernancePolicyInput {
        governanceHubId: string;
        policyKey?: string;
    policyName?: string;
    policyStatus?: string;
}

export interface GovernanceFrameworkSummary {
    id: string;
    hubName?: string;
        frameworkKey: string;
    frameworkName: string;
    frameworkStatus: string;
    status: string;
}

export interface CreateGovernanceFrameworkInput {
        governanceHubId: string;
        frameworkKey?: string;
    frameworkName?: string;
    frameworkStatus?: string;
}

export interface GovernanceReviewSummary {
    id: string;
    hubName?: string;
        reviewKey: string;
    reviewTitle: string;
    reviewStatus: string;
    status: string;
}

export interface CreateGovernanceReviewInput {
        governanceHubId: string;
        reviewKey?: string;
    reviewTitle?: string;
    reviewStatus?: string;
}

export interface GovernanceDashboardSummary {
    id: string;
    hubName?: string;
        dashboardKey: string;
    dashboardName: string;
    dashboardStatus: string;
    status: string;
}

export interface CreateGovernanceDashboardInput {
        governanceHubId: string;
        dashboardKey?: string;
    dashboardName?: string;
    dashboardStatus?: string;
}

export interface ComplianceFrameworkSummary {
    id: string;
    hubName?: string;
        frameworkKey: string;
    frameworkName: string;
    frameworkStatus: string;
    status: string;
}

export interface CreateComplianceFrameworkInput {
        governanceHubId: string;
        frameworkKey?: string;
    frameworkName?: string;
    frameworkStatus?: string;
}

export interface ComplianceControlSummary {
    id: string;
    hubName?: string;
        controlKey: string;
    controlName: string;
    controlStatus: string;
    status: string;
}

export interface CreateComplianceControlInput {
        governanceHubId: string;
        controlKey?: string;
    controlName?: string;
    controlStatus?: string;
}

export interface ComplianceEvidenceSummary {
    id: string;
    hubName?: string;
        evidenceKey: string;
    evidenceTitle: string;
    evidenceStatus: string;
    status: string;
}

export interface CreateComplianceEvidenceInput {
        governanceHubId: string;
        evidenceKey?: string;
    evidenceTitle?: string;
    evidenceStatus?: string;
}

export interface ComplianceReportSummary {
    id: string;
    hubName?: string;
        reportKey: string;
    reportTitle: string;
    reportStatus: string;
    status: string;
}

export interface CreateComplianceReportInput {
        governanceHubId: string;
        reportKey?: string;
    reportTitle?: string;
    reportStatus?: string;
}

export interface ComplianceCalendarSummary {
    id: string;
    hubName?: string;
        calendarKey: string;
    calendarName: string;
    calendarStatus: string;
    status: string;
}

export interface CreateComplianceCalendarInput {
        governanceHubId: string;
        calendarKey?: string;
    calendarName?: string;
    calendarStatus?: string;
}

export interface AuditCenterSummary {
    id: string;
    hubName?: string;
        auditKey: string;
    auditName: string;
    auditStatus: string;
    status: string;
}

export interface CreateAuditCenterInput {
        governanceHubId: string;
        auditKey?: string;
    auditName?: string;
    auditStatus?: string;
}

export interface AuditFindingSummary {
    id: string;
    hubName?: string;
        findingKey: string;
    findingTitle: string;
    findingSeverity: string;
    status: string;
}

export interface CreateAuditFindingInput {
        governanceHubId: string;
        findingKey?: string;
    findingTitle?: string;
    findingSeverity?: string;
}

export interface CorrectiveActionSummary {
    id: string;
    hubName?: string;
        actionKey: string;
    actionTitle: string;
    actionStatus: string;
    status: string;
}

export interface CreateCorrectiveActionInput {
        governanceHubId: string;
        actionKey?: string;
    actionTitle?: string;
    actionStatus?: string;
}

export interface AuditEvidenceSummary {
    id: string;
    hubName?: string;
        evidenceKey: string;
    evidenceTitle: string;
    evidenceStatus: string;
    status: string;
}

export interface CreateAuditEvidenceInput {
        governanceHubId: string;
        evidenceKey?: string;
    evidenceTitle?: string;
    evidenceStatus?: string;
}

export interface AuditAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsName: string;
    analyticsScore: number;
    status: string;
}

export interface CreateAuditAnalyticsInput {
        governanceHubId: string;
        analyticsKey?: string;
    analyticsName?: string;
    analyticsScore?: number;
}

export interface DataClassificationSummary {
    id: string;
    hubName?: string;
        classificationKey: string;
    classificationName: string;
    classificationLevel: string;
    status: string;
}

export interface CreateDataClassificationInput {
        governanceHubId: string;
        classificationKey?: string;
    classificationName?: string;
    classificationLevel?: string;
}

export interface RetentionPolicySummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    policyStatus: string;
    status: string;
}

export interface CreateRetentionPolicyInput {
        governanceHubId: string;
        policyKey?: string;
    policyName?: string;
    policyStatus?: string;
}

export interface DataLifecycleSummary {
    id: string;
    hubName?: string;
        lifecycleKey: string;
    lifecycleName: string;
    lifecycleStage: string;
    status: string;
}

export interface CreateDataLifecycleInput {
        governanceHubId: string;
        lifecycleKey?: string;
    lifecycleName?: string;
    lifecycleStage?: string;
}

export interface DataOwnershipSummary {
    id: string;
    hubName?: string;
        ownershipKey: string;
    ownershipName: string;
    ownershipStatus: string;
    status: string;
}

export interface CreateDataOwnershipInput {
        governanceHubId: string;
        ownershipKey?: string;
    ownershipName?: string;
    ownershipStatus?: string;
}

export interface DataQualitySummary {
    id: string;
    hubName?: string;
        qualityKey: string;
    qualityName: string;
    qualityScore: number;
    status: string;
}

export interface CreateDataQualityInput {
        governanceHubId: string;
        qualityKey?: string;
    qualityName?: string;
    qualityScore?: number;
}

export interface RiskRegisterSummary {
    id: string;
    hubName?: string;
        riskKey: string;
    riskTitle: string;
    riskSeverity: string;
    status: string;
}

export interface CreateRiskRegisterInput {
        governanceHubId: string;
        riskKey?: string;
    riskTitle?: string;
    riskSeverity?: string;
}

export interface RiskAssessmentSummary {
    id: string;
    hubName?: string;
        assessmentKey: string;
    assessmentTitle: string;
    assessmentScore: number;
    status: string;
}

export interface CreateRiskAssessmentInput {
        governanceHubId: string;
        assessmentKey?: string;
    assessmentTitle?: string;
    assessmentScore?: number;
}

export interface RiskMitigationSummary {
    id: string;
    hubName?: string;
        mitigationKey: string;
    mitigationTitle: string;
    mitigationStatus: string;
    status: string;
}

export interface CreateRiskMitigationInput {
        governanceHubId: string;
        mitigationKey?: string;
    mitigationTitle?: string;
    mitigationStatus?: string;
}

export interface RiskMonitoringSummary {
    id: string;
    hubName?: string;
        monitoringKey: string;
    monitoringName: string;
    monitoringStatus: string;
    status: string;
}

export interface CreateRiskMonitoringInput {
        governanceHubId: string;
        monitoringKey?: string;
    monitoringName?: string;
    monitoringStatus?: string;
}

export interface BusinessContinuitySummary {
    id: string;
    hubName?: string;
        continuityKey: string;
    continuityName: string;
    continuityStatus: string;
    status: string;
}

export interface CreateBusinessContinuityInput {
        governanceHubId: string;
        continuityKey?: string;
    continuityName?: string;
    continuityStatus?: string;
}

export interface GovernanceMetricSummary {
    id: string;
    hubName?: string;
    metricsKey: string;
    overallGovernanceScore: number;
    complianceScore: number;
    status: string;
}

export interface CreateGovernanceMetricInput {
    metricsKey?: string;
    overallGovernanceScore?: number;
    complianceScore?: number;
}

export interface GovernanceHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateGovernanceHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface ComplianceDashboardSummary {
    id: string;
    hubName?: string;
        dashboardKey: string;
    dashboardName: string;
    dashboardStatus: string;
    status: string;
}

export interface CreateComplianceDashboardInput {
        governanceHubId: string;
        dashboardKey?: string;
    dashboardName?: string;
    dashboardStatus?: string;
}

export interface MissionProgressSummary {
    id: string;
    hubName?: string;
        progressKey: string;
    progressName: string;
    progressPercent: number;
    status: string;
}

export interface CreateMissionProgressInput {
        governanceHubId: string;
        progressKey?: string;
    progressName?: string;
    progressPercent?: number;
}

export interface GovernanceFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateGovernanceFailureInput {
        governanceHubId: string;
        failureKey?: string;
    failureType?: string;
}

