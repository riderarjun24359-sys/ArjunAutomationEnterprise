export const SALES_TABS = {
    overview: "overview",
    leads: "leads",
    opportunities: "opportunities",
    pipeline: "pipeline",
    stages: "stages",
    quotes: "quotes",
    forecasting: "forecasting",
    activities: "activities",
    meetings: "meetings",
    calls: "calls",
    emails: "emails",
    targets: "targets",
    commissions: "commissions",
    winLoss: "winLoss",
    reports: "reports",
    audit: "audit",
} as const;

export const LEAD_SOURCE_OPTIONS = [
    { value: "inbound", label: "Inbound" },
    { value: "outbound", label: "Outbound" },
    { value: "referral", label: "Referral" },
    { value: "partner", label: "Partner" },
    { value: "event", label: "Event" },
] as const;

export const LEAD_STATUS_OPTIONS = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "converted", label: "Converted" },
    { value: "disqualified", label: "Disqualified" },
] as const;

export const ACTIVITY_TYPE_OPTIONS = [
    { value: "task", label: "Task" },
    { value: "call", label: "Call" },
    { value: "email", label: "Email" },
    { value: "follow_up", label: "Follow Up" },
    { value: "demo", label: "Demo" },
] as const;

export const SALES_PERMISSIONS = ["sales.view", "sales.manage", "sales.pipeline.manage", "sales.commissions.manage"] as const;
