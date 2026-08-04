export const AAGE_TABS = {
    overview: "overview",
    growthHubs: "growthHubs",
    brandProfiles: "brandProfiles",
    brandVoice: "brandVoice",
    coreMessaging: "coreMessaging",
    brandGuidelines: "brandGuidelines",
    logoLibrary: "logoLibrary",
    colorSystems: "colorSystems",
    youtubeTemplates: "youtubeTemplates",
    socialTemplates: "socialTemplates",
    blogTemplates: "blogTemplates",
    websiteArticleTemplates: "websiteArticleTemplates",
    emailCampaignTemplates: "emailCampaignTemplates",
    caseStudyTemplates: "caseStudyTemplates",
    imageAssets: "imageAssets",
    videoAssets: "videoAssets",
    iconAssets: "iconAssets",
    voiceProfiles: "voiceProfiles",
    musicAssets: "musicAssets",
    thumbnailTemplates: "thumbnailTemplates",
    ideaGenerators: "ideaGenerators",
    scriptGenerators: "scriptGenerators",
    captionGenerators: "captionGenerators",
    blogGenerators: "blogGenerators",
    seoAssistants: "seoAssistants",
    ctaGenerators: "ctaGenerators",
    growthMetrics: "growthMetrics",
    growthHealth: "growthHealth",
    contentCalendar: "contentCalendar",
    draftQueue: "draftQueue",
    approvalQueue: "approvalQueue",
    publishingQueue: "publishingQueue",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const PROFILE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
] as const;

export const MESSAGING_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const GUIDELINE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const TEMPLATE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const GENERATOR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const ASSISTANT_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const QUEUE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
] as const;

export const CALENDAR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
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
