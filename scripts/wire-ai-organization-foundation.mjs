#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("AofOrganizationHubRepository")) {
    const anchor = '} from "@/src/modules/database/repositories/enterprise-intelligence-platform-repositories";';
    const eipImportEnd = da.indexOf(anchor) + anchor.length;
    const aofImport = `
import {
    AofOrganizationHubRepository,
    AofGrowthOrchestratorRepository,
    AofCampaignIntelligenceRepository,
    AofLeadPrioritizationRepository,
    AofOpportunityRecommendationRepository,
    AofPipelineHealthRepository,
    AofGrowthAnalyticsRepository,
    AofExecutiveGrowthDashboardRepository,
    AofDeliveryOrchestratorRepository,
    AofResourcePlannerRepository,
    AofImplementationSchedulerRepository,
    AofDeploymentCoordinationRepository,
    AofDeliveryIntelligenceRepository,
    AofCustomerSuccessAutomationRepository,
    AofExecutiveDeliveryDashboardRepository,
    AofIdeaRegistryRepository,
    AofInnovationPipelineRepository,
    AofExperimentTrackerRepository,
    AofValidationWorkflowRepository,
    AofOutcomeEvaluationRepository,
    AofKnowledgeRepositoryRepository,
    AofAiTaskRouterRepository,
    AofHumanApprovalEngineRepository,
    AofPolicyEngineRepository,
    AofExecutionHistoryRepository,
    AofAiGovernanceRuleRepository,
    AofOrganizationMetricRepository,
    AofOrganizationHealthRepository,
    AofInnovationDashboardRepository,
    AofMissionProgressRepository,
    AofOrganizationFailureRepository,
    AofAuditLogRepository,
} from "@/src/modules/database/repositories/ai-organization-foundation-repositories";
`;
    da = da.slice(0, eipImportEnd) + aofImport + da.slice(eipImportEnd);

    const eipProp = "    readonly eipAuditLogs: EipAuditLogRepository;";
    const aofProps = `    readonly aofOrganizationHubs: AofOrganizationHubRepository;
    readonly aofGrowthOrchestrators: AofGrowthOrchestratorRepository;
    readonly aofCampaignIntelligence: AofCampaignIntelligenceRepository;
    readonly aofLeadPrioritization: AofLeadPrioritizationRepository;
    readonly aofOpportunityRecommendations: AofOpportunityRecommendationRepository;
    readonly aofPipelineHealth: AofPipelineHealthRepository;
    readonly aofGrowthAnalytics: AofGrowthAnalyticsRepository;
    readonly aofExecutiveGrowthDashboards: AofExecutiveGrowthDashboardRepository;
    readonly aofDeliveryOrchestrators: AofDeliveryOrchestratorRepository;
    readonly aofResourcePlanners: AofResourcePlannerRepository;
    readonly aofImplementationSchedulers: AofImplementationSchedulerRepository;
    readonly aofDeploymentCoordination: AofDeploymentCoordinationRepository;
    readonly aofDeliveryIntelligence: AofDeliveryIntelligenceRepository;
    readonly aofCustomerSuccessAutomation: AofCustomerSuccessAutomationRepository;
    readonly aofExecutiveDeliveryDashboards: AofExecutiveDeliveryDashboardRepository;
    readonly aofIdeaRegistry: AofIdeaRegistryRepository;
    readonly aofInnovationPipeline: AofInnovationPipelineRepository;
    readonly aofExperimentTracker: AofExperimentTrackerRepository;
    readonly aofValidationWorkflow: AofValidationWorkflowRepository;
    readonly aofOutcomeEvaluation: AofOutcomeEvaluationRepository;
    readonly aofKnowledgeRepository: AofKnowledgeRepositoryRepository;
    readonly aofAiTaskRouters: AofAiTaskRouterRepository;
    readonly aofHumanApprovalEngine: AofHumanApprovalEngineRepository;
    readonly aofPolicyEngine: AofPolicyEngineRepository;
    readonly aofExecutionHistory: AofExecutionHistoryRepository;
    readonly aofAiGovernanceRules: AofAiGovernanceRuleRepository;
    readonly aofOrganizationMetrics: AofOrganizationMetricRepository;
    readonly aofOrganizationHealth: AofOrganizationHealthRepository;
    readonly aofInnovationDashboards: AofInnovationDashboardRepository;
    readonly aofMissionProgress: AofMissionProgressRepository;
    readonly aofOrganizationFailures: AofOrganizationFailureRepository;
    readonly aofAuditLogs: AofAuditLogRepository;`;
    da = da.replace(eipProp, eipProp + "\n" + aofProps);

    const eipCtor = "        this.eipAuditLogs = new EipAuditLogRepository();";
    const aofCtor = `        this.aofOrganizationHubs = new AofOrganizationHubRepository();
        this.aofGrowthOrchestrators = new AofGrowthOrchestratorRepository();
        this.aofCampaignIntelligence = new AofCampaignIntelligenceRepository();
        this.aofLeadPrioritization = new AofLeadPrioritizationRepository();
        this.aofOpportunityRecommendations = new AofOpportunityRecommendationRepository();
        this.aofPipelineHealth = new AofPipelineHealthRepository();
        this.aofGrowthAnalytics = new AofGrowthAnalyticsRepository();
        this.aofExecutiveGrowthDashboards = new AofExecutiveGrowthDashboardRepository();
        this.aofDeliveryOrchestrators = new AofDeliveryOrchestratorRepository();
        this.aofResourcePlanners = new AofResourcePlannerRepository();
        this.aofImplementationSchedulers = new AofImplementationSchedulerRepository();
        this.aofDeploymentCoordination = new AofDeploymentCoordinationRepository();
        this.aofDeliveryIntelligence = new AofDeliveryIntelligenceRepository();
        this.aofCustomerSuccessAutomation = new AofCustomerSuccessAutomationRepository();
        this.aofExecutiveDeliveryDashboards = new AofExecutiveDeliveryDashboardRepository();
        this.aofIdeaRegistry = new AofIdeaRegistryRepository();
        this.aofInnovationPipeline = new AofInnovationPipelineRepository();
        this.aofExperimentTracker = new AofExperimentTrackerRepository();
        this.aofValidationWorkflow = new AofValidationWorkflowRepository();
        this.aofOutcomeEvaluation = new AofOutcomeEvaluationRepository();
        this.aofKnowledgeRepository = new AofKnowledgeRepositoryRepository();
        this.aofAiTaskRouters = new AofAiTaskRouterRepository();
        this.aofHumanApprovalEngine = new AofHumanApprovalEngineRepository();
        this.aofPolicyEngine = new AofPolicyEngineRepository();
        this.aofExecutionHistory = new AofExecutionHistoryRepository();
        this.aofAiGovernanceRules = new AofAiGovernanceRuleRepository();
        this.aofOrganizationMetrics = new AofOrganizationMetricRepository();
        this.aofOrganizationHealth = new AofOrganizationHealthRepository();
        this.aofInnovationDashboards = new AofInnovationDashboardRepository();
        this.aofMissionProgress = new AofMissionProgressRepository();
        this.aofOrganizationFailures = new AofOrganizationFailureRepository();
        this.aofAuditLogs = new AofAuditLogRepository();`;
    da = da.replace(eipCtor, eipCtor + "\n" + aofCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("aofOrganizationHubs")) {
    ds = ds.replace(
        "    eipAuditLogs: databaseAccess.eipAuditLogs,",
        `    eipAuditLogs: databaseAccess.eipAuditLogs,
    aofOrganizationHubs: databaseAccess.aofOrganizationHubs,
    aofGrowthOrchestrators: databaseAccess.aofGrowthOrchestrators,
    aofCampaignIntelligence: databaseAccess.aofCampaignIntelligence,
    aofLeadPrioritization: databaseAccess.aofLeadPrioritization,
    aofOpportunityRecommendations: databaseAccess.aofOpportunityRecommendations,
    aofPipelineHealth: databaseAccess.aofPipelineHealth,
    aofGrowthAnalytics: databaseAccess.aofGrowthAnalytics,
    aofExecutiveGrowthDashboards: databaseAccess.aofExecutiveGrowthDashboards,
    aofDeliveryOrchestrators: databaseAccess.aofDeliveryOrchestrators,
    aofResourcePlanners: databaseAccess.aofResourcePlanners,
    aofImplementationSchedulers: databaseAccess.aofImplementationSchedulers,
    aofDeploymentCoordination: databaseAccess.aofDeploymentCoordination,
    aofDeliveryIntelligence: databaseAccess.aofDeliveryIntelligence,
    aofCustomerSuccessAutomation: databaseAccess.aofCustomerSuccessAutomation,
    aofExecutiveDeliveryDashboards: databaseAccess.aofExecutiveDeliveryDashboards,
    aofIdeaRegistry: databaseAccess.aofIdeaRegistry,
    aofInnovationPipeline: databaseAccess.aofInnovationPipeline,
    aofExperimentTracker: databaseAccess.aofExperimentTracker,
    aofValidationWorkflow: databaseAccess.aofValidationWorkflow,
    aofOutcomeEvaluation: databaseAccess.aofOutcomeEvaluation,
    aofKnowledgeRepository: databaseAccess.aofKnowledgeRepository,
    aofAiTaskRouters: databaseAccess.aofAiTaskRouters,
    aofHumanApprovalEngine: databaseAccess.aofHumanApprovalEngine,
    aofPolicyEngine: databaseAccess.aofPolicyEngine,
    aofExecutionHistory: databaseAccess.aofExecutionHistory,
    aofAiGovernanceRules: databaseAccess.aofAiGovernanceRules,
    aofOrganizationMetrics: databaseAccess.aofOrganizationMetrics,
    aofOrganizationHealth: databaseAccess.aofOrganizationHealth,
    aofInnovationDashboards: databaseAccess.aofInnovationDashboards,
    aofMissionProgress: databaseAccess.aofMissionProgress,
    aofOrganizationFailures: databaseAccess.aofOrganizationFailures,
    aofAuditLogs: databaseAccess.aofAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for AOF");
