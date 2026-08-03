import {
    buildAdminMetricPayload,
    buildSaasAuditPayload,
    buildSaasDashboardStats,
    buildSaasPipelineInfo,
    buildTenantLookupMaps,
    buildTenantPayload,
    mapAdminMetricSummary,
    mapAuditEntry,
    mapTenantSummary,
    mapRegistrationSummary,
    buildRegistrationPayload,
    mapTenantProfileSummary,
    buildTenantProfilePayload,
    mapDomainConfigSummary,
    buildDomainConfigPayload,
    mapEmailVerificationSummary,
    buildEmailVerificationPayload,
    mapTrialSummary,
    buildTrialPayload,
    mapWorkspaceSetupSummary,
    buildWorkspaceSetupPayload,
    mapTenantRoleProvisionSummary,
    buildTenantRoleProvisionPayload,
    mapWelcomeExperienceSummary,
    buildWelcomeExperiencePayload,
    mapSubscriptionSummary,
    buildSubscriptionPayload,
    mapPlanLimitSummary,
    buildPlanLimitPayload,
    mapSubscriptionEventSummary,
    buildSubscriptionEventPayload,
    mapLicenseSummary,
    buildLicensePayload,
    mapLicenseAllocationSummary,
    buildLicenseAllocationPayload,
    mapFeatureFlagSummary,
    buildFeatureFlagPayload,
    mapPortalSettingSummary,
    buildPortalSettingPayload,
    mapPortalBrandingSummary,
    buildPortalBrandingPayload,
    mapPortalIntegrationSummary,
    buildPortalIntegrationPayload,
    mapPortalApiKeySummary,
    buildPortalApiKeyPayload,
    mapUsageMeterSummary,
    buildUsageMeterPayload,
    mapUsageRecordSummary,
    buildUsageRecordPayload,
    mapCommercialInvoiceSummary,
    buildCommercialInvoicePayload,
    mapBillingCreditSummary,
    buildBillingCreditPayload,
    mapBillingCouponSummary,
    buildBillingCouponPayload,
    mapRecurringBillingSummary,
    buildRecurringBillingPayload,
    mapTenantHealthScoreSummary,
    buildTenantHealthScorePayload,
    mapOnboardingChecklistSummary,
    buildOnboardingChecklistPayload,
    mapProductAdoptionSummary,
    buildProductAdoptionPayload,
    mapRenewalTrackingSummary,
    buildRenewalTrackingPayload,
    mapSupportSummarySummary,
    buildSupportSummaryPayload,
} from "@/src/modules/database/lib/commercial-saas-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    AdminMetricSummary,
    AuditEntry,
    CreateAdminMetricInput,
    CreateTenantInput,
    SaasDashboardStats,
    SaasPipelineInfo,
    SaasSdkManageSubscriptionInput,
    SaasSdkManageSubscriptionResult,
    SaasSdkRegisterTenantInput,
    SaasSdkRegisterTenantResult,
    SaasSdkTrackUsageInput,
    SaasSdkTrackUsageResult,
    TenantSummary,
    CreateRegistrationInput,
    RegistrationSummary,
    CreateTenantProfileInput,
    TenantProfileSummary,
    CreateDomainConfigInput,
    DomainConfigSummary,
    CreateEmailVerificationInput,
    EmailVerificationSummary,
    CreateTrialInput,
    TrialSummary,
    CreateWorkspaceSetupInput,
    WorkspaceSetupSummary,
    CreateTenantRoleProvisionInput,
    TenantRoleProvisionSummary,
    CreateWelcomeExperienceInput,
    WelcomeExperienceSummary,
    CreateSubscriptionInput,
    SubscriptionSummary,
    CreatePlanLimitInput,
    PlanLimitSummary,
    CreateSubscriptionEventInput,
    SubscriptionEventSummary,
    CreateLicenseInput,
    LicenseSummary,
    CreateLicenseAllocationInput,
    LicenseAllocationSummary,
    CreateFeatureFlagInput,
    FeatureFlagSummary,
    CreatePortalSettingInput,
    PortalSettingSummary,
    CreatePortalBrandingInput,
    PortalBrandingSummary,
    CreatePortalIntegrationInput,
    PortalIntegrationSummary,
    CreatePortalApiKeyInput,
    PortalApiKeySummary,
    CreateUsageMeterInput,
    UsageMeterSummary,
    CreateUsageRecordInput,
    UsageRecordSummary,
    CreateCommercialInvoiceInput,
    CommercialInvoiceSummary,
    CreateBillingCreditInput,
    BillingCreditSummary,
    CreateBillingCouponInput,
    BillingCouponSummary,
    CreateRecurringBillingInput,
    RecurringBillingSummary,
    CreateTenantHealthScoreInput,
    TenantHealthScoreSummary,
    CreateOnboardingChecklistInput,
    OnboardingChecklistSummary,
    CreateProductAdoptionInput,
    ProductAdoptionSummary,
    CreateRenewalTrackingInput,
    RenewalTrackingSummary,
    CreateSupportSummaryInput,
    SupportSummarySummary,
} from "@/src/modules/commercial-saas/types";

