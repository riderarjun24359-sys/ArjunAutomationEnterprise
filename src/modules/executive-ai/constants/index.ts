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

export const EXECUTIVE_AI_STORAGE_KEY = "aa-executive-ai-state";

export const EXECUTIVE_AGENTS: Record<
    ExecutiveAgentKey,
    { label: string; role: string; version: string; domains: string[]; permissions: string[] }
> = {
    cto: {
        label: "CTO AI",
        role: "Chief Technology Officer",
        version: "1.0",
        domains: ["Architecture review", "Code quality", "Technical debt", "Sprint planning", "Risk analysis", "Engineering recommendations"],
        permissions: ["read:engineering", "recommend:architecture", "recommend:sprint"],
    },
    ceo: {
        label: "CEO AI",
        role: "Chief Executive Officer",
        version: "1.0",
        domains: ["Company strategy", "Prioritization", "Executive summaries", "Decision support", "Company health"],
        permissions: ["read:all", "recommend:strategy", "recommend:prioritization"],
    },
    coo: {
        label: "COO AI",
        role: "Chief Operating Officer",
        version: "1.0",
        domains: ["Operations", "Delivery monitoring", "Resource allocation", "Workflow optimization", "SLA monitoring"],
        permissions: ["read:operations", "recommend:workflow", "recommend:resources"],
    },
    cfo: {
        label: "CFO AI",
        role: "Chief Financial Officer",
        version: "1.0",
        domains: ["Revenue", "Costs", "Profitability", "Cash-flow forecasting", "Pricing recommendations"],
        permissions: ["read:finance", "recommend:pricing", "recommend:forecast"],
    },
    cmo: {
        label: "CMO AI",
        role: "Chief Marketing Officer",
        version: "1.0",
        domains: ["Marketing strategy", "Campaign planning", "SEO", "Content recommendations", "Lead generation"],
        permissions: ["read:marketing", "recommend:campaign", "recommend:content"],
    },
    cso: {
        label: "CSO AI",
        role: "Chief Sales Officer",
        version: "1.0",
        domains: ["Lead scoring", "Proposal recommendations", "Pipeline forecasting", "Opportunity detection"],
        permissions: ["read:sales", "recommend:proposal", "recommend:pipeline"],
    },
    customerSuccess: {
        label: "Customer Success AI",
        role: "Customer Success",
        version: "1.0",
        domains: ["Customer health", "Renewal prediction", "Satisfaction analysis", "Churn risk", "Escalation recommendations"],
        permissions: ["read:clients", "recommend:renewal", "recommend:escalation"],
    },
    security: {
        label: "Security AI",
        role: "Chief Security Officer",
        version: "1.0",
        domains: ["Security posture", "Vulnerability monitoring", "Compliance recommendations", "Incident summaries"],
        permissions: ["read:security", "recommend:compliance", "recommend:incident"],
    },
    analytics: {
        label: "Analytics AI",
        role: "Chief Analytics Officer",
        version: "1.0",
        domains: ["KPI analysis", "Trend detection", "Forecasting", "Executive reporting", "Predictive insights"],
        permissions: ["read:analytics", "recommend:forecast", "recommend:reporting"],
    },
};

export const CRITICAL_ACTION_KEYWORDS = ["delete", "deploy", "publish", "revoke", "terminate", "transfer funds", "price change"];

export const EXECUTIVE_AI_THEME = {
    badge: "Executive AI v1.0",
    title: "Executive AI Organization",
    subtitle: "Coordinated executive AI leadership layer with orchestration, shared enterprise knowledge, collaboration, governance, and human approval.",
};

export const SHARED_KNOWLEDGE_SOURCES = [
    "business-platform",
    "executive-intelligence-platform",
    "delivery-engine",
    "knowledge-engine",
    "production-readiness",
] as const;

export const GOVERNANCE_POLICIES = [
    { key: "critical_action", label: "Critical actions require human approval", enforced: true },
    { key: "role_separation", label: "Agents operate within role boundaries", enforced: true },
    { key: "audit_all", label: "All executive actions are audit logged", enforced: true },
    { key: "explainability", label: "Recommendations include explanations", enforced: true },
] as const;
