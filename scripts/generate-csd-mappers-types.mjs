#!/usr/bin/env node
/**
 * Generates customer-success-delivery-mappers.ts and types/index.ts for Program F Wave 3.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "DeliveryHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "CustomerHealthScore", key: "score_key", title: "score_key", sub: "customer_ref", hub: true, orgOnly: false, createFields: ["scoreKey", "customerRef", "healthScore"] },
    { pascal: "AdoptionAnalytic", key: "analytics_key", title: "feature_name", sub: "adoption_rate", hub: true, orgOnly: false, createFields: ["analyticsKey", "featureName", "adoptionRate"] },
    { pascal: "SuccessPlan", key: "plan_key", title: "plan_name", sub: "plan_status", hub: true, orgOnly: false, createFields: ["planKey", "planName", "planStatus"] },
    { pascal: "CustomerTimeline", key: "timeline_key", title: "timeline_name", sub: "timeline_type", hub: true, orgOnly: false, createFields: ["timelineKey", "timelineName", "timelineType"] },
    { pascal: "RenewalForecast", key: "forecast_key", title: "forecast_key", sub: "customer_ref", hub: true, orgOnly: false, createFields: ["forecastKey", "customerRef", "forecastStatus"] },
    { pascal: "SupportTicket", key: "ticket_key", title: "ticket_title", sub: "ticket_status", hub: true, orgOnly: false, createFields: ["ticketKey", "ticketTitle", "ticketStatus"] },
    { pascal: "LiveChatSession", key: "session_key", title: "session_title", sub: "session_status", hub: true, orgOnly: false, createFields: ["sessionKey", "sessionTitle", "sessionStatus"] },
    { pascal: "KnowledgeBaseArticle", key: "article_key", title: "article_title", sub: "article_category", hub: true, orgOnly: false, createFields: ["articleKey", "articleTitle", "articleCategory"] },
    { pascal: "SlaPolicy", key: "policy_key", title: "policy_name", sub: "policy_type", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "policyType"] },
    { pascal: "EscalationRule", key: "rule_key", title: "rule_name", sub: "rule_type", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "ruleType"] },
    { pascal: "DeploymentAutomation", key: "automation_key", title: "automation_name", sub: "automation_status", hub: true, orgOnly: false, createFields: ["automationKey", "automationName", "automationStatus"] },
    { pascal: "EnvironmentManagement", key: "environment_key", title: "environment_name", sub: "environment_type", hub: true, orgOnly: false, createFields: ["environmentKey", "environmentName", "environmentType"] },
    { pascal: "DeploymentTracking", key: "tracking_key", title: "deployment_name", sub: "deployment_status", hub: true, orgOnly: false, createFields: ["trackingKey", "deploymentName", "deploymentStatus"] },
    { pascal: "UpgradeManagement", key: "upgrade_key", title: "upgrade_name", sub: "upgrade_status", hub: true, orgOnly: false, createFields: ["upgradeKey", "upgradeName", "upgradeStatus"] },
    { pascal: "ReleaseTracking", key: "release_key", title: "release_name", sub: "release_status", hub: true, orgOnly: false, createFields: ["releaseKey", "releaseName", "releaseStatus"] },
    { pascal: "TrainingPortal", key: "portal_key", title: "portal_name", sub: "portal_type", hub: true, orgOnly: false, createFields: ["portalKey", "portalName", "portalType"] },
    { pascal: "VideoLibrary", key: "video_key", title: "video_title", sub: "video_category", hub: true, orgOnly: false, createFields: ["videoKey", "videoTitle", "videoCategory"] },
    { pascal: "ProductTour", key: "tour_key", title: "tour_name", sub: "tour_type", hub: true, orgOnly: false, createFields: ["tourKey", "tourName", "tourType"] },
    { pascal: "Certification", key: "certification_key", title: "certification_name", sub: "certification_type", hub: true, orgOnly: false, createFields: ["certificationKey", "certificationName", "certificationType"] },
    { pascal: "ProgressTracking", key: "progress_key", title: "progress_key", sub: "learner_ref", hub: true, orgOnly: false, createFields: ["progressKey", "learnerRef", "progressPercent"] },
    { pascal: "LearningAnalytic", key: "analytics_key", title: "metric_name", sub: "completion_rate", hub: true, orgOnly: false, createFields: ["analyticsKey", "metricName", "completionRate"] },
    { pascal: "DeliveryWorkflow", key: "workflow_key", title: "workflow_name", sub: "workflow_status", hub: true, orgOnly: false, createFields: ["workflowKey", "workflowName", "workflowStatus"] },
    { pascal: "OnboardingAutomation", key: "automation_key", title: "automation_name", sub: "automation_status", hub: true, orgOnly: false, createFields: ["automationKey", "automationName", "automationStatus"] },
    { pascal: "ImplementationTracking", key: "tracking_key", title: "implementation_name", sub: "implementation_status", hub: true, orgOnly: false, createFields: ["trackingKey", "implementationName", "implementationStatus"] },
    { pascal: "ResourceAssignment", key: "assignment_key", title: "resource_name", sub: "resource_type", hub: true, orgOnly: false, createFields: ["assignmentKey", "resourceName", "resourceType"] },
    { pascal: "MilestoneTracking", key: "milestone_key", title: "milestone_name", sub: "milestone_status", hub: true, orgOnly: false, createFields: ["milestoneKey", "milestoneName", "milestoneStatus"] },
    { pascal: "OperationsMetric", key: "metrics_key", title: "metrics_key", sub: "overall_delivery_score", hub: false, orgOnly: true, createFields: ["metricsKey", "customerHealthScore", "overallDeliveryScore"] },
    { pascal: "OperationsHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "ExecutiveKpi", key: "kpi_key", title: "kpi_name", sub: "kpi_score", hub: true, orgOnly: false, createFields: ["kpiKey", "kpiName", "kpiScore"] },
    { pascal: "DeliveryFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "healthScore", "adoptionRate", "progressPercent", "completionRate", "customerHealthScore", "overallDeliveryScore",
    "overallScore", "kpiScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface CsdDashboardStats {
    totalDeliveryHubs: number;
    activeDeliveryHubs: number;
    customerHealthScoreCount: number;
    supportTicketCount: number;
    deploymentTrackingCount: number;
    trainingPortalCount: number;
    openDeliveryFailureCount: number;
    overallDeliveryScore: number;
    customerHealthScore: number;
    openTicketCount: number;
    slaComplianceScore: number;
    deploymentStatusScore: number;
    renewalForecastCount: number;
    adoptionRate: number;
    auditCount: number;
}

export interface CsdPipelineInfo {
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

export interface CsdSdkTrackCustomerHealthInput { deliveryHubId: string; scoreKey?: string; customerRef?: string; }
export interface CsdSdkTrackCustomerHealthResult { scoreId: string; scoreKey: string; status: string; }
export interface CsdSdkOpenSupportTicketInput { deliveryHubId: string; ticketKey?: string; ticketTitle?: string; }
export interface CsdSdkOpenSupportTicketResult { ticketId: string; ticketKey: string; status: string; }
export interface CsdSdkRunDeliveryWorkflowInput { deliveryHubId: string; workflowKey?: string; workflowName?: string; }
export interface CsdSdkRunDeliveryWorkflowResult { workflowId: string; workflowKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "DeliveryHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    deliveryHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbCsd${e.pascal}`).concat(["DbCsdAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["CsdDashboardStats", "CsdPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/customer-success-delivery/types";

export function buildDeliveryHubLookupMaps(hubs: DbCsdDeliveryHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildCsdPipelineInfo(): CsdPipelineInfo {
    const stages = [
        { key: "customer_success", label: "Customer Success" },
        { key: "support", label: "Support" },
        { key: "deployment", label: "Deployment" },
        { key: "learning", label: "Learning" },
        { key: "ado_foundation", label: "ADO Foundation" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "deployment", nextStage: "learning", previousStage: "support" };
}

export function buildCsdAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbCsdAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "DeliveryHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.deliveryHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbCsd${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapCustomerHealthScoreForStats(r: DbCsdCustomerHealthScore) { return { health_score: r.health_score, status: r.status }; }
export function mapSupportTicketForStats(r: DbCsdSupportTicket) { return { ticket_status: r.ticket_status, status: r.status }; }
export function mapDeploymentTrackingForStats(r: DbCsdDeploymentTracking) { return { deployment_status: r.deployment_status, status: r.status }; }
export function mapTrainingPortalForStats(r: DbCsdTrainingPortal) { return { status: r.status }; }
export function mapOperationsMetricForStats(r: DbCsdOperationsMetric) {
    return {
        customer_health_score: r.customer_health_score,
        open_ticket_count: r.open_ticket_count,
        sla_compliance_score: r.sla_compliance_score,
        deployment_status_score: r.deployment_status_score,
        renewal_forecast_count: r.renewal_forecast_count,
        adoption_rate: r.adoption_rate,
        overall_delivery_score: r.overall_delivery_score,
        status: r.status,
    };
}
export function mapOperationsHealthForStats(r: DbCsdOperationsHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapDeliveryFailureForStats(r: DbCsdDeliveryFailure) { return { status: r.status }; }

export function buildCsdDashboardStats(input: {
    deliveryHubs: DeliveryHubSummary[];
    customerHealthScores: ReturnType<typeof mapCustomerHealthScoreForStats>[];
    supportTickets: ReturnType<typeof mapSupportTicketForStats>[];
    deploymentTracking: ReturnType<typeof mapDeploymentTrackingForStats>[];
    trainingPortals: ReturnType<typeof mapTrainingPortalForStats>[];
    operationsMetrics: ReturnType<typeof mapOperationsMetricForStats>[];
    operationsHealth: ReturnType<typeof mapOperationsHealthForStats>[];
    deliveryFailures: DeliveryFailureSummary[];
    auditLogs: AuditEntry[];
}): CsdDashboardStats {
    const activeHubs = input.deliveryHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.operationsMetrics[0];
    const latestHealth = input.operationsHealth[0];
    return {
        totalDeliveryHubs: input.deliveryHubs.length,
        activeDeliveryHubs: activeHubs,
        customerHealthScoreCount: input.customerHealthScores.length,
        supportTicketCount: input.supportTickets.length,
        deploymentTrackingCount: input.deploymentTracking.length,
        trainingPortalCount: input.trainingPortals.length,
        openDeliveryFailureCount: input.deliveryFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallDeliveryScore: latestMetrics?.overall_delivery_score ?? latestHealth?.overall_score ?? 0,
        customerHealthScore: latestMetrics?.customer_health_score ?? 0,
        openTicketCount: latestMetrics?.open_ticket_count ?? 0,
        slaComplianceScore: latestMetrics?.sla_compliance_score ?? 0,
        deploymentStatusScore: latestMetrics?.deployment_status_score ?? 0,
        renewalForecastCount: latestMetrics?.renewal_forecast_count ?? 0,
        adoptionRate: latestMetrics?.adoption_rate ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/customer-success-delivery/types"), { recursive: true });
writeFileSync(join(root, "src/modules/customer-success-delivery/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/customer-success-delivery-mappers.ts"), buildMappers(), "utf8");
console.log("Generated CSD types and mappers");
