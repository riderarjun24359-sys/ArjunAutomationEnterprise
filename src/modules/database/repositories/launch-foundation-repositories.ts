import type {
    DbElfLaunchHub,
    DbElfOrganizationProvision,
    DbElfTenantProvision,
    DbElfIndustryPackAssignment,
    DbElfModuleLicense,
    DbElfWizardProfile,
    DbElfWizardBranding,
    DbElfWizardDepartment,
    DbElfWizardSetting,
    DbElfImportJob,
    DbElfImportValidation,
    DbElfImportPreview,
    DbElfImportHistory,
    DbElfGoLiveChecklist,
    DbElfGoLiveScore,
    DbElfDeploymentStatus,
    DbElfReadinessValidation,
    DbElfCustomerHealthScore,
    DbElfPlatformAdoption,
    DbElfFeatureUsage,
    DbElfRenewalTracking,
    DbElfSupportTicket,
    DbElfKnowledgeBaseArticle,
    DbElfIncidentTracking,
    DbElfCustomerRegistry,
    DbElfSubscriptionRecord,
    DbElfLicenseManagement,
    DbElfLaunchMetric,
    DbElfLaunchHealth,
    DbElfMissionControlKpi,
    DbElfLaunchFailure,
    DbElfAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgElfRepository<T> extends BaseRepository<T> {
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

export class ElfLaunchHubRepository extends OrgElfRepository<DbElfLaunchHub> { protected table = "elf_launch_hubs"; }
export class ElfOrganizationProvisionRepository extends OrgElfRepository<DbElfOrganizationProvision> { protected table = "elf_organization_provisions"; }
export class ElfTenantProvisionRepository extends OrgElfRepository<DbElfTenantProvision> { protected table = "elf_tenant_provisions"; }
export class ElfIndustryPackAssignmentRepository extends OrgElfRepository<DbElfIndustryPackAssignment> { protected table = "elf_industry_pack_assignments"; }
export class ElfModuleLicenseRepository extends OrgElfRepository<DbElfModuleLicense> { protected table = "elf_module_licenses"; }
export class ElfWizardProfileRepository extends OrgElfRepository<DbElfWizardProfile> { protected table = "elf_wizard_profiles"; }
export class ElfWizardBrandingRepository extends OrgElfRepository<DbElfWizardBranding> { protected table = "elf_wizard_branding"; }
export class ElfWizardDepartmentRepository extends OrgElfRepository<DbElfWizardDepartment> { protected table = "elf_wizard_departments"; }
export class ElfWizardSettingRepository extends OrgElfRepository<DbElfWizardSetting> { protected table = "elf_wizard_settings"; }
export class ElfImportJobRepository extends OrgElfRepository<DbElfImportJob> { protected table = "elf_import_jobs"; }
export class ElfImportValidationRepository extends OrgElfRepository<DbElfImportValidation> { protected table = "elf_import_validations"; }
export class ElfImportPreviewRepository extends OrgElfRepository<DbElfImportPreview> { protected table = "elf_import_previews"; }
export class ElfImportHistoryRepository extends OrgElfRepository<DbElfImportHistory> { protected table = "elf_import_history"; }
export class ElfGoLiveChecklistRepository extends OrgElfRepository<DbElfGoLiveChecklist> { protected table = "elf_go_live_checklists"; }
export class ElfGoLiveScoreRepository extends OrgElfRepository<DbElfGoLiveScore> { protected table = "elf_go_live_scores"; }
export class ElfDeploymentStatusRepository extends OrgElfRepository<DbElfDeploymentStatus> { protected table = "elf_deployment_statuses"; }
export class ElfReadinessValidationRepository extends OrgElfRepository<DbElfReadinessValidation> { protected table = "elf_readiness_validations"; }
export class ElfCustomerHealthScoreRepository extends OrgElfRepository<DbElfCustomerHealthScore> { protected table = "elf_customer_health_scores"; }
export class ElfPlatformAdoptionRepository extends OrgElfRepository<DbElfPlatformAdoption> { protected table = "elf_platform_adoption"; }
export class ElfFeatureUsageRepository extends OrgElfRepository<DbElfFeatureUsage> { protected table = "elf_feature_usage"; }
export class ElfRenewalTrackingRepository extends OrgElfRepository<DbElfRenewalTracking> { protected table = "elf_renewal_tracking"; }
export class ElfSupportTicketRepository extends OrgElfRepository<DbElfSupportTicket> { protected table = "elf_support_tickets"; }
export class ElfKnowledgeBaseArticleRepository extends OrgElfRepository<DbElfKnowledgeBaseArticle> { protected table = "elf_knowledge_base_articles"; }
export class ElfIncidentTrackingRepository extends OrgElfRepository<DbElfIncidentTracking> { protected table = "elf_incident_tracking"; }
export class ElfCustomerRegistryRepository extends OrgElfRepository<DbElfCustomerRegistry> { protected table = "elf_customer_registry"; }
export class ElfSubscriptionRecordRepository extends OrgElfRepository<DbElfSubscriptionRecord> { protected table = "elf_subscription_records"; }
export class ElfLicenseManagementRepository extends OrgElfRepository<DbElfLicenseManagement> { protected table = "elf_license_management"; }
export class ElfLaunchMetricRepository extends OrgElfRepository<DbElfLaunchMetric> { protected table = "elf_launch_metrics"; }
export class ElfLaunchHealthRepository extends OrgElfRepository<DbElfLaunchHealth> { protected table = "elf_launch_health"; }
export class ElfMissionControlKpiRepository extends OrgElfRepository<DbElfMissionControlKpi> { protected table = "elf_mission_control_kpis"; }
export class ElfLaunchFailureRepository extends OrgElfRepository<DbElfLaunchFailure> { protected table = "elf_launch_failures"; }
export class ElfAuditLogRepository extends OrgElfRepository<DbElfAuditLog> { protected table = "elf_audit_logs"; }
