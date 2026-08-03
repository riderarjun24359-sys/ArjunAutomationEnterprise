export const COMMERCIAL_SAAS_TABS = {
    overview: "overview",
    tenants: "tenants",
    registrations: "registrations",
    tenantProfiles: "tenantProfiles",
    domains: "domains",
    emailVerification: "emailVerification",
    trials: "trials",
    workspaceSetup: "workspaceSetup",
    roleProvisions: "roleProvisions",
    welcomeExperience: "welcomeExperience",
    subscriptions: "subscriptions",
    planLimits: "planLimits",
    subscriptionEvents: "subscriptionEvents",
    licenses: "licenses",
    licenseAllocations: "licenseAllocations",
    featureFlags: "featureFlags",
    portalSettings: "portalSettings",
    portalBranding: "portalBranding",
    portalIntegrations: "portalIntegrations",
    portalApiKeys: "portalApiKeys",
    usageMeters: "usageMeters",
    usageRecords: "usageRecords",
    invoices: "invoices",
    billingCredits: "billingCredits",
    billingCoupons: "billingCoupons",
    recurringBilling: "recurringBilling",
    healthScores: "healthScores",
    onboardingChecklists: "onboardingChecklists",
    productAdoption: "productAdoption",
    renewalTracking: "renewalTracking",
    supportSummaries: "supportSummaries",
    adminMetrics: "adminMetrics",
    audit: "audit",
    api: "api",
} as const;

export const PLAN_TIER_OPTIONS = [
    { value: "trial", label: "Trial" },
    { value: "starter", label: "Starter" },
    { value: "growth", label: "Growth" },
    { value: "professional", label: "Professional" },
    { value: "enterprise", label: "Enterprise" },
] as const;

export const BILLING_CYCLE_OPTIONS = [
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual" },
] as const;

export const LICENSE_TYPE_OPTIONS = [
    { value: "seat", label: "Seat" },
    { value: "ai", label: "AI" },
    { value: "module", label: "Module" },
] as const;

export const METER_TYPE_OPTIONS = [
    { value: "users", label: "Users" },
    { value: "ai_tokens", label: "AI Tokens" },
    { value: "api_calls", label: "API Calls" },
    { value: "storage_gb", label: "Storage GB" },
] as const;

export const SAAS_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "in_progress", label: "In Progress" },
] as const;

export const SAAS_PERMISSIONS = ["saas.view", "saas.manage", "saas.approve", "saas.admin"] as const;

export const SAAS_THEME = {
    primary: "sky-600",
    primaryHover: "sky-500",
    ring: "sky-500/20",
    text: "text-sky-600",
    textDark: "dark:text-sky-400",
    bg: "bg-sky-600",
    bgHover: "hover:bg-sky-500",
} as const;
