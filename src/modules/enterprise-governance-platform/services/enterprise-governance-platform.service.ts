import {
    buildGovernanceHubLookupMaps,
    buildEgpAuditPayload,
    buildEgpDashboardStats,
    buildEgpPipelineInfo,
    mapAuditEntry,
    buildGovernanceHubPayload,
    mapGovernanceHubSummary,
    buildOrganizationGovernancePayload,
    mapOrganizationGovernanceSummary,
    buildGovernancePolicyPayload,
    mapGovernancePolicySummary,
    buildGovernanceFrameworkPayload,
    mapGovernanceFrameworkSummary,
    buildGovernanceReviewPayload,
    mapGovernanceReviewSummary,
    buildGovernanceDashboardPayload,
    mapGovernanceDashboardSummary,
    buildComplianceFrameworkPayload,
    mapComplianceFrameworkSummary,
    buildComplianceControlPayload,
    mapComplianceControlSummary,
    buildComplianceEvidencePayload,
    mapComplianceEvidenceSummary,
    buildComplianceReportPayload,
    mapComplianceReportSummary,
    buildComplianceCalendarPayload,
    mapComplianceCalendarSummary,
    buildAuditCenterPayload,
    mapAuditCenterSummary,
    buildAuditFindingPayload,
    mapAuditFindingSummary,
    buildCorrectiveActionPayload,
    mapCorrectiveActionSummary,
    buildAuditEvidencePayload,
    mapAuditEvidenceSummary,
    buildAuditAnalyticsPayload,
    mapAuditAnalyticsSummary,
    buildDataClassificationPayload,
    mapDataClassificationSummary,
    buildRetentionPolicyPayload,
    mapRetentionPolicySummary,
    buildDataLifecyclePayload,
    mapDataLifecycleSummary,
    buildDataOwnershipPayload,
    mapDataOwnershipSummary,
    buildDataQualityPayload,
    mapDataQualitySummary,
    buildRiskRegisterPayload,
    mapRiskRegisterSummary,
    buildRiskAssessmentPayload,
    mapRiskAssessmentSummary,
    buildRiskMitigationPayload,
    mapRiskMitigationSummary,
    buildRiskMonitoringPayload,
    mapRiskMonitoringSummary,
    buildBusinessContinuityPayload,
    mapBusinessContinuitySummary,
    buildGovernanceMetricPayload,
    mapGovernanceMetricSummary,
    buildGovernanceHealthPayload,
    mapGovernanceHealthSummary,
    buildComplianceDashboardPayload,
    mapComplianceDashboardSummary,
    buildMissionProgressPayload,
    mapMissionProgressSummary,
    buildGovernanceFailurePayload,
    mapGovernanceFailureSummary,
    mapOrganizationGovernanceForStats,
    mapComplianceControlForStats,
    mapAuditFindingForStats,
    mapRiskRegisterForStats,
    mapDataClassificationForStats,
    mapGovernanceMetricForStats,
    mapGovernanceHealthForStats,
    mapGovernanceFailureForStats,
} from "@/src/modules/database/lib/enterprise-governance-platform-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";
import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { createCustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";
import { createEnterpriseIntelligencePlatformClient } from "@/src/modules/enterprise-intelligence-platform/sdk";
import { createAiOrganizationFoundationClient } from "@/src/modules/ai-organization-foundation/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
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
    EgpSdkRunGovernanceServiceInput,
    EgpSdkRunGovernanceServiceResult,
    EgpSdkRunComplianceServiceInput,
    EgpSdkRunComplianceServiceResult,
    EgpSdkRunAuditServiceInput,
    EgpSdkRunAuditServiceResult,
    EgpSdkRunDataGovernanceServiceInput,
    EgpSdkRunDataGovernanceServiceResult,
    EgpSdkRunRiskManagementServiceInput,
    EgpSdkRunRiskManagementServiceResult,
    EgpSdkRunDashboardServiceInput,
    EgpSdkRunDashboardServiceResult,
} from "@/src/modules/enterprise-governance-platform/types";

