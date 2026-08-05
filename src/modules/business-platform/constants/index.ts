export const BUSINESS_PLATFORM_STORAGE_KEY = "aa-business-platform-state";

export const BUSINESS_PLATFORM_TABS = {
    leads: "leads",
    consultation: "consultation",
    proposals: "proposals",
    clientPortal: "client-portal",
    projects: "projects",
    team: "team",
    finance: "finance",
    analytics: "analytics",
    settings: "settings",
    aiOps: "ai-ops",
} as const;

export const BUSINESS_PLATFORM_TAB_LIST = [
    { id: BUSINESS_PLATFORM_TABS.leads, label: "Lead Management", module: 1 },
    { id: BUSINESS_PLATFORM_TABS.consultation, label: "Consultation", module: 2 },
    { id: BUSINESS_PLATFORM_TABS.proposals, label: "Proposals", module: 3 },
    { id: BUSINESS_PLATFORM_TABS.clientPortal, label: "Client Portal", module: 4 },
    { id: BUSINESS_PLATFORM_TABS.projects, label: "Projects", module: 5 },
    { id: BUSINESS_PLATFORM_TABS.team, label: "Team", module: 6 },
    { id: BUSINESS_PLATFORM_TABS.finance, label: "Finance", module: 7 },
    { id: BUSINESS_PLATFORM_TABS.analytics, label: "Analytics", module: 8 },
    { id: BUSINESS_PLATFORM_TABS.settings, label: "Settings", module: 9 },
    { id: BUSINESS_PLATFORM_TABS.aiOps, label: "AI Operations", module: "AI" },
] as const;

export const LIFECYCLE_STAGES = [
    { id: "lead", label: "Lead" },
    { id: "qualification", label: "Qualification" },
    { id: "consultation", label: "Consultation" },
    { id: "proposal", label: "Proposal" },
    { id: "agreement", label: "Agreement" },
    { id: "client", label: "Client" },
    { id: "project", label: "Project" },
    { id: "delivery", label: "Delivery" },
    { id: "support", label: "Support" },
    { id: "renewal", label: "Renewal" },
    { id: "referral", label: "Referral" },
] as const;

export const LEAD_STATUS_OPTIONS = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "unqualified", label: "Unqualified" },
    { value: "converted", label: "Converted" },
] as const;

export const CONSULTATION_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "no_show", label: "No Show" },
] as const;

export const PROPOSAL_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "review", label: "In Review" },
    { value: "sent", label: "Sent" },
    { value: "viewed", label: "Viewed" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "expired", label: "Expired" },
] as const;

export const BUSINESS_PLATFORM_THEME = {
    accent: "text-indigo-600 dark:text-indigo-400",
    text: "text-[var(--dos-text-secondary)]",
    badge: "Enterprise Business Platform v1.0",
} as const;
