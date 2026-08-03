export const SOLUTION_ARCHITECT_TABS = {
    overview: "overview",
    engagements: "engagements",
    architectures: "architectures",
    decompositions: "decompositions",
    domainModels: "domainModels",
    databaseSchemas: "databaseSchemas",
    apiContracts: "apiContracts",
    moduleSelections: "moduleSelections",
    buildReuse: "buildReuse",
    integrations: "integrations",
    security: "security",
    scalability: "scalability",
    performance: "performance",
    technologyDecisions: "technologyDecisions",
    deployment: "deployment",
    sprintPlans: "sprintPlans",
    dependencies: "dependencies",
    reviews: "reviews",
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

export const ARCHITECTURE_TYPE_OPTIONS = [
    { value: "enterprise", label: "Enterprise" },
    { value: "microservices", label: "Microservices" },
    { value: "monolith", label: "Monolith" },
    { value: "serverless", label: "Serverless" },
] as const;

export const BUILD_REUSE_OPTIONS = [
    { value: "build", label: "Build" },
    { value: "reuse", label: "Reuse" },
    { value: "hybrid", label: "Hybrid" },
] as const;

export const SA_PERMISSIONS = ["sa.view", "sa.manage", "sa.approve", "sa.admin"] as const;

export const PLATFORM_MODULE_OPTIONS = [
    { value: "crm", label: "CRM" },
    { value: "projects", label: "Projects" },
    { value: "tasks", label: "Tasks" },
    { value: "finance", label: "Finance" },
    { value: "ai-orchestration", label: "AI Orchestration" },
    { value: "knowledge", label: "Knowledge" },
    { value: "business-analyst", label: "Business Analyst" },
    { value: "hr", label: "HR" },
    { value: "inventory", label: "Inventory" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
    { value: "documents", label: "Documents" },
] as const;
