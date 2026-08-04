import {
    buildOrganizationHubLookupMaps,
    buildAofAuditPayload,
    buildAofDashboardStats,
    buildAofPipelineInfo,
    mapAuditEntry,
    buildOrganizationHubPayload,
    mapOrganizationHubSummary,
    buildGrowthOrchestratorPayload,
    mapGrowthOrchestratorSummary,
    buildCampaignIntelligencePayload,
    mapCampaignIntelligenceSummary,
    buildLeadPrioritizationPayload,
    mapLeadPrioritizationSummary,
    buildOpportunityRecommendationPayload,
    mapOpportunityRecommendationSummary,
    buildPipelineHealthPayload,
    mapPipelineHealthSummary,
    buildGrowthAnalyticsPayload,
    mapGrowthAnalyticsSummary,
    buildExecutiveGrowthDashboardPayload,
    mapExecutiveGrowthDashboardSummary,
    buildDeliveryOrchestratorPayload,
    mapDeliveryOrchestratorSummary,
    buildResourcePlannerPayload,
    mapResourcePlannerSummary,
    buildImplementationSchedulerPayload,
    mapImplementationSchedulerSummary,
    buildDeploymentCoordinationPayload,
    mapDeploymentCoordinationSummary,
    buildDeliveryIntelligencePayload,
    mapDeliveryIntelligenceSummary,
    buildCustomerSuccessAutomationPayload,
    mapCustomerSuccessAutomationSummary,
    buildExecutiveDeliveryDashboardPayload,
    mapExecutiveDeliveryDashboardSummary,
    buildIdeaRegistryPayload,
    mapIdeaRegistrySummary,
    buildInnovationPipelinePayload,
    mapInnovationPipelineSummary,
    buildExperimentTrackerPayload,
    mapExperimentTrackerSummary,
    buildValidationWorkflowPayload,
    mapValidationWorkflowSummary,
    buildOutcomeEvaluationPayload,
    mapOutcomeEvaluationSummary,
    buildKnowledgeRepositoryPayload,
    mapKnowledgeRepositorySummary,
    buildAiTaskRouterPayload,
    mapAiTaskRouterSummary,
    buildHumanApprovalEnginePayload,
    mapHumanApprovalEngineSummary,
    buildPolicyEnginePayload,
    mapPolicyEngineSummary,
    buildExecutionHistoryPayload,
    mapExecutionHistorySummary,
    buildAiGovernanceRulePayload,
    mapAiGovernanceRuleSummary,
    buildOrganizationMetricPayload,
    mapOrganizationMetricSummary,
    buildOrganizationHealthPayload,
    mapOrganizationHealthSummary,
    buildInnovationDashboardPayload,
    mapInnovationDashboardSummary,
    buildMissionProgressPayload,
    mapMissionProgressSummary,
    buildOrganizationFailurePayload,
    mapOrganizationFailureSummary,
    mapGrowthOrchestratorForStats,
    mapDeliveryOrchestratorForStats,
    mapOrganizationMetricForStats,
    mapIdeaRegistryForStats,
    mapAiTaskRouterForStats,
    mapHumanApprovalEngineForStats,
    mapOrganizationHealthForStats,
    mapOrganizationFailureForStats,
} from "@/src/modules/database/lib/ai-organization-foundation-mappers";
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
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    OrganizationHubSummary,
    CreateOrganizationHubInput,
    GrowthOrchestratorSummary,
    CreateGrowthOrchestratorInput,
    CampaignIntelligenceSummary,
    CreateCampaignIntelligenceInput,
    LeadPrioritizationSummary,
    CreateLeadPrioritizationInput,
    OpportunityRecommendationSummary,
    CreateOpportunityRecommendationInput,
    PipelineHealthSummary,
    CreatePipelineHealthInput,
    GrowthAnalyticsSummary,
    CreateGrowthAnalyticsInput,
    ExecutiveGrowthDashboardSummary,
    CreateExecutiveGrowthDashboardInput,
    DeliveryOrchestratorSummary,
    CreateDeliveryOrchestratorInput,
    ResourcePlannerSummary,
    CreateResourcePlannerInput,
    ImplementationSchedulerSummary,
    CreateImplementationSchedulerInput,
    DeploymentCoordinationSummary,
    CreateDeploymentCoordinationInput,
    DeliveryIntelligenceSummary,
    CreateDeliveryIntelligenceInput,
    CustomerSuccessAutomationSummary,
    CreateCustomerSuccessAutomationInput,
    ExecutiveDeliveryDashboardSummary,
    CreateExecutiveDeliveryDashboardInput,
    IdeaRegistrySummary,
    CreateIdeaRegistryInput,
    InnovationPipelineSummary,
    CreateInnovationPipelineInput,
    ExperimentTrackerSummary,
    CreateExperimentTrackerInput,
    ValidationWorkflowSummary,
    CreateValidationWorkflowInput,
    OutcomeEvaluationSummary,
    CreateOutcomeEvaluationInput,
    KnowledgeRepositorySummary,
    CreateKnowledgeRepositoryInput,
    AiTaskRouterSummary,
    CreateAiTaskRouterInput,
    HumanApprovalEngineSummary,
    CreateHumanApprovalEngineInput,
    PolicyEngineSummary,
    CreatePolicyEngineInput,
    ExecutionHistorySummary,
    CreateExecutionHistoryInput,
    AiGovernanceRuleSummary,
    CreateAiGovernanceRuleInput,
    OrganizationMetricSummary,
    CreateOrganizationMetricInput,
    OrganizationHealthSummary,
    CreateOrganizationHealthInput,
    InnovationDashboardSummary,
    CreateInnovationDashboardInput,
    MissionProgressSummary,
    CreateMissionProgressInput,
    OrganizationFailureSummary,
    CreateOrganizationFailureInput,
    AuditEntry,
    AofDashboardStats,
    AofPipelineInfo,
    AofSdkRunAgoServiceInput,
    AofSdkRunAgoServiceResult,
    AofSdkRunAdoServiceInput,
    AofSdkRunAdoServiceResult,
    AofSdkRunAioServiceInput,
    AofSdkRunAioServiceResult,
    AofSdkRunOrchestrationServiceInput,
    AofSdkRunOrchestrationServiceResult,
} from "@/src/modules/ai-organization-foundation/types";

