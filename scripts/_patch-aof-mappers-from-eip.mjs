#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const src = readFileSync(join(root, "scripts/generate-eip-mappers-types.mjs"), "utf8");

const entitiesBlock = `const entities = [
    { pascal: "OrganizationHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "GrowthOrchestrator", key: "orchestrator_key", title: "orchestrator_name", sub: "orchestrator_status", hub: true, orgOnly: false, createFields: ["orchestratorKey", "orchestratorName", "orchestratorStatus"] },
    { pascal: "CampaignIntelligence", key: "campaign_key", title: "campaign_name", sub: "campaign_status", hub: true, orgOnly: false, createFields: ["campaignKey", "campaignName", "campaignStatus"] },
    { pascal: "LeadPrioritization", key: "lead_key", title: "lead_name", sub: "priority_score", hub: true, orgOnly: false, createFields: ["leadKey", "leadName", "priorityScore"] },
    { pascal: "OpportunityRecommendation", key: "recommendation_key", title: "recommendation_title", sub: "recommendation_type", hub: true, orgOnly: false, createFields: ["recommendationKey", "recommendationTitle", "recommendationType"] },
    { pascal: "PipelineHealth", key: "health_key", title: "health_name", sub: "health_score", hub: true, orgOnly: false, createFields: ["healthKey", "healthName", "healthScore"] },
    { pascal: "GrowthAnalytics", key: "analytics_key", title: "analytics_name", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsName", "analyticsType"] },
    { pascal: "ExecutiveGrowthDashboard", key: "dashboard_key", title: "dashboard_name", sub: "dashboard_status", hub: true, orgOnly: false, createFields: ["dashboardKey", "dashboardName", "dashboardStatus"] },
    { pascal: "DeliveryOrchestrator", key: "orchestrator_key", title: "orchestrator_name", sub: "orchestrator_status", hub: true, orgOnly: false, createFields: ["orchestratorKey", "orchestratorName", "orchestratorStatus"] },
    { pascal: "ResourcePlanner", key: "planner_key", title: "planner_name", sub: "planner_status", hub: true, orgOnly: false, createFields: ["plannerKey", "plannerName", "plannerStatus"] },
    { pascal: "ImplementationScheduler", key: "scheduler_key", title: "scheduler_name", sub: "scheduler_status", hub: true, orgOnly: false, createFields: ["schedulerKey", "schedulerName", "schedulerStatus"] },
    { pascal: "DeploymentCoordination", key: "coordination_key", title: "coordination_name", sub: "coordination_status", hub: true, orgOnly: false, createFields: ["coordinationKey", "coordinationName", "coordinationStatus"] },
    { pascal: "DeliveryIntelligence", key: "intelligence_key", title: "intelligence_title", sub: "intelligence_type", hub: true, orgOnly: false, createFields: ["intelligenceKey", "intelligenceTitle", "intelligenceType"] },
    { pascal: "CustomerSuccessAutomation", key: "automation_key", title: "automation_name", sub: "automation_status", hub: true, orgOnly: false, createFields: ["automationKey", "automationName", "automationStatus"] },
    { pascal: "ExecutiveDeliveryDashboard", key: "dashboard_key", title: "dashboard_name", sub: "dashboard_status", hub: true, orgOnly: false, createFields: ["dashboardKey", "dashboardName", "dashboardStatus"] },
    { pascal: "IdeaRegistry", key: "idea_key", title: "idea_title", sub: "idea_status", hub: true, orgOnly: false, createFields: ["ideaKey", "ideaTitle", "ideaStatus"] },
    { pascal: "InnovationPipeline", key: "pipeline_key", title: "pipeline_name", sub: "pipeline_status", hub: true, orgOnly: false, createFields: ["pipelineKey", "pipelineName", "pipelineStatus"] },
    { pascal: "ExperimentTracker", key: "experiment_key", title: "experiment_name", sub: "experiment_status", hub: true, orgOnly: false, createFields: ["experimentKey", "experimentName", "experimentStatus"] },
    { pascal: "ValidationWorkflow", key: "workflow_key", title: "workflow_name", sub: "workflow_status", hub: true, orgOnly: false, createFields: ["workflowKey", "workflowName", "workflowStatus"] },
    { pascal: "OutcomeEvaluation", key: "evaluation_key", title: "evaluation_title", sub: "evaluation_score", hub: true, orgOnly: false, createFields: ["evaluationKey", "evaluationTitle", "evaluationScore"] },
    { pascal: "KnowledgeRepository", key: "repository_key", title: "repository_name", sub: "repository_status", hub: true, orgOnly: false, createFields: ["repositoryKey", "repositoryName", "repositoryStatus"] },
    { pascal: "AiTaskRouter", key: "router_key", title: "router_name", sub: "router_status", hub: true, orgOnly: false, createFields: ["routerKey", "routerName", "routerStatus"] },
    { pascal: "HumanApprovalEngine", key: "approval_key", title: "approval_name", sub: "approval_status", hub: true, orgOnly: false, createFields: ["approvalKey", "approvalName", "approvalStatus"] },
    { pascal: "PolicyEngine", key: "policy_key", title: "policy_name", sub: "policy_status", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "policyStatus"] },
    { pascal: "ExecutionHistory", key: "history_key", title: "history_title", sub: "execution_status", hub: true, orgOnly: false, createFields: ["historyKey", "historyTitle", "executionStatus"] },
    { pascal: "AiGovernanceRule", key: "rule_key", title: "rule_name", sub: "rule_status", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "ruleStatus"] },
    { pascal: "OrganizationMetric", key: "metrics_key", title: "metrics_key", sub: "overall_organization_score", hub: false, orgOnly: true, createFields: ["metricsKey", "growthScore", "overallOrganizationScore"] },
    { pascal: "OrganizationHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "InnovationDashboard", key: "dashboard_key", title: "dashboard_name", sub: "dashboard_status", hub: true, orgOnly: false, createFields: ["dashboardKey", "dashboardName", "dashboardStatus"] },
    { pascal: "MissionProgress", key: "progress_key", title: "progress_name", sub: "progress_percent", hub: true, orgOnly: false, createFields: ["progressKey", "progressName", "progressPercent"] },
    { pascal: "OrganizationFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];`;

