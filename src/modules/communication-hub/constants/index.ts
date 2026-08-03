export const CNH_TABS = {
    overview: "overview",
    communicationHubs: "communicationHubs",
    notificationChannels: "notificationChannels",
    notificationQueue: "notificationQueue",
    retryPolicies: "retryPolicies",
    messageTemplates: "messageTemplates",
    templateVariables: "templateVariables",
    templateLocalizations: "templateLocalizations",
    templateApprovals: "templateApprovals",
    automationRules: "automationRules",
    automationTriggers: "automationTriggers",
    automationSchedules: "automationSchedules",
    automationExecutions: "automationExecutions",
    preferenceProfiles: "preferenceProfiles",
    channelPreferences: "channelPreferences",
    optInRecords: "optInRecords",
    optOutRecords: "optOutRecords",
    announcements: "announcements",
    announcementSchedules: "announcementSchedules",
    pinnedAnnouncements: "pinnedAnnouncements",
    announcementAcknowledgements: "announcementAcknowledgements",
    campaigns: "campaigns",
    audienceSegments: "audienceSegments",
    campaignDeliveries: "campaignDeliveries",
    campaignMetrics: "campaignMetrics",
    deliveryAnalytics: "deliveryAnalytics",
    engagementMetrics: "engagementMetrics",
    bounceRecords: "bounceRecords",
    channelPerformance: "channelPerformance",
    communicationMetrics: "communicationMetrics",
    systemHealth: "systemHealth",
    deliveryFailures: "deliveryFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const CHANNEL_TYPE_OPTIONS = [
    { value: "in_app", label: "In-App" },
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "push", label: "Push Notifications" },
    { value: "webhook", label: "Webhooks" },
] as const;

export const PRIORITY_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const DELIVERY_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "queued", label: "Queued" },
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const CNH_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "queued", label: "Queued" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "healthy", label: "Healthy" },
] as const;

export const CNH_PERMISSIONS = ["cnh.view", "cnh.manage", "cnh.approve", "cnh.admin"] as const;

export const CNH_THEME = {
    primary: "rose-600",
    primaryHover: "rose-500",
    ring: "rose-500/20",
    text: "text-rose-600",
    textDark: "dark:text-rose-400",
    bg: "bg-rose-600",
    bgHover: "hover:bg-rose-500",
} as const;
