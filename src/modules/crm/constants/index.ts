export const CRM_TABS = {
    overview: "overview",
    clients: "clients",
    leads: "leads",
    deals: "deals",
    activities: "activities",
    tasks: "tasks",
} as const;

export const CLIENT_STATUS_OPTIONS = [
    { value: "lead", label: "Lead" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "at_risk", label: "At Risk" },
] as const;

export const LEAD_STAGE_OPTIONS = [
    { value: "new", label: "New" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" },
] as const;

export const DEAL_STAGE_OPTIONS = [
    { value: "discovery", label: "Discovery" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed_won", label: "Closed Won" },
    { value: "closed_lost", label: "Closed Lost" },
] as const;
