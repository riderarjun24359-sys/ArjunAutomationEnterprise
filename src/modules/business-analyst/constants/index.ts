export const BUSINESS_ANALYST_TABS = {
    overview: "overview",
    engagements: "engagements",
    interviews: "interviews",
    brds: "brds",
    frs: "frs",
    userStories: "userStories",
    acceptanceCriteria: "acceptanceCriteria",
    processMaps: "processMaps",
    gapAnalysis: "gapAnalysis",
    prioritization: "prioritization",
    risks: "risks",
    stakeholders: "stakeholders",
    scope: "scope",
    proposals: "proposals",
    costEstimates: "costEstimates",
    timelineEstimates: "timelineEstimates",
    versions: "versions",
    approvals: "approvals",
    audit: "audit",
    api: "api",
} as const;

export const PIPELINE_STAGE_OPTIONS = [
    { value: "customer_requirement", label: "Customer Requirement" },
    { value: "requirement_interview", label: "Requirement Interview" },
    { value: "brd_generation", label: "BRD Generation" },
    { value: "frs_generation", label: "FRS Generation" },
    { value: "solution_architect", label: "Solution Architect Handoff" },
] as const;

export const SCOPE_TYPE_OPTIONS = [
    { value: "in_scope", label: "In Scope" },
    { value: "out_of_scope", label: "Out of Scope" },
    { value: "deferred", label: "Deferred" },
] as const;

export const PROCESS_TYPE_OPTIONS = [
    { value: "as_is", label: "As-Is" },
    { value: "to_be", label: "To-Be" },
] as const;

export const PRIORITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
] as const;

export const RISK_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
] as const;

export const BA_PERMISSIONS = ["ba.view", "ba.manage", "ba.approve", "ba.admin"] as const;
