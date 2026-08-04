"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { enterpriseGovernancePlatformService } from "@/src/modules/enterprise-governance-platform/services/enterprise-governance-platform.service";
import type {
    GovernanceHubSummary,
    CreateGovernanceHubInput,
    OrganizationGovernanceSummary,
    CreateOrganizationGovernanceInput,
    GovernancePolicySummary,
    CreateGovernancePolicyInput,
    GovernanceFrameworkSummary,
    CreateGovernanceFrameworkInput,
    GovernanceReviewSummary,
    CreateGovernanceReviewInput,
    GovernanceDashboardSummary,
    CreateGovernanceDashboardInput,
    ComplianceFrameworkSummary,
    CreateComplianceFrameworkInput,
    ComplianceControlSummary,
    CreateComplianceControlInput,
    ComplianceEvidenceSummary,
    CreateComplianceEvidenceInput,
    ComplianceReportSummary,
    CreateComplianceReportInput,
    ComplianceCalendarSummary,
    CreateComplianceCalendarInput,
    AuditCenterSummary,
    CreateAuditCenterInput,
    AuditFindingSummary,
    CreateAuditFindingInput,
    CorrectiveActionSummary,
    CreateCorrectiveActionInput,
    AuditEvidenceSummary,
    CreateAuditEvidenceInput,
    AuditAnalyticsSummary,
    CreateAuditAnalyticsInput,
    DataClassificationSummary,
    CreateDataClassificationInput,
    RetentionPolicySummary,
    CreateRetentionPolicyInput,
    DataLifecycleSummary,
    CreateDataLifecycleInput,
    DataOwnershipSummary,
    CreateDataOwnershipInput,
    DataQualitySummary,
    CreateDataQualityInput,
    RiskRegisterSummary,
    CreateRiskRegisterInput,
    RiskAssessmentSummary,
    CreateRiskAssessmentInput,
    RiskMitigationSummary,
    CreateRiskMitigationInput,
    RiskMonitoringSummary,
    CreateRiskMonitoringInput,
    BusinessContinuitySummary,
    CreateBusinessContinuityInput,
    GovernanceMetricSummary,
    CreateGovernanceMetricInput,
    GovernanceHealthSummary,
    CreateGovernanceHealthInput,
    ComplianceDashboardSummary,
    CreateComplianceDashboardInput,
    MissionProgressSummary,
    CreateMissionProgressInput,
    GovernanceFailureSummary,
    CreateGovernanceFailureInput,
    AuditEntry,
    EgpDashboardStats,
    EgpPipelineInfo,
} from "@/src/modules/enterprise-governance-platform/types";

