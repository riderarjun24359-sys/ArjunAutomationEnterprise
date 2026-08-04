import type { DbEgpGovernanceHub,
    DbEgpOrganizationGovernance,
    DbEgpGovernancePolicy,
    DbEgpGovernanceFramework,
    DbEgpGovernanceReview,
    DbEgpGovernanceDashboard,
    DbEgpComplianceFramework,
    DbEgpComplianceControl,
    DbEgpComplianceEvidence,
    DbEgpComplianceReport,
    DbEgpComplianceCalendar,
    DbEgpAuditCenter,
    DbEgpAuditFinding,
    DbEgpCorrectiveAction,
    DbEgpAuditEvidence,
    DbEgpAuditAnalytics,
    DbEgpDataClassification,
    DbEgpRetentionPolicy,
    DbEgpDataLifecycle,
    DbEgpDataOwnership,
    DbEgpDataQuality,
    DbEgpRiskRegister,
    DbEgpRiskAssessment,
    DbEgpRiskMitigation,
    DbEgpRiskMonitoring,
    DbEgpBusinessContinuity,
    DbEgpGovernanceMetric,
    DbEgpGovernanceHealth,
    DbEgpComplianceDashboard,
    DbEgpMissionProgress,
    DbEgpGovernanceFailure,
    DbEgpAuditLog } from "@/src/modules/database/types/platform";
import type { CreateGovernanceHubInput,
    GovernanceHubSummary,
    CreateOrganizationGovernanceInput,
    OrganizationGovernanceSummary,
    CreateGovernancePolicyInput,
    GovernancePolicySummary,
    CreateGovernanceFrameworkInput,
    GovernanceFrameworkSummary,
    CreateGovernanceReviewInput,
    GovernanceReviewSummary,
    CreateGovernanceDashboardInput,
    GovernanceDashboardSummary,
    CreateComplianceFrameworkInput,
    ComplianceFrameworkSummary,
    CreateComplianceControlInput,
    ComplianceControlSummary,
    CreateComplianceEvidenceInput,
    ComplianceEvidenceSummary,
    CreateComplianceReportInput,
    ComplianceReportSummary,
    CreateComplianceCalendarInput,
    ComplianceCalendarSummary,
    CreateAuditCenterInput,
    AuditCenterSummary,
    CreateAuditFindingInput,
    AuditFindingSummary,
    CreateCorrectiveActionInput,
    CorrectiveActionSummary,
    CreateAuditEvidenceInput,
    AuditEvidenceSummary,
    CreateAuditAnalyticsInput,
    AuditAnalyticsSummary,
    CreateDataClassificationInput,
    DataClassificationSummary,
    CreateRetentionPolicyInput,
    RetentionPolicySummary,
    CreateDataLifecycleInput,
    DataLifecycleSummary,
    CreateDataOwnershipInput,
    DataOwnershipSummary,
    CreateDataQualityInput,
    DataQualitySummary,
    CreateRiskRegisterInput,
    RiskRegisterSummary,
    CreateRiskAssessmentInput,
    RiskAssessmentSummary,
    CreateRiskMitigationInput,
    RiskMitigationSummary,
    CreateRiskMonitoringInput,
    RiskMonitoringSummary,
    CreateBusinessContinuityInput,
    BusinessContinuitySummary,
    CreateGovernanceMetricInput,
    GovernanceMetricSummary,
    CreateGovernanceHealthInput,
    GovernanceHealthSummary,
    CreateComplianceDashboardInput,
    ComplianceDashboardSummary,
    CreateMissionProgressInput,
    MissionProgressSummary,
    CreateGovernanceFailureInput,
    GovernanceFailureSummary,
    EgpDashboardStats,
    EgpPipelineInfo,
    AuditEntry } from "@/src/modules/enterprise-governance-platform/types";