export class AiOrganizationFoundationService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const organizationHubs = await databaseService.aofOrganizationHubs.listByOrganization(organizationId);
        return buildOrganizationHubLookupMaps(organizationHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AofDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildAofDashboardStats({ organizationHubs: [], growthOrchestrators: [], deliveryOrchestrators: [], ideaRegistry: [], aiTaskRouters: [], humanApprovalEngine: [], organizationMetrics: [], organizationHealth: [], organizationFailures: [], auditLogs: [] });
        const [organizationHubs, growthOrchestratorsRaw, deliveryOrchestratorsRaw, ideaRegistryRaw, aiTaskRoutersRaw, humanApprovalEngineRaw, organizationMetricsRaw, organizationHealthRaw, organizationFailures, auditLogs] = await Promise.all([
            this.getOrganizationHubs(authUserId, email, fullName),
            databaseService.aofGrowthOrchestrators.listByOrganization(context.organizationId),
            databaseService.aofDeliveryOrchestrators.listByOrganization(context.organizationId),
            databaseService.aofIdeaRegistry.listByOrganization(context.organizationId),
            databaseService.aofAiTaskRouters.listByOrganization(context.organizationId),
            databaseService.aofHumanApprovalEngine.listByOrganization(context.organizationId),
            databaseService.aofOrganizationMetrics.listByOrganization(context.organizationId),
            databaseService.aofOrganizationHealth.listByOrganization(context.organizationId),
            this.getOrganizationFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildAofDashboardStats({
            organizationHubs,
            growthOrchestrators: growthOrchestratorsRaw.map(mapGrowthOrchestratorForStats),
            deliveryOrchestrators: deliveryOrchestratorsRaw.map(mapDeliveryOrchestratorForStats),
            ideaRegistry: ideaRegistryRaw.map(mapIdeaRegistryForStats),
            aiTaskRouters: aiTaskRoutersRaw.map(mapAiTaskRouterForStats),
            humanApprovalEngine: humanApprovalEngineRaw.map(mapHumanApprovalEngineForStats),
            organizationMetrics: organizationMetricsRaw.map(mapOrganizationMetricForStats),
            organizationHealth: organizationHealthRaw.map(mapOrganizationHealthForStats),
            organizationFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): AofPipelineInfo {
        return buildAofPipelineInfo();
    }

    async getOrganizationHubs(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofOrganizationHubs.listByOrganization(context.organizationId)).map((r) => mapOrganizationHubSummary(r));
    }

    async createOrganizationHub(authUserId: string, email: string, input: CreateOrganizationHubInput, fullName?: string | null): Promise<OrganizationHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofOrganizationHubs.create(buildOrganizationHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create organizationHubs");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "organization_hubs", "create", `OrganizationHub created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrganizationHubSummary(created);
    }

    async getGrowthOrchestrators(authUserId: string, email: string, fullName?: string | null): Promise<GrowthOrchestratorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofGrowthOrchestrators.listByOrganization(context.organizationId)).map((r) => mapGrowthOrchestratorSummary(r, maps));
    }

    async createGrowthOrchestrator(authUserId: string, email: string, input: CreateGrowthOrchestratorInput, fullName?: string | null): Promise<GrowthOrchestratorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofGrowthOrchestrators.create(buildGrowthOrchestratorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthOrchestrators");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "growth_orchestrators", "create", `GrowthOrchestrator created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGrowthOrchestratorSummary(created, maps);
    }

    async getCampaignIntelligences(authUserId: string, email: string, fullName?: string | null): Promise<CampaignIntelligenceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofCampaignIntelligence.listByOrganization(context.organizationId)).map((r) => mapCampaignIntelligenceSummary(r, maps));
    }

    async createCampaignIntelligence(authUserId: string, email: string, input: CreateCampaignIntelligenceInput, fullName?: string | null): Promise<CampaignIntelligenceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofCampaignIntelligence.create(buildCampaignIntelligencePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campaignIntelligence");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "campaign_intelligence", "create", `CampaignIntelligence created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampaignIntelligenceSummary(created, maps);
    }

    async getLeadPrioritizations(authUserId: string, email: string, fullName?: string | null): Promise<LeadPrioritizationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofLeadPrioritization.listByOrganization(context.organizationId)).map((r) => mapLeadPrioritizationSummary(r, maps));
    }

    async createLeadPrioritization(authUserId: string, email: string, input: CreateLeadPrioritizationInput, fullName?: string | null): Promise<LeadPrioritizationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofLeadPrioritization.create(buildLeadPrioritizationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create leadPrioritization");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "lead_prioritization", "create", `LeadPrioritization created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLeadPrioritizationSummary(created, maps);
    }

    async getOpportunityRecommendations(authUserId: string, email: string, fullName?: string | null): Promise<OpportunityRecommendationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofOpportunityRecommendations.listByOrganization(context.organizationId)).map((r) => mapOpportunityRecommendationSummary(r, maps));
    }

    async createOpportunityRecommendation(authUserId: string, email: string, input: CreateOpportunityRecommendationInput, fullName?: string | null): Promise<OpportunityRecommendationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofOpportunityRecommendations.create(buildOpportunityRecommendationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create opportunityRecommendations");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "opportunity_recommendations", "create", `OpportunityRecommendation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOpportunityRecommendationSummary(created, maps);
    }

    async getPipelineHealths(authUserId: string, email: string, fullName?: string | null): Promise<PipelineHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofPipelineHealth.listByOrganization(context.organizationId)).map((r) => mapPipelineHealthSummary(r, maps));
    }

    async createPipelineHealth(authUserId: string, email: string, input: CreatePipelineHealthInput, fullName?: string | null): Promise<PipelineHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofPipelineHealth.create(buildPipelineHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pipelineHealth");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "pipeline_health", "create", `PipelineHealth created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPipelineHealthSummary(created, maps);
    }

    async getGrowthAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<GrowthAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofGrowthAnalytics.listByOrganization(context.organizationId)).map((r) => mapGrowthAnalyticsSummary(r, maps));
    }

    async createGrowthAnalytics(authUserId: string, email: string, input: CreateGrowthAnalyticsInput, fullName?: string | null): Promise<GrowthAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofGrowthAnalytics.create(buildGrowthAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthAnalytics");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "growth_analytics", "create", `GrowthAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGrowthAnalyticsSummary(created, maps);
    }

    async getExecutiveGrowthDashboards(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveGrowthDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofExecutiveGrowthDashboards.listByOrganization(context.organizationId)).map((r) => mapExecutiveGrowthDashboardSummary(r, maps));
    }

    async createExecutiveGrowthDashboard(authUserId: string, email: string, input: CreateExecutiveGrowthDashboardInput, fullName?: string | null): Promise<ExecutiveGrowthDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofExecutiveGrowthDashboards.create(buildExecutiveGrowthDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveGrowthDashboards");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "executive_growth_dashboards", "create", `ExecutiveGrowthDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveGrowthDashboardSummary(created, maps);
    }

    async getDeliveryOrchestrators(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryOrchestratorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofDeliveryOrchestrators.listByOrganization(context.organizationId)).map((r) => mapDeliveryOrchestratorSummary(r, maps));
    }

    async createDeliveryOrchestrator(authUserId: string, email: string, input: CreateDeliveryOrchestratorInput, fullName?: string | null): Promise<DeliveryOrchestratorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofDeliveryOrchestrators.create(buildDeliveryOrchestratorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deliveryOrchestrators");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "delivery_orchestrators", "create", `DeliveryOrchestrator created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeliveryOrchestratorSummary(created, maps);
    }

    async getResourcePlanners(authUserId: string, email: string, fullName?: string | null): Promise<ResourcePlannerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofResourcePlanners.listByOrganization(context.organizationId)).map((r) => mapResourcePlannerSummary(r, maps));
    }

    async createResourcePlanner(authUserId: string, email: string, input: CreateResourcePlannerInput, fullName?: string | null): Promise<ResourcePlannerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofResourcePlanners.create(buildResourcePlannerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create resourcePlanners");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "resource_planners", "create", `ResourcePlanner created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapResourcePlannerSummary(created, maps);
    }

    async getImplementationSchedulers(authUserId: string, email: string, fullName?: string | null): Promise<ImplementationSchedulerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofImplementationSchedulers.listByOrganization(context.organizationId)).map((r) => mapImplementationSchedulerSummary(r, maps));
    }

    async createImplementationScheduler(authUserId: string, email: string, input: CreateImplementationSchedulerInput, fullName?: string | null): Promise<ImplementationSchedulerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofImplementationSchedulers.create(buildImplementationSchedulerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create implementationSchedulers");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "implementation_schedulers", "create", `ImplementationScheduler created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapImplementationSchedulerSummary(created, maps);
    }

    async getDeploymentCoordinations(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentCoordinationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofDeploymentCoordination.listByOrganization(context.organizationId)).map((r) => mapDeploymentCoordinationSummary(r, maps));
    }

    async createDeploymentCoordination(authUserId: string, email: string, input: CreateDeploymentCoordinationInput, fullName?: string | null): Promise<DeploymentCoordinationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofDeploymentCoordination.create(buildDeploymentCoordinationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deploymentCoordination");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "deployment_coordination", "create", `DeploymentCoordination created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentCoordinationSummary(created, maps);
    }

    async getDeliveryIntelligences(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryIntelligenceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofDeliveryIntelligence.listByOrganization(context.organizationId)).map((r) => mapDeliveryIntelligenceSummary(r, maps));
    }

    async createDeliveryIntelligence(authUserId: string, email: string, input: CreateDeliveryIntelligenceInput, fullName?: string | null): Promise<DeliveryIntelligenceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofDeliveryIntelligence.create(buildDeliveryIntelligencePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deliveryIntelligence");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "delivery_intelligence", "create", `DeliveryIntelligence created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeliveryIntelligenceSummary(created, maps);
    }

    async getCustomerSuccessAutomations(authUserId: string, email: string, fullName?: string | null): Promise<CustomerSuccessAutomationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofCustomerSuccessAutomation.listByOrganization(context.organizationId)).map((r) => mapCustomerSuccessAutomationSummary(r, maps));
    }

    async createCustomerSuccessAutomation(authUserId: string, email: string, input: CreateCustomerSuccessAutomationInput, fullName?: string | null): Promise<CustomerSuccessAutomationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofCustomerSuccessAutomation.create(buildCustomerSuccessAutomationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerSuccessAutomation");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "customer_success_automation", "create", `CustomerSuccessAutomation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerSuccessAutomationSummary(created, maps);
    }

    async getExecutiveDeliveryDashboards(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveDeliveryDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofExecutiveDeliveryDashboards.listByOrganization(context.organizationId)).map((r) => mapExecutiveDeliveryDashboardSummary(r, maps));
    }

    async createExecutiveDeliveryDashboard(authUserId: string, email: string, input: CreateExecutiveDeliveryDashboardInput, fullName?: string | null): Promise<ExecutiveDeliveryDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofExecutiveDeliveryDashboards.create(buildExecutiveDeliveryDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveDeliveryDashboards");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "executive_delivery_dashboards", "create", `ExecutiveDeliveryDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveDeliveryDashboardSummary(created, maps);
    }

    async getIdeaRegistrys(authUserId: string, email: string, fullName?: string | null): Promise<IdeaRegistrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofIdeaRegistry.listByOrganization(context.organizationId)).map((r) => mapIdeaRegistrySummary(r, maps));
    }

    async createIdeaRegistry(authUserId: string, email: string, input: CreateIdeaRegistryInput, fullName?: string | null): Promise<IdeaRegistrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofIdeaRegistry.create(buildIdeaRegistryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ideaRegistry");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "idea_registry", "create", `IdeaRegistry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIdeaRegistrySummary(created, maps);
    }

    async getInnovationPipelines(authUserId: string, email: string, fullName?: string | null): Promise<InnovationPipelineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofInnovationPipeline.listByOrganization(context.organizationId)).map((r) => mapInnovationPipelineSummary(r, maps));
    }

    async createInnovationPipeline(authUserId: string, email: string, input: CreateInnovationPipelineInput, fullName?: string | null): Promise<InnovationPipelineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofInnovationPipeline.create(buildInnovationPipelinePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create innovationPipeline");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "innovation_pipeline", "create", `InnovationPipeline created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInnovationPipelineSummary(created, maps);
    }

    async getExperimentTrackers(authUserId: string, email: string, fullName?: string | null): Promise<ExperimentTrackerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofExperimentTracker.listByOrganization(context.organizationId)).map((r) => mapExperimentTrackerSummary(r, maps));
    }

    async createExperimentTracker(authUserId: string, email: string, input: CreateExperimentTrackerInput, fullName?: string | null): Promise<ExperimentTrackerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofExperimentTracker.create(buildExperimentTrackerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create experimentTracker");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "experiment_tracker", "create", `ExperimentTracker created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExperimentTrackerSummary(created, maps);
    }

    async getValidationWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<ValidationWorkflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofValidationWorkflow.listByOrganization(context.organizationId)).map((r) => mapValidationWorkflowSummary(r, maps));
    }

    async createValidationWorkflow(authUserId: string, email: string, input: CreateValidationWorkflowInput, fullName?: string | null): Promise<ValidationWorkflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofValidationWorkflow.create(buildValidationWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create validationWorkflow");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "validation_workflow", "create", `ValidationWorkflow created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapValidationWorkflowSummary(created, maps);
    }

    async getOutcomeEvaluations(authUserId: string, email: string, fullName?: string | null): Promise<OutcomeEvaluationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofOutcomeEvaluation.listByOrganization(context.organizationId)).map((r) => mapOutcomeEvaluationSummary(r, maps));
    }

    async createOutcomeEvaluation(authUserId: string, email: string, input: CreateOutcomeEvaluationInput, fullName?: string | null): Promise<OutcomeEvaluationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofOutcomeEvaluation.create(buildOutcomeEvaluationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create outcomeEvaluation");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "outcome_evaluation", "create", `OutcomeEvaluation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOutcomeEvaluationSummary(created, maps);
    }

    async getKnowledgeRepositorys(authUserId: string, email: string, fullName?: string | null): Promise<KnowledgeRepositorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofKnowledgeRepository.listByOrganization(context.organizationId)).map((r) => mapKnowledgeRepositorySummary(r, maps));
    }

    async createKnowledgeRepository(authUserId: string, email: string, input: CreateKnowledgeRepositoryInput, fullName?: string | null): Promise<KnowledgeRepositorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofKnowledgeRepository.create(buildKnowledgeRepositoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create knowledgeRepository");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "knowledge_repository", "create", `KnowledgeRepository created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKnowledgeRepositorySummary(created, maps);
    }

    async getAiTaskRouters(authUserId: string, email: string, fullName?: string | null): Promise<AiTaskRouterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofAiTaskRouters.listByOrganization(context.organizationId)).map((r) => mapAiTaskRouterSummary(r, maps));
    }

    async createAiTaskRouter(authUserId: string, email: string, input: CreateAiTaskRouterInput, fullName?: string | null): Promise<AiTaskRouterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofAiTaskRouters.create(buildAiTaskRouterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create aiTaskRouters");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "ai_task_routers", "create", `AiTaskRouter created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAiTaskRouterSummary(created, maps);
    }

    async getHumanApprovalEngines(authUserId: string, email: string, fullName?: string | null): Promise<HumanApprovalEngineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofHumanApprovalEngine.listByOrganization(context.organizationId)).map((r) => mapHumanApprovalEngineSummary(r, maps));
    }

    async createHumanApprovalEngine(authUserId: string, email: string, input: CreateHumanApprovalEngineInput, fullName?: string | null): Promise<HumanApprovalEngineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofHumanApprovalEngine.create(buildHumanApprovalEnginePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create humanApprovalEngine");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "human_approval_engine", "create", `HumanApprovalEngine created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHumanApprovalEngineSummary(created, maps);
    }

    async getPolicyEngines(authUserId: string, email: string, fullName?: string | null): Promise<PolicyEngineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofPolicyEngine.listByOrganization(context.organizationId)).map((r) => mapPolicyEngineSummary(r, maps));
    }

    async createPolicyEngine(authUserId: string, email: string, input: CreatePolicyEngineInput, fullName?: string | null): Promise<PolicyEngineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofPolicyEngine.create(buildPolicyEnginePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create policyEngine");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "policy_engine", "create", `PolicyEngine created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPolicyEngineSummary(created, maps);
    }

    async getExecutionHistorys(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofExecutionHistory.listByOrganization(context.organizationId)).map((r) => mapExecutionHistorySummary(r, maps));
    }

    async createExecutionHistory(authUserId: string, email: string, input: CreateExecutionHistoryInput, fullName?: string | null): Promise<ExecutionHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofExecutionHistory.create(buildExecutionHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionHistory");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "execution_history", "create", `ExecutionHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionHistorySummary(created, maps);
    }

    async getAiGovernanceRules(authUserId: string, email: string, fullName?: string | null): Promise<AiGovernanceRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofAiGovernanceRules.listByOrganization(context.organizationId)).map((r) => mapAiGovernanceRuleSummary(r, maps));
    }

    async createAiGovernanceRule(authUserId: string, email: string, input: CreateAiGovernanceRuleInput, fullName?: string | null): Promise<AiGovernanceRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofAiGovernanceRules.create(buildAiGovernanceRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create aiGovernanceRules");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "ai_governance_rules", "create", `AiGovernanceRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAiGovernanceRuleSummary(created, maps);
    }

    async getOrganizationMetrics(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aofOrganizationMetrics.listByOrganization(context.organizationId)).map(mapOrganizationMetricSummary);
    }

    async createOrganizationMetric(authUserId: string, email: string, input: CreateOrganizationMetricInput, fullName?: string | null): Promise<OrganizationMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofOrganizationMetrics.create(buildOrganizationMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create organizationMetrics");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "organization_metrics", "create", `OrganizationMetric created`, created.id));
        return mapOrganizationMetricSummary(created);
    }

    async getOrganizationHealths(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aofOrganizationHealth.listByOrganization(context.organizationId)).map(mapOrganizationHealthSummary);
    }

    async createOrganizationHealth(authUserId: string, email: string, input: CreateOrganizationHealthInput, fullName?: string | null): Promise<OrganizationHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofOrganizationHealth.create(buildOrganizationHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create organizationHealth");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "organization_health", "create", `OrganizationHealth created`, created.id));
        return mapOrganizationHealthSummary(created);
    }

    async getInnovationDashboards(authUserId: string, email: string, fullName?: string | null): Promise<InnovationDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofInnovationDashboards.listByOrganization(context.organizationId)).map((r) => mapInnovationDashboardSummary(r, maps));
    }

    async createInnovationDashboard(authUserId: string, email: string, input: CreateInnovationDashboardInput, fullName?: string | null): Promise<InnovationDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofInnovationDashboards.create(buildInnovationDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create innovationDashboards");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "innovation_dashboards", "create", `InnovationDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInnovationDashboardSummary(created, maps);
    }

    async getMissionProgresss(authUserId: string, email: string, fullName?: string | null): Promise<MissionProgressSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofMissionProgress.listByOrganization(context.organizationId)).map((r) => mapMissionProgressSummary(r, maps));
    }

    async createMissionProgress(authUserId: string, email: string, input: CreateMissionProgressInput, fullName?: string | null): Promise<MissionProgressSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofMissionProgress.create(buildMissionProgressPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create missionProgress");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "mission_progress", "create", `MissionProgress created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMissionProgressSummary(created, maps);
    }

    async getOrganizationFailures(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.aofOrganizationFailures.listByOrganization(context.organizationId)).map((r) => mapOrganizationFailureSummary(r, maps));
    }

    async createOrganizationFailure(authUserId: string, email: string, input: CreateOrganizationFailureInput, fullName?: string | null): Promise<OrganizationFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.aofOrganizationFailures.create(buildOrganizationFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create organizationFailures");
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "organization_failures", "create", `OrganizationFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrganizationFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aofAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getOrganizationHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aofOrganizationHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRunAgoService(authUserId: string, email: string, input: AofSdkRunAgoServiceInput, fullName?: string | null): Promise<AofSdkRunAgoServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createGrowthOrchestrator(authUserId, email, { organizationHubId: input.organizationHubId, orchestratorKey: input.orchestratorKey, orchestratorName: input.orchestratorName }, fullName);
        return { orchestratorId: created.id, orchestratorKey: created.orchestratorKey, status: created.status };
    }

    async sdkRunAdoService(authUserId: string, email: string, input: AofSdkRunAdoServiceInput, fullName?: string | null): Promise<AofSdkRunAdoServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createDeliveryOrchestrator(authUserId, email, { organizationHubId: input.organizationHubId, orchestratorKey: input.orchestratorKey, orchestratorName: input.orchestratorName }, fullName);
        return { orchestratorId: created.id, orchestratorKey: created.orchestratorKey, status: created.status };
    }

    async sdkRunAioService(authUserId: string, email: string, input: AofSdkRunAioServiceInput, fullName?: string | null): Promise<AofSdkRunAioServiceResult> {
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
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createIdeaRegistry(authUserId, email, { organizationHubId: input.organizationHubId, ideaKey: input.ideaKey, ideaTitle: input.ideaTitle }, fullName);
        return { ideaId: created.id, ideaKey: created.ideaKey, status: created.status };
    }

    async sdkRunOrchestrationService(authUserId: string, email: string, input: AofSdkRunOrchestrationServiceInput, fullName?: string | null): Promise<AofSdkRunOrchestrationServiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.getAgents();
        const created = await this.createAiTaskRouter(authUserId, email, { organizationHubId: input.organizationHubId, routerKey: input.routerKey, routerName: input.routerName }, fullName);
        return { routerId: created.id, routerKey: created.routerKey, status: created.status };
    }
}

export const aiOrganizationFoundationService = new AiOrganizationFoundationService();
