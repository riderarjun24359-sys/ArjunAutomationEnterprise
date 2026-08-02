export const CLIENT_TABS = {
    overview: "overview",
    roster: "roster",
    projects: "projects",
    contacts: "contacts",
    activity: "activity",
} as const;

export const CLIENT_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "at_risk", label: "At Risk" },
    { value: "inactive", label: "Inactive" },
    { value: "lead", label: "Lead" },
] as const;

export const CLIENT_INDUSTRY_OPTIONS = [
    { value: "saas", label: "SaaS" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "healthcare", label: "Healthcare" },
    { value: "retail", label: "Retail" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
] as const;

export const CLIENT_STATUS_FILTERS = {
    all: "all",
    active: "active",
    at_risk: "at_risk",
    inactive: "inactive",
} as const;
