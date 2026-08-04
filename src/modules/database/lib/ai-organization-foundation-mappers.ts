import type { DbAofOrganizationHub,
    DbAofGrowthOrchestrator,
    DbAofCampaignIntelligence,
    DbAofLeadPrioritization,
    DbAofOpportunityRecommendation,
    DbAofPipelineHealth,
    DbAofGrowthAnalytics,
    DbAofExecutiveGrowthDashboard,
    DbAofDeliveryOrchestrator,
    DbAofResourcePlanner,
    DbAofImplementationScheduler,
    DbAofDeploymentCoordination,
    DbAofDeliveryIntelligence,
    DbAofCustomerSuccessAutomation,
    DbAofExecutiveDeliveryDashboard,
    DbAofIdeaRegistry,
    DbAofInnovationPipeline,
    DbAofExperimentTracker,
    DbAofValidationWorkflow,
    DbAofOutcomeEvaluation,
    DbAofKnowledgeRepository,
    DbAofAiTaskRouter,
    DbAofHumanApprovalEngine,
    DbAofPolicyEngine,
    DbAofExecutionHistory,
    DbAofAiGovernanceRule,
    DbAofOrganizationMetric,
    DbAofOrganizationHealth,
    DbAofInnovationDashboard,
    DbAofMissionProgress,
    DbAofOrganizationFailure,
    DbAofAuditLog } from "@/src/modules/database/types/platform";
import type { CreateOrganizationHubInput,
    OrganizationHubSummary,
    CreateGrowthOrchestratorInput,
    GrowthOrchestratorSummary,
    CreateCampaignIntelligenceInput,
    CampaignIntelligenceSummary,
    CreateLeadPrioritizationInput,
    LeadPrioritizationSummary,
    CreateOpportunityRecommendationInput,
    OpportunityRecommendationSummary,
    CreatePipelineHealthInput,
    PipelineHealthSummary,
    CreateGrowthAnalyticsInput,
    GrowthAnalyticsSummary,
    CreateExecutiveGrowthDashboardInput,
    ExecutiveGrowthDashboardSummary,
    CreateDeliveryOrchestratorInput,
    DeliveryOrchestratorSummary,
    CreateResourcePlannerInput,
    ResourcePlannerSummary,
    CreateImplementationSchedulerInput,
    ImplementationSchedulerSummary,
    CreateDeploymentCoordinationInput,
    DeploymentCoordinationSummary,
    CreateDeliveryIntelligenceInput,
    DeliveryIntelligenceSummary,
    CreateCustomerSuccessAutomationInput,
    CustomerSuccessAutomationSummary,
    CreateExecutiveDeliveryDashboardInput,
    ExecutiveDeliveryDashboardSummary,
    CreateIdeaRegistryInput,
    IdeaRegistrySummary,
    CreateInnovationPipelineInput,
    InnovationPipelineSummary,
    CreateExperimentTrackerInput,
    ExperimentTrackerSummary,
    CreateValidationWorkflowInput,
    ValidationWorkflowSummary,
    CreateOutcomeEvaluationInput,
    OutcomeEvaluationSummary,
    CreateKnowledgeRepositoryInput,
    KnowledgeRepositorySummary,
    CreateAiTaskRouterInput,
    AiTaskRouterSummary,
    CreateHumanApprovalEngineInput,
    HumanApprovalEngineSummary,
    CreatePolicyEngineInput,
    PolicyEngineSummary,
    CreateExecutionHistoryInput,
    ExecutionHistorySummary,
    CreateAiGovernanceRuleInput,
    AiGovernanceRuleSummary,
    CreateOrganizationMetricInput,
    OrganizationMetricSummary,
    CreateOrganizationHealthInput,
    OrganizationHealthSummary,
    CreateInnovationDashboardInput,
    InnovationDashboardSummary,
    CreateMissionProgressInput,
    MissionProgressSummary,
    CreateOrganizationFailureInput,
    OrganizationFailureSummary,
    AofDashboardStats,
    AofPipelineInfo,
    AuditEntry } from "@/src/modules/ai-organization-foundation/types";

