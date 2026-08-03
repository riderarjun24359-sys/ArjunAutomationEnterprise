export const IFR_TABS = {
    overview: "overview",
    frameworkHubs: "frameworkHubs",
    industryRegistrations: "industryRegistrations",
    industryMetadata: "industryMetadata",
    industryVersions: "industryVersions",
    industryDependencies: "industryDependencies",
    businessTypes: "businessTypes",
    businessSizes: "businessSizes",
    operatingModels: "operatingModels",
    industryProfiles: "industryProfiles",
    dashboardTemplates: "dashboardTemplates",
    workflowTemplates: "workflowTemplates",
    roleTemplates: "roleTemplates",
    reportTemplates: "reportTemplates",
    dynamicConfigurations: "dynamicConfigurations",
    featureConfigurations: "featureConfigurations",
    businessRules: "businessRules",
    validationRules: "validationRules",
    industryContexts: "industryContexts",
    aiContexts: "aiContexts",
    terminologyEntries: "terminologyEntries",
    demoProfiles: "demoProfiles",
    productionProfiles: "productionProfiles",
    enterpriseProfiles: "enterpriseProfiles",
    sharedApis: "sharedApis",
    contextApis: "contextApis",
    configurationApis: "configurationApis",
    extensionPoints: "extensionPoints",
    frameworkMetrics: "frameworkMetrics",
    frameworkHealth: "frameworkHealth",
    compatibilityChecks: "compatibilityChecks",
    frameworkFailures: "frameworkFailures",
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

export const IFR_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
] as const;

export const IFR_PERMISSIONS = ["ifr.view", "ifr.manage", "ifr.approve", "ifr.admin"] as const;


export const IFR_THEME = {
    primary: "teal-600",
    primaryHover: "teal-500",
    ring: "teal-500/20",
    text: "text-teal-600",
    textDark: "dark:text-teal-400",
    bg: "bg-teal-600",
    bgHover: "hover:bg-teal-500",
} as const;
