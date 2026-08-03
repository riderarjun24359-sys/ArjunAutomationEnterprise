export const TLO_TABS = {
    overview: "overview",
    tenantContexts: "tenantContexts",
    lifecycleRecords: "lifecycleRecords",
    lifecycleTransitions: "lifecycleTransitions",
    lifecycleEvents: "lifecycleEvents",
    reactivationRequests: "reactivationRequests",
    workspaces: "workspaces",
    environmentSettings: "environmentSettings",
    storageManagement: "storageManagement",
    operationsControls: "operationsControls",
    onboardingFlows: "onboardingFlows",
    onboardingProgress: "onboardingProgress",
    onboardingValidations: "onboardingValidations",
    goLiveChecklists: "goLiveChecklists",
    marketplaceModules: "marketplaceModules",
    moduleInstallations: "moduleInstallations",
    moduleDependencies: "moduleDependencies",
    moduleCompatibility: "moduleCompatibility",
    industryPacks: "industryPacks",
    packInstallations: "packInstallations",
    packVersions: "packVersions",
    packExports: "packExports",
    healthSnapshots: "healthSnapshots",
    healthDimensions: "healthDimensions",
    healthRisks: "healthRisks",
    healthScores: "healthScores",
    successPlans: "successPlans",
    quarterlyReviews: "quarterlyReviews",
    renewalPlans: "renewalPlans",
    customerMilestones: "customerMilestones",
    commercialMetrics: "commercialMetrics",
    growthSnapshots: "growthSnapshots",
    expansionOpportunities: "expansionOpportunities",
    api: "api",
} as const;

export const LIFECYCLE_STAGE_OPTIONS = [
    { value: "lead", label: "Lead" },
    { value: "trial", label: "Trial" },
    { value: "onboarding", label: "Onboarding" },
    { value: "active", label: "Active" },
    { value: "expansion", label: "Expansion" },
    { value: "renewal", label: "Renewal" },
    { value: "at_risk", label: "At Risk" },
    { value: "churned", label: "Churned" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const INDUSTRY_PACK_OPTIONS = [
    { value: "healthcare", label: "Healthcare" },
    { value: "financial_services", label: "Financial Services" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "technology", label: "Technology" },
    { value: "professional_services", label: "Professional Services" },
    { value: "education", label: "Education" },
    { value: "government", label: "Government" },
] as const;

export const SEVERITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const TLO_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "in_progress", label: "In Progress" },
    { value: "open", label: "Open" },
    { value: "completed", label: "Completed" },
] as const;

export const TLO_PERMISSIONS = ["tlo.view", "tlo.manage", "tlo.approve", "tlo.admin"] as const;

export const TLO_THEME = {
    primary: "emerald-600",
    primaryHover: "emerald-500",
    ring: "emerald-500/20",
    text: "text-emerald-600",
    textDark: "dark:text-emerald-400",
    bg: "bg-emerald-600",
    bgHover: "hover:bg-emerald-500",
} as const;