export function buildGovernanceHubLookupMaps(hubs: DbEgpGovernanceHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildEgpPipelineInfo(): EgpPipelineInfo {
    const stages = [
        { key: "governance", label: "Governance" },
        { key: "compliance", label: "Compliance" },
        { key: "audit", label: "Audit" },
        { key: "data_governance", label: "Data Governance" },
        { key: "dashboard", label: "Risk Management" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "compliance", nextStage: "audit", previousStage: "governance" };
}

export function buildEgpAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbEgpAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapGovernanceHubSummary(record: DbEgpGovernanceHub): GovernanceHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildGovernanceHubPayload(organizationId: string, input: CreateGovernanceHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapOrganizationGovernanceSummary(record: DbEgpOrganizationGovernance, maps?: { hubNameById: Map<string, string> }): OrganizationGovernanceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        governanceKey: record.governance_key as string,
        governanceName: record.governance_name as string,
        governanceStatus: record.governance_status as string,
        status: record.status,
    };
}

export function buildOrganizationGovernancePayload(organizationId: string, input: CreateOrganizationGovernanceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        governance_key: input.governanceKey ?? '',
        governance_name: input.governanceName ?? '',
        governance_status: input.governanceStatus ?? '',
        status: "active",
    };
}

export function mapGovernancePolicySummary(record: DbEgpGovernancePolicy, maps?: { hubNameById: Map<string, string> }): GovernancePolicySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        policyStatus: record.policy_status as string,
        status: record.status,
    };
}

export function buildGovernancePolicyPayload(organizationId: string, input: CreateGovernancePolicyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        policy_status: input.policyStatus ?? '',
        status: "active",
    };
}

export function mapGovernanceFrameworkSummary(record: DbEgpGovernanceFramework, maps?: { hubNameById: Map<string, string> }): GovernanceFrameworkSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        frameworkKey: record.framework_key as string,
        frameworkName: record.framework_name as string,
        frameworkStatus: record.framework_status as string,
        status: record.status,
    };
}

export function buildGovernanceFrameworkPayload(organizationId: string, input: CreateGovernanceFrameworkInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        framework_key: input.frameworkKey ?? '',
        framework_name: input.frameworkName ?? '',
        framework_status: input.frameworkStatus ?? '',
        status: "active",
    };
}

export function mapGovernanceReviewSummary(record: DbEgpGovernanceReview, maps?: { hubNameById: Map<string, string> }): GovernanceReviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reviewKey: record.review_key as string,
        reviewTitle: record.review_title as string,
        reviewStatus: record.review_status as string,
        status: record.status,
    };
}

export function buildGovernanceReviewPayload(organizationId: string, input: CreateGovernanceReviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        review_key: input.reviewKey ?? '',
        review_title: input.reviewTitle ?? '',
        review_status: input.reviewStatus ?? '',
        status: "active",
    };
}

export function mapGovernanceDashboardSummary(record: DbEgpGovernanceDashboard, maps?: { hubNameById: Map<string, string> }): GovernanceDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dashboardKey: record.dashboard_key as string,
        dashboardName: record.dashboard_name as string,
        dashboardStatus: record.dashboard_status as string,
        status: record.status,
    };
}

export function buildGovernanceDashboardPayload(organizationId: string, input: CreateGovernanceDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        dashboard_key: input.dashboardKey ?? '',
        dashboard_name: input.dashboardName ?? '',
        dashboard_status: input.dashboardStatus ?? '',
        status: "active",
    };
}

export function mapComplianceFrameworkSummary(record: DbEgpComplianceFramework, maps?: { hubNameById: Map<string, string> }): ComplianceFrameworkSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        frameworkKey: record.framework_key as string,
        frameworkName: record.framework_name as string,
        frameworkStatus: record.framework_status as string,
        status: record.status,
    };
}

export function buildComplianceFrameworkPayload(organizationId: string, input: CreateComplianceFrameworkInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        framework_key: input.frameworkKey ?? '',
        framework_name: input.frameworkName ?? '',
        framework_status: input.frameworkStatus ?? '',
        status: "active",
    };
}

