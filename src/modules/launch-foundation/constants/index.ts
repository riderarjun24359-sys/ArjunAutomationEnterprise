export const ELF_TABS = {
    overview: "overview",
    launchHubs: "launchHubs",
    organizationProvisions: "organizationProvisions",
    tenantProvisions: "tenantProvisions",
    industryPackAssignments: "industryPackAssignments",
    moduleLicenses: "moduleLicenses",
    wizardProfiles: "wizardProfiles",
    wizardBranding: "wizardBranding",
    wizardDepartments: "wizardDepartments",
    wizardSettings: "wizardSettings",
    importJobs: "importJobs",
    importValidations: "importValidations",
    importPreviews: "importPreviews",
    importHistory: "importHistory",
    goLiveChecklists: "goLiveChecklists",
    goLiveScores: "goLiveScores",
    deploymentStatuses: "deploymentStatuses",
    readinessValidations: "readinessValidations",
    customerHealthScores: "customerHealthScores",
    platformAdoption: "platformAdoption",
    featureUsage: "featureUsage",
    renewalTracking: "renewalTracking",
    supportTickets: "supportTickets",
    knowledgeBaseArticles: "knowledgeBaseArticles",
    incidentTracking: "incidentTracking",
    customerRegistry: "customerRegistry",
    subscriptionRecords: "subscriptionRecords",
    licenseManagement: "licenseManagement",
    launchMetrics: "launchMetrics",
    launchHealth: "launchHealth",
    missionControlKpis: "missionControlKpis",
    launchFailures: "launchFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const PROVISION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "failed", label: "Failed" },
    { value: "suspended", label: "Suspended" },
] as const;

export const LICENSE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "suspended", label: "Suspended" },
    { value: "pending", label: "Pending" },
] as const;

export const IMPORT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const DEPLOYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "deploying", label: "Deploying" },
    { value: "deployed", label: "Deployed" },
    { value: "failed", label: "Failed" },
] as const;

export const RENEWAL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "at_risk", label: "At Risk" },
    { value: "churned", label: "Churned" },
] as const;

export const TICKET_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const SUBSCRIPTION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "trial", label: "Trial" },
    { value: "cancelled", label: "Cancelled" },
    { value: "expired", label: "Expired" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const ELF_PERMISSIONS = ["elf.view", "elf.manage", "elf.approve", "elf.admin"] as const;

export const ELF_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "deployed", label: "Deployed" },
    { value: "completed", label: "Completed" },
] as const;


export const ELF_THEME = {
    primary: "slate-600",
    primaryHover: "slate-500",
    ring: "slate-500/20",
    text: "text-slate-600",
    textDark: "dark:text-slate-400",
    bg: "bg-slate-600",
    bgHover: "hover:bg-slate-500",
} as const;
