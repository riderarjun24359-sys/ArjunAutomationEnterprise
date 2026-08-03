export const EOC_TABS = {
    overview: "overview",
    operationsCenters: "operationsCenters",
    overallHealth: "overallHealth",
    moduleHealth: "moduleHealth",
    databaseHealth: "databaseHealth",
    jobSchedulers: "jobSchedulers",
    recurringJobs: "recurringJobs",
    jobRetryQueue: "jobRetryQueue",
    jobDeadLetter: "jobDeadLetter",
    platformEvents: "platformEvents",
    businessEvents: "businessEvents",
    eventSubscriptions: "eventSubscriptions",
    eventReplays: "eventReplays",
    alerts: "alerts",
    escalationRules: "escalationRules",
    alertAcknowledgements: "alertAcknowledgements",
    maintenanceWindows: "maintenanceWindows",
    globalFlags: "globalFlags",
    tenantFlags: "tenantFlags",
    betaFeatures: "betaFeatures",
    rolloutConfigs: "rolloutConfigs",
    platformConfigs: "platformConfigs",
    tenantConfigs: "tenantConfigs",
    secretsMetadata: "secretsMetadata",
    configVersions: "configVersions",
    platformLogs: "platformLogs",
    platformMetrics: "platformMetrics",
    traceSummaries: "traceSummaries",
    serviceRegistry: "serviceRegistry",
    operationsMetrics: "operationsMetrics",
    operationsHealth: "operationsHealth",
    operationsFailures: "operationsFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const HEALTH_TYPE_OPTIONS = [
    { value: "overall", label: "Overall" },
    { value: "module", label: "Module" },
    { value: "database", label: "Database" },
    { value: "queue", label: "Queue" },
    { value: "storage", label: "Storage" },
    { value: "ai", label: "AI" },
    { value: "api", label: "API" },
    { value: "integration", label: "Integration" },
] as const;

export const JOB_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "healthy", label: "Healthy" },
] as const;

export const EVENT_TYPE_OPTIONS = [
    { value: "platform", label: "Platform" },
    { value: "business", label: "Business" },
    { value: "ai", label: "AI" },
    { value: "customer", label: "Customer" },
    { value: "audit", label: "Audit" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const LOG_LEVEL_OPTIONS = [
    { value: "debug", label: "Debug" },
    { value: "info", label: "Info" },
    { value: "warn", label: "Warn" },
    { value: "error", label: "Error" },
] as const;

export const EOC_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
] as const;

export const EOC_PERMISSIONS = ["eoc.view", "eoc.manage", "eoc.approve", "eoc.admin"] as const;

export const EOC_THEME = {
    primary: "emerald-600",
    primaryHover: "emerald-500",
    ring: "emerald-500/20",
    text: "text-emerald-600",
    textDark: "dark:text-emerald-400",
    bg: "bg-emerald-600",
    bgHover: "hover:bg-emerald-500",
} as const;