export function buildOrganizationHubLookupMaps(hubs: DbAofOrganizationHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildAofPipelineInfo(): AofPipelineInfo {
    const stages = [
        { key: "ago", label: "Autonomous Growth Organization" },
        { key: "ado", label: "Autonomous Delivery Organization" },
        { key: "aio", label: "Autonomous Innovation Organization" },
        { key: "ai_orchestration", label: "AI Orchestration" },
        { key: "dashboard", label: "Organization Dashboard" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "ado", nextStage: "aio", previousStage: "ago" };
}

export function buildAofAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbAofAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapOrganizationHubSummary(record: DbAofOrganizationHub): OrganizationHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildOrganizationHubPayload(organizationId: string, input: CreateOrganizationHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapGrowthOrchestratorSummary(record: DbAofGrowthOrchestrator, maps?: { hubNameById: Map<string, string> }): GrowthOrchestratorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        orchestratorKey: record.orchestrator_key as string,
        orchestratorName: record.orchestrator_name as string,
        orchestratorStatus: record.orchestrator_status as string,
        status: record.status,
    };
}

export function buildGrowthOrchestratorPayload(organizationId: string, input: CreateGrowthOrchestratorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        orchestrator_key: input.orchestratorKey ?? '',
        orchestrator_name: input.orchestratorName ?? '',
        orchestrator_status: input.orchestratorStatus ?? '',
        status: "active",
    };
}

export function mapCampaignIntelligenceSummary(record: DbAofCampaignIntelligence, maps?: { hubNameById: Map<string, string> }): CampaignIntelligenceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        campaignKey: record.campaign_key as string,
        campaignName: record.campaign_name as string,
        campaignStatus: record.campaign_status as string,
        status: record.status,
    };
}

export function buildCampaignIntelligencePayload(organizationId: string, input: CreateCampaignIntelligenceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        campaign_key: input.campaignKey ?? '',
        campaign_name: input.campaignName ?? '',
        campaign_status: input.campaignStatus ?? '',
        status: "active",
    };
}

export function mapLeadPrioritizationSummary(record: DbAofLeadPrioritization, maps?: { hubNameById: Map<string, string> }): LeadPrioritizationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        leadKey: record.lead_key as string,
        leadName: record.lead_name as string,
        priorityScore: record.priority_score as number,
        status: record.status,
    };
}

export function buildLeadPrioritizationPayload(organizationId: string, input: CreateLeadPrioritizationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        lead_key: input.leadKey ?? '',
        lead_name: input.leadName ?? '',
        priority_score: input.priorityScore ?? 0,
        status: "active",
    };
}

export function mapOpportunityRecommendationSummary(record: DbAofOpportunityRecommendation, maps?: { hubNameById: Map<string, string> }): OpportunityRecommendationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        recommendationKey: record.recommendation_key as string,
        recommendationTitle: record.recommendation_title as string,
        recommendationType: record.recommendation_type as string,
        status: record.status,
    };
}

export function buildOpportunityRecommendationPayload(organizationId: string, input: CreateOpportunityRecommendationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        recommendation_key: input.recommendationKey ?? '',
        recommendation_title: input.recommendationTitle ?? '',
        recommendation_type: input.recommendationType ?? '',
        status: "active",
    };
}

export function mapPipelineHealthSummary(record: DbAofPipelineHealth, maps?: { hubNameById: Map<string, string> }): PipelineHealthSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        healthKey: record.health_key as string,
        healthName: record.health_name as string,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildPipelineHealthPayload(organizationId: string, input: CreatePipelineHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        health_key: input.healthKey ?? '',
        health_name: input.healthName ?? '',
        health_score: input.healthScore ?? 0,
        status: "active",
    };
}

export function mapGrowthAnalyticsSummary(record: DbAofGrowthAnalytics, maps?: { hubNameById: Map<string, string> }): GrowthAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsName: record.analytics_name as string,
        analyticsType: record.analytics_type as string,
        status: record.status,
    };
}

export function buildGrowthAnalyticsPayload(organizationId: string, input: CreateGrowthAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_name: input.analyticsName ?? '',
        analytics_type: input.analyticsType ?? '',
        status: "active",
    };
}