export class CommercialSaasService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const tenants = await databaseService.saasTenants.listByOrganization(organizationId);
        return buildTenantLookupMaps(tenants);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<SaasDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildSaasDashboardStats({ tenants: [], subscriptions: [], licenses: [], usageMeters: [], invoices: [], registrations: [], featureFlags: [], portalApiKeys: [], renewals: [], adminMetrics: [], healthScores: [], auditLogs: [] });
        const [tenants, subscriptions, licenses, usageMeters, invoices, registrations, featureFlags, portalApiKeys, renewals, adminMetrics, healthScores, auditLogs] = await Promise.all([
            this.getTenants(authUserId, email, fullName),
            this.getSubscriptions(authUserId, email, fullName),
            this.getLicenses(authUserId, email, fullName),
            this.getUsageMeters(authUserId, email, fullName),
            this.getCommercialInvoices(authUserId, email, fullName),
            this.getRegistrations(authUserId, email, fullName),
            this.getFeatureFlags(authUserId, email, fullName),
            this.getPortalApiKeys(authUserId, email, fullName),
            this.getRenewalTrackings(authUserId, email, fullName),
            this.getAdminMetrics(authUserId, email, fullName),
            this.getTenantHealthScores(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildSaasDashboardStats({
            tenants,
            subscriptions: subscriptions.map((s) => ({ planTier: String(s.planTier), amountUsd: Number(s.amountUsd ?? 0), status: s.status })),
            licenses,
            usageMeters,
            invoices,
            registrations,
            featureFlags,
            portalApiKeys,
            renewals,
            adminMetrics,
            healthScores: healthScores.map((h) => ({ overallScore: Number(h.overallScore) })),
            auditLogs,
        });
    }

    getPipelineInfo(): SaasPipelineInfo {
        return buildSaasPipelineInfo();
    }

    async getTenants(authUserId: string, email: string, fullName?: string | null): Promise<TenantSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saasTenants.listByOrganization(context.organizationId)).map(mapTenantSummary);
    }

    async createTenant(authUserId: string, email: string, input: CreateTenantInput, fullName?: string | null): Promise<TenantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasTenants.create(buildTenantPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tenant");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant", "create", `Tenant ${created.company_name} created`, created.id));
        return mapTenantSummary(created);
    }

    async updateTenant(authUserId: string, email: string, id: string, input: Partial<CreateTenantInput>, fullName?: string | null): Promise<TenantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.saasTenants.update(id, {
            ...(input.companyName ? { company_name: input.companyName } : {}),
            ...(input.currentPlan ? { current_plan: input.currentPlan } : {}),
            ...(input.domainSlug ? { domain_slug: input.domainSlug } : {}),
            ...(input.summary !== undefined ? { summary: input.summary } : {}),
        });
        if (!updated) throw new Error("Failed to update tenant");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant", "update", `Tenant ${updated.company_name} updated`, updated.id));
        return mapTenantSummary(updated);
    }

    async deleteTenant(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasTenants.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant", "delete", "Tenant deleted", id, "elevated"));
        return ok;
    }

    async getRegistrations(authUserId: string, email: string, fullName?: string | null): Promise<RegistrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasRegistrations.listByOrganization(context.organizationId)).map((r) => mapRegistrationSummary(r, maps));
    }

    async createRegistration(authUserId: string, email: string, input: CreateRegistrationInput, fullName?: string | null): Promise<RegistrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasRegistrations.create(buildRegistrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create registrations");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "registration", "create", `Registration created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapRegistrationSummary(created, maps);
    }

    async updateRegistration(authUserId: string, email: string, id: string, input: Partial<CreateRegistrationInput>, fullName?: string | null): Promise<RegistrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.registrationKey !== undefined) patch.registration_key = input.registrationKey;
        if (input.companyName !== undefined) patch.company_name = input.companyName;
        if (input.ownerEmail !== undefined) patch.owner_email = input.ownerEmail;
        if (input.ownerName !== undefined) patch.owner_name = input.ownerName;
        const updated = await databaseService.saasRegistrations.update(id, patch);
        if (!updated) throw new Error("Failed to update registrations");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "registration", "update", `Registration updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRegistrationSummary(updated, maps);
    }

    async deleteRegistration(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasRegistrations.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "registration", "delete", `Registration deleted`, id, "elevated"));
        return ok;
    }

    async getTenantProfiles(authUserId: string, email: string, fullName?: string | null): Promise<TenantProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasTenantProfiles.listByOrganization(context.organizationId)).map((r) => mapTenantProfileSummary(r, maps));
    }

    async createTenantProfile(authUserId: string, email: string, input: CreateTenantProfileInput, fullName?: string | null): Promise<TenantProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasTenantProfiles.create(buildTenantProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tenantProfiles");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_profile", "create", `TenantProfile created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantProfileSummary(created, maps);
    }

    async updateTenantProfile(authUserId: string, email: string, id: string, input: Partial<CreateTenantProfileInput>, fullName?: string | null): Promise<TenantProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.profileKey !== undefined) patch.profile_key = input.profileKey;
        if (input.legalName !== undefined) patch.legal_name = input.legalName;
        if (input.industry !== undefined) patch.industry = input.industry;
        if (input.billingEmail !== undefined) patch.billing_email = input.billingEmail;
        const updated = await databaseService.saasTenantProfiles.update(id, patch);
        if (!updated) throw new Error("Failed to update tenantProfiles");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_profile", "update", `TenantProfile updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantProfileSummary(updated, maps);
    }

    async deleteTenantProfile(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasTenantProfiles.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_profile", "delete", `TenantProfile deleted`, id, "elevated"));
        return ok;
    }

    async getDomainConfigs(authUserId: string, email: string, fullName?: string | null): Promise<DomainConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasDomainConfigs.listByOrganization(context.organizationId)).map((r) => mapDomainConfigSummary(r, maps));
    }

    async createDomainConfig(authUserId: string, email: string, input: CreateDomainConfigInput, fullName?: string | null): Promise<DomainConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasDomainConfigs.create(buildDomainConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create domainConfigs");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "domain_config", "create", `DomainConfig created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapDomainConfigSummary(created, maps);
    }

    async updateDomainConfig(authUserId: string, email: string, id: string, input: Partial<CreateDomainConfigInput>, fullName?: string | null): Promise<DomainConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.domainKey !== undefined) patch.domain_key = input.domainKey;
        if (input.subdomain !== undefined) patch.subdomain = input.subdomain;
        if (input.customDomain !== undefined) patch.custom_domain = input.customDomain;
        const updated = await databaseService.saasDomainConfigs.update(id, patch);
        if (!updated) throw new Error("Failed to update domainConfigs");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "domain_config", "update", `DomainConfig updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDomainConfigSummary(updated, maps);
    }

    async deleteDomainConfig(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasDomainConfigs.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "domain_config", "delete", `DomainConfig deleted`, id, "elevated"));
        return ok;
    }

    async getEmailVerifications(authUserId: string, email: string, fullName?: string | null): Promise<EmailVerificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasEmailVerifications.listByOrganization(context.organizationId)).map((r) => mapEmailVerificationSummary(r, maps));
    }

    async createEmailVerification(authUserId: string, email: string, input: CreateEmailVerificationInput, fullName?: string | null): Promise<EmailVerificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasEmailVerifications.create(buildEmailVerificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create emailVerifications");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "email_verification", "create", `EmailVerification created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapEmailVerificationSummary(created, maps);
    }

    async updateEmailVerification(authUserId: string, email: string, id: string, input: Partial<CreateEmailVerificationInput>, fullName?: string | null): Promise<EmailVerificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.verificationKey !== undefined) patch.verification_key = input.verificationKey;
        if (input.email !== undefined) patch.email = input.email;
        const updated = await databaseService.saasEmailVerifications.update(id, patch);
        if (!updated) throw new Error("Failed to update emailVerifications");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "email_verification", "update", `EmailVerification updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEmailVerificationSummary(updated, maps);
    }

    async deleteEmailVerification(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasEmailVerifications.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "email_verification", "delete", `EmailVerification deleted`, id, "elevated"));
        return ok;
    }

    async getTrials(authUserId: string, email: string, fullName?: string | null): Promise<TrialSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasTrials.listByOrganization(context.organizationId)).map((r) => mapTrialSummary(r, maps));
    }

    async createTrial(authUserId: string, email: string, input: CreateTrialInput, fullName?: string | null): Promise<TrialSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasTrials.create(buildTrialPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create trials");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "trial", "create", `Trial created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapTrialSummary(created, maps);
    }

    async updateTrial(authUserId: string, email: string, id: string, input: Partial<CreateTrialInput>, fullName?: string | null): Promise<TrialSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.trialKey !== undefined) patch.trial_key = input.trialKey;
        if (input.planTier !== undefined) patch.plan_tier = input.planTier;
        const updated = await databaseService.saasTrials.update(id, patch);
        if (!updated) throw new Error("Failed to update trials");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "trial", "update", `Trial updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTrialSummary(updated, maps);
    }

    async deleteTrial(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasTrials.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "trial", "delete", `Trial deleted`, id, "elevated"));
        return ok;
    }

    async getWorkspaceSetups(authUserId: string, email: string, fullName?: string | null): Promise<WorkspaceSetupSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasWorkspaceSetups.listByOrganization(context.organizationId)).map((r) => mapWorkspaceSetupSummary(r, maps));
    }

    async createWorkspaceSetup(authUserId: string, email: string, input: CreateWorkspaceSetupInput, fullName?: string | null): Promise<WorkspaceSetupSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasWorkspaceSetups.create(buildWorkspaceSetupPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workspaceSetups");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "workspace_setup", "create", `WorkspaceSetup created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkspaceSetupSummary(created, maps);
    }

    async updateWorkspaceSetup(authUserId: string, email: string, id: string, input: Partial<CreateWorkspaceSetupInput>, fullName?: string | null): Promise<WorkspaceSetupSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.setupKey !== undefined) patch.setup_key = input.setupKey;
        if (input.workspaceName !== undefined) patch.workspace_name = input.workspaceName;
        const updated = await databaseService.saasWorkspaceSetups.update(id, patch);
        if (!updated) throw new Error("Failed to update workspaceSetups");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "workspace_setup", "update", `WorkspaceSetup updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkspaceSetupSummary(updated, maps);
    }

    async deleteWorkspaceSetup(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasWorkspaceSetups.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "workspace_setup", "delete", `WorkspaceSetup deleted`, id, "elevated"));
        return ok;
    }

    async getTenantRoleProvisions(authUserId: string, email: string, fullName?: string | null): Promise<TenantRoleProvisionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasTenantRoleProvisions.listByOrganization(context.organizationId)).map((r) => mapTenantRoleProvisionSummary(r, maps));
    }

    async createTenantRoleProvision(authUserId: string, email: string, input: CreateTenantRoleProvisionInput, fullName?: string | null): Promise<TenantRoleProvisionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasTenantRoleProvisions.create(buildTenantRoleProvisionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create roleProvisions");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_role_provision", "create", `TenantRoleProvision created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantRoleProvisionSummary(created, maps);
    }

    async updateTenantRoleProvision(authUserId: string, email: string, id: string, input: Partial<CreateTenantRoleProvisionInput>, fullName?: string | null): Promise<TenantRoleProvisionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.provisionKey !== undefined) patch.provision_key = input.provisionKey;
        if (input.roleName !== undefined) patch.role_name = input.roleName;
        const updated = await databaseService.saasTenantRoleProvisions.update(id, patch);
        if (!updated) throw new Error("Failed to update roleProvisions");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_role_provision", "update", `TenantRoleProvision updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantRoleProvisionSummary(updated, maps);
    }

    async deleteTenantRoleProvision(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasTenantRoleProvisions.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_role_provision", "delete", `TenantRoleProvision deleted`, id, "elevated"));
        return ok;
    }

    async getWelcomeExperiences(authUserId: string, email: string, fullName?: string | null): Promise<WelcomeExperienceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasWelcomeExperiences.listByOrganization(context.organizationId)).map((r) => mapWelcomeExperienceSummary(r, maps));
    }

    async createWelcomeExperience(authUserId: string, email: string, input: CreateWelcomeExperienceInput, fullName?: string | null): Promise<WelcomeExperienceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasWelcomeExperiences.create(buildWelcomeExperiencePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create welcomeExperiences");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "welcome_experience", "create", `WelcomeExperience created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapWelcomeExperienceSummary(created, maps);
    }

    async updateWelcomeExperience(authUserId: string, email: string, id: string, input: Partial<CreateWelcomeExperienceInput>, fullName?: string | null): Promise<WelcomeExperienceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.experienceKey !== undefined) patch.experience_key = input.experienceKey;
        if (input.title !== undefined) patch.title = input.title;
        const updated = await databaseService.saasWelcomeExperiences.update(id, patch);
        if (!updated) throw new Error("Failed to update welcomeExperiences");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "welcome_experience", "update", `WelcomeExperience updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWelcomeExperienceSummary(updated, maps);
    }

    async deleteWelcomeExperience(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasWelcomeExperiences.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "welcome_experience", "delete", `WelcomeExperience deleted`, id, "elevated"));
        return ok;
    }

    async getSubscriptions(authUserId: string, email: string, fullName?: string | null): Promise<SubscriptionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasSubscriptions.listByOrganization(context.organizationId)).map((r) => mapSubscriptionSummary(r, maps));
    }

    async createSubscription(authUserId: string, email: string, input: CreateSubscriptionInput, fullName?: string | null): Promise<SubscriptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasSubscriptions.create(buildSubscriptionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create subscriptions");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "subscription", "create", `Subscription created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapSubscriptionSummary(created, maps);
    }

    async updateSubscription(authUserId: string, email: string, id: string, input: Partial<CreateSubscriptionInput>, fullName?: string | null): Promise<SubscriptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.subscriptionKey !== undefined) patch.subscription_key = input.subscriptionKey;
        if (input.planTier !== undefined) patch.plan_tier = input.planTier;
        if (input.billingCycle !== undefined) patch.billing_cycle = input.billingCycle;
        if (input.amountUsd !== undefined) patch.amount_usd = input.amountUsd;
        const updated = await databaseService.saasSubscriptions.update(id, patch);
        if (!updated) throw new Error("Failed to update subscriptions");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "subscription", "update", `Subscription updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSubscriptionSummary(updated, maps);
    }

    async deleteSubscription(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasSubscriptions.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "subscription", "delete", `Subscription deleted`, id, "elevated"));
        return ok;
    }

    async getPlanLimits(authUserId: string, email: string, fullName?: string | null): Promise<PlanLimitSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasPlanLimits.listByOrganization(context.organizationId)).map((r) => mapPlanLimitSummary(r, maps));
    }

    async createPlanLimit(authUserId: string, email: string, input: CreatePlanLimitInput, fullName?: string | null): Promise<PlanLimitSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasPlanLimits.create(buildPlanLimitPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create planLimits");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "plan_limit", "create", `PlanLimit created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapPlanLimitSummary(created, maps);
    }

    async updatePlanLimit(authUserId: string, email: string, id: string, input: Partial<CreatePlanLimitInput>, fullName?: string | null): Promise<PlanLimitSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.limitKey !== undefined) patch.limit_key = input.limitKey;
        if (input.planTier !== undefined) patch.plan_tier = input.planTier;
        if (input.resourceType !== undefined) patch.resource_type = input.resourceType;
        if (input.limitValue !== undefined) patch.limit_value = input.limitValue;
        const updated = await databaseService.saasPlanLimits.update(id, patch);
        if (!updated) throw new Error("Failed to update planLimits");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "plan_limit", "update", `PlanLimit updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlanLimitSummary(updated, maps);
    }

    async deletePlanLimit(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasPlanLimits.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "plan_limit", "delete", `PlanLimit deleted`, id, "elevated"));
        return ok;
    }

    async getSubscriptionEvents(authUserId: string, email: string, fullName?: string | null): Promise<SubscriptionEventSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasSubscriptionEvents.listByOrganization(context.organizationId)).map((r) => mapSubscriptionEventSummary(r, maps));
    }

    async createSubscriptionEvent(authUserId: string, email: string, input: CreateSubscriptionEventInput, fullName?: string | null): Promise<SubscriptionEventSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasSubscriptionEvents.create(buildSubscriptionEventPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create subscriptionEvents");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "subscription_event", "create", `SubscriptionEvent created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapSubscriptionEventSummary(created, maps);
    }

    async updateSubscriptionEvent(authUserId: string, email: string, id: string, input: Partial<CreateSubscriptionEventInput>, fullName?: string | null): Promise<SubscriptionEventSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.eventKey !== undefined) patch.event_key = input.eventKey;
        if (input.eventType !== undefined) patch.event_type = input.eventType;
        if (input.fromPlan !== undefined) patch.from_plan = input.fromPlan;
        if (input.toPlan !== undefined) patch.to_plan = input.toPlan;
        const updated = await databaseService.saasSubscriptionEvents.update(id, patch);
        if (!updated) throw new Error("Failed to update subscriptionEvents");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "subscription_event", "update", `SubscriptionEvent updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSubscriptionEventSummary(updated, maps);
    }

    async deleteSubscriptionEvent(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasSubscriptionEvents.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "subscription_event", "delete", `SubscriptionEvent deleted`, id, "elevated"));
        return ok;
    }

    async getLicenses(authUserId: string, email: string, fullName?: string | null): Promise<LicenseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasLicenses.listByOrganization(context.organizationId)).map((r) => mapLicenseSummary(r, maps));
    }

    async createLicense(authUserId: string, email: string, input: CreateLicenseInput, fullName?: string | null): Promise<LicenseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasLicenses.create(buildLicensePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create licenses");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "license", "create", `License created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapLicenseSummary(created, maps);
    }

    async updateLicense(authUserId: string, email: string, id: string, input: Partial<CreateLicenseInput>, fullName?: string | null): Promise<LicenseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.licenseKey !== undefined) patch.license_key = input.licenseKey;
        if (input.name !== undefined) patch.name = input.name;
        if (input.licenseType !== undefined) patch.license_type = input.licenseType;
        if (input.totalUnits !== undefined) patch.total_units = input.totalUnits;
        const updated = await databaseService.saasLicenses.update(id, patch);
        if (!updated) throw new Error("Failed to update licenses");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "license", "update", `License updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLicenseSummary(updated, maps);
    }

    async deleteLicense(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasLicenses.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "license", "delete", `License deleted`, id, "elevated"));
        return ok;
    }

    async getLicenseAllocations(authUserId: string, email: string, fullName?: string | null): Promise<LicenseAllocationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasLicenseAllocations.listByOrganization(context.organizationId)).map((r) => mapLicenseAllocationSummary(r, maps));
    }

    async createLicenseAllocation(authUserId: string, email: string, input: CreateLicenseAllocationInput, fullName?: string | null): Promise<LicenseAllocationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasLicenseAllocations.create(buildLicenseAllocationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create licenseAllocations");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "license_allocation", "create", `LicenseAllocation created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapLicenseAllocationSummary(created, maps);
    }

    async updateLicenseAllocation(authUserId: string, email: string, id: string, input: Partial<CreateLicenseAllocationInput>, fullName?: string | null): Promise<LicenseAllocationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.allocationKey !== undefined) patch.allocation_key = input.allocationKey;
        if (input.resourceName !== undefined) patch.resource_name = input.resourceName;
        if (input.resourceType !== undefined) patch.resource_type = input.resourceType;
        if (input.allocatedUnits !== undefined) patch.allocated_units = input.allocatedUnits;
        const updated = await databaseService.saasLicenseAllocations.update(id, patch);
        if (!updated) throw new Error("Failed to update licenseAllocations");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "license_allocation", "update", `LicenseAllocation updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLicenseAllocationSummary(updated, maps);
    }

    async deleteLicenseAllocation(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasLicenseAllocations.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "license_allocation", "delete", `LicenseAllocation deleted`, id, "elevated"));
        return ok;
    }

    async getFeatureFlags(authUserId: string, email: string, fullName?: string | null): Promise<FeatureFlagSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasFeatureFlags.listByOrganization(context.organizationId)).map((r) => mapFeatureFlagSummary(r, maps));
    }

    async createFeatureFlag(authUserId: string, email: string, input: CreateFeatureFlagInput, fullName?: string | null): Promise<FeatureFlagSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasFeatureFlags.create(buildFeatureFlagPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create featureFlags");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "feature_flag", "create", `FeatureFlag created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapFeatureFlagSummary(created, maps);
    }

    async updateFeatureFlag(authUserId: string, email: string, id: string, input: Partial<CreateFeatureFlagInput>, fullName?: string | null): Promise<FeatureFlagSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.flagKey !== undefined) patch.flag_key = input.flagKey;
        if (input.name !== undefined) patch.name = input.name;
        if (input.moduleSource !== undefined) patch.module_source = input.moduleSource;
        const updated = await databaseService.saasFeatureFlags.update(id, patch);
        if (!updated) throw new Error("Failed to update featureFlags");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "feature_flag", "update", `FeatureFlag updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeatureFlagSummary(updated, maps);
    }

    async deleteFeatureFlag(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasFeatureFlags.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "feature_flag", "delete", `FeatureFlag deleted`, id, "elevated"));
        return ok;
    }

    async getPortalSettings(authUserId: string, email: string, fullName?: string | null): Promise<PortalSettingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasPortalSettings.listByOrganization(context.organizationId)).map((r) => mapPortalSettingSummary(r, maps));
    }

    async createPortalSetting(authUserId: string, email: string, input: CreatePortalSettingInput, fullName?: string | null): Promise<PortalSettingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasPortalSettings.create(buildPortalSettingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create portalSettings");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_setting", "create", `PortalSetting created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalSettingSummary(created, maps);
    }

    async updatePortalSetting(authUserId: string, email: string, id: string, input: Partial<CreatePortalSettingInput>, fullName?: string | null): Promise<PortalSettingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.settingsKey !== undefined) patch.settings_key = input.settingsKey;
        if (input.portalName !== undefined) patch.portal_name = input.portalName;
        const updated = await databaseService.saasPortalSettings.update(id, patch);
        if (!updated) throw new Error("Failed to update portalSettings");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_setting", "update", `PortalSetting updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalSettingSummary(updated, maps);
    }

    async deletePortalSetting(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasPortalSettings.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_setting", "delete", `PortalSetting deleted`, id, "elevated"));
        return ok;
    }

    async getPortalBrandings(authUserId: string, email: string, fullName?: string | null): Promise<PortalBrandingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasPortalBranding.listByOrganization(context.organizationId)).map((r) => mapPortalBrandingSummary(r, maps));
    }

    async createPortalBranding(authUserId: string, email: string, input: CreatePortalBrandingInput, fullName?: string | null): Promise<PortalBrandingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasPortalBranding.create(buildPortalBrandingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create portalBranding");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_branding", "create", `PortalBranding created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalBrandingSummary(created, maps);
    }

    async updatePortalBranding(authUserId: string, email: string, id: string, input: Partial<CreatePortalBrandingInput>, fullName?: string | null): Promise<PortalBrandingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.brandingKey !== undefined) patch.branding_key = input.brandingKey;
        if (input.primaryColor !== undefined) patch.primary_color = input.primaryColor;
        if (input.accentColor !== undefined) patch.accent_color = input.accentColor;
        const updated = await databaseService.saasPortalBranding.update(id, patch);
        if (!updated) throw new Error("Failed to update portalBranding");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_branding", "update", `PortalBranding updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalBrandingSummary(updated, maps);
    }

    async deletePortalBranding(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasPortalBranding.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_branding", "delete", `PortalBranding deleted`, id, "elevated"));
        return ok;
    }

    async getPortalIntegrations(authUserId: string, email: string, fullName?: string | null): Promise<PortalIntegrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasPortalIntegrations.listByOrganization(context.organizationId)).map((r) => mapPortalIntegrationSummary(r, maps));
    }

    async createPortalIntegration(authUserId: string, email: string, input: CreatePortalIntegrationInput, fullName?: string | null): Promise<PortalIntegrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasPortalIntegrations.create(buildPortalIntegrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create portalIntegrations");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_integration", "create", `PortalIntegration created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalIntegrationSummary(created, maps);
    }

    async updatePortalIntegration(authUserId: string, email: string, id: string, input: Partial<CreatePortalIntegrationInput>, fullName?: string | null): Promise<PortalIntegrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.integrationKey !== undefined) patch.integration_key = input.integrationKey;
        if (input.provider !== undefined) patch.provider = input.provider;
        const updated = await databaseService.saasPortalIntegrations.update(id, patch);
        if (!updated) throw new Error("Failed to update portalIntegrations");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_integration", "update", `PortalIntegration updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalIntegrationSummary(updated, maps);
    }

    async deletePortalIntegration(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasPortalIntegrations.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_integration", "delete", `PortalIntegration deleted`, id, "elevated"));
        return ok;
    }

    async getPortalApiKeys(authUserId: string, email: string, fullName?: string | null): Promise<PortalApiKeySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasPortalApiKeys.listByOrganization(context.organizationId)).map((r) => mapPortalApiKeySummary(r, maps));
    }

    async createPortalApiKey(authUserId: string, email: string, input: CreatePortalApiKeyInput, fullName?: string | null): Promise<PortalApiKeySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasPortalApiKeys.create(buildPortalApiKeyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create portalApiKeys");
        const security = "elevated";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_api_key", "create", `PortalApiKey created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalApiKeySummary(created, maps);
    }

    async updatePortalApiKey(authUserId: string, email: string, id: string, input: Partial<CreatePortalApiKeyInput>, fullName?: string | null): Promise<PortalApiKeySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.keyName !== undefined) patch.key_name = input.keyName;
        const updated = await databaseService.saasPortalApiKeys.update(id, patch);
        if (!updated) throw new Error("Failed to update portalApiKeys");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_api_key", "update", `PortalApiKey updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalApiKeySummary(updated, maps);
    }

    async deletePortalApiKey(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasPortalApiKeys.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "portal_api_key", "delete", `PortalApiKey deleted`, id, "elevated"));
        return ok;
    }

    async getUsageMeters(authUserId: string, email: string, fullName?: string | null): Promise<UsageMeterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasUsageMeters.listByOrganization(context.organizationId)).map((r) => mapUsageMeterSummary(r, maps));
    }

    async createUsageMeter(authUserId: string, email: string, input: CreateUsageMeterInput, fullName?: string | null): Promise<UsageMeterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasUsageMeters.create(buildUsageMeterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create usageMeters");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "usage_meter", "create", `UsageMeter created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapUsageMeterSummary(created, maps);
    }

    async updateUsageMeter(authUserId: string, email: string, id: string, input: Partial<CreateUsageMeterInput>, fullName?: string | null): Promise<UsageMeterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.meterKey !== undefined) patch.meter_key = input.meterKey;
        if (input.meterType !== undefined) patch.meter_type = input.meterType;
        if (input.unitLabel !== undefined) patch.unit_label = input.unitLabel;
        const updated = await databaseService.saasUsageMeters.update(id, patch);
        if (!updated) throw new Error("Failed to update usageMeters");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "usage_meter", "update", `UsageMeter updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUsageMeterSummary(updated, maps);
    }

    async deleteUsageMeter(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasUsageMeters.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "usage_meter", "delete", `UsageMeter deleted`, id, "elevated"));
        return ok;
    }

    async getUsageRecords(authUserId: string, email: string, fullName?: string | null): Promise<UsageRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasUsageRecords.listByOrganization(context.organizationId)).map((r) => mapUsageRecordSummary(r, maps));
    }

    async createUsageRecord(authUserId: string, email: string, input: CreateUsageRecordInput, fullName?: string | null): Promise<UsageRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasUsageRecords.create(buildUsageRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create usageRecords");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "usage_record", "create", `UsageRecord created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapUsageRecordSummary(created, maps);
    }

    async updateUsageRecord(authUserId: string, email: string, id: string, input: Partial<CreateUsageRecordInput>, fullName?: string | null): Promise<UsageRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.recordKey !== undefined) patch.record_key = input.recordKey;
        if (input.meterType !== undefined) patch.meter_type = input.meterType;
        if (input.quantity !== undefined) patch.quantity = input.quantity;
        const updated = await databaseService.saasUsageRecords.update(id, patch);
        if (!updated) throw new Error("Failed to update usageRecords");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "usage_record", "update", `UsageRecord updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUsageRecordSummary(updated, maps);
    }

    async deleteUsageRecord(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasUsageRecords.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "usage_record", "delete", `UsageRecord deleted`, id, "elevated"));
        return ok;
    }

    async getCommercialInvoices(authUserId: string, email: string, fullName?: string | null): Promise<CommercialInvoiceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasCommercialInvoices.listByOrganization(context.organizationId)).map((r) => mapCommercialInvoiceSummary(r, maps));
    }

    async createCommercialInvoice(authUserId: string, email: string, input: CreateCommercialInvoiceInput, fullName?: string | null): Promise<CommercialInvoiceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasCommercialInvoices.create(buildCommercialInvoicePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create invoices");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "commercial_invoice", "create", `CommercialInvoice created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapCommercialInvoiceSummary(created, maps);
    }

    async updateCommercialInvoice(authUserId: string, email: string, id: string, input: Partial<CreateCommercialInvoiceInput>, fullName?: string | null): Promise<CommercialInvoiceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.invoiceKey !== undefined) patch.invoice_key = input.invoiceKey;
        if (input.invoiceNumber !== undefined) patch.invoice_number = input.invoiceNumber;
        if (input.amountUsd !== undefined) patch.amount_usd = input.amountUsd;
        const updated = await databaseService.saasCommercialInvoices.update(id, patch);
        if (!updated) throw new Error("Failed to update invoices");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "commercial_invoice", "update", `CommercialInvoice updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCommercialInvoiceSummary(updated, maps);
    }

    async deleteCommercialInvoice(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasCommercialInvoices.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "commercial_invoice", "delete", `CommercialInvoice deleted`, id, "elevated"));
        return ok;
    }

    async getBillingCredits(authUserId: string, email: string, fullName?: string | null): Promise<BillingCreditSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasBillingCredits.listByOrganization(context.organizationId)).map((r) => mapBillingCreditSummary(r, maps));
    }

    async createBillingCredit(authUserId: string, email: string, input: CreateBillingCreditInput, fullName?: string | null): Promise<BillingCreditSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasBillingCredits.create(buildBillingCreditPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create billingCredits");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "billing_credit", "create", `BillingCredit created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapBillingCreditSummary(created, maps);
    }

    async updateBillingCredit(authUserId: string, email: string, id: string, input: Partial<CreateBillingCreditInput>, fullName?: string | null): Promise<BillingCreditSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.creditKey !== undefined) patch.credit_key = input.creditKey;
        if (input.reason !== undefined) patch.reason = input.reason;
        if (input.balanceUsd !== undefined) patch.balance_usd = input.balanceUsd;
        const updated = await databaseService.saasBillingCredits.update(id, patch);
        if (!updated) throw new Error("Failed to update billingCredits");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "billing_credit", "update", `BillingCredit updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBillingCreditSummary(updated, maps);
    }

    async deleteBillingCredit(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasBillingCredits.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "billing_credit", "delete", `BillingCredit deleted`, id, "elevated"));
        return ok;
    }

    async getBillingCoupons(authUserId: string, email: string, fullName?: string | null): Promise<BillingCouponSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasBillingCoupons.listByOrganization(context.organizationId)).map((r) => mapBillingCouponSummary(r, maps));
    }

    async createBillingCoupon(authUserId: string, email: string, input: CreateBillingCouponInput, fullName?: string | null): Promise<BillingCouponSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasBillingCoupons.create(buildBillingCouponPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create billingCoupons");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "billing_coupon", "create", `BillingCoupon created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapBillingCouponSummary(created, maps);
    }

    async updateBillingCoupon(authUserId: string, email: string, id: string, input: Partial<CreateBillingCouponInput>, fullName?: string | null): Promise<BillingCouponSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.discountType !== undefined) patch.discount_type = input.discountType;
        if (input.discountValue !== undefined) patch.discount_value = input.discountValue;
        if (input.couponKey !== undefined) patch.coupon_key = input.couponKey;
        if (input.code !== undefined) patch.code = input.code;
        const updated = await databaseService.saasBillingCoupons.update(id, patch);
        if (!updated) throw new Error("Failed to update billingCoupons");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "billing_coupon", "update", `BillingCoupon updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBillingCouponSummary(updated, maps);
    }

    async deleteBillingCoupon(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasBillingCoupons.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "billing_coupon", "delete", `BillingCoupon deleted`, id, "elevated"));
        return ok;
    }

    async getRecurringBillings(authUserId: string, email: string, fullName?: string | null): Promise<RecurringBillingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasRecurringBilling.listByOrganization(context.organizationId)).map((r) => mapRecurringBillingSummary(r, maps));
    }

    async createRecurringBilling(authUserId: string, email: string, input: CreateRecurringBillingInput, fullName?: string | null): Promise<RecurringBillingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasRecurringBilling.create(buildRecurringBillingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create recurringBilling");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "recurring_billing", "create", `RecurringBilling created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapRecurringBillingSummary(created, maps);
    }

    async updateRecurringBilling(authUserId: string, email: string, id: string, input: Partial<CreateRecurringBillingInput>, fullName?: string | null): Promise<RecurringBillingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.billingKey !== undefined) patch.billing_key = input.billingKey;
        if (input.billingCycle !== undefined) patch.billing_cycle = input.billingCycle;
        if (input.amountUsd !== undefined) patch.amount_usd = input.amountUsd;
        const updated = await databaseService.saasRecurringBilling.update(id, patch);
        if (!updated) throw new Error("Failed to update recurringBilling");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "recurring_billing", "update", `RecurringBilling updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRecurringBillingSummary(updated, maps);
    }

    async deleteRecurringBilling(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasRecurringBilling.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "recurring_billing", "delete", `RecurringBilling deleted`, id, "elevated"));
        return ok;
    }

    async getTenantHealthScores(authUserId: string, email: string, fullName?: string | null): Promise<TenantHealthScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasTenantHealthScores.listByOrganization(context.organizationId)).map((r) => mapTenantHealthScoreSummary(r, maps));
    }

    async createTenantHealthScore(authUserId: string, email: string, input: CreateTenantHealthScoreInput, fullName?: string | null): Promise<TenantHealthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasTenantHealthScores.create(buildTenantHealthScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create healthScores");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_health_score", "create", `TenantHealthScore created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantHealthScoreSummary(created, maps);
    }

    async updateTenantHealthScore(authUserId: string, email: string, id: string, input: Partial<CreateTenantHealthScoreInput>, fullName?: string | null): Promise<TenantHealthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.scoreKey !== undefined) patch.score_key = input.scoreKey;
        if (input.overallScore !== undefined) patch.overall_score = input.overallScore;
        const updated = await databaseService.saasTenantHealthScores.update(id, patch);
        if (!updated) throw new Error("Failed to update healthScores");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_health_score", "update", `TenantHealthScore updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantHealthScoreSummary(updated, maps);
    }

    async deleteTenantHealthScore(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasTenantHealthScores.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "tenant_health_score", "delete", `TenantHealthScore deleted`, id, "elevated"));
        return ok;
    }

    async getOnboardingChecklists(authUserId: string, email: string, fullName?: string | null): Promise<OnboardingChecklistSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasOnboardingChecklists.listByOrganization(context.organizationId)).map((r) => mapOnboardingChecklistSummary(r, maps));
    }

    async createOnboardingChecklist(authUserId: string, email: string, input: CreateOnboardingChecklistInput, fullName?: string | null): Promise<OnboardingChecklistSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasOnboardingChecklists.create(buildOnboardingChecklistPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create onboardingChecklists");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "onboarding_checklist", "create", `OnboardingChecklist created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingChecklistSummary(created, maps);
    }

    async updateOnboardingChecklist(authUserId: string, email: string, id: string, input: Partial<CreateOnboardingChecklistInput>, fullName?: string | null): Promise<OnboardingChecklistSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.checklistKey !== undefined) patch.checklist_key = input.checklistKey;
        if (input.name !== undefined) patch.name = input.name;
        const updated = await databaseService.saasOnboardingChecklists.update(id, patch);
        if (!updated) throw new Error("Failed to update onboardingChecklists");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "onboarding_checklist", "update", `OnboardingChecklist updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingChecklistSummary(updated, maps);
    }

    async deleteOnboardingChecklist(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasOnboardingChecklists.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "onboarding_checklist", "delete", `OnboardingChecklist deleted`, id, "elevated"));
        return ok;
    }

    async getProductAdoptions(authUserId: string, email: string, fullName?: string | null): Promise<ProductAdoptionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasProductAdoption.listByOrganization(context.organizationId)).map((r) => mapProductAdoptionSummary(r, maps));
    }

    async createProductAdoption(authUserId: string, email: string, input: CreateProductAdoptionInput, fullName?: string | null): Promise<ProductAdoptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasProductAdoption.create(buildProductAdoptionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create productAdoption");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "product_adoption", "create", `ProductAdoption created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapProductAdoptionSummary(created, maps);
    }

    async updateProductAdoption(authUserId: string, email: string, id: string, input: Partial<CreateProductAdoptionInput>, fullName?: string | null): Promise<ProductAdoptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.adoptionKey !== undefined) patch.adoption_key = input.adoptionKey;
        if (input.moduleName !== undefined) patch.module_name = input.moduleName;
        if (input.adoptionPercent !== undefined) patch.adoption_percent = input.adoptionPercent;
        const updated = await databaseService.saasProductAdoption.update(id, patch);
        if (!updated) throw new Error("Failed to update productAdoption");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "product_adoption", "update", `ProductAdoption updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProductAdoptionSummary(updated, maps);
    }

    async deleteProductAdoption(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasProductAdoption.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "product_adoption", "delete", `ProductAdoption deleted`, id, "elevated"));
        return ok;
    }

    async getRenewalTrackings(authUserId: string, email: string, fullName?: string | null): Promise<RenewalTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasRenewalTracking.listByOrganization(context.organizationId)).map((r) => mapRenewalTrackingSummary(r, maps));
    }

    async createRenewalTracking(authUserId: string, email: string, input: CreateRenewalTrackingInput, fullName?: string | null): Promise<RenewalTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasRenewalTracking.create(buildRenewalTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renewalTracking");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "renewal_tracking", "create", `RenewalTracking created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalTrackingSummary(created, maps);
    }

    async updateRenewalTracking(authUserId: string, email: string, id: string, input: Partial<CreateRenewalTrackingInput>, fullName?: string | null): Promise<RenewalTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.renewalKey !== undefined) patch.renewal_key = input.renewalKey;
        if (input.renewalDate !== undefined) patch.renewal_date = input.renewalDate;
        if (input.renewalValueUsd !== undefined) patch.renewal_value_usd = input.renewalValueUsd;
        const updated = await databaseService.saasRenewalTracking.update(id, patch);
        if (!updated) throw new Error("Failed to update renewalTracking");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "renewal_tracking", "update", `RenewalTracking updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalTrackingSummary(updated, maps);
    }

    async deleteRenewalTracking(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasRenewalTracking.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "renewal_tracking", "delete", `RenewalTracking deleted`, id, "elevated"));
        return ok;
    }

    async getSupportSummarys(authUserId: string, email: string, fullName?: string | null): Promise<SupportSummarySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.saasSupportSummaries.listByOrganization(context.organizationId)).map((r) => mapSupportSummarySummary(r, maps));
    }

    async createSupportSummary(authUserId: string, email: string, input: CreateSupportSummaryInput, fullName?: string | null): Promise<SupportSummarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasSupportSummaries.create(buildSupportSummaryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create supportSummaries");
        const security = "standard";
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "support_summary", "create", `SupportSummary created`, created.id, security));
        const maps = await this.getMaps(context.organizationId);
        return mapSupportSummarySummary(created, maps);
    }

    async updateSupportSummary(authUserId: string, email: string, id: string, input: Partial<CreateSupportSummaryInput>, fullName?: string | null): Promise<SupportSummarySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.summaryKey !== undefined) patch.summary_key = input.summaryKey;
        const updated = await databaseService.saasSupportSummaries.update(id, patch);
        if (!updated) throw new Error("Failed to update supportSummaries");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "support_summary", "update", `SupportSummary updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSupportSummarySummary(updated, maps);
    }

    async deleteSupportSummary(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.saasSupportSummaries.delete(id);
        if (ok) await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "support_summary", "delete", `SupportSummary deleted`, id, "elevated"));
        return ok;
    }

    async getAdminMetrics(authUserId: string, email: string, fullName?: string | null): Promise<AdminMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saasAdminMetrics.listByOrganization(context.organizationId)).map(mapAdminMetricSummary);
    }

    async createAdminMetric(authUserId: string, email: string, input: CreateAdminMetricInput, fullName?: string | null): Promise<AdminMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.saasAdminMetrics.create(buildAdminMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create admin metric");
        await databaseService.saasAuditLogs.create(buildSaasAuditPayload(context.organizationId, "admin_metric", "create", `Admin metric ${created.metrics_key} created`, created.id));
        return mapAdminMetricSummary(created);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saasAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getTenantOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saasTenants.listByOrganization(context.organizationId)).map((t) => ({ id: t.id, name: t.company_name }));
    }

    async sdkRegisterTenant(authUserId: string, email: string, input: SaasSdkRegisterTenantInput, fullName?: string | null): Promise<SaasSdkRegisterTenantResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.companyName, limit: 5 });
        const task = await ai.executeTask({ taskType: "register_tenant", moduleSource: "commercial_saas", inputPayload: { tenantKey: input.tenantKey, companyName: input.companyName, ownerEmail: input.ownerEmail } });
        const tenant = await this.createTenant(authUserId, email, { tenantKey: input.tenantKey, companyName: input.companyName, currentPlan: input.planTier ?? "trial" }, fullName);
        const registration = await this.createRegistration(authUserId, email, { tenantId: tenant.id, registrationKey: `${input.tenantKey}-reg`, companyName: input.companyName, ownerEmail: input.ownerEmail, ownerName: input.ownerName ?? "" }, fullName);
        const trial = await this.createTrial(authUserId, email, { tenantId: tenant.id, trialKey: `${input.tenantKey}-trial`, planTier: input.planTier ?? "trial" }, fullName);
        return { tenantId: tenant.id, tenantKey: tenant.tenantKey, registrationId: registration.id, trialId: trial.id, aiTaskId: task?.taskId ?? null };
    }

    async sdkManageSubscription(authUserId: string, email: string, input: SaasSdkManageSubscriptionInput, fullName?: string | null): Promise<SaasSdkManageSubscriptionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.planTier, limit: 3 });
        await ai.executeTask({ taskType: "manage_subscription", moduleSource: "commercial_saas", inputPayload: { tenantId: input.tenantId, planTier: input.planTier } });
        const created = await this.createSubscription(authUserId, email, { tenantId: input.tenantId, subscriptionKey: input.subscriptionKey, planTier: input.planTier, billingCycle: input.billingCycle ?? "monthly", amountUsd: input.amountUsd ?? 0 }, fullName);
        await this.createSubscriptionEvent(authUserId, email, { tenantId: input.tenantId, eventKey: `${input.subscriptionKey}-event`, eventType: "plan_change", fromPlan: "trial", toPlan: input.planTier }, fullName);
        return { subscriptionId: created.id, subscriptionKey: created.subscriptionKey, planTier: String(created.planTier), status: created.status };
    }

    async sdkTrackUsage(authUserId: string, email: string, input: SaasSdkTrackUsageInput, fullName?: string | null): Promise<SaasSdkTrackUsageResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.meterType, limit: 3 });
        await ai.executeTask({ taskType: "track_usage", moduleSource: "commercial_saas", inputPayload: { tenantId: input.tenantId, meterType: input.meterType, quantity: input.quantity } });
        const created = await this.createUsageRecord(authUserId, email, { tenantId: input.tenantId, recordKey: input.recordKey, meterType: input.meterType, quantity: input.quantity }, fullName);
        return { recordId: created.id, recordKey: String(created.recordKey), meterType: String(created.meterType), quantity: Number(created.quantity) };
    }
}

export const commercialSaasService = new CommercialSaasService();
