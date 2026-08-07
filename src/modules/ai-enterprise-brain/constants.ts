export const AEB_THEME = {
    title: "AI Enterprise Brain",
    subtitle:
        "Central intelligence layer coordinating missions, multi-agent operations, decisions, plans, cross-module orchestration, enterprise memory, exceptions, founder approvals, and executive mission health — live multi-tenant Founder/Admin command.",
} as const;

export const AEB_TABS = {
    missionControl: "missionControl",
    multiAgent: "multiAgent",
    decisionEngine: "decisionEngine",
    taskPlanner: "taskPlanner",
    orchestrator: "orchestrator",
    memory: "memory",
    exceptions: "exceptions",
    approvals: "approvals",
    executive: "executive",
} as const;

export type AebTab = (typeof AEB_TABS)[keyof typeof AEB_TABS];

export const AEB_TAB_LIST: Array<{ id: AebTab; label: string }> = [
    { id: AEB_TABS.missionControl, label: "Mission Control" },
    { id: AEB_TABS.multiAgent, label: "Multi-Agent Coordinator" },
    { id: AEB_TABS.decisionEngine, label: "AI Decision Engine" },
    { id: AEB_TABS.taskPlanner, label: "Task Planner" },
    { id: AEB_TABS.orchestrator, label: "Cross-Module Orchestrator" },
    { id: AEB_TABS.memory, label: "Enterprise Memory" },
    { id: AEB_TABS.exceptions, label: "Exception Center" },
    { id: AEB_TABS.approvals, label: "Founder Approval Center" },
    { id: AEB_TABS.executive, label: "Executive Mission Dashboard" },
];

export const AEB_AGENT_ROLES = [
    "marketing",
    "sales",
    "customer_success",
    "finance",
    "automation",
    "operations",
] as const;

export type AebAgentRole = (typeof AEB_AGENT_ROLES)[number];

export const AEB_AGENT_ROLE_LABELS: Record<AebAgentRole, string> = {
    marketing: "Marketing Agent",
    sales: "Sales Agent",
    customer_success: "Customer Success Agent",
    finance: "Finance Agent",
    automation: "Automation Agent",
    operations: "Operations Agent",
};