export function mapExecutiveGrowthDashboardSummary(record: DbAofExecutiveGrowthDashboard, maps?: { hubNameById: Map<string, string> }): ExecutiveGrowthDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dashboardKey: record.dashboard_key as string,
        dashboardName: record.dashboard_name as string,
        dashboardStatus: record.dashboard_status as string,
        status: record.status,
    };
}

export function buildExecutiveGrowthDashboardPayload(organizationId: string, input: CreateExecutiveGrowthDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        dashboard_key: input.dashboardKey ?? '',
        dashboard_name: input.dashboardName ?? '',
        dashboard_status: input.dashboardStatus ?? '',
        status: "active",
    };
}

export function mapDeliveryOrchestratorSummary(record: DbAofDeliveryOrchestrator, maps?: { hubNameById: Map<string, string> }): DeliveryOrchestratorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        orchestratorKey: record.orchestrator_key as string,
        orchestratorName: record.orchestrator_name as string,
        orchestratorStatus: record.orchestrator_status as string,
        status: record.status,
    };
}

export function buildDeliveryOrchestratorPayload(organizationId: string, input: CreateDeliveryOrchestratorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        orchestrator_key: input.orchestratorKey ?? '',
        orchestrator_name: input.orchestratorName ?? '',
        orchestrator_status: input.orchestratorStatus ?? '',
        status: "active",
    };
}

export function mapResourcePlannerSummary(record: DbAofResourcePlanner, maps?: { hubNameById: Map<string, string> }): ResourcePlannerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        plannerKey: record.planner_key as string,
        plannerName: record.planner_name as string,
        plannerStatus: record.planner_status as string,
        status: record.status,
    };
}

export function buildResourcePlannerPayload(organizationId: string, input: CreateResourcePlannerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        planner_key: input.plannerKey ?? '',
        planner_name: input.plannerName ?? '',
        planner_status: input.plannerStatus ?? '',
        status: "active",
    };
}

export function mapImplementationSchedulerSummary(record: DbAofImplementationScheduler, maps?: { hubNameById: Map<string, string> }): ImplementationSchedulerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        schedulerKey: record.scheduler_key as string,
        schedulerName: record.scheduler_name as string,
        schedulerStatus: record.scheduler_status as string,
        status: record.status,
    };
}

export function buildImplementationSchedulerPayload(organizationId: string, input: CreateImplementationSchedulerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        scheduler_key: input.schedulerKey ?? '',
        scheduler_name: input.schedulerName ?? '',
        scheduler_status: input.schedulerStatus ?? '',
        status: "active",
    };
}

export function mapDeploymentCoordinationSummary(record: DbAofDeploymentCoordination, maps?: { hubNameById: Map<string, string> }): DeploymentCoordinationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        coordinationKey: record.coordination_key as string,
        coordinationName: record.coordination_name as string,
        coordinationStatus: record.coordination_status as string,
        status: record.status,
    };
}

export function buildDeploymentCoordinationPayload(organizationId: string, input: CreateDeploymentCoordinationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        coordination_key: input.coordinationKey ?? '',
        coordination_name: input.coordinationName ?? '',
        coordination_status: input.coordinationStatus ?? '',
        status: "active",
    };
}

export function mapDeliveryIntelligenceSummary(record: DbAofDeliveryIntelligence, maps?: { hubNameById: Map<string, string> }): DeliveryIntelligenceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        intelligenceKey: record.intelligence_key as string,
        intelligenceTitle: record.intelligence_title as string,
        intelligenceType: record.intelligence_type as string,
        status: record.status,
    };
}

export function buildDeliveryIntelligencePayload(organizationId: string, input: CreateDeliveryIntelligenceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        intelligence_key: input.intelligenceKey ?? '',
        intelligence_title: input.intelligenceTitle ?? '',
        intelligence_type: input.intelligenceType ?? '',
        status: "active",
    };
}

export function mapCustomerSuccessAutomationSummary(record: DbAofCustomerSuccessAutomation, maps?: { hubNameById: Map<string, string> }): CustomerSuccessAutomationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        automationKey: record.automation_key as string,
        automationName: record.automation_name as string,
        automationStatus: record.automation_status as string,
        status: record.status,
    };
}

