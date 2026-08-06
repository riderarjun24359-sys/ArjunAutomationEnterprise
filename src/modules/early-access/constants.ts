export const EARLY_ACCESS_THEME = {
    title: "Early Access Launch Console",
    subtitle: "Invite cohorts, customer success, feedback, founder monitoring, and release execution — live from Supabase.",
} as const;

export const EARLY_ACCESS_TABS = {
    management: "management",
    success: "success",
    feedback: "feedback",
    monitoring: "monitoring",
    releases: "releases",
} as const;

export type EarlyAccessTab = (typeof EARLY_ACCESS_TABS)[keyof typeof EARLY_ACCESS_TABS];

export const EARLY_ACCESS_TAB_LIST: Array<{ id: EarlyAccessTab; label: string }> = [
    { id: EARLY_ACCESS_TABS.management, label: "Early Access Management" },
    { id: EARLY_ACCESS_TABS.success, label: "Customer Success Console" },
    { id: EARLY_ACCESS_TABS.feedback, label: "Feedback System" },
    { id: EARLY_ACCESS_TABS.monitoring, label: "Founder Monitoring" },
    { id: EARLY_ACCESS_TABS.releases, label: "Release Management" },
];
