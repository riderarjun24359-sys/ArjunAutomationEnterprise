#!/usr/bin/env node
/**
 * Generates workflow-engine-mappers.ts and types/index.ts for Program B Sprint 4.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "WorkflowHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "WorkflowDefinition", key: "workflow_key", title: "workflow_name", sub: "workflow_type", hub: true, orgOnly: false, createFields: ["workflowKey", "workflowName", "workflowType"] },
    { pascal: "WorkflowCategory", key: "category_key", title: "category_name", sub: "category_type", hub: true, orgOnly: false, createFields: ["categoryKey", "categoryName", "categoryType"] },
    { pascal: "WorkflowTemplate", key: "template_key", title: "template_name", sub: "template_type", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateType"] },
    { pascal: "WorkflowVersion", key: "version_key", title: "version_number", sub: "release_channel", hub: true, orgOnly: false, createFields: ["versionKey", "versionNumber", "releaseChannel"] },
    { pascal: "WorkflowNode", key: "node_key", title: "node_name", sub: "node_type", hub: true, orgOnly: false, createFields: ["nodeKey", "nodeName", "nodeType"] },
    { pascal: "WorkflowTransition", key: "transition_key", title: "transition_name", sub: "source_node_ref", hub: true, orgOnly: false, createFields: ["transitionKey", "transitionName", "sourceNodeRef"] },
    { pascal: "DecisionNode", key: "decision_key", title: "decision_name", sub: "decision_expression", hub: true, orgOnly: false, createFields: ["decisionKey", "decisionName", "decisionExpression"] },
    { pascal: "ReusableSubflow", key: "subflow_key", title: "subflow_name", sub: "subflow_type", hub: true, orgOnly: false, createFields: ["subflowKey", "subflowName", "subflowType"] },
    { pascal: "WorkflowExecution", key: "execution_key", title: "execution_name", sub: "execution_status", hub: true, orgOnly: false, createFields: ["executionKey", "executionName", "executionStatus"] },
    { pascal: "ExecutionHistory", key: "history_key", title: "history_key", sub: "history_type", hub: true, orgOnly: false, createFields: ["historyKey", "historyType", "historySummary"] },
    { pascal: "ExecutionRetry", key: "retry_key", title: "retry_key", sub: "retry_status", hub: true, orgOnly: false, createFields: ["retryKey", "retryCount", "retryStatus"] },
    { pascal: "ExecutionRollback", key: "rollback_key", title: "rollback_key", sub: "rollback_status", hub: true, orgOnly: false, createFields: ["rollbackKey", "rollbackReason", "rollbackStatus"] },
    { pascal: "TimeTrigger", key: "trigger_key", title: "trigger_name", sub: "cron_expression", hub: true, orgOnly: false, createFields: ["triggerKey", "triggerName", "cronExpression"] },
    { pascal: "BusinessEventTrigger", key: "trigger_key", title: "trigger_name", sub: "event_type", hub: true, orgOnly: false, createFields: ["triggerKey", "triggerName", "eventType"] },
    { pascal: "WebhookTrigger", key: "trigger_key", title: "trigger_name", sub: "webhook_url", hub: true, orgOnly: false, createFields: ["triggerKey", "triggerName", "webhookUrl"] },
    { pascal: "ScheduledTrigger", key: "trigger_key", title: "trigger_name", sub: "schedule_type", hub: true, orgOnly: false, createFields: ["triggerKey", "triggerName", "scheduleType"] },
    { pascal: "ManualReview", key: "review_key", title: "review_name", sub: "review_status", hub: true, orgOnly: false, createFields: ["reviewKey", "reviewName", "reviewStatus"] },
    { pascal: "ApprovalTask", key: "task_key", title: "task_name", sub: "task_status", hub: true, orgOnly: false, createFields: ["taskKey", "taskName", "taskStatus"] },
    { pascal: "EscalationRule", key: "rule_key", title: "rule_name", sub: "escalation_level", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "escalationLevel"] },
    { pascal: "SlaTracking", key: "sla_key", title: "sla_name", sub: "target_minutes", hub: true, orgOnly: false, createFields: ["slaKey", "slaName", "targetMinutes"] },
    { pascal: "AutomationNotification", key: "notification_key", title: "notification_name", sub: "channel", hub: true, orgOnly: false, createFields: ["notificationKey", "notificationName", "channel"] },
    { pascal: "AutomationApiCall", key: "api_key", title: "api_name", sub: "endpoint_url", hub: true, orgOnly: false, createFields: ["apiKey", "apiName", "endpointUrl"] },
    { pascal: "AutomationIntegration", key: "integration_key", title: "integration_name", sub: "integration_type", hub: true, orgOnly: false, createFields: ["integrationKey", "integrationName", "integrationType"] },
    { pascal: "ExecutionAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "BottleneckReport", key: "report_key", title: "report_name", sub: "bottleneck_score", hub: true, orgOnly: false, createFields: ["reportKey", "reportName", "bottleneckScore"] },
    { pascal: "SlaComplianceMetric", key: "metric_key", title: "metric_name", sub: "compliance_rate", hub: true, orgOnly: false, createFields: ["metricKey", "metricName", "complianceRate"] },
    { pascal: "WorkflowMetric", key: "metrics_key", title: "metrics_key", sub: "overall_workflow_score", hub: false, orgOnly: true, createFields: ["metricsKey", "executionCount", "overallWorkflowScore"] },
    { pascal: "WorkflowHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "FailedExecution", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "executionRef", "failureType"] },
    { pascal: "WorkflowFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "retryCount", "escalationLevel", "targetMinutes", "analyticsScore", "bottleneckScore", "complianceRate",
    "executionCount", "overallWorkflowScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface DweDashboardStats {
    totalWorkflowHubs: number;
    activeWorkflowHubs: number;
    workflowNodeCount: number;
    escalationRuleCount: number;
    workflowExecutionCount: number;
    openFailedExecutionCount: number;
    openFailureCount: number;
    overallWorkflowScore: number;
    executionCountScore: number;
    successRateScore: number;
    failureRateScore: number;
    bottleneckScoreMetric: number;
    averageDurationScore: number;
    auditCount: number;
}

export interface DwePipelineInfo {
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

export interface DweSdkRegisterWorkflowInput { workflowHubId: string; workflowKey?: string; workflowName?: string; }
export interface DweSdkRegisterWorkflowResult { workflowId: string; workflowKey: string; status: string; }
export interface DweSdkConfigureAutomationInput { workflowHubId: string; ruleKey?: string; ruleName?: string; }
export interface DweSdkConfigureAutomationResult { ruleId: string; ruleKey: string; status: string; }
export interface DweSdkRunWorkflowExecutionInput { workflowHubId: string; executionKey?: string; executionName?: string; }
export interface DweSdkRunWorkflowExecutionResult { executionId: string; executionKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "WorkflowHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    workflowHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbDwe${e.pascal}`).concat(["DbDweAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["DweDashboardStats", "DwePipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/workflow-engine/types";

export function buildWorkflowHubLookupMaps(hubs: DbDweWorkflowHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildDwePipelineInfo(): DwePipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "design", label: "Design" },
        { key: "trigger", label: "Trigger" },
        { key: "execute", label: "Execute" },
        { key: "automate", label: "Automate" },
    ];
    return { stages, currentStage: "execute", nextStage: "automate", previousStage: "trigger" };
}

export function buildDweAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbDweAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "WorkflowHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.workflowHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbDwe${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapWorkflowNodeForStats(r: DbDweWorkflowNode) { return { status: r.status }; }
export function mapEscalationRuleForStats(r: DbDweEscalationRule) { return { status: r.status }; }
export function mapWorkflowMetricForStats(r: DbDweWorkflowMetric) {
    return {
        execution_count: r.execution_count,
        average_duration_ms: r.average_duration_ms,
        failure_rate: r.failure_rate,
        success_rate: r.success_rate,
        bottleneck_score: r.bottleneck_score,
        sla_compliance_score: r.sla_compliance_score,
        overall_workflow_score: r.overall_workflow_score,
        status: r.status,
    };
}
export function mapWorkflowExecutionForStats(r: DbDweWorkflowExecution) { return { execution_status: r.execution_status, status: r.status }; }
export function mapFailedExecutionForStats(r: DbDweFailedExecution) { return { status: r.status }; }
export function mapApprovalTaskForStats(r: DbDweApprovalTask) { return { status: r.status }; }
export function mapWorkflowHealthForStats(r: DbDweWorkflowHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapWorkflowFailureForStats(r: DbDweWorkflowFailure) { return { status: r.status }; }

export function buildDweDashboardStats(input: {
    workflowHubs: WorkflowHubSummary[];
    workflowNodes: ReturnType<typeof mapWorkflowNodeForStats>[];
    escalationRules: ReturnType<typeof mapEscalationRuleForStats>[];
    workflowMetrics: ReturnType<typeof mapWorkflowMetricForStats>[];
    workflowExecutions: ReturnType<typeof mapWorkflowExecutionForStats>[];
    failedExecutions: ReturnType<typeof mapFailedExecutionForStats>[];
    approvalTasks: ReturnType<typeof mapApprovalTaskForStats>[];
    workflowHealth: ReturnType<typeof mapWorkflowHealthForStats>[];
    workflowFailures: WorkflowFailureSummary[];
    auditLogs: AuditEntry[];
}): DweDashboardStats {
    const activeHubs = input.workflowHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.workflowMetrics[0];
    const latestHealth = input.workflowHealth[0];
    return {
        totalWorkflowHubs: input.workflowHubs.length,
        activeWorkflowHubs: activeHubs,
        workflowNodeCount: input.workflowNodes.length,
        escalationRuleCount: input.escalationRules.length,
        workflowExecutionCount: input.workflowExecutions.length,
        openFailedExecutionCount: input.failedExecutions.filter((r) => r.status === "open").length,
        openFailureCount: input.workflowFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallWorkflowScore: latestMetrics?.overall_workflow_score ?? latestHealth?.overall_score ?? 0,
        executionCountScore: latestMetrics?.execution_count ?? 0,
        successRateScore: latestMetrics?.success_rate ?? 0,
        failureRateScore: latestMetrics?.failure_rate ?? 0,
        bottleneckScoreMetric: latestMetrics?.bottleneck_score ?? 0,
        averageDurationScore: latestMetrics?.average_duration_ms ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/workflow-engine/types"), { recursive: true });
writeFileSync(join(root, "src/modules/workflow-engine/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/workflow-engine-mappers.ts"), buildMappers(), "utf8");
console.log("Generated DWE types and mappers");
