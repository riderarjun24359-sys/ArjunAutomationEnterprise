import type {
    DbSaasTenant,
    DbSaasRegistration,
    DbSaasTenantProfile,
    DbSaasDomainConfig,
    DbSaasEmailVerification,
    DbSaasTrial,
    DbSaasWorkspaceSetup,
    DbSaasTenantRoleProvision,
    DbSaasWelcomeExperience,
    DbSaasSubscription,
    DbSaasPlanLimit,
    DbSaasSubscriptionEvent,
    DbSaasLicense,
    DbSaasLicenseAllocation,
    DbSaasFeatureFlag,
    DbSaasPortalSetting,
    DbSaasPortalBranding,
    DbSaasPortalIntegration,
    DbSaasPortalApiKey,
    DbSaasUsageMeter,
    DbSaasUsageRecord,
    DbSaasCommercialInvoice,
    DbSaasBillingCredit,
    DbSaasBillingCoupon,
    DbSaasRecurringBilling,
    DbSaasTenantHealthScore,
    DbSaasOnboardingChecklist,
    DbSaasProductAdoption,
    DbSaasRenewalTracking,
    DbSaasSupportSummary,
    DbSaasAdminMetric,
    DbSaasAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgSaasRepository<T> extends BaseRepository<T> {
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

export class SaasTenantRepository extends OrgSaasRepository<DbSaasTenant> { protected table = "saas_tenants"; }
export class SaasRegistrationRepository extends OrgSaasRepository<DbSaasRegistration> { protected table = "saas_registrations"; }
export class SaasTenantProfileRepository extends OrgSaasRepository<DbSaasTenantProfile> { protected table = "saas_tenant_profiles"; }
export class SaasDomainConfigRepository extends OrgSaasRepository<DbSaasDomainConfig> { protected table = "saas_domain_configs"; }
export class SaasEmailVerificationRepository extends OrgSaasRepository<DbSaasEmailVerification> { protected table = "saas_email_verifications"; }
export class SaasTrialRepository extends OrgSaasRepository<DbSaasTrial> { protected table = "saas_trials"; }
export class SaasWorkspaceSetupRepository extends OrgSaasRepository<DbSaasWorkspaceSetup> { protected table = "saas_workspace_setups"; }
export class SaasTenantRoleProvisionRepository extends OrgSaasRepository<DbSaasTenantRoleProvision> { protected table = "saas_tenant_role_provisions"; }
export class SaasWelcomeExperienceRepository extends OrgSaasRepository<DbSaasWelcomeExperience> { protected table = "saas_welcome_experiences"; }
export class SaasSubscriptionRepository extends OrgSaasRepository<DbSaasSubscription> { protected table = "saas_subscriptions"; }
export class SaasPlanLimitRepository extends OrgSaasRepository<DbSaasPlanLimit> { protected table = "saas_plan_limits"; }
export class SaasSubscriptionEventRepository extends OrgSaasRepository<DbSaasSubscriptionEvent> { protected table = "saas_subscription_events"; }
export class SaasLicenseRepository extends OrgSaasRepository<DbSaasLicense> { protected table = "saas_licenses"; }
export class SaasLicenseAllocationRepository extends OrgSaasRepository<DbSaasLicenseAllocation> { protected table = "saas_license_allocations"; }
export class SaasFeatureFlagRepository extends OrgSaasRepository<DbSaasFeatureFlag> { protected table = "saas_feature_flags"; }
export class SaasPortalSettingRepository extends OrgSaasRepository<DbSaasPortalSetting> { protected table = "saas_portal_settings"; }
export class SaasPortalBrandingRepository extends OrgSaasRepository<DbSaasPortalBranding> { protected table = "saas_portal_branding"; }
export class SaasPortalIntegrationRepository extends OrgSaasRepository<DbSaasPortalIntegration> { protected table = "saas_portal_integrations"; }
export class SaasPortalApiKeyRepository extends OrgSaasRepository<DbSaasPortalApiKey> { protected table = "saas_portal_api_keys"; }
export class SaasUsageMeterRepository extends OrgSaasRepository<DbSaasUsageMeter> { protected table = "saas_usage_meters"; }
export class SaasUsageRecordRepository extends OrgSaasRepository<DbSaasUsageRecord> { protected table = "saas_usage_records"; }
export class SaasCommercialInvoiceRepository extends OrgSaasRepository<DbSaasCommercialInvoice> { protected table = "saas_commercial_invoices"; }
export class SaasBillingCreditRepository extends OrgSaasRepository<DbSaasBillingCredit> { protected table = "saas_billing_credits"; }
export class SaasBillingCouponRepository extends OrgSaasRepository<DbSaasBillingCoupon> { protected table = "saas_billing_coupons"; }
export class SaasRecurringBillingRepository extends OrgSaasRepository<DbSaasRecurringBilling> { protected table = "saas_recurring_billing"; }
export class SaasTenantHealthScoreRepository extends OrgSaasRepository<DbSaasTenantHealthScore> { protected table = "saas_tenant_health_scores"; }
export class SaasOnboardingChecklistRepository extends OrgSaasRepository<DbSaasOnboardingChecklist> { protected table = "saas_onboarding_checklists"; }
export class SaasProductAdoptionRepository extends OrgSaasRepository<DbSaasProductAdoption> { protected table = "saas_product_adoption"; }
export class SaasRenewalTrackingRepository extends OrgSaasRepository<DbSaasRenewalTracking> { protected table = "saas_renewal_tracking"; }
export class SaasSupportSummaryRepository extends OrgSaasRepository<DbSaasSupportSummary> { protected table = "saas_support_summaries"; }
export class SaasAdminMetricRepository extends OrgSaasRepository<DbSaasAdminMetric> { protected table = "saas_admin_metrics"; }
export class SaasAuditLogRepository extends OrgSaasRepository<DbSaasAuditLog> { protected table = "saas_audit_logs"; }
