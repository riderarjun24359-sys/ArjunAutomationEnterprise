"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { commercialSaasService } from "@/src/modules/commercial-saas/services/commercial-saas.service";
import type {
    AdminMetricSummary,
    AuditEntry,
    CreateAdminMetricInput,
    CreateTenantInput,
    SaasDashboardStats,
    SaasPipelineInfo,
    TenantSummary,
    RegistrationSummary,
    TenantProfileSummary,
    DomainConfigSummary,
    EmailVerificationSummary,
    TrialSummary,
    WorkspaceSetupSummary,
    TenantRoleProvisionSummary,
    WelcomeExperienceSummary,
    SubscriptionSummary,
    PlanLimitSummary,
    SubscriptionEventSummary,
    LicenseSummary,
    LicenseAllocationSummary,
    FeatureFlagSummary,
    PortalSettingSummary,
    PortalBrandingSummary,
    PortalIntegrationSummary,
    PortalApiKeySummary,
    UsageMeterSummary,
    UsageRecordSummary,
    CommercialInvoiceSummary,
    BillingCreditSummary,
    BillingCouponSummary,
    RecurringBillingSummary,
    TenantHealthScoreSummary,
    OnboardingChecklistSummary,
    ProductAdoptionSummary,
    RenewalTrackingSummary,
    SupportSummarySummary,
    CreateRegistrationInput,
    CreateTenantProfileInput,
    CreateDomainConfigInput,
    CreateEmailVerificationInput,
    CreateTrialInput,
    CreateWorkspaceSetupInput,
    CreateTenantRoleProvisionInput,
    CreateWelcomeExperienceInput,
    CreateSubscriptionInput,
    CreatePlanLimitInput,
    CreateSubscriptionEventInput,
    CreateLicenseInput,
    CreateLicenseAllocationInput,
    CreateFeatureFlagInput,
    CreatePortalSettingInput,
    CreatePortalBrandingInput,
    CreatePortalIntegrationInput,
    CreatePortalApiKeyInput,
    CreateUsageMeterInput,
    CreateUsageRecordInput,
    CreateCommercialInvoiceInput,
    CreateBillingCreditInput,
    CreateBillingCouponInput,
    CreateRecurringBillingInput,
    CreateTenantHealthScoreInput,
    CreateOnboardingChecklistInput,
    CreateProductAdoptionInput,
    CreateRenewalTrackingInput,
    CreateSupportSummaryInput,
} from "@/src/modules/commercial-saas/types";

