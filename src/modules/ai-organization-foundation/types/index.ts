export interface AofDashboardStats {
    totalOrganizationHubs: number;
    activeOrganizationHubs: number;
    growthOrchestratorCount: number;
    deliveryOrchestratorCount: number;
    ideaRegistryCount: number;
    aiTaskRouterCount: number;
    humanApprovalCount: number;
    openOrganizationFailureCount: number;
    overallOrganizationScore: number;
    growthScore: number;
    deliveryScore: number;
    innovationScore: number;
    pendingAiApprovalCount: number;
    pipelineHealthScore: number;
    missionProgressScore: number;
    auditCount: number;
}

export interface AofPipelineInfo {
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

export interface AofSdkRunAgoServiceInput { organizationHubId: string; orchestratorKey?: string; orchestratorName?: string; }
export interface AofSdkRunAgoServiceResult { orchestratorId: string; orchestratorKey: string; status: string; }
export interface AofSdkRunAdoServiceInput { organizationHubId: string; orchestratorKey?: string; orchestratorName?: string; }
export interface AofSdkRunAdoServiceResult { orchestratorId: string; orchestratorKey: string; status: string; }
export interface AofSdkRunAioServiceInput { organizationHubId: string; ideaKey?: string; ideaTitle?: string; }
export interface AofSdkRunAioServiceResult { ideaId: string; ideaKey: string; status: string; }
export interface AofSdkRunOrchestrationServiceInput { organizationHubId: string; routerKey?: string; routerName?: string; }
export interface AofSdkRunOrchestrationServiceResult { routerId: string; routerKey: string; status: string; }

export interface OrganizationHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateOrganizationHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface GrowthOrchestratorSummary {
    id: string;
    hubName?: string;
        orchestratorKey: string;
    orchestratorName: string;
    orchestratorStatus: string;
    status: string;
}

export interface CreateGrowthOrchestratorInput {
        organizationHubId: string;
        orchestratorKey?: string;
    orchestratorName?: string;
    orchestratorStatus?: string;
}

export interface CampaignIntelligenceSummary {
    id: string;
    hubName?: string;
        campaignKey: string;
    campaignName: string;
    campaignStatus: string;
    status: string;
}

export interface CreateCampaignIntelligenceInput {
        organizationHubId: string;
        campaignKey?: string;
    campaignName?: string;
    campaignStatus?: string;
}

export interface LeadPrioritizationSummary {
    id: string;
    hubName?: string;
        leadKey: string;
    leadName: string;
    priorityScore: number;
    status: string;
}

export interface CreateLeadPrioritizationInput {
        organizationHubId: string;
        leadKey?: string;
    leadName?: string;
    priorityScore?: number;
}

export interface OpportunityRecommendationSummary {
    id: string;
    hubName?: string;
        recommendationKey: string;
    recommendationTitle: string;
    recommendationType: string;
    status: string;
}

export interface CreateOpportunityRecommendationInput {
        organizationHubId: string;
        recommendationKey?: string;
    recommendationTitle?: string;
    recommendationType?: string;
}

export interface PipelineHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    healthName: string;
    healthScore: number;
    status: string;
}

export interface CreatePipelineHealthInput {
        organizationHubId: string;
        healthKey?: string;
    healthName?: string;
    healthScore?: number;
}

export interface GrowthAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsName: string;
    analyticsType: string;
    status: string;
}

export interface CreateGrowthAnalyticsInput {
        organizationHubId: string;
        analyticsKey?: string;
    analyticsName?: string;
    analyticsType?: string;
}

export interface ExecutiveGrowthDashboardSummary {
    id: string;
    hubName?: string;
        dashboardKey: string;
    dashboardName: string;
    dashboardStatus: string;
    status: string;
}

export interface CreateExecutiveGrowthDashboardInput {
        organizationHubId: string;
        dashboardKey?: string;
    dashboardName?: string;
    dashboardStatus?: string;
}

export interface DeliveryOrchestratorSummary {
    id: string;
    hubName?: string;
        orchestratorKey: string;
    orchestratorName: string;
    orchestratorStatus: string;
    status: string;
}

export interface CreateDeliveryOrchestratorInput {
        organizationHubId: string;
        orchestratorKey?: string;
    orchestratorName?: string;
    orchestratorStatus?: string;
}

export interface ResourcePlannerSummary {
    id: string;
    hubName?: string;
        plannerKey: string;
    plannerName: string;
    plannerStatus: string;
    status: string;
}

export interface CreateResourcePlannerInput {
        organizationHubId: string;
        plannerKey?: string;
    plannerName?: string;
    plannerStatus?: string;
}

export interface ImplementationSchedulerSummary {
    id: string;
    hubName?: string;
        schedulerKey: string;
    schedulerName: string;
    schedulerStatus: string;
    status: string;
}

export interface CreateImplementationSchedulerInput {
        organizationHubId: string;
        schedulerKey?: string;
    schedulerName?: string;
    schedulerStatus?: string;
}

export interface DeploymentCoordinationSummary {
    id: string;
    hubName?: string;
        coordinationKey: string;
    coordinationName: string;
    coordinationStatus: string;
    status: string;
}

export interface CreateDeploymentCoordinationInput {
        organizationHubId: string;
        coordinationKey?: string;
    coordinationName?: string;
    coordinationStatus?: string;
}

