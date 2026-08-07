export const GOF_THEME = {
    title: "Growth OS Foundation",
    subtitle:
        "Brand Asset Manager, Content Workspace, AI Research Engine, workflow approvals, and analytics foundation — live from Supabase.",
} as const;

export const GOF_TABS = {
    brand: "brand",
    content: "content",
    research: "research",
    workflow: "workflow",
    analytics: "analytics",
} as const;

export type GofTab = (typeof GOF_TABS)[keyof typeof GOF_TABS];

export const GOF_TAB_LIST: Array<{ id: GofTab; label: string }> = [
    { id: GOF_TABS.brand, label: "Brand Asset Manager" },
    { id: GOF_TABS.content, label: "Content Workspace" },
    { id: GOF_TABS.research, label: "AI Research Engine" },
    { id: GOF_TABS.workflow, label: "Workflow Engine" },
    { id: GOF_TABS.analytics, label: "Analytics Foundation" },
];

/** Canonical Growth OS content lifecycle. */
export const GOF_WORKFLOW_STAGES = [
    "draft",
    "review",
    "approved",
    "scheduled",
    "published",
] as const;

export type GofWorkflowStage = (typeof GOF_WORKFLOW_STAGES)[number];
