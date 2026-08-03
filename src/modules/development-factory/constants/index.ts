export const DEVELOPMENT_FACTORY_TABS = {
    overview: "overview",
    engagements: "engagements",
    workPackages: "workPackages",
    backendWorkflows: "backendWorkflows",
    frontendWorkflows: "frontendWorkflows",
    apiScaffolds: "apiScaffolds",
    migrationPlans: "migrationPlans",
    repositories: "repositories",
    components: "components",
    testScaffolds: "testScaffolds",
    codingStandards: "codingStandards",
    secureCoding: "secureCoding",
    moduleRecommendations: "moduleRecommendations",
    pullRequests: "pullRequests",
    codeReviews: "codeReviews",
    technicalDocs: "technicalDocs",
    progress: "progress",
    buildArtifacts: "buildArtifacts",
    versions: "versions",
    audit: "audit",
    api: "api",
} as const;

export const PIPELINE_STAGE_OPTIONS = [
    { value: "customer_requirement", label: "Customer Requirement" },
    { value: "business_analyst", label: "AI Business Analyst" },
    { value: "architecture_design", label: "Architecture Design" },
    { value: "development_factory", label: "AI Development Factory" },
    { value: "qa", label: "AI QA" },
    { value: "deployment", label: "Deployment" },
] as const;

export const REPO_TYPE_OPTIONS = [
    { value: "service", label: "Service" },
    { value: "library", label: "Library" },
    { value: "monorepo", label: "Monorepo" },
    { value: "frontend", label: "Frontend" },
] as const;

export const COMPONENT_TYPE_OPTIONS = [
    { value: "ui", label: "UI Component" },
    { value: "service", label: "Service" },
    { value: "hook", label: "Hook" },
    { value: "utility", label: "Utility" },
] as const;

export const TEST_TYPE_OPTIONS = [
    { value: "unit", label: "Unit" },
    { value: "integration", label: "Integration" },
    { value: "e2e", label: "End-to-End" },
    { value: "performance", label: "Performance" },
] as const;

export const ENFORCEMENT_LEVEL_OPTIONS = [
    { value: "required", label: "Required" },
    { value: "recommended", label: "Recommended" },
    { value: "optional", label: "Optional" },
] as const;

export const ARTIFACT_TYPE_OPTIONS = [
    { value: "build", label: "Build" },
    { value: "bundle", label: "Bundle" },
    { value: "docker", label: "Docker Image" },
    { value: "report", label: "Report" },
] as const;

export const DOC_TYPE_OPTIONS = [
    { value: "technical", label: "Technical" },
    { value: "api", label: "API" },
    { value: "readme", label: "README" },
    { value: "runbook", label: "Runbook" },
] as const;

export const DF_PERMISSIONS = ["df.view", "df.manage", "df.approve", "df.admin"] as const;

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
    { value: "hr", label: "HR" },
    { value: "inventory", label: "Inventory" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
    { value: "documents", label: "Documents" },
] as const;

export const DF_THEME = {
    primary: "orange-600",
    primaryHover: "orange-500",
    ring: "orange-500/20",
    text: "text-orange-600",
    textDark: "dark:text-orange-400",
    bg: "bg-orange-600",
    bgHover: "hover:bg-orange-500",
} as const;
