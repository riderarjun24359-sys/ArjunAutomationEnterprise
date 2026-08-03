#!/usr/bin/env node
/**
 * Generates industry-framework-mappers.ts and types/index.ts for Program B Sprint 1.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "FrameworkHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "IndustryRegistration", key: "registration_key", title: "industry_name", sub: "industry_code", hub: true, orgOnly: false, createFields: ["registrationKey", "industryCode", "industryName"] },
    { pascal: "IndustryMetadata", key: "metadata_key", title: "metadata_key", sub: "metadata_type", hub: true, orgOnly: false, createFields: ["metadataKey", "metadataType", "metadataValue"] },
    { pascal: "IndustryVersion", key: "version_key", title: "version_number", sub: "release_channel", hub: true, orgOnly: false, createFields: ["versionKey", "versionNumber", "releaseChannel"] },
    { pascal: "IndustryDependency", key: "dependency_key", title: "dependency_key", sub: "dependency_type", hub: true, orgOnly: false, createFields: ["dependencyKey", "dependencyType", "dependencyRef"] },
    { pascal: "BusinessType", key: "type_key", title: "type_name", sub: "type_category", hub: true, orgOnly: false, createFields: ["typeKey", "typeName", "typeCategory"] },
    { pascal: "BusinessSize", key: "size_key", title: "size_label", sub: "employee_range", hub: true, orgOnly: false, createFields: ["sizeKey", "sizeLabel", "employeeRange"] },
    { pascal: "OperatingModel", key: "model_key", title: "model_name", sub: "model_type", hub: true, orgOnly: false, createFields: ["modelKey", "modelName", "modelType"] },
    { pascal: "IndustryProfile", key: "profile_key", title: "profile_name", sub: "profile_score", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileScore"] },
    { pascal: "DashboardTemplate", key: "template_key", title: "template_name", sub: "template_version", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateVersion"] },
    { pascal: "WorkflowTemplate", key: "template_key", title: "template_name", sub: "workflow_type", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "workflowType"] },
    { pascal: "RoleTemplate", key: "template_key", title: "role_name", sub: "permissions_count", hub: true, orgOnly: false, createFields: ["templateKey", "roleName", "permissionsCount"] },
    { pascal: "ReportTemplate", key: "template_key", title: "report_name", sub: "report_format", hub: true, orgOnly: false, createFields: ["templateKey", "reportName", "reportFormat"] },
    { pascal: "DynamicConfiguration", key: "config_key", title: "config_key", sub: "config_type", hub: true, orgOnly: false, createFields: ["configKey", "configType", "configValue"] },
    { pascal: "FeatureConfiguration", key: "feature_key", title: "feature_name", sub: "feature_key", hub: true, orgOnly: false, createFields: ["featureKey", "featureName", "enabled"] },
    { pascal: "BusinessRule", key: "rule_key", title: "rule_name", sub: "rule_type", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "ruleType"] },
    { pascal: "ValidationRule", key: "rule_key", title: "rule_name", sub: "validation_score", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "validationScore"] },
    { pascal: "IndustryContext", key: "context_key", title: "context_key", sub: "context_type", hub: true, orgOnly: false, createFields: ["contextKey", "contextType", "contextPayload"] },
    { pascal: "AiContext", key: "context_key", title: "context_key", sub: "context_type", hub: true, orgOnly: false, createFields: ["contextKey", "contextType", "tokenCount"] },
    { pascal: "TerminologyEntry", key: "term_key", title: "term_label", sub: "term_key", hub: true, orgOnly: false, createFields: ["termKey", "termLabel", "termDefinition"] },
    { pascal: "DemoProfile", key: "profile_key", title: "profile_name", sub: "demo_duration_days", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "demoDurationDays"] },
    { pascal: "ProductionProfile", key: "profile_key", title: "profile_name", sub: "deployment_target", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "deploymentTarget"] },
    { pascal: "EnterpriseProfile", key: "profile_key", title: "profile_name", sub: "compliance_tier", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "complianceTier"] },
    { pascal: "SharedApi", key: "api_key", title: "api_name", sub: "api_version", hub: true, orgOnly: false, createFields: ["apiKey", "apiName", "apiVersion"] },
    { pascal: "ContextApi", key: "api_key", title: "api_name", sub: "context_type", hub: true, orgOnly: false, createFields: ["apiKey", "apiName", "contextType"] },
    { pascal: "ConfigurationApi", key: "api_key", title: "api_name", sub: "config_scope", hub: true, orgOnly: false, createFields: ["apiKey", "apiName", "configScope"] },
    { pascal: "ExtensionPoint", key: "extension_key", title: "extension_name", sub: "hook_type", hub: true, orgOnly: false, createFields: ["extensionKey", "extensionName", "hookType"] },
    { pascal: "FrameworkMetric", key: "metrics_key", title: "metrics_key", sub: "overall_framework_score", hub: false, orgOnly: true, createFields: ["metricsKey", "templateScore", "overallFrameworkScore"] },
    { pascal: "FrameworkHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "CompatibilityCheck", key: "check_key", title: "check_key", sub: "check_type", hub: true, orgOnly: false, createFields: ["checkKey", "checkType", "checkScore"] },
    { pascal: "FrameworkFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "profileScore", "permissionsCount", "validationScore", "tokenCount", "demoDurationDays",
    "templateScore", "overallFrameworkScore", "overallScore", "checkScore",
]);
const boolFields = new Set(["disasterRecoveryMode", "enabled"]);

function buildTypes() {
    let t = `export interface IfrDashboardStats {
    totalFrameworkHubs: number;
    activeFrameworkHubs: number;
    dashboardTemplateCount: number;
    workflowTemplateCount: number;
    industryProfileCount: number;
    openCompatibilityCount: number;
    openFailureCount: number;
    overallFrameworkScore: number;
    templateScore: number;
    profileScore: number;
    compatibilityScore: number;
    sdkScore: number;
    frameworkHealthScore: number;
    auditCount: number;
}

export interface IfrPipelineInfo {
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

export interface IfrSdkRegisterIndustryInput { frameworkHubId: string; registrationKey?: string; industryCode?: string; }
export interface IfrSdkRegisterIndustryResult { registrationId: string; registrationKey: string; status: string; }
export interface IfrSdkConfigureTemplateInput { frameworkHubId: string; templateKey?: string; templateName?: string; }
export interface IfrSdkConfigureTemplateResult { templateId: string; templateKey: string; status: string; }
export interface IfrSdkRunCompatibilityCheckInput { frameworkHubId: string; checkKey?: string; checkType?: string; }
export interface IfrSdkRunCompatibilityCheckResult { checkId: string; checkKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "FrameworkHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    frameworkHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbIfr${e.pascal}`).concat(["DbIfrAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["IfrDashboardStats", "IfrPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/industry-framework/types";

export function buildFrameworkHubLookupMaps(hubs: DbIfrFrameworkHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildIfrPipelineInfo(): IfrPipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "profile", label: "Profile" },
        { key: "template", label: "Template" },
        { key: "framework", label: "Framework" },
    ];
    return { stages, currentStage: "template", nextStage: "framework", previousStage: "profile" };
}

export function buildIfrAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbIfrAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "FrameworkHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.frameworkHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbIfr${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapDashboardTemplateForStats(r: DbIfrDashboardTemplate) { return { status: r.status }; }
export function mapWorkflowTemplateForStats(r: DbIfrWorkflowTemplate) { return { status: r.status }; }
export function mapFrameworkMetricForStats(r: DbIfrFrameworkMetric) {
    return {
        template_score: r.template_score,
        profile_score: r.profile_score,
        compatibility_score: r.compatibility_score,
        sdk_score: r.sdk_score,
        framework_health_score: r.framework_health_score,
        overall_framework_score: r.overall_framework_score,
        status: r.status,
    };
}
export function mapIndustryProfileForStats(r: DbIfrIndustryProfile) { return { profile_score: r.profile_score, status: r.status }; }
export function mapCompatibilityCheckForStats(r: DbIfrCompatibilityCheck) { return { check_score: r.check_score, status: r.status }; }
export function mapValidationRuleForStats(r: DbIfrValidationRule) { return { validation_score: r.validation_score, status: r.status }; }
export function mapFrameworkHealthForStats(r: DbIfrFrameworkHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapFrameworkFailureForStats(r: DbIfrFrameworkFailure) { return { status: r.status }; }

export function buildIfrDashboardStats(input: {
    frameworkHubs: FrameworkHubSummary[];
    dashboardTemplates: ReturnType<typeof mapDashboardTemplateForStats>[];
    workflowTemplates: ReturnType<typeof mapWorkflowTemplateForStats>[];
    frameworkMetrics: ReturnType<typeof mapFrameworkMetricForStats>[];
    industryProfiles: ReturnType<typeof mapIndustryProfileForStats>[];
    compatibilityChecks: ReturnType<typeof mapCompatibilityCheckForStats>[];
    validationRules: ReturnType<typeof mapValidationRuleForStats>[];
    frameworkHealth: ReturnType<typeof mapFrameworkHealthForStats>[];
    frameworkFailures: FrameworkFailureSummary[];
    auditLogs: AuditEntry[];
}): IfrDashboardStats {
    const activeHubs = input.frameworkHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.frameworkMetrics[0];
    const latestHealth = input.frameworkHealth[0];
    return {
        totalFrameworkHubs: input.frameworkHubs.length,
        activeFrameworkHubs: activeHubs,
        dashboardTemplateCount: input.dashboardTemplates.length,
        workflowTemplateCount: input.workflowTemplates.length,
        industryProfileCount: input.industryProfiles.length,
        openCompatibilityCount: input.compatibilityChecks.filter((c) => c.status === "open" || (c.check_score ?? 100) < 80).length,
        openFailureCount: input.frameworkFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallFrameworkScore: latestMetrics?.overall_framework_score ?? latestHealth?.overall_score ?? 0,
        templateScore: latestMetrics?.template_score ?? 0,
        profileScore: latestMetrics?.profile_score ?? 0,
        compatibilityScore: latestMetrics?.compatibility_score ?? 0,
        sdkScore: latestMetrics?.sdk_score ?? 0,
        frameworkHealthScore: latestMetrics?.framework_health_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/industry-framework/types"), { recursive: true });
writeFileSync(join(root, "src/modules/industry-framework/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/industry-framework-mappers.ts"), buildMappers(), "utf8");
console.log("Generated IFR types and mappers");