export function useCommercialSaas() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SaasDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<SaasPipelineInfo | null>(null);
    const [tenants, setTenants] = useState<TenantSummary[]>([]);
    const [registrations, setRegistrations] = useState<RegistrationSummary[]>([]);
    const [tenantProfiles, setTenantProfiles] = useState<TenantProfileSummary[]>([]);
    const [domainConfigs, setDomainConfigs] = useState<DomainConfigSummary[]>([]);
    const [emailVerifications, setEmailVerifications] = useState<EmailVerificationSummary[]>([]);
    const [trials, setTrials] = useState<TrialSummary[]>([]);
    const [workspaceSetups, setWorkspaceSetups] = useState<WorkspaceSetupSummary[]>([]);
    const [roleProvisions, setTenantRoleProvisions] = useState<TenantRoleProvisionSummary[]>([]);
    const [welcomeExperiences, setWelcomeExperiences] = useState<WelcomeExperienceSummary[]>([]);
    const [subscriptions, setSubscriptions] = useState<SubscriptionSummary[]>([]);
    const [planLimits, setPlanLimits] = useState<PlanLimitSummary[]>([]);
    const [subscriptionEvents, setSubscriptionEvents] = useState<SubscriptionEventSummary[]>([]);
    const [licenses, setLicenses] = useState<LicenseSummary[]>([]);
    const [licenseAllocations, setLicenseAllocations] = useState<LicenseAllocationSummary[]>([]);
    const [featureFlags, setFeatureFlags] = useState<FeatureFlagSummary[]>([]);
    const [portalSettings, setPortalSettings] = useState<PortalSettingSummary[]>([]);
    const [portalBranding, setPortalBrandings] = useState<PortalBrandingSummary[]>([]);
    const [portalIntegrations, setPortalIntegrations] = useState<PortalIntegrationSummary[]>([]);
    const [portalApiKeys, setPortalApiKeys] = useState<PortalApiKeySummary[]>([]);
    const [usageMeters, setUsageMeters] = useState<UsageMeterSummary[]>([]);
    const [usageRecords, setUsageRecords] = useState<UsageRecordSummary[]>([]);
    const [invoices, setCommercialInvoices] = useState<CommercialInvoiceSummary[]>([]);
    const [billingCredits, setBillingCredits] = useState<BillingCreditSummary[]>([]);
    const [billingCoupons, setBillingCoupons] = useState<BillingCouponSummary[]>([]);
    const [recurringBilling, setRecurringBillings] = useState<RecurringBillingSummary[]>([]);
    const [healthScores, setTenantHealthScores] = useState<TenantHealthScoreSummary[]>([]);
    const [onboardingChecklists, setOnboardingChecklists] = useState<OnboardingChecklistSummary[]>([]);
    const [productAdoption, setProductAdoptions] = useState<ProductAdoptionSummary[]>([]);
    const [renewalTracking, setRenewalTrackings] = useState<RenewalTrackingSummary[]>([]);
    const [supportSummaries, setSupportSummarys] = useState<SupportSummarySummary[]>([]);
    const [adminMetrics, setAdminMetrics] = useState<AdminMetricSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [tenantOptions, setTenantOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
            tenantList,
            registrationsList,
            tenantProfilesList,
            domainConfigsList,
            emailVerificationsList,
            trialsList,
            workspaceSetupsList,
            roleProvisionsList,
            welcomeExperiencesList,
            subscriptionsList,
            planLimitsList,
            subscriptionEventsList,
            licensesList,
            licenseAllocationsList,
            featureFlagsList,
            portalSettingsList,
            portalBrandingList,
            portalIntegrationsList,
            portalApiKeysList,
            usageMetersList,
            usageRecordsList,
            invoicesList,
            billingCreditsList,
            billingCouponsList,
            recurringBillingList,
            healthScoresList,
            onboardingChecklistsList,
            productAdoptionList,
            renewalTrackingList,
            supportSummariesList,
            adminMetricList,
            auditList,
            tenantOpts,
        ] = await Promise.all([
            commercialSaasService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(commercialSaasService.getPipelineInfo()),
            commercialSaasService.getTenants(authUserId, email, fullName),
            commercialSaasService.getRegistrations(authUserId, email, fullName),
            commercialSaasService.getTenantProfiles(authUserId, email, fullName),
            commercialSaasService.getDomainConfigs(authUserId, email, fullName),
            commercialSaasService.getEmailVerifications(authUserId, email, fullName),
            commercialSaasService.getTrials(authUserId, email, fullName),
            commercialSaasService.getWorkspaceSetups(authUserId, email, fullName),
            commercialSaasService.getTenantRoleProvisions(authUserId, email, fullName),
            commercialSaasService.getWelcomeExperiences(authUserId, email, fullName),
            commercialSaasService.getSubscriptions(authUserId, email, fullName),
            commercialSaasService.getPlanLimits(authUserId, email, fullName),
            commercialSaasService.getSubscriptionEvents(authUserId, email, fullName),
            commercialSaasService.getLicenses(authUserId, email, fullName),
            commercialSaasService.getLicenseAllocations(authUserId, email, fullName),
            commercialSaasService.getFeatureFlags(authUserId, email, fullName),
            commercialSaasService.getPortalSettings(authUserId, email, fullName),
            commercialSaasService.getPortalBrandings(authUserId, email, fullName),
            commercialSaasService.getPortalIntegrations(authUserId, email, fullName),
            commercialSaasService.getPortalApiKeys(authUserId, email, fullName),
            commercialSaasService.getUsageMeters(authUserId, email, fullName),
            commercialSaasService.getUsageRecords(authUserId, email, fullName),
            commercialSaasService.getCommercialInvoices(authUserId, email, fullName),
            commercialSaasService.getBillingCredits(authUserId, email, fullName),
            commercialSaasService.getBillingCoupons(authUserId, email, fullName),
            commercialSaasService.getRecurringBillings(authUserId, email, fullName),
            commercialSaasService.getTenantHealthScores(authUserId, email, fullName),
            commercialSaasService.getOnboardingChecklists(authUserId, email, fullName),
            commercialSaasService.getProductAdoptions(authUserId, email, fullName),
            commercialSaasService.getRenewalTrackings(authUserId, email, fullName),
            commercialSaasService.getSupportSummarys(authUserId, email, fullName),
            commercialSaasService.getAdminMetrics(authUserId, email, fullName),
            commercialSaasService.getAuditLogs(authUserId, email, fullName),
            commercialSaasService.getTenantOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
            tenantList,
            registrationsList,
            tenantProfilesList,
            domainConfigsList,
            emailVerificationsList,
            trialsList,
            workspaceSetupsList,
            roleProvisionsList,
            welcomeExperiencesList,
            subscriptionsList,
            planLimitsList,
            subscriptionEventsList,
            licensesList,
            licenseAllocationsList,
            featureFlagsList,
            portalSettingsList,
            portalBrandingList,
            portalIntegrationsList,
            portalApiKeysList,
            usageMetersList,
            usageRecordsList,
            invoicesList,
            billingCreditsList,
            billingCouponsList,
            recurringBillingList,
            healthScoresList,
            onboardingChecklistsList,
            productAdoptionList,
            renewalTrackingList,
            supportSummariesList,
            adminMetricList,
            auditList,
            tenantOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setTenants(result.tenantList);
        setRegistrations(result.registrationsList);
        setTenantProfiles(result.tenantProfilesList);
        setDomainConfigs(result.domainConfigsList);
        setEmailVerifications(result.emailVerificationsList);
        setTrials(result.trialsList);
        setWorkspaceSetups(result.workspaceSetupsList);
        setTenantRoleProvisions(result.roleProvisionsList);
        setWelcomeExperiences(result.welcomeExperiencesList);
        setSubscriptions(result.subscriptionsList);
        setPlanLimits(result.planLimitsList);
        setSubscriptionEvents(result.subscriptionEventsList);
        setLicenses(result.licensesList);
        setLicenseAllocations(result.licenseAllocationsList);
        setFeatureFlags(result.featureFlagsList);
        setPortalSettings(result.portalSettingsList);
        setPortalBrandings(result.portalBrandingList);
        setPortalIntegrations(result.portalIntegrationsList);
        setPortalApiKeys(result.portalApiKeysList);
        setUsageMeters(result.usageMetersList);
        setUsageRecords(result.usageRecordsList);
        setCommercialInvoices(result.invoicesList);
        setBillingCredits(result.billingCreditsList);
        setBillingCoupons(result.billingCouponsList);
        setRecurringBillings(result.recurringBillingList);
        setTenantHealthScores(result.healthScoresList);
        setOnboardingChecklists(result.onboardingChecklistsList);
        setProductAdoptions(result.productAdoptionList);
        setRenewalTrackings(result.renewalTrackingList);
        setSupportSummarys(result.supportSummariesList);
        setAdminMetrics(result.adminMetricList);
        setAuditLogs(result.auditList);
        setTenantOptions(result.tenantOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createTenant = useCallback(async (input: CreateTenantInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createTenant(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRegistration = useCallback(async (input: CreateRegistrationInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createRegistration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTenantProfile = useCallback(async (input: CreateTenantProfileInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createTenantProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDomainConfig = useCallback(async (input: CreateDomainConfigInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createDomainConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEmailVerification = useCallback(async (input: CreateEmailVerificationInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createEmailVerification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTrial = useCallback(async (input: CreateTrialInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createTrial(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkspaceSetup = useCallback(async (input: CreateWorkspaceSetupInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createWorkspaceSetup(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTenantRoleProvision = useCallback(async (input: CreateTenantRoleProvisionInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createTenantRoleProvision(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWelcomeExperience = useCallback(async (input: CreateWelcomeExperienceInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createWelcomeExperience(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSubscription = useCallback(async (input: CreateSubscriptionInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createSubscription(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlanLimit = useCallback(async (input: CreatePlanLimitInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createPlanLimit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSubscriptionEvent = useCallback(async (input: CreateSubscriptionEventInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createSubscriptionEvent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLicense = useCallback(async (input: CreateLicenseInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createLicense(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLicenseAllocation = useCallback(async (input: CreateLicenseAllocationInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createLicenseAllocation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeatureFlag = useCallback(async (input: CreateFeatureFlagInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createFeatureFlag(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPortalSetting = useCallback(async (input: CreatePortalSettingInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createPortalSetting(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPortalBranding = useCallback(async (input: CreatePortalBrandingInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createPortalBranding(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPortalIntegration = useCallback(async (input: CreatePortalIntegrationInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createPortalIntegration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPortalApiKey = useCallback(async (input: CreatePortalApiKeyInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createPortalApiKey(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUsageMeter = useCallback(async (input: CreateUsageMeterInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createUsageMeter(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUsageRecord = useCallback(async (input: CreateUsageRecordInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createUsageRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCommercialInvoice = useCallback(async (input: CreateCommercialInvoiceInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createCommercialInvoice(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBillingCredit = useCallback(async (input: CreateBillingCreditInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createBillingCredit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBillingCoupon = useCallback(async (input: CreateBillingCouponInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createBillingCoupon(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRecurringBilling = useCallback(async (input: CreateRecurringBillingInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createRecurringBilling(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTenantHealthScore = useCallback(async (input: CreateTenantHealthScoreInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createTenantHealthScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOnboardingChecklist = useCallback(async (input: CreateOnboardingChecklistInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createOnboardingChecklist(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProductAdoption = useCallback(async (input: CreateProductAdoptionInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createProductAdoption(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenewalTracking = useCallback(async (input: CreateRenewalTrackingInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createRenewalTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSupportSummary = useCallback(async (input: CreateSupportSummaryInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createSupportSummary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdminMetric = useCallback(async (input: CreateAdminMetricInput) => { if (!user) throw new Error("Authentication required"); await commercialSaasService.createAdminMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        tenants,
        registrations,
        tenantProfiles,
        domainConfigs,
        emailVerifications,
        trials,
        workspaceSetups,
        roleProvisions,
        welcomeExperiences,
        subscriptions,
        planLimits,
        subscriptionEvents,
        licenses,
        licenseAllocations,
        featureFlags,
        portalSettings,
        portalBranding,
        portalIntegrations,
        portalApiKeys,
        usageMeters,
        usageRecords,
        invoices,
        billingCredits,
        billingCoupons,
        recurringBilling,
        healthScores,
        onboardingChecklists,
        productAdoption,
        renewalTracking,
        supportSummaries,
        adminMetrics,
        auditLogs,
        tenantOptions,
        refresh,
        createTenant,
        createRegistration,
        createTenantProfile,
        createDomainConfig,
        createEmailVerification,
        createTrial,
        createWorkspaceSetup,
        createTenantRoleProvision,
        createWelcomeExperience,
        createSubscription,
        createPlanLimit,
        createSubscriptionEvent,
        createLicense,
        createLicenseAllocation,
        createFeatureFlag,
        createPortalSetting,
        createPortalBranding,
        createPortalIntegration,
        createPortalApiKey,
        createUsageMeter,
        createUsageRecord,
        createCommercialInvoice,
        createBillingCredit,
        createBillingCoupon,
        createRecurringBilling,
        createTenantHealthScore,
        createOnboardingChecklist,
        createProductAdoption,
        createRenewalTracking,
        createSupportSummary,
        createAdminMetric,
    };
}
