#!/usr/bin/env node
/**
 * Generates ai-organization-foundation-mappers.ts and types/index.ts.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
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
];

const numFields = new Set([
    "priorityScore", "healthScore", "evaluationScore", "progressPercent",
    "growthScore", "overallOrganizationScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface AofDashboardStats {
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
}

export interface AofPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface AofSdkRunAgoServiceInput { organizationHubId: string; orchestratorKey?: string; orchestratorName?: string; }
export interface AofSdkRunAgoServiceResult { orchestratorId: string; orchestratorKey: string; status: string; }
export interface AofSdkRunAdoServiceInput { organizationHubId: string; orchestratorKey?: string; orchestratorName?: string; }
export interface AofSdkRunAdoServiceResult { orchestratorId: string; orchestratorKey: string; status: string; }
export interface AofSdkRunAioServiceInput { organizationHubId: string; ideaKey?: string; ideaTitle?: string; }
export interface AofSdkRunAioServiceResult { ideaId: string; ideaKey: string; status: string; }
export interface AofSdkRunOrchestrationServiceInput { organizationHubId: string; routerKey?: string; routerName?: string; }
export interface AofSdkRunOrchestrationServiceResult { routerId: string; routerKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "OrganizationHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    organizationHubId: string;\n    ";
        t += `export interface ${e.pascal}Summary {
    id: string;
    ${isHub ? "" : "hubName?: string;\n    "}${summaryFields}
    status: string;
}

export interface Create${e.pascal}Input {
    ${createExtra}${fields}
}

`;
    }
    return t;
}

function buildMappers() {
    const dbImports = entities.map((e) => `DbAof${e.pascal}`).concat(["DbAofAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["AofDashboardStats", "AofPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/ai-organization-foundation/types";

export function buildOrganizationHubLookupMaps(hubs: DbAofOrganizationHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildAofPipelineInfo(): AofPipelineInfo {
    const stages = [
        { key: "ago", label: "Autonomous Growth Organization" },
        { key: "ado", label: "Autonomous Delivery Organization" },
        { key: "aio", label: "Autonomous Innovation Organization" },
        { key: "ai_orchestration", label: "AI Orchestration" },
        { key: "dashboard", label: "Organization Dashboard" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "ado", nextStage: "aio", previousStage: "ago" };
}

export function buildAofAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbAofAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "OrganizationHub";
        const mapFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const cast = boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string";
            return `        ${f}: record.${snake} as ${cast},`;
        }).join("\n");
        const payloadFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const def = boolFields.has(f) ? "false" : numFields.has(f) ? "0" : "''";
            return `        ${snake}: input.${f} ?? ${def},`;
        }).join("\n");
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.organizationHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        const mapsParam = isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }";
        m += `export function map${e.pascal}Summary(record: DbAof${e.pascal}${mapsParam}): ${e.pascal}Summary {
    return {
        id: record.id,
${hubNameLine}${mapFields}
        status: record.status,
    };
}

export function build${e.pascal}Payload(organizationId: string, input: Create${e.pascal}Input): Record<string, unknown> {
    return {
        organization_id: organizationId,
${hubLine}${payloadFields}
        status: "active",
    };
}

`;
    }

    m += `export function mapGrowthOrchestratorForStats(r: DbAofGrowthOrchestrator) { return { orchestrator_status: r.orchestrator_status, status: r.status }; }
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
`;

    return m;
}

mkdirSync(join(root, "src/modules/ai-organization-foundation/types"), { recursive: true });
writeFileSync(join(root, "src/modules/ai-organization-foundation/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/ai-organization-foundation-mappers.ts"), buildMappers(), "utf8");
console.log("Generated AOF types and mappers");
