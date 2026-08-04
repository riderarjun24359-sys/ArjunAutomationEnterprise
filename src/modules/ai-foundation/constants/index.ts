import type { KnowledgeNodeType, MemoryType, GovernancePolicyType } from "../types";

export const AI_FOUNDATION_STORAGE_KEY = "aa-ai-foundation-state";

export const MEMORY_TYPES: MemoryType[] = [
    "persistent",
    "conversation",
    "project",
    "customer",
    "business",
    "workflow",
];

export const KNOWLEDGE_NODE_TYPES: KnowledgeNodeType[] = [
    "customer",
    "project",
    "capability",
    "document",
    "aiAgent",
    "workflow",
    "businessAsset",
    "missionCore",
];

export const GOVERNANCE_POLICY_TYPES: GovernancePolicyType[] = [
    "model",
    "pii",
    "prompt_safety",
    "output_validation",
    "risk",
];

export const EVALUATION_CATEGORIES = [
    "accuracy",
    "quality",
    "consistency",
    "latency",
    "failures",
    "hallucination",
] as const;

export const AI_FOUNDATION_EVENTS = {
    AiRoutingEvent: "AiRoutingEvent",
    AgentSelectedEvent: "AgentSelectedEvent",
    AiWorkflowExecutedEvent: "AiWorkflowExecutedEvent",
    MemoryAccessEvent: "MemoryAccessEvent",
    KnowledgeAccessEvent: "KnowledgeAccessEvent",
    PolicyEnforcedEvent: "PolicyEnforcedEvent",
} as const;

export const GCI_PRESERVATION_RULES = {
    businessIntent: "Preserve business intent across language adaptation",
    technicalMeaning: "Preserve technical meaning in translations",
    legalTerminology: "Preserve legal terminology exactly",
    professionalTone: "Maintain professional tone in all locales",
} as const;

export const AI_FOUNDATION_TABS = {
    memory: "memory",
    knowledgeGraph: "knowledge-graph",
    prompts: "prompts",
    agents: "agents",
    workflows: "workflows",
    evaluation: "evaluation",
    governance: "governance",
    costUsage: "cost-usage",
    learning: "learning",
    dashboard: "dashboard",
} as const;

export const AI_FOUNDATION_TAB_LIST = [
    { id: AI_FOUNDATION_TABS.memory, label: "AI Memory Engine" },
    { id: AI_FOUNDATION_TABS.knowledgeGraph, label: "Knowledge Graph" },
    { id: AI_FOUNDATION_TABS.prompts, label: "Prompt Management" },
    { id: AI_FOUNDATION_TABS.agents, label: "Agent Registry" },
    { id: AI_FOUNDATION_TABS.workflows, label: "AI Workflow Engine" },
    { id: AI_FOUNDATION_TABS.evaluation, label: "Evaluation Center" },
    { id: AI_FOUNDATION_TABS.governance, label: "AI Governance" },
    { id: AI_FOUNDATION_TABS.costUsage, label: "Cost & Usage" },
    { id: AI_FOUNDATION_TABS.learning, label: "Learning Pipeline" },
    { id: AI_FOUNDATION_TABS.dashboard, label: "Executive Dashboard" },
] as const;

export const AI_FOUNDATION_THEME = {
    accent: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200/60 dark:border-violet-800/60",
    surface: "bg-violet-50/50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-300",
} as const;
