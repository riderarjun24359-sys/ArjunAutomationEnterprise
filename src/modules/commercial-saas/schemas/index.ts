import { z } from "zod";

export const tenantFormSchema = z.object({
    tenantKey: z.string().min(2),
    companyName: z.string().min(2),
    currentPlan: z.string().optional(),
    domainSlug: z.string().optional(),
    summary: z.string().optional(),
});

export const registrationsFormSchema = z.object({
    tenantId: z.string().min(1),
    registrationKey: z.string().min(2),
    companyName: z.string().min(2),
    ownerEmail: z.string().min(2),
    ownerName: z.string().min(2),
});

export const tenantProfilesFormSchema = z.object({
    tenantId: z.string().min(1),
    profileKey: z.string().min(2),
    legalName: z.string().min(2),
    industry: z.string().min(2).optional(),
    billingEmail: z.string().min(2),
});

export const domainConfigsFormSchema = z.object({
    tenantId: z.string().min(1),
    domainKey: z.string().min(2),
    subdomain: z.string().min(2).optional(),
    customDomain: z.string().min(2).optional(),
});

export const emailVerificationsFormSchema = z.object({
    tenantId: z.string().min(1),
    verificationKey: z.string().min(2),
    email: z.string().min(2).optional(),
});

export const trialsFormSchema = z.object({
    tenantId: z.string().min(1),
    trialKey: z.string().min(2),
    planTier: z.string().min(2),
});

export const workspaceSetupsFormSchema = z.object({
    tenantId: z.string().min(1),
    setupKey: z.string().min(2),
    workspaceName: z.string().min(2),
});

export const roleProvisionsFormSchema = z.object({
    tenantId: z.string().min(1),
    provisionKey: z.string().min(2),
    roleName: z.string().min(2),
});

export const welcomeExperiencesFormSchema = z.object({
    tenantId: z.string().min(1),
    experienceKey: z.string().min(2),
    title: z.string().min(2).optional(),
});

