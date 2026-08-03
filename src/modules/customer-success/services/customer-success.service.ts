import {
    buildAdoptionTrackingPayload,
    buildChurnPredictionPayload,
    buildCommunicationPlanPayload,
    buildCsAuditPayload,
    buildCsDashboardStats,
    buildCsPipelineInfo,
    buildEngagementPayload,
    buildExecutiveSummaryPayload,
    buildExpansionOpportunityPayload,
    buildFeedbackAnalysisPayload,
    buildHealthScorePayload,
    buildLifecycleManagementPayload,
    buildLookupMaps,
    buildOnboardingWorkflowPayload,
    buildQbrReportPayload,
    buildRenewalPlanPayload,
    buildRiskAnalysisPayload,
    buildSlaMonitoringPayload,
    buildSuccessKpiDashboardPayload,
    buildSuccessPlaybookPayload,
    buildSupportTrendAnalysisPayload,
    buildTrainingRecommendationPayload,
    mapAdoptionTrackingSummary,
    mapAuditEntry,
    mapChurnPredictionSummary,
    mapCommunicationPlanSummary,
    mapEngagementSummary,
    mapExecutiveSummarySummary,
    mapExpansionOpportunitySummary,
    mapFeedbackAnalysisSummary,
    mapHealthScoreSummary,
    mapLifecycleManagementSummary,
    mapOnboardingWorkflowSummary,
    mapQbrReportSummary,
    mapRenewalPlanSummary,
    mapRiskAnalysisSummary,
    mapSlaMonitoringSummary,
    mapSuccessKpiDashboardSummary,
    mapSuccessPlaybookSummary,
    mapSupportTrendAnalysisSummary,
    mapTrainingRecommendationSummary,
} from "@/src/modules/database/lib/customer-success-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    AdoptionTrackingSummary,
    AuditEntry,
    ChurnPredictionSummary,
    CommunicationPlanSummary,
    CreateAdoptionTrackingInput,
    CreateChurnPredictionInput,
    CreateCommunicationPlanInput,
    CreateEngagementInput,
    CreateExecutiveSummaryInput,
    CreateExpansionOpportunityInput,
    CreateFeedbackAnalysisInput,
    CreateHealthScoreInput,
    CreateLifecycleManagementInput,
    CreateOnboardingWorkflowInput,
    CreateQbrReportInput,
    CreateRenewalPlanInput,
    CreateRiskAnalysisInput,
    CreateSlaMonitoringInput,
    CreateSuccessKpiDashboardInput,
    CreateSuccessPlaybookInput,
    CreateSupportTrendAnalysisInput,
    CreateTrainingRecommendationInput,
    CsDashboardStats,
    CsPipelineInfo,
    CsSdkGenerateArtifactInput,
    CsSdkGenerateArtifactResult,
    CsSdkRunAnalysisInput,
    CsSdkRunAnalysisResult,
    CsSdkStartEngagementInput,
    CsSdkStartEngagementResult,
    EngagementSummary,
    ExecutiveSummarySummary,
    ExpansionOpportunitySummary,
    FeedbackAnalysisSummary,
    HealthScoreSummary,
    LifecycleManagementSummary,
    OnboardingWorkflowSummary,
    QbrReportSummary,
    RenewalPlanSummary,
    RiskAnalysisSummary,
    SlaMonitoringSummary,
    SuccessKpiDashboardSummary,
    SuccessPlaybookSummary,
    SupportTrendAnalysisSummary,
    TrainingRecommendationSummary,
} from "@/src/modules/customer-success/types";

