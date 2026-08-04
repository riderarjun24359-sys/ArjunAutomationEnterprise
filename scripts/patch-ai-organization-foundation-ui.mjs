#!/usr/bin/env node
/**
 * Patches generate-ai-organization-foundation-ui.mjs from EIP UI generator template.
 * Run: node scripts/patch-ai-organization-foundation-ui.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const inPath = join(root, "scripts/generate-enterprise-intelligence-platform-ui.mjs");
const outPath = join(root, "scripts/generate-ai-organization-foundation-ui.mjs");
let s = readFileSync(inPath, "utf8");

s = s.replace(/src\/modules\/enterprise-intelligence-platform/g, "src/modules/ai-organization-foundation");

const aofEntities = `const entities = [
    { tab: "organizationHubs", plural: "organizationHubs", singular: "OrganizationHub", pascal: "OrganizationHub", db: "aofOrganizationHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "growthOrchestrators", plural: "growthOrchestrators", singular: "GrowthOrchestrator", pascal: "GrowthOrchestrator", db: "aofGrowthOrchestrators", fields: [{ name: "orchestratorKey", type: "string" }, { name: "orchestratorName", type: "string" }, { name: "orchestratorStatus", type: "select", options: "ORCHESTRATOR_STATUS_OPTIONS" }], display: { title: "orchestratorName", sub: "orchestratorStatus" } },
    { tab: "campaignIntelligence", plural: "campaignIntelligence", singular: "CampaignIntelligence", pascal: "CampaignIntelligence", db: "aofCampaignIntelligence", fields: [{ name: "campaignKey", type: "string" }, { name: "campaignName", type: "string" }, { name: "campaignStatus", type: "select", options: "CAMPAIGN_STATUS_OPTIONS" }], display: { title: "campaignName", sub: "campaignStatus" } },
    { tab: "leadPrioritization", plural: "leadPrioritization", singular: "LeadPrioritization", pascal: "LeadPrioritization", db: "aofLeadPrioritization", fields: [{ name: "leadKey", type: "string" }, { name: "leadName", type: "string" }, { name: "priorityScore", type: "number" }], display: { title: "leadName", sub: "priorityScore" } },
    { tab: "opportunityRecommendations", plural: "opportunityRecommendations", singular: "OpportunityRecommendation", pascal: "OpportunityRecommendation", db: "aofOpportunityRecommendations", fields: [{ name: "recommendationKey", type: "string" }, { name: "recommendationTitle", type: "string" }, { name: "recommendationType", type: "string" }], display: { title: "recommendationTitle", sub: "recommendationType" } },
    { tab: "pipelineHealth", plural: "pipelineHealth", singular: "PipelineHealth", pascal: "PipelineHealth", db: "aofPipelineHealth", fields: [{ name: "healthKey", type: "string" }, { name: "healthName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "healthName", sub: "healthScore" } },
    { tab: "growthAnalytics", plural: "growthAnalytics", singular: "GrowthAnalytics", pascal: "GrowthAnalytics", db: "aofGrowthAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsName", type: "string" }, { name: "analyticsType", type: "string" }], display: { title: "analyticsName", sub: "analyticsType" } },
    { tab: "executiveGrowthDashboards", plural: "executiveGrowthDashboards", singular: "ExecutiveGrowthDashboard", pascal: "ExecutiveGrowthDashboard", db: "aofExecutiveGrowthDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "deliveryOrchestrators", plural: "deliveryOrchestrators", singular: "DeliveryOrchestrator", pascal: "DeliveryOrchestrator", db: "aofDeliveryOrchestrators", fields: [{ name: "orchestratorKey", type: "string" }, { name: "orchestratorName", type: "string" }, { name: "orchestratorStatus", type: "select", options: "ORCHESTRATOR_STATUS_OPTIONS" }], display: { title: "orchestratorName", sub: "orchestratorStatus" } },
    { tab: "resourcePlanners", plural: "resourcePlanners", singular: "ResourcePlanner", pascal: "ResourcePlanner", db: "aofResourcePlanners", fields: [{ name: "plannerKey", type: "string" }, { name: "plannerName", type: "string" }, { name: "plannerStatus", type: "select", options: "PLANNER_STATUS_OPTIONS" }], display: { title: "plannerName", sub: "plannerStatus" } },
    { tab: "implementationSchedulers", plural: "implementationSchedulers", singular: "ImplementationScheduler", pascal: "ImplementationScheduler", db: "aofImplementationSchedulers", fields: [{ name: "schedulerKey", type: "string" }, { name: "schedulerName", type: "string" }, { name: "schedulerStatus", type: "select", options: "SCHEDULER_STATUS_OPTIONS" }], display: { title: "schedulerName", sub: "schedulerStatus" } },
    { tab: "deploymentCoordination", plural: "deploymentCoordination", singular: "DeploymentCoordination", pascal: "DeploymentCoordination", db: "aofDeploymentCoordination", fields: [{ name: "coordinationKey", type: "string" }, { name: "coordinationName", type: "string" }, { name: "coordinationStatus", type: "select", options: "COORDINATION_STATUS_OPTIONS" }], display: { title: "coordinationName", sub: "coordinationStatus" } },
    { tab: "deliveryIntelligence", plural: "deliveryIntelligence", singular: "DeliveryIntelligence", pascal: "DeliveryIntelligence", db: "aofDeliveryIntelligence", fields: [{ name: "intelligenceKey", type: "string" }, { name: "intelligenceTitle", type: "string" }, { name: "intelligenceType", type: "string" }], display: { title: "intelligenceTitle", sub: "intelligenceType" } },
    { tab: "customerSuccessAutomation", plural: "customerSuccessAutomation", singular: "CustomerSuccessAutomation", pascal: "CustomerSuccessAutomation", db: "aofCustomerSuccessAutomation", fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" } },
    { tab: "executiveDeliveryDashboards", plural: "executiveDeliveryDashboards", singular: "ExecutiveDeliveryDashboard", pascal: "ExecutiveDeliveryDashboard", db: "aofExecutiveDeliveryDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "ideaRegistry", plural: "ideaRegistry", singular: "IdeaRegistry", pascal: "IdeaRegistry", db: "aofIdeaRegistry", fields: [{ name: "ideaKey", type: "string" }, { name: "ideaTitle", type: "string" }, { name: "ideaStatus", type: "select", options: "IDEA_STATUS_OPTIONS" }], display: { title: "ideaTitle", sub: "ideaStatus" } },
    { tab: "innovationPipeline", plural: "innovationPipeline", singular: "InnovationPipeline", pascal: "InnovationPipeline", db: "aofInnovationPipeline", fields: [{ name: "pipelineKey", type: "string" }, { name: "pipelineName", type: "string" }, { name: "pipelineStatus", type: "select", options: "PIPELINE_STATUS_OPTIONS" }], display: { title: "pipelineName", sub: "pipelineStatus" } },
    { tab: "experimentTracker", plural: "experimentTracker", singular: "ExperimentTracker", pascal: "ExperimentTracker", db: "aofExperimentTracker", fields: [{ name: "experimentKey", type: "string" }, { name: "experimentName", type: "string" }, { name: "experimentStatus", type: "select", options: "EXPERIMENT_STATUS_OPTIONS" }], display: { title: "experimentName", sub: "experimentStatus" } },
    { tab: "validationWorkflow", plural: "validationWorkflow", singular: "ValidationWorkflow", pascal: "ValidationWorkflow", db: "aofValidationWorkflow", fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowStatus", type: "select", options: "WORKFLOW_STATUS_OPTIONS" }], display: { title: "workflowName", sub: "workflowStatus" } },
    { tab: "outcomeEvaluation", plural: "outcomeEvaluation", singular: "OutcomeEvaluation", pascal: "OutcomeEvaluation", db: "aofOutcomeEvaluation", fields: [{ name: "evaluationKey", type: "string" }, { name: "evaluationTitle", type: "string" }, { name: "evaluationScore", type: "number" }], display: { title: "evaluationTitle", sub: "evaluationScore" } },
    { tab: "knowledgeRepository", plural: "knowledgeRepository", singular: "KnowledgeRepository", pascal: "KnowledgeRepository", db: "aofKnowledgeRepository", fields: [{ name: "repositoryKey", type: "string" }, { name: "repositoryName", type: "string" }, { name: "repositoryStatus", type: "select", options: "REPOSITORY_STATUS_OPTIONS" }], display: { title: "repositoryName", sub: "repositoryStatus" } },
    { tab: "aiTaskRouters", plural: "aiTaskRouters", singular: "AiTaskRouter", pascal: "AiTaskRouter", db: "aofAiTaskRouters", fields: [{ name: "routerKey", type: "string" }, { name: "routerName", type: "string" }, { name: "routerStatus", type: "select", options: "ROUTER_STATUS_OPTIONS" }], display: { title: "routerName", sub: "routerStatus" } },
    { tab: "humanApprovalEngine", plural: "humanApprovalEngine", singular: "HumanApprovalEngine", pascal: "HumanApprovalEngine", db: "aofHumanApprovalEngine", fields: [{ name: "approvalKey", type: "string" }, { name: "approvalName", type: "string" }, { name: "approvalStatus", type: "select", options: "APPROVAL_STATUS_OPTIONS" }], display: { title: "approvalName", sub: "approvalStatus" } },
    { tab: "policyEngine", plural: "policyEngine", singular: "PolicyEngine", pascal: "PolicyEngine", db: "aofPolicyEngine", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyStatus", type: "select", options: "POLICY_STATUS_OPTIONS" }], display: { title: "policyName", sub: "policyStatus" } },
    { tab: "executionHistory", plural: "executionHistory", singular: "ExecutionHistory", pascal: "ExecutionHistory", db: "aofExecutionHistory", fields: [{ name: "historyKey", type: "string" }, { name: "historyTitle", type: "string" }, { name: "executionStatus", type: "string" }], display: { title: "historyTitle", sub: "executionStatus" } },
    { tab: "aiGovernanceRules", plural: "aiGovernanceRules", singular: "AiGovernanceRule", pascal: "AiGovernanceRule", db: "aofAiGovernanceRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleStatus", type: "select", options: "GOVERNANCE_STATUS_OPTIONS" }], display: { title: "ruleName", sub: "ruleStatus" } },
    { tab: "organizationMetrics", plural: "organizationMetrics", singular: "OrganizationMetric", pascal: "OrganizationMetric", db: "aofOrganizationMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "growthScore", type: "number" }, { name: "overallOrganizationScore", type: "number" }], display: { title: "metricsKey", sub: "overallOrganizationScore" } },
    { tab: "organizationHealth", plural: "organizationHealth", singular: "OrganizationHealth", pascal: "OrganizationHealth", db: "aofOrganizationHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "innovationDashboards", plural: "innovationDashboards", singular: "InnovationDashboard", pascal: "InnovationDashboard", db: "aofInnovationDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "missionProgress", plural: "missionProgress", singular: "MissionProgress", pascal: "MissionProgress", db: "aofMissionProgress", fields: [{ name: "progressKey", type: "string" }, { name: "progressName", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressName", sub: "progressPercent" } },
    { tab: "organizationFailures", plural: "organizationFailures", singular: "OrganizationFailure", pascal: "OrganizationFailure", db: "aofOrganizationFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const entities = \[[\s\S]*?\];/, aofEntities);

const reps = [
    [/enterprise-intelligence-platform/g, "ai-organization-foundation"],
    [/EnterpriseIntelligencePlatform/g, "AiOrganizationFoundation"],
    [/enterpriseIntelligencePlatform/g, "aiOrganizationFoundation"],
    [/EIP_/g, "AOF_"],
    [/Eip/g, "Aof"],
    [/eip/g, "aof"],
    [/IntelligenceHub/g, "OrganizationHub"],
    [/intelligenceHub/g, "organizationHub"],
    [/intelligenceHubId/g, "organizationHubId"],
    [/IntelligenceHubSelect/g, "OrganizationHubSelect"],
    [/buildIntelligenceHubLookupMaps/g, "buildOrganizationHubLookupMaps"],
    [/IntelligenceMetric/g, "OrganizationMetric"],
    [/IntelligenceHealth/g, "OrganizationHealth"],
    [/IntelligenceFailure/g, "OrganizationFailure"],
    [/intelligenceMetrics/g, "organizationMetrics"],
    [/intelligenceHealth/g, "organizationHealth"],
    [/intelligenceFailures/g, "organizationFailures"],
    [/totalIntelligenceHubs/g, "totalOrganizationHubs"],
    [/activeIntelligenceHubs/g, "activeOrganizationHubs"],
    [/overallIntelligenceScore/g, "overallOrganizationScore"],
    [/unifiedKpiScore/g, "growthScore"],
    [/businessHealthScore/g, "deliveryScore"],
    [/operationalEfficiencyScore/g, "innovationScore"],
    [/revenueForecastTotal/g, "pipelineHealthScore"],
    [/customerForecastTotal/g, "missionProgressScore"],
    [/riskScore/g, "pendingAiApprovalCount"],
    [/kpiRegistryCount/g, "growthOrchestratorCount"],
    [/executiveDashboardCount/g, "deliveryOrchestratorCount"],
    [/revenueForecastCount/g, "ideaRegistryCount"],
    [/crossModuleInsightCount/g, "aiTaskRouterCount"],
    [/strategicInsightCount/g, "humanApprovalCount"],
    [/openIntelligenceFailureCount/g, "openOrganizationFailureCount"],
    [/mapKpiRegistryForStats/g, "mapGrowthOrchestratorForStats"],
    [/mapExecutiveDashboardForStats/g, "mapDeliveryOrchestratorForStats"],
    [/mapRevenueForecastForStats/g, "mapIdeaRegistryForStats"],
    [/mapCrossModuleInsightForStats/g, "mapAiTaskRouterForStats"],
    [/mapIntelligenceMetricForStats/g, "mapOrganizationMetricForStats"],
    [/mapIntelligenceHealthForStats/g, "mapOrganizationHealthForStats"],
    [/mapIntelligenceFailureForStats/g, "mapOrganizationFailureForStats"],
    [/kpiRegistry/g, "growthOrchestrators"],
    [/executiveDashboards/g, "deliveryOrchestrators"],
    [/revenueForecasts/g, "ideaRegistry"],
    [/crossModuleInsights/g, "aiTaskRouters"],
    [/createKpiRegistry/g, "createGrowthOrchestrator"],
    [/createExecutiveDashboard/g, "createDeliveryOrchestrator"],
    [/createStrategicInsight/g, "createIdeaRegistry"],
    [/createAiTaskRouter/g, "createAiTaskRouter"],
    [/KpiService/g, "AgoService"],
    [/IntelligenceService/g, "AdoService"],
    [/ForecastService/g, "AioService"],
    [/ReportingService/g, "OrchestrationService"],
    [/ExecutiveInsightService/g, "OrchestrationService"],
    [/runKpiService/g, "runAgoService"],
    [/runIntelligenceService/g, "runAdoService"],
    [/runForecastService/g, "runAioService"],
    [/runReportingService/g, "runOrchestrationService"],
    [/runExecutiveInsightService/g, "runOrchestrationService"],
    [/sdkRunKpiService/g, "sdkRunAgoService"],
    [/sdkRunIntelligenceService/g, "sdkRunAdoService"],
    [/sdkRunForecastService/g, "sdkRunAioService"],
    [/sdkRunReportingService/g, "sdkRunOrchestrationService"],
    [/sdkRunExecutiveInsightService/g, "sdkRunOrchestrationService"],
    [/AofSdkRunKpiService/g, "AofSdkRunAgoService"],
    [/AofSdkRunIntelligenceService/g, "AofSdkRunAdoService"],
    [/AofSdkRunForecastService/g, "AofSdkRunAioService"],
    [/AofSdkRunReportingService/g, "AofSdkRunOrchestrationService"],
    [/AofSdkRunExecutiveInsightService/g, "AofSdkRunOrchestrationService"],
    [/enterprise_intelligence_platform/g, "ai_organization_foundation"],
    [/fuchsia/g, "orange"],
    [/KPI_STATUS_OPTIONS/g, "ORCHESTRATOR_STATUS_OPTIONS"],
    [/CATEGORY_STATUS_OPTIONS/g, "CAMPAIGN_STATUS_OPTIONS"],
    [/CONFIG_STATUS_OPTIONS/g, "APPROVAL_STATUS_OPTIONS"],
    [/createCustomerOperatedPlatformClient/g, "createEnterpriseIntelligencePlatformClient"],
    [/getOperatedHubs/g, "getIntelligenceHubs"],
    [/Brain/g, "Bot"],
    [/Enterprise Intelligence Platform/g, "AI Organization Foundation"],
    [/Enterprise Intelligence/g, "AI Organization"],
    [/Intelligence Hubs/g, "Organization Hubs"],
    [/intelligence hub/g, "organization hub"],
    [/Select intelligence hub/g, "Select organization hub"],
    [/"eip\./g, '"aof.'],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(
    /import { createCompanyFoundationClient } from "@\/src\/modules\/company-foundation\/sdk";\r?\nimport { createCustomerSuccessDeliveryClient } from "@\/src\/modules\/customer-success-delivery\/sdk";\r?\nimport { createCustomerOperatedPlatformClient } from "@\/src\/modules\/customer-operated-platform\/sdk";\r?\nimport { crmService } from "@\/src\/modules\/crm\/services\/crm\.service";/,
    `import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { createCustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";
import { createEnterpriseIntelligencePlatformClient } from "@/src/modules/enterprise-intelligence-platform/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";`,
);

const aofOptions = `export const ORCHESTRATOR_STATUS_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const AOF_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const AOF_THEME)/,
    `$1${aofOptions}$2`,
);

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-ai-organization-foundation-ui.mjs");
