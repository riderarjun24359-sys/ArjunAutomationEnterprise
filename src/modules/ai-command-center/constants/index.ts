export const ACC_STORAGE_KEY = "aa-ai-command-center-state";

export const ACC_THEME = {
    badge: "AI Command Center v1.0",
    title: "AI Command Center",
    subtitle: "Unified operational intelligence: system health, decisions, recommendations, automation, and executive analytics.",
};

export const ACC_ENGINES = [
    { key: "systemMonitor", label: "System Monitor Engine", description: "Platform and module health monitoring" },
    { key: "aiDecision", label: "AI Decision Engine", description: "Cross-module decision proposals and rationale" },
    { key: "recommendation", label: "Recommendation Engine", description: "Prioritized AI recommendations" },
    { key: "automation", label: "Automation Engine", description: "Triggered operational automations" },
    { key: "executiveAnalytics", label: "Executive Analytics Engine", description: "Revenue and KPI analytics" },
    { key: "healthMonitoring", label: "Health Monitoring Engine", description: "Client, support, delivery, and agent health" },
] as const;

export type AccEngineKey = (typeof ACC_ENGINES)[number]["key"];

export const ACC_AGENT_KEYS = [
    "orchestrator",
    "ceo",
    "cto",
    "coo",
    "cfo",
    "cso",
    "security",
    "analytics",
] as const;
