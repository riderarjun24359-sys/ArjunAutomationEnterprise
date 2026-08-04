#!/usr/bin/env node
/**
 * Generates enterprise-governance-platform-mappers.ts and types/index.ts.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "GovernanceHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "OrganizationGovernance", key: "governance_key", title: "governance_name", sub: "governance_status", hub: true, orgOnly: false, createFields: ["governanceKey", "governanceName", "governanceStatus"] },
    { pascal: "GovernancePolicy", key: "policy_key", title: "policy_name", sub: "policy_status", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "policyStatus"] },
    { pascal: "GovernanceFramework", key: "framework_key", title: "framework_name", sub: "framework_status", hub: true, orgOnly: false, createFields: ["frameworkKey", "frameworkName", "frameworkStatus"] },
    { pascal: "GovernanceReview", key: "review_key", title: "review_title", sub: "review_status", hub: true, orgOnly: false, createFields: ["reviewKey", "reviewTitle", "reviewStatus"] },
    { pascal: "GovernanceDashboard", key: "dashboard_key", title: "dashboard_name", sub: "dashboard_status", hub: true, orgOnly: false, createFields: ["dashboardKey", "dashboardName", "dashboardStatus"] },
    { pascal: "ComplianceFramework", key: "framework_key", title: "framework_name", sub: "framework_status", hub: true, orgOnly: false, createFields: ["frameworkKey", "frameworkName", "frameworkStatus"] },
    { pascal: "ComplianceControl", key: "control_key", title: "control_name", sub: "control_status", hub: true, orgOnly: false, createFields: ["controlKey", "controlName", "controlStatus"] },
    { pascal: "ComplianceEvidence", key: "evidence_key", title: "evidence_title", sub: "evidence_status", hub: true, orgOnly: false, createFields: ["evidenceKey", "evidenceTitle", "evidenceStatus"] },
    { pascal: "ComplianceReport", key: "report_key", title: "report_title", sub: "report_status", hub: true, orgOnly: false, createFields: ["reportKey", "reportTitle", "reportStatus"] },
    { pascal: "ComplianceCalendar", key: "calendar_key", title: "calendar_name", sub: "calendar_status", hub: true, orgOnly: false, createFields: ["calendarKey", "calendarName", "calendarStatus"] },
    { pascal: "AuditCenter", key: "audit_key", title: "audit_name", sub: "audit_status", hub: true, orgOnly: false, createFields: ["auditKey", "auditName", "auditStatus"] },
    { pascal: "AuditFinding", key: "finding_key", title: "finding_title", sub: "finding_severity", hub: true, orgOnly: false, createFields: ["findingKey", "findingTitle", "findingSeverity"] },
    { pascal: "CorrectiveAction", key: "action_key", title: "action_title", sub: "action_status", hub: true, orgOnly: false, createFields: ["actionKey", "actionTitle", "actionStatus"] },
    { pascal: "AuditEvidence", key: "evidence_key", title: "evidence_title", sub: "evidence_status", hub: true, orgOnly: false, createFields: ["evidenceKey", "evidenceTitle", "evidenceStatus"] },
    { pascal: "AuditAnalytics", key: "analytics_key", title: "analytics_name", sub: "analytics_score", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsName", "analyticsScore"] },
    { pascal: "DataClassification", key: "classification_key", title: "classification_name", sub: "classification_level", hub: true, orgOnly: false, createFields: ["classificationKey", "classificationName", "classificationLevel"] },
    { pascal: "RetentionPolicy", key: "policy_key", title: "policy_name", sub: "policy_status", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "policyStatus"] },
    { pascal: "DataLifecycle", key: "lifecycle_key", title: "lifecycle_name", sub: "lifecycle_stage", hub: true, orgOnly: false, createFields: ["lifecycleKey", "lifecycleName", "lifecycleStage"] },
    { pascal: "DataOwnership", key: "ownership_key", title: "ownership_name", sub: "ownership_status", hub: true, orgOnly: false, createFields: ["ownershipKey", "ownershipName", "ownershipStatus"] },
    { pascal: "DataQuality", key: "quality_key", title: "quality_name", sub: "quality_score", hub: true, orgOnly: false, createFields: ["qualityKey", "qualityName", "qualityScore"] },
    { pascal: "RiskRegister", key: "risk_key", title: "risk_title", sub: "risk_severity", hub: true, orgOnly: false, createFields: ["riskKey", "riskTitle", "riskSeverity"] },
    { pascal: "RiskAssessment", key: "assessment_key", title: "assessment_title", sub: "assessment_score", hub: true, orgOnly: false, createFields: ["assessmentKey", "assessmentTitle", "assessmentScore"] },
    { pascal: "RiskMitigation", key: "mitigation_key", title: "mitigation_title", sub: "mitigation_status", hub: true, orgOnly: false, createFields: ["mitigationKey", "mitigationTitle", "mitigationStatus"] },
    { pascal: "RiskMonitoring", key: "monitoring_key", title: "monitoring_name", sub: "monitoring_status", hub: true, orgOnly: false, createFields: ["monitoringKey", "monitoringName", "monitoringStatus"] },
    { pascal: "BusinessContinuity", key: "continuity_key", title: "continuity_name", sub: "continuity_status", hub: true, orgOnly: false, createFields: ["continuityKey", "continuityName", "continuityStatus"] },
    { pascal: "GovernanceMetric", key: "metrics_key", title: "metrics_key", sub: "overall_governance_score", hub: false, orgOnly: true, createFields: ["metricsKey", "overallGovernanceScore", "complianceScore"] },
    { pascal: "GovernanceHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "ComplianceDashboard", key: "dashboard_key", title: "dashboard_name", sub: "dashboard_status", hub: true, orgOnly: false, createFields: ["dashboardKey", "dashboardName", "dashboardStatus"] },
    { pascal: "MissionProgress", key: "progress_key", title: "progress_name", sub: "progress_percent", hub: true, orgOnly: false, createFields: ["progressKey", "progressName", "progressPercent"] },
    { pascal: "GovernanceFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "assessmentScore", "qualityScore", "analyticsScore", "progressPercent",
    "governanceHealthScore", "overallGovernanceScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface EgpDashboardStats {
    totalGovernanceHubs: number;
    activeGovernanceHubs: number;
    organizationGovernanceCount: number;
    complianceControlCount: number;
    auditFindingCount: number;
    riskRegisterCount: number;
    humanApprovalCount: number;
    openGovernanceFailureCount: number;
    overallGovernanceScore: number;
    governanceHealthScore: number;
    complianceScore: number;
    enterpriseRiskScore: number;
    openGovernanceFailureCount: number;
    auditSummaryScore: number;
    dataGovernanceHealthScore: number;
    auditCount: number;
}

export interface EgpPipelineInfo {
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

export interface EgpSdkRunAgoServiceInput { governanceHubId: string; orchestratorKey?: string; orchestratorName?: string; }
export interface EgpSdkRunAgoServiceResult { orchestratorId: string; orchestratorKey: string; status: string; }
export interface EgpSdkRunAdoServiceInput { governanceHubId: string; orchestratorKey?: string; orchestratorName?: string; }
export interface EgpSdkRunAdoServiceResult { orchestratorId: string; orchestratorKey: string; status: string; }
export interface EgpSdkRunAioServiceInput { governanceHubId: string; ideaKey?: string; ideaTitle?: string; }
export interface EgpSdkRunAioServiceResult { ideaId: string; ideaKey: string; status: string; }
export interface EgpSdkRunOrchestrationServiceInput { governanceHubId: string; routerKey?: string; routerName?: string; }
export interface EgpSdkRunOrchestrationServiceResult { routerId: string; routerKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "GovernanceHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    governanceHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbEgp${e.pascal}`).concat(["DbEgpAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["EgpDashboardStats", "EgpPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/enterprise-governance-platform/types";

export function buildGovernanceHubLookupMaps(hubs: DbEgpGovernanceHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildEgpPipelineInfo(): EgpPipelineInfo {
    const stages = [
        { key: "governance", label: "Governance" },
        { key: "compliance", label: "Compliance" },
        { key: "audit", label: "Audit" },
        { key: "data_governance", label: "Data Governance" },
        { key: "dashboard", label: "Risk Management" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "compliance", nextStage: "audit", previousStage: "governance" };
}

export function buildEgpAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbEgpAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "GovernanceHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.governanceHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        const mapsParam = isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }";
        m += `export function map${e.pascal}Summary(record: DbEgp${e.pascal}${mapsParam}): ${e.pascal}Summary {
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

    m += `export function mapOrganizationGovernanceForStats(r: DbEgpOrganizationGovernance) { return { orchestrator_status: r.orchestrator_status, status: r.status }; }
export function mapComplianceControlForStats(r: DbEgpComplianceControl) { return { orchestrator_status: r.orchestrator_status, status: r.status }; }
export function mapAuditFindingForStats(r: DbEgpAuditFinding) { return { idea_status: r.idea_status, status: r.status }; }
export function mapRiskRegisterForStats(r: DbEgpRiskRegister) { return { router_status: r.router_status, status: r.status }; }
export function mapDataClassificationForStats(r: DbEgpDataClassification) { return { approval_status: r.approval_status, status: r.status }; }
export function mapGovernanceMetricForStats(r: DbEgpGovernanceMetric) {
    return {
        governance_health_score: r.governance_health_score,
        compliance_score: r.compliance_score,
        enterprise_risk_score: r.enterprise_risk_score,
        open_governance_failure_count: r.open_governance_failure_count,
        audit_summary_score: r.audit_summary_score,
        data_governance_health_score: r.data_governance_health_score,
        overall_governance_score: r.overall_governance_score,
        status: r.status,
    };
}
export function mapGovernanceHealthForStats(r: DbEgpGovernanceHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapGovernanceFailureForStats(r: DbEgpGovernanceFailure) { return { status: r.status }; }

export function buildEgpDashboardStats(input: {
    governanceHubs: GovernanceHubSummary[];
    organizationGovernances: ReturnType<typeof mapOrganizationGovernanceForStats>[];
    complianceControls: ReturnType<typeof mapComplianceControlForStats>[];
    auditFinding: ReturnType<typeof mapAuditFindingForStats>[];
    riskRegisters: ReturnType<typeof mapRiskRegisterForStats>[];
    dataClassification: ReturnType<typeof mapDataClassificationForStats>[];
    organizationMetrics: ReturnType<typeof mapGovernanceMetricForStats>[];
    organizationHealth: ReturnType<typeof mapGovernanceHealthForStats>[];
    organizationFailures: GovernanceFailureSummary[];
    auditLogs: AuditEntry[];
}): EgpDashboardStats {
    const activeHubs = input.governanceHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.organizationMetrics[0];
    const latestHealth = input.organizationHealth[0];
    const pendingApprovals = input.dataClassification.filter((a) => a.approval_status === "pending").length;
    return {
        totalGovernanceHubs: input.governanceHubs.length,
        activeGovernanceHubs: activeHubs,
        organizationGovernanceCount: input.organizationGovernances.length,
        complianceControlCount: input.complianceControls.length,
        auditFindingCount: input.auditFinding.length,
        riskRegisterCount: input.riskRegisters.length,
        humanApprovalCount: pendingApprovals,
        openGovernanceFailureCount: input.organizationFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallGovernanceScore: latestMetrics?.overall_governance_score ?? latestHealth?.overall_score ?? 0,
        governanceHealthScore: latestMetrics?.governance_health_score ?? 0,
        complianceScore: latestMetrics?.compliance_score ?? 0,
        enterpriseRiskScore: latestMetrics?.enterprise_risk_score ?? 0,
        openGovernanceFailureCount: latestMetrics?.open_governance_failure_count ?? pendingApprovals,
        auditSummaryScore: latestMetrics?.audit_summary_score ?? 0,
        dataGovernanceHealthScore: latestMetrics?.data_governance_health_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/enterprise-governance-platform/types"), { recursive: true });
writeFileSync(join(root, "src/modules/enterprise-governance-platform/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/enterprise-governance-platform-mappers.ts"), buildMappers(), "utf8");
console.log("Generated EGP types and mappers");
