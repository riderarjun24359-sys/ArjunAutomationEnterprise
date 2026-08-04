export const COP_TABS = {
    overview: "overview",
    operatedHubs: "operatedHubs",
    signupFlows: "signupFlows",
    orgProvisioning: "orgProvisioning",
    domainOnboarding: "domainOnboarding",
    emailVerifications: "emailVerifications",
    onboardingWizards: "onboardingWizards",
    productionProfiles: "productionProfiles",
    deploymentJobs: "deploymentJobs",
    healthValidations: "healthValidations",
    rollbackAutomations: "rollbackAutomations",
    deploymentAudits: "deploymentAudits",
    centralLogs: "centralLogs",
    metricsCollectors: "metricsCollectors",
    distributedTraces: "distributedTraces",
    alertRules: "alertRules",
    incidentTimelines: "incidentTimelines",
    backupSchedulers: "backupSchedulers",
    restoreValidations: "restoreValidations",
    maintenanceModes: "maintenanceModes",
    featureFlagOps: "featureFlagOps",
    platformDiagnostics: "platformDiagnostics",
    betaOrganizations: "betaOrganizations",
    betaInvitations: "betaInvitations",
    feedbackCollection: "feedbackCollection",
    featureRequests: "featureRequests",
    bugReports: "bugReports",
    releaseChannels: "releaseChannels",
    operatedMetrics: "operatedMetrics",
    operatedHealth: "operatedHealth",
    executiveBriefings: "executiveBriefings",
    platformFailures: "platformFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const FLOW_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
] as const;

export const PROVISION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const DOMAIN_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "failed", label: "Failed" },
] as const;

export const VERIFICATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "expired", label: "Expired" },
] as const;

export const WIZARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
] as const;

export const PROFILE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const JOB_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const VALIDATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const ROLLBACK_STATUS_OPTIONS = [
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const AUDIT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const COLLECTOR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "failed", label: "Failed" },
] as const;

export const TRACE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const INCIDENT_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "investigating", label: "Investigating" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const SCHEDULE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "disabled", label: "Disabled" },
] as const;

export const RESTORE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "validated", label: "Validated" },
    { value: "failed", label: "Failed" },
] as const;

export const MAINTENANCE_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
] as const;

export const FLAG_STATUS_OPTIONS = [
    { value: "enabled", label: "Enabled" },
    { value: "disabled", label: "Disabled" },
    { value: "rollout", label: "Rollout" },
] as const;

export const DIAGNOSTIC_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const BETA_STATUS_OPTIONS = [
    { value: "invited", label: "Invited" },
    { value: "active", label: "Active" },
    { value: "graduated", label: "Graduated" },
    { value: "churned", label: "Churned" },
] as const;

export const INVITATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "expired", label: "Expired" },
] as const;

export const REQUEST_STATUS_OPTIONS = [
    { value: "submitted", label: "Submitted" },
    { value: "reviewing", label: "Reviewing" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
] as const;

export const BUG_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const CHANNEL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const COP_PERMISSIONS = ["cop.view", "cop.manage", "cop.approve", "cop.admin"] as const;

export const COP_STATUS_OPTIONS = [
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


export const COP_THEME = {
    primary: "violet-600",
    primaryHover: "violet-500",
    ring: "violet-500/20",
    text: "text-violet-600",
    textDark: "dark:text-violet-400",
    bg: "bg-violet-600",
    bgHover: "hover:bg-violet-500",
} as const;