export function mapComplianceControlSummary(record: DbEgpComplianceControl, maps?: { hubNameById: Map<string, string> }): ComplianceControlSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        controlKey: record.control_key as string,
        controlName: record.control_name as string,
        controlStatus: record.control_status as string,
        status: record.status,
    };
}

export function buildComplianceControlPayload(organizationId: string, input: CreateComplianceControlInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        control_key: input.controlKey ?? '',
        control_name: input.controlName ?? '',
        control_status: input.controlStatus ?? '',
        status: "active",
    };
}

export function mapComplianceEvidenceSummary(record: DbEgpComplianceEvidence, maps?: { hubNameById: Map<string, string> }): ComplianceEvidenceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        evidenceKey: record.evidence_key as string,
        evidenceTitle: record.evidence_title as string,
        evidenceStatus: record.evidence_status as string,
        status: record.status,
    };
}

export function buildComplianceEvidencePayload(organizationId: string, input: CreateComplianceEvidenceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        evidence_key: input.evidenceKey ?? '',
        evidence_title: input.evidenceTitle ?? '',
        evidence_status: input.evidenceStatus ?? '',
        status: "active",
    };
}

export function mapComplianceReportSummary(record: DbEgpComplianceReport, maps?: { hubNameById: Map<string, string> }): ComplianceReportSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reportKey: record.report_key as string,
        reportTitle: record.report_title as string,
        reportStatus: record.report_status as string,
        status: record.status,
    };
}

export function buildComplianceReportPayload(organizationId: string, input: CreateComplianceReportInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        report_key: input.reportKey ?? '',
        report_title: input.reportTitle ?? '',
        report_status: input.reportStatus ?? '',
        status: "active",
    };
}

export function mapComplianceCalendarSummary(record: DbEgpComplianceCalendar, maps?: { hubNameById: Map<string, string> }): ComplianceCalendarSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        calendarKey: record.calendar_key as string,
        calendarName: record.calendar_name as string,
        calendarStatus: record.calendar_status as string,
        status: record.status,
    };
}

export function buildComplianceCalendarPayload(organizationId: string, input: CreateComplianceCalendarInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        calendar_key: input.calendarKey ?? '',
        calendar_name: input.calendarName ?? '',
        calendar_status: input.calendarStatus ?? '',
        status: "active",
    };
}

export function mapAuditCenterSummary(record: DbEgpAuditCenter, maps?: { hubNameById: Map<string, string> }): AuditCenterSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        auditKey: record.audit_key as string,
        auditName: record.audit_name as string,
        auditStatus: record.audit_status as string,
        status: record.status,
    };
}

export function buildAuditCenterPayload(organizationId: string, input: CreateAuditCenterInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        audit_key: input.auditKey ?? '',
        audit_name: input.auditName ?? '',
        audit_status: input.auditStatus ?? '',
        status: "active",
    };
}

export function mapAuditFindingSummary(record: DbEgpAuditFinding, maps?: { hubNameById: Map<string, string> }): AuditFindingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        findingKey: record.finding_key as string,
        findingTitle: record.finding_title as string,
        findingSeverity: record.finding_severity as string,
        status: record.status,
    };
}

export function buildAuditFindingPayload(organizationId: string, input: CreateAuditFindingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        finding_key: input.findingKey ?? '',
        finding_title: input.findingTitle ?? '',
        finding_severity: input.findingSeverity ?? '',
        status: "active",
    };
}

export function mapCorrectiveActionSummary(record: DbEgpCorrectiveAction, maps?: { hubNameById: Map<string, string> }): CorrectiveActionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        actionKey: record.action_key as string,
        actionTitle: record.action_title as string,
        actionStatus: record.action_status as string,
        status: record.status,
    };
}

export function buildCorrectiveActionPayload(organizationId: string, input: CreateCorrectiveActionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        action_key: input.actionKey ?? '',
        action_title: input.actionTitle ?? '',
        action_status: input.actionStatus ?? '',
        status: "active",
    };
}

