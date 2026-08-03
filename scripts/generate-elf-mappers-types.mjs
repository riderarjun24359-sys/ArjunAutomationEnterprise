#!/usr/bin/env node
/**
 * Generates launch-foundation-mappers.ts and types/index.ts for Program C Sprint 4.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "LaunchHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "OrganizationProvision", key: "provision_key", title: "provision_name", sub: "provision_status", hub: true, orgOnly: false, createFields: ["provisionKey", "provisionName", "provisionStatus"] },
    { pascal: "TenantProvision", key: "provision_key", title: "provision_key", sub: "tenant_ref", hub: true, orgOnly: false, createFields: ["provisionKey", "tenantRef", "provisionStatus"] },
    { pascal: "IndustryPackAssignment", key: "assignment_key", title: "pack_name", sub: "pack_type", hub: true, orgOnly: false, createFields: ["assignmentKey", "packName", "packType"] },
    { pascal: "ModuleLicense", key: "license_key", title: "module_name", sub: "license_status", hub: true, orgOnly: false, createFields: ["licenseKey", "moduleName", "licenseStatus"] },
    { pascal: "WizardProfile", key: "profile_key", title: "profile_name", sub: "profile_type", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileType"] },
    { pascal: "WizardBranding", key: "branding_key", title: "branding_name", sub: "brand_color", hub: true, orgOnly: false, createFields: ["brandingKey", "brandingName", "brandColor"] },
    { pascal: "WizardDepartment", key: "department_key", title: "department_name", sub: "department_type", hub: true, orgOnly: false, createFields: ["departmentKey", "departmentName", "departmentType"] },
    { pascal: "WizardSetting", key: "setting_key", title: "setting_name", sub: "setting_value", hub: true, orgOnly: false, createFields: ["settingKey", "settingName", "settingValue"] },
    { pascal: "ImportJob", key: "job_key", title: "job_name", sub: "job_status", hub: true, orgOnly: false, createFields: ["jobKey", "jobName", "jobStatus"] },
    { pascal: "ImportValidation", key: "validation_key", title: "validation_key", sub: "validation_type", hub: true, orgOnly: false, createFields: ["validationKey", "validationType", "validationScore"] },
    { pascal: "ImportPreview", key: "preview_key", title: "preview_name", sub: "record_count", hub: true, orgOnly: false, createFields: ["previewKey", "previewName", "recordCount"] },
    { pascal: "ImportHistory", key: "history_key", title: "history_key", sub: "history_type", hub: true, orgOnly: false, createFields: ["historyKey", "historyType", "importedAt"] },
    { pascal: "GoLiveChecklist", key: "checklist_key", title: "checklist_name", sub: "completion_score", hub: true, orgOnly: false, createFields: ["checklistKey", "checklistName", "completionScore"] },
    { pascal: "GoLiveScore", key: "score_key", title: "score_key", sub: "score_type", hub: true, orgOnly: false, createFields: ["scoreKey", "scoreType", "goLiveScore"] },
    { pascal: "DeploymentStatus", key: "status_key", title: "deployment_name", sub: "deployment_status", hub: true, orgOnly: false, createFields: ["statusKey", "deploymentName", "deploymentStatus"] },
    { pascal: "ReadinessValidation", key: "validation_key", title: "validation_key", sub: "validation_type", hub: true, orgOnly: false, createFields: ["validationKey", "validationType", "validationScore"] },
    { pascal: "CustomerHealthScore", key: "score_key", title: "score_key", sub: "customer_ref", hub: true, orgOnly: false, createFields: ["scoreKey", "customerRef", "healthScore"] },
    { pascal: "PlatformAdoption", key: "adoption_key", title: "feature_name", sub: "adoption_rate", hub: true, orgOnly: false, createFields: ["adoptionKey", "featureName", "adoptionRate"] },
    { pascal: "FeatureUsage", key: "usage_key", title: "feature_name", sub: "usage_count", hub: true, orgOnly: false, createFields: ["usageKey", "featureName", "usageCount"] },
    { pascal: "RenewalTracking", key: "renewal_key", title: "renewal_key", sub: "customer_ref", hub: true, orgOnly: false, createFields: ["renewalKey", "customerRef", "renewalStatus"] },
    { pascal: "SupportTicket", key: "ticket_key", title: "ticket_title", sub: "ticket_status", hub: true, orgOnly: false, createFields: ["ticketKey", "ticketTitle", "ticketStatus"] },
    { pascal: "KnowledgeBaseArticle", key: "article_key", title: "article_title", sub: "article_category", hub: true, orgOnly: false, createFields: ["articleKey", "articleTitle", "articleCategory"] },
    { pascal: "IncidentTracking", key: "incident_key", title: "incident_title", sub: "incident_severity", hub: true, orgOnly: false, createFields: ["incidentKey", "incidentTitle", "incidentSeverity"] },
    { pascal: "CustomerRegistry", key: "customer_key", title: "customer_name", sub: "customer_tier", hub: true, orgOnly: false, createFields: ["customerKey", "customerName", "customerTier"] },
    { pascal: "SubscriptionRecord", key: "subscription_key", title: "plan_name", sub: "subscription_status", hub: true, orgOnly: false, createFields: ["subscriptionKey", "planName", "subscriptionStatus"] },
    { pascal: "LicenseManagement", key: "license_key", title: "license_key", sub: "license_type", hub: true, orgOnly: false, createFields: ["licenseKey", "licenseType", "licenseStatus"] },
    { pascal: "LaunchMetric", key: "metrics_key", title: "metrics_key", sub: "overall_launch_score", hub: false, orgOnly: true, createFields: ["metricsKey", "platformHealthScore", "overallLaunchScore"] },
    { pascal: "LaunchHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "MissionControlKpi", key: "kpi_key", title: "kpi_name", sub: "kpi_score", hub: true, orgOnly: false, createFields: ["kpiKey", "kpiName", "kpiScore"] },
    { pascal: "LaunchFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "completionScore", "goLiveScore", "validationScore", "healthScore", "adoptionRate", "usageCount",
    "recordCount", "kpiScore", "platformHealthScore", "overallLaunchScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface ElfDashboardStats {
    totalLaunchHubs: number;
    activeLaunchHubs: number;
    organizationProvisionCount: number;
    importJobCount: number;
    goLiveChecklistCount: number;
    customerRegistryCount: number;
    openLaunchFailureCount: number;
    overallLaunchScore: number;
    platformHealthScore: number;
    customerHealthScore: number;
    deploymentCount: number;
    subscriptionCount: number;
    supportOpenCount: number;
    goLiveScore: number;
    auditCount: number;
}

export interface ElfPipelineInfo {
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

export interface ElfSdkProvisionOrganizationInput { launchHubId: string; provisionKey?: string; provisionName?: string; }
export interface ElfSdkProvisionOrganizationResult { provisionId: string; provisionKey: string; status: string; }
export interface ElfSdkConfigureWizardProfileInput { launchHubId: string; profileKey?: string; profileName?: string; }
export interface ElfSdkConfigureWizardProfileResult { profileId: string; profileKey: string; status: string; }
export interface ElfSdkRunGoLiveWorkflowInput { launchHubId: string; checklistKey?: string; checklistName?: string; }
export interface ElfSdkRunGoLiveWorkflowResult { checklistId: string; checklistKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "LaunchHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    launchHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbElf${e.pascal}`).concat(["DbElfAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["ElfDashboardStats", "ElfPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/launch-foundation/types";

export function buildLaunchHubLookupMaps(hubs: DbElfLaunchHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildElfPipelineInfo(): ElfPipelineInfo {
    const stages = [
        { key: "provisioning", label: "Provisioning" },
        { key: "config_wizard", label: "Config Wizard" },
        { key: "data_import", label: "Data Import" },
        { key: "go_live", label: "Go Live" },
        { key: "customer_success", label: "Customer Success" },
    ];
    return { stages, currentStage: "go_live", nextStage: "customer_success", previousStage: "data_import" };
}

export function buildElfAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbElfAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "LaunchHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.launchHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbElf${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapOrganizationProvisionForStats(r: DbElfOrganizationProvision) { return { status: r.status }; }
export function mapImportJobForStats(r: DbElfImportJob) { return { job_status: r.job_status, status: r.status }; }
export function mapLaunchMetricForStats(r: DbElfLaunchMetric) {
    return {
        platform_health_score: r.platform_health_score,
        customer_health_score: r.customer_health_score,
        deployment_count: r.deployment_count,
        subscription_count: r.subscription_count,
        support_open_count: r.support_open_count,
        go_live_score: r.go_live_score,
        overall_launch_score: r.overall_launch_score,
        status: r.status,
    };
}
export function mapGoLiveChecklistForStats(r: DbElfGoLiveChecklist) { return { status: r.status }; }
export function mapCustomerRegistryForStats(r: DbElfCustomerRegistry) { return { status: r.status }; }
export function mapLaunchHealthForStats(r: DbElfLaunchHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapLaunchFailureForStats(r: DbElfLaunchFailure) { return { status: r.status }; }

export function buildElfDashboardStats(input: {
    launchHubs: LaunchHubSummary[];
    organizationProvisions: ReturnType<typeof mapOrganizationProvisionForStats>[];
    launchMetrics: ReturnType<typeof mapLaunchMetricForStats>[];
    importJobs: ReturnType<typeof mapImportJobForStats>[];
    goLiveChecklists: ReturnType<typeof mapGoLiveChecklistForStats>[];
    customerRegistry: ReturnType<typeof mapCustomerRegistryForStats>[];
    launchHealth: ReturnType<typeof mapLaunchHealthForStats>[];
    launchFailures: LaunchFailureSummary[];
    auditLogs: AuditEntry[];
}): ElfDashboardStats {
    const activeHubs = input.launchHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.launchMetrics[0];
    const latestHealth = input.launchHealth[0];
    return {
        totalLaunchHubs: input.launchHubs.length,
        activeLaunchHubs: activeHubs,
        organizationProvisionCount: input.organizationProvisions.length,
        importJobCount: input.importJobs.length,
        goLiveChecklistCount: input.goLiveChecklists.length,
        customerRegistryCount: input.customerRegistry.length,
        openLaunchFailureCount: input.launchFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallLaunchScore: latestMetrics?.overall_launch_score ?? latestHealth?.overall_score ?? 0,
        platformHealthScore: latestMetrics?.platform_health_score ?? 0,
        customerHealthScore: latestMetrics?.customer_health_score ?? 0,
        deploymentCount: latestMetrics?.deployment_count ?? 0,
        subscriptionCount: latestMetrics?.subscription_count ?? 0,
        supportOpenCount: latestMetrics?.support_open_count ?? 0,
        goLiveScore: latestMetrics?.go_live_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/launch-foundation/types"), { recursive: true });
writeFileSync(join(root, "src/modules/launch-foundation/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/launch-foundation-mappers.ts"), buildMappers(), "utf8");
console.log("Generated ELF types and mappers");
