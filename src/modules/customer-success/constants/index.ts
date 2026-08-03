export const CUSTOMER_SUCCESS_TABS = {
    overview: "overview",
    engagements: "engagements",
    onboarding: "onboarding",
    adoption: "adoption",
    healthScores: "healthScores",
    renewalPlans: "renewalPlans",
    expansionOpportunities: "expansionOpportunities",
    riskAnalysis: "riskAnalysis",
    supportTrends: "supportTrends",
    successPlaybooks: "successPlaybooks",
    qbrReports: "qbrReports",
    communicationPlans: "communicationPlans",
    trainingRecommendations: "trainingRecommendations",
    feedbackAnalysis: "feedbackAnalysis",
    slaMonitoring: "slaMonitoring",
    kpiDashboards: "kpiDashboards",
    churnPrediction: "churnPrediction",
    lifecycleManagement: "lifecycleManagement",
    executiveSummaries: "executiveSummaries",
    audit: "audit",
    api: "api",
} as const;

export const PIPELINE_STAGE_OPTIONS = [
    { value: "customer_requirement", label: "Customer Requirement" },
    { value: "business_analyst", label: "AI Business Analyst" },
    { value: "architecture_design", label: "Architecture Design" },
    { value: "development_factory", label: "AI Development Factory" },
    { value: "qa_engineering", label: "AI QA Engineering" },
    { value: "devops_deployment", label: "AI DevOps & Deployment" },
    { value: "customer_success", label: "AI Customer Success Manager" },
    { value: "continuous_success", label: "Continuous Customer Success" },
] as const;

export const OPPORTUNITY_TYPE_OPTIONS = [
    { value: "upsell", label: "Upsell" },
    { value: "cross_sell", label: "Cross-sell" },
    { value: "expansion", label: "Expansion" },
    { value: "renewal", label: "Renewal" },
] as const;

export const RISK_LEVEL_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const PLAYBOOK_TYPE_OPTIONS = [
    { value: "onboarding", label: "Onboarding" },
    { value: "adoption", label: "Adoption" },
    { value: "renewal", label: "Renewal" },
    { value: "expansion", label: "Expansion" },
    { value: "escalation", label: "Escalation" },
] as const;

export const COMMUNICATION_CADENCE_OPTIONS = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Biweekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
] as const;

export const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const LIFECYCLE_STAGE_OPTIONS = [
    { value: "onboarding", label: "Onboarding" },
    { value: "adoption", label: "Adoption" },
    { value: "value_realization", label: "Value Realization" },
    { value: "renewal", label: "Renewal" },
    { value: "expansion", label: "Expansion" },
    { value: "advocacy", label: "Advocacy" },
] as const;

export const CS_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "identified", label: "Identified" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;

export const CS_PERMISSIONS = ["cs.view", "cs.manage", "cs.approve", "cs.admin"] as const;

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
    { value: "devops-deployment", label: "DevOps & Deployment" },
    { value: "customer-success", label: "Customer Success" },
    { value: "support", label: "Support" },
    { value: "hr", label: "HR" },
    { value: "inventory", label: "Inventory" },
    { value: "sales", label: "Sales" },
    { value: "documents", label: "Documents" },
] as const;

export const CS_THEME = {
    primary: "teal-600",
    primaryHover: "teal-500",
    ring: "teal-500/20",
    text: "text-teal-600",
    textDark: "dark:text-teal-400",
    bg: "bg-teal-600",
    bgHover: "hover:bg-teal-500",
} as const;
