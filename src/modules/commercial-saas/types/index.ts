export type CommercialSaasTab =
    | "overview"
    | "tenants"
    | "registrations"
    | "tenantProfiles"
    | "domains"
    | "emailVerification"
    | "trials"
    | "workspaceSetup"
    | "roleProvisions"
    | "welcomeExperience"
    | "subscriptions"
    | "planLimits"
    | "subscriptionEvents"
    | "licenses"
    | "licenseAllocations"
    | "featureFlags"
    | "portalSettings"
    | "portalBranding"
    | "portalIntegrations"
    | "portalApiKeys"
    | "usageMeters"
    | "usageRecords"
    | "invoices"
    | "billingCredits"
    | "billingCoupons"
    | "recurringBilling"
    | "healthScores"
    | "onboardingChecklists"
    | "productAdoption"
    | "renewalTracking"
    | "supportSummaries"
    | "adminMetrics"
    | "audit"
    | "api";

export interface SaasDashboardStats {
    totalTenants: number;
    activeTenants: number;
    trialTenants: number;
    subscriptionCount: number;
    licenseCount: number;
    usageMeterCount: number;
    invoiceCount: number;
    mrrUsd: number;
    arrUsd: number;
    avgHealthScore: number;
    registrationCount: number;
    featureFlagCount: number;
    portalApiKeyCount: number;
    renewalCount: number;
    auditCount: number;
}

