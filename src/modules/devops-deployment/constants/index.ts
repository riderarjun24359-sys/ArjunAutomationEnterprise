export const DEVOPS_DEPLOYMENT_TABS = {
    overview: "overview",
    engagements: "engagements",
    cicdPipelines: "cicdPipelines",
    environments: "environments",
    infrastructureTemplates: "infrastructureTemplates",
    dockerConfigs: "dockerConfigs",
    kubernetesPlans: "kubernetesPlans",
    releaseOrchestration: "releaseOrchestration",
    rollbackPlans: "rollbackPlans",
    blueGreenPlans: "blueGreenPlans",
    canaryPlans: "canaryPlans",
    monitoring: "monitoring",
    logging: "logging",
    healthChecks: "healthChecks",
    backupVerification: "backupVerification",
    disasterRecovery: "disasterRecovery",
    costEstimates: "costEstimates",
    deploymentApprovals: "deploymentApprovals",
    releaseVersions: "releaseVersions",
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
    { value: "production_deployment", label: "Production Deployment" },
] as const;

export const CICD_PLATFORM_OPTIONS = [
    { value: "github_actions", label: "GitHub Actions" },
    { value: "gitlab_ci", label: "GitLab CI" },
    { value: "azure_devops", label: "Azure DevOps" },
    { value: "jenkins", label: "Jenkins" },
] as const;

export const ENVIRONMENT_TYPE_OPTIONS = [
    { value: "development", label: "Development" },
    { value: "staging", label: "Staging" },
    { value: "production", label: "Production" },
    { value: "dr", label: "Disaster Recovery" },
] as const;

export const CLOUD_PROVIDER_OPTIONS = [
    { value: "aws", label: "AWS" },
    { value: "azure", label: "Azure" },
    { value: "gcp", label: "GCP" },
    { value: "on_prem", label: "On-Premises" },
] as const;

export const TEMPLATE_TYPE_OPTIONS = [
    { value: "terraform", label: "Terraform" },
    { value: "cloudformation", label: "CloudFormation" },
    { value: "pulumi", label: "Pulumi" },
    { value: "bicep", label: "Bicep" },
] as const;

export const MONITORING_PROVIDER_OPTIONS = [
    { value: "datadog", label: "Datadog" },
    { value: "prometheus", label: "Prometheus" },
    { value: "cloudwatch", label: "CloudWatch" },
    { value: "new_relic", label: "New Relic" },
] as const;

export const LOGGING_PROVIDER_OPTIONS = [
    { value: "cloudwatch", label: "CloudWatch" },
    { value: "datadog", label: "Datadog" },
    { value: "elasticsearch", label: "Elasticsearch" },
    { value: "splunk", label: "Splunk" },
] as const;

export const APPROVER_ROLE_OPTIONS = [
    { value: "release_manager", label: "Release Manager" },
    { value: "engineering_lead", label: "Engineering Lead" },
    { value: "security_officer", label: "Security Officer" },
    { value: "operations_lead", label: "Operations Lead" },
] as const;

export const DEPLOYMENT_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "active", label: "Active" },
    { value: "passed", label: "Passed" },
] as const;

export const DD_PERMISSIONS = ["dd.view", "dd.manage", "dd.approve", "dd.admin"] as const;

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
    { value: "hr", label: "HR" },
    { value: "inventory", label: "Inventory" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
    { value: "documents", label: "Documents" },
] as const;

export const DD_THEME = {
    primary: "indigo-600",
    primaryHover: "indigo-500",
    ring: "indigo-500/20",
    text: "text-indigo-600",
    textDark: "dark:text-indigo-400",
    bg: "bg-indigo-600",
    bgHover: "hover:bg-indigo-500",
} as const;
