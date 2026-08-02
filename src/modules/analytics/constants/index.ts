export const ANALYTICS_TABS = {
    overview: "overview",
    revenue: "revenue",
    delivery: "delivery",
    clients: "clients",
    automation: "automation",
    reports: "reports",
    charts: "charts",
} as const;

export const REPORT_TYPE_OPTIONS = [
    { value: "summary", label: "Executive Summary" },
    { value: "finance", label: "Finance" },
    { value: "clients", label: "Clients" },
    { value: "delivery", label: "Delivery" },
    { value: "automation", label: "Automation" },
] as const;

export const REPORT_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
] as const;

export const METRIC_CATEGORY_FILTERS = {
    all: "all",
    finance: "finance",
    clients: "clients",
    delivery: "delivery",
    automation: "automation",
    general: "general",
} as const;

export const CHART_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
