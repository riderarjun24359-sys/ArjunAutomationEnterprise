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
import type {
    SaasDashboardStats,
    SaasPipelineInfo,
    TenantSummary,
    CreateTenantInput,
    AuditEntry,
    AdminMetricSummary,
    CreateAdminMetricInput,
    RegistrationSummary,
    CreateRegistrationInput,
    TenantProfileSummary,
    CreateTenantProfileInput,
    DomainConfigSummary,
    CreateDomainConfigInput,
    EmailVerificationSummary,
    CreateEmailVerificationInput,
    TrialSummary,
    CreateTrialInput,
    WorkspaceSetupSummary,
    CreateWorkspaceSetupInput,
    TenantRoleProvisionSummary,
    CreateTenantRoleProvisionInput,
    WelcomeExperienceSummary,
    CreateWelcomeExperienceInput,
    SubscriptionSummary,
    CreateSubscriptionInput,
    PlanLimitSummary,
    CreatePlanLimitInput,
    SubscriptionEventSummary,
    CreateSubscriptionEventInput,
    LicenseSummary,
    CreateLicenseInput,
    LicenseAllocationSummary,
    CreateLicenseAllocationInput,
    FeatureFlagSummary,
    CreateFeatureFlagInput,
    PortalSettingSummary,
    CreatePortalSettingInput,
    PortalBrandingSummary,
    CreatePortalBrandingInput,
    PortalIntegrationSummary,
    CreatePortalIntegrationInput,
    PortalApiKeySummary,
    CreatePortalApiKeyInput,
    UsageMeterSummary,
    CreateUsageMeterInput,
    UsageRecordSummary,
    CreateUsageRecordInput,
    CommercialInvoiceSummary,
    CreateCommercialInvoiceInput,
    BillingCreditSummary,
    CreateBillingCreditInput,
    BillingCouponSummary,
    CreateBillingCouponInput,
    RecurringBillingSummary,
    CreateRecurringBillingInput,
    TenantHealthScoreSummary,
    CreateTenantHealthScoreInput,
    OnboardingChecklistSummary,
    CreateOnboardingChecklistInput,
    ProductAdoptionSummary,
    CreateProductAdoptionInput,
    RenewalTrackingSummary,
    CreateRenewalTrackingInput,
    SupportSummarySummary,
    CreateSupportSummaryInput,
} from "@/src/modules/commercial-saas/types";

type LookupMaps = { tenants: Map<string, DbSaasTenant> };

export const buildTenantLookupMaps = (tenants: DbSaasTenant[]): LookupMaps => ({
    tenants: new Map(tenants.map((item) => [item.id, item])),
});

const tenantName = (maps: LookupMaps, id?: string | null) => (id ? maps.tenants.get(id)?.company_name ?? null : null);

export const mapTenantSummary = (record: DbSaasTenant): TenantSummary => ({
    id: record.id,
    companyName: record.company_name,
    tenantKey: record.tenant_key,
    currentPlan: record.current_plan,
    tenantStatus: record.tenant_status,
    domainSlug: record.domain_slug,
    summaryPreview: record.summary.slice(0, 120),
    updatedAt: record.updated_at,
});

export const mapAuditEntry = (record: DbSaasAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    securityLevel: record.security_level,
    createdAt: record.created_at,
});

export const mapAdminMetricSummary = (record: DbSaasAdminMetric): AdminMetricSummary => ({
    id: record.id,
    metricsKey: record.metrics_key,
    metricDate: record.metric_date,
    activeTenants: record.active_tenants,
    trialTenants: record.trial_tenants,
    mrrUsd: Number(record.mrr_usd),
    arrUsd: Number(record.arr_usd),
    churnRatePercent: Number(record.churn_rate_percent),
    avgHealthScore: Number(record.avg_health_score),
    status: record.status,
});

export const mapRegistrationSummary = (record: DbSaasRegistration, maps: LookupMaps): RegistrationSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    registrationKey: String(record.registration_key),
    companyName: String(record.company_name),
    ownerEmail: String(record.owner_email),
    status: record.registration_status,
});

export const mapTenantProfileSummary = (record: DbSaasTenantProfile, maps: LookupMaps): TenantProfileSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    profileKey: String(record.profile_key),
    legalName: String(record.legal_name),
    billingEmail: String(record.billing_email),
    status: record.status,
});

