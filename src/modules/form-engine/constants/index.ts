export const DFE_TABS = {
    overview: "overview",
    formHubs: "formHubs",
    formDefinitions: "formDefinitions",
    formCategories: "formCategories",
    formVersions: "formVersions",
    formDependencies: "formDependencies",
    formSections: "formSections",
    formTabs: "formTabs",
    formGroups: "formGroups",
    repeatableSections: "repeatableSections",
    formFields: "formFields",
    fieldOptions: "fieldOptions",
    formulaFields: "formulaFields",
    mediaFields: "mediaFields",
    requiredRules: "requiredRules",
    regexRules: "regexRules",
    rangeRules: "rangeRules",
    crossFieldRules: "crossFieldRules",
    formDrafts: "formDrafts",
    formSubmissions: "formSubmissions",
    formReviews: "formReviews",
    executionAuditEntries: "executionAuditEntries",
    renderProfiles: "renderProfiles",
    themeConfigs: "themeConfigs",
    localizationPacks: "localizationPacks",
    submissionAnalytics: "submissionAnalytics",
    completionMetrics: "completionMetrics",
    usageTrends: "usageTrends",
    formMetrics: "formMetrics",
    formHealth: "formHealth",
    pendingReviewItems: "pendingReviewItems",
    formFailures: "formFailures",
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

export const DFE_STATUS_OPTIONS = [
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

export const DFE_PERMISSIONS = ["dfe.view", "dfe.manage", "dfe.approve", "dfe.admin"] as const;


export const DFE_THEME = {
    primary: "amber-600",
    primaryHover: "amber-500",
    ring: "amber-500/20",
    text: "text-amber-600",
    textDark: "dark:text-amber-400",
    bg: "bg-amber-600",
    bgHover: "hover:bg-amber-500",
} as const;
