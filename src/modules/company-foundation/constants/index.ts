export const CMP_TABS = {
    overview: "overview",
    companyHubs: "companyHubs",
    brandProfiles: "brandProfiles",
    logoAssets: "logoAssets",
    themeConfigs: "themeConfigs",
    brandAssets: "brandAssets",
    websitePages: "websitePages",
    websiteFeatures: "websiteFeatures",
    websiteSections: "websiteSections",
    demoRequests: "demoRequests",
    pricingPlans: "pricingPlans",
    pricingPackages: "pricingPackages",
    modulePricing: "modulePricing",
    discountRules: "discountRules",
    proposals: "proposals",
    proposalDocuments: "proposalDocuments",
    proposalContracts: "proposalContracts",
    proposalHistory: "proposalHistory",
    portalDashboards: "portalDashboards",
    portalSubscriptions: "portalSubscriptions",
    portalBilling: "portalBilling",
    portalSupport: "portalSupport",
    docGuides: "docGuides",
    docApiReferences: "docApiReferences",
    docVersions: "docVersions",
    demoOrganizations: "demoOrganizations",
    demoDataSets: "demoDataSets",
    demoUsers: "demoUsers",
    companyMetrics: "companyMetrics",
    companyHealth: "companyHealth",
    executiveKpis: "executiveKpis",
    companyFailures: "companyFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const BRAND_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
    { value: "pending", label: "Pending" },
] as const;

export const DEMO_REQUEST_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const PROPOSAL_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

export const CONTRACT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "signed", label: "Signed" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const SUBSCRIPTION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "trial", label: "Trial" },
    { value: "cancelled", label: "Cancelled" },
    { value: "expired", label: "Expired" },
] as const;

export const SUPPORT_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const CMP_PERMISSIONS = ["cmp.view", "cmp.manage", "cmp.approve", "cmp.admin"] as const;

export const CMP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "published", label: "Published" },
    { value: "completed", label: "Completed" },
] as const;


export const CMP_THEME = {
    primary: "emerald-600",
    primaryHover: "emerald-500",
    ring: "emerald-500/20",
    text: "text-emerald-600",
    textDark: "dark:text-emerald-400",
    bg: "bg-emerald-600",
    bgHover: "hover:bg-emerald-500",
} as const;
