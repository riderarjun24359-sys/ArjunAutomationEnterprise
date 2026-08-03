import type {
    DbAixIntelligenceHub,
    DbAixDailyExecutiveBrief,
    DbAixWeeklyBusinessReview,
    DbAixMonthlyExecutiveSummary,
    DbAixTrialConversionScore,
    DbAixRenewalProbability,
    DbAixChurnRisk,
    DbAixExpansionOpportunity,
    DbAixMrrTrend,
    DbAixArrTrend,
    DbAixRevenueGrowthMetric,
    DbAixRevenueRisk,
    DbAixPlatformHealthIntel,
    DbAixQueueHealthIntel,
    DbAixIntegrationHealthIntel,
    DbAixPerformanceTrend,
    DbAixUnusualLoginActivity,
    DbAixPermissionRisk,
    DbAixTenantSecurityTrend,
    DbAixComplianceWarning,
    DbAixTodayPriority,
    DbAixRecommendedAction,
    DbAixBusinessRisk,
    DbAixGrowthOpportunity,
    DbAixKnowledgeReasoningSession,
    DbAixEvidenceTrace,
    DbAixOrchestrationLink,
    DbAixRecommendationOutput,
    DbAixExecutiveMetric,
    DbAixExecutiveHealth,
    DbAixExecutiveFailure,
    DbAixAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAixRepository<T> extends BaseRepository<T> {
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

export class AixIntelligenceHubRepository extends OrgAixRepository<DbAixIntelligenceHub> { protected table = "aix_intelligence_hubs"; }
export class AixDailyExecutiveBriefRepository extends OrgAixRepository<DbAixDailyExecutiveBrief> { protected table = "aix_daily_executive_briefs"; }
export class AixWeeklyBusinessReviewRepository extends OrgAixRepository<DbAixWeeklyBusinessReview> { protected table = "aix_weekly_business_reviews"; }
export class AixMonthlyExecutiveSummaryRepository extends OrgAixRepository<DbAixMonthlyExecutiveSummary> { protected table = "aix_monthly_executive_summaries"; }
export class AixTrialConversionScoreRepository extends OrgAixRepository<DbAixTrialConversionScore> { protected table = "aix_trial_conversion_scores"; }
export class AixRenewalProbabilityRepository extends OrgAixRepository<DbAixRenewalProbability> { protected table = "aix_renewal_probabilities"; }
export class AixChurnRiskRepository extends OrgAixRepository<DbAixChurnRisk> { protected table = "aix_churn_risks"; }
export class AixExpansionOpportunityRepository extends OrgAixRepository<DbAixExpansionOpportunity> { protected table = "aix_expansion_opportunities"; }
export class AixMrrTrendRepository extends OrgAixRepository<DbAixMrrTrend> { protected table = "aix_mrr_trends"; }
export class AixArrTrendRepository extends OrgAixRepository<DbAixArrTrend> { protected table = "aix_arr_trends"; }
export class AixRevenueGrowthMetricRepository extends OrgAixRepository<DbAixRevenueGrowthMetric> { protected table = "aix_revenue_growth_metrics"; }
export class AixRevenueRiskRepository extends OrgAixRepository<DbAixRevenueRisk> { protected table = "aix_revenue_risks"; }
export class AixPlatformHealthIntelRepository extends OrgAixRepository<DbAixPlatformHealthIntel> { protected table = "aix_platform_health_intel"; }
export class AixQueueHealthIntelRepository extends OrgAixRepository<DbAixQueueHealthIntel> { protected table = "aix_queue_health_intel"; }
export class AixIntegrationHealthIntelRepository extends OrgAixRepository<DbAixIntegrationHealthIntel> { protected table = "aix_integration_health_intel"; }
export class AixPerformanceTrendRepository extends OrgAixRepository<DbAixPerformanceTrend> { protected table = "aix_performance_trends"; }
export class AixUnusualLoginActivityRepository extends OrgAixRepository<DbAixUnusualLoginActivity> { protected table = "aix_unusual_login_activity"; }
export class AixPermissionRiskRepository extends OrgAixRepository<DbAixPermissionRisk> { protected table = "aix_permission_risks"; }
export class AixTenantSecurityTrendRepository extends OrgAixRepository<DbAixTenantSecurityTrend> { protected table = "aix_tenant_security_trends"; }
export class AixComplianceWarningRepository extends OrgAixRepository<DbAixComplianceWarning> { protected table = "aix_compliance_warnings"; }
export class AixTodayPriorityRepository extends OrgAixRepository<DbAixTodayPriority> { protected table = "aix_today_priorities"; }
export class AixRecommendedActionRepository extends OrgAixRepository<DbAixRecommendedAction> { protected table = "aix_recommended_actions"; }
export class AixBusinessRiskRepository extends OrgAixRepository<DbAixBusinessRisk> { protected table = "aix_business_risks"; }
export class AixGrowthOpportunityRepository extends OrgAixRepository<DbAixGrowthOpportunity> { protected table = "aix_growth_opportunities"; }
export class AixKnowledgeReasoningSessionRepository extends OrgAixRepository<DbAixKnowledgeReasoningSession> { protected table = "aix_knowledge_reasoning_sessions"; }
export class AixEvidenceTraceRepository extends OrgAixRepository<DbAixEvidenceTrace> { protected table = "aix_evidence_traces"; }
export class AixOrchestrationLinkRepository extends OrgAixRepository<DbAixOrchestrationLink> { protected table = "aix_orchestration_links"; }
export class AixRecommendationOutputRepository extends OrgAixRepository<DbAixRecommendationOutput> { protected table = "aix_recommendation_outputs"; }
export class AixExecutiveMetricRepository extends OrgAixRepository<DbAixExecutiveMetric> { protected table = "aix_executive_metrics"; }
export class AixExecutiveHealthRepository extends OrgAixRepository<DbAixExecutiveHealth> { protected table = "aix_executive_health"; }
export class AixExecutiveFailureRepository extends OrgAixRepository<DbAixExecutiveFailure> { protected table = "aix_executive_failures"; }
export class AixAuditLogRepository extends OrgAixRepository<DbAixAuditLog> { protected table = "aix_audit_logs"; }