export function buildCustomerSuccessAutomationPayload(organizationId: string, input: CreateCustomerSuccessAutomationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        automation_key: input.automationKey ?? '',
        automation_name: input.automationName ?? '',
        automation_status: input.automationStatus ?? '',
        status: "active",
    };
}

export function mapExecutiveDeliveryDashboardSummary(record: DbAofExecutiveDeliveryDashboard, maps?: { hubNameById: Map<string, string> }): ExecutiveDeliveryDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dashboardKey: record.dashboard_key as string,
        dashboardName: record.dashboard_name as string,
        dashboardStatus: record.dashboard_status as string,
        status: record.status,
    };
}

export function buildExecutiveDeliveryDashboardPayload(organizationId: string, input: CreateExecutiveDeliveryDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        dashboard_key: input.dashboardKey ?? '',
        dashboard_name: input.dashboardName ?? '',
        dashboard_status: input.dashboardStatus ?? '',
        status: "active",
    };
}

export function mapIdeaRegistrySummary(record: DbAofIdeaRegistry, maps?: { hubNameById: Map<string, string> }): IdeaRegistrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ideaKey: record.idea_key as string,
        ideaTitle: record.idea_title as string,
        ideaStatus: record.idea_status as string,
        status: record.status,
    };
}

export function buildIdeaRegistryPayload(organizationId: string, input: CreateIdeaRegistryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        idea_key: input.ideaKey ?? '',
        idea_title: input.ideaTitle ?? '',
        idea_status: input.ideaStatus ?? '',
        status: "active",
    };
}

export function mapInnovationPipelineSummary(record: DbAofInnovationPipeline, maps?: { hubNameById: Map<string, string> }): InnovationPipelineSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        pipelineKey: record.pipeline_key as string,
        pipelineName: record.pipeline_name as string,
        pipelineStatus: record.pipeline_status as string,
        status: record.status,
    };
}

export function buildInnovationPipelinePayload(organizationId: string, input: CreateInnovationPipelineInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        pipeline_key: input.pipelineKey ?? '',
        pipeline_name: input.pipelineName ?? '',
        pipeline_status: input.pipelineStatus ?? '',
        status: "active",
    };
}

export function mapExperimentTrackerSummary(record: DbAofExperimentTracker, maps?: { hubNameById: Map<string, string> }): ExperimentTrackerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        experimentKey: record.experiment_key as string,
        experimentName: record.experiment_name as string,
        experimentStatus: record.experiment_status as string,
        status: record.status,
    };
}

export function buildExperimentTrackerPayload(organizationId: string, input: CreateExperimentTrackerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        experiment_key: input.experimentKey ?? '',
        experiment_name: input.experimentName ?? '',
        experiment_status: input.experimentStatus ?? '',
        status: "active",
    };
}

export function mapValidationWorkflowSummary(record: DbAofValidationWorkflow, maps?: { hubNameById: Map<string, string> }): ValidationWorkflowSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        workflowKey: record.workflow_key as string,
        workflowName: record.workflow_name as string,
        workflowStatus: record.workflow_status as string,
        status: record.status,
    };
}

export function buildValidationWorkflowPayload(organizationId: string, input: CreateValidationWorkflowInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        workflow_key: input.workflowKey ?? '',
        workflow_name: input.workflowName ?? '',
        workflow_status: input.workflowStatus ?? '',
        status: "active",
    };
}

export function mapOutcomeEvaluationSummary(record: DbAofOutcomeEvaluation, maps?: { hubNameById: Map<string, string> }): OutcomeEvaluationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        evaluationKey: record.evaluation_key as string,
        evaluationTitle: record.evaluation_title as string,
        evaluationScore: record.evaluation_score as number,
        status: record.status,
    };
}

export function buildOutcomeEvaluationPayload(organizationId: string, input: CreateOutcomeEvaluationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        evaluation_key: input.evaluationKey ?? '',
        evaluation_title: input.evaluationTitle ?? '',
        evaluation_score: input.evaluationScore ?? 0,
        status: "active",
    };
}

export function mapKnowledgeRepositorySummary(record: DbAofKnowledgeRepository, maps?: { hubNameById: Map<string, string> }): KnowledgeRepositorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        repositoryKey: record.repository_key as string,
        repositoryName: record.repository_name as string,
        repositoryStatus: record.repository_status as string,
        status: record.status,
    };
}

