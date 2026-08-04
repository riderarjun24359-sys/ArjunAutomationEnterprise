import {
    buildDeliveryHubLookupMaps,
    buildCsdAuditPayload,
    buildCsdDashboardStats,
    buildCsdPipelineInfo,
    mapAuditEntry,
    buildDeliveryHubPayload,
    mapDeliveryHubSummary,
    buildCustomerHealthScorePayload,
    mapCustomerHealthScoreSummary,
    buildAdoptionAnalyticPayload,
    mapAdoptionAnalyticSummary,
    buildSuccessPlanPayload,
    mapSuccessPlanSummary,
    buildCustomerTimelinePayload,
    mapCustomerTimelineSummary,
    buildRenewalForecastPayload,
    mapRenewalForecastSummary,
    buildSupportTicketPayload,
    mapSupportTicketSummary,
    buildLiveChatSessionPayload,
    mapLiveChatSessionSummary,
    buildKnowledgeBaseArticlePayload,
    mapKnowledgeBaseArticleSummary,
    buildSlaPolicyPayload,
    mapSlaPolicySummary,
    buildEscalationRulePayload,
    mapEscalationRuleSummary,
    buildDeploymentAutomationPayload,
    mapDeploymentAutomationSummary,
    buildEnvironmentManagementPayload,
    mapEnvironmentManagementSummary,
    buildDeploymentTrackingPayload,
    mapDeploymentTrackingSummary,
    buildUpgradeManagementPayload,
    mapUpgradeManagementSummary,
    buildReleaseTrackingPayload,
    mapReleaseTrackingSummary,
    buildTrainingPortalPayload,
    mapTrainingPortalSummary,
    buildVideoLibraryPayload,
    mapVideoLibrarySummary,
    buildProductTourPayload,
    mapProductTourSummary,
    buildCertificationPayload,
    mapCertificationSummary,
    buildProgressTrackingPayload,
    mapProgressTrackingSummary,
    buildLearningAnalyticPayload,
    mapLearningAnalyticSummary,
    buildDeliveryWorkflowPayload,
    mapDeliveryWorkflowSummary,
    buildOnboardingAutomationPayload,
    mapOnboardingAutomationSummary,
    buildImplementationTrackingPayload,
    mapImplementationTrackingSummary,
    buildResourceAssignmentPayload,
    mapResourceAssignmentSummary,
    buildMilestoneTrackingPayload,
    mapMilestoneTrackingSummary,
    buildOperationsMetricPayload,
    mapOperationsMetricSummary,
    buildOperationsHealthPayload,
    mapOperationsHealthSummary,
    buildExecutiveKpiPayload,
    mapExecutiveKpiSummary,
    buildDeliveryFailurePayload,
    mapDeliveryFailureSummary,
    mapCustomerHealthScoreForStats,
    mapSupportTicketForStats,
    mapOperationsMetricForStats,
    mapDeploymentTrackingForStats,
    mapTrainingPortalForStats,
    mapOperationsHealthForStats,
    mapDeliveryFailureForStats,
} from "@/src/modules/database/lib/customer-success-delivery-mappers";
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
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    DeliveryHubSummary,
    CreateDeliveryHubInput,
    CustomerHealthScoreSummary,
    CreateCustomerHealthScoreInput,
    AdoptionAnalyticSummary,
    CreateAdoptionAnalyticInput,
    SuccessPlanSummary,
    CreateSuccessPlanInput,
    CustomerTimelineSummary,
    CreateCustomerTimelineInput,
    RenewalForecastSummary,
    CreateRenewalForecastInput,
    SupportTicketSummary,
    CreateSupportTicketInput,
    LiveChatSessionSummary,
    CreateLiveChatSessionInput,
    KnowledgeBaseArticleSummary,
    CreateKnowledgeBaseArticleInput,
    SlaPolicySummary,
    CreateSlaPolicyInput,
    EscalationRuleSummary,
    CreateEscalationRuleInput,
    DeploymentAutomationSummary,
    CreateDeploymentAutomationInput,
    EnvironmentManagementSummary,
    CreateEnvironmentManagementInput,
    DeploymentTrackingSummary,
    CreateDeploymentTrackingInput,
    UpgradeManagementSummary,
    CreateUpgradeManagementInput,
    ReleaseTrackingSummary,
    CreateReleaseTrackingInput,
    TrainingPortalSummary,
    CreateTrainingPortalInput,
    VideoLibrarySummary,
    CreateVideoLibraryInput,
    ProductTourSummary,
    CreateProductTourInput,
    CertificationSummary,
    CreateCertificationInput,
    ProgressTrackingSummary,
    CreateProgressTrackingInput,
    LearningAnalyticSummary,
    CreateLearningAnalyticInput,
    DeliveryWorkflowSummary,
    CreateDeliveryWorkflowInput,
    OnboardingAutomationSummary,
    CreateOnboardingAutomationInput,
    ImplementationTrackingSummary,
    CreateImplementationTrackingInput,
    ResourceAssignmentSummary,
    CreateResourceAssignmentInput,
    MilestoneTrackingSummary,
    CreateMilestoneTrackingInput,
    OperationsMetricSummary,
    CreateOperationsMetricInput,
    OperationsHealthSummary,
    CreateOperationsHealthInput,
    ExecutiveKpiSummary,
    CreateExecutiveKpiInput,
    DeliveryFailureSummary,
    CreateDeliveryFailureInput,
    AuditEntry,
    CsdDashboardStats,
    CsdPipelineInfo,
    CsdSdkTrackCustomerHealthInput,
    CsdSdkTrackCustomerHealthResult,
    CsdSdkOpenSupportTicketInput,
    CsdSdkOpenSupportTicketResult,
    CsdSdkRunDeliveryWorkflowInput,
    CsdSdkRunDeliveryWorkflowResult,
} from "@/src/modules/customer-success-delivery/types";

