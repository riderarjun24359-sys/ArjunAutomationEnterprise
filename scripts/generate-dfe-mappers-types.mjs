#!/usr/bin/env node
/**
 * Generates form-engine-mappers.ts and types/index.ts for Program B Sprint 3.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "FormHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "FormDefinition", key: "form_key", title: "form_name", sub: "form_type", hub: true, orgOnly: false, createFields: ["formKey", "formName", "formType"] },
    { pascal: "FormCategory", key: "category_key", title: "category_name", sub: "category_type", hub: true, orgOnly: false, createFields: ["categoryKey", "categoryName", "categoryType"] },
    { pascal: "FormVersion", key: "version_key", title: "version_number", sub: "release_channel", hub: true, orgOnly: false, createFields: ["versionKey", "versionNumber", "releaseChannel"] },
    { pascal: "FormDependency", key: "dependency_key", title: "dependency_key", sub: "dependency_type", hub: true, orgOnly: false, createFields: ["dependencyKey", "dependencyType", "dependencyRef"] },
    { pascal: "FormSection", key: "section_key", title: "section_name", sub: "section_order", hub: true, orgOnly: false, createFields: ["sectionKey", "sectionName", "sectionOrder"] },
    { pascal: "FormTab", key: "tab_key", title: "tab_name", sub: "tab_order", hub: true, orgOnly: false, createFields: ["tabKey", "tabName", "tabOrder"] },
    { pascal: "FormGroup", key: "group_key", title: "group_name", sub: "group_order", hub: true, orgOnly: false, createFields: ["groupKey", "groupName", "groupOrder"] },
    { pascal: "RepeatableSection", key: "section_key", title: "section_name", sub: "min_instances", hub: true, orgOnly: false, createFields: ["sectionKey", "sectionName", "minInstances"] },
    { pascal: "FormField", key: "field_key", title: "field_name", sub: "field_type", hub: true, orgOnly: false, createFields: ["fieldKey", "fieldName", "fieldType"] },
    { pascal: "FieldOption", key: "option_key", title: "option_label", sub: "option_value", hub: true, orgOnly: false, createFields: ["optionKey", "optionLabel", "optionValue"] },
    { pascal: "FormulaField", key: "formula_key", title: "formula_name", sub: "formula_expression", hub: true, orgOnly: false, createFields: ["formulaKey", "formulaName", "formulaExpression"] },
    { pascal: "MediaField", key: "media_key", title: "media_name", sub: "media_type", hub: true, orgOnly: false, createFields: ["mediaKey", "mediaName", "mediaType"] },
    { pascal: "RequiredRule", key: "rule_key", title: "rule_name", sub: "field_ref", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "fieldRef"] },
    { pascal: "RegexRule", key: "rule_key", title: "rule_name", sub: "pattern", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "pattern"] },
    { pascal: "RangeRule", key: "rule_key", title: "rule_name", sub: "min_value", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "minValue"] },
    { pascal: "CrossFieldRule", key: "rule_key", title: "rule_name", sub: "rule_expression", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "ruleExpression"] },
    { pascal: "FormDraft", key: "draft_key", title: "draft_name", sub: "draft_status", hub: true, orgOnly: false, createFields: ["draftKey", "draftName", "draftStatus"] },
    { pascal: "FormSubmission", key: "submission_key", title: "submission_name", sub: "submission_status", hub: true, orgOnly: false, createFields: ["submissionKey", "submissionName", "submissionStatus"] },
    { pascal: "FormReview", key: "review_key", title: "review_name", sub: "review_status", hub: true, orgOnly: false, createFields: ["reviewKey", "reviewName", "reviewStatus"] },
    { pascal: "ExecutionAuditEntry", key: "audit_key", title: "audit_key", sub: "audit_type", hub: true, orgOnly: false, createFields: ["auditKey", "auditType", "auditSummary"] },
    { pascal: "RenderProfile", key: "profile_key", title: "profile_name", sub: "profile_type", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileType"] },
    { pascal: "ThemeConfig", key: "theme_key", title: "theme_name", sub: "primary_color", hub: true, orgOnly: false, createFields: ["themeKey", "themeName", "primaryColor"] },
    { pascal: "LocalizationPack", key: "locale_key", title: "locale_name", sub: "locale_code", hub: true, orgOnly: false, createFields: ["localeKey", "localeCode", "localeName"] },
    { pascal: "SubmissionAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "CompletionMetric", key: "metric_key", title: "metric_name", sub: "completion_rate", hub: true, orgOnly: false, createFields: ["metricKey", "metricName", "completionRate"] },
    { pascal: "UsageTrend", key: "trend_key", title: "trend_name", sub: "trend_value", hub: true, orgOnly: false, createFields: ["trendKey", "trendName", "trendValue"] },
    { pascal: "FormMetric", key: "metrics_key", title: "metrics_key", sub: "overall_form_score", hub: false, orgOnly: true, createFields: ["metricsKey", "submissionCount", "overallFormScore"] },
    { pascal: "FormHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "PendingReviewItem", key: "item_key", title: "item_name", sub: "review_type", hub: true, orgOnly: false, createFields: ["itemKey", "itemName", "reviewType"] },
    { pascal: "FormFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "sectionOrder", "tabOrder", "groupOrder", "minInstances", "analyticsScore", "completionRate", "trendValue",
    "submissionCount", "overallFormScore", "overallScore", "minValue",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface DfeDashboardStats {
    totalFormHubs: number;
    activeFormHubs: number;
    formSectionCount: number;
    requiredRuleCount: number;
    formSubmissionCount: number;
    openPendingReviewCount: number;
    openFailureCount: number;
    overallFormScore: number;
    submissionCountScore: number;
    completionRateScore: number;
    validationErrorScore: number;
    abandonmentRateScore: number;
    averageCompletionTimeScore: number;
    auditCount: number;
}

export interface DfePipelineInfo {
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

export interface DfeSdkRegisterFormInput { formHubId: string; formKey?: string; formName?: string; }
export interface DfeSdkRegisterFormResult { formId: string; formKey: string; status: string; }
export interface DfeSdkConfigureValidationInput { formHubId: string; ruleKey?: string; ruleName?: string; }
export interface DfeSdkConfigureValidationResult { ruleId: string; ruleKey: string; status: string; }
export interface DfeSdkRunFormSubmissionInput { formHubId: string; submissionKey?: string; submissionName?: string; }
export interface DfeSdkRunFormSubmissionResult { submissionId: string; submissionKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "FormHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    formHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbDfe${e.pascal}`).concat(["DbDfeAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["DfeDashboardStats", "DfePipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/form-engine/types";

export function buildFormHubLookupMaps(hubs: DbDfeFormHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildDfePipelineInfo(): DfePipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "build", label: "Build" },
        { key: "validate", label: "Validate" },
        { key: "execute", label: "Execute" },
        { key: "render", label: "Render" },
    ];
    return { stages, currentStage: "validate", nextStage: "execute", previousStage: "build" };
}

export function buildDfeAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbDfeAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "FormHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.formHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbDfe${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapFormSectionForStats(r: DbDfeFormSection) { return { status: r.status }; }
export function mapRequiredRuleForStats(r: DbDfeRequiredRule) { return { status: r.status }; }
export function mapFormMetricForStats(r: DbDfeFormMetric) {
    return {
        submission_count: r.submission_count,
        completion_rate: r.completion_rate,
        average_completion_time_ms: r.average_completion_time_ms,
        validation_error_count: r.validation_error_count,
        abandonment_rate: r.abandonment_rate,
        overall_form_score: r.overall_form_score,
        status: r.status,
    };
}
export function mapFormSubmissionForStats(r: DbDfeFormSubmission) { return { submission_status: r.submission_status, status: r.status }; }
export function mapPendingReviewItemForStats(r: DbDfePendingReviewItem) { return { status: r.status }; }
export function mapRegexRuleForStats(r: DbDfeRegexRule) { return { status: r.status }; }
export function mapFormHealthForStats(r: DbDfeFormHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapFormFailureForStats(r: DbDfeFormFailure) { return { status: r.status }; }

export function buildDfeDashboardStats(input: {
    formHubs: FormHubSummary[];
    formSections: ReturnType<typeof mapFormSectionForStats>[];
    requiredRules: ReturnType<typeof mapRequiredRuleForStats>[];
    formMetrics: ReturnType<typeof mapFormMetricForStats>[];
    formSubmissions: ReturnType<typeof mapFormSubmissionForStats>[];
    pendingReviewItems: ReturnType<typeof mapPendingReviewItemForStats>[];
    regexRules: ReturnType<typeof mapRegexRuleForStats>[];
    formHealth: ReturnType<typeof mapFormHealthForStats>[];
    formFailures: FormFailureSummary[];
    auditLogs: AuditEntry[];
}): DfeDashboardStats {
    const activeHubs = input.formHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.formMetrics[0];
    const latestHealth = input.formHealth[0];
    return {
        totalFormHubs: input.formHubs.length,
        activeFormHubs: activeHubs,
        formSectionCount: input.formSections.length,
        requiredRuleCount: input.requiredRules.length,
        formSubmissionCount: input.formSubmissions.length,
        openPendingReviewCount: input.pendingReviewItems.filter((r) => r.status === "open").length,
        openFailureCount: input.formFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallFormScore: latestMetrics?.overall_form_score ?? latestHealth?.overall_score ?? 0,
        submissionCountScore: latestMetrics?.submission_count ?? 0,
        completionRateScore: latestMetrics?.completion_rate ?? 0,
        validationErrorScore: latestMetrics?.validation_error_count ?? 0,
        abandonmentRateScore: latestMetrics?.abandonment_rate ?? 0,
        averageCompletionTimeScore: latestMetrics?.average_completion_time_ms ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/form-engine/types"), { recursive: true });
writeFileSync(join(root, "src/modules/form-engine/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/form-engine-mappers.ts"), buildMappers(), "utf8");
console.log("Generated DFE types and mappers");