export const mapDomainConfigSummary = (record: DbSaasDomainConfig, maps: LookupMaps): DomainConfigSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    domainKey: String(record.domain_key),
    subdomain: String(record.subdomain),
    sslStatus: String(record.ssl_status),
    status: record.status,
});

export const mapEmailVerificationSummary = (record: DbSaasEmailVerification, maps: LookupMaps): EmailVerificationSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    verificationKey: String(record.verification_key),
    email: String(record.email),
    status: record.status,
});

export const mapTrialSummary = (record: DbSaasTrial, maps: LookupMaps): TrialSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    trialKey: String(record.trial_key),
    planTier: String(record.plan_tier),
    endsAt: String(record.ends_at),
    status: record.status,
});

export const mapWorkspaceSetupSummary = (record: DbSaasWorkspaceSetup, maps: LookupMaps): WorkspaceSetupSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    setupKey: String(record.setup_key),
    workspaceName: String(record.workspace_name),
    status: record.status,
});

export const mapTenantRoleProvisionSummary = (record: DbSaasTenantRoleProvision, maps: LookupMaps): TenantRoleProvisionSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    provisionKey: String(record.provision_key),
    roleName: String(record.role_name),
    status: record.status,
});

export const mapWelcomeExperienceSummary = (record: DbSaasWelcomeExperience, maps: LookupMaps): WelcomeExperienceSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    experienceKey: String(record.experience_key),
    title: String(record.title),
    status: record.status,
});

export const mapSubscriptionSummary = (record: DbSaasSubscription, maps: LookupMaps): SubscriptionSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    subscriptionKey: String(record.subscription_key),
    planTier: String(record.plan_tier),
    amountUsd: Number(record.amount_usd),
    status: record.status,
});

export const mapPlanLimitSummary = (record: DbSaasPlanLimit, maps: LookupMaps): PlanLimitSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    limitKey: String(record.limit_key),
    planTier: String(record.plan_tier),
    limitValue: Number(record.limit_value),
    status: record.status,
});

export const mapSubscriptionEventSummary = (record: DbSaasSubscriptionEvent, maps: LookupMaps): SubscriptionEventSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    eventKey: String(record.event_key),
    eventType: String(record.event_type),
    toPlan: String(record.to_plan),
    status: record.status,
});

export const mapLicenseSummary = (record: DbSaasLicense, maps: LookupMaps): LicenseSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    licenseKey: String(record.license_key),
    name: String(record.name),
    totalUnits: Number(record.total_units),
    status: record.status,
});

export const mapLicenseAllocationSummary = (record: DbSaasLicenseAllocation, maps: LookupMaps): LicenseAllocationSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    allocationKey: String(record.allocation_key),
    resourceName: String(record.resource_name),
    allocatedUnits: Number(record.allocated_units),
    status: record.status,
});

export const mapFeatureFlagSummary = (record: DbSaasFeatureFlag, maps: LookupMaps): FeatureFlagSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    flagKey: String(record.flag_key),
    name: String(record.name),
    enabled: record.enabled,
    status: record.status,
});

export const mapPortalSettingSummary = (record: DbSaasPortalSetting, maps: LookupMaps): PortalSettingSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    settingsKey: String(record.settings_key),
    portalName: String(record.portal_name),
    status: record.status,
});

export const mapPortalBrandingSummary = (record: DbSaasPortalBranding, maps: LookupMaps): PortalBrandingSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    brandingKey: String(record.branding_key),
    primaryColor: String(record.primary_color),
    status: record.status,
});

export const mapPortalIntegrationSummary = (record: DbSaasPortalIntegration, maps: LookupMaps): PortalIntegrationSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    integrationKey: String(record.integration_key),
    provider: String(record.provider),
    status: record.status,
});

export const mapPortalApiKeySummary = (record: DbSaasPortalApiKey, maps: LookupMaps): PortalApiKeySummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    keyName: String(record.key_name),
    status: record.status,
});

export const mapUsageMeterSummary = (record: DbSaasUsageMeter, maps: LookupMaps): UsageMeterSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    meterKey: String(record.meter_key),
    meterType: String(record.meter_type),
    currentPeriodUsage: Number(record.current_period_usage),
    status: record.status,
});