export function mapAuditEvidenceSummary(record: DbEgpAuditEvidence, maps?: { hubNameById: Map<string, string> }): AuditEvidenceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        evidenceKey: record.evidence_key as string,
        evidenceTitle: record.evidence_title as string,
        evidenceStatus: record.evidence_status as string,
        status: record.status,
    };
}

export function buildAuditEvidencePayload(organizationId: string, input: CreateAuditEvidenceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        evidence_key: input.evidenceKey ?? '',
        evidence_title: input.evidenceTitle ?? '',
        evidence_status: input.evidenceStatus ?? '',
        status: "active",
    };
}

export function mapAuditAnalyticsSummary(record: DbEgpAuditAnalytics, maps?: { hubNameById: Map<string, string> }): AuditAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsName: record.analytics_name as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildAuditAnalyticsPayload(organizationId: string, input: CreateAuditAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_name: input.analyticsName ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapDataClassificationSummary(record: DbEgpDataClassification, maps?: { hubNameById: Map<string, string> }): DataClassificationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        classificationKey: record.classification_key as string,
        classificationName: record.classification_name as string,
        classificationLevel: record.classification_level as string,
        status: record.status,
    };
}

export function buildDataClassificationPayload(organizationId: string, input: CreateDataClassificationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        classification_key: input.classificationKey ?? '',
        classification_name: input.classificationName ?? '',
        classification_level: input.classificationLevel ?? '',
        status: "active",
    };
}

export function mapRetentionPolicySummary(record: DbEgpRetentionPolicy, maps?: { hubNameById: Map<string, string> }): RetentionPolicySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        policyStatus: record.policy_status as string,
        status: record.status,
    };
}

export function buildRetentionPolicyPayload(organizationId: string, input: CreateRetentionPolicyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        policy_status: input.policyStatus ?? '',
        status: "active",
    };
}

export function mapDataLifecycleSummary(record: DbEgpDataLifecycle, maps?: { hubNameById: Map<string, string> }): DataLifecycleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        lifecycleKey: record.lifecycle_key as string,
        lifecycleName: record.lifecycle_name as string,
        lifecycleStage: record.lifecycle_stage as string,
        status: record.status,
    };
}

export function buildDataLifecyclePayload(organizationId: string, input: CreateDataLifecycleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        lifecycle_key: input.lifecycleKey ?? '',
        lifecycle_name: input.lifecycleName ?? '',
        lifecycle_stage: input.lifecycleStage ?? '',
        status: "active",
    };
}

export function mapDataOwnershipSummary(record: DbEgpDataOwnership, maps?: { hubNameById: Map<string, string> }): DataOwnershipSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ownershipKey: record.ownership_key as string,
        ownershipName: record.ownership_name as string,
        ownershipStatus: record.ownership_status as string,
        status: record.status,
    };
}

export function buildDataOwnershipPayload(organizationId: string, input: CreateDataOwnershipInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        ownership_key: input.ownershipKey ?? '',
        ownership_name: input.ownershipName ?? '',
        ownership_status: input.ownershipStatus ?? '',
        status: "active",
    };
}

export function mapDataQualitySummary(record: DbEgpDataQuality, maps?: { hubNameById: Map<string, string> }): DataQualitySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        qualityKey: record.quality_key as string,
        qualityName: record.quality_name as string,
        qualityScore: record.quality_score as number,
        status: record.status,
    };
}

export function buildDataQualityPayload(organizationId: string, input: CreateDataQualityInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        quality_key: input.qualityKey ?? '',
        quality_name: input.qualityName ?? '',
        quality_score: input.qualityScore ?? 0,
        status: "active",
    };
}

export function mapRiskRegisterSummary(record: DbEgpRiskRegister, maps?: { hubNameById: Map<string, string> }): RiskRegisterSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        riskKey: record.risk_key as string,
        riskTitle: record.risk_title as string,
        riskSeverity: record.risk_severity as string,
        status: record.status,
    };
}