export function buildKnowledgeRepositoryPayload(organizationId: string, input: CreateKnowledgeRepositoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        repository_key: input.repositoryKey ?? '',
        repository_name: input.repositoryName ?? '',
        repository_status: input.repositoryStatus ?? '',
        status: "active",
    };
}

export function mapAiTaskRouterSummary(record: DbAofAiTaskRouter, maps?: { hubNameById: Map<string, string> }): AiTaskRouterSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        routerKey: record.router_key as string,
        routerName: record.router_name as string,
        routerStatus: record.router_status as string,
        status: record.status,
    };
}

export function buildAiTaskRouterPayload(organizationId: string, input: CreateAiTaskRouterInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        router_key: input.routerKey ?? '',
        router_name: input.routerName ?? '',
        router_status: input.routerStatus ?? '',
        status: "active",
    };
}

export function mapHumanApprovalEngineSummary(record: DbAofHumanApprovalEngine, maps?: { hubNameById: Map<string, string> }): HumanApprovalEngineSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        approvalKey: record.approval_key as string,
        approvalName: record.approval_name as string,
        approvalStatus: record.approval_status as string,
        status: record.status,
    };
}

export function buildHumanApprovalEnginePayload(organizationId: string, input: CreateHumanApprovalEngineInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        approval_key: input.approvalKey ?? '',
        approval_name: input.approvalName ?? '',
        approval_status: input.approvalStatus ?? '',
        status: "active",
    };
}

export function mapPolicyEngineSummary(record: DbAofPolicyEngine, maps?: { hubNameById: Map<string, string> }): PolicyEngineSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        policyStatus: record.policy_status as string,
        status: record.status,
    };
}

export function buildPolicyEnginePayload(organizationId: string, input: CreatePolicyEngineInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        policy_status: input.policyStatus ?? '',
        status: "active",
    };
}

export function mapExecutionHistorySummary(record: DbAofExecutionHistory, maps?: { hubNameById: Map<string, string> }): ExecutionHistorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        historyKey: record.history_key as string,
        historyTitle: record.history_title as string,
        executionStatus: record.execution_status as string,
        status: record.status,
    };
}

export function buildExecutionHistoryPayload(organizationId: string, input: CreateExecutionHistoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        history_key: input.historyKey ?? '',
        history_title: input.historyTitle ?? '',
        execution_status: input.executionStatus ?? '',
        status: "active",
    };
}

export function mapAiGovernanceRuleSummary(record: DbAofAiGovernanceRule, maps?: { hubNameById: Map<string, string> }): AiGovernanceRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        ruleStatus: record.rule_status as string,
        status: record.status,
    };
}

export function buildAiGovernanceRulePayload(organizationId: string, input: CreateAiGovernanceRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        rule_status: input.ruleStatus ?? '',
        status: "active",
    };
}

export function mapOrganizationMetricSummary(record: DbAofOrganizationMetric): OrganizationMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        growthScore: record.growth_score as number,
        overallOrganizationScore: record.overall_organization_score as number,
        status: record.status,
    };
}

export function buildOrganizationMetricPayload(organizationId: string, input: CreateOrganizationMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        growth_score: input.growthScore ?? 0,
        overall_organization_score: input.overallOrganizationScore ?? 0,
        status: "active",
    };
}

export function mapOrganizationHealthSummary(record: DbAofOrganizationHealth): OrganizationHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildOrganizationHealthPayload(organizationId: string, input: CreateOrganizationHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapInnovationDashboardSummary(record: DbAofInnovationDashboard, maps?: { hubNameById: Map<string, string> }): InnovationDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dashboardKey: record.dashboard_key as string,
        dashboardName: record.dashboard_name as string,
        dashboardStatus: record.dashboard_status as string,
        status: record.status,
    };
}

export function buildInnovationDashboardPayload(organizationId: string, input: CreateInnovationDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        dashboard_key: input.dashboardKey ?? '',
        dashboard_name: input.dashboardName ?? '',
        dashboard_status: input.dashboardStatus ?? '',
        status: "active",
    };
}

