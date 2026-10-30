export const DWE_TABS = {
    overview: "overview",
    workflowHubs: "workflowHubs",
    workflowDefinitions: "workflowDefinitions",
    workflowCategories: "workflowCategories",
    workflowTemplates: "workflowTemplates",
    workflowVersions: "workflowVersions",
    workflowNodes: "workflowNodes",
    workflowTransitions: "workflowTransitions",
    decisionNodes: "decisionNodes",
    reusableSubflows: "reusableSubflows",
    workflowExecutions: "workflowExecutions",
    executionHistory: "executionHistory",
    executionRetries: "executionRetries",
    executionRollbacks: "executionRollbacks",
    timeTriggers: "timeTriggers",
    businessEventTriggers: "businessEventTriggers",
    webhookTriggers: "webhookTriggers",
    scheduledTriggers: "scheduledTriggers",
    manualReviews: "manualReviews",
    approvalTasks: "approvalTasks",
    escalationRules: "escalationRules",
    slaTrackings: "slaTrackings",
    automationNotifications: "automationNotifications",
    automationApiCalls: "automationApiCalls",
    automationIntegrations: "automationIntegrations",
    executionAnalytics: "executionAnalytics",
    bottleneckReports: "bottleneckReports",
    slaComplianceMetrics: "slaComplianceMetrics",
    workflowMetrics: "workflowMetrics",
    workflowHealth: "workflowHealth",
    failedExecutions: "failedExecutions",
    workflowFailures: "workflowFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const DWE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "Submitted" },
] as const;

export const DWE_PERMISSIONS = ["dwe.view", "dwe.manage", "dwe.approve", "dwe.admin"] as const;


export const DWE_THEME = {
    primary: "text-[var(--dos-brand-primary)]",
    primaryHover: "hover:text-[var(--dos-brand-primary-hover)]",
    ring: "ring-[color-mix(in_oklab,var(--dos-brand-primary)_20%,transparent)]",
    text: "text-[var(--dos-brand-primary)]",
    textDark: "dark:text-[var(--dos-brand-primary-hover)]",
    bg: "bg-[color-mix(in_oklab,var(--dos-brand-primary)_12%,transparent)]",
    bgHover: "hover:bg-[color-mix(in_oklab,var(--dos-brand-primary)_8%,transparent)]",
} as const;
