export const AOC_THEME = {
    title: "AI Operations & Monitoring Center",
    subtitle:
        "Enterprise operations that monitors every module: system health, AI agents, infrastructure, security, logs, alerts, backup & recovery, performance, and executive SLA — live multi-tenant Founder/Admin operations.",
} as const;

export const AOC_TABS = {
    health: "health",
    agents: "agents",
    infrastructure: "infrastructure",
    security: "security",
    logs: "logs",
    alerts: "alerts",
    backup: "backup",
    performance: "performance",
    executive: "executive",
} as const;

export type AocTab = (typeof AOC_TABS)[keyof typeof AOC_TABS];

export const AOC_TAB_LIST: Array<{ id: AocTab; label: string }> = [
    { id: AOC_TABS.health, label: "System Health Dashboard" },
    { id: AOC_TABS.agents, label: "AI Agent Monitor" },
    { id: AOC_TABS.infrastructure, label: "Infrastructure Monitoring" },
    { id: AOC_TABS.security, label: "Security Center" },
    { id: AOC_TABS.logs, label: "Logs & Audit" },
    { id: AOC_TABS.alerts, label: "Alert Center" },
    { id: AOC_TABS.backup, label: "Backup & Recovery" },
    { id: AOC_TABS.performance, label: "Performance Analytics" },
    { id: AOC_TABS.executive, label: "Executive Operations Dashboard" },
];

export const AOC_HEALTH_DOMAINS = ["api", "database", "queue", "storage", "background_jobs"] as const;
export type AocHealthDomain = (typeof AOC_HEALTH_DOMAINS)[number];

export const AOC_ALERT_SEVERITIES = ["critical", "warning", "info"] as const;
export type AocAlertSeverity = (typeof AOC_ALERT_SEVERITIES)[number];

export const AOC_LOG_KINDS = ["application", "workflow", "ai_execution"] as const;
export type AocLogKind = (typeof AOC_LOG_KINDS)[number];
