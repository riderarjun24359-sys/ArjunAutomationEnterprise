import type {
    DbCsAdoptionTracking,
    DbCsAuditLog,
    DbCsChurnPrediction,
    DbCsCommunicationPlan,
    DbCsEngagement,
    DbCsExecutiveSummary,
    DbCsExpansionOpportunity,
    DbCsFeedbackAnalysis,
    DbCsHealthScore,
    DbCsLifecycleManagement,
    DbCsOnboardingWorkflow,
    DbCsQbrReport,
    DbCsRenewalPlan,
    DbCsRiskAnalysis,
    DbCsSlaMonitoring,
    DbCsSuccessKpiDashboard,
    DbCsSuccessPlaybook,
    DbCsSupportTrendAnalysis,
    DbCsTrainingRecommendation,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgCsRepository<T> extends BaseRepository<T> {
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
}

export class CsEngagementRepository extends OrgCsRepository<DbCsEngagement> { protected table = "cs_engagements"; }
export class CsOnboardingWorkflowRepository extends OrgCsRepository<DbCsOnboardingWorkflow> { protected table = "cs_onboarding_workflows"; }
export class CsAdoptionTrackingRepository extends OrgCsRepository<DbCsAdoptionTracking> { protected table = "cs_adoption_tracking"; }
export class CsHealthScoreRepository extends OrgCsRepository<DbCsHealthScore> { protected table = "cs_health_scores"; }
export class CsRenewalPlanRepository extends OrgCsRepository<DbCsRenewalPlan> { protected table = "cs_renewal_plans"; }
export class CsExpansionOpportunityRepository extends OrgCsRepository<DbCsExpansionOpportunity> { protected table = "cs_expansion_opportunities"; }
export class CsRiskAnalysisRepository extends OrgCsRepository<DbCsRiskAnalysis> { protected table = "cs_risk_analyses"; }
export class CsSupportTrendAnalysisRepository extends OrgCsRepository<DbCsSupportTrendAnalysis> { protected table = "cs_support_trend_analyses"; }
export class CsSuccessPlaybookRepository extends OrgCsRepository<DbCsSuccessPlaybook> { protected table = "cs_success_playbooks"; }
export class CsQbrReportRepository extends OrgCsRepository<DbCsQbrReport> { protected table = "cs_qbr_reports"; }
export class CsCommunicationPlanRepository extends OrgCsRepository<DbCsCommunicationPlan> { protected table = "cs_communication_plans"; }
export class CsTrainingRecommendationRepository extends OrgCsRepository<DbCsTrainingRecommendation> { protected table = "cs_training_recommendations"; }
export class CsFeedbackAnalysisRepository extends OrgCsRepository<DbCsFeedbackAnalysis> { protected table = "cs_feedback_analyses"; }
export class CsSlaMonitoringRepository extends OrgCsRepository<DbCsSlaMonitoring> { protected table = "cs_sla_monitoring"; }
export class CsSuccessKpiDashboardRepository extends OrgCsRepository<DbCsSuccessKpiDashboard> { protected table = "cs_success_kpi_dashboards"; }
export class CsChurnPredictionRepository extends OrgCsRepository<DbCsChurnPrediction> { protected table = "cs_churn_predictions"; }
export class CsLifecycleManagementRepository extends OrgCsRepository<DbCsLifecycleManagement> { protected table = "cs_lifecycle_management"; }
export class CsExecutiveSummaryRepository extends OrgCsRepository<DbCsExecutiveSummary> { protected table = "cs_executive_summaries"; }
export class CsAuditLogRepository extends OrgCsRepository<DbCsAuditLog> { protected table = "cs_audit_logs"; }