export const mapUsageRecordSummary = (record: DbSaasUsageRecord, maps: LookupMaps): UsageRecordSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    recordKey: String(record.record_key),
    meterType: String(record.meter_type),
    quantity: Number(record.quantity),
    status: String(record.recorded_at),
});

export const mapCommercialInvoiceSummary = (record: DbSaasCommercialInvoice, maps: LookupMaps): CommercialInvoiceSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    invoiceKey: String(record.invoice_key),
    invoiceNumber: String(record.invoice_number),
    amountUsd: Number(record.amount_usd),
    status: record.status,
});

export const mapBillingCreditSummary = (record: DbSaasBillingCredit, maps: LookupMaps): BillingCreditSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    creditKey: String(record.credit_key),
    reason: String(record.reason),
    balanceUsd: Number(record.balance_usd),
    status: record.status,
});

export const mapBillingCouponSummary = (record: DbSaasBillingCoupon, maps: LookupMaps): BillingCouponSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    couponKey: String(record.coupon_key),
    code: String(record.code),
    discountValue: Number(record.discount_value),
    status: record.status,
});

export const mapRecurringBillingSummary = (record: DbSaasRecurringBilling, maps: LookupMaps): RecurringBillingSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    billingKey: String(record.billing_key),
    billingCycle: String(record.billing_cycle),
    amountUsd: Number(record.amount_usd),
    status: record.status,
});

export const mapTenantHealthScoreSummary = (record: DbSaasTenantHealthScore, maps: LookupMaps): TenantHealthScoreSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    scoreKey: String(record.score_key),
    overallScore: Number(record.overall_score),
    status: record.status,
});

export const mapOnboardingChecklistSummary = (record: DbSaasOnboardingChecklist, maps: LookupMaps): OnboardingChecklistSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    checklistKey: String(record.checklist_key),
    name: String(record.name),
    status: record.status,
});

export const mapProductAdoptionSummary = (record: DbSaasProductAdoption, maps: LookupMaps): ProductAdoptionSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    adoptionKey: String(record.adoption_key),
    moduleName: String(record.module_name),
    adoptionPercent: Number(record.adoption_percent),
    status: record.status,
});

export const mapRenewalTrackingSummary = (record: DbSaasRenewalTracking, maps: LookupMaps): RenewalTrackingSummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    renewalKey: String(record.renewal_key),
    renewalDate: String(record.renewal_date),
    renewalValueUsd: Number(record.renewal_value_usd),
    status: record.status,
});

export const mapSupportSummarySummary = (record: DbSaasSupportSummary, maps: LookupMaps): SupportSummarySummary => ({
    id: record.id,
    tenantName: tenantName(maps, record.tenant_id) ?? "",
    summaryKey: String(record.summary_key),
    openTickets: Number(record.open_tickets),
    satisfactionScore: Number(record.satisfaction_score),
    status: record.status,
});

export const buildSaasDashboardStats = (input: {
    tenants: TenantSummary[];
    subscriptions: { planTier: string; amountUsd: number; status: string }[];
    licenses: unknown[];
    usageMeters: unknown[];
    invoices: unknown[];
    registrations: unknown[];
    featureFlags: unknown[];
    portalApiKeys: unknown[];
    renewals: unknown[];
    adminMetrics: AdminMetricSummary[];
    healthScores: { overallScore: number }[];
    auditLogs: unknown[];
}): SaasDashboardStats => {
    const mrr = input.adminMetrics.length
        ? input.adminMetrics.reduce((s, m) => s + m.mrrUsd, 0) / input.adminMetrics.length
        : input.subscriptions.filter((s) => s.status === "active").reduce((s, sub) => s + sub.amountUsd, 0);
    const arr = input.adminMetrics.length
        ? input.adminMetrics.reduce((s, m) => s + m.arrUsd, 0) / input.adminMetrics.length
        : mrr * 12;
    return {
        totalTenants: input.tenants.length,
        activeTenants: input.tenants.filter((t) => t.tenantStatus === "active").length,
        trialTenants: input.tenants.filter((t) => t.currentPlan === "trial").length,
        subscriptionCount: input.subscriptions.length,
        licenseCount: input.licenses.length,
        usageMeterCount: input.usageMeters.length,
        invoiceCount: input.invoices.length,
        mrrUsd: mrr,
        arrUsd: arr,
        avgHealthScore: input.healthScores.length ? input.healthScores.reduce((s, h) => s + h.overallScore, 0) / input.healthScores.length : 0,
        registrationCount: input.registrations.length,
        featureFlagCount: input.featureFlags.length,
        portalApiKeyCount: input.portalApiKeys.length,
        renewalCount: input.renewals.length,
        auditCount: input.auditLogs.length,
    };
};

