export const ASLE_THEME = {
    title: "AI Sales & Lead Generation Engine",
    subtitle:
        "Enterprise AI sales console: lead capture, qualification, scoring, pipeline, deals, proposals, quotations, contracts, forecasting, and integrations — live multi-tenant Founder/Admin operations.",
} as const;

export const ASLE_TABS = {
    capture: "capture",
    qualify: "qualify",
    pipeline: "pipeline",
    documents: "documents",
    automation: "automation",
    analytics: "analytics",
    workspace: "workspace",
} as const;

export type AsleTab = (typeof ASLE_TABS)[keyof typeof ASLE_TABS];

export const ASLE_TAB_LIST: Array<{ id: AsleTab; label: string }> = [
    { id: ASLE_TABS.capture, label: "Lead Capture & Inbox" },
    { id: ASLE_TABS.qualify, label: "Qualification & Scoring" },
    { id: ASLE_TABS.pipeline, label: "Pipeline & Deals" },
    { id: ASLE_TABS.documents, label: "Proposals · Quotes · Contracts" },
    { id: ASLE_TABS.automation, label: "Automation & Integrations" },
    { id: ASLE_TABS.analytics, label: "Revenue & KPI Analytics" },
    { id: ASLE_TABS.workspace, label: "Tasks · Timeline · Export" },
];

export const ASLE_SCORE_BANDS = ["hot", "warm", "cold"] as const;
export type AsleScoreBand = (typeof ASLE_SCORE_BANDS)[number];

export const ASLE_INTEGRATION_CHANNELS = ["email", "whatsapp", "calendar"] as const;
export type AsleIntegrationChannel = (typeof ASLE_INTEGRATION_CHANNELS)[number];