export function mapMissionProgressSummary(record: DbAofMissionProgress, maps?: { hubNameById: Map<string, string> }): MissionProgressSummary {
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
        hub_id: input.organizationHubId,
        progress_key: input.progressKey ?? '',
        progress_name: input.progressName ?? '',
        progress_percent: input.progressPercent ?? 0,
        status: "active",
    };
}

export function mapOrganizationFailureSummary(record: DbAofOrganizationFailure, maps?: { hubNameById: Map<string, string> }): OrganizationFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildOrganizationFailurePayload(organizationId: string, input: CreateOrganizationFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.organizationHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapGrowthOrchestratorForStats(r: DbAofGrowthOrchestrator) { return { orchestrator_status: r.orchestrator_status, status: r.status }; }
export function mapDeliveryOrchestratorForStats(r: DbAofDeliveryOrchestrator) { return { orchestrator_status: r.orchestrator_status, status: r.status }; }
export function mapIdeaRegistryForStats(r: DbAofIdeaRegistry) { return { idea_status: r.idea_status, status: r.status }; }
export function mapAiTaskRouterForStats(r: DbAofAiTaskRouter) { return { router_status: r.router_status, status: r.status }; }
export function mapHumanApprovalEngineForStats(r: DbAofHumanApprovalEngine) { return { approval_status: r.approval_status, status: r.status }; }
export function mapOrganizationMetricForStats(r: DbAofOrganizationMetric) {
    return {
        growth_score: r.growth_score,
        delivery_score: r.delivery_score,
        innovation_score: r.innovation_score,
        pending_ai_approval_count: r.pending_ai_approval_count,
        pipeline_health_score: r.pipeline_health_score,
        mission_progress_score: r.mission_progress_score,
        overall_organization_score: r.overall_organization_score,
        status: r.status,
    };
}
export function mapOrganizationHealthForStats(r: DbAofOrganizationHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapOrganizationFailureForStats(r: DbAofOrganizationFailure) { return { status: r.status }; }

export function buildAofDashboardStats(input: {
    organizationHubs: OrganizationHubSummary[];
    growthOrchestrators: ReturnType<typeof mapGrowthOrchestratorForStats>[];
    deliveryOrchestrators: ReturnType<typeof mapDeliveryOrchestratorForStats>[];
    ideaRegistry: ReturnType<typeof mapIdeaRegistryForStats>[];
    aiTaskRouters: ReturnType<typeof mapAiTaskRouterForStats>[];
    humanApprovalEngine: ReturnType<typeof mapHumanApprovalEngineForStats>[];
    organizationMetrics: ReturnType<typeof mapOrganizationMetricForStats>[];
    organizationHealth: ReturnType<typeof mapOrganizationHealthForStats>[];
    organizationFailures: OrganizationFailureSummary[];
    auditLogs: AuditEntry[];
}): AofDashboardStats {
    const activeHubs = input.organizationHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.organizationMetrics[0];
    const latestHealth = input.organizationHealth[0];
    const pendingApprovals = input.humanApprovalEngine.filter((a) => a.approval_status === "pending").length;
    return {
        totalOrganizationHubs: input.organizationHubs.length,
        activeOrganizationHubs: activeHubs,
        growthOrchestratorCount: input.growthOrchestrators.length,
        deliveryOrchestratorCount: input.deliveryOrchestrators.length,
        ideaRegistryCount: input.ideaRegistry.length,
        aiTaskRouterCount: input.aiTaskRouters.length,
        humanApprovalCount: pendingApprovals,
        openOrganizationFailureCount: input.organizationFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallOrganizationScore: latestMetrics?.overall_organization_score ?? latestHealth?.overall_score ?? 0,
        growthScore: latestMetrics?.growth_score ?? 0,
        deliveryScore: latestMetrics?.delivery_score ?? 0,
        innovationScore: latestMetrics?.innovation_score ?? 0,
        pendingAiApprovalCount: latestMetrics?.pending_ai_approval_count ?? pendingApprovals,
        pipelineHealthScore: latestMetrics?.pipeline_health_score ?? 0,
        missionProgressScore: latestMetrics?.mission_progress_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