export class CustomerSuccessService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    /** Loads cross-module lookups: CRM clients/contacts, projects, BA/SA/DF/QA/DD engagements, support context. */
    private async getMaps(organizationId: string) {
        const [csEngagements, baEngagements, saEngagements, dfEngagements, qaEngagements, ddEngagements, solutionArchitectures, workPackages, qaReleaseReadiness, ddReleaseVersions, baBrds, baFrsDocuments, clients, contacts, projects, agents, sessions] = await Promise.all([
            databaseService.csEngagements.listByOrganization(organizationId),
            databaseService.baEngagements.listByOrganization(organizationId),
            databaseService.saEngagements.listByOrganization(organizationId),
            databaseService.dfEngagements.listByOrganization(organizationId),
            databaseService.qaEngagements.listByOrganization(organizationId),
            databaseService.ddEngagements.listByOrganization(organizationId),
            databaseService.saSolutionArchitectures.listByOrganization(organizationId),
            databaseService.dfWorkPackages.listByOrganization(organizationId),
            databaseService.qaReleaseReadiness.listByOrganization(organizationId),
            databaseService.ddReleaseVersions.listByOrganization(organizationId),
            databaseService.baBrds.listByOrganization(organizationId),
            databaseService.baFrsDocuments.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.contacts.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(csEngagements, baEngagements, saEngagements, dfEngagements, qaEngagements, ddEngagements, solutionArchitectures, workPackages, qaReleaseReadiness, ddReleaseVersions, baBrds, baFrsDocuments, clients, contacts, projects, agents, sessions);
    }

    async getEngagements(authUserId: string, email: string, fullName?: string | null): Promise<EngagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csEngagements.listByOrganization(context.organizationId)).map((e) => mapEngagementSummary(e, maps));
    }

    async createEngagement(authUserId: string, email: string, input: CreateEngagementInput, fullName?: string | null): Promise<EngagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csEngagements.create(buildEngagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create engagement");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "engagement", "create", `Engagement ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEngagementSummary(created, maps);
    }

    async getOnboardingWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<OnboardingWorkflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csOnboardingWorkflows.listByOrganization(context.organizationId)).map((r) => mapOnboardingWorkflowSummary(r, maps));
    }

    async createOnboardingWorkflow(authUserId: string, email: string, input: CreateOnboardingWorkflowInput, fullName?: string | null): Promise<OnboardingWorkflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csOnboardingWorkflows.create(buildOnboardingWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create onboarding workflow");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "onboarding_workflow", "create", `Onboarding workflow ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingWorkflowSummary(created, maps);
    }

    async getAdoptionTracking(authUserId: string, email: string, fullName?: string | null): Promise<AdoptionTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csAdoptionTracking.listByOrganization(context.organizationId)).map((r) => mapAdoptionTrackingSummary(r, maps));
    }

    async createAdoptionTracking(authUserId: string, email: string, input: CreateAdoptionTrackingInput, fullName?: string | null): Promise<AdoptionTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csAdoptionTracking.create(buildAdoptionTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create adoption tracking");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "adoption_tracking", "create", `Adoption tracking ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAdoptionTrackingSummary(created, maps);
    }

    async getHealthScores(authUserId: string, email: string, fullName?: string | null): Promise<HealthScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csHealthScores.listByOrganization(context.organizationId)).map((r) => mapHealthScoreSummary(r, maps));
    }

    async createHealthScore(authUserId: string, email: string, input: CreateHealthScoreInput, fullName?: string | null): Promise<HealthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csHealthScores.create(buildHealthScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create health score");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "health_score", "create", `Health score ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthScoreSummary(created, maps);
    }

    async getRenewalPlans(authUserId: string, email: string, fullName?: string | null): Promise<RenewalPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csRenewalPlans.listByOrganization(context.organizationId)).map((r) => mapRenewalPlanSummary(r, maps));
    }

    async createRenewalPlan(authUserId: string, email: string, input: CreateRenewalPlanInput, fullName?: string | null): Promise<RenewalPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csRenewalPlans.create(buildRenewalPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renewal plan");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "renewal_plan", "create", `Renewal plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalPlanSummary(created, maps);
    }

    async getExpansionOpportunities(authUserId: string, email: string, fullName?: string | null): Promise<ExpansionOpportunitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csExpansionOpportunities.listByOrganization(context.organizationId)).map((r) => mapExpansionOpportunitySummary(r, maps));
    }

    async createExpansionOpportunity(authUserId: string, email: string, input: CreateExpansionOpportunityInput, fullName?: string | null): Promise<ExpansionOpportunitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csExpansionOpportunities.create(buildExpansionOpportunityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create expansion opportunity");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "expansion_opportunity", "create", `Expansion opportunity ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExpansionOpportunitySummary(created, maps);
    }

    async getRiskAnalyses(authUserId: string, email: string, fullName?: string | null): Promise<RiskAnalysisSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csRiskAnalyses.listByOrganization(context.organizationId)).map((r) => mapRiskAnalysisSummary(r, maps));
    }

    async createRiskAnalysis(authUserId: string, email: string, input: CreateRiskAnalysisInput, fullName?: string | null): Promise<RiskAnalysisSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csRiskAnalyses.create(buildRiskAnalysisPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create risk analysis");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "risk_analysis", "create", `Risk analysis ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskAnalysisSummary(created, maps);
    }

    async getSupportTrendAnalyses(authUserId: string, email: string, fullName?: string | null): Promise<SupportTrendAnalysisSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csSupportTrendAnalyses.listByOrganization(context.organizationId)).map((r) => mapSupportTrendAnalysisSummary(r, maps));
    }

    async createSupportTrendAnalysis(authUserId: string, email: string, input: CreateSupportTrendAnalysisInput, fullName?: string | null): Promise<SupportTrendAnalysisSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csSupportTrendAnalyses.create(buildSupportTrendAnalysisPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create support trend analysis");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "support_trend_analysis", "create", `Support trend analysis ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSupportTrendAnalysisSummary(created, maps);
    }

    async getSuccessPlaybooks(authUserId: string, email: string, fullName?: string | null): Promise<SuccessPlaybookSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csSuccessPlaybooks.listByOrganization(context.organizationId)).map((r) => mapSuccessPlaybookSummary(r, maps));
    }

    async createSuccessPlaybook(authUserId: string, email: string, input: CreateSuccessPlaybookInput, fullName?: string | null): Promise<SuccessPlaybookSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csSuccessPlaybooks.create(buildSuccessPlaybookPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create success playbook");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "success_playbook", "create", `Success playbook ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSuccessPlaybookSummary(created, maps);
    }

    async getQbrReports(authUserId: string, email: string, fullName?: string | null): Promise<QbrReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csQbrReports.listByOrganization(context.organizationId)).map((r) => mapQbrReportSummary(r, maps));
    }

    async createQbrReport(authUserId: string, email: string, input: CreateQbrReportInput, fullName?: string | null): Promise<QbrReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csQbrReports.create(buildQbrReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create QBR report");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "qbr_report", "create", `QBR report ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapQbrReportSummary(created, maps);
    }

    async getCommunicationPlans(authUserId: string, email: string, fullName?: string | null): Promise<CommunicationPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csCommunicationPlans.listByOrganization(context.organizationId)).map((r) => mapCommunicationPlanSummary(r, maps));
    }

    async createCommunicationPlan(authUserId: string, email: string, input: CreateCommunicationPlanInput, fullName?: string | null): Promise<CommunicationPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csCommunicationPlans.create(buildCommunicationPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create communication plan");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "communication_plan", "create", `Communication plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCommunicationPlanSummary(created, maps);
    }

    async getTrainingRecommendations(authUserId: string, email: string, fullName?: string | null): Promise<TrainingRecommendationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csTrainingRecommendations.listByOrganization(context.organizationId)).map((r) => mapTrainingRecommendationSummary(r, maps));
    }

    async createTrainingRecommendation(authUserId: string, email: string, input: CreateTrainingRecommendationInput, fullName?: string | null): Promise<TrainingRecommendationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csTrainingRecommendations.create(buildTrainingRecommendationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create training recommendation");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "training_recommendation", "create", `Training recommendation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTrainingRecommendationSummary(created, maps);
    }

    async getFeedbackAnalyses(authUserId: string, email: string, fullName?: string | null): Promise<FeedbackAnalysisSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csFeedbackAnalyses.listByOrganization(context.organizationId)).map((r) => mapFeedbackAnalysisSummary(r, maps));
    }

    async createFeedbackAnalysis(authUserId: string, email: string, input: CreateFeedbackAnalysisInput, fullName?: string | null): Promise<FeedbackAnalysisSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csFeedbackAnalyses.create(buildFeedbackAnalysisPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create feedback analysis");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "feedback_analysis", "create", `Feedback analysis ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeedbackAnalysisSummary(created, maps);
    }

    async getSlaMonitoring(authUserId: string, email: string, fullName?: string | null): Promise<SlaMonitoringSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csSlaMonitoring.listByOrganization(context.organizationId)).map((r) => mapSlaMonitoringSummary(r, maps));
    }

    async createSlaMonitoring(authUserId: string, email: string, input: CreateSlaMonitoringInput, fullName?: string | null): Promise<SlaMonitoringSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csSlaMonitoring.create(buildSlaMonitoringPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create SLA monitoring");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "sla_monitoring", "create", `SLA monitoring ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSlaMonitoringSummary(created, maps);
    }

    async getSuccessKpiDashboards(authUserId: string, email: string, fullName?: string | null): Promise<SuccessKpiDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csSuccessKpiDashboards.listByOrganization(context.organizationId)).map((r) => mapSuccessKpiDashboardSummary(r, maps));
    }

    async createSuccessKpiDashboard(authUserId: string, email: string, input: CreateSuccessKpiDashboardInput, fullName?: string | null): Promise<SuccessKpiDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csSuccessKpiDashboards.create(buildSuccessKpiDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create KPI dashboard");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "success_kpi_dashboard", "create", `KPI dashboard ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSuccessKpiDashboardSummary(created, maps);
    }

    async getChurnPredictions(authUserId: string, email: string, fullName?: string | null): Promise<ChurnPredictionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csChurnPredictions.listByOrganization(context.organizationId)).map((r) => mapChurnPredictionSummary(r, maps));
    }

    async createChurnPrediction(authUserId: string, email: string, input: CreateChurnPredictionInput, fullName?: string | null): Promise<ChurnPredictionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csChurnPredictions.create(buildChurnPredictionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create churn prediction");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "churn_prediction", "create", `Churn prediction ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapChurnPredictionSummary(created, maps);
    }

    async getLifecycleManagement(authUserId: string, email: string, fullName?: string | null): Promise<LifecycleManagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csLifecycleManagement.listByOrganization(context.organizationId)).map((r) => mapLifecycleManagementSummary(r, maps));
    }

    async createLifecycleManagement(authUserId: string, email: string, input: CreateLifecycleManagementInput, fullName?: string | null): Promise<LifecycleManagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csLifecycleManagement.create(buildLifecycleManagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create lifecycle management");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "lifecycle_management", "create", `Lifecycle management ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLifecycleManagementSummary(created, maps);
    }

    async getExecutiveSummaries(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveSummarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csExecutiveSummaries.listByOrganization(context.organizationId)).map((r) => mapExecutiveSummarySummary(r, maps));
    }

    async createExecutiveSummary(authUserId: string, email: string, input: CreateExecutiveSummaryInput, fullName?: string | null): Promise<ExecutiveSummarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csExecutiveSummaries.create(buildExecutiveSummaryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executive summary");
        await databaseService.csAuditLogs.create(buildCsAuditPayload(context.organizationId, "executive_summary", "create", `Executive summary ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveSummarySummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getPipelineInfo(): Promise<CsPipelineInfo> {
        return buildCsPipelineInfo();
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CsDashboardStats> {
        const [engagements, onboardingWorkflows, adoptionTracking, healthScores, renewalPlans, expansionOpportunities, riskAnalyses, supportTrendAnalyses, successPlaybooks, qbrReports, communicationPlans, trainingRecommendations, feedbackAnalyses, slaMonitoring, successKpiDashboards, churnPredictions, lifecycleManagement, executiveSummaries] = await Promise.all([
            this.getEngagements(authUserId, email, fullName),
            this.getOnboardingWorkflows(authUserId, email, fullName),
            this.getAdoptionTracking(authUserId, email, fullName),
            this.getHealthScores(authUserId, email, fullName),
            this.getRenewalPlans(authUserId, email, fullName),
            this.getExpansionOpportunities(authUserId, email, fullName),
            this.getRiskAnalyses(authUserId, email, fullName),
            this.getSupportTrendAnalyses(authUserId, email, fullName),
            this.getSuccessPlaybooks(authUserId, email, fullName),
            this.getQbrReports(authUserId, email, fullName),
            this.getCommunicationPlans(authUserId, email, fullName),
            this.getTrainingRecommendations(authUserId, email, fullName),
            this.getFeedbackAnalyses(authUserId, email, fullName),
            this.getSlaMonitoring(authUserId, email, fullName),
            this.getSuccessKpiDashboards(authUserId, email, fullName),
            this.getChurnPredictions(authUserId, email, fullName),
            this.getLifecycleManagement(authUserId, email, fullName),
            this.getExecutiveSummaries(authUserId, email, fullName),
        ]);
        return buildCsDashboardStats({ engagements, onboardingWorkflows, adoptionTracking, healthScores, renewalPlans, expansionOpportunities, riskAnalyses, supportTrendAnalyses, successPlaybooks, qbrReports, communicationPlans, trainingRecommendations, feedbackAnalyses, slaMonitoring, successKpiDashboards, churnPredictions, lifecycleManagement, executiveSummaries });
    }

    async sdkStartEngagement(authUserId: string, email: string, input: CsSdkStartEngagementInput, fullName?: string | null): Promise<CsSdkStartEngagementResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        const context = await knowledge.resolveContext({ contextKey: `cs-${input.engagementKey}`, agentId: input.agentId, sessionId: input.sessionId });
        const engagement = await this.createEngagement(authUserId, email, { ...input, knowledgeContextId: context.contextId, pipelineStage: "customer_success" }, fullName);
        let aiTaskId: string | null = null;
        if (input.agentId && input.sessionId) {
            const task = await ai.executeTask({ taskType: "customer_success", agentId: input.agentId, sessionId: input.sessionId, moduleSource: "customer_success", inputPayload: { engagementKey: input.engagementKey, title: input.title } });
            aiTaskId = task.taskId;
        }
        if (input.clientId) {
            await knowledge.storeMemory({ entityType: "client", entityId: input.clientId, memoryKey: `cs-${input.engagementKey}`, summary: input.title });
        }
        return { engagementId: engagement.id, engagementKey: engagement.engagementKey, pipelineStage: engagement.pipelineStage, aiTaskId };
    }

    async sdkGenerateArtifact(authUserId: string, email: string, input: CsSdkGenerateArtifactInput, fullName?: string | null): Promise<CsSdkGenerateArtifactResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: `generate_${input.artifactType}`, moduleSource: "customer_success", inputPayload: { engagementId: input.engagementId, title: input.title, content: input.content } });
        const key = input.title.replace(/\s+/g, "-").toLowerCase();
        if (input.artifactType === "onboarding_workflow") {
            const created = await this.createOnboardingWorkflow(authUserId, email, { engagementId: input.engagementId, workflowKey: key, name: input.title }, fullName);
            return { artifactId: created.id, artifactType: "onboarding_workflow", status: created.status };
        }
        if (input.artifactType === "health_score") {
            const created = await this.createHealthScore(authUserId, email, { engagementId: input.engagementId, scoreKey: key, name: input.title, overallScore: Number(input.content) || 0 }, fullName);
            return { artifactId: created.id, artifactType: "health_score", status: created.status };
        }
        if (input.artifactType === "qbr_report") {
            const created = await this.createQbrReport(authUserId, email, { engagementId: input.engagementId, reportKey: key, title: input.title, quarter: input.content }, fullName);
            return { artifactId: created.id, artifactType: "qbr_report", status: created.status };
        }
        const created = await this.createExecutiveSummary(authUserId, email, { engagementId: input.engagementId, summaryKey: key, title: input.title, summaryContent: input.content }, fullName);
        return { artifactId: created.id, artifactType: "executive_summary", status: created.status };
    }

    async sdkRunAnalysis(authUserId: string, email: string, input: CsSdkRunAnalysisInput, fullName?: string | null): Promise<CsSdkRunAnalysisResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.analysisType, limit: 5 });
        await ai.executeTask({ taskType: `cs_${input.analysisType}_analysis`, moduleSource: "customer_success", inputPayload: { engagementId: input.engagementId, ...input.inputPayload } });
        if (input.analysisType === "churn") {
            const created = await this.createChurnPrediction(authUserId, email, { engagementId: input.engagementId, predictionKey: String(input.inputPayload.predictionKey ?? "CHURN-AUTO"), name: String(input.inputPayload.name ?? "Churn Analysis"), churnProbability: Number(input.inputPayload.churnProbability ?? 0), riskSignals: (input.inputPayload.riskSignals as unknown[]) ?? [], retentionActions: (input.inputPayload.retentionActions as unknown[]) ?? [] }, fullName);
            return { analysisId: created.id, analysisType: "churn", status: created.status };
        }
        if (input.analysisType === "support_trends") {
            const created = await this.createSupportTrendAnalysis(authUserId, email, { engagementId: input.engagementId, analysisKey: String(input.inputPayload.analysisKey ?? "SUPPORT-AUTO"), name: String(input.inputPayload.name ?? "Support Trend Analysis"), trendMetrics: (input.inputPayload.trendMetrics as unknown[]) ?? [], insights: String(input.inputPayload.insights ?? "") }, fullName);
            return { analysisId: created.id, analysisType: "support_trends", status: created.status };
        }
        const created = await this.createFeedbackAnalysis(authUserId, email, { engagementId: input.engagementId, analysisKey: String(input.inputPayload.analysisKey ?? "FEEDBACK-AUTO"), name: String(input.inputPayload.name ?? "Feedback Analysis"), sentimentScore: Number(input.inputPayload.sentimentScore ?? 0), themes: (input.inputPayload.themes as unknown[]) ?? [], recommendations: String(input.inputPayload.recommendations ?? "") }, fullName);
        return { analysisId: created.id, analysisType: "feedback", status: created.status };
    }

    async getEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getDdEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getQaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.qaEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getBaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getSaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getDfEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getQaReleaseReadinessOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.qaReleaseReadiness.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.title }));
    }

    async getDdReleaseVersionOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddReleaseVersions.listByOrganization(context.organizationId)).map((v) => ({ id: v.id, name: v.version_number }));
    }

    async getSolutionArchitectureOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saSolutionArchitectures.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.title }));
    }

    async getWorkPackageOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfWorkPackages.listByOrganization(context.organizationId)).map((w) => ({ id: w.id, name: w.title }));
    }

    async getBrdOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baBrds.listByOrganization(context.organizationId)).map((b) => ({ id: b.id, name: b.title }));
    }

    async getFrsOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baFrsDocuments.listByOrganization(context.organizationId)).map((f) => ({ id: f.id, name: f.title }));
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.clients.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: c.name }));
    }

    async getContactOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.contacts.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: `${c.first_name} ${c.last_name}`.trim() }));
    }

    async getProjectOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.projects.listByOrganization(context.organizationId)).map((p) => ({ id: p.id, name: p.name }));
    }

    async getAgentOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.name }));
    }

    async getSessionOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiSessions.listByOrganization(context.organizationId)).map((s) => ({ id: s.id, name: s.session_key }));
    }
}

export const customerSuccessService = new CustomerSuccessService();