export const buildSaasPipelineInfo = (): SaasPipelineInfo => ({
    stages: [
        { key: "registration", label: "Tenant Registration" },
        { key: "trial", label: "Trial Period" },
        { key: "starter", label: "Starter Plan" },
        { key: "growth", label: "Growth Plan" },
        { key: "professional", label: "Professional Plan" },
        { key: "enterprise", label: "Enterprise Plan" },
    ],
    currentStage: "starter",
    nextStage: "growth",
    previousStage: "trial",
});

export const buildTenantPayload = (organizationId: string, input: CreateTenantInput) => ({
    organization_id: organizationId,
    tenant_key: input.tenantKey,
    company_name: input.companyName,
    current_plan: input.currentPlan ?? "trial",
    domain_slug: input.domainSlug ?? "",
    summary: input.summary ?? "",
});

export const buildAdminMetricPayload = (organizationId: string, input: CreateAdminMetricInput) => ({
    organization_id: organizationId,
    metrics_key: input.metricsKey,
    metric_date: input.metricDate ?? new Date().toISOString().slice(0, 10),
    active_tenants: input.activeTenants ?? 0,
    trial_tenants: input.trialTenants ?? 0,
    mrr_usd: input.mrrUsd ?? 0,
    arr_usd: input.arrUsd ?? 0,
    churn_rate_percent: input.churnRatePercent ?? 0,
    avg_health_score: input.avgHealthScore ?? 0,
});

export const buildSaasAuditPayload = (
    organizationId: string,
    entityType: string,
    action: string,
    summary: string,
    entityId?: string,
    securityLevel: string = "standard",
) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
    security_level: securityLevel,
});

export const buildRegistrationPayload = (organizationId: string, input: CreateRegistrationInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    registration_key: input.registrationKey ?? "",
    company_name: input.companyName ?? "",
    owner_email: input.ownerEmail ?? "",
    owner_name: input.ownerName ?? "",
});

export const buildTenantProfilePayload = (organizationId: string, input: CreateTenantProfileInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    profile_key: input.profileKey ?? "",
    legal_name: input.legalName ?? "",
    industry: input.industry ?? "",
    billing_email: input.billingEmail ?? "",
});

export const buildDomainConfigPayload = (organizationId: string, input: CreateDomainConfigInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    domain_key: input.domainKey ?? "",
    subdomain: input.subdomain ?? "",
    custom_domain: input.customDomain ?? "",
});

export const buildEmailVerificationPayload = (organizationId: string, input: CreateEmailVerificationInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    verification_key: input.verificationKey ?? "",
    email: input.email ?? "",
});

export const buildTrialPayload = (organizationId: string, input: CreateTrialInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    trial_key: input.trialKey ?? "",
    plan_tier: input.planTier ?? "",
});

export const buildWorkspaceSetupPayload = (organizationId: string, input: CreateWorkspaceSetupInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    setup_key: input.setupKey ?? "",
    workspace_name: input.workspaceName ?? "",
});

export const buildTenantRoleProvisionPayload = (organizationId: string, input: CreateTenantRoleProvisionInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    provision_key: input.provisionKey ?? "",
    role_name: input.roleName ?? "",
});

export const buildWelcomeExperiencePayload = (organizationId: string, input: CreateWelcomeExperienceInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    experience_key: input.experienceKey ?? "",
    title: input.title ?? "",
});

export const buildSubscriptionPayload = (organizationId: string, input: CreateSubscriptionInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    subscription_key: input.subscriptionKey ?? "",
    plan_tier: input.planTier ?? "",
    billing_cycle: input.billingCycle ?? "",
    amount_usd: input.amountUsd ?? 0,
});

export const buildPlanLimitPayload = (organizationId: string, input: CreatePlanLimitInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    limit_key: input.limitKey ?? "",
    plan_tier: input.planTier ?? "",
    resource_type: input.resourceType ?? "",
    limit_value: input.limitValue ?? 0,
});

