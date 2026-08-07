export const GOC_THEME = {
    title: "Growth OS · AI Content Engine",
    subtitle:
        "SEO-first blogs, landing pages, social, email, brand compliance, and SEO intelligence — live multi-tenant content studio with Founder/Admin approval.",
} as const;

export const GOC_TABS = {
    blog: "blog",
    landing: "landing",
    social: "social",
    email: "email",
    compliance: "compliance",
    seo: "seo",
} as const;

export type GocTab = (typeof GOC_TABS)[keyof typeof GOC_TABS];

export const GOC_TAB_LIST: Array<{ id: GocTab; label: string }> = [
    { id: GOC_TABS.blog, label: "AI Blog Studio" },
    { id: GOC_TABS.landing, label: "Landing Page Generator" },
    { id: GOC_TABS.social, label: "Social Content Engine" },
    { id: GOC_TABS.email, label: "Email Content" },
    { id: GOC_TABS.compliance, label: "Brand Compliance" },
    { id: GOC_TABS.seo, label: "SEO Intelligence" },
];

export const GOC_SOCIAL_PLATFORMS = [
    "linkedin",
    "instagram",
    "facebook",
    "x",
    "threads",
    "youtube",
] as const;

export type GocSocialPlatform = (typeof GOC_SOCIAL_PLATFORMS)[number];
