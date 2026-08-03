#!/usr/bin/env node
/**
 * Generates document-engine-mappers.ts and types/index.ts for Program B Sprint 5.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "DocumentHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "DocumentType", key: "type_key", title: "type_name", sub: "type_category", hub: true, orgOnly: false, createFields: ["typeKey", "typeName", "typeCategory"] },
    { pascal: "DocumentCategory", key: "category_key", title: "category_name", sub: "category_type", hub: true, orgOnly: false, createFields: ["categoryKey", "categoryName", "categoryType"] },
    { pascal: "DocumentTemplate", key: "template_key", title: "template_name", sub: "template_type", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateType"] },
    { pascal: "DocumentVersion", key: "version_key", title: "version_number", sub: "release_channel", hub: true, orgOnly: false, createFields: ["versionKey", "versionNumber", "releaseChannel"] },
    { pascal: "TemplateHeader", key: "header_key", title: "header_name", sub: "header_key", hub: true, orgOnly: false, createFields: ["headerKey", "headerName", "headerContent"] },
    { pascal: "TemplateFooter", key: "footer_key", title: "footer_name", sub: "footer_key", hub: true, orgOnly: false, createFields: ["footerKey", "footerName", "footerContent"] },
    { pascal: "TemplateSection", key: "section_key", title: "section_name", sub: "section_type", hub: true, orgOnly: false, createFields: ["sectionKey", "sectionName", "sectionType"] },
    { pascal: "TemplateVariable", key: "variable_key", title: "variable_name", sub: "variable_type", hub: true, orgOnly: false, createFields: ["variableKey", "variableName", "variableType"] },
    { pascal: "PdfGeneration", key: "generation_key", title: "generation_name", sub: "generation_status", hub: true, orgOnly: false, createFields: ["generationKey", "generationName", "generationStatus"] },
    { pascal: "HtmlGeneration", key: "generation_key", title: "generation_name", sub: "generation_status", hub: true, orgOnly: false, createFields: ["generationKey", "generationName", "generationStatus"] },
    { pascal: "ExportJob", key: "job_key", title: "job_name", sub: "job_status", hub: true, orgOnly: false, createFields: ["jobKey", "jobName", "jobStatus"] },
    { pascal: "BatchGeneration", key: "batch_key", title: "batch_name", sub: "batch_status", hub: true, orgOnly: false, createFields: ["batchKey", "batchName", "batchStatus"] },
    { pascal: "ElectronicSignature", key: "signature_key", title: "signature_name", sub: "signature_status", hub: true, orgOnly: false, createFields: ["signatureKey", "signatureName", "signatureStatus"] },
    { pascal: "ApprovalSignature", key: "signature_key", title: "signature_name", sub: "signature_status", hub: true, orgOnly: false, createFields: ["signatureKey", "signatureName", "signatureStatus"] },
    { pascal: "SignatureVerification", key: "verification_key", title: "verification_key", sub: "verification_status", hub: true, orgOnly: false, createFields: ["verificationKey", "verificationStatus", "verificationResult"] },
    { pascal: "SignatureAuditEntry", key: "audit_key", title: "audit_key", sub: "audit_action", hub: true, orgOnly: false, createFields: ["auditKey", "auditAction", "auditSummary"] },
    { pascal: "VersionHistory", key: "history_key", title: "history_key", sub: "history_version", hub: true, orgOnly: false, createFields: ["historyKey", "historyVersion", "historySummary"] },
    { pascal: "RetentionPolicy", key: "policy_key", title: "policy_name", sub: "retention_days", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "retentionDays"] },
    { pascal: "ArchiveRecord", key: "archive_key", title: "archive_name", sub: "archive_status", hub: true, orgOnly: false, createFields: ["archiveKey", "archiveName", "archiveStatus"] },
    { pascal: "SharingPolicy", key: "policy_key", title: "policy_name", sub: "sharing_scope", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "sharingScope"] },
    { pascal: "EmailDelivery", key: "delivery_key", title: "delivery_name", sub: "delivery_status", hub: true, orgOnly: false, createFields: ["deliveryKey", "deliveryName", "deliveryStatus"] },
    { pascal: "DownloadDelivery", key: "delivery_key", title: "delivery_name", sub: "delivery_status", hub: true, orgOnly: false, createFields: ["deliveryKey", "deliveryName", "deliveryStatus"] },
    { pascal: "WebhookDelivery", key: "delivery_key", title: "delivery_name", sub: "delivery_status", hub: true, orgOnly: false, createFields: ["deliveryKey", "deliveryName", "deliveryStatus"] },
    { pascal: "GenerationAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "DeliveryAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "StorageAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "DocumentMetric", key: "metrics_key", title: "metrics_key", sub: "overall_document_score", hub: false, orgOnly: true, createFields: ["metricsKey", "generatedCount", "overallDocumentScore"] },
    { pascal: "DocumentHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "PendingSignature", key: "signature_key", title: "signature_name", sub: "signature_status", hub: true, orgOnly: false, createFields: ["signatureKey", "signatureName", "signatureStatus"] },
    { pascal: "DocumentFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "retentionDays", "analyticsScore", "generatedCount", "overallDocumentScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface DdeDashboardStats {
    totalDocumentHubs: number;
    activeDocumentHubs: number;
    templateSectionCount: number;
    retentionPolicyCount: number;
    pdfGenerationCount: number;
    openPendingSignatureCount: number;
    openFailureCount: number;
    overallDocumentScore: number;
    generatedCountScore: number;
    deliverySuccessRateScore: number;
    failureCountScore: number;
    downloadCountScore: number;
    storageUsageScore: number;
    auditCount: number;
}

export interface DdePipelineInfo {
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

export interface DdeSdkRegisterDocumentInput { documentHubId: string; typeKey?: string; typeName?: string; }
export interface DdeSdkRegisterDocumentResult { typeId: string; typeKey: string; status: string; }
export interface DdeSdkConfigureTemplateInput { documentHubId: string; sectionKey?: string; sectionName?: string; }
export interface DdeSdkConfigureTemplateResult { sectionId: string; sectionKey: string; status: string; }
export interface DdeSdkRunDocumentGenerationInput { documentHubId: string; generationKey?: string; generationName?: string; }
export interface DdeSdkRunDocumentGenerationResult { generationId: string; generationKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "DocumentHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    documentHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbDde${e.pascal}`).concat(["DbDdeAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["DdeDashboardStats", "DdePipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/document-engine/types";

export function buildDocumentHubLookupMaps(hubs: DbDdeDocumentHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildDdePipelineInfo(): DdePipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "template", label: "Template" },
        { key: "generate", label: "Generate" },
        { key: "sign", label: "Sign" },
        { key: "deliver", label: "Deliver" },
    ];
    return { stages, currentStage: "generate", nextStage: "sign", previousStage: "template" };
}

export function buildDdeAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbDdeAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "DocumentHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.documentHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbDde${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapTemplateSectionForStats(r: DbDdeTemplateSection) { return { status: r.status }; }
export function mapRetentionPolicyForStats(r: DbDdeRetentionPolicy) { return { status: r.status }; }
export function mapDocumentMetricForStats(r: DbDdeDocumentMetric) {
    return {
        generated_count: r.generated_count,
        download_count: r.download_count,
        delivery_success_rate: r.delivery_success_rate,
        failure_count: r.failure_count,
        signature_pending_count: r.signature_pending_count,
        storage_usage_mb: r.storage_usage_mb,
        overall_document_score: r.overall_document_score,
        status: r.status,
    };
}
export function mapPdfGenerationForStats(r: DbDdePdfGeneration) { return { generation_status: r.generation_status, status: r.status }; }
export function mapPendingSignatureForStats(r: DbDdePendingSignature) { return { status: r.status }; }
export function mapElectronicSignatureForStats(r: DbDdeElectronicSignature) { return { status: r.status }; }
export function mapDocumentHealthForStats(r: DbDdeDocumentHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapDocumentFailureForStats(r: DbDdeDocumentFailure) { return { status: r.status }; }

export function buildDdeDashboardStats(input: {
    documentHubs: DocumentHubSummary[];
    templateSections: ReturnType<typeof mapTemplateSectionForStats>[];
    retentionPolicies: ReturnType<typeof mapRetentionPolicyForStats>[];
    documentMetrics: ReturnType<typeof mapDocumentMetricForStats>[];
    pdfGenerations: ReturnType<typeof mapPdfGenerationForStats>[];
    pendingSignatures: ReturnType<typeof mapPendingSignatureForStats>[];
    electronicSignatures: ReturnType<typeof mapElectronicSignatureForStats>[];
    documentHealth: ReturnType<typeof mapDocumentHealthForStats>[];
    documentFailures: DocumentFailureSummary[];
    auditLogs: AuditEntry[];
}): DdeDashboardStats {
    const activeHubs = input.documentHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.documentMetrics[0];
    const latestHealth = input.documentHealth[0];
    return {
        totalDocumentHubs: input.documentHubs.length,
        activeDocumentHubs: activeHubs,
        templateSectionCount: input.templateSections.length,
        retentionPolicyCount: input.retentionPolicies.length,
        pdfGenerationCount: input.pdfGenerations.length,
        openPendingSignatureCount: input.pendingSignatures.filter((r) => r.status === "open" || r.status === "pending").length,
        openFailureCount: input.documentFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallDocumentScore: latestMetrics?.overall_document_score ?? latestHealth?.overall_score ?? 0,
        generatedCountScore: latestMetrics?.generated_count ?? 0,
        deliverySuccessRateScore: latestMetrics?.delivery_success_rate ?? 0,
        failureCountScore: latestMetrics?.failure_count ?? 0,
        downloadCountScore: latestMetrics?.download_count ?? 0,
        storageUsageScore: latestMetrics?.storage_usage_mb ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/document-engine/types"), { recursive: true });
writeFileSync(join(root, "src/modules/document-engine/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/document-engine-mappers.ts"), buildMappers(), "utf8");
console.log("Generated DDE types and mappers");
