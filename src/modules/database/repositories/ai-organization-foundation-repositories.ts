import type {
    DbAofOrganizationHub,
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
    DbAofAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAofRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class AofOrganizationHubRepository extends OrgAofRepository<DbAofOrganizationHub> { protected table = "aof_organization_hubs"; }
export class AofGrowthOrchestratorRepository extends OrgAofRepository<DbAofGrowthOrchestrator> { protected table = "aof_growth_orchestrators"; }
export class AofCampaignIntelligenceRepository extends OrgAofRepository<DbAofCampaignIntelligence> { protected table = "aof_campaign_intelligence"; }
export class AofLeadPrioritizationRepository extends OrgAofRepository<DbAofLeadPrioritization> { protected table = "aof_lead_prioritization"; }
export class AofOpportunityRecommendationRepository extends OrgAofRepository<DbAofOpportunityRecommendation> { protected table = "aof_opportunity_recommendations"; }
export class AofPipelineHealthRepository extends OrgAofRepository<DbAofPipelineHealth> { protected table = "aof_pipeline_health"; }
export class AofGrowthAnalyticsRepository extends OrgAofRepository<DbAofGrowthAnalytics> { protected table = "aof_growth_analytics"; }
export class AofExecutiveGrowthDashboardRepository extends OrgAofRepository<DbAofExecutiveGrowthDashboard> { protected table = "aof_executive_growth_dashboards"; }
export class AofDeliveryOrchestratorRepository extends OrgAofRepository<DbAofDeliveryOrchestrator> { protected table = "aof_delivery_orchestrators"; }
export class AofResourcePlannerRepository extends OrgAofRepository<DbAofResourcePlanner> { protected table = "aof_resource_planners"; }
export class AofImplementationSchedulerRepository extends OrgAofRepository<DbAofImplementationScheduler> { protected table = "aof_implementation_schedulers"; }
export class AofDeploymentCoordinationRepository extends OrgAofRepository<DbAofDeploymentCoordination> { protected table = "aof_deployment_coordination"; }
export class AofDeliveryIntelligenceRepository extends OrgAofRepository<DbAofDeliveryIntelligence> { protected table = "aof_delivery_intelligence"; }
export class AofCustomerSuccessAutomationRepository extends OrgAofRepository<DbAofCustomerSuccessAutomation> { protected table = "aof_customer_success_automation"; }
export class AofExecutiveDeliveryDashboardRepository extends OrgAofRepository<DbAofExecutiveDeliveryDashboard> { protected table = "aof_executive_delivery_dashboards"; }
export class AofIdeaRegistryRepository extends OrgAofRepository<DbAofIdeaRegistry> { protected table = "aof_idea_registry"; }
export class AofInnovationPipelineRepository extends OrgAofRepository<DbAofInnovationPipeline> { protected table = "aof_innovation_pipeline"; }
export class AofExperimentTrackerRepository extends OrgAofRepository<DbAofExperimentTracker> { protected table = "aof_experiment_tracker"; }
export class AofValidationWorkflowRepository extends OrgAofRepository<DbAofValidationWorkflow> { protected table = "aof_validation_workflow"; }
export class AofOutcomeEvaluationRepository extends OrgAofRepository<DbAofOutcomeEvaluation> { protected table = "aof_outcome_evaluation"; }
export class AofKnowledgeRepositoryRepository extends OrgAofRepository<DbAofKnowledgeRepository> { protected table = "aof_knowledge_repository"; }
export class AofAiTaskRouterRepository extends OrgAofRepository<DbAofAiTaskRouter> { protected table = "aof_ai_task_routers"; }
export class AofHumanApprovalEngineRepository extends OrgAofRepository<DbAofHumanApprovalEngine> { protected table = "aof_human_approval_engine"; }
export class AofPolicyEngineRepository extends OrgAofRepository<DbAofPolicyEngine> { protected table = "aof_policy_engine"; }
export class AofExecutionHistoryRepository extends OrgAofRepository<DbAofExecutionHistory> { protected table = "aof_execution_history"; }
export class AofAiGovernanceRuleRepository extends OrgAofRepository<DbAofAiGovernanceRule> { protected table = "aof_ai_governance_rules"; }
export class AofOrganizationMetricRepository extends OrgAofRepository<DbAofOrganizationMetric> { protected table = "aof_organization_metrics"; }
export class AofOrganizationHealthRepository extends OrgAofRepository<DbAofOrganizationHealth> { protected table = "aof_organization_health"; }
export class AofInnovationDashboardRepository extends OrgAofRepository<DbAofInnovationDashboard> { protected table = "aof_innovation_dashboards"; }
export class AofMissionProgressRepository extends OrgAofRepository<DbAofMissionProgress> { protected table = "aof_mission_progress"; }
export class AofOrganizationFailureRepository extends OrgAofRepository<DbAofOrganizationFailure> { protected table = "aof_organization_failures"; }
export class AofAuditLogRepository extends OrgAofRepository<DbAofAuditLog> { protected table = "aof_audit_logs"; }
