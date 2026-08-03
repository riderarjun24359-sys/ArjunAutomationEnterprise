#!/usr/bin/env node
/**
 * Generates company-foundation-mappers.ts and types/index.ts for Program F Wave 1.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "CompanyHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "BrandProfile", key: "profile_key", title: "profile_name", sub: "brand_status", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "brandStatus"] },
    { pascal: "LogoAsset", key: "asset_key", title: "asset_name", sub: "asset_type", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "assetType"] },
    { pascal: "ThemeConfig", key: "config_key", title: "config_name", sub: "primary_color", hub: true, orgOnly: false, createFields: ["configKey", "configName", "primaryColor"] },
    { pascal: "BrandAsset", key: "asset_key", title: "asset_name", sub: "asset_category", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "assetCategory"] },
    { pascal: "WebsitePage", key: "page_key", title: "page_title", sub: "page_slug", hub: true, orgOnly: false, createFields: ["pageKey", "pageTitle", "pageSlug"] },
    { pascal: "WebsiteFeature", key: "feature_key", title: "feature_name", sub: "feature_type", hub: true, orgOnly: false, createFields: ["featureKey", "featureName", "featureType"] },
    { pascal: "WebsiteSection", key: "section_key", title: "section_name", sub: "section_type", hub: true, orgOnly: false, createFields: ["sectionKey", "sectionName", "sectionType"] },
    { pascal: "DemoRequest", key: "request_key", title: "request_name", sub: "request_status", hub: true, orgOnly: false, createFields: ["requestKey", "requestName", "requestStatus"] },
    { pascal: "PricingPlan", key: "plan_key", title: "plan_name", sub: "plan_tier", hub: true, orgOnly: false, createFields: ["planKey", "planName", "planTier"] },
    { pascal: "PricingPackage", key: "package_key", title: "package_name", sub: "package_type", hub: true, orgOnly: false, createFields: ["packageKey", "packageName", "packageType"] },
    { pascal: "ModulePricing", key: "pricing_key", title: "module_name", sub: "price_amount", hub: true, orgOnly: false, createFields: ["pricingKey", "moduleName", "priceAmount"] },
    { pascal: "DiscountRule", key: "rule_key", title: "rule_name", sub: "discount_percent", hub: true, orgOnly: false, createFields: ["ruleKey", "ruleName", "discountPercent"] },
    { pascal: "Proposal", key: "proposal_key", title: "proposal_name", sub: "proposal_status", hub: true, orgOnly: false, createFields: ["proposalKey", "proposalName", "proposalStatus"] },
    { pascal: "ProposalDocument", key: "document_key", title: "document_name", sub: "document_type", hub: true, orgOnly: false, createFields: ["documentKey", "documentName", "documentType"] },
    { pascal: "ProposalContract", key: "contract_key", title: "contract_name", sub: "contract_status", hub: true, orgOnly: false, createFields: ["contractKey", "contractName", "contractStatus"] },
    { pascal: "ProposalHistory", key: "history_key", title: "history_key", sub: "history_type", hub: true, orgOnly: false, createFields: ["historyKey", "historyType", "changedAt"] },
    { pascal: "PortalDashboard", key: "dashboard_key", title: "dashboard_name", sub: "dashboard_type", hub: true, orgOnly: false, createFields: ["dashboardKey", "dashboardName", "dashboardType"] },
    { pascal: "PortalSubscription", key: "subscription_key", title: "plan_name", sub: "subscription_status", hub: true, orgOnly: false, createFields: ["subscriptionKey", "planName", "subscriptionStatus"] },
    { pascal: "PortalBilling", key: "billing_key", title: "billing_key", sub: "billing_type", hub: true, orgOnly: false, createFields: ["billingKey", "billingType", "billingAmount"] },
    { pascal: "PortalSupport", key: "support_key", title: "support_title", sub: "support_status", hub: true, orgOnly: false, createFields: ["supportKey", "supportTitle", "supportStatus"] },
    { pascal: "DocGuide", key: "guide_key", title: "guide_title", sub: "guide_category", hub: true, orgOnly: false, createFields: ["guideKey", "guideTitle", "guideCategory"] },
    { pascal: "DocApiReference", key: "reference_key", title: "reference_name", sub: "api_version", hub: true, orgOnly: false, createFields: ["referenceKey", "referenceName", "apiVersion"] },
    { pascal: "DocVersion", key: "version_key", title: "version_name", sub: "version_number", hub: true, orgOnly: false, createFields: ["versionKey", "versionName", "versionNumber"] },
    { pascal: "DemoOrganization", key: "org_key", title: "org_name", sub: "org_type", hub: true, orgOnly: false, createFields: ["orgKey", "orgName", "orgType"] },
    { pascal: "DemoDataSet", key: "dataset_key", title: "dataset_name", sub: "record_count", hub: true, orgOnly: false, createFields: ["datasetKey", "datasetName", "recordCount"] },
    { pascal: "DemoUser", key: "user_key", title: "user_name", sub: "user_role", hub: true, orgOnly: false, createFields: ["userKey", "userName", "userRole"] },
    { pascal: "CompanyMetric", key: "metrics_key", title: "metrics_key", sub: "overall_company_score", hub: false, orgOnly: true, createFields: ["metricsKey", "overallCompanyScore", "platformHealthScore"] },
    { pascal: "CompanyHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "ExecutiveKpi", key: "kpi_key", title: "kpi_name", sub: "kpi_score", hub: true, orgOnly: false, createFields: ["kpiKey", "kpiName", "kpiScore"] },
    { pascal: "CompanyFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "priceAmount", "discountPercent", "recordCount", "kpiScore", "overallCompanyScore", "platformHealthScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface CmpDashboardStats {
    totalCompanyHubs: number;
    activeCompanyHubs: number;
    brandProfileCount: number;
    websitePageCount: number;
    pricingPlanCount: number;
    proposalCount: number;
    portalDashboardCount: number;
    openCompanyFailureCount: number;
    overallCompanyScore: number;
    websiteAnalyticsScore: number;
    demoRequestCount: number;
    activeCustomerCount: number;
    revenueTotal: number;
    proposalPendingCount: number;
    supportOpenCount: number;
    platformHealthScore: number;
    auditCount: number;
}

export interface CmpPipelineInfo {
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

export interface CmpSdkConfigureBrandProfileInput { companyHubId: string; profileKey?: string; profileName?: string; }
export interface CmpSdkConfigureBrandProfileResult { profileId: string; profileKey: string; status: string; }
export interface CmpSdkPublishWebsitePageInput { companyHubId: string; pageKey?: string; pageTitle?: string; }
export interface CmpSdkPublishWebsitePageResult { pageId: string; pageKey: string; status: string; }
export interface CmpSdkGenerateProposalInput { companyHubId: string; proposalKey?: string; proposalName?: string; }
export interface CmpSdkGenerateProposalResult { proposalId: string; proposalKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "CompanyHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    companyHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbCmp${e.pascal}`).concat(["DbCmpAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["CmpDashboardStats", "CmpPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/company-foundation/types";

export function buildCompanyHubLookupMaps(hubs: DbCmpCompanyHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildCmpPipelineInfo(): CmpPipelineInfo {
    const stages = [
        { key: "brand", label: "Brand" },
        { key: "website", label: "Website" },
        { key: "pricing", label: "Pricing" },
        { key: "proposal", label: "Proposal" },
        { key: "customer_portal", label: "Customer Portal" },
    ];
    return { stages, currentStage: "proposal", nextStage: "customer_portal", previousStage: "pricing" };
}

export function buildCmpAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbCmpAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "CompanyHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.companyHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbCmp${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapBrandProfileForStats(r: DbCmpBrandProfile) { return { status: r.status }; }
export function mapWebsitePageForStats(r: DbCmpWebsitePage) { return { status: r.status }; }
export function mapPricingPlanForStats(r: DbCmpPricingPlan) { return { status: r.status }; }
export function mapProposalForStats(r: DbCmpProposal) { return { proposal_status: r.proposal_status, status: r.status }; }
export function mapPortalDashboardForStats(r: DbCmpPortalDashboard) { return { status: r.status }; }
export function mapCompanyMetricForStats(r: DbCmpCompanyMetric) {
    return {
        website_analytics_score: r.website_analytics_score,
        demo_request_count: r.demo_request_count,
        active_customer_count: r.active_customer_count,
        revenue_total: r.revenue_total,
        proposal_pending_count: r.proposal_pending_count,
        support_open_count: r.support_open_count,
        platform_health_score: r.platform_health_score,
        overall_company_score: r.overall_company_score,
        status: r.status,
    };
}
export function mapCompanyHealthForStats(r: DbCmpCompanyHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapCompanyFailureForStats(r: DbCmpCompanyFailure) { return { status: r.status }; }

export function buildCmpDashboardStats(input: {
    companyHubs: CompanyHubSummary[];
    brandProfiles: ReturnType<typeof mapBrandProfileForStats>[];
    companyMetrics: ReturnType<typeof mapCompanyMetricForStats>[];
    websitePages: ReturnType<typeof mapWebsitePageForStats>[];
    pricingPlans: ReturnType<typeof mapPricingPlanForStats>[];
    proposals: ReturnType<typeof mapProposalForStats>[];
    portalDashboards: ReturnType<typeof mapPortalDashboardForStats>[];
    companyHealth: ReturnType<typeof mapCompanyHealthForStats>[];
    companyFailures: CompanyFailureSummary[];
    auditLogs: AuditEntry[];
}): CmpDashboardStats {
    const activeHubs = input.companyHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.companyMetrics[0];
    const latestHealth = input.companyHealth[0];
    return {
        totalCompanyHubs: input.companyHubs.length,
        activeCompanyHubs: activeHubs,
        brandProfileCount: input.brandProfiles.length,
        websitePageCount: input.websitePages.length,
        pricingPlanCount: input.pricingPlans.length,
        proposalCount: input.proposals.length,
        portalDashboardCount: input.portalDashboards.length,
        openCompanyFailureCount: input.companyFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallCompanyScore: latestMetrics?.overall_company_score ?? latestHealth?.overall_score ?? 0,
        websiteAnalyticsScore: latestMetrics?.website_analytics_score ?? 0,
        demoRequestCount: latestMetrics?.demo_request_count ?? 0,
        activeCustomerCount: latestMetrics?.active_customer_count ?? 0,
        revenueTotal: latestMetrics?.revenue_total ?? 0,
        proposalPendingCount: latestMetrics?.proposal_pending_count ?? 0,
        supportOpenCount: latestMetrics?.support_open_count ?? 0,
        platformHealthScore: latestMetrics?.platform_health_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/company-foundation/types"), { recursive: true });
writeFileSync(join(root, "src/modules/company-foundation/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/company-foundation-mappers.ts"), buildMappers(), "utf8");
console.log("Generated CMP types and mappers");
