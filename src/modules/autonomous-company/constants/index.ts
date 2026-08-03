export const AUTONOMOUS_COMPANY_TABS = {
    overview: "overview",
    companyContexts: "companyContexts",
    workflowOrchestration: "workflowOrchestration",
    eventBus: "eventBus",
    workerCollaboration: "workerCollaboration",
    approvals: "approvals",
    notifications: "notifications",
    timeline: "timeline",
    activityFeed: "activityFeed",
    automations: "automations",
    executiveInsights: "executiveInsights",
    predictions: "predictions",
    search: "search",
    commandPalette: "commandPalette",
    emergency: "emergency",
    kpis: "kpis",
    security: "security",
    compliance: "compliance",
    health: "health",
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
    { value: "autonomous_company", label: "Autonomous Company v1" },
    { value: "continuous_operations", label: "Continuous Operations" },
] as const;

export const NOTIFICATION_CHANNEL_OPTIONS = [
    { value: "in_app", label: "In App" },
    { value: "email", label: "Email" },
    { value: "slack", label: "Slack" },
    { value: "webhook", label: "Webhook" },
] as const;

export const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const SEVERITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const KPI_CATEGORY_OPTIONS = [
    { value: "operational", label: "Operational" },
    { value: "financial", label: "Financial" },
    { value: "security", label: "Security" },
    { value: "compliance", label: "Compliance" },
] as const;

export const CONTROL_AREA_OPTIONS = [
    { value: "access", label: "Access Control" },
    { value: "data", label: "Data Protection" },
    { value: "audit", label: "Audit & Logging" },
    { value: "incident", label: "Incident Response" },
] as const;

export const FRAMEWORK_OPTIONS = [
    { value: "soc2", label: "SOC 2" },
    { value: "iso27001", label: "ISO 27001" },
    { value: "gdpr", label: "GDPR" },
    { value: "hipaa", label: "HIPAA" },
] as const;

export const INSIGHT_TYPE_OPTIONS = [
    { value: "summary", label: "Summary" },
    { value: "strategic", label: "Strategic" },
    { value: "operational", label: "Operational" },
    { value: "security", label: "Security" },
] as const;

export const RECOMMENDATION_TYPE_OPTIONS = [
    { value: "operational", label: "Operational" },
    { value: "strategic", label: "Strategic" },
    { value: "security", label: "Security" },
    { value: "compliance", label: "Compliance" },
] as const;

export const AC_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "unread", label: "Unread" },
    { value: "indexed", label: "Indexed" },
] as const;

export const AC_PERMISSIONS = ["ac.view", "ac.manage", "ac.approve", "ac.admin"] as const;

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
    { value: "autonomous-company", label: "Autonomous Company v1" },
] as const;

export const AC_THEME = {
    primary: "violet-600",
    primaryHover: "violet-500",
    ring: "violet-500/20",
    text: "text-violet-600",
    textDark: "dark:text-violet-400",
    bg: "bg-violet-600",
    bgHover: "hover:bg-violet-500",
} as const;
