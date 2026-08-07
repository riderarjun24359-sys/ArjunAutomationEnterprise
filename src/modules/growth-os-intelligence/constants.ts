export const GOI_THEME = {
    title: "Growth OS · Growth Intelligence",
    subtitle:
        "Executive briefs, marketing and revenue intelligence, forecasting, AI recommendations, and unified dashboards — live multi-tenant Growth OS insights.",
} as const;

export const GOI_TABS = {
    founder: "founder",
    marketing: "marketing",
    revenue: "revenue",
    forecasting: "forecasting",
    recommendations: "recommendations",
    dashboard: "dashboard",
} as const;

export type GoiTab = (typeof GOI_TABS)[keyof typeof GOI_TABS];

export const GOI_TAB_LIST: Array<{ id: GoiTab; label: string }> = [
    { id: GOI_TABS.founder, label: "Founder Executive Intelligence" },
    { id: GOI_TABS.marketing, label: "Marketing Intelligence" },
    { id: GOI_TABS.revenue, label: "Revenue Intelligence" },
    { id: GOI_TABS.forecasting, label: "Growth Forecasting" },
    { id: GOI_TABS.recommendations, label: "AI Recommendation Engine" },
    { id: GOI_TABS.dashboard, label: "Unified Intelligence Dashboard" },
];
