export type ExecutiveAgentKey =
    | "cto"
    | "ceo"
    | "coo"
    | "cfo"
    | "cmo"
    | "cso"
    | "customerSuccess"
    | "security"
    | "analytics";

export const EXECUTIVE_AI_ECOSYSTEM_STORAGE_KEY = "aa-executive-ai-ecosystem-state";

export const EXECUTIVE_AGENTS: Record<
    ExecutiveAgentKey,
    { label: string; role: string; domains: string[] }
> = {
    cto: {
        label: "CTO AI",
        role: "Chief Technology Officer",
        domains: ["Architecture review", "Code quality", "Technical debt", "Sprint planning", "Risk analysis", "Engineering recommendations"],
    },
    ceo: {
        label: "CEO AI",
        role: "Chief Executive Officer",
        domains: ["Company strategy", "Prioritization", "Executive summaries", "Decision support", "Company health"],
    },
    coo: {
        label: "COO AI",
        role: "Chief Operating Officer",
        domains: ["Operations", "Delivery monitoring", "Resource allocation", "Workflow optimization"],
    },
    cfo: {
        label: "CFO AI",
        role: "Chief Financial Officer",
        domains: ["Revenue", "Costs", "Profitability", "Cash-flow forecasting", "Pricing recommendations"],
    },
    cmo: {
        label: "CMO AI",
        role: "Chief Marketing Officer",
        domains: ["Marketing strategy", "Campaign planning", "SEO", "Content recommendations", "Lead generation"],
    },
    cso: {
        label: "CSO AI",
        role: "Chief Sales Officer",
        domains: ["Lead scoring", "Proposal recommendations", "Pipeline forecasting", "Opportunity detection"],
    },
    customerSuccess: {
        label: "Customer Success AI",
        role: "Customer Success",
        domains: ["Customer health", "Renewal prediction", "Satisfaction analysis", "Risk alerts"],
    },
    security: {
        label: "Security AI",
        role: "Chief Security Officer",
        domains: ["Security posture", "Vulnerability monitoring", "Compliance recommendations", "Incident summaries"],
    },
    analytics: {
        label: "Analytics AI",
        role: "Chief Analytics Officer",
        domains: ["KPI analysis", "Trend detection", "Forecasting", "Executive reporting"],
    },
};

export const CRITICAL_ACTION_KEYWORDS = ["delete", "deploy", "publish", "revoke", "terminate", "transfer funds", "price change"];

export const EXECUTIVE_AI_THEME = {
    badge: "Executive AI Ecosystem v1.0",
    title: "Executive AI Organization",
    subtitle: "Coordinated executive AI team integrated with Business Platform, EIP, Delivery Engine, and Production Readiness.",
};

export const SHARED_KNOWLEDGE_SOURCES = [
    "business-platform",
    "executive-intelligence-platform",
    "delivery-engine",
    "knowledge-engine",
    "production-readiness",
] as const;
