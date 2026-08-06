import type { CrmEnterpriseTab } from "../types/enterprise";

export const CRM_THEME = {
    badge: "CRM Enterprise Platform",
    title: "Enterprise CRM",
    subtitle: "Client directory, lead pipeline, profiles, AI assistant, communications, and analytics — live from Supabase.",
};

export const CRM_ENTERPRISE_TABS = {
    directory: "directory",
    leads: "leads",
    profile: "profile",
    ai: "ai",
    communications: "communications",
    analytics: "analytics",
} as const satisfies Record<string, CrmEnterpriseTab>;

export const CLIENT_STATUS_OPTIONS = [
    { value: "lead", label: "Lead" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "at_risk", label: "At Risk" },
] as const;

export const LEAD_STAGE_OPTIONS = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
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
