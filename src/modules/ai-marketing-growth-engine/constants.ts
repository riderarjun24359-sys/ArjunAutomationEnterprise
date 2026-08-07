export const AMGE_THEME = {
    title: "AI Marketing & Growth Engine",
    subtitle:
        "Unified AI content generation, campaign planning, brand voice, prompt library, and content calendar — live multi-tenant marketing console for Founder/Admin operators.",
} as const;

export const AMGE_TABS = {
    content: "content",
    campaigns: "campaigns",
    brandVoice: "brandVoice",
    prompts: "prompts",
    calendar: "calendar",
} as const;

export type AmgeTab = (typeof AMGE_TABS)[keyof typeof AMGE_TABS];

export const AMGE_TAB_LIST: Array<{ id: AmgeTab; label: string }> = [
    { id: AMGE_TABS.content, label: "AI Content Generator" },
    { id: AMGE_TABS.campaigns, label: "AI Campaign Planner" },
    { id: AMGE_TABS.brandVoice, label: "AI Brand Voice Manager" },
    { id: AMGE_TABS.prompts, label: "AI Prompt Library" },
    { id: AMGE_TABS.calendar, label: "AI Content Calendar" },
];

export const AMGE_CONTENT_CHANNELS = ["blog", "email", "linkedin", "x", "facebook", "instagram"] as const;

export type AmgeContentChannel = (typeof AMGE_CONTENT_CHANNELS)[number];