export class EnterpriseGovernancePlatformService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const governanceHubs = await databaseService.egpGovernanceHubs.listByOrganization(organizationId);
        return buildGovernanceHubLookupMaps(governanceHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<EgpDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildEgpDashboardStats({ governanceHubs: [], organizationGovernance: [], complianceControls: [], auditFindings: [], riskRegister: [], dataClassification: [], governanceMetrics: [], governanceHealth: [], governanceFailures: [], auditLogs: [] });
        const [governanceHubs, organizationGovernanceRaw, complianceControlsRaw, auditFindingsRaw, riskRegisterRaw, dataClassificationRaw, governanceMetricsRaw, governanceHealthRaw, governanceFailures, auditLogs] = await Promise.all([
            this.getGovernanceHubs(authUserId, email, fullName),
            databaseService.egpOrganizationGovernance.listByOrganization(context.organizationId),
            databaseService.egpComplianceControls.listByOrganization(context.organizationId),
            databaseService.egpAuditFindings.listByOrganization(context.organizationId),
            databaseService.egpRiskRegister.listByOrganization(context.organizationId),
            databaseService.egpDataClassification.listByOrganization(context.organizationId),
            databaseService.egpGovernanceMetrics.listByOrganization(context.organizationId),
            databaseService.egpGovernanceHealth.listByOrganization(context.organizationId),
            this.getGovernanceFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildEgpDashboardStats({
            governanceHubs,
            organizationGovernance: organizationGovernanceRaw.map(mapOrganizationGovernanceForStats),
            complianceControls: complianceControlsRaw.map(mapComplianceControlForStats),
            auditFindings: auditFindingsRaw.map(mapAuditFindingForStats),
            riskRegister: riskRegisterRaw.map(mapRiskRegisterForStats),
            dataClassification: dataClassificationRaw.map(mapDataClassificationForStats),
            governanceMetrics: governanceMetricsRaw.map(mapGovernanceMetricForStats),
            governanceHealth: governanceHealthRaw.map(mapGovernanceHealthForStats),
            governanceFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): EgpPipelineInfo {
        return buildEgpPipelineInfo();
    }

    async getGovernanceHubs(authUserId: string, email: string, fullName?: string | null): Promise<GovernanceHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpGovernanceHubs.listByOrganization(context.organizationId)).map((r) => mapGovernanceHubSummary(r));
    }

    async createGovernanceHub(authUserId: string, email: string, input: CreateGovernanceHubInput, fullName?: string | null): Promise<GovernanceHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpGovernanceHubs.create(buildGovernanceHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create governanceHubs");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "governance_hubs", "create", `GovernanceHub created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGovernanceHubSummary(created);
    }

    async getOrganizationGovernances(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationGovernanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpOrganizationGovernance.listByOrganization(context.organizationId)).map((r) => mapOrganizationGovernanceSummary(r, maps));
    }

    async createOrganizationGovernance(authUserId: string, email: string, input: CreateOrganizationGovernanceInput, fullName?: string | null): Promise<OrganizationGovernanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpOrganizationGovernance.create(buildOrganizationGovernancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create organizationGovernance");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "organization_governance", "create", `OrganizationGovernance created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrganizationGovernanceSummary(created, maps);
    }

    async getGovernancePolicys(authUserId: string, email: string, fullName?: string | null): Promise<GovernancePolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpGovernancePolicies.listByOrganization(context.organizationId)).map((r) => mapGovernancePolicySummary(r, maps));
    }

    async createGovernancePolicy(authUserId: string, email: string, input: CreateGovernancePolicyInput, fullName?: string | null): Promise<GovernancePolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpGovernancePolicies.create(buildGovernancePolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create governancePolicies");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "governance_policies", "create", `GovernancePolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGovernancePolicySummary(created, maps);
    }

    async getGovernanceFrameworks(authUserId: string, email: string, fullName?: string | null): Promise<GovernanceFrameworkSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpGovernanceFramework.listByOrganization(context.organizationId)).map((r) => mapGovernanceFrameworkSummary(r, maps));
    }

    async createGovernanceFramework(authUserId: string, email: string, input: CreateGovernanceFrameworkInput, fullName?: string | null): Promise<GovernanceFrameworkSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpGovernanceFramework.create(buildGovernanceFrameworkPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create governanceFramework");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "governance_framework", "create", `GovernanceFramework created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGovernanceFrameworkSummary(created, maps);
    }

    async getGovernanceReviews(authUserId: string, email: string, fullName?: string | null): Promise<GovernanceReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpGovernanceReviews.listByOrganization(context.organizationId)).map((r) => mapGovernanceReviewSummary(r, maps));
    }

    async createGovernanceReview(authUserId: string, email: string, input: CreateGovernanceReviewInput, fullName?: string | null): Promise<GovernanceReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpGovernanceReviews.create(buildGovernanceReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create governanceReviews");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "governance_reviews", "create", `GovernanceReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGovernanceReviewSummary(created, maps);
    }

    async getGovernanceDashboards(authUserId: string, email: string, fullName?: string | null): Promise<GovernanceDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpGovernanceDashboards.listByOrganization(context.organizationId)).map((r) => mapGovernanceDashboardSummary(r, maps));
    }

    async createGovernanceDashboard(authUserId: string, email: string, input: CreateGovernanceDashboardInput, fullName?: string | null): Promise<GovernanceDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpGovernanceDashboards.create(buildGovernanceDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create governanceDashboards");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "governance_dashboards", "create", `GovernanceDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGovernanceDashboardSummary(created, maps);
    }

    async getComplianceFrameworks(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceFrameworkSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpComplianceFramework.listByOrganization(context.organizationId)).map((r) => mapComplianceFrameworkSummary(r, maps));
    }

    async createComplianceFramework(authUserId: string, email: string, input: CreateComplianceFrameworkInput, fullName?: string | null): Promise<ComplianceFrameworkSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpComplianceFramework.create(buildComplianceFrameworkPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create complianceFramework");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "compliance_framework", "create", `ComplianceFramework created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceFrameworkSummary(created, maps);
    }

    async getComplianceControls(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceControlSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpComplianceControls.listByOrganization(context.organizationId)).map((r) => mapComplianceControlSummary(r, maps));
    }

    async createComplianceControl(authUserId: string, email: string, input: CreateComplianceControlInput, fullName?: string | null): Promise<ComplianceControlSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpComplianceControls.create(buildComplianceControlPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create complianceControls");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "compliance_controls", "create", `ComplianceControl created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceControlSummary(created, maps);
    }

    async getComplianceEvidences(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceEvidenceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpComplianceEvidence.listByOrganization(context.organizationId)).map((r) => mapComplianceEvidenceSummary(r, maps));
    }

    async createComplianceEvidence(authUserId: string, email: string, input: CreateComplianceEvidenceInput, fullName?: string | null): Promise<ComplianceEvidenceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpComplianceEvidence.create(buildComplianceEvidencePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create complianceEvidence");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "compliance_evidence", "create", `ComplianceEvidence created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceEvidenceSummary(created, maps);
    }

    async getComplianceReports(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpComplianceReports.listByOrganization(context.organizationId)).map((r) => mapComplianceReportSummary(r, maps));
    }

    async createComplianceReport(authUserId: string, email: string, input: CreateComplianceReportInput, fullName?: string | null): Promise<ComplianceReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpComplianceReports.create(buildComplianceReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create complianceReports");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "compliance_reports", "create", `ComplianceReport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceReportSummary(created, maps);
    }

    async getComplianceCalendars(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceCalendarSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpComplianceCalendar.listByOrganization(context.organizationId)).map((r) => mapComplianceCalendarSummary(r, maps));
    }

    async createComplianceCalendar(authUserId: string, email: string, input: CreateComplianceCalendarInput, fullName?: string | null): Promise<ComplianceCalendarSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpComplianceCalendar.create(buildComplianceCalendarPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create complianceCalendar");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "compliance_calendar", "create", `ComplianceCalendar created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceCalendarSummary(created, maps);
    }

    async getAuditCenters(authUserId: string, email: string, fullName?: string | null): Promise<AuditCenterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpAuditCenter.listByOrganization(context.organizationId)).map((r) => mapAuditCenterSummary(r, maps));
    }

    async createAuditCenter(authUserId: string, email: string, input: CreateAuditCenterInput, fullName?: string | null): Promise<AuditCenterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpAuditCenter.create(buildAuditCenterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create auditCenter");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "audit_center", "create", `AuditCenter created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAuditCenterSummary(created, maps);
    }

    async getAuditFindings(authUserId: string, email: string, fullName?: string | null): Promise<AuditFindingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpAuditFindings.listByOrganization(context.organizationId)).map((r) => mapAuditFindingSummary(r, maps));
    }

    async createAuditFinding(authUserId: string, email: string, input: CreateAuditFindingInput, fullName?: string | null): Promise<AuditFindingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpAuditFindings.create(buildAuditFindingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create auditFindings");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "audit_findings", "create", `AuditFinding created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAuditFindingSummary(created, maps);
    }

    async getCorrectiveActions(authUserId: string, email: string, fullName?: string | null): Promise<CorrectiveActionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpCorrectiveActions.listByOrganization(context.organizationId)).map((r) => mapCorrectiveActionSummary(r, maps));
    }

    async createCorrectiveAction(authUserId: string, email: string, input: CreateCorrectiveActionInput, fullName?: string | null): Promise<CorrectiveActionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpCorrectiveActions.create(buildCorrectiveActionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create correctiveActions");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "corrective_actions", "create", `CorrectiveAction created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCorrectiveActionSummary(created, maps);
    }

    async getAuditEvidences(authUserId: string, email: string, fullName?: string | null): Promise<AuditEvidenceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpAuditEvidence.listByOrganization(context.organizationId)).map((r) => mapAuditEvidenceSummary(r, maps));
    }

    async createAuditEvidence(authUserId: string, email: string, input: CreateAuditEvidenceInput, fullName?: string | null): Promise<AuditEvidenceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpAuditEvidence.create(buildAuditEvidencePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create auditEvidence");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "audit_evidence", "create", `AuditEvidence created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAuditEvidenceSummary(created, maps);
    }

    async getAuditAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<AuditAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpAuditAnalytics.listByOrganization(context.organizationId)).map((r) => mapAuditAnalyticsSummary(r, maps));
    }

    async createAuditAnalytics(authUserId: string, email: string, input: CreateAuditAnalyticsInput, fullName?: string | null): Promise<AuditAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpAuditAnalytics.create(buildAuditAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create auditAnalytics");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "audit_analytics", "create", `AuditAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAuditAnalyticsSummary(created, maps);
    }

    async getDataClassifications(authUserId: string, email: string, fullName?: string | null): Promise<DataClassificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpDataClassification.listByOrganization(context.organizationId)).map((r) => mapDataClassificationSummary(r, maps));
    }

    async createDataClassification(authUserId: string, email: string, input: CreateDataClassificationInput, fullName?: string | null): Promise<DataClassificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpDataClassification.create(buildDataClassificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dataClassification");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "data_classification", "create", `DataClassification created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDataClassificationSummary(created, maps);
    }

    async getRetentionPolicys(authUserId: string, email: string, fullName?: string | null): Promise<RetentionPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpRetentionPolicies.listByOrganization(context.organizationId)).map((r) => mapRetentionPolicySummary(r, maps));
    }

    async createRetentionPolicy(authUserId: string, email: string, input: CreateRetentionPolicyInput, fullName?: string | null): Promise<RetentionPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpRetentionPolicies.create(buildRetentionPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retentionPolicies");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "retention_policies", "create", `RetentionPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRetentionPolicySummary(created, maps);
    }

    async getDataLifecycles(authUserId: string, email: string, fullName?: string | null): Promise<DataLifecycleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpDataLifecycle.listByOrganization(context.organizationId)).map((r) => mapDataLifecycleSummary(r, maps));
    }

    async createDataLifecycle(authUserId: string, email: string, input: CreateDataLifecycleInput, fullName?: string | null): Promise<DataLifecycleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpDataLifecycle.create(buildDataLifecyclePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dataLifecycle");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "data_lifecycle", "create", `DataLifecycle created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDataLifecycleSummary(created, maps);
    }

    async getDataOwnerships(authUserId: string, email: string, fullName?: string | null): Promise<DataOwnershipSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpDataOwnership.listByOrganization(context.organizationId)).map((r) => mapDataOwnershipSummary(r, maps));
    }

    async createDataOwnership(authUserId: string, email: string, input: CreateDataOwnershipInput, fullName?: string | null): Promise<DataOwnershipSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpDataOwnership.create(buildDataOwnershipPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dataOwnership");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "data_ownership", "create", `DataOwnership created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDataOwnershipSummary(created, maps);
    }

    async getDataQualitys(authUserId: string, email: string, fullName?: string | null): Promise<DataQualitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpDataQuality.listByOrganization(context.organizationId)).map((r) => mapDataQualitySummary(r, maps));
    }

    async createDataQuality(authUserId: string, email: string, input: CreateDataQualityInput, fullName?: string | null): Promise<DataQualitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpDataQuality.create(buildDataQualityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dataQuality");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "data_quality", "create", `DataQuality created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDataQualitySummary(created, maps);
    }

    async getRiskRegisters(authUserId: string, email: string, fullName?: string | null): Promise<RiskRegisterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpRiskRegister.listByOrganization(context.organizationId)).map((r) => mapRiskRegisterSummary(r, maps));
    }

    async createRiskRegister(authUserId: string, email: string, input: CreateRiskRegisterInput, fullName?: string | null): Promise<RiskRegisterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpRiskRegister.create(buildRiskRegisterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create riskRegister");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "risk_register", "create", `RiskRegister created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskRegisterSummary(created, maps);
    }

    async getRiskAssessments(authUserId: string, email: string, fullName?: string | null): Promise<RiskAssessmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpRiskAssessment.listByOrganization(context.organizationId)).map((r) => mapRiskAssessmentSummary(r, maps));
    }

    async createRiskAssessment(authUserId: string, email: string, input: CreateRiskAssessmentInput, fullName?: string | null): Promise<RiskAssessmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpRiskAssessment.create(buildRiskAssessmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create riskAssessment");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "risk_assessment", "create", `RiskAssessment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskAssessmentSummary(created, maps);
    }

    async getRiskMitigations(authUserId: string, email: string, fullName?: string | null): Promise<RiskMitigationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpRiskMitigation.listByOrganization(context.organizationId)).map((r) => mapRiskMitigationSummary(r, maps));
    }

    async createRiskMitigation(authUserId: string, email: string, input: CreateRiskMitigationInput, fullName?: string | null): Promise<RiskMitigationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpRiskMitigation.create(buildRiskMitigationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create riskMitigation");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "risk_mitigation", "create", `RiskMitigation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskMitigationSummary(created, maps);
    }

    async getRiskMonitorings(authUserId: string, email: string, fullName?: string | null): Promise<RiskMonitoringSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpRiskMonitoring.listByOrganization(context.organizationId)).map((r) => mapRiskMonitoringSummary(r, maps));
    }

    async createRiskMonitoring(authUserId: string, email: string, input: CreateRiskMonitoringInput, fullName?: string | null): Promise<RiskMonitoringSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpRiskMonitoring.create(buildRiskMonitoringPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create riskMonitoring");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "risk_monitoring", "create", `RiskMonitoring created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskMonitoringSummary(created, maps);
    }

    async getBusinessContinuitys(authUserId: string, email: string, fullName?: string | null): Promise<BusinessContinuitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpBusinessContinuity.listByOrganization(context.organizationId)).map((r) => mapBusinessContinuitySummary(r, maps));
    }

    async createBusinessContinuity(authUserId: string, email: string, input: CreateBusinessContinuityInput, fullName?: string | null): Promise<BusinessContinuitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpBusinessContinuity.create(buildBusinessContinuityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessContinuity");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "business_continuity", "create", `BusinessContinuity created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessContinuitySummary(created, maps);
    }

    async getGovernanceMetrics(authUserId: string, email: string, fullName?: string | null): Promise<GovernanceMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.egpGovernanceMetrics.listByOrganization(context.organizationId)).map(mapGovernanceMetricSummary);
    }

    async createGovernanceMetric(authUserId: string, email: string, input: CreateGovernanceMetricInput, fullName?: string | null): Promise<GovernanceMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpGovernanceMetrics.create(buildGovernanceMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create governanceMetrics");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "governance_metrics", "create", `GovernanceMetric created`, created.id));
        return mapGovernanceMetricSummary(created);
    }

    async getGovernanceHealths(authUserId: string, email: string, fullName?: string | null): Promise<GovernanceHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.egpGovernanceHealth.listByOrganization(context.organizationId)).map(mapGovernanceHealthSummary);
    }

    async createGovernanceHealth(authUserId: string, email: string, input: CreateGovernanceHealthInput, fullName?: string | null): Promise<GovernanceHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpGovernanceHealth.create(buildGovernanceHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create governanceHealth");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "governance_health", "create", `GovernanceHealth created`, created.id));
        return mapGovernanceHealthSummary(created);
    }

    async getComplianceDashboards(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpComplianceDashboards.listByOrganization(context.organizationId)).map((r) => mapComplianceDashboardSummary(r, maps));
    }

    async createComplianceDashboard(authUserId: string, email: string, input: CreateComplianceDashboardInput, fullName?: string | null): Promise<ComplianceDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpComplianceDashboards.create(buildComplianceDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create complianceDashboards");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "compliance_dashboards", "create", `ComplianceDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceDashboardSummary(created, maps);
    }

    async getMissionProgresss(authUserId: string, email: string, fullName?: string | null): Promise<MissionProgressSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpMissionProgress.listByOrganization(context.organizationId)).map((r) => mapMissionProgressSummary(r, maps));
    }

    async createMissionProgress(authUserId: string, email: string, input: CreateMissionProgressInput, fullName?: string | null): Promise<MissionProgressSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpMissionProgress.create(buildMissionProgressPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create missionProgress");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "mission_progress", "create", `MissionProgress created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMissionProgressSummary(created, maps);
    }

    async getGovernanceFailures(authUserId: string, email: string, fullName?: string | null): Promise<GovernanceFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.egpGovernanceFailures.listByOrganization(context.organizationId)).map((r) => mapGovernanceFailureSummary(r, maps));
    }

    async createGovernanceFailure(authUserId: string, email: string, input: CreateGovernanceFailureInput, fullName?: string | null): Promise<GovernanceFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.egpGovernanceFailures.create(buildGovernanceFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create governanceFailures");
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "governance_failures", "create", `GovernanceFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGovernanceFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.egpAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getGovernanceHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.egpGovernanceHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRunGovernanceService(authUserId: string, email: string, input: EgpSdkRunGovernanceServiceInput, fullName?: string | null): Promise<EgpSdkRunGovernanceServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createOrganizationGovernance(authUserId, email, { governanceHubId: input.governanceHubId, governanceKey: input.governanceKey, governanceName: input.governanceName }, fullName);
        return { governanceId: created.id, governanceKey: created.governanceKey, status: created.status };
    }

    async sdkRunComplianceService(authUserId: string, email: string, input: EgpSdkRunComplianceServiceInput, fullName?: string | null): Promise<EgpSdkRunComplianceServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createComplianceControl(authUserId, email, { governanceHubId: input.governanceHubId, controlKey: input.controlKey, controlName: input.controlName }, fullName);
        return { controlId: created.id, controlKey: created.controlKey, status: created.status };
    }

    async sdkRunAuditService(authUserId: string, email: string, input: EgpSdkRunAuditServiceInput, fullName?: string | null): Promise<EgpSdkRunAuditServiceResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const launch = createLaunchFoundationClient(authUserId, email, fullName);
        await launch.getLaunchHubs();
        const company = createCompanyFoundationClient(authUserId, email, fullName);
        await company.getCompanyHubs();
        const csd = createCustomerSuccessDeliveryClient(authUserId, email, fullName);
        await csd.getDeliveryHubs();
        const cop = createCustomerOperatedPlatformClient(authUserId, email, fullName);
        await cop.getOperatedHubs();
        const eip = createEnterpriseIntelligencePlatformClient(authUserId, email, fullName);
        await eip.getIntelligenceHubs();
        const aof = createAiOrganizationFoundationClient(authUserId, email, fullName);
        await aof.getOrganizationHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createAuditFinding(authUserId, email, { governanceHubId: input.governanceHubId, findingKey: input.findingKey, findingTitle: input.findingTitle }, fullName);
        return { findingId: created.id, findingKey: created.findingKey, status: created.status };
    }

    async sdkRunDataGovernanceService(authUserId: string, email: string, input: EgpSdkRunDataGovernanceServiceInput, fullName?: string | null): Promise<EgpSdkRunDataGovernanceServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.getAgents();
        const created = await this.createDataClassification(authUserId, email, { governanceHubId: input.governanceHubId, classificationKey: input.classificationKey, classificationName: input.classificationName }, fullName);
        return { classificationId: created.id, classificationKey: created.classificationKey, status: created.status };
    }

    async sdkRunRiskManagementService(authUserId: string, email: string, input: EgpSdkRunRiskManagementServiceInput, fullName?: string | null): Promise<EgpSdkRunRiskManagementServiceResult> {
        const created = await this.createRiskRegister(authUserId, email, { governanceHubId: input.governanceHubId, riskKey: input.riskKey, riskTitle: input.riskTitle }, fullName);
        return { riskId: created.id, riskKey: created.riskKey, status: created.status };
    }

    async sdkRunDashboardService(authUserId: string, email: string, input: EgpSdkRunDashboardServiceInput, fullName?: string | null): Promise<EgpSdkRunDashboardServiceResult> {
        const created = await this.createComplianceDashboard(authUserId, email, { governanceHubId: input.governanceHubId, dashboardKey: input.dashboardKey, dashboardName: input.dashboardName }, fullName);
        return { dashboardId: created.id, dashboardKey: created.dashboardKey, status: created.status };
    }
}

export const enterpriseGovernancePlatformService = new EnterpriseGovernancePlatformService();
