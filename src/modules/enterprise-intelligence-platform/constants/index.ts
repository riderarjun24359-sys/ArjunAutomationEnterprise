export const EIP_TABS = {
    overview: "overview",
    intelligenceHubs: "intelligenceHubs",
    kpiRegistry: "kpiRegistry",
    kpiAggregations: "kpiAggregations",
    kpiCategories: "kpiCategories",
    kpiTargets: "kpiTargets",
    kpiThresholds: "kpiThresholds",
    kpiSnapshots: "kpiSnapshots",
    executiveDashboards: "executiveDashboards",
    crossModuleInsights: "crossModuleInsights",
    businessHealthScores: "businessHealthScores",
    operationalEfficiencyScores: "operationalEfficiencyScores",
    growthScores: "growthScores",
    strategicInsights: "strategicInsights",
    revenueForecasts: "revenueForecasts",
    customerGrowthForecasts: "customerGrowthForecasts",
    renewalForecasts: "renewalForecasts",
    capacityPlanning: "capacityPlanning",
    operationalTrends: "operationalTrends",
    riskForecasts: "riskForecasts",
    dailyExecutiveBriefs: "dailyExecutiveBriefs",
    weeklyBusinessSummaries: "weeklyBusinessSummaries",
    monthlyPerformanceReports: "monthlyPerformanceReports",
    quarterlyExecutiveReviews: "quarterlyExecutiveReviews",
    annualBusinessReports: "annualBusinessReports",
    kpiServiceConfigs: "kpiServiceConfigs",
    intelligenceServiceConfigs: "intelligenceServiceConfigs",
    forecastServiceConfigs: "forecastServiceConfigs",
    intelligenceMetrics: "intelligenceMetrics",
    intelligenceHealth: "intelligenceHealth",
    missionProgress: "missionProgress",
    intelligenceFailures: "intelligenceFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const KPI_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const CATEGORY_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const DASHBOARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
] as const;

export const CONFIG_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "failed", label: "Failed" },
] as const;

export const EIP_PERMISSIONS = ["eip.view", "eip.manage", "eip.approve", "eip.admin"] as const;

export const EIP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;


export const EIP_THEME = {
    primary: "fuchsia-600",
    primaryHover: "fuchsia-500",
    ring: "fuchsia-500/20",
    text: "text-fuchsia-600",
    textDark: "dark:text-fuchsia-400",
    bg: "bg-fuchsia-600",
    bgHover: "hover:bg-fuchsia-500",
} as const;
