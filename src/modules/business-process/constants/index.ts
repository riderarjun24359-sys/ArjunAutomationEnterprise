export const BPF_TABS = {
    overview: "overview",
    processHubs: "processHubs",
    businessProcesses: "businessProcesses",
    processCategories: "processCategories",
    processVersions: "processVersions",
    processDependencies: "processDependencies",
    processModels: "processModels",
    processSteps: "processSteps",
    decisionPoints: "decisionPoints",
    reusableBlocks: "reusableBlocks",
    approvalRules: "approvalRules",
    sequentialApprovals: "sequentialApprovals",
    parallelApprovals: "parallelApprovals",
    escalationRules: "escalationRules",
    taskAssignments: "taskAssignments",
    taskTemplates: "taskTemplates",
    recurringTasks: "recurringTasks",
    taskSlaPolicies: "taskSlaPolicies",
    ruleConditions: "ruleConditions",
    ruleValidations: "ruleValidations",
    ruleCalculations: "ruleCalculations",
    reusableRules: "reusableRules",
    processExecutions: "processExecutions",
    executionHistory: "executionHistory",
    executionRetries: "executionRetries",
    executionAnalytics: "executionAnalytics",
    bottleneckReports: "bottleneckReports",
    slaPerformanceMetrics: "slaPerformanceMetrics",
    processMetrics: "processMetrics",
    processHealth: "processHealth",
    failedProcessRecords: "failedProcessRecords",
    processFailures: "processFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const BPF_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
] as const;

export const BPF_PERMISSIONS = ["bpf.view", "bpf.manage", "bpf.approve", "bpf.admin"] as const;


export const BPF_THEME = {
    primary: "sky-600",
    primaryHover: "sky-500",
    ring: "sky-500/20",
    text: "text-sky-600",
    textDark: "dark:text-sky-400",
    bg: "bg-sky-600",
    bgHover: "hover:bg-sky-500",
} as const;
