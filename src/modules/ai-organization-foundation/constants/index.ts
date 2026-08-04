export const AOF_TABS = {
    overview: "overview",
    organizationHubs: "organizationHubs",
    growthOrchestrators: "growthOrchestrators",
    campaignIntelligence: "campaignIntelligence",
    leadPrioritization: "leadPrioritization",
    opportunityRecommendations: "opportunityRecommendations",
    pipelineHealth: "pipelineHealth",
    growthAnalytics: "growthAnalytics",
    executiveGrowthDashboards: "executiveGrowthDashboards",
    deliveryOrchestrators: "deliveryOrchestrators",
    resourcePlanners: "resourcePlanners",
    implementationSchedulers: "implementationSchedulers",
    deploymentCoordination: "deploymentCoordination",
    deliveryIntelligence: "deliveryIntelligence",
    customerSuccessAutomation: "customerSuccessAutomation",
    executiveDeliveryDashboards: "executiveDeliveryDashboards",
    ideaRegistry: "ideaRegistry",
    innovationPipeline: "innovationPipeline",
    experimentTracker: "experimentTracker",
    validationWorkflow: "validationWorkflow",
    outcomeEvaluation: "outcomeEvaluation",
    knowledgeRepository: "knowledgeRepository",
    aiTaskRouters: "aiTaskRouters",
    humanApprovalEngine: "humanApprovalEngine",
    policyEngine: "policyEngine",
    executionHistory: "executionHistory",
    aiGovernanceRules: "aiGovernanceRules",
    organizationMetrics: "organizationMetrics",
    organizationHealth: "organizationHealth",
    innovationDashboards: "innovationDashboards",
    missionProgress: "missionProgress",
    organizationFailures: "organizationFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const ORCHESTRATOR_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const CAMPAIGN_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const DASHBOARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
] as const;

export const APPROVAL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

export const AOF_PERMISSIONS = ["aof.view", "aof.manage", "aof.approve", "aof.admin"] as const;

export const AOF_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;

export const PLANNER_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const SCHEDULER_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const COORDINATION_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const AUTOMATION_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const IDEA_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const PIPELINE_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const EXPERIMENT_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const WORKFLOW_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const REPOSITORY_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const ROUTER_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const POLICY_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const GOVERNANCE_STATUS_OPTIONS = AOF_STATUS_OPTIONS;
export const ALERT_SEVERITY_OPTIONS = [
    { value: "info", label: "Info" },
    { value: "warning", label: "Warning" },
    { value: "critical", label: "Critical" },
] as const;

export const AOF_THEME = {
    primary: "orange-600",
    primaryHover: "orange-500",
    ring: "orange-500/20",
    text: "text-orange-600",
    textDark: "dark:text-orange-400",
    bg: "bg-orange-600",
    bgHover: "hover:bg-orange-500",
} as const;
