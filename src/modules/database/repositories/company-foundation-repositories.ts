import type {
    DbCmpCompanyHub,
    DbCmpBrandProfile,
    DbCmpLogoAsset,
    DbCmpThemeConfig,
    DbCmpBrandAsset,
    DbCmpWebsitePage,
    DbCmpWebsiteFeature,
    DbCmpWebsiteSection,
    DbCmpDemoRequest,
    DbCmpPricingPlan,
    DbCmpPricingPackage,
    DbCmpModulePricing,
    DbCmpDiscountRule,
    DbCmpProposal,
    DbCmpProposalDocument,
    DbCmpProposalContract,
    DbCmpProposalHistory,
    DbCmpPortalDashboard,
    DbCmpPortalSubscription,
    DbCmpPortalBilling,
    DbCmpPortalSupport,
    DbCmpDocGuide,
    DbCmpDocApiReference,
    DbCmpDocVersion,
    DbCmpDemoOrganization,
    DbCmpDemoDataSet,
    DbCmpDemoUser,
    DbCmpCompanyMetric,
    DbCmpCompanyHealth,
    DbCmpExecutiveKpi,
    DbCmpCompanyFailure,
    DbCmpAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgCmpRepository<T> extends BaseRepository<T> {
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

export class CmpCompanyHubRepository extends OrgCmpRepository<DbCmpCompanyHub> { protected table = "cmp_company_hubs"; }
export class CmpBrandProfileRepository extends OrgCmpRepository<DbCmpBrandProfile> { protected table = "cmp_brand_profiles"; }
export class CmpLogoAssetRepository extends OrgCmpRepository<DbCmpLogoAsset> { protected table = "cmp_logo_assets"; }
export class CmpThemeConfigRepository extends OrgCmpRepository<DbCmpThemeConfig> { protected table = "cmp_theme_configs"; }
export class CmpBrandAssetRepository extends OrgCmpRepository<DbCmpBrandAsset> { protected table = "cmp_brand_assets"; }
export class CmpWebsitePageRepository extends OrgCmpRepository<DbCmpWebsitePage> { protected table = "cmp_website_pages"; }
export class CmpWebsiteFeatureRepository extends OrgCmpRepository<DbCmpWebsiteFeature> { protected table = "cmp_website_features"; }
export class CmpWebsiteSectionRepository extends OrgCmpRepository<DbCmpWebsiteSection> { protected table = "cmp_website_sections"; }
export class CmpDemoRequestRepository extends OrgCmpRepository<DbCmpDemoRequest> { protected table = "cmp_demo_requests"; }
export class CmpPricingPlanRepository extends OrgCmpRepository<DbCmpPricingPlan> { protected table = "cmp_pricing_plans"; }
export class CmpPricingPackageRepository extends OrgCmpRepository<DbCmpPricingPackage> { protected table = "cmp_pricing_packages"; }
export class CmpModulePricingRepository extends OrgCmpRepository<DbCmpModulePricing> { protected table = "cmp_module_pricing"; }
export class CmpDiscountRuleRepository extends OrgCmpRepository<DbCmpDiscountRule> { protected table = "cmp_discount_rules"; }
export class CmpProposalRepository extends OrgCmpRepository<DbCmpProposal> { protected table = "cmp_proposals"; }
export class CmpProposalDocumentRepository extends OrgCmpRepository<DbCmpProposalDocument> { protected table = "cmp_proposal_documents"; }
export class CmpProposalContractRepository extends OrgCmpRepository<DbCmpProposalContract> { protected table = "cmp_proposal_contracts"; }
export class CmpProposalHistoryRepository extends OrgCmpRepository<DbCmpProposalHistory> { protected table = "cmp_proposal_history"; }
export class CmpPortalDashboardRepository extends OrgCmpRepository<DbCmpPortalDashboard> { protected table = "cmp_portal_dashboards"; }
export class CmpPortalSubscriptionRepository extends OrgCmpRepository<DbCmpPortalSubscription> { protected table = "cmp_portal_subscriptions"; }
export class CmpPortalBillingRepository extends OrgCmpRepository<DbCmpPortalBilling> { protected table = "cmp_portal_billing"; }
export class CmpPortalSupportRepository extends OrgCmpRepository<DbCmpPortalSupport> { protected table = "cmp_portal_support"; }
export class CmpDocGuideRepository extends OrgCmpRepository<DbCmpDocGuide> { protected table = "cmp_doc_guides"; }
export class CmpDocApiReferenceRepository extends OrgCmpRepository<DbCmpDocApiReference> { protected table = "cmp_doc_api_references"; }
export class CmpDocVersionRepository extends OrgCmpRepository<DbCmpDocVersion> { protected table = "cmp_doc_versions"; }
export class CmpDemoOrganizationRepository extends OrgCmpRepository<DbCmpDemoOrganization> { protected table = "cmp_demo_organizations"; }
export class CmpDemoDataSetRepository extends OrgCmpRepository<DbCmpDemoDataSet> { protected table = "cmp_demo_data_sets"; }
export class CmpDemoUserRepository extends OrgCmpRepository<DbCmpDemoUser> { protected table = "cmp_demo_users"; }
export class CmpCompanyMetricRepository extends OrgCmpRepository<DbCmpCompanyMetric> { protected table = "cmp_company_metrics"; }
export class CmpCompanyHealthRepository extends OrgCmpRepository<DbCmpCompanyHealth> { protected table = "cmp_company_health"; }
export class CmpExecutiveKpiRepository extends OrgCmpRepository<DbCmpExecutiveKpi> { protected table = "cmp_executive_kpis"; }
export class CmpCompanyFailureRepository extends OrgCmpRepository<DbCmpCompanyFailure> { protected table = "cmp_company_failures"; }
export class CmpAuditLogRepository extends OrgCmpRepository<DbCmpAuditLog> { protected table = "cmp_audit_logs"; }
