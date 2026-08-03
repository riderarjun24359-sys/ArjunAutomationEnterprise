import type {
    DbQaAccessibilityValidation,
    DbQaApiValidation,
    DbQaAuditLog,
    DbQaBugTriage,
    DbQaCoverageAnalytics,
    DbQaDatabaseValidation,
    DbQaDefectAnalysis,
    DbQaEngagement,
    DbQaE2eTestPlan,
    DbQaIntegrationTestPlan,
    DbQaPerformanceValidation,
    DbQaQualityScore,
    DbQaRegressionAnalysis,
    DbQaReleaseReadiness,
    DbQaRiskBasedTest,
    DbQaSecurityValidation,
    DbQaTestStrategy,
    DbQaUiValidation,
    DbQaUnitTestPlan,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgQaRepository<T> extends BaseRepository<T> {
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

export class QaEngagementRepository extends OrgQaRepository<DbQaEngagement> { protected table = "qa_engagements"; }
export class QaTestStrategyRepository extends OrgQaRepository<DbQaTestStrategy> { protected table = "qa_test_strategies"; }
export class QaUnitTestPlanRepository extends OrgQaRepository<DbQaUnitTestPlan> { protected table = "qa_unit_test_plans"; }
export class QaIntegrationTestPlanRepository extends OrgQaRepository<DbQaIntegrationTestPlan> { protected table = "qa_integration_test_plans"; }
export class QaE2eTestPlanRepository extends OrgQaRepository<DbQaE2eTestPlan> { protected table = "qa_e2e_test_plans"; }
export class QaRegressionAnalysisRepository extends OrgQaRepository<DbQaRegressionAnalysis> { protected table = "qa_regression_analyses"; }
export class QaRiskBasedTestRepository extends OrgQaRepository<DbQaRiskBasedTest> { protected table = "qa_risk_based_tests"; }
export class QaSecurityValidationRepository extends OrgQaRepository<DbQaSecurityValidation> { protected table = "qa_security_validations"; }
export class QaPerformanceValidationRepository extends OrgQaRepository<DbQaPerformanceValidation> { protected table = "qa_performance_validations"; }
export class QaAccessibilityValidationRepository extends OrgQaRepository<DbQaAccessibilityValidation> { protected table = "qa_accessibility_validations"; }
export class QaApiValidationRepository extends OrgQaRepository<DbQaApiValidation> { protected table = "qa_api_validations"; }
export class QaDatabaseValidationRepository extends OrgQaRepository<DbQaDatabaseValidation> { protected table = "qa_database_validations"; }
export class QaUiValidationRepository extends OrgQaRepository<DbQaUiValidation> { protected table = "qa_ui_validations"; }
export class QaBugTriageRepository extends OrgQaRepository<DbQaBugTriage> { protected table = "qa_bug_triages"; }
export class QaDefectAnalysisRepository extends OrgQaRepository<DbQaDefectAnalysis> { protected table = "qa_defect_analyses"; }
export class QaCoverageAnalyticsRepository extends OrgQaRepository<DbQaCoverageAnalytics> { protected table = "qa_coverage_analytics"; }
export class QaReleaseReadinessRepository extends OrgQaRepository<DbQaReleaseReadiness> { protected table = "qa_release_readiness"; }
export class QaQualityScoreRepository extends OrgQaRepository<DbQaQualityScore> { protected table = "qa_quality_scores"; }
export class QaAuditLogRepository extends OrgQaRepository<DbQaAuditLog> { protected table = "qa_audit_logs"; }
