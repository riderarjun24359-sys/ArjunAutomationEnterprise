import type {
    DbIfrFrameworkHub,
    DbIfrIndustryRegistration,
    DbIfrIndustryMetadata,
    DbIfrIndustryVersion,
    DbIfrIndustryDependency,
    DbIfrBusinessType,
    DbIfrBusinessSize,
    DbIfrOperatingModel,
    DbIfrIndustryProfile,
    DbIfrDashboardTemplate,
    DbIfrWorkflowTemplate,
    DbIfrRoleTemplate,
    DbIfrReportTemplate,
    DbIfrDynamicConfiguration,
    DbIfrFeatureConfiguration,
    DbIfrBusinessRule,
    DbIfrValidationRule,
    DbIfrIndustryContext,
    DbIfrAiContext,
    DbIfrTerminologyEntry,
    DbIfrDemoProfile,
    DbIfrProductionProfile,
    DbIfrEnterpriseProfile,
    DbIfrSharedApi,
    DbIfrContextApi,
    DbIfrConfigurationApi,
    DbIfrExtensionPoint,
    DbIfrFrameworkMetric,
    DbIfrFrameworkHealth,
    DbIfrCompatibilityCheck,
    DbIfrFrameworkFailure,
    DbIfrAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgIfrRepository<T> extends BaseRepository<T> {
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

export class IfrFrameworkHubRepository extends OrgIfrRepository<DbIfrFrameworkHub> { protected table = "ifr_framework_hubs"; }
export class IfrIndustryRegistrationRepository extends OrgIfrRepository<DbIfrIndustryRegistration> { protected table = "ifr_industry_registrations"; }
export class IfrIndustryMetadataRepository extends OrgIfrRepository<DbIfrIndustryMetadata> { protected table = "ifr_industry_metadata"; }
export class IfrIndustryVersionRepository extends OrgIfrRepository<DbIfrIndustryVersion> { protected table = "ifr_industry_versions"; }
export class IfrIndustryDependencyRepository extends OrgIfrRepository<DbIfrIndustryDependency> { protected table = "ifr_industry_dependencies"; }
export class IfrBusinessTypeRepository extends OrgIfrRepository<DbIfrBusinessType> { protected table = "ifr_business_types"; }
export class IfrBusinessSizeRepository extends OrgIfrRepository<DbIfrBusinessSize> { protected table = "ifr_business_sizes"; }
export class IfrOperatingModelRepository extends OrgIfrRepository<DbIfrOperatingModel> { protected table = "ifr_operating_models"; }
export class IfrIndustryProfileRepository extends OrgIfrRepository<DbIfrIndustryProfile> { protected table = "ifr_industry_profiles"; }
export class IfrDashboardTemplateRepository extends OrgIfrRepository<DbIfrDashboardTemplate> { protected table = "ifr_dashboard_templates"; }
export class IfrWorkflowTemplateRepository extends OrgIfrRepository<DbIfrWorkflowTemplate> { protected table = "ifr_workflow_templates"; }
export class IfrRoleTemplateRepository extends OrgIfrRepository<DbIfrRoleTemplate> { protected table = "ifr_role_templates"; }
export class IfrReportTemplateRepository extends OrgIfrRepository<DbIfrReportTemplate> { protected table = "ifr_report_templates"; }
export class IfrDynamicConfigurationRepository extends OrgIfrRepository<DbIfrDynamicConfiguration> { protected table = "ifr_dynamic_configurations"; }
export class IfrFeatureConfigurationRepository extends OrgIfrRepository<DbIfrFeatureConfiguration> { protected table = "ifr_feature_configurations"; }
export class IfrBusinessRuleRepository extends OrgIfrRepository<DbIfrBusinessRule> { protected table = "ifr_business_rules"; }
export class IfrValidationRuleRepository extends OrgIfrRepository<DbIfrValidationRule> { protected table = "ifr_validation_rules"; }
export class IfrIndustryContextRepository extends OrgIfrRepository<DbIfrIndustryContext> { protected table = "ifr_industry_contexts"; }
export class IfrAiContextRepository extends OrgIfrRepository<DbIfrAiContext> { protected table = "ifr_ai_contexts"; }
export class IfrTerminologyEntryRepository extends OrgIfrRepository<DbIfrTerminologyEntry> { protected table = "ifr_terminology_entries"; }
export class IfrDemoProfileRepository extends OrgIfrRepository<DbIfrDemoProfile> { protected table = "ifr_demo_profiles"; }
export class IfrProductionProfileRepository extends OrgIfrRepository<DbIfrProductionProfile> { protected table = "ifr_production_profiles"; }
export class IfrEnterpriseProfileRepository extends OrgIfrRepository<DbIfrEnterpriseProfile> { protected table = "ifr_enterprise_profiles"; }
export class IfrSharedApiRepository extends OrgIfrRepository<DbIfrSharedApi> { protected table = "ifr_shared_apis"; }
export class IfrContextApiRepository extends OrgIfrRepository<DbIfrContextApi> { protected table = "ifr_context_apis"; }
export class IfrConfigurationApiRepository extends OrgIfrRepository<DbIfrConfigurationApi> { protected table = "ifr_configuration_apis"; }
export class IfrExtensionPointRepository extends OrgIfrRepository<DbIfrExtensionPoint> { protected table = "ifr_extension_points"; }
export class IfrFrameworkMetricRepository extends OrgIfrRepository<DbIfrFrameworkMetric> { protected table = "ifr_framework_metrics"; }
export class IfrFrameworkHealthRepository extends OrgIfrRepository<DbIfrFrameworkHealth> { protected table = "ifr_framework_health"; }
export class IfrCompatibilityCheckRepository extends OrgIfrRepository<DbIfrCompatibilityCheck> { protected table = "ifr_compatibility_checks"; }
export class IfrFrameworkFailureRepository extends OrgIfrRepository<DbIfrFrameworkFailure> { protected table = "ifr_framework_failures"; }
export class IfrAuditLogRepository extends OrgIfrRepository<DbIfrAuditLog> { protected table = "ifr_audit_logs"; }