export interface DeliveryIntelligenceSummary {
    id: string;
    hubName?: string;
        intelligenceKey: string;
    intelligenceTitle: string;
    intelligenceType: string;
    status: string;
}

export interface CreateDeliveryIntelligenceInput {
        organizationHubId: string;
        intelligenceKey?: string;
    intelligenceTitle?: string;
    intelligenceType?: string;
}

export interface CustomerSuccessAutomationSummary {
    id: string;
    hubName?: string;
        automationKey: string;
    automationName: string;
    automationStatus: string;
    status: string;
}

export interface CreateCustomerSuccessAutomationInput {
        organizationHubId: string;
        automationKey?: string;
    automationName?: string;
    automationStatus?: string;
}

export interface ExecutiveDeliveryDashboardSummary {
    id: string;
    hubName?: string;
        dashboardKey: string;
    dashboardName: string;
    dashboardStatus: string;
    status: string;
}

export interface CreateExecutiveDeliveryDashboardInput {
        organizationHubId: string;
        dashboardKey?: string;
    dashboardName?: string;
    dashboardStatus?: string;
}

export interface IdeaRegistrySummary {
    id: string;
    hubName?: string;
        ideaKey: string;
    ideaTitle: string;
    ideaStatus: string;
    status: string;
}

export interface CreateIdeaRegistryInput {
        organizationHubId: string;
        ideaKey?: string;
    ideaTitle?: string;
    ideaStatus?: string;
}

export interface InnovationPipelineSummary {
    id: string;
    hubName?: string;
        pipelineKey: string;
    pipelineName: string;
    pipelineStatus: string;
    status: string;
}

export interface CreateInnovationPipelineInput {
        organizationHubId: string;
        pipelineKey?: string;
    pipelineName?: string;
    pipelineStatus?: string;
}

export interface ExperimentTrackerSummary {
    id: string;
    hubName?: string;
        experimentKey: string;
    experimentName: string;
    experimentStatus: string;
    status: string;
}

export interface CreateExperimentTrackerInput {
        organizationHubId: string;
        experimentKey?: string;
    experimentName?: string;
    experimentStatus?: string;
}

export interface ValidationWorkflowSummary {
    id: string;
    hubName?: string;
        workflowKey: string;
    workflowName: string;
    workflowStatus: string;
    status: string;
}

export interface CreateValidationWorkflowInput {
        organizationHubId: string;
        workflowKey?: string;
    workflowName?: string;
    workflowStatus?: string;
}

export interface OutcomeEvaluationSummary {
    id: string;
    hubName?: string;
        evaluationKey: string;
    evaluationTitle: string;
    evaluationScore: number;
    status: string;
}

export interface CreateOutcomeEvaluationInput {
        organizationHubId: string;
        evaluationKey?: string;
    evaluationTitle?: string;
    evaluationScore?: number;
}

export interface KnowledgeRepositorySummary {
    id: string;
    hubName?: string;
        repositoryKey: string;
    repositoryName: string;
    repositoryStatus: string;
    status: string;
}

export interface CreateKnowledgeRepositoryInput {
        organizationHubId: string;
        repositoryKey?: string;
    repositoryName?: string;
    repositoryStatus?: string;
}

export interface AiTaskRouterSummary {
    id: string;
    hubName?: string;
        routerKey: string;
    routerName: string;
    routerStatus: string;
    status: string;
}

export interface CreateAiTaskRouterInput {
        organizationHubId: string;
        routerKey?: string;
    routerName?: string;
    routerStatus?: string;
}

export interface HumanApprovalEngineSummary {
    id: string;
    hubName?: string;
        approvalKey: string;
    approvalName: string;
    approvalStatus: string;
    status: string;
}

export interface CreateHumanApprovalEngineInput {
        organizationHubId: string;
        approvalKey?: string;
    approvalName?: string;
    approvalStatus?: string;
}

export interface PolicyEngineSummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    policyStatus: string;
    status: string;
}

export interface CreatePolicyEngineInput {
        organizationHubId: string;
        policyKey?: string;
    policyName?: string;
    policyStatus?: string;
}

export interface ExecutionHistorySummary {
    id: string;
    hubName?: string;
        historyKey: string;
    historyTitle: string;
    executionStatus: string;
    status: string;
}

export interface CreateExecutionHistoryInput {
        organizationHubId: string;
        historyKey?: string;
    historyTitle?: string;
    executionStatus?: string;
}

export interface AiGovernanceRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    ruleStatus: string;
    status: string;
}

export interface CreateAiGovernanceRuleInput {
        organizationHubId: string;
        ruleKey?: string;
    ruleName?: string;
    ruleStatus?: string;
}

export interface OrganizationMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    growthScore: number;
    overallOrganizationScore: number;
    status: string;
}

export interface CreateOrganizationMetricInput {
        metricsKey?: string;
    growthScore?: number;
    overallOrganizationScore?: number;
}

export interface OrganizationHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateOrganizationHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface InnovationDashboardSummary {
    id: string;
    hubName?: string;
        dashboardKey: string;
    dashboardName: string;
    dashboardStatus: string;
    status: string;
}

export interface CreateInnovationDashboardInput {
        organizationHubId: string;
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
        organizationHubId: string;
        progressKey?: string;
    progressName?: string;
    progressPercent?: number;
}

export interface OrganizationFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateOrganizationFailureInput {
        organizationHubId: string;
        failureKey?: string;
    failureType?: string;
}