export function useEnterpriseGovernancePlatform() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<EgpDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<EgpPipelineInfo | null>(null);
    const [governanceHubs, setGovernanceHubs] = useState<GovernanceHubSummary[]>([]);
    const [organizationGovernance, setOrganizationGovernances] = useState<OrganizationGovernanceSummary[]>([]);
    const [governancePolicies, setGovernancePolicys] = useState<GovernancePolicySummary[]>([]);
    const [governanceFramework, setGovernanceFrameworks] = useState<GovernanceFrameworkSummary[]>([]);
    const [governanceReviews, setGovernanceReviews] = useState<GovernanceReviewSummary[]>([]);
    const [governanceDashboards, setGovernanceDashboards] = useState<GovernanceDashboardSummary[]>([]);
    const [complianceFramework, setComplianceFrameworks] = useState<ComplianceFrameworkSummary[]>([]);
    const [complianceControls, setComplianceControls] = useState<ComplianceControlSummary[]>([]);
    const [complianceEvidence, setComplianceEvidences] = useState<ComplianceEvidenceSummary[]>([]);
    const [complianceReports, setComplianceReports] = useState<ComplianceReportSummary[]>([]);
    const [complianceCalendar, setComplianceCalendars] = useState<ComplianceCalendarSummary[]>([]);
    const [auditCenter, setAuditCenters] = useState<AuditCenterSummary[]>([]);
    const [auditFindings, setAuditFindings] = useState<AuditFindingSummary[]>([]);
    const [correctiveActions, setCorrectiveActions] = useState<CorrectiveActionSummary[]>([]);
    const [auditEvidence, setAuditEvidences] = useState<AuditEvidenceSummary[]>([]);
    const [auditAnalytics, setAuditAnalyticss] = useState<AuditAnalyticsSummary[]>([]);
    const [dataClassification, setDataClassifications] = useState<DataClassificationSummary[]>([]);
    const [retentionPolicies, setRetentionPolicys] = useState<RetentionPolicySummary[]>([]);
    const [dataLifecycle, setDataLifecycles] = useState<DataLifecycleSummary[]>([]);
    const [dataOwnership, setDataOwnerships] = useState<DataOwnershipSummary[]>([]);
    const [dataQuality, setDataQualitys] = useState<DataQualitySummary[]>([]);
    const [riskRegister, setRiskRegisters] = useState<RiskRegisterSummary[]>([]);
    const [riskAssessment, setRiskAssessments] = useState<RiskAssessmentSummary[]>([]);
    const [riskMitigation, setRiskMitigations] = useState<RiskMitigationSummary[]>([]);
    const [riskMonitoring, setRiskMonitorings] = useState<RiskMonitoringSummary[]>([]);
    const [businessContinuity, setBusinessContinuitys] = useState<BusinessContinuitySummary[]>([]);
    const [governanceMetrics, setGovernanceMetrics] = useState<GovernanceMetricSummary[]>([]);
    const [governanceHealth, setGovernanceHealths] = useState<GovernanceHealthSummary[]>([]);
    const [complianceDashboards, setComplianceDashboards] = useState<ComplianceDashboardSummary[]>([]);
    const [missionProgress, setMissionProgresss] = useState<MissionProgressSummary[]>([]);
    const [governanceFailures, setGovernanceFailures] = useState<GovernanceFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [governanceHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
governanceHubsList,
            organizationGovernanceList,
            governancePoliciesList,
            governanceFrameworkList,
            governanceReviewsList,
            governanceDashboardsList,
            complianceFrameworkList,
            complianceControlsList,
            complianceEvidenceList,
            complianceReportsList,
            complianceCalendarList,
            auditCenterList,
            auditFindingsList,
            correctiveActionsList,
            auditEvidenceList,
            auditAnalyticsList,
            dataClassificationList,
            retentionPoliciesList,
            dataLifecycleList,
            dataOwnershipList,
            dataQualityList,
            riskRegisterList,
            riskAssessmentList,
            riskMitigationList,
            riskMonitoringList,
            businessContinuityList,
            governanceMetricsList,
            governanceHealthList,
            complianceDashboardsList,
            missionProgressList,
            governanceFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            enterpriseGovernancePlatformService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(enterpriseGovernancePlatformService.getPipelineInfo()),
            enterpriseGovernancePlatformService.getGovernanceHubs(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getOrganizationGovernances(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernancePolicys(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernanceFrameworks(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernanceReviews(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernanceDashboards(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getComplianceFrameworks(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getComplianceControls(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getComplianceEvidences(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getComplianceReports(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getComplianceCalendars(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getAuditCenters(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getAuditFindings(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getCorrectiveActions(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getAuditEvidences(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getAuditAnalyticss(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getDataClassifications(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getRetentionPolicys(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getDataLifecycles(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getDataOwnerships(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getDataQualitys(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getRiskRegisters(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getRiskAssessments(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getRiskMitigations(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getRiskMonitorings(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getBusinessContinuitys(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernanceMetrics(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernanceHealths(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getComplianceDashboards(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getMissionProgresss(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernanceFailures(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getAuditLogs(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernanceHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
governanceHubsList,
            organizationGovernanceList,
            governancePoliciesList,
            governanceFrameworkList,
            governanceReviewsList,
            governanceDashboardsList,
            complianceFrameworkList,
            complianceControlsList,
            complianceEvidenceList,
            complianceReportsList,
            complianceCalendarList,
            auditCenterList,
            auditFindingsList,
            correctiveActionsList,
            auditEvidenceList,
            auditAnalyticsList,
            dataClassificationList,
            retentionPoliciesList,
            dataLifecycleList,
            dataOwnershipList,
            dataQualityList,
            riskRegisterList,
            riskAssessmentList,
            riskMitigationList,
            riskMonitoringList,
            businessContinuityList,
            governanceMetricsList,
            governanceHealthList,
            complianceDashboardsList,
            missionProgressList,
            governanceFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setGovernanceHubs(result.governanceHubsList);
        setOrganizationGovernances(result.organizationGovernanceList);
        setGovernancePolicys(result.governancePoliciesList);
        setGovernanceFrameworks(result.governanceFrameworkList);
        setGovernanceReviews(result.governanceReviewsList);
        setGovernanceDashboards(result.governanceDashboardsList);
        setComplianceFrameworks(result.complianceFrameworkList);
        setComplianceControls(result.complianceControlsList);
        setComplianceEvidences(result.complianceEvidenceList);
        setComplianceReports(result.complianceReportsList);
        setComplianceCalendars(result.complianceCalendarList);
        setAuditCenters(result.auditCenterList);
        setAuditFindings(result.auditFindingsList);
        setCorrectiveActions(result.correctiveActionsList);
        setAuditEvidences(result.auditEvidenceList);
        setAuditAnalyticss(result.auditAnalyticsList);
        setDataClassifications(result.dataClassificationList);
        setRetentionPolicys(result.retentionPoliciesList);
        setDataLifecycles(result.dataLifecycleList);
        setDataOwnerships(result.dataOwnershipList);
        setDataQualitys(result.dataQualityList);
        setRiskRegisters(result.riskRegisterList);
        setRiskAssessments(result.riskAssessmentList);
        setRiskMitigations(result.riskMitigationList);
        setRiskMonitorings(result.riskMonitoringList);
        setBusinessContinuitys(result.businessContinuityList);
        setGovernanceMetrics(result.governanceMetricsList);
        setGovernanceHealths(result.governanceHealthList);
        setComplianceDashboards(result.complianceDashboardsList);
        setMissionProgresss(result.missionProgressList);
        setGovernanceFailures(result.governanceFailuresList);
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

    const createGovernanceHub = useCallback(async (input: CreateGovernanceHubInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createGovernanceHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOrganizationGovernance = useCallback(async (input: CreateOrganizationGovernanceInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createOrganizationGovernance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGovernancePolicy = useCallback(async (input: CreateGovernancePolicyInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createGovernancePolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGovernanceFramework = useCallback(async (input: CreateGovernanceFrameworkInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createGovernanceFramework(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGovernanceReview = useCallback(async (input: CreateGovernanceReviewInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createGovernanceReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGovernanceDashboard = useCallback(async (input: CreateGovernanceDashboardInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createGovernanceDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceFramework = useCallback(async (input: CreateComplianceFrameworkInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createComplianceFramework(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceControl = useCallback(async (input: CreateComplianceControlInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createComplianceControl(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceEvidence = useCallback(async (input: CreateComplianceEvidenceInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createComplianceEvidence(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceReport = useCallback(async (input: CreateComplianceReportInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createComplianceReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceCalendar = useCallback(async (input: CreateComplianceCalendarInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createComplianceCalendar(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAuditCenter = useCallback(async (input: CreateAuditCenterInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createAuditCenter(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAuditFinding = useCallback(async (input: CreateAuditFindingInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createAuditFinding(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCorrectiveAction = useCallback(async (input: CreateCorrectiveActionInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createCorrectiveAction(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAuditEvidence = useCallback(async (input: CreateAuditEvidenceInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createAuditEvidence(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAuditAnalytics = useCallback(async (input: CreateAuditAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createAuditAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDataClassification = useCallback(async (input: CreateDataClassificationInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createDataClassification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRetentionPolicy = useCallback(async (input: CreateRetentionPolicyInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createRetentionPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDataLifecycle = useCallback(async (input: CreateDataLifecycleInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createDataLifecycle(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDataOwnership = useCallback(async (input: CreateDataOwnershipInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createDataOwnership(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDataQuality = useCallback(async (input: CreateDataQualityInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createDataQuality(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskRegister = useCallback(async (input: CreateRiskRegisterInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createRiskRegister(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskAssessment = useCallback(async (input: CreateRiskAssessmentInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createRiskAssessment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskMitigation = useCallback(async (input: CreateRiskMitigationInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createRiskMitigation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskMonitoring = useCallback(async (input: CreateRiskMonitoringInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createRiskMonitoring(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessContinuity = useCallback(async (input: CreateBusinessContinuityInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createBusinessContinuity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGovernanceMetric = useCallback(async (input: CreateGovernanceMetricInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createGovernanceMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGovernanceHealth = useCallback(async (input: CreateGovernanceHealthInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createGovernanceHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComplianceDashboard = useCallback(async (input: CreateComplianceDashboardInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createComplianceDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMissionProgress = useCallback(async (input: CreateMissionProgressInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createMissionProgress(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGovernanceFailure = useCallback(async (input: CreateGovernanceFailureInput) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.createGovernanceFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        governanceHubs,
        createGovernanceHub,
        organizationGovernance,
        createOrganizationGovernance,
        governancePolicies,
        createGovernancePolicy,
        governanceFramework,
        createGovernanceFramework,
        governanceReviews,
        createGovernanceReview,
        governanceDashboards,
        createGovernanceDashboard,
        complianceFramework,
        createComplianceFramework,
        complianceControls,
        createComplianceControl,
        complianceEvidence,
        createComplianceEvidence,
        complianceReports,
        createComplianceReport,
        complianceCalendar,
        createComplianceCalendar,
        auditCenter,
        createAuditCenter,
        auditFindings,
        createAuditFinding,
        correctiveActions,
        createCorrectiveAction,
        auditEvidence,
        createAuditEvidence,
        auditAnalytics,
        createAuditAnalytics,
        dataClassification,
        createDataClassification,
        retentionPolicies,
        createRetentionPolicy,
        dataLifecycle,
        createDataLifecycle,
        dataOwnership,
        createDataOwnership,
        dataQuality,
        createDataQuality,
        riskRegister,
        createRiskRegister,
        riskAssessment,
        createRiskAssessment,
        riskMitigation,
        createRiskMitigation,
        riskMonitoring,
        createRiskMonitoring,
        businessContinuity,
        createBusinessContinuity,
        governanceMetrics,
        createGovernanceMetric,
        governanceHealth,
        createGovernanceHealth,
        complianceDashboards,
        createComplianceDashboard,
        missionProgress,
        createMissionProgress,
        governanceFailures,
        createGovernanceFailure,
        auditLogs,
        governanceHubOptions,
        refresh,
    };
}
