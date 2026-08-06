export const CSG_THEME = {
    title: "Customer Acquisition & Success",
    subtitle:
        "Monitor onboarding activation, referrals, testimonials, education, and the founder daily brief — live from Supabase.",
} as const;

export const CSG_TABS = {
    monitoring: "monitoring",
    referrals: "referrals",
    testimonials: "testimonials",
    education: "education",
    brief: "brief",
} as const;

export type CsgTab = (typeof CSG_TABS)[keyof typeof CSG_TABS];

export const CSG_TAB_LIST: Array<{ id: CsgTab; label: string }> = [
    { id: CSG_TABS.monitoring, label: "Success Monitoring" },
    { id: CSG_TABS.referrals, label: "Referral Engine" },
    { id: CSG_TABS.testimonials, label: "Testimonial Center" },
    { id: CSG_TABS.education, label: "Customer Education" },
    { id: CSG_TABS.brief, label: "Founder Daily Brief" },
];
