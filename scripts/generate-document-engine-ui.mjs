#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/document-engine");

const entities = [
    { tab: "documentHubs", plural: "documentHubs", singular: "DocumentHub", pascal: "DocumentHub", db: "ddeDocumentHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "documentTypes", plural: "documentTypes", singular: "DocumentType", pascal: "DocumentType", db: "ddeDocumentTypes", fields: [{ name: "typeKey", type: "string" }, { name: "typeName", type: "string" }, { name: "typeCategory", type: "string" }], display: { title: "typeName", sub: "typeCategory" } },
    { tab: "documentCategories", plural: "documentCategories", singular: "DocumentCategory", pascal: "DocumentCategory", db: "ddeDocumentCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" } },
    { tab: "documentTemplates", plural: "documentTemplates", singular: "DocumentTemplate", pascal: "DocumentTemplate", db: "ddeDocumentTemplates", fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateType", type: "string" }], display: { title: "templateName", sub: "templateType" } },
    { tab: "documentVersions", plural: "documentVersions", singular: "DocumentVersion", pascal: "DocumentVersion", db: "ddeDocumentVersions", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "templateHeaders", plural: "templateHeaders", singular: "TemplateHeader", pascal: "TemplateHeader", db: "ddeTemplateHeaders", fields: [{ name: "headerKey", type: "string" }, { name: "headerName", type: "string" }, { name: "headerContent", type: "string" }], display: { title: "headerName", sub: "headerKey" } },
    { tab: "templateFooters", plural: "templateFooters", singular: "TemplateFooter", pascal: "TemplateFooter", db: "ddeTemplateFooters", fields: [{ name: "footerKey", type: "string" }, { name: "footerName", type: "string" }, { name: "footerContent", type: "string" }], display: { title: "footerName", sub: "footerKey" } },
    { tab: "templateSections", plural: "templateSections", singular: "TemplateSection", pascal: "TemplateSection", db: "ddeTemplateSections", fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "sectionType", type: "string" }], display: { title: "sectionName", sub: "sectionType" } },
    { tab: "templateVariables", plural: "templateVariables", singular: "TemplateVariable", pascal: "TemplateVariable", db: "ddeTemplateVariables", fields: [{ name: "variableKey", type: "string" }, { name: "variableName", type: "string" }, { name: "variableType", type: "string" }], display: { title: "variableName", sub: "variableType" } },
    { tab: "pdfGenerations", plural: "pdfGenerations", singular: "PdfGeneration", pascal: "PdfGeneration", db: "ddePdfGenerations", fields: [{ name: "generationKey", type: "string" }, { name: "generationName", type: "string" }, { name: "generationStatus", type: "string" }], display: { title: "generationName", sub: "generationStatus" } },
    { tab: "htmlGenerations", plural: "htmlGenerations", singular: "HtmlGeneration", pascal: "HtmlGeneration", db: "ddeHtmlGenerations", fields: [{ name: "generationKey", type: "string" }, { name: "generationName", type: "string" }, { name: "generationStatus", type: "string" }], display: { title: "generationName", sub: "generationStatus" } },
    { tab: "exportJobs", plural: "exportJobs", singular: "ExportJob", pascal: "ExportJob", db: "ddeExportJobs", fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "string" }], display: { title: "jobName", sub: "jobStatus" } },
    { tab: "batchGenerations", plural: "batchGenerations", singular: "BatchGeneration", pascal: "BatchGeneration", db: "ddeBatchGenerations", fields: [{ name: "batchKey", type: "string" }, { name: "batchName", type: "string" }, { name: "batchStatus", type: "string" }], display: { title: "batchName", sub: "batchStatus" } },
    { tab: "electronicSignatures", plural: "electronicSignatures", singular: "ElectronicSignature", pascal: "ElectronicSignature", db: "ddeElectronicSignatures", fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" } },
    { tab: "approvalSignatures", plural: "approvalSignatures", singular: "ApprovalSignature", pascal: "ApprovalSignature", db: "ddeApprovalSignatures", fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" } },
    { tab: "signatureVerifications", plural: "signatureVerifications", singular: "SignatureVerification", pascal: "SignatureVerification", db: "ddeSignatureVerifications", fields: [{ name: "verificationKey", type: "string" }, { name: "verificationStatus", type: "string" }, { name: "verificationResult", type: "string" }], display: { title: "verificationKey", sub: "verificationStatus" } },
    { tab: "signatureAuditEntries", plural: "signatureAuditEntries", singular: "SignatureAuditEntry", pascal: "SignatureAuditEntry", db: "ddeSignatureAuditEntries", fields: [{ name: "auditKey", type: "string" }, { name: "auditAction", type: "string" }, { name: "auditSummary", type: "string" }], display: { title: "auditKey", sub: "auditAction" } },
    { tab: "versionHistories", plural: "versionHistories", singular: "VersionHistory", pascal: "VersionHistory", db: "ddeVersionHistories", fields: [{ name: "historyKey", type: "string" }, { name: "historyVersion", type: "string" }, { name: "historySummary", type: "string" }], display: { title: "historyKey", sub: "historyVersion" } },
    { tab: "retentionPolicies", plural: "retentionPolicies", singular: "RetentionPolicy", pascal: "RetentionPolicy", db: "ddeRetentionPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "retentionDays", type: "number" }], display: { title: "policyName", sub: "retentionDays" } },
    { tab: "archiveRecords", plural: "archiveRecords", singular: "ArchiveRecord", pascal: "ArchiveRecord", db: "ddeArchiveRecords", fields: [{ name: "archiveKey", type: "string" }, { name: "archiveName", type: "string" }, { name: "archiveStatus", type: "string" }], display: { title: "archiveName", sub: "archiveStatus" } },
    { tab: "sharingPolicies", plural: "sharingPolicies", singular: "SharingPolicy", pascal: "SharingPolicy", db: "ddeSharingPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "sharingScope", type: "string" }], display: { title: "policyName", sub: "sharingScope" } },
    { tab: "emailDeliveries", plural: "emailDeliveries", singular: "EmailDelivery", pascal: "EmailDelivery", db: "ddeEmailDeliveries", fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" } },
    { tab: "downloadDeliveries", plural: "downloadDeliveries", singular: "DownloadDelivery", pascal: "DownloadDelivery", db: "ddeDownloadDeliveries", fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" } },
    { tab: "webhookDeliveries", plural: "webhookDeliveries", singular: "WebhookDelivery", pascal: "WebhookDelivery", db: "ddeWebhookDeliveries", fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" } },
    { tab: "generationAnalytics", plural: "generationAnalytics", singular: "GenerationAnalytics", pascal: "GenerationAnalytics", db: "ddeGenerationAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "deliveryAnalytics", plural: "deliveryAnalytics", singular: "DeliveryAnalytics", pascal: "DeliveryAnalytics", db: "ddeDeliveryAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "storageAnalytics", plural: "storageAnalytics", singular: "StorageAnalytics", pascal: "StorageAnalytics", db: "ddeStorageAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "documentMetrics", plural: "documentMetrics", singular: "DocumentMetric", pascal: "DocumentMetric", db: "ddeDocumentMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "generatedCount", type: "number" }, { name: "overallDocumentScore", type: "number" }], display: { title: "metricsKey", sub: "overallDocumentScore" } },
    { tab: "documentHealth", plural: "documentHealth", singular: "DocumentHealth", pascal: "DocumentHealth", db: "ddeDocumentHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "pendingSignatures", plural: "pendingSignatures", singular: "PendingSignature", pascal: "PendingSignature", db: "ddePendingSignatures", fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" } },
    { tab: "documentFailures", plural: "documentFailures", singular: "DocumentFailure", pascal: "DocumentFailure", db: "ddeDocumentFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const DDE_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const DDE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "Submitted" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
] as const;

export const DDE_PERMISSIONS = ["dde.view", "dde.manage", "dde.approve", "dde.admin"] as const;


export const DDE_THEME = {
    primary: "fuchsia-600",
    primaryHover: "fuchsia-500",
    ring: "fuchsia-500/20",
    text: "text-fuchsia-600",
    textDark: "dark:text-fuchsia-400",
    bg: "bg-fuchsia-600",
    bgHover: "hover:bg-fuchsia-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    documentHubId: z.string().min(1),`;
    const fieldLines = e.fields.map((f) => {
        if (f.type === "number") return `    ${f.name}: z.number().optional(),`;
        if (f.type === "boolean") return `    ${f.name}: z.boolean().optional(),`;
        return `    ${f.name}: z.string().min(1).optional(),`;
    }).join("\n");
    const schemaName = e.tab.replace(/([A-Z])/g, (m) => m.toLowerCase());
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `export const ${camel}FormSchema = z.object({${hubId}
${fieldLines}
});

export type ${camel}FormValues = z.infer<typeof ${camel}FormSchema>;`;
});
writeFileSync(join(mod, "schemas/index.ts"), `import { z } from "zod";\n\n${schemaLines.join("\n\n")}\n`);

// --- service ---
const mapperImports = [
    "buildDocumentHubLookupMaps", "buildDdeAuditPayload", "buildDdeDashboardStats", "buildDdePipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapTemplateSectionForStats", "mapRetentionPolicyForStats", "mapDocumentMetricForStats", "mapPdfGenerationForStats", "mapPendingSignatureForStats", "mapElectronicSignatureForStats", "mapDocumentHealthForStats", "mapDocumentFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "DdeDashboardStats", "DdePipelineInfo", "DdeSdkRegisterFormInput", "DdeSdkRegisterFormResult", "DdeSdkConfigureValidationInput", "DdeSdkConfigureValidationResult", "DdeSdkRunFormSubmissionInput", "DdeSdkRunFormSubmissionResult"]).join(",\n    ");

const serviceMethods = entities.map((e) => {
    const maps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const mapCall = e.orgOnly ? `map${e.pascal}Summary` : `(r) => map${e.pascal}Summary(r, maps)`;
    const createMaps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const createReturn = e.orgOnly ? `return map${e.pascal}Summary(created);` : `return map${e.pascal}Summary(created, maps);`;
    return `
    async get${e.pascal}s(authUserId: string, email: string, fullName?: string | null): Promise<${e.pascal}Summary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];${maps}
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${mapCall});
    }

    async create${e.pascal}(authUserId: string, email: string, input: Create${e.pascal}Input, fullName?: string | null): Promise<${e.pascal}Summary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(build${e.pascal}Payload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.plural}");
        await databaseService.ddeAuditLogs.create(buildDdeAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/document-engine.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/document-engine-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/document-engine/types";

export class DocumentEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const documentHubs = await databaseService.ddeDocumentHubs.listByOrganization(organizationId);
        return buildDocumentHubLookupMaps(documentHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DdeDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildDdeDashboardStats({ documentHubs: [], templateSections: [], retentionPolicies: [], documentMetrics: [], pdfGenerations: [], pendingSignatures: [], electronicSignatures: [], documentHealth: [], documentFailures: [], auditLogs: [] });
        const [documentHubs, templateSectionsRaw, retentionPoliciesRaw, documentMetricsRaw, pdfGenerationsRaw, pendingSignaturesRaw, electronicSignaturesRaw, documentHealthRaw, documentFailures, auditLogs] = await Promise.all([
            this.getDocumentHubs(authUserId, email, fullName),
            databaseService.ddeTemplateSections.listByOrganization(context.organizationId),
            databaseService.ddeRetentionPolicies.listByOrganization(context.organizationId),
            databaseService.ddeDocumentMetrics.listByOrganization(context.organizationId),
            databaseService.ddePdfGenerations.listByOrganization(context.organizationId),
            databaseService.ddePendingSignatures.listByOrganization(context.organizationId),
            databaseService.ddeElectronicSignatures.listByOrganization(context.organizationId),
            databaseService.ddeDocumentHealth.listByOrganization(context.organizationId),
            this.getDocumentFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildDdeDashboardStats({
            documentHubs,
            templateSections: templateSectionsRaw.map(mapTemplateSectionForStats),
            retentionPolicies: retentionPoliciesRaw.map(mapRetentionPolicyForStats),
            documentMetrics: documentMetricsRaw.map(mapDocumentMetricForStats),
            pdfGenerations: pdfGenerationsRaw.map(mapPdfGenerationForStats),
            pendingSignatures: pendingSignaturesRaw.map(mapPendingSignatureForStats),
            electronicSignatures: electronicSignaturesRaw.map(mapElectronicSignatureForStats),
            documentHealth: documentHealthRaw.map(mapDocumentHealthForStats),
            documentFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): DdePipelineInfo {
        return buildDdePipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddeAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getDocumentHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddeDocumentHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterDocument(authUserId: string, email: string, input: DdeSdkRegisterFormInput, fullName?: string | null): Promise<DdeSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_document", moduleSource: "dynamic_document_engine", inputPayload: { ...input } });
        const created = await this.createDocumentType(authUserId, email, { documentHubId: input.documentHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigureTemplate(authUserId: string, email: string, input: DdeSdkConfigureValidationInput, fullName?: string | null): Promise<DdeSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { documentHubId: input.documentHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunDocumentGeneration(authUserId: string, email: string, input: DdeSdkRunFormSubmissionInput, fullName?: string | null): Promise<DdeSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_document_generation", moduleSource: "dynamic_document_engine", inputPayload: { ...input } });
        const created = await this.createPdfGeneration(authUserId, email, { documentHubId: input.documentHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const documentEngineService = new DocumentEngineService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "DdeDashboardStats", "DdePipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            documentEngineService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await documentEngineService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useDocumentEngine.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { documentEngineService } from "@/src/modules/document-engine/services/document-engine.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/document-engine/types";

export function useDocumentEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DdeDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<DdePipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [documentHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            documentEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(documentEngineService.getPipelineInfo()),
${hookFetchCalls}
            documentEngineService.getAuditLogs(authUserId, email, fullName),
            documentEngineService.getDocumentHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${hookReturnProps},
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${hookApplySets}
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

${hookCreates}

    return {
        loading,
        stats,
        pipeline,
${hookReturnFields}
        auditLogs,
        documentHubOptions,
        refresh,
    };
}
`);

// --- panels ---
const label = (tab) => tab.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const panelImports = entities.map((e) => `${e.pascal}sPanel`).join(",\n    ");
const schemaImports = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `    ${camel}FormSchema,\n    type ${camel}FormValues,`;
}).join("\n");

const panelFns = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    const panelName = `${e.pascal}sPanel`;
    const defaults = e.fields.reduce((acc, f) => {
        acc[f.name] = f.type === "number" ? 0 : f.type === "boolean" ? false : "";
        return acc;
    }, e.hubField === false ? {} : { documentHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <DocumentHubSelect data={data} {...form.register("documentHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: DocumentEngineData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise document engine ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.plural}.length === 0 ? <EmptyState title="No ${label(e.tab).toLowerCase()}" description="Create the first ${label(e.tab).toLowerCase()} record." /> : data.${e.plural}.map((item) => (
                    <ListCard key={item.id} title={String(item.${titleField})} subtitle={\`\${item.hubName ? item.hubName + " • " : ""}\${item.${subField}}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ${label(e.tab).toLowerCase()}" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.create${e.pascal}(v))}>
${hubSelect}${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
}).join("\n\n");

writeFileSync(join(mod, "components/DocumentEnginePanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { DDE_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/document-engine/constants";
import type { useDocumentEngine } from "@/src/modules/document-engine/hooks/useDocumentEngine";
import {
${schemaImports}
} from "@/src/modules/document-engine/schemas";

type DocumentEngineData = ReturnType<typeof useDocumentEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-fuchsia-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-fuchsia-600">{meta}</p> : null}</div>;
}
function DocumentHubSelect({ data, ...props }: { data: DocumentEngineData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select document engine</option>{data.documentHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function DocumentEngineOverviewPanel({ data }: { data: DocumentEngineData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Document Engine summary" description="System health, background jobs, event bus, pendingSignatures, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Document Hubs" subtitle={\`\${data.stats?.totalDocumentHubs ?? 0} total\`} meta={\`\${data.stats?.activeDocumentHubs ?? 0} active • \${data.stats?.templateSectionCount ?? 0} template sections\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.retentionPolicyCount ?? 0} retention policies\`} meta={\`\${data.stats?.pdfGenerationCount ?? 0} pdf generations • \${data.stats?.openPendingSignatureCount ?? 0} open pending signatures\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallDocumentScore ?? 0).toFixed(1)} overall document score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first document engine" />
            </div></Card>
            <Card hover><SectionHeader title="Document engine pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Document engine pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function DocumentEngineAuditLogsPanel({ data }: { data: DocumentEngineData }) {
    return (
        <Card hover><SectionHeader title="Document Engine audit history" description="Security-first audit trail for jobs, events, pendingSignatures, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for document engine." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function DocumentEngineSdkPanel({ data }: { data: DocumentEngineData }) {
    return (
        <Card hover><SectionHeader title="Shared Document Engine SDK" description="Import from @/src/modules/document-engine/sdk for document registration, template configuration, and document generation" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createDocumentEngineClient()" subtitle="Factory for module-scoped Document Engine client with auth context" meta="Primary SDK for enterprise document engine" />
            <ListCard title="sdkRegisterDocument()" subtitle="Register document engine with AI orchestration" meta="moduleSource: dynamic_document_engine" />
            <ListCard title="sdkConfigureTemplate()" subtitle="Configure template section with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunDocumentGeneration()" subtitle="Run document generation with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {DDE_THEME.primary} • Integration hubs loaded: {data.documentHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";

const intg = createDocumentEngineClient(userId, email, fullName);
await intg.registerDocument({ documentHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureTemplate({ documentHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runDocumentGeneration({ documentHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/DocumentEngineStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { DdeDashboardStats } from "@/src/modules/document-engine/types";

interface DocumentEngineStatsProps { stats: DdeDashboardStats | null; }

export function DocumentEngineStats({ stats }: DocumentEngineStatsProps) {
    const cards = [
        { title: "Document Hubs", value: String(stats?.totalDocumentHubs ?? 0), detail: \`\${stats?.activeDocumentHubs ?? 0} active • \${stats?.templateSectionCount ?? 0} template sections\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.retentionPolicyCount ?? 0), detail: \`\${stats?.pdfGenerationCount ?? 0} pdf generations • \${stats?.openPendingSignatureCount ?? 0} open pending signatures\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallDocumentScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, pendingSignatures, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-fuchsia-600 dark:[&_p:last-child]:text-fuchsia-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "DocumentEngineOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "DocumentEngineAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "DocumentEngineSdkPanel" },
];

writeFileSync(join(mod, "components/DocumentEnginePage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    DocumentEngineOverviewPanel,
    ${panelImports},
    DocumentEngineAuditLogsPanel,
    DocumentEngineSdkPanel,
} from "@/src/modules/document-engine/components/DocumentEnginePanels";
import { DocumentEngineStats } from "@/src/modules/document-engine/components/DocumentEngineStats";
import { DDE_TABS } from "@/src/modules/document-engine/constants";
import { useDocumentEngine } from "@/src/modules/document-engine/hooks/useDocumentEngine";

const tabs = [
${tabDefs.map((t) => `    { id: DDE_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function DocumentEnginePage() {
    const documentEngine = useDocumentEngine();
    const [activeTab, setActiveTab] = useState<(typeof DDE_TABS)[keyof typeof DDE_TABS]>(DDE_TABS.overview);

    if (documentEngine.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Document Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-fuchsia-600">V2 Program A Program B Sprint 5</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Document Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: template sections, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and document engine dashboard with security-first audit and the shared Document Engine SDK.
                </p>
            </motion.header>
            <DocumentEngineStats stats={documentEngine.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-fuchsia-600 text-white" : "border border-slate-200 text-slate-600 hover:border-fuchsia-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === DDE_TABS.${t.id} ? <${t.panel} data={documentEngine} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { documentEngineService } from "@/src/modules/document-engine/services/document-engine.service";
import type { DdeSdkRegisterFormInput, DdeSdkConfigureValidationInput, DdeSdkRunFormSubmissionInput } from "@/src/modules/document-engine/types";

export class DocumentEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerDocument(input: DdeSdkConnectServiceInput) {
        return documentEngineService.sdkRegisterDocument(this.authUserId, this.email, input, this.fullName);
    }

    async configureTemplate(input: DdeSdkIssueApiKeyInput) {
        return documentEngineService.sdkConfigureTemplate(this.authUserId, this.email, input, this.fullName);
    }

    async runDocumentGeneration(input: DdeSdkRegisterWebhookInput) {
        return documentEngineService.sdkRunDocumentGeneration(this.authUserId, this.email, input, this.fullName);
    }

    async getDocumentHubs() {
        return documentEngineService.getDocumentHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return documentEngineService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return documentEngineService.getPipelineInfo();
    }
}

export function createDocumentEngineClient(authUserId: string, email: string, fullName?: string | null): DocumentEngineClient {
    return new DocumentEngineClient(authUserId, email, fullName);
}

export { documentEngineService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { DocumentEnginePage } from "@/src/modules/document-engine/components/DocumentEnginePage";
export { DocumentEngineStats } from "@/src/modules/document-engine/components/DocumentEngineStats";
export { documentEngineService } from "@/src/modules/document-engine/services/document-engine.service";
export { useDocumentEngine } from "@/src/modules/document-engine/hooks/useDocumentEngine";
export { createDocumentEngineClient, DocumentEngineClient } from "@/src/modules/document-engine/sdk";
export * from "@/src/modules/document-engine/types";
export * from "@/src/modules/document-engine/constants";
`);

console.log(`Generated document engine module files. DDE_TABS count: ${tabs.length}`);
