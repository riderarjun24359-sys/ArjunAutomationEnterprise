import type {
    DbDfApiScaffold,
    DbDfAuditLog,
    DbDfBackendWorkflow,
    DbDfBuildArtifact,
    DbDfCodeReview,
    DbDfCodingStandard,
    DbDfComponent,
    DbDfEngagement,
    DbDfFrontendWorkflow,
    DbDfMigrationPlan,
    DbDfModuleRecommendation,
    DbDfProgressTracking,
    DbDfPullRequest,
    DbDfRepositoryStructure,
    DbDfSecureCodingValidation,
    DbDfTechnicalDoc,
    DbDfTestScaffold,
    DbDfVersion,
    DbDfWorkPackage,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgDfRepository<T> extends BaseRepository<T> {
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

export class DfEngagementRepository extends OrgDfRepository<DbDfEngagement> { protected table = "df_engagements"; }
export class DfWorkPackageRepository extends OrgDfRepository<DbDfWorkPackage> { protected table = "df_work_packages"; }
export class DfBackendWorkflowRepository extends OrgDfRepository<DbDfBackendWorkflow> { protected table = "df_backend_workflows"; }
export class DfFrontendWorkflowRepository extends OrgDfRepository<DbDfFrontendWorkflow> { protected table = "df_frontend_workflows"; }
export class DfApiScaffoldRepository extends OrgDfRepository<DbDfApiScaffold> { protected table = "df_api_scaffolds"; }
export class DfMigrationPlanRepository extends OrgDfRepository<DbDfMigrationPlan> { protected table = "df_migration_plans"; }
export class DfRepositoryStructureRepository extends OrgDfRepository<DbDfRepositoryStructure> { protected table = "df_repositories"; }
export class DfComponentRepository extends OrgDfRepository<DbDfComponent> { protected table = "df_components"; }
export class DfTestScaffoldRepository extends OrgDfRepository<DbDfTestScaffold> { protected table = "df_test_scaffolds"; }
export class DfCodingStandardRepository extends OrgDfRepository<DbDfCodingStandard> { protected table = "df_coding_standards"; }
export class DfSecureCodingValidationRepository extends OrgDfRepository<DbDfSecureCodingValidation> { protected table = "df_secure_coding_validations"; }
export class DfModuleRecommendationRepository extends OrgDfRepository<DbDfModuleRecommendation> { protected table = "df_module_recommendations"; }
export class DfPullRequestRepository extends OrgDfRepository<DbDfPullRequest> { protected table = "df_pull_requests"; }
export class DfCodeReviewRepository extends OrgDfRepository<DbDfCodeReview> { protected table = "df_code_reviews"; }
export class DfTechnicalDocRepository extends OrgDfRepository<DbDfTechnicalDoc> { protected table = "df_technical_docs"; }
export class DfProgressTrackingRepository extends OrgDfRepository<DbDfProgressTracking> { protected table = "df_progress_tracking"; }
export class DfBuildArtifactRepository extends OrgDfRepository<DbDfBuildArtifact> { protected table = "df_build_artifacts"; }
export class DfVersionRepository extends OrgDfRepository<DbDfVersion> { protected table = "df_versions"; }
export class DfAuditLogRepository extends OrgDfRepository<DbDfAuditLog> { protected table = "df_audit_logs"; }
