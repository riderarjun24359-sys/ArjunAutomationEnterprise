#!/usr/bin/env node
/**
 * Generates retail-mappers.ts and types/index.ts for Program B Sprint 9.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "RetailHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "RetailBrand", key: "brand_key", title: "brand_name", sub: "brand_type", hub: true, orgOnly: false, createFields: ["brandKey", "brandName", "brandType"] },
    { pascal: "Store", key: "store_key", title: "store_name", sub: "store_type", hub: true, orgOnly: false, createFields: ["storeKey", "storeName", "storeType"] },
    { pascal: "CashRegister", key: "register_key", title: "register_name", sub: "register_status", hub: true, orgOnly: false, createFields: ["registerKey", "registerName", "registerStatus"] },
    { pascal: "StoreDepartment", key: "department_key", title: "department_name", sub: "department_type", hub: true, orgOnly: false, createFields: ["departmentKey", "departmentName", "departmentType"] },
    { pascal: "Product", key: "product_key", title: "product_name", sub: "product_type", hub: true, orgOnly: false, createFields: ["productKey", "productName", "productType"] },
    { pascal: "ProductCategory", key: "category_key", title: "category_name", sub: "category_type", hub: true, orgOnly: false, createFields: ["categoryKey", "categoryName", "categoryType"] },
    { pascal: "ProductVariant", key: "variant_key", title: "variant_name", sub: "variant_type", hub: true, orgOnly: false, createFields: ["variantKey", "variantName", "variantType"] },
    { pascal: "Promotion", key: "promotion_key", title: "promotion_name", sub: "promotion_status", hub: true, orgOnly: false, createFields: ["promotionKey", "promotionName", "promotionStatus"] },
    { pascal: "SalesOrder", key: "order_key", title: "order_name", sub: "order_status", hub: true, orgOnly: false, createFields: ["orderKey", "orderName", "orderStatus"] },
    { pascal: "PosTransaction", key: "transaction_key", title: "transaction_name", sub: "transaction_status", hub: true, orgOnly: false, createFields: ["transactionKey", "transactionName", "transactionStatus"] },
    { pascal: "ReturnsExchange", key: "return_key", title: "return_name", sub: "return_status", hub: true, orgOnly: false, createFields: ["returnKey", "returnName", "returnStatus"] },
    { pascal: "ShiftClosing", key: "closing_key", title: "closing_name", sub: "closing_status", hub: true, orgOnly: false, createFields: ["closingKey", "closingName", "closingStatus"] },
    { pascal: "Warehouse", key: "warehouse_key", title: "warehouse_name", sub: "warehouse_type", hub: true, orgOnly: false, createFields: ["warehouseKey", "warehouseName", "warehouseType"] },
    { pascal: "StockLevel", key: "stock_key", title: "stock_name", sub: "stock_quantity", hub: true, orgOnly: false, createFields: ["stockKey", "stockName", "stockQuantity"] },
    { pascal: "PurchaseOrder", key: "order_key", title: "order_name", sub: "order_status", hub: true, orgOnly: false, createFields: ["orderKey", "orderName", "orderStatus"] },
    { pascal: "Supplier", key: "supplier_key", title: "supplier_name", sub: "supplier_type", hub: true, orgOnly: false, createFields: ["supplierKey", "supplierName", "supplierType"] },
    { pascal: "CustomerProfile", key: "profile_key", title: "profile_name", sub: "profile_type", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileType"] },
    { pascal: "LoyaltyProgram", key: "program_key", title: "program_name", sub: "program_type", hub: true, orgOnly: false, createFields: ["programKey", "programName", "programType"] },
    { pascal: "RewardPoint", key: "points_key", title: "points_name", sub: "points_balance", hub: true, orgOnly: false, createFields: ["pointsKey", "pointsName", "pointsBalance"] },
    { pascal: "Campaign", key: "campaign_key", title: "campaign_name", sub: "campaign_status", hub: true, orgOnly: false, createFields: ["campaignKey", "campaignName", "campaignStatus"] },
    { pascal: "DailyClosing", key: "closing_key", title: "closing_name", sub: "closing_amount", hub: true, orgOnly: false, createFields: ["closingKey", "closingName", "closingAmount"] },
    { pascal: "BranchPerformance", key: "performance_key", title: "performance_name", sub: "performance_score", hub: true, orgOnly: false, createFields: ["performanceKey", "performanceName", "performanceScore"] },
    { pascal: "CommissionRecord", key: "commission_key", title: "commission_name", sub: "commission_amount", hub: true, orgOnly: false, createFields: ["commissionKey", "commissionName", "commissionAmount"] },
    { pascal: "SalesAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "InventoryAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "ProfitabilityAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "RetailMetric", key: "metrics_key", title: "metrics_key", sub: "overall_retail_score", hub: false, orgOnly: true, createFields: ["metricsKey", "revenueTotal", "overallRetailScore"] },
    { pascal: "RetailHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "ExecutiveKpi", key: "kpi_key", title: "kpi_name", sub: "kpi_score", hub: true, orgOnly: false, createFields: ["kpiKey", "kpiName", "kpiScore"] },
    { pascal: "RetailFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "closingAmount", "performanceScore", "commissionAmount", "analyticsScore", "kpiScore",
    "stockQuantity", "pointsBalance", "revenueTotal", "overallRetailScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface RtlDashboardStats {
    totalRetailHubs: number;
    activeRetailHubs: number;
    retailBrandCount: number;
    customerProfileCount: number;
    salesOrderCount: number;
    openPosTransactionCount: number;
    openRetailFailureCount: number;
    overallRetailScore: number;
    revenueTotalScore: number;
    profitTotalScore: number;
    salesCountScore: number;
    inventoryValueScore: number;
    customerRetentionRateScore: number;
    auditCount: number;
}

export interface RtlPipelineInfo {
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

export interface RtlSdkRegisterRetailBrandInput { retailHubId: string; brandKey?: string; brandName?: string; }
export interface RtlSdkRegisterRetailBrandResult { brandId: string; brandKey: string; status: string; }
export interface RtlSdkConfigureCustomerProfileInput { retailHubId: string; profileKey?: string; profileName?: string; }
export interface RtlSdkConfigureCustomerProfileResult { profileId: string; profileKey: string; status: string; }
export interface RtlSdkRunSalesOrderWorkflowInput { retailHubId: string; orderKey?: string; orderName?: string; }
export interface RtlSdkRunSalesOrderWorkflowResult { orderId: string; orderKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "RetailHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    retailHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbRtl${e.pascal}`).concat(["DbRtlAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["RtlDashboardStats", "RtlPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/retail/types";

export function buildRetailHubLookupMaps(hubs: DbRtlRetailHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildRtlPipelineInfo(): RtlPipelineInfo {
    const stages = [
        { key: "foundation", label: "Foundation" },
        { key: "product", label: "Product" },
        { key: "sales_pos", label: "Sales & POS" },
        { key: "inventory", label: "Inventory" },
        { key: "customer", label: "Customer" },
    ];
    return { stages, currentStage: "sales_pos", nextStage: "inventory", previousStage: "product" };
}

export function buildRtlAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbRtlAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "RetailHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.retailHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbRtl${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapRetailBrandForStats(r: DbRtlRetailBrand) { return { status: r.status }; }
export function mapCustomerProfileForStats(r: DbRtlCustomerProfile) { return { status: r.status }; }
export function mapRetailMetricForStats(r: DbRtlRetailMetric) {
    return {
        revenue_total: r.revenue_total,
        profit_total: r.profit_total,
        sales_count: r.sales_count,
        inventory_value: r.inventory_value,
        customer_retention_rate: r.customer_retention_rate,
        store_performance_score: r.store_performance_score,
        top_product_score: r.top_product_score,
        overall_retail_score: r.overall_retail_score,
        status: r.status,
    };
}
export function mapSalesOrderForStats(r: DbRtlSalesOrder) { return { order_status: r.order_status, status: r.status }; }
export function mapPosTransactionForStats(r: DbRtlPosTransaction) { return { transaction_status: r.transaction_status, status: r.status }; }
export function mapWarehouseForStats(r: DbRtlWarehouse) { return { status: r.status }; }
export function mapStockLevelForStats(r: DbRtlStockLevel) { return { status: r.status }; }
export function mapRetailHealthForStats(r: DbRtlRetailHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapRetailFailureForStats(r: DbRtlRetailFailure) { return { status: r.status }; }

export function buildRtlDashboardStats(input: {
    retailHubs: RetailHubSummary[];
    retailBrands: ReturnType<typeof mapRetailBrandForStats>[];
    customerProfiles: ReturnType<typeof mapCustomerProfileForStats>[];
    retailMetrics: ReturnType<typeof mapRetailMetricForStats>[];
    salesOrders: ReturnType<typeof mapSalesOrderForStats>[];
    posTransactions: ReturnType<typeof mapPosTransactionForStats>[];
    warehouses: ReturnType<typeof mapWarehouseForStats>[];
    stockLevels: ReturnType<typeof mapStockLevelForStats>[];
    retailHealth: ReturnType<typeof mapRetailHealthForStats>[];
    retailFailures: RetailFailureSummary[];
    auditLogs: AuditEntry[];
}): RtlDashboardStats {
    const activeHubs = input.retailHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.retailMetrics[0];
    const latestHealth = input.retailHealth[0];
    return {
        totalRetailHubs: input.retailHubs.length,
        activeRetailHubs: activeHubs,
        retailBrandCount: input.retailBrands.length,
        customerProfileCount: input.customerProfiles.length,
        salesOrderCount: input.salesOrders.length,
        openPosTransactionCount: input.posTransactions.filter((r) => r.transaction_status === "pending" || r.status === "open").length,
        openRetailFailureCount: input.retailFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallRetailScore: latestMetrics?.overall_retail_score ?? latestHealth?.overall_score ?? 0,
        revenueTotalScore: latestMetrics?.revenue_total ?? 0,
        profitTotalScore: latestMetrics?.profit_total ?? 0,
        salesCountScore: latestMetrics?.sales_count ?? 0,
        inventoryValueScore: latestMetrics?.inventory_value ?? 0,
        customerRetentionRateScore: latestMetrics?.customer_retention_rate ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/retail/types"), { recursive: true });
writeFileSync(join(root, "src/modules/retail/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/retail-mappers.ts"), buildMappers(), "utf8");
console.log("Generated RTL types and mappers");
