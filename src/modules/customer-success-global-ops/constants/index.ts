export const CSGO_STORAGE_KEY = "aa-customer-success-global-ops-state";

export const CSGO_THEME = {
    badge: "Customer Success & Global Operations v1.0",
    title: "Global Operations Command Center",
    subtitle: "Customer success, support, onboarding, delivery control, feedback, and continuous improvement — unified for global client operations.",
};

export const CSGO_MODULES = [
    { key: "customerSuccessOs", label: "Customer Success OS", description: "Onboarding, success plans, health, renewals, escalations" },
    { key: "globalSupportCenter", label: "Global Support Center", description: "Tickets, SLA, knowledge base, incidents" },
    { key: "clientOnboarding", label: "Client Onboarding", description: "Guided onboarding, kickoff, team assignment" },
    { key: "serviceDeliveryControl", label: "Service Delivery Control", description: "Milestones, risks, quality, client approvals" },
    { key: "customerFeedbackEngine", label: "Customer Feedback Engine", description: "CSAT, NPS, feature requests, satisfaction trends" },
    { key: "globalOperationsDashboard", label: "Global Operations Dashboard", description: "Executive view across clients, projects, support, delivery" },
    { key: "continuousImprovementEngine", label: "Continuous Improvement", description: "Lessons learned, metrics, improvement backlog" },
] as const;

export type CsgModuleKey = (typeof CSGO_MODULES)[number]["key"];

export const ONBOARDING_CHECKLIST_TEMPLATE = [
    "Requirements workshop completed",
    "Success plan approved",
    "Team assigned",
    "Project kickoff scheduled",
    "Delivery timeline confirmed",
    "Support SLA configured",
    "Client portal provisioned",
    "Go-live readiness verified",
] as const;

export const DELIVERY_STAGES = ["discovery", "design", "build", "test", "deploy", "hypercare"] as const;
