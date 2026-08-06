export const FOUNDING_ANALYTICS_THEME = {
    title: "Founder Analytics & Growth Command Center",
    subtitle: "Run Arjun Automation as a business — live SaaS, growth, customer, and board metrics from Supabase.",
} as const;

export const FOUNDER_ANALYTICS_TABS = {
    executive: "executive",
    growth: "growth",
    customers: "customers",
    alerts: "alerts",
    advisor: "advisor",
    board: "board",
} as const;

export type FounderAnalyticsTab = (typeof FOUNDER_ANALYTICS_TABS)[keyof typeof FOUNDER_ANALYTICS_TABS];

export const FOUNDER_ANALYTICS_TAB_LIST: Array<{ id: FounderAnalyticsTab; label: string }> = [
    { id: FOUNDER_ANALYTICS_TABS.executive, label: "Executive Dashboard" },
    { id: FOUNDER_ANALYTICS_TABS.growth, label: "Growth Center" },
    { id: FOUNDER_ANALYTICS_TABS.customers, label: "Customer Intelligence" },
    { id: FOUNDER_ANALYTICS_TABS.alerts, label: "Founder Alerts" },
    { id: FOUNDER_ANALYTICS_TABS.advisor, label: "Executive AI Advisor" },
    { id: FOUNDER_ANALYTICS_TABS.board, label: "Board Room" },
];