export const buildSubscriptionEventPayload = (organizationId: string, input: CreateSubscriptionEventInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    event_key: input.eventKey ?? "",
    event_type: input.eventType ?? "",
    from_plan: input.fromPlan ?? "",
    to_plan: input.toPlan ?? "",
});

export const buildLicensePayload = (organizationId: string, input: CreateLicenseInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    license_key: input.licenseKey ?? "",
    name: input.name ?? "",
    license_type: input.licenseType ?? "",
    total_units: input.totalUnits ?? 0,
});

export const buildLicenseAllocationPayload = (organizationId: string, input: CreateLicenseAllocationInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    allocation_key: input.allocationKey ?? "",
    resource_name: input.resourceName ?? "",
    resource_type: input.resourceType ?? "",
    allocated_units: input.allocatedUnits ?? 0,
});

export const buildFeatureFlagPayload = (organizationId: string, input: CreateFeatureFlagInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    flag_key: input.flagKey ?? "",
    name: input.name ?? "",
    module_source: input.moduleSource ?? "",
});

export const buildPortalSettingPayload = (organizationId: string, input: CreatePortalSettingInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    settings_key: input.settingsKey ?? "",
    portal_name: input.portalName ?? "",
});

export const buildPortalBrandingPayload = (organizationId: string, input: CreatePortalBrandingInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    branding_key: input.brandingKey ?? "",
    primary_color: input.primaryColor ?? "",
    accent_color: input.accentColor ?? "",
});

export const buildPortalIntegrationPayload = (organizationId: string, input: CreatePortalIntegrationInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    integration_key: input.integrationKey ?? "",
    provider: input.provider ?? "",
});

export const buildPortalApiKeyPayload = (organizationId: string, input: CreatePortalApiKeyInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    key_name: input.keyName ?? "",
});

export const buildUsageMeterPayload = (organizationId: string, input: CreateUsageMeterInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    meter_key: input.meterKey ?? "",
    meter_type: input.meterType ?? "",
    unit_label: input.unitLabel ?? "",
});

export const buildUsageRecordPayload = (organizationId: string, input: CreateUsageRecordInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    record_key: input.recordKey ?? "",
    meter_type: input.meterType ?? "",
    quantity: input.quantity ?? 0,
});

export const buildCommercialInvoicePayload = (organizationId: string, input: CreateCommercialInvoiceInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    invoice_key: input.invoiceKey ?? "",
    invoice_number: input.invoiceNumber ?? "",
    amount_usd: input.amountUsd ?? 0,
});

export const buildBillingCreditPayload = (organizationId: string, input: CreateBillingCreditInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    credit_key: input.creditKey ?? "",
    reason: input.reason ?? "",
    balance_usd: input.balanceUsd ?? 0,
});

export const buildBillingCouponPayload = (organizationId: string, input: CreateBillingCouponInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    coupon_key: input.couponKey ?? "",
    code: input.code ?? "",
    discount_type: input.discountType ?? "",
    discount_value: input.discountValue ?? 0,
});

export const buildRecurringBillingPayload = (organizationId: string, input: CreateRecurringBillingInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    billing_key: input.billingKey ?? "",
    billing_cycle: input.billingCycle ?? "",
    amount_usd: input.amountUsd ?? 0,
});

export const buildTenantHealthScorePayload = (organizationId: string, input: CreateTenantHealthScoreInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    score_key: input.scoreKey ?? "",
    overall_score: input.overallScore ?? 0,
});

export const buildOnboardingChecklistPayload = (organizationId: string, input: CreateOnboardingChecklistInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    checklist_key: input.checklistKey ?? "",
    name: input.name ?? "",
});

export const buildProductAdoptionPayload = (organizationId: string, input: CreateProductAdoptionInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    adoption_key: input.adoptionKey ?? "",
    module_name: input.moduleName ?? "",
    adoption_percent: input.adoptionPercent ?? 0,
});

export const buildRenewalTrackingPayload = (organizationId: string, input: CreateRenewalTrackingInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    renewal_key: input.renewalKey ?? "",
    renewal_date: input.renewalDate ?? "",
    renewal_value_usd: input.renewalValueUsd ?? 0,
});

export const buildSupportSummaryPayload = (organizationId: string, input: CreateSupportSummaryInput) => ({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    summary_key: input.summaryKey ?? "",
});