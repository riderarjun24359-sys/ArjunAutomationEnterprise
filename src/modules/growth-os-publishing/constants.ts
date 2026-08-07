export const GOP_THEME = {
    title: "Growth OS · Publishing & Distribution",
    subtitle:
        "Provider-agnostic orchestration for campaigns, scheduling, website publishing, social distribution, releases, and analytics — live multi-tenant with Founder/Admin approval.",
} as const;

/** Extensible connector slots for official platform / publishing APIs. */
export const GOP_CONNECTOR_SLOTS = [
    "website_cms",
    "blog_cms",
    "linkedin",
    "instagram",
    "facebook",
    "x",
    "youtube",
    "email_esp",
    "sitemap",
] as const;

export const GOP_TABS = {
    campaigns: "campaigns",
    scheduler: "scheduler",
    website: "website",
    social: "social",
    releases: "releases",
    analytics: "analytics",
} as const;

export type GopTab = (typeof GOP_TABS)[keyof typeof GOP_TABS];

export const GOP_TAB_LIST: Array<{ id: GopTab; label: string }> = [
    { id: GOP_TABS.campaigns, label: "Campaign Orchestrator" },
    { id: GOP_TABS.scheduler, label: "Publishing Scheduler" },
    { id: GOP_TABS.website, label: "Website Publisher" },
    { id: GOP_TABS.social, label: "Social Distribution" },
    { id: GOP_TABS.releases, label: "Release Manager" },
    { id: GOP_TABS.analytics, label: "Distribution Analytics" },
];
