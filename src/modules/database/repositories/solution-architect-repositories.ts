import type {
    DbSaApiContract,
    DbSaArchitectureReview,
    DbSaArchitectureVersion,
    DbSaAuditLog,
    DbSaBuildReuseRecommendation,
    DbSaDatabaseSchema,
    DbSaDependencyAnalysis,
    DbSaDeploymentArchitecture,
    DbSaDomainModel,
    DbSaEngagement,
    DbSaIntegrationPlan,
    DbSaModuleSelection,
    DbSaPerformancePlan,
    DbSaScalabilityPlan,
    DbSaSecurityArchitecture,
    DbSaSolutionArchitecture,
    DbSaSprintPlan,
    DbSaSystemDecomposition,
    DbSaTechnologyDecision,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgSaRepository<T> extends BaseRepository<T> {
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

export class SaEngagementRepository extends OrgSaRepository<DbSaEngagement> { protected table = "sa_engagements"; }
export class SaSolutionArchitectureRepository extends OrgSaRepository<DbSaSolutionArchitecture> { protected table = "sa_solution_architectures"; }
export class SaSystemDecompositionRepository extends OrgSaRepository<DbSaSystemDecomposition> { protected table = "sa_system_decompositions"; }
export class SaDomainModelRepository extends OrgSaRepository<DbSaDomainModel> { protected table = "sa_domain_models"; }
export class SaDatabaseSchemaRepository extends OrgSaRepository<DbSaDatabaseSchema> { protected table = "sa_database_schemas"; }
export class SaApiContractRepository extends OrgSaRepository<DbSaApiContract> { protected table = "sa_api_contracts"; }
export class SaModuleSelectionRepository extends OrgSaRepository<DbSaModuleSelection> { protected table = "sa_module_selections"; }
export class SaBuildReuseRecommendationRepository extends OrgSaRepository<DbSaBuildReuseRecommendation> { protected table = "sa_build_reuse_recommendations"; }
export class SaIntegrationPlanRepository extends OrgSaRepository<DbSaIntegrationPlan> { protected table = "sa_integration_plans"; }
export class SaSecurityArchitectureRepository extends OrgSaRepository<DbSaSecurityArchitecture> { protected table = "sa_security_architectures"; }
export class SaScalabilityPlanRepository extends OrgSaRepository<DbSaScalabilityPlan> { protected table = "sa_scalability_plans"; }
export class SaPerformancePlanRepository extends OrgSaRepository<DbSaPerformancePlan> { protected table = "sa_performance_plans"; }
export class SaTechnologyDecisionRepository extends OrgSaRepository<DbSaTechnologyDecision> { protected table = "sa_technology_decisions"; }
export class SaDeploymentArchitectureRepository extends OrgSaRepository<DbSaDeploymentArchitecture> { protected table = "sa_deployment_architectures"; }
export class SaSprintPlanRepository extends OrgSaRepository<DbSaSprintPlan> { protected table = "sa_sprint_plans"; }
export class SaDependencyAnalysisRepository extends OrgSaRepository<DbSaDependencyAnalysis> { protected table = "sa_dependency_analyses"; }
export class SaArchitectureReviewRepository extends OrgSaRepository<DbSaArchitectureReview> { protected table = "sa_architecture_reviews"; }
export class SaArchitectureVersionRepository extends OrgSaRepository<DbSaArchitectureVersion> { protected table = "sa_architecture_versions"; }
export class SaAuditLogRepository extends OrgSaRepository<DbSaAuditLog> { protected table = "sa_audit_logs"; }
