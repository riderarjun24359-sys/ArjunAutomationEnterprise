import type {
    DbCsdDeliveryHub,
    DbCsdCustomerHealthScore,
    DbCsdAdoptionAnalytic,
    DbCsdSuccessPlan,
    DbCsdCustomerTimeline,
    DbCsdRenewalForecast,
    DbCsdSupportTicket,
    DbCsdLiveChatSession,
    DbCsdKnowledgeBaseArticle,
    DbCsdSlaPolicy,
    DbCsdEscalationRule,
    DbCsdDeploymentAutomation,
    DbCsdEnvironmentManagement,
    DbCsdDeploymentTracking,
    DbCsdUpgradeManagement,
    DbCsdReleaseTracking,
    DbCsdTrainingPortal,
    DbCsdVideoLibrary,
    DbCsdProductTour,
    DbCsdCertification,
    DbCsdProgressTracking,
    DbCsdLearningAnalytic,
    DbCsdDeliveryWorkflow,
    DbCsdOnboardingAutomation,
    DbCsdImplementationTracking,
    DbCsdResourceAssignment,
    DbCsdMilestoneTracking,
    DbCsdOperationsMetric,
    DbCsdOperationsHealth,
    DbCsdExecutiveKpi,
    DbCsdDeliveryFailure,
    DbCsdAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgCsdRepository<T> extends BaseRepository<T> {
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

export class CsdDeliveryHubRepository extends OrgCsdRepository<DbCsdDeliveryHub> { protected table = "csd_delivery_hubs"; }
export class CsdCustomerHealthScoreRepository extends OrgCsdRepository<DbCsdCustomerHealthScore> { protected table = "csd_customer_health_scores"; }
export class CsdAdoptionAnalyticRepository extends OrgCsdRepository<DbCsdAdoptionAnalytic> { protected table = "csd_adoption_analytics"; }
export class CsdSuccessPlanRepository extends OrgCsdRepository<DbCsdSuccessPlan> { protected table = "csd_success_plans"; }
export class CsdCustomerTimelineRepository extends OrgCsdRepository<DbCsdCustomerTimeline> { protected table = "csd_customer_timelines"; }
export class CsdRenewalForecastRepository extends OrgCsdRepository<DbCsdRenewalForecast> { protected table = "csd_renewal_forecasts"; }
export class CsdSupportTicketRepository extends OrgCsdRepository<DbCsdSupportTicket> { protected table = "csd_support_tickets"; }
export class CsdLiveChatSessionRepository extends OrgCsdRepository<DbCsdLiveChatSession> { protected table = "csd_live_chat_sessions"; }
export class CsdKnowledgeBaseArticleRepository extends OrgCsdRepository<DbCsdKnowledgeBaseArticle> { protected table = "csd_knowledge_base_articles"; }
export class CsdSlaPolicyRepository extends OrgCsdRepository<DbCsdSlaPolicy> { protected table = "csd_sla_policies"; }
export class CsdEscalationRuleRepository extends OrgCsdRepository<DbCsdEscalationRule> { protected table = "csd_escalation_rules"; }
export class CsdDeploymentAutomationRepository extends OrgCsdRepository<DbCsdDeploymentAutomation> { protected table = "csd_deployment_automations"; }
export class CsdEnvironmentManagementRepository extends OrgCsdRepository<DbCsdEnvironmentManagement> { protected table = "csd_environment_management"; }
export class CsdDeploymentTrackingRepository extends OrgCsdRepository<DbCsdDeploymentTracking> { protected table = "csd_deployment_tracking"; }
export class CsdUpgradeManagementRepository extends OrgCsdRepository<DbCsdUpgradeManagement> { protected table = "csd_upgrade_management"; }
export class CsdReleaseTrackingRepository extends OrgCsdRepository<DbCsdReleaseTracking> { protected table = "csd_release_tracking"; }
export class CsdTrainingPortalRepository extends OrgCsdRepository<DbCsdTrainingPortal> { protected table = "csd_training_portals"; }
export class CsdVideoLibraryRepository extends OrgCsdRepository<DbCsdVideoLibrary> { protected table = "csd_video_library"; }
export class CsdProductTourRepository extends OrgCsdRepository<DbCsdProductTour> { protected table = "csd_product_tours"; }
export class CsdCertificationRepository extends OrgCsdRepository<DbCsdCertification> { protected table = "csd_certifications"; }
export class CsdProgressTrackingRepository extends OrgCsdRepository<DbCsdProgressTracking> { protected table = "csd_progress_tracking"; }
export class CsdLearningAnalyticRepository extends OrgCsdRepository<DbCsdLearningAnalytic> { protected table = "csd_learning_analytics"; }
export class CsdDeliveryWorkflowRepository extends OrgCsdRepository<DbCsdDeliveryWorkflow> { protected table = "csd_delivery_workflows"; }
export class CsdOnboardingAutomationRepository extends OrgCsdRepository<DbCsdOnboardingAutomation> { protected table = "csd_onboarding_automation"; }
export class CsdImplementationTrackingRepository extends OrgCsdRepository<DbCsdImplementationTracking> { protected table = "csd_implementation_tracking"; }
export class CsdResourceAssignmentRepository extends OrgCsdRepository<DbCsdResourceAssignment> { protected table = "csd_resource_assignments"; }
export class CsdMilestoneTrackingRepository extends OrgCsdRepository<DbCsdMilestoneTracking> { protected table = "csd_milestone_tracking"; }
export class CsdOperationsMetricRepository extends OrgCsdRepository<DbCsdOperationsMetric> { protected table = "csd_operations_metrics"; }
export class CsdOperationsHealthRepository extends OrgCsdRepository<DbCsdOperationsHealth> { protected table = "csd_operations_health"; }
export class CsdExecutiveKpiRepository extends OrgCsdRepository<DbCsdExecutiveKpi> { protected table = "csd_executive_kpis"; }
export class CsdDeliveryFailureRepository extends OrgCsdRepository<DbCsdDeliveryFailure> { protected table = "csd_delivery_failures"; }
export class CsdAuditLogRepository extends OrgCsdRepository<DbCsdAuditLog> { protected table = "csd_audit_logs"; }
