#!/usr/bin/env node
/**
 * Generates business-process-mappers.ts and types/index.ts for Program B Sprint 2.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "ProcessHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "BusinessProcess", key: "process_key", title: "process_name", sub: "process_type", hub: true, orgOnly: false, createFields: ["processKey", "processName", "processType"] },
    { pascal: "ProcessCategory", key: "category_key", title: "category_name", sub: "category_type", hub: true, orgOnly: false, createFields: ["categoryKey", "categoryName", "categoryType"] },
    { pascal: "ProcessVersion", key: "version_key", title: "version_number", sub: "release_channel", hub: true, orgOnly: false, createFields: ["versionKey", "versionNumber", "releaseChannel"] },
    { pascal: "ProcessDependency", key: "dependency_key", title: "dependency_key", sub: "dependency_type", hub: true, orgOnly: false, createFields: ["dependencyKey", "dependencyType", "dependencyRef"] },
    { pascal: "ProcessModel", key: "model_key", title: "model_name", sub: "model_type", hub: true, orgOnly: false, createFields: ["modelKey", "modelName", "modelType"] },
    { pascal: "ProcessStep", key: "step_key", title: "step_name", sub: "step_order", hub: true, orgOnly: false, createFields: ["stepKey", "stepName", "stepOrder"] },
    { pascal: "DecisionPoint", key: "decision_key", title: "decision_name", sub: "decision_type", hub: true, orgOnly: false, createFields: ["decisionKey", "decisionName", "decisionType"] },
    { pascal: "ReusableBlock", key: "block_key", title: "block_name", sub: "block_type", hub: true, orgOnly: false, createFields: ["blockKey", "blockName", "blockType"] },
    { pascal: "ApprovalRule", key: "rule_key", title: "rule_name", sub: "rule_type", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "ruleType"] },
    { pascal: "SequentialApproval", key: "approval_key", title: "approval_name", sub: "approval_order", hub: true, orgOnly: false, createFields: ["approvalKey", "approvalName", "approvalOrder"] },
    { pascal: "ParallelApproval", key: "approval_key", title: "approval_name", sub: "approver_count", hub: true, orgOnly: false, createFields: ["approvalKey", "approvalName", "approverCount"] },
    { pascal: "EscalationRule", key: "escalation_key", title: "escalation_name", sub: "escalation_level", hub: true, orgOnly: false, createFields: ["escalationKey", "escalationName", "escalationLevel"] },
    { pascal: "TaskAssignment", key: "assignment_key", title: "assignment_name", sub: "assignee_ref", hub: true, orgOnly: false, createFields: ["assignmentKey", "assignmentName", "assigneeRef"] },
    { pascal: "TaskTemplate", key: "template_key", title: "template_name", sub: "template_type", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateType"] },
    { pascal: "RecurringTask", key: "task_key", title: "task_name", sub: "recurrence_pattern", hub: true, orgOnly: false, createFields: ["taskKey", "taskName", "recurrencePattern"] },
    { pascal: "TaskSlaPolicy", key: "policy_key", title: "policy_name", sub: "sla_hours", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "slaHours"] },
    { pascal: "RuleCondition", key: "condition_key", title: "condition_name", sub: "condition_type", hub: true, orgOnly: false, createFields: ["conditionKey", "conditionName", "conditionType"] },
    { pascal: "RuleValidation", key: "validation_key", title: "validation_name", sub: "validation_score", hub: true, orgOnly: false, createFields: ["validationKey", "validationName", "validationScore"] },
    { pascal: "RuleCalculation", key: "calculation_key", title: "calculation_name", sub: "calculation_type", hub: true, orgOnly: false, createFields: ["calculationKey", "calculationName", "calculationType"] },
    { pascal: "ReusableRule", key: "rule_key", title: "rule_name", sub: "rule_type", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "ruleType"] },
    { pascal: "ProcessExecution", key: "execution_key", title: "execution_name", sub: "execution_status", hub: true, orgOnly: false, createFields: ["executionKey", "executionName", "executionStatus"] },
    { pascal: "ExecutionHistory", key: "history_key", title: "history_key", sub: "history_type", hub: true, orgOnly: false, createFields: ["historyKey", "historyType", "historySummary"] },
    { pascal: "ExecutionRetry", key: "retry_key", title: "retry_key", sub: "retry_count", hub: true, orgOnly: false, createFields: ["retryKey", "retryCount", "retryReason"] },
    { pascal: "ExecutionAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "BottleneckReport", key: "report_key", title: "report_name", sub: "bottleneck_score", hub: true, orgOnly: false, createFields: ["reportKey", "reportName", "bottleneckScore"] },
    { pascal: "SlaPerformanceMetric", key: "metric_key", title: "metric_name", sub: "sla_score", hub: true, orgOnly: false, createFields: ["metricKey", "metricName", "slaScore"] },
    { pascal: "ProcessMetric", key: "metrics_key", title: "metrics_key", sub: "overall_process_score", hub: false, orgOnly: true, createFields: ["metricsKey", "executionCount", "overallProcessScore"] },
    { pascal: "ProcessHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "FailedProcessRecord", key: "record_key", title: "record_name", sub: "failure_type", hub: true, orgOnly: false, createFields: ["recordKey", "recordName", "failureType"] },
    { pascal: "ProcessFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "stepOrder", "approvalOrder", "approverCount", "escalationLevel", "slaHours",
    "validationScore", "retryCount", "analyticsScore", "bottleneckScore", "slaScore",
    "executionCount", "overallProcessScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface BpfDashboardStats {
    totalProcessHubs: number;
    activeProcessHubs: number;
    taskTemplateCount: number;
    approvalRuleCount: number;
    processExecutionCount: number;
    openFailedRecordCount: number;
    openFailureCount: number;
    overallProcessScore: number;
    executionCountScore: number;
    successRateScore: number;
    slaPerformanceScore: number;
    bottleneckScoreMetric: number;
    averageDurationScore: number;
    auditCount: number;
}

export interface BpfPipelineInfo {
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

export interface BpfSdkRegisterProcessInput { processHubId: string; processKey?: string; processName?: string; }
export interface BpfSdkRegisterProcessResult { processId: string; processKey: string; status: string; }
export interface BpfSdkConfigureApprovalInput { processHubId: string; ruleKey?: string; ruleName?: string; }
export interface BpfSdkConfigureApprovalResult { ruleId: string; ruleKey: string; status: string; }
export interface BpfSdkRunProcessExecutionInput { processHubId: string; executionKey?: string; executionName?: string; }
export interface BpfSdkRunProcessExecutionResult { executionId: string; executionKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "ProcessHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    processHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbBpf${e.pascal}`).concat(["DbBpfAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["BpfDashboardStats", "BpfPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/business-process/types";

export function buildProcessHubLookupMaps(hubs: DbBpfProcessHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildBpfPipelineInfo(): BpfPipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "design", label: "Design" },
        { key: "approve", label: "Approve" },
        { key: "execute", label: "Execute" },
    ];
    return { stages, currentStage: "approve", nextStage: "execute", previousStage: "design" };
}

export function buildBpfAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbBpfAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "ProcessHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.processHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbBpf${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapTaskTemplateForStats(r: DbBpfTaskTemplate) { return { status: r.status }; }
export function mapApprovalRuleForStats(r: DbBpfApprovalRule) { return { status: r.status }; }
export function mapProcessMetricForStats(r: DbBpfProcessMetric) {
    return {
        execution_count: r.execution_count,
        average_duration_ms: r.average_duration_ms,
        success_rate: r.success_rate,
        failure_count: r.failure_count,
        bottleneck_score: r.bottleneck_score,
        sla_performance_score: r.sla_performance_score,
        overall_process_score: r.overall_process_score,
        status: r.status,
    };
}
export function mapProcessExecutionForStats(r: DbBpfProcessExecution) { return { execution_status: r.execution_status, status: r.status }; }
export function mapFailedProcessRecordForStats(r: DbBpfFailedProcessRecord) { return { status: r.status }; }
export function mapRuleValidationForStats(r: DbBpfRuleValidation) { return { validation_score: r.validation_score, status: r.status }; }
export function mapProcessHealthForStats(r: DbBpfProcessHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapProcessFailureForStats(r: DbBpfProcessFailure) { return { status: r.status }; }

export function buildBpfDashboardStats(input: {
    processHubs: ProcessHubSummary[];
    taskTemplates: ReturnType<typeof mapTaskTemplateForStats>[];
    approvalRules: ReturnType<typeof mapApprovalRuleForStats>[];
    processMetrics: ReturnType<typeof mapProcessMetricForStats>[];
    processExecutions: ReturnType<typeof mapProcessExecutionForStats>[];
    failedProcessRecords: ReturnType<typeof mapFailedProcessRecordForStats>[];
    ruleValidations: ReturnType<typeof mapRuleValidationForStats>[];
    processHealth: ReturnType<typeof mapProcessHealthForStats>[];
    processFailures: ProcessFailureSummary[];
    auditLogs: AuditEntry[];
}): BpfDashboardStats {
    const activeHubs = input.processHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.processMetrics[0];
    const latestHealth = input.processHealth[0];
    return {
        totalProcessHubs: input.processHubs.length,
        activeProcessHubs: activeHubs,
        taskTemplateCount: input.taskTemplates.length,
        approvalRuleCount: input.approvalRules.length,
        processExecutionCount: input.processExecutions.length,
        openFailedRecordCount: input.failedProcessRecords.filter((r) => r.status === "open").length,
        openFailureCount: input.processFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallProcessScore: latestMetrics?.overall_process_score ?? latestHealth?.overall_score ?? 0,
        executionCountScore: latestMetrics?.execution_count ?? 0,
        successRateScore: latestMetrics?.success_rate ?? 0,
        slaPerformanceScore: latestMetrics?.sla_performance_score ?? 0,
        bottleneckScoreMetric: latestMetrics?.bottleneck_score ?? 0,
        averageDurationScore: latestMetrics?.average_duration_ms ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/business-process/types"), { recursive: true });
writeFileSync(join(root, "src/modules/business-process/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/business-process-mappers.ts"), buildMappers(), "utf8");
console.log("Generated BPF types and mappers");
