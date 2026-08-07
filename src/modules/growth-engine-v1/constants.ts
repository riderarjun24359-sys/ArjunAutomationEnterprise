export const GEV1_THEME = {
    title: "Growth Engine v1",
    subtitle:
        "Customer acquisition, sales pipeline, lifecycle, revenue analytics, and founder growth alerts — live from Supabase.",
} as const;

export const GEV1_TABS = {
    marketing: "marketing",
    sales: "sales",
    lifecycle: "lifecycle",
    analytics: "analytics",
    founder: "founder",
} as const;

export type Gev1Tab = (typeof GEV1_TABS)[keyof typeof GEV1_TABS];

export const GEV1_TAB_LIST: Array<{ id: Gev1Tab; label: string }> = [
    { id: GEV1_TABS.marketing, label: "Marketing CRM" },
    { id: GEV1_TABS.sales, label: "Sales Pipeline" },
    { id: GEV1_TABS.lifecycle, label: "Customer Lifecycle" },
    { id: GEV1_TABS.analytics, label: "Analytics" },
    { id: GEV1_TABS.founder, label: "Founder Growth" },
];