export const subscriptionsFormSchema = z.object({
    tenantId: z.string().min(1),
    subscriptionKey: z.string().min(2),
    planTier: z.string().min(2),
    billingCycle: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const planLimitsFormSchema = z.object({
    tenantId: z.string().min(1),
    limitKey: z.string().min(2),
    planTier: z.string().min(2),
    resourceType: z.string().min(2),
    limitValue: z.number().optional(),
});

export const subscriptionEventsFormSchema = z.object({
    tenantId: z.string().min(1),
    eventKey: z.string().min(2),
    eventType: z.string().min(2),
    fromPlan: z.string().min(2).optional(),
    toPlan: z.string().min(2).optional(),
});

export const licensesFormSchema = z.object({
    tenantId: z.string().min(1),
    licenseKey: z.string().min(2),
    name: z.string().min(2).optional(),
    licenseType: z.string().min(2),
    totalUnits: z.number().optional(),
});

export const licenseAllocationsFormSchema = z.object({
    tenantId: z.string().min(1),
    allocationKey: z.string().min(2),
    resourceName: z.string().min(2),
    resourceType: z.string().min(2),
    allocatedUnits: z.number().optional(),
});

export const featureFlagsFormSchema = z.object({
    tenantId: z.string().min(1),
    flagKey: z.string().min(2),
    name: z.string().min(2).optional(),
    moduleSource: z.string().min(2).optional(),
});

export const portalSettingsFormSchema = z.object({
    tenantId: z.string().min(1),
    settingsKey: z.string().min(2),
    portalName: z.string().min(2),
});

export const portalBrandingFormSchema = z.object({
    tenantId: z.string().min(1),
    brandingKey: z.string().min(2),
    primaryColor: z.string().min(2),
    accentColor: z.string().min(2),
});

export const portalIntegrationsFormSchema = z.object({
    tenantId: z.string().min(1),
    integrationKey: z.string().min(2),
    provider: z.string().min(2).optional(),
});

export const portalApiKeysFormSchema = z.object({
    tenantId: z.string().min(1),
    keyName: z.string().min(2),
});

export const usageMetersFormSchema = z.object({
    tenantId: z.string().min(1),
    meterKey: z.string().min(2),
    meterType: z.string().min(2),
    unitLabel: z.string().min(2),
});

export const usageRecordsFormSchema = z.object({
    tenantId: z.string().min(1),
    recordKey: z.string().min(2),
    meterType: z.string().min(2),
    quantity: z.number().optional(),
});

export const invoicesFormSchema = z.object({
    tenantId: z.string().min(1),
    invoiceKey: z.string().min(2),
    invoiceNumber: z.string().min(2).optional(),
    amountUsd: z.number().optional(),
});

export const billingCreditsFormSchema = z.object({
    tenantId: z.string().min(1),
    creditKey: z.string().min(2),
    reason: z.string().min(2).optional(),
    balanceUsd: z.number().optional(),
});

export const billingCouponsFormSchema = z.object({
    tenantId: z.string().min(1),
    couponKey: z.string().min(2),
    code: z.string().min(2).optional(),
    discountType: z.string().min(2),
    discountValue: z.number().optional(),
});

export const recurringBillingFormSchema = z.object({
    tenantId: z.string().min(1),
    billingKey: z.string().min(2),
    billingCycle: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const healthScoresFormSchema = z.object({
    tenantId: z.string().min(1),
    scoreKey: z.string().min(2),
    overallScore: z.number().optional(),
});

export const onboardingChecklistsFormSchema = z.object({
    tenantId: z.string().min(1),
    checklistKey: z.string().min(2),
    name: z.string().min(2).optional(),
});

export const productAdoptionFormSchema = z.object({
    tenantId: z.string().min(1),
    adoptionKey: z.string().min(2),
    moduleName: z.string().min(2),
    adoptionPercent: z.number().optional(),
});

export const renewalTrackingFormSchema = z.object({
    tenantId: z.string().min(1),
    renewalKey: z.string().min(2),
    renewalDate: z.string().min(2),
    renewalValueUsd: z.number().optional(),
});

export const supportSummariesFormSchema = z.object({
    tenantId: z.string().min(1),
    summaryKey: z.string().min(2),
});

export const adminMetricFormSchema = z.object({
    metricsKey: z.string().min(2),
    mrrUsd: z.number().optional(),
    arrUsd: z.number().optional(),
    activeTenants: z.number().optional(),
    trialTenants: z.number().optional(),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;
export type RegistrationsFormValues = z.infer<typeof registrationsFormSchema>;
export type TenantProfilesFormValues = z.infer<typeof tenantProfilesFormSchema>;
export type DomainConfigsFormValues = z.infer<typeof domainConfigsFormSchema>;
export type EmailVerificationsFormValues = z.infer<typeof emailVerificationsFormSchema>;
export type TrialsFormValues = z.infer<typeof trialsFormSchema>;
export type WorkspaceSetupsFormValues = z.infer<typeof workspaceSetupsFormSchema>;
export type RoleProvisionsFormValues = z.infer<typeof roleProvisionsFormSchema>;
export type WelcomeExperiencesFormValues = z.infer<typeof welcomeExperiencesFormSchema>;
export type SubscriptionsFormValues = z.infer<typeof subscriptionsFormSchema>;
export type PlanLimitsFormValues = z.infer<typeof planLimitsFormSchema>;
export type SubscriptionEventsFormValues = z.infer<typeof subscriptionEventsFormSchema>;
export type LicensesFormValues = z.infer<typeof licensesFormSchema>;
export type LicenseAllocationsFormValues = z.infer<typeof licenseAllocationsFormSchema>;
export type FeatureFlagsFormValues = z.infer<typeof featureFlagsFormSchema>;
export type PortalSettingsFormValues = z.infer<typeof portalSettingsFormSchema>;
export type PortalBrandingFormValues = z.infer<typeof portalBrandingFormSchema>;
export type PortalIntegrationsFormValues = z.infer<typeof portalIntegrationsFormSchema>;
export type PortalApiKeysFormValues = z.infer<typeof portalApiKeysFormSchema>;
export type UsageMetersFormValues = z.infer<typeof usageMetersFormSchema>;
export type UsageRecordsFormValues = z.infer<typeof usageRecordsFormSchema>;
export type InvoicesFormValues = z.infer<typeof invoicesFormSchema>;
export type BillingCreditsFormValues = z.infer<typeof billingCreditsFormSchema>;
export type BillingCouponsFormValues = z.infer<typeof billingCouponsFormSchema>;
export type RecurringBillingFormValues = z.infer<typeof recurringBillingFormSchema>;
export type HealthScoresFormValues = z.infer<typeof healthScoresFormSchema>;
export type OnboardingChecklistsFormValues = z.infer<typeof onboardingChecklistsFormSchema>;
export type ProductAdoptionFormValues = z.infer<typeof productAdoptionFormSchema>;
export type RenewalTrackingFormValues = z.infer<typeof renewalTrackingFormSchema>;
export type SupportSummariesFormValues = z.infer<typeof supportSummariesFormSchema>;
export type AdminMetricFormValues = z.infer<typeof adminMetricFormSchema>;
