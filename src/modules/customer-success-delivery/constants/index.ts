export const CSD_TABS = {
    overview: "overview",
    deliveryHubs: "deliveryHubs",
    customerHealthScores: "customerHealthScores",
    adoptionAnalytics: "adoptionAnalytics",
    successPlans: "successPlans",
    customerTimelines: "customerTimelines",
    renewalForecasts: "renewalForecasts",
    supportTickets: "supportTickets",
    liveChatSessions: "liveChatSessions",
    knowledgeBaseArticles: "knowledgeBaseArticles",
    slaPolicies: "slaPolicies",
    escalationRules: "escalationRules",
    deploymentAutomations: "deploymentAutomations",
    environmentManagement: "environmentManagement",
    deploymentTracking: "deploymentTracking",
    upgradeManagement: "upgradeManagement",
    releaseTracking: "releaseTracking",
    trainingPortals: "trainingPortals",
    videoLibrary: "videoLibrary",
    productTours: "productTours",
    certifications: "certifications",
    progressTracking: "progressTracking",
    learningAnalytics: "learningAnalytics",
    deliveryWorkflows: "deliveryWorkflows",
    onboardingAutomation: "onboardingAutomation",
    implementationTracking: "implementationTracking",
    resourceAssignments: "resourceAssignments",
    milestoneTracking: "milestoneTracking",
    operationsMetrics: "operationsMetrics",
    operationsHealth: "operationsHealth",
    executiveKpis: "executiveKpis",
    deliveryFailures: "deliveryFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const PLAN_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
] as const;

export const RENEWAL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "renewed", label: "Renewed" },
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

export const SESSION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "waiting", label: "Waiting" },
    { value: "ended", label: "Ended" },
    { value: "missed", label: "Missed" },
] as const;

export const AUTOMATION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "failed", label: "Failed" },
    { value: "completed", label: "Completed" },
] as const;

export const DEPLOYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "deploying", label: "Deploying" },
    { value: "deployed", label: "Deployed" },
    { value: "failed", label: "Failed" },
] as const;

export const UPGRADE_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const RELEASE_STATUS_OPTIONS = [
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In Progress" },
    { value: "released", label: "Released" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const WORKFLOW_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const IMPLEMENTATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "blocked", label: "Blocked" },
] as const;

export const MILESTONE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "missed", label: "Missed" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const CSD_PERMISSIONS = ["csd.view", "csd.manage", "csd.approve", "csd.admin"] as const;

export const CSD_STATUS_OPTIONS = [
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


export const CSD_THEME = {
    primary: "sky-600",
    primaryHover: "sky-500",
    ring: "sky-500/20",
    text: "text-sky-600",
    textDark: "dark:text-sky-400",
    bg: "bg-sky-600",
    bgHover: "hover:bg-sky-500",
} as const;