export function buildRiskRegisterPayload(organizationId: string, input: CreateRiskRegisterInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        risk_key: input.riskKey ?? '',
        risk_title: input.riskTitle ?? '',
        risk_severity: input.riskSeverity ?? '',
        status: "active",
    };
}

export function mapRiskAssessmentSummary(record: DbEgpRiskAssessment, maps?: { hubNameById: Map<string, string> }): RiskAssessmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assessmentKey: record.assessment_key as string,
        assessmentTitle: record.assessment_title as string,
        assessmentScore: record.assessment_score as number,
        status: record.status,
    };
}

export function buildRiskAssessmentPayload(organizationId: string, input: CreateRiskAssessmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        assessment_key: input.assessmentKey ?? '',
        assessment_title: input.assessmentTitle ?? '',
        assessment_score: input.assessmentScore ?? 0,
        status: "active",
    };
}

export function mapRiskMitigationSummary(record: DbEgpRiskMitigation, maps?: { hubNameById: Map<string, string> }): RiskMitigationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        mitigationKey: record.mitigation_key as string,
        mitigationTitle: record.mitigation_title as string,
        mitigationStatus: record.mitigation_status as string,
        status: record.status,
    };
}

export function buildRiskMitigationPayload(organizationId: string, input: CreateRiskMitigationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        mitigation_key: input.mitigationKey ?? '',
        mitigation_title: input.mitigationTitle ?? '',
        mitigation_status: input.mitigationStatus ?? '',
        status: "active",
    };
}

export function mapRiskMonitoringSummary(record: DbEgpRiskMonitoring, maps?: { hubNameById: Map<string, string> }): RiskMonitoringSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        monitoringKey: record.monitoring_key as string,
        monitoringName: record.monitoring_name as string,
        monitoringStatus: record.monitoring_status as string,
        status: record.status,
    };
}

export function buildRiskMonitoringPayload(organizationId: string, input: CreateRiskMonitoringInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        monitoring_key: input.monitoringKey ?? '',
        monitoring_name: input.monitoringName ?? '',
        monitoring_status: input.monitoringStatus ?? '',
        status: "active",
    };
}

export function mapBusinessContinuitySummary(record: DbEgpBusinessContinuity, maps?: { hubNameById: Map<string, string> }): BusinessContinuitySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        continuityKey: record.continuity_key as string,
        continuityName: record.continuity_name as string,
        continuityStatus: record.continuity_status as string,
        status: record.status,
    };
}

export function buildBusinessContinuityPayload(organizationId: string, input: CreateBusinessContinuityInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        continuity_key: input.continuityKey ?? '',
        continuity_name: input.continuityName ?? '',
        continuity_status: input.continuityStatus ?? '',
        status: "active",
    };
}

export function mapGovernanceMetricSummary(record: DbEgpGovernanceMetric): GovernanceMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        overallGovernanceScore: record.overall_governance_score as number,
        complianceScore: record.compliance_score as number,
        status: record.status,
    };
}

export function buildGovernanceMetricPayload(organizationId: string, input: CreateGovernanceMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        overall_governance_score: input.overallGovernanceScore ?? 0,
        compliance_score: input.complianceScore ?? 0,
        status: "active",
    };
}

export function mapGovernanceHealthSummary(record: DbEgpGovernanceHealth): GovernanceHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildGovernanceHealthPayload(organizationId: string, input: CreateGovernanceHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapComplianceDashboardSummary(record: DbEgpComplianceDashboard, maps?: { hubNameById: Map<string, string> }): ComplianceDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dashboardKey: record.dashboard_key as string,
        dashboardName: record.dashboard_name as string,
        dashboardStatus: record.dashboard_status as string,
        status: record.status,
    };
}

export function buildComplianceDashboardPayload(organizationId: string, input: CreateComplianceDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        dashboard_key: input.dashboardKey ?? '',
        dashboard_name: input.dashboardName ?? '',
        dashboard_status: input.dashboardStatus ?? '',
        status: "active",
    };
}

