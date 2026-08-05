import type { IntelligenceModuleKey } from "../types";

export const EXECUTIVE_COMMAND_CENTER_THEME = {
    badge: "Executive Intelligence Platform v1.0",
    title: "Executive Command Center",
    subtitle: "Proactive intelligence across CTO, Operations, Business, Customer, and Project domains.",
};

export const INTELLIGENCE_MODULES: Record<
    IntelligenceModuleKey,
    { label: string; description: string }
> = {
    cto: {
        label: "CTO Intelligence",
        description: "Engineering health, performance, security, technical debt, and architecture review.",
    },
    operations: {
        label: "Operations Intelligence",
        description: "Platform monitoring, automation health, workflow status, and failure recovery.",
    },
    business: {
        label: "Business Intelligence",
        description: "Revenue, sales pipeline, conversion, forecast, and growth signals.",
    },
    customer: {
        label: "Customer Intelligence",
        description: "Client health, support posture, renewal prediction, and risk detection.",
    },
    project: {
        label: "Project Intelligence",
        description: "Schedule risk, resource usage, milestone prediction, and delivery confidence.",
    },
};

export const CRITICAL_ACTION_PREFIXES = ["delete", "remove", "revoke", "terminate", "publish", "deploy"];
