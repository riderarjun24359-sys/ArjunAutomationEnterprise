export const AIX_TABS = {
    overview: "overview",
    intelligenceHubs: "intelligenceHubs",
    dailyExecutiveBriefs: "dailyExecutiveBriefs",
    weeklyBusinessReviews: "weeklyBusinessReviews",
    monthlyExecutiveSummaries: "monthlyExecutiveSummaries",
    trialConversionScores: "trialConversionScores",
    renewalProbabilities: "renewalProbabilities",
    churnRisks: "churnRisks",
    expansionOpportunities: "expansionOpportunities",
    mrrTrends: "mrrTrends",
    arrTrends: "arrTrends",
    revenueGrowthMetrics: "revenueGrowthMetrics",
    revenueRisks: "revenueRisks",
    platformHealthIntel: "platformHealthIntel",
    queueHealthIntel: "queueHealthIntel",
    integrationHealthIntel: "integrationHealthIntel",
    performanceTrends: "performanceTrends",
    unusualLoginActivity: "unusualLoginActivity",
    permissionRisks: "permissionRisks",
    tenantSecurityTrends: "tenantSecurityTrends",
    complianceWarnings: "complianceWarnings",
    todayPriorities: "todayPriorities",
    recommendedActions: "recommendedActions",
    businessRisks: "businessRisks",
    growthOpportunities: "growthOpportunities",
    knowledgeReasoningSessions: "knowledgeReasoningSessions",
    evidenceTraces: "evidenceTraces",
    orchestrationLinks: "orchestrationLinks",
    recommendationOutputs: "recommendationOutputs",
    executiveMetrics: "executiveMetrics",
    executiveHealth: "executiveHealth",
    executiveFailures: "executiveFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const RISK_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const TREND_DIRECTION_OPTIONS = [
    { value: "up", label: "Up" },
    { value: "down", label: "Down" },
    { value: "flat", label: "Flat" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const AIX_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
] as const;

export const AIX_PERMISSIONS = ["aix.view", "aix.manage", "aix.approve", "aix.admin"] as const;


export const AIX_THEME = {
    primary: "violet-600",
    primaryHover: "violet-500",
    ring: "violet-500/20",
    text: "text-violet-600",
    textDark: "dark:text-violet-400",
    bg: "bg-violet-600",
    bgHover: "hover:bg-violet-500",
} as const;