export function mapMissionProgressSummary(record: DbEgpMissionProgress, maps?: { hubNameById: Map<string, string> }): MissionProgressSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        progressKey: record.progress_key as string,
        progressName: record.progress_name as string,
        progressPercent: record.progress_percent as number,
        status: record.status,
    };
}

export function buildMissionProgressPayload(organizationId: string, input: CreateMissionProgressInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        progress_key: input.progressKey ?? '',
        progress_name: input.progressName ?? '',
        progress_percent: input.progressPercent ?? 0,
        status: "active",
    };
}

export function mapGovernanceFailureSummary(record: DbEgpGovernanceFailure, maps?: { hubNameById: Map<string, string> }): GovernanceFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildGovernanceFailurePayload(organizationId: string, input: CreateGovernanceFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.governanceHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapOrganizationGovernanceForStats(r: DbEgpOrganizationGovernance) { return { governance_status: r.governance_status, status: r.status }; }
export function mapComplianceControlForStats(r: DbEgpComplianceControl) { return { control_status: r.control_status, status: r.status }; }
export function mapAuditFindingForStats(r: DbEgpAuditFinding) { return { finding_severity: r.finding_severity, status: r.status }; }
export function mapRiskRegisterForStats(r: DbEgpRiskRegister) { return { risk_severity: r.risk_severity, status: r.status }; }
export function mapDataClassificationForStats(r: DbEgpDataClassification) { return { classification_level: r.classification_level, status: r.status }; }
export function mapGovernanceMetricForStats(r: DbEgpGovernanceMetric) {
    return {
        governance_health_score: r.governance_health_score,
        compliance_score: r.compliance_score,
        enterprise_risk_score: r.enterprise_risk_score,
        audit_summary_score: r.audit_summary_score,
        data_governance_health_score: r.data_governance_health_score,
        overall_governance_score: r.overall_governance_score,
        status: r.status,
    };
}
export function mapGovernanceHealthForStats(r: DbEgpGovernanceHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapGovernanceFailureForStats(r: DbEgpGovernanceFailure) { return { status: r.status }; }

export function buildEgpDashboardStats(input: {
    governanceHubs: GovernanceHubSummary[];
    organizationGovernance: ReturnType<typeof mapOrganizationGovernanceForStats>[];
    complianceControls: ReturnType<typeof mapComplianceControlForStats>[];
    auditFindings: ReturnType<typeof mapAuditFindingForStats>[];
    riskRegister: ReturnType<typeof mapRiskRegisterForStats>[];
    dataClassification: ReturnType<typeof mapDataClassificationForStats>[];
    governanceMetrics: ReturnType<typeof mapGovernanceMetricForStats>[];
    governanceHealth: ReturnType<typeof mapGovernanceHealthForStats>[];
    governanceFailures: GovernanceFailureSummary[];
    auditLogs: AuditEntry[];
}): EgpDashboardStats {
    const activeHubs = input.governanceHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.governanceMetrics[0];
    const latestHealth = input.governanceHealth[0];
    const openFailures = input.governanceFailures.filter((f) => f.status === "open" || f.status === "failed").length;
    return {
        totalGovernanceHubs: input.governanceHubs.length,
        activeGovernanceHubs: activeHubs,
        organizationGovernanceCount: input.organizationGovernance.length,
        complianceControlCount: input.complianceControls.length,
        auditFindingCount: input.auditFindings.length,
        riskRegisterCount: input.riskRegister.length,
        dataClassificationCount: input.dataClassification.length,
        openGovernanceFailureCount: openFailures,
        overallGovernanceScore: latestMetrics?.overall_governance_score ?? latestHealth?.overall_score ?? 0,
        governanceHealthScore: latestMetrics?.governance_health_score ?? 0,
        complianceScore: latestMetrics?.compliance_score ?? 0,
        enterpriseRiskScore: latestMetrics?.enterprise_risk_score ?? 0,
        auditSummaryScore: latestMetrics?.audit_summary_score ?? 0,
        dataGovernanceHealthScore: latestMetrics?.data_governance_health_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
