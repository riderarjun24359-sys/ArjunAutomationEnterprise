export const GCR_THEME = {
    title: "Growth OS · AI Creative Studio",
    subtitle:
        "Brand images, social creatives, campaign design, thumbnails, quality gates, and asset library — live multi-tenant studio with Founder/Admin approval.",
} as const;

export const GCR_TABS = {
    brandImages: "brandImages",
    social: "social",
    campaign: "campaign",
    thumbnails: "thumbnails",
    quality: "quality",
    library: "library",
} as const;

export type GcrTab = (typeof GCR_TABS)[keyof typeof GCR_TABS];

export const GCR_TAB_LIST: Array<{ id: GcrTab; label: string }> = [
    { id: GCR_TABS.brandImages, label: "Brand Image Studio" },
    { id: GCR_TABS.social, label: "Social Creative Engine" },
    { id: GCR_TABS.campaign, label: "Campaign Designer" },
    { id: GCR_TABS.thumbnails, label: "Thumbnail Factory" },
    { id: GCR_TABS.quality, label: "Creative Quality Engine" },
    { id: GCR_TABS.library, label: "Creative Asset Library" },
];

export const GCR_SOCIAL_PLATFORMS = [
    "instagram",
    "linkedin",
    "facebook",
    "x",
    "carousel",
    "story",
] as const;
