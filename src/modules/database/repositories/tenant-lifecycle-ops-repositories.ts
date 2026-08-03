import type {
    DbTloTenantContext,
    DbTloLifecycleRecord,
    DbTloLifecycleTransition,
    DbTloLifecycleEvent,
    DbTloReactivationRequest,
    DbTloWorkspace,
    DbTloEnvironmentSetting,
    DbTloStorageManagement,
    DbTloOperationsControl,
    DbTloOnboardingFlow,
    DbTloOnboardingProgress,
    DbTloOnboardingValidation,
    DbTloGoLiveChecklist,
    DbTloMarketplaceModule,
    DbTloModuleInstallation,
    DbTloModuleDependency,
    DbTloModuleCompatibility,
    DbTloIndustryPack,
    DbTloPackInstallation,
    DbTloPackVersion,
    DbTloPackExport,
    DbTloHealthSnapshot,
    DbTloHealthDimension,
    DbTloHealthRisk,
    DbTloHealthScore,
    DbTloSuccessPlan,
    DbTloQuarterlyReview,
    DbTloRenewalPlan,
    DbTloCustomerMilestone,
    DbTloCommercialMetric,
    DbTloGrowthSnapshot,
    DbTloExpansionOpportunity,
    DbTloAuditLog,
} from "@/src/modules/database/types/tlo-platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgTloRepository<T> extends BaseRepository<T> {
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

export class TloTenantContextRepository extends OrgTloRepository<DbTloTenantContext> { protected table = "tlo_tenant_contexts"; }
export class TloLifecycleRecordRepository extends OrgTloRepository<DbTloLifecycleRecord> { protected table = "tlo_lifecycle_records"; }
export class TloLifecycleTransitionRepository extends OrgTloRepository<DbTloLifecycleTransition> { protected table = "tlo_lifecycle_transitions"; }
export class TloLifecycleEventRepository extends OrgTloRepository<DbTloLifecycleEvent> { protected table = "tlo_lifecycle_events"; }
export class TloReactivationRequestRepository extends OrgTloRepository<DbTloReactivationRequest> { protected table = "tlo_reactivation_requests"; }
export class TloWorkspaceRepository extends OrgTloRepository<DbTloWorkspace> { protected table = "tlo_workspaces"; }
export class TloEnvironmentSettingRepository extends OrgTloRepository<DbTloEnvironmentSetting> { protected table = "tlo_environment_settings"; }
export class TloStorageManagementRepository extends OrgTloRepository<DbTloStorageManagement> { protected table = "tlo_storage_management"; }
export class TloOperationsControlRepository extends OrgTloRepository<DbTloOperationsControl> { protected table = "tlo_operations_controls"; }
export class TloOnboardingFlowRepository extends OrgTloRepository<DbTloOnboardingFlow> { protected table = "tlo_onboarding_flows"; }
export class TloOnboardingProgressRepository extends OrgTloRepository<DbTloOnboardingProgress> { protected table = "tlo_onboarding_progress"; }
export class TloOnboardingValidationRepository extends OrgTloRepository<DbTloOnboardingValidation> { protected table = "tlo_onboarding_validations"; }
export class TloGoLiveChecklistRepository extends OrgTloRepository<DbTloGoLiveChecklist> { protected table = "tlo_go_live_checklists"; }
export class TloMarketplaceModuleRepository extends OrgTloRepository<DbTloMarketplaceModule> { protected table = "tlo_marketplace_modules"; }
export class TloModuleInstallationRepository extends OrgTloRepository<DbTloModuleInstallation> { protected table = "tlo_module_installations"; }
export class TloModuleDependencyRepository extends OrgTloRepository<DbTloModuleDependency> { protected table = "tlo_module_dependencies"; }
export class TloModuleCompatibilityRepository extends OrgTloRepository<DbTloModuleCompatibility> { protected table = "tlo_module_compatibility"; }
export class TloIndustryPackRepository extends OrgTloRepository<DbTloIndustryPack> { protected table = "tlo_industry_packs"; }
export class TloPackInstallationRepository extends OrgTloRepository<DbTloPackInstallation> { protected table = "tlo_pack_installations"; }
export class TloPackVersionRepository extends OrgTloRepository<DbTloPackVersion> { protected table = "tlo_pack_versions"; }
export class TloPackExportRepository extends OrgTloRepository<DbTloPackExport> { protected table = "tlo_pack_exports"; }
export class TloHealthSnapshotRepository extends OrgTloRepository<DbTloHealthSnapshot> { protected table = "tlo_health_snapshots"; }
export class TloHealthDimensionRepository extends OrgTloRepository<DbTloHealthDimension> { protected table = "tlo_health_dimensions"; }
export class TloHealthRiskRepository extends OrgTloRepository<DbTloHealthRisk> { protected table = "tlo_health_risks"; }
export class TloHealthScoreRepository extends OrgTloRepository<DbTloHealthScore> { protected table = "tlo_health_scores"; }
export class TloSuccessPlanRepository extends OrgTloRepository<DbTloSuccessPlan> { protected table = "tlo_success_plans"; }
export class TloQuarterlyReviewRepository extends OrgTloRepository<DbTloQuarterlyReview> { protected table = "tlo_quarterly_reviews"; }
export class TloRenewalPlanRepository extends OrgTloRepository<DbTloRenewalPlan> { protected table = "tlo_renewal_plans"; }
export class TloCustomerMilestoneRepository extends OrgTloRepository<DbTloCustomerMilestone> { protected table = "tlo_customer_milestones"; }
export class TloCommercialMetricRepository extends OrgTloRepository<DbTloCommercialMetric> { protected table = "tlo_commercial_metrics"; }
export class TloGrowthSnapshotRepository extends OrgTloRepository<DbTloGrowthSnapshot> { protected table = "tlo_growth_snapshots"; }
export class TloExpansionOpportunityRepository extends OrgTloRepository<DbTloExpansionOpportunity> { protected table = "tlo_expansion_opportunities"; }
export class TloAuditLogRepository extends OrgTloRepository<DbTloAuditLog> { protected table = "tlo_audit_logs"; }
