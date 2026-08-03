export const ELR_TABS = {
    overview: "overview",
    readinessHubs: "readinessHubs",
    environmentValidations: "environmentValidations",
    configurationValidations: "configurationValidations",
    secretsValidations: "secretsValidations",
    deploymentPlans: "deploymentPlans",
    rollbackPlans: "rollbackPlans",
    versionRegistry: "versionRegistry",
    releaseNotes: "releaseNotes",
    backupPolicies: "backupPolicies",
    backupVerifications: "backupVerifications",
    restoreVerifications: "restoreVerifications",
    recoveryDrills: "recoveryDrills",
    observabilityLogs: "observabilityLogs",
    observabilityMetrics: "observabilityMetrics",
    traceRecords: "traceRecords",
    slaMonitors: "slaMonitors",
    securityChecklists: "securityChecklists",
    vulnerabilityReviews: "vulnerabilityReviews",
    permissionAudits: "permissionAudits",
    complianceReviews: "complianceReviews",
    adminGuides: "adminGuides",
    userGuides: "userGuides",
    deploymentGuides: "deploymentGuides",
    launchScoreMetrics: "launchScoreMetrics",
    readinessValidations: "readinessValidations",
    launchBlockers: "launchBlockers",
    scoreSnapshots: "scoreSnapshots",
    launchHealth: "launchHealth",
    criticalIssues: "criticalIssues",
    readinessWarnings: "readinessWarnings",
    launchFailures: "launchFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const LOG_LEVEL_OPTIONS = [
    { value: "debug", label: "Debug" },
    { value: "info", label: "Info" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "critical", label: "Critical" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const ELR_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
] as const;

export const ELR_PERMISSIONS = ["elr.view", "elr.manage", "elr.approve", "elr.admin"] as const;


export const ELR_THEME = {
    primary: "rose-600",
    primaryHover: "rose-500",
    ring: "rose-500/20",
    text: "text-rose-600",
    textDark: "dark:text-rose-400",
    bg: "bg-rose-600",
    bgHover: "hover:bg-rose-500",
} as const;