let out = src.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);
out = out.replace(/enterprise-intelligence-platform/g, "ai-organization-foundation");
out = out.replace(/DbEip/g, "DbAof");
out = out.replace(/Eip/g, "Aof");
out = out.replace(/buildIntelligenceHubLookupMaps/g, "buildOrganizationHubLookupMaps");
out = out.replace(/IntelligenceHub/g, "OrganizationHub");
out = out.replace(/intelligenceHubId/g, "organizationHubId");
out = out.replace(/KPI Engine/g, "Autonomous Growth Organization");
out = out.replace(/Executive Intelligence/g, "Autonomous Delivery Organization");
out = out.replace(/Predictive Analytics/g, "Autonomous Innovation Organization");
out = out.replace(/Enterprise Reporting/g, "AI Orchestration");
out = out.replace(/Intelligence SDK/g, "Organization Dashboard");
out = out.replace(/kpi_engine/g, "ago");
out = out.replace(/executive_intelligence/g, "ado");
out = out.replace(/predictive_analytics/g, "aio");
out = out.replace(/enterprise_reporting/g, "ai_orchestration");
out = out.replace(/intelligence_sdk/g, "dashboard");
out = out.replace(/currentStage: "executive_intelligence"/, 'currentStage: "ago"');
out = out.replace(/nextStage: "predictive_analytics"/, 'nextStage: "ado"');
out = out.replace(/previousStage: "kpi_engine"/, 'previousStage: "dashboard"');

const statsBlock = `export interface AofDashboardStats {
    totalOrganizationHubs: number;
    activeOrganizationHubs: number;
    growthOrchestratorCount: number;
    deliveryOrchestratorCount: number;
    ideaRegistryCount: number;
    aiTaskRouterCount: number;
    humanApprovalCount: number;
    openOrganizationFailureCount: number;
    overallOrganizationScore: number;
    growthScore: number;
    deliveryScore: number;
    innovationScore: number;
    pendingAiApprovalCount: number;
    pipelineHealthScore: number;
    missionProgressScore: number;
    auditCount: number;
}`;

out = out.replace(/export interface AofDashboardStats \{[\s\S]*?\}/, statsBlock);

const sdkBlock = `export interface AofSdkRunAgoServiceInput { organizationHubId: string; orchestratorKey?: string; orchestratorName?: string; }
export interface AofSdkRunAgoServiceResult { orchestratorId: string; orchestratorKey: string; status: string; }
export interface AofSdkRunAdoServiceInput { organizationHubId: string; orchestratorKey?: string; orchestratorName?: string; }
export interface AofSdkRunAdoServiceResult { orchestratorId: string; orchestratorKey: string; status: string; }
export interface AofSdkRunAioServiceInput { organizationHubId: string; ideaKey?: string; ideaTitle?: string; }
export interface AofSdkRunAioServiceResult { ideaId: string; ideaKey: string; status: string; }
export interface AofSdkRunOrchestrationServiceInput { organizationHubId: string; routerKey?: string; routerName?: string; }
export interface AofSdkRunOrchestrationServiceResult { routerId: string; routerKey: string; status: string; }`;

