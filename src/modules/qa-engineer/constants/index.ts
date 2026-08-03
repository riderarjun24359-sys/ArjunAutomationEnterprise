export const QA_ENGINEER_TABS = {
    overview: "overview",
    engagements: "engagements",
    testStrategies: "testStrategies",
    unitTests: "unitTests",
    integrationTests: "integrationTests",
    e2eTests: "e2eTests",
    regression: "regression",
    riskBasedTesting: "riskBasedTesting",
    security: "security",
    performance: "performance",
    accessibility: "accessibility",
    apiValidation: "apiValidation",
    databaseValidation: "databaseValidation",
    uiValidation: "uiValidation",
    bugTriage: "bugTriage",
    defectAnalysis: "defectAnalysis",
    coverage: "coverage",
    releaseReadiness: "releaseReadiness",
    qualityScores: "qualityScores",
    audit: "audit",
    api: "api",
} as const;

export const PIPELINE_STAGE_OPTIONS = [
    { value: "customer_requirement", label: "Customer Requirement" },
    { value: "business_analyst", label: "AI Business Analyst" },
    { value: "architecture_design", label: "Architecture Design" },
    { value: "development_factory", label: "AI Development Factory" },
    { value: "qa_engineering", label: "AI QA Engineering" },
    { value: "deployment", label: "Deployment" },
] as const;

export const RISK_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const TEST_PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const SEVERITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const BUG_PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
] as const;

export const WCAG_LEVEL_OPTIONS = [
    { value: "A", label: "WCAG A" },
    { value: "AA", label: "WCAG AA" },
    { value: "AAA", label: "WCAG AAA" },
] as const;

export const VALIDATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const QA_PERMISSIONS = ["qa.view", "qa.manage", "qa.approve", "qa.admin"] as const;

export const PLATFORM_MODULE_OPTIONS = [
    { value: "crm", label: "CRM" },
    { value: "projects", label: "Projects" },
    { value: "tasks", label: "Tasks" },
    { value: "finance", label: "Finance" },
    { value: "ai-orchestration", label: "AI Orchestration" },
    { value: "knowledge", label: "Knowledge" },
    { value: "business-analyst", label: "Business Analyst" },
    { value: "solution-architect", label: "Solution Architect" },
    { value: "development-factory", label: "Development Factory" },
    { value: "qa-engineer", label: "QA Engineer" },
    { value: "hr", label: "HR" },
    { value: "inventory", label: "Inventory" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
    { value: "documents", label: "Documents" },
] as const;

export const QA_THEME = {
    primary: "rose-600",
    primaryHover: "rose-500",
    ring: "rose-500/20",
    text: "text-rose-600",
    textDark: "dark:text-rose-400",
    bg: "bg-rose-600",
    bgHover: "hover:bg-rose-500",
} as const;