export class CustomerSuccessDeliveryService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const deliveryHubs = await databaseService.csdDeliveryHubs.listByOrganization(organizationId);
        return buildDeliveryHubLookupMaps(deliveryHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CsdDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildCsdDashboardStats({ deliveryHubs: [], customerHealthScores: [], supportTickets: [], deploymentTracking: [], trainingPortals: [], operationsMetrics: [], operationsHealth: [], deliveryFailures: [], auditLogs: [] });
        const [deliveryHubs, customerHealthScoresRaw, supportTicketsRaw, deploymentTrackingRaw, trainingPortalsRaw, operationsMetricsRaw, operationsHealthRaw, deliveryFailures, auditLogs] = await Promise.all([
            this.getDeliveryHubs(authUserId, email, fullName),
            databaseService.csdCustomerHealthScores.listByOrganization(context.organizationId),
            databaseService.csdSupportTickets.listByOrganization(context.organizationId),
            databaseService.csdDeploymentTracking.listByOrganization(context.organizationId),
            databaseService.csdTrainingPortals.listByOrganization(context.organizationId),
            databaseService.csdOperationsMetrics.listByOrganization(context.organizationId),
            databaseService.csdOperationsHealth.listByOrganization(context.organizationId),
            this.getDeliveryFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildCsdDashboardStats({
            deliveryHubs,
            customerHealthScores: customerHealthScoresRaw.map(mapCustomerHealthScoreForStats),
            supportTickets: supportTicketsRaw.map(mapSupportTicketForStats),
            deploymentTracking: deploymentTrackingRaw.map(mapDeploymentTrackingForStats),
            trainingPortals: trainingPortalsRaw.map(mapTrainingPortalForStats),
            operationsMetrics: operationsMetricsRaw.map(mapOperationsMetricForStats),
            operationsHealth: operationsHealthRaw.map(mapOperationsHealthForStats),
            deliveryFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): CsdPipelineInfo {
        return buildCsdPipelineInfo();
    }

    async getDeliveryHubs(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csdDeliveryHubs.listByOrganization(context.organizationId)).map((r) => mapDeliveryHubSummary(r));
    }

    async createDeliveryHub(authUserId: string, email: string, input: CreateDeliveryHubInput, fullName?: string | null): Promise<DeliveryHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdDeliveryHubs.create(buildDeliveryHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deliveryHubs");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "delivery_hubs", "create", `DeliveryHub created`, created.id));
        return mapDeliveryHubSummary(created);
    }

    async getCustomerHealthScores(authUserId: string, email: string, fullName?: string | null): Promise<CustomerHealthScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdCustomerHealthScores.listByOrganization(context.organizationId)).map((r) => mapCustomerHealthScoreSummary(r, maps));
    }

    async createCustomerHealthScore(authUserId: string, email: string, input: CreateCustomerHealthScoreInput, fullName?: string | null): Promise<CustomerHealthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdCustomerHealthScores.create(buildCustomerHealthScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerHealthScores");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "customer_health_scores", "create", `CustomerHealthScore created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerHealthScoreSummary(created, maps);
    }

    async getAdoptionAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<AdoptionAnalyticSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdAdoptionAnalytics.listByOrganization(context.organizationId)).map((r) => mapAdoptionAnalyticSummary(r, maps));
    }

    async createAdoptionAnalytic(authUserId: string, email: string, input: CreateAdoptionAnalyticInput, fullName?: string | null): Promise<AdoptionAnalyticSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdAdoptionAnalytics.create(buildAdoptionAnalyticPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create adoptionAnalytics");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "adoption_analytics", "create", `AdoptionAnalytic created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAdoptionAnalyticSummary(created, maps);
    }

    async getSuccessPlans(authUserId: string, email: string, fullName?: string | null): Promise<SuccessPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdSuccessPlans.listByOrganization(context.organizationId)).map((r) => mapSuccessPlanSummary(r, maps));
    }

    async createSuccessPlan(authUserId: string, email: string, input: CreateSuccessPlanInput, fullName?: string | null): Promise<SuccessPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdSuccessPlans.create(buildSuccessPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create successPlans");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "success_plans", "create", `SuccessPlan created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSuccessPlanSummary(created, maps);
    }

    async getCustomerTimelines(authUserId: string, email: string, fullName?: string | null): Promise<CustomerTimelineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdCustomerTimelines.listByOrganization(context.organizationId)).map((r) => mapCustomerTimelineSummary(r, maps));
    }

    async createCustomerTimeline(authUserId: string, email: string, input: CreateCustomerTimelineInput, fullName?: string | null): Promise<CustomerTimelineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdCustomerTimelines.create(buildCustomerTimelinePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerTimelines");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "customer_timelines", "create", `CustomerTimeline created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerTimelineSummary(created, maps);
    }

    async getRenewalForecasts(authUserId: string, email: string, fullName?: string | null): Promise<RenewalForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdRenewalForecasts.listByOrganization(context.organizationId)).map((r) => mapRenewalForecastSummary(r, maps));
    }

    async createRenewalForecast(authUserId: string, email: string, input: CreateRenewalForecastInput, fullName?: string | null): Promise<RenewalForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdRenewalForecasts.create(buildRenewalForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renewalForecasts");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "renewal_forecasts", "create", `RenewalForecast created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalForecastSummary(created, maps);
    }

    async getSupportTickets(authUserId: string, email: string, fullName?: string | null): Promise<SupportTicketSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdSupportTickets.listByOrganization(context.organizationId)).map((r) => mapSupportTicketSummary(r, maps));
    }

    async createSupportTicket(authUserId: string, email: string, input: CreateSupportTicketInput, fullName?: string | null): Promise<SupportTicketSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdSupportTickets.create(buildSupportTicketPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create supportTickets");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "support_tickets", "create", `SupportTicket created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSupportTicketSummary(created, maps);
    }

    async getLiveChatSessions(authUserId: string, email: string, fullName?: string | null): Promise<LiveChatSessionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdLiveChatSessions.listByOrganization(context.organizationId)).map((r) => mapLiveChatSessionSummary(r, maps));
    }

    async createLiveChatSession(authUserId: string, email: string, input: CreateLiveChatSessionInput, fullName?: string | null): Promise<LiveChatSessionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdLiveChatSessions.create(buildLiveChatSessionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create liveChatSessions");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "live_chat_sessions", "create", `LiveChatSession created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLiveChatSessionSummary(created, maps);
    }

    async getKnowledgeBaseArticles(authUserId: string, email: string, fullName?: string | null): Promise<KnowledgeBaseArticleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdKnowledgeBaseArticles.listByOrganization(context.organizationId)).map((r) => mapKnowledgeBaseArticleSummary(r, maps));
    }

    async createKnowledgeBaseArticle(authUserId: string, email: string, input: CreateKnowledgeBaseArticleInput, fullName?: string | null): Promise<KnowledgeBaseArticleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdKnowledgeBaseArticles.create(buildKnowledgeBaseArticlePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create knowledgeBaseArticles");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "knowledge_base_articles", "create", `KnowledgeBaseArticle created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKnowledgeBaseArticleSummary(created, maps);
    }

    async getSlaPolicys(authUserId: string, email: string, fullName?: string | null): Promise<SlaPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdSlaPolicies.listByOrganization(context.organizationId)).map((r) => mapSlaPolicySummary(r, maps));
    }

    async createSlaPolicy(authUserId: string, email: string, input: CreateSlaPolicyInput, fullName?: string | null): Promise<SlaPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdSlaPolicies.create(buildSlaPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create slaPolicies");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "sla_policies", "create", `SlaPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSlaPolicySummary(created, maps);
    }

    async getEscalationRules(authUserId: string, email: string, fullName?: string | null): Promise<EscalationRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdEscalationRules.listByOrganization(context.organizationId)).map((r) => mapEscalationRuleSummary(r, maps));
    }

    async createEscalationRule(authUserId: string, email: string, input: CreateEscalationRuleInput, fullName?: string | null): Promise<EscalationRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdEscalationRules.create(buildEscalationRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create escalationRules");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "escalation_rules", "create", `EscalationRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEscalationRuleSummary(created, maps);
    }

    async getDeploymentAutomations(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentAutomationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdDeploymentAutomations.listByOrganization(context.organizationId)).map((r) => mapDeploymentAutomationSummary(r, maps));
    }

    async createDeploymentAutomation(authUserId: string, email: string, input: CreateDeploymentAutomationInput, fullName?: string | null): Promise<DeploymentAutomationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdDeploymentAutomations.create(buildDeploymentAutomationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deploymentAutomations");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "deployment_automations", "create", `DeploymentAutomation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentAutomationSummary(created, maps);
    }

    async getEnvironmentManagements(authUserId: string, email: string, fullName?: string | null): Promise<EnvironmentManagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdEnvironmentManagement.listByOrganization(context.organizationId)).map((r) => mapEnvironmentManagementSummary(r, maps));
    }

    async createEnvironmentManagement(authUserId: string, email: string, input: CreateEnvironmentManagementInput, fullName?: string | null): Promise<EnvironmentManagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdEnvironmentManagement.create(buildEnvironmentManagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create environmentManagement");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "environment_management", "create", `EnvironmentManagement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEnvironmentManagementSummary(created, maps);
    }

    async getDeploymentTrackings(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdDeploymentTracking.listByOrganization(context.organizationId)).map((r) => mapDeploymentTrackingSummary(r, maps));
    }

    async createDeploymentTracking(authUserId: string, email: string, input: CreateDeploymentTrackingInput, fullName?: string | null): Promise<DeploymentTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdDeploymentTracking.create(buildDeploymentTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deploymentTracking");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "deployment_tracking", "create", `DeploymentTracking created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentTrackingSummary(created, maps);
    }

    async getUpgradeManagements(authUserId: string, email: string, fullName?: string | null): Promise<UpgradeManagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdUpgradeManagement.listByOrganization(context.organizationId)).map((r) => mapUpgradeManagementSummary(r, maps));
    }

    async createUpgradeManagement(authUserId: string, email: string, input: CreateUpgradeManagementInput, fullName?: string | null): Promise<UpgradeManagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdUpgradeManagement.create(buildUpgradeManagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create upgradeManagement");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "upgrade_management", "create", `UpgradeManagement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUpgradeManagementSummary(created, maps);
    }

    async getReleaseTrackings(authUserId: string, email: string, fullName?: string | null): Promise<ReleaseTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdReleaseTracking.listByOrganization(context.organizationId)).map((r) => mapReleaseTrackingSummary(r, maps));
    }

    async createReleaseTracking(authUserId: string, email: string, input: CreateReleaseTrackingInput, fullName?: string | null): Promise<ReleaseTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdReleaseTracking.create(buildReleaseTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create releaseTracking");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "release_tracking", "create", `ReleaseTracking created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReleaseTrackingSummary(created, maps);
    }

    async getTrainingPortals(authUserId: string, email: string, fullName?: string | null): Promise<TrainingPortalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdTrainingPortals.listByOrganization(context.organizationId)).map((r) => mapTrainingPortalSummary(r, maps));
    }

    async createTrainingPortal(authUserId: string, email: string, input: CreateTrainingPortalInput, fullName?: string | null): Promise<TrainingPortalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdTrainingPortals.create(buildTrainingPortalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create trainingPortals");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "training_portals", "create", `TrainingPortal created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTrainingPortalSummary(created, maps);
    }

    async getVideoLibrarys(authUserId: string, email: string, fullName?: string | null): Promise<VideoLibrarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdVideoLibrary.listByOrganization(context.organizationId)).map((r) => mapVideoLibrarySummary(r, maps));
    }

    async createVideoLibrary(authUserId: string, email: string, input: CreateVideoLibraryInput, fullName?: string | null): Promise<VideoLibrarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdVideoLibrary.create(buildVideoLibraryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create videoLibrary");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "video_library", "create", `VideoLibrary created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVideoLibrarySummary(created, maps);
    }

    async getProductTours(authUserId: string, email: string, fullName?: string | null): Promise<ProductTourSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdProductTours.listByOrganization(context.organizationId)).map((r) => mapProductTourSummary(r, maps));
    }

    async createProductTour(authUserId: string, email: string, input: CreateProductTourInput, fullName?: string | null): Promise<ProductTourSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdProductTours.create(buildProductTourPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create productTours");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "product_tours", "create", `ProductTour created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProductTourSummary(created, maps);
    }

    async getCertifications(authUserId: string, email: string, fullName?: string | null): Promise<CertificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdCertifications.listByOrganization(context.organizationId)).map((r) => mapCertificationSummary(r, maps));
    }

    async createCertification(authUserId: string, email: string, input: CreateCertificationInput, fullName?: string | null): Promise<CertificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdCertifications.create(buildCertificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create certifications");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "certifications", "create", `Certification created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCertificationSummary(created, maps);
    }

    async getProgressTrackings(authUserId: string, email: string, fullName?: string | null): Promise<ProgressTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdProgressTracking.listByOrganization(context.organizationId)).map((r) => mapProgressTrackingSummary(r, maps));
    }

    async createProgressTracking(authUserId: string, email: string, input: CreateProgressTrackingInput, fullName?: string | null): Promise<ProgressTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdProgressTracking.create(buildProgressTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create progressTracking");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "progress_tracking", "create", `ProgressTracking created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProgressTrackingSummary(created, maps);
    }

    async getLearningAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<LearningAnalyticSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdLearningAnalytics.listByOrganization(context.organizationId)).map((r) => mapLearningAnalyticSummary(r, maps));
    }

    async createLearningAnalytic(authUserId: string, email: string, input: CreateLearningAnalyticInput, fullName?: string | null): Promise<LearningAnalyticSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdLearningAnalytics.create(buildLearningAnalyticPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create learningAnalytics");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "learning_analytics", "create", `LearningAnalytic created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLearningAnalyticSummary(created, maps);
    }

    async getDeliveryWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryWorkflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdDeliveryWorkflows.listByOrganization(context.organizationId)).map((r) => mapDeliveryWorkflowSummary(r, maps));
    }

    async createDeliveryWorkflow(authUserId: string, email: string, input: CreateDeliveryWorkflowInput, fullName?: string | null): Promise<DeliveryWorkflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdDeliveryWorkflows.create(buildDeliveryWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deliveryWorkflows");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "delivery_workflows", "create", `DeliveryWorkflow created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeliveryWorkflowSummary(created, maps);
    }

    async getOnboardingAutomations(authUserId: string, email: string, fullName?: string | null): Promise<OnboardingAutomationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdOnboardingAutomation.listByOrganization(context.organizationId)).map((r) => mapOnboardingAutomationSummary(r, maps));
    }

    async createOnboardingAutomation(authUserId: string, email: string, input: CreateOnboardingAutomationInput, fullName?: string | null): Promise<OnboardingAutomationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdOnboardingAutomation.create(buildOnboardingAutomationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create onboardingAutomation");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "onboarding_automation", "create", `OnboardingAutomation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingAutomationSummary(created, maps);
    }

    async getImplementationTrackings(authUserId: string, email: string, fullName?: string | null): Promise<ImplementationTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdImplementationTracking.listByOrganization(context.organizationId)).map((r) => mapImplementationTrackingSummary(r, maps));
    }

    async createImplementationTracking(authUserId: string, email: string, input: CreateImplementationTrackingInput, fullName?: string | null): Promise<ImplementationTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdImplementationTracking.create(buildImplementationTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create implementationTracking");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "implementation_tracking", "create", `ImplementationTracking created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapImplementationTrackingSummary(created, maps);
    }

    async getResourceAssignments(authUserId: string, email: string, fullName?: string | null): Promise<ResourceAssignmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdResourceAssignments.listByOrganization(context.organizationId)).map((r) => mapResourceAssignmentSummary(r, maps));
    }

    async createResourceAssignment(authUserId: string, email: string, input: CreateResourceAssignmentInput, fullName?: string | null): Promise<ResourceAssignmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdResourceAssignments.create(buildResourceAssignmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create resourceAssignments");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "resource_assignments", "create", `ResourceAssignment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapResourceAssignmentSummary(created, maps);
    }

    async getMilestoneTrackings(authUserId: string, email: string, fullName?: string | null): Promise<MilestoneTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdMilestoneTracking.listByOrganization(context.organizationId)).map((r) => mapMilestoneTrackingSummary(r, maps));
    }

    async createMilestoneTracking(authUserId: string, email: string, input: CreateMilestoneTrackingInput, fullName?: string | null): Promise<MilestoneTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdMilestoneTracking.create(buildMilestoneTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create milestoneTracking");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "milestone_tracking", "create", `MilestoneTracking created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMilestoneTrackingSummary(created, maps);
    }

    async getOperationsMetrics(authUserId: string, email: string, fullName?: string | null): Promise<OperationsMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csdOperationsMetrics.listByOrganization(context.organizationId)).map(mapOperationsMetricSummary);
    }

    async createOperationsMetric(authUserId: string, email: string, input: CreateOperationsMetricInput, fullName?: string | null): Promise<OperationsMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdOperationsMetrics.create(buildOperationsMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationsMetrics");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "operations_metrics", "create", `OperationsMetric created`, created.id));
        return mapOperationsMetricSummary(created);
    }

    async getOperationsHealths(authUserId: string, email: string, fullName?: string | null): Promise<OperationsHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csdOperationsHealth.listByOrganization(context.organizationId)).map(mapOperationsHealthSummary);
    }

    async createOperationsHealth(authUserId: string, email: string, input: CreateOperationsHealthInput, fullName?: string | null): Promise<OperationsHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdOperationsHealth.create(buildOperationsHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationsHealth");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "operations_health", "create", `OperationsHealth created`, created.id));
        return mapOperationsHealthSummary(created);
    }

    async getExecutiveKpis(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveKpiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdExecutiveKpis.listByOrganization(context.organizationId)).map((r) => mapExecutiveKpiSummary(r, maps));
    }

    async createExecutiveKpi(authUserId: string, email: string, input: CreateExecutiveKpiInput, fullName?: string | null): Promise<ExecutiveKpiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdExecutiveKpis.create(buildExecutiveKpiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveKpis");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "executive_kpis", "create", `ExecutiveKpi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveKpiSummary(created, maps);
    }

    async getDeliveryFailures(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.csdDeliveryFailures.listByOrganization(context.organizationId)).map((r) => mapDeliveryFailureSummary(r, maps));
    }

    async createDeliveryFailure(authUserId: string, email: string, input: CreateDeliveryFailureInput, fullName?: string | null): Promise<DeliveryFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.csdDeliveryFailures.create(buildDeliveryFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deliveryFailures");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "delivery_failures", "create", `DeliveryFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeliveryFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csdAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getDeliveryHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csdDeliveryHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkTrackCustomerHealth(authUserId: string, email: string, input: CsdSdkTrackCustomerHealthInput, fullName?: string | null): Promise<CsdSdkTrackCustomerHealthResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createCustomerHealthScore(authUserId, email, { deliveryHubId: input.deliveryHubId, scoreKey: input.scoreKey, customerRef: input.customerRef }, fullName);
        return { scoreId: created.id, scoreKey: created.scoreKey, status: created.status };
    }

    async sdkOpenSupportTicket(authUserId: string, email: string, input: CsdSdkOpenSupportTicketInput, fullName?: string | null): Promise<CsdSdkOpenSupportTicketResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createSupportTicket(authUserId, email, { deliveryHubId: input.deliveryHubId, ticketKey: input.ticketKey, ticketTitle: input.ticketTitle }, fullName);
        return { ticketId: created.id, ticketKey: created.ticketKey, status: created.status };
    }

    async sdkRunDeliveryWorkflow(authUserId: string, email: string, input: CsdSdkRunDeliveryWorkflowInput, fullName?: string | null): Promise<CsdSdkRunDeliveryWorkflowResult> {
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
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createDeliveryWorkflow(authUserId, email, { deliveryHubId: input.deliveryHubId, workflowKey: input.workflowKey, workflowName: input.workflowName }, fullName);
        return { workflowId: created.id, workflowKey: created.workflowKey, status: created.status };
    }
}

export const customerSuccessDeliveryService = new CustomerSuccessDeliveryService();
