export const AAGE_TABS = {
    overview: "overview",
    operationsHubs: "operationsHubs",
    brandKnowledgeBase: "brandKnowledgeBase",
    brandRulebook: "brandRulebook",
    messagingLibrary: "messagingLibrary",
    serviceLibrary: "serviceLibrary",
    industryLibrary: "industryLibrary",
    faqLibrary: "faqLibrary",
    brandApprovalRules: "brandApprovalRules",
    videoProjects: "videoProjects",
    thumbnailManager: "thumbnailManager",
    voiceoverManager: "voiceoverManager",
    creativeAssetGenerator: "creativeAssetGenerator",
    campaignAssetBuilder: "campaignAssetBuilder",
    creativeWorkflows: "creativeWorkflows",
    distributionContentQueue: "distributionContentQueue",
    distributionPublishingQueue: "distributionPublishingQueue",
    channelManager: "channelManager",
    approvalCenter: "approvalCenter",
    publishingHistory: "publishingHistory",
    distributionAnalytics: "distributionAnalytics",
    campaignDashboard: "campaignDashboard",
    contentPerformance: "contentPerformance",
    leadAttribution: "leadAttribution",
    growthKpis: "growthKpis",
    roiDashboard: "roiDashboard",
    recommendationEngine: "recommendationEngine",
    commandCenterMetrics: "commandCenterMetrics",
    commandCenterHealth: "commandCenterHealth",
    missionStatus: "missionStatus",
    executiveSummaries: "executiveSummaries",
    operationalFailures: "operationalFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const KNOWLEDGE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
] as const;

export const RULEBOOK_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const MESSAGE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const SERVICE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const INDUSTRY_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const FAQ_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const RULE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const PROJECT_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
] as const;

export const THUMBNAIL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const VOICEOVER_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const GENERATOR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const BUILDER_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const WORKFLOW_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const QUEUE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
] as const;

export const CHANNEL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const APPROVAL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

export const HISTORY_STATUS_OPTIONS = [
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
] as const;

export const DASHBOARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const ATTRIBUTION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const RECOMMENDATION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const MISSION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "paused", label: "Paused" },
] as const;

export const SUMMARY_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
] as const;

export const AAGE_PERMISSIONS = ["aage.view", "aage.manage", "aage.approve", "aage.admin"] as const;

export const AAGE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;


export const AAGE_THEME = {
    primary: "pink-600",
    primaryHover: "pink-500",
    ring: "pink-500/20",
    text: "text-pink-600",
    textDark: "dark:text-pink-400",
    bg: "bg-pink-600",
    bgHover: "hover:bg-pink-500",
} as const;