export interface SaasPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface TenantSummary {
    id: string;
    companyName: string;
    tenantKey: string;
    currentPlan: string;
    tenantStatus: string;
    domainSlug: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface CreateTenantInput {
    tenantKey: string;
    companyName: string;
    currentPlan?: string;
    domainSlug?: string;
    summary?: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface AdminMetricSummary {
    id: string;
    metricsKey: string;
    metricDate: string;
    activeTenants: number;
    trialTenants: number;
    mrrUsd: number;
    arrUsd: number;
    churnRatePercent: number;
    avgHealthScore: number;
    status: string;
}

export interface CreateAdminMetricInput {
    metricsKey: string;
    metricDate?: string;
    activeTenants?: number;
    trialTenants?: number;
    mrrUsd?: number;
    arrUsd?: number;
    churnRatePercent?: number;
    avgHealthScore?: number;
}

export interface RegistrationSummary {
    id: string;
    tenantName: string;
    registrationKey: string;
    companyName: string;
    ownerEmail: string;
    status: string;
}

export interface CreateRegistrationInput {
    tenantId: string;
    registrationKey?: string;
    companyName?: string;
    ownerEmail?: string;
    ownerName?: string;
}

export interface TenantProfileSummary {
    id: string;
    tenantName: string;
    profileKey: string;
    legalName: string;
    billingEmail: string;
    status: string;
}

export interface CreateTenantProfileInput {
    tenantId: string;
    profileKey?: string;
    legalName?: string;
    industry?: string;
    billingEmail?: string;
}

export interface DomainConfigSummary {
    id: string;
    tenantName: string;
    domainKey: string;
    subdomain: string;
    sslStatus: string;
    status: string;
}

export interface CreateDomainConfigInput {
    tenantId: string;
    domainKey?: string;
    subdomain?: string;
    customDomain?: string;
}

export interface EmailVerificationSummary {
    id: string;
    tenantName: string;
    verificationKey: string;
    email: string;
    status: string;
}

export interface CreateEmailVerificationInput {
    tenantId: string;
    verificationKey?: string;
    email?: string;
}

export interface TrialSummary {
    id: string;
    tenantName: string;
    trialKey: string;
    planTier: string;
    endsAt: string;
    status: string;
}

export interface CreateTrialInput {
    tenantId: string;
    trialKey?: string;
    planTier?: string;
}

export interface WorkspaceSetupSummary {
    id: string;
    tenantName: string;
    setupKey: string;
    workspaceName: string;
    status: string;
}

export interface CreateWorkspaceSetupInput {
    tenantId: string;
    setupKey?: string;
    workspaceName?: string;
}

export interface TenantRoleProvisionSummary {
    id: string;
    tenantName: string;
    provisionKey: string;
    roleName: string;
    status: string;
}

export interface CreateTenantRoleProvisionInput {
    tenantId: string;
    provisionKey?: string;
    roleName?: string;
}

export interface WelcomeExperienceSummary {
    id: string;
    tenantName: string;
    experienceKey: string;
    title: string;
    status: string;
}

export interface CreateWelcomeExperienceInput {
    tenantId: string;
    experienceKey?: string;
    title?: string;
}

export interface SubscriptionSummary {
    id: string;
    tenantName: string;
    subscriptionKey: string;
    planTier: string;
    amountUsd: number;
    status: string;
}

export interface CreateSubscriptionInput {
    tenantId: string;
    subscriptionKey?: string;
    planTier?: string;
    billingCycle?: string;
    amountUsd?: number;
}

export interface PlanLimitSummary {
    id: string;
    tenantName: string;
    limitKey: string;
    planTier: string;
    limitValue: number;
    status: string;
}

export interface CreatePlanLimitInput {
    tenantId: string;
    limitKey?: string;
    planTier?: string;
    resourceType?: string;
    limitValue?: number;
}

export interface SubscriptionEventSummary {
    id: string;
    tenantName: string;
    eventKey: string;
    eventType: string;
    toPlan: string;
    status: string;
}

export interface CreateSubscriptionEventInput {
    tenantId: string;
    eventKey?: string;
    eventType?: string;
    fromPlan?: string;
    toPlan?: string;
}

export interface LicenseSummary {
    id: string;
    tenantName: string;
    licenseKey: string;
    name: string;
    totalUnits: number;
    status: string;
}

export interface CreateLicenseInput {
    tenantId: string;
    licenseKey?: string;
    name?: string;
    licenseType?: string;
    totalUnits?: number;
}

export interface LicenseAllocationSummary {
    id: string;
    tenantName: string;
    allocationKey: string;
    resourceName: string;
    allocatedUnits: number;
    status: string;
}

export interface CreateLicenseAllocationInput {
    tenantId: string;
    allocationKey?: string;
    resourceName?: string;
    resourceType?: string;
    allocatedUnits?: number;
}

export interface FeatureFlagSummary {
    id: string;
    tenantName: string;
    flagKey: string;
    name: string;
    enabled: boolean;
    status: string;
}

export interface CreateFeatureFlagInput {
    tenantId: string;
    flagKey?: string;
    name?: string;
    moduleSource?: string;
}

export interface PortalSettingSummary {
    id: string;
    tenantName: string;
    settingsKey: string;
    portalName: string;
    status: string;
}

export interface CreatePortalSettingInput {
    tenantId: string;
    settingsKey?: string;
    portalName?: string;
}

export interface PortalBrandingSummary {
    id: string;
    tenantName: string;
    brandingKey: string;
    primaryColor: string;
    status: string;
}

export interface CreatePortalBrandingInput {
    tenantId: string;
    brandingKey?: string;
    primaryColor?: string;
    accentColor?: string;
}

export interface PortalIntegrationSummary {
    id: string;
    tenantName: string;
    integrationKey: string;
    provider: string;
    status: string;
}

export interface CreatePortalIntegrationInput {
    tenantId: string;
    integrationKey?: string;
    provider?: string;
}

export interface PortalApiKeySummary {
    id: string;
    tenantName: string;
    keyName: string;
    status: string;
}

export interface CreatePortalApiKeyInput {
    tenantId: string;
    keyName?: string;
}

export interface UsageMeterSummary {
    id: string;
    tenantName: string;
    meterKey: string;
    meterType: string;
    currentPeriodUsage: number;
    status: string;
}

export interface CreateUsageMeterInput {
    tenantId: string;
    meterKey?: string;
    meterType?: string;
    unitLabel?: string;
}

export interface UsageRecordSummary {
    id: string;
    tenantName: string;
    recordKey: string;
    meterType: string;
    quantity: number;
    status: string;
}

export interface CreateUsageRecordInput {
    tenantId: string;
    recordKey?: string;
    meterType?: string;
    quantity?: number;
}

export interface CommercialInvoiceSummary {
    id: string;
    tenantName: string;
    invoiceKey: string;
    invoiceNumber: string;
    amountUsd: number;
    status: string;
}

export interface CreateCommercialInvoiceInput {
    tenantId: string;
    invoiceKey?: string;
    invoiceNumber?: string;
    amountUsd?: number;
}

export interface BillingCreditSummary {
    id: string;
    tenantName: string;
    creditKey: string;
    reason: string;
    balanceUsd: number;
    status: string;
}

export interface CreateBillingCreditInput {
    tenantId: string;
    creditKey?: string;
    reason?: string;
    balanceUsd?: number;
}

export interface BillingCouponSummary {
    id: string;
    tenantName: string;
    couponKey: string;
    code: string;
    discountValue: number;
    status: string;
}

export interface CreateBillingCouponInput {
    tenantId: string;
    couponKey?: string;
    code?: string;
    discountType?: string;
    discountValue?: number;
}

export interface RecurringBillingSummary {
    id: string;
    tenantName: string;
    billingKey: string;
    billingCycle: string;
    amountUsd: number;
    status: string;
}

export interface CreateRecurringBillingInput {
    tenantId: string;
    billingKey?: string;
    billingCycle?: string;
    amountUsd?: number;
}

export interface TenantHealthScoreSummary {
    id: string;
    tenantName: string;
    scoreKey: string;
    overallScore: number;
    status: string;
}

export interface CreateTenantHealthScoreInput {
    tenantId: string;
    scoreKey?: string;
    overallScore?: number;
}

export interface OnboardingChecklistSummary {
    id: string;
    tenantName: string;
    checklistKey: string;
    name: string;
    status: string;
}

export interface CreateOnboardingChecklistInput {
    tenantId: string;
    checklistKey?: string;
    name?: string;
}

export interface ProductAdoptionSummary {
    id: string;
    tenantName: string;
    adoptionKey: string;
    moduleName: string;
    adoptionPercent: number;
    status: string;
}

export interface CreateProductAdoptionInput {
    tenantId: string;
    adoptionKey?: string;
    moduleName?: string;
    adoptionPercent?: number;
}

export interface RenewalTrackingSummary {
    id: string;
    tenantName: string;
    renewalKey: string;
    renewalDate: string;
    renewalValueUsd: number;
    status: string;
}

export interface CreateRenewalTrackingInput {
    tenantId: string;
    renewalKey?: string;
    renewalDate?: string;
    renewalValueUsd?: number;
}

export interface SupportSummarySummary {
    id: string;
    tenantName: string;
    summaryKey: string;
    openTickets: number;
    satisfactionScore: number;
    status: string;
}

export interface CreateSupportSummaryInput {
    tenantId: string;
    summaryKey?: string;
}

export interface SaasSdkRegisterTenantInput {
    tenantKey: string;
    companyName: string;
    ownerEmail: string;
    ownerName?: string;
    planTier?: string;
}

export interface SaasSdkRegisterTenantResult {
    tenantId: string;
    tenantKey: string;
    registrationId: string;
    trialId: string;
    aiTaskId?: string | null;
}

export interface SaasSdkManageSubscriptionInput {
    tenantId: string;
    subscriptionKey: string;
    planTier: string;
    billingCycle?: string;
    amountUsd?: number;
}

export interface SaasSdkManageSubscriptionResult {
    subscriptionId: string;
    subscriptionKey: string;
    planTier: string;
    status: string;
}

export interface SaasSdkTrackUsageInput {
    tenantId: string;
    recordKey: string;
    meterType: string;
    quantity: number;
}

export interface SaasSdkTrackUsageResult {
    recordId: string;
    recordKey: string;
    meterType: string;
    quantity: number;
}