out = out.replace(/export interface AofSdkRun[\s\S]*?export interface AofPipelineInfo/, `${sdkBlock}\n\nexport interface AofPipelineInfo`);

const numFields = `const numFields = new Set([
    "priorityScore", "healthScore", "evaluationScore", "progressPercent",
    "growthScore", "overallOrganizationScore", "overallScore",
]);`;

out = out.replace(/const numFields = new Set\(\[[\s\S]*?\]\);/, numFields);

const tailReplace = `    m += \`export function mapGrowthOrchestratorForStats(r: DbAofGrowthOrchestrator) { return { orchestrator_status: r.orchestrator_status, status: r.status }; }
export function mapDeliveryOrchestratorForStats(r: DbAofDeliveryOrchestrator) { return { orchestrator_status: r.orchestrator_status, status: r.status }; }
export function mapIdeaRegistryForStats(r: DbAofIdeaRegistry) { return { idea_status: r.idea_status, status: r.status }; }
export function mapAiTaskRouterForStats(r: DbAofAiTaskRouter) { return { router_status: r.router_status, status: r.status }; }
export function mapHumanApprovalEngineForStats(r: DbAofHumanApprovalEngine) { return { approval_status: r.approval_status, status: r.status }; }
export function mapOrganizationMetricForStats(r: DbAofOrganizationMetric) {
    return {
        growth_score: r.growth_score,
        delivery_score: r.delivery_score,
        innovation_score: r.innovation_score,
        pending_ai_approval_count: r.pending_ai_approval_count,
        pipeline_health_score: r.pipeline_health_score,
        mission_progress_score: r.mission_progress_score,
        overall_organization_score: r.overall_organization_score,
        status: r.status,
    };
}
export function mapOrganizationHealthForStats(r: DbAofOrganizationHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapOrganizationFailureForStats(r: DbAofOrganizationFailure) { return { status: r.status }; }

export function buildAofDashboardStats(input: {
    organizationHubs: OrganizationHubSummary[];
    growthOrchestrators: ReturnType<typeof mapGrowthOrchestratorForStats>[];
    deliveryOrchestrators: ReturnType<typeof mapDeliveryOrchestratorForStats>[];
    ideaRegistry: ReturnType<typeof mapIdeaRegistryForStats>[];
    aiTaskRouters: ReturnType<typeof mapAiTaskRouterForStats>[];
    humanApprovalEngine: ReturnType<typeof mapHumanApprovalEngineForStats>[];
    organizationMetrics: ReturnType<typeof mapOrganizationMetricForStats>[];
    organizationHealth: ReturnType<typeof mapOrganizationHealthForStats>[];
    organizationFailures: OrganizationFailureSummary[];
    auditLogs: AuditEntry[];
}): AofDashboardStats {
    const activeHubs = input.organizationHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.organizationMetrics[0];
    const latestHealth = input.organizationHealth[0];
    const pendingApprovals = input.humanApprovalEngine.filter((a) => a.approval_status === "pending").length;
    return {
        totalOrganizationHubs: input.organizationHubs.length,
        activeOrganizationHubs: activeHubs,
        growthOrchestratorCount: input.growthOrchestrators.length,
        deliveryOrchestratorCount: input.deliveryOrchestrators.length,
        ideaRegistryCount: input.ideaRegistry.length,
        aiTaskRouterCount: input.aiTaskRouters.length,
        humanApprovalCount: pendingApprovals,
        openOrganizationFailureCount: input.organizationFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallOrganizationScore: latestMetrics?.overall_organization_score ?? latestHealth?.overall_score ?? 0,
        growthScore: latestMetrics?.growth_score ?? 0,
        deliveryScore: latestMetrics?.delivery_score ?? 0,
        innovationScore: latestMetrics?.innovation_score ?? 0,
        pendingAiApprovalCount: latestMetrics?.pending_ai_approval_count ?? pendingApprovals,
        pipelineHealthScore: latestMetrics?.pipeline_health_score ?? 0,
        missionProgressScore: latestMetrics?.mission_progress_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
\`;`;

out = out.replace(/    m \+= `export function map[\s\S]*?auditCount: input\.auditLogs\.length,\s*\};\s*\}\s*`;/, tailReplace);

out = out.replace(/enterprise-intelligence-platform-mappers\.ts/g, "ai-organization-foundation-mappers.ts");
out = out.replace(/Generated EIP types and mappers/, "Generated AOF types and mappers");
out = out.replace(/Generates enterprise-intelligence-platform-mappers/, "Generates ai-organization-foundation-mappers");

writeFileSync(join(root, "scripts/generate-aof-mappers-types.mjs"), out, "utf8");
console.log("Patched generate-aof-mappers-types.mjs from EIP template");
