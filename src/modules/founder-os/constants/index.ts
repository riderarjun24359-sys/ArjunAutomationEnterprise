export const FOUNDER_OS_TABS = {
    overview: "overview",
    workspaces: "workspaces",
    strategicOkrs: "strategicOkrs",
    executiveDashboards: "executiveDashboards",
    revenueRunway: "revenueRunway",
    teamCapacity: "teamCapacity",
    productRoadmaps: "productRoadmaps",
    investorRelations: "investorRelations",
    boardReports: "boardReports",
    decisionLog: "decisionLog",
    priorities: "priorities",
    resourceAllocations: "resourceAllocations",
    riskRegister: "riskRegister",
    growthMetrics: "growthMetrics",
    founderAgenda: "founderAgenda",
    stakeholders: "stakeholders",
    capitalPlans: "capitalPlans",
    companyMilestones: "companyMilestones",
    founderInsights: "founderInsights",
    phase3: "phase3",
    phase4: "phase4",
    audit: "audit",
    api: "api",
} as const;

export const PIPELINE_STAGE_OPTIONS = [
    { value: "customer_requirement", label: "Customer Requirement" },
    { value: "business_analyst", label: "AI Business Analyst" },
    { value: "architecture_design", label: "AI Solution Architect" },
    { value: "development_factory", label: "AI Development Factory" },
    { value: "qa_engineering", label: "AI QA Engineering" },
    { value: "devops_deployment", label: "AI DevOps & Deployment" },
    { value: "customer_success", label: "AI Customer Success Manager" },
    { value: "founder_operating_system", label: "Founder Operating System" },
    { value: "strategic_execution", label: "Strategic Execution" },
] as const;

export const PRIORITY_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const RISK_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const DECISION_TYPE_OPTIONS = [
    { value: "strategic", label: "Strategic" },
    { value: "operational", label: "Operational" },
    { value: "financial", label: "Financial" },
    { value: "product", label: "Product" },
] as const;

export const METRIC_TYPE_OPTIONS = [
    { value: "revenue", label: "Revenue" },
    { value: "users", label: "Users" },
    { value: "retention", label: "Retention" },
    { value: "efficiency", label: "Efficiency" },
] as const;

export const STAKEHOLDER_TYPE_OPTIONS = [
    { value: "internal", label: "Internal" },
    { value: "board", label: "Board" },
    { value: "investor", label: "Investor" },
    { value: "partner", label: "Partner" },
    { value: "customer", label: "Customer" },
] as const;

export const INFLUENCE_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
] as const;

export const MILESTONE_TYPE_OPTIONS = [
    { value: "product", label: "Product" },
    { value: "fundraising", label: "Fundraising" },
    { value: "team", label: "Team" },
    { value: "revenue", label: "Revenue" },
] as const;

export const INSIGHT_TYPE_OPTIONS = [
    { value: "strategic", label: "Strategic" },
    { value: "financial", label: "Financial" },
    { value: "operational", label: "Operational" },
    { value: "market", label: "Market" },
] as const;

export const REFRESH_CADENCE_OPTIONS = [
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
] as const;

export const FO_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "open", label: "Open" },
    { value: "planned", label: "Planned" },
    { value: "scheduled", label: "Scheduled" },
    { value: "recorded", label: "Recorded" },
] as const;

export const FO_PERMISSIONS = ["fo.view", "fo.manage", "fo.approve", "fo.admin"] as const;

export const PLATFORM_MODULE_OPTIONS = [
    { value: "crm", label: "CRM" },
    { value: "projects", label: "Projects" },
    { value: "finance", label: "Finance" },
    { value: "ai-orchestration", label: "AI Orchestration" },
    { value: "knowledge", label: "Knowledge" },
    { value: "business-analyst", label: "Business Analyst" },
    { value: "solution-architect", label: "Solution Architect" },
    { value: "development-factory", label: "Development Factory" },
    { value: "qa-engineer", label: "QA Engineer" },
    { value: "devops-deployment", label: "DevOps & Deployment" },
    { value: "customer-success", label: "Customer Success" },
    { value: "founder-os", label: "Founder Operating System" },
] as const;

export const FO_THEME = {
    primary: "amber-600",
    primaryHover: "amber-500",
    ring: "amber-500/20",
    text: "text-amber-600",
    textDark: "dark:text-amber-400",
    bg: "bg-amber-600",
    bgHover: "hover:bg-amber-500",
} as const;
