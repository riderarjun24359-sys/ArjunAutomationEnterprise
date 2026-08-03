#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/retail");

const entities = [
    { tab: "retailHubs", plural: "retailHubs", singular: "RetailHub", pascal: "RetailHub", db: "rtlRetailHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "retailBrands", plural: "retailBrands", singular: "RetailBrand", pascal: "RetailBrand", db: "rtlRetailBrands", fields: [{ name: "brandKey", type: "string" }, { name: "brandName", type: "string" }, { name: "brandType", type: "string" }], display: { title: "brandName", sub: "brandType" } },
    { tab: "stores", plural: "stores", singular: "Store", pascal: "Store", db: "rtlStores", fields: [{ name: "storeKey", type: "string" }, { name: "storeName", type: "string" }, { name: "storeType", type: "string" }], display: { title: "storeName", sub: "storeType" } },
    { tab: "cashRegisters", plural: "cashRegisters", singular: "CashRegister", pascal: "CashRegister", db: "rtlCashRegisters", fields: [{ name: "registerKey", type: "string" }, { name: "registerName", type: "string" }, { name: "registerStatus", type: "select", options: "REGISTER_STATUS_OPTIONS" }], display: { title: "registerName", sub: "registerStatus" } },
    { tab: "storeDepartments", plural: "storeDepartments", singular: "StoreDepartment", pascal: "StoreDepartment", db: "rtlStoreDepartments", fields: [{ name: "departmentKey", type: "string" }, { name: "departmentName", type: "string" }, { name: "departmentType", type: "string" }], display: { title: "departmentName", sub: "departmentType" } },
    { tab: "products", plural: "products", singular: "Product", pascal: "Product", db: "rtlProducts", fields: [{ name: "productKey", type: "string" }, { name: "productName", type: "string" }, { name: "productType", type: "string" }], display: { title: "productName", sub: "productType" } },
    { tab: "productCategories", plural: "productCategories", singular: "ProductCategory", pascal: "ProductCategory", db: "rtlProductCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" } },
    { tab: "productVariants", plural: "productVariants", singular: "ProductVariant", pascal: "ProductVariant", db: "rtlProductVariants", fields: [{ name: "variantKey", type: "string" }, { name: "variantName", type: "string" }, { name: "variantType", type: "string" }], display: { title: "variantName", sub: "variantType" } },
    { tab: "promotions", plural: "promotions", singular: "Promotion", pascal: "Promotion", db: "rtlPromotions", fields: [{ name: "promotionKey", type: "string" }, { name: "promotionName", type: "string" }, { name: "promotionStatus", type: "select", options: "PROMOTION_STATUS_OPTIONS" }], display: { title: "promotionName", sub: "promotionStatus" } },
    { tab: "salesOrders", plural: "salesOrders", singular: "SalesOrder", pascal: "SalesOrder", db: "rtlSalesOrders", fields: [{ name: "orderKey", type: "string" }, { name: "orderName", type: "string" }, { name: "orderStatus", type: "select", options: "SALES_ORDER_STATUS_OPTIONS" }], display: { title: "orderName", sub: "orderStatus" } },
    { tab: "posTransactions", plural: "posTransactions", singular: "PosTransaction", pascal: "PosTransaction", db: "rtlPosTransactions", fields: [{ name: "transactionKey", type: "string" }, { name: "transactionName", type: "string" }, { name: "transactionStatus", type: "string" }], display: { title: "transactionName", sub: "transactionStatus" } },
    { tab: "returnsExchanges", plural: "returnsExchanges", singular: "ReturnsExchange", pascal: "ReturnsExchange", db: "rtlReturnsExchanges", fields: [{ name: "returnKey", type: "string" }, { name: "returnName", type: "string" }, { name: "returnStatus", type: "select", options: "RETURN_STATUS_OPTIONS" }], display: { title: "returnName", sub: "returnStatus" } },
    { tab: "shiftClosings", plural: "shiftClosings", singular: "ShiftClosing", pascal: "ShiftClosing", db: "rtlShiftClosings", fields: [{ name: "closingKey", type: "string" }, { name: "closingName", type: "string" }, { name: "closingStatus", type: "string" }], display: { title: "closingName", sub: "closingStatus" } },
    { tab: "warehouses", plural: "warehouses", singular: "Warehouse", pascal: "Warehouse", db: "rtlWarehouses", fields: [{ name: "warehouseKey", type: "string" }, { name: "warehouseName", type: "string" }, { name: "warehouseType", type: "string" }], display: { title: "warehouseName", sub: "warehouseType" } },
    { tab: "stockLevels", plural: "stockLevels", singular: "StockLevel", pascal: "StockLevel", db: "rtlStockLevels", fields: [{ name: "stockKey", type: "string" }, { name: "stockName", type: "string" }, { name: "stockQuantity", type: "number" }], display: { title: "stockName", sub: "stockQuantity" } },
    { tab: "purchaseOrders", plural: "purchaseOrders", singular: "PurchaseOrder", pascal: "PurchaseOrder", db: "rtlPurchaseOrders", fields: [{ name: "orderKey", type: "string" }, { name: "orderName", type: "string" }, { name: "orderStatus", type: "string" }], display: { title: "orderName", sub: "orderStatus" } },
    { tab: "suppliers", plural: "suppliers", singular: "Supplier", pascal: "Supplier", db: "rtlSuppliers", fields: [{ name: "supplierKey", type: "string" }, { name: "supplierName", type: "string" }, { name: "supplierType", type: "string" }], display: { title: "supplierName", sub: "supplierType" } },
    { tab: "customerProfiles", plural: "customerProfiles", singular: "CustomerProfile", pascal: "CustomerProfile", db: "rtlCustomerProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" } },
    { tab: "loyaltyPrograms", plural: "loyaltyPrograms", singular: "LoyaltyProgram", pascal: "LoyaltyProgram", db: "rtlLoyaltyPrograms", fields: [{ name: "programKey", type: "string" }, { name: "programName", type: "string" }, { name: "programType", type: "string" }], display: { title: "programName", sub: "programType" } },
    { tab: "rewardPoints", plural: "rewardPoints", singular: "RewardPoint", pascal: "RewardPoint", db: "rtlRewardPoints", fields: [{ name: "pointsKey", type: "string" }, { name: "pointsName", type: "string" }, { name: "pointsBalance", type: "number" }], display: { title: "pointsName", sub: "pointsBalance" } },
    { tab: "campaigns", plural: "campaigns", singular: "Campaign", pascal: "Campaign", db: "rtlCampaigns", fields: [{ name: "campaignKey", type: "string" }, { name: "campaignName", type: "string" }, { name: "campaignStatus", type: "string" }], display: { title: "campaignName", sub: "campaignStatus" } },
    { tab: "dailyClosings", plural: "dailyClosings", singular: "DailyClosing", pascal: "DailyClosing", db: "rtlDailyClosings", fields: [{ name: "closingKey", type: "string" }, { name: "closingName", type: "string" }, { name: "closingAmount", type: "number" }], display: { title: "closingName", sub: "closingAmount" } },
    { tab: "branchPerformance", plural: "branchPerformance", singular: "BranchPerformance", pascal: "BranchPerformance", db: "rtlBranchPerformance", fields: [{ name: "performanceKey", type: "string" }, { name: "performanceName", type: "string" }, { name: "performanceScore", type: "number" }], display: { title: "performanceName", sub: "performanceScore" } },
    { tab: "commissionRecords", plural: "commissionRecords", singular: "CommissionRecord", pascal: "CommissionRecord", db: "rtlCommissionRecords", fields: [{ name: "commissionKey", type: "string" }, { name: "commissionName", type: "string" }, { name: "commissionAmount", type: "number" }], display: { title: "commissionName", sub: "commissionAmount" } },
    { tab: "salesAnalytics", plural: "salesAnalytics", singular: "SalesAnalytics", pascal: "SalesAnalytics", db: "rtlSalesAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "inventoryAnalytics", plural: "inventoryAnalytics", singular: "InventoryAnalytics", pascal: "InventoryAnalytics", db: "rtlInventoryAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "profitabilityAnalytics", plural: "profitabilityAnalytics", singular: "ProfitabilityAnalytics", pascal: "ProfitabilityAnalytics", db: "rtlProfitabilityAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "retailMetrics", plural: "retailMetrics", singular: "RetailMetric", pascal: "RetailMetric", db: "rtlRetailMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "revenueTotal", type: "number" }, { name: "overallRetailScore", type: "number" }], display: { title: "metricsKey", sub: "overallRetailScore" } },
    { tab: "retailHealth", plural: "retailHealth", singular: "RetailHealth", pascal: "RetailHealth", db: "rtlRetailHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: "rtlExecutiveKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" } },
    { tab: "retailFailures", plural: "retailFailures", singular: "RetailFailure", pascal: "RetailFailure", db: "rtlRetailFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const RTL_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const REGISTER_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
    { value: "offline", label: "Offline" },
] as const;

export const PROMOTION_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const SALES_ORDER_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const RETURN_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "processed", label: "Processed" },
] as const;

export const POS_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const RTL_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "waiting", label: "Waiting" },
    { value: "completed", label: "Completed" },
    { value: "available", label: "Available" },
] as const;

export const RTL_PERMISSIONS = ["rtl.view", "rtl.manage", "rtl.approve", "rtl.admin"] as const;


export const RTL_THEME = {
    primary: "lime-600",
    primaryHover: "lime-500",
    ring: "lime-500/20",
    text: "text-lime-600",
    textDark: "dark:text-lime-400",
    bg: "bg-lime-600",
    bgHover: "hover:bg-lime-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    retailHubId: z.string().min(1),`;
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
    "buildRetailHubLookupMaps", "buildRtlAuditPayload", "buildRtlDashboardStats", "buildRtlPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapRetailBrandForStats", "mapCustomerProfileForStats", "mapRetailMetricForStats", "mapSalesOrderForStats", "mapRetailInvoiceForStats", "mapWarehouseForStats", "mapRetailHealthForStats", "mapRetailFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "RtlDashboardStats", "RtlPipelineInfo", "RtlSdkRegisterFormInput", "RtlSdkRegisterFormResult", "RtlSdkConfigureValidationInput", "RtlSdkConfigureValidationResult", "RtlSdkRunFormSubmissionInput", "RtlSdkRunFormSubmissionResult"]).join(",\n    ");

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
        await databaseService.rtlAuditLogs.create(buildRtlAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/retail.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/retail-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/retail/types";

export class RetailService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const retailHubs = await databaseService.rtlRetailHubs.listByOrganization(organizationId);
        return buildRetailHubLookupMaps(retailHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<RtlDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildRtlDashboardStats({ retailHubs: [], retailBrands: [], customerProfiles: [], retailMetrics: [], salesOrders: [], retailInvoices: [], warehouses: [], retailHealth: [], retailFailures: [], auditLogs: [] });
        const [retailHubs, retailBrandsRaw, customerProfilesRaw, retailMetricsRaw, salesOrdersRaw, retailInvoicesRaw, warehousesRaw, retailHealthRaw, retailFailures, auditLogs] = await Promise.all([
            this.getRetailHubs(authUserId, email, fullName),
            databaseService.rtlCampuses.listByOrganization(context.organizationId),
            databaseService.rtlAdmissions.listByOrganization(context.organizationId),
            databaseService.rtlRetailMetrics.listByOrganization(context.organizationId),
            databaseService.rtlExaminations.listByOrganization(context.organizationId),
            databaseService.rtlFeeInvoices.listByOrganization(context.organizationId),
            databaseService.rtlTeachers.listByOrganization(context.organizationId),
            databaseService.rtlRetailHealth.listByOrganization(context.organizationId),
            this.getRetailFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildRtlDashboardStats({
            retailHubs,
            retailBrands: retailBrandsRaw.map(mapRetailBrandForStats),
            customerProfiles: customerProfilesRaw.map(mapCustomerProfileForStats),
            retailMetrics: retailMetricsRaw.map(mapRetailMetricForStats),
            salesOrders: salesOrdersRaw.map(mapSalesOrderForStats),
            retailInvoices: retailInvoicesRaw.map(mapRetailInvoiceForStats),
            warehouses: warehousesRaw.map(mapWarehouseForStats),
            retailHealth: retailHealthRaw.map(mapRetailHealthForStats),
            retailFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): RtlPipelineInfo {
        return buildRtlPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rtlAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getRetailHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rtlRetailHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterRetailBrand(authUserId: string, email: string, input: RtlSdkRegisterFormInput, fullName?: string | null): Promise<RtlSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_retail_brand", moduleSource: "enterprise_retail_business_os", inputPayload: { ...input } });
        const created = await this.createRetailBrand(authUserId, email, { retailHubId: input.retailHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigureCustomerProfile(authUserId: string, email: string, input: RtlSdkConfigureValidationInput, fullName?: string | null): Promise<RtlSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { retailHubId: input.retailHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunSalesOrderWorkflow(authUserId: string, email: string, input: RtlSdkRunFormSubmissionInput, fullName?: string | null): Promise<RtlSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_sales_order_workflow", moduleSource: "enterprise_retail_business_os", inputPayload: { ...input } });
        const created = await this.createSalesOrder(authUserId, email, { retailHubId: input.retailHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const retailService = new RetailService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "RtlDashboardStats", "RtlPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            retailService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await retailService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useRetail.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { retailService } from "@/src/modules/retail/services/retail.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/retail/types";

export function useRetail() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<RtlDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<RtlPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [retailHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            retailService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(retailService.getPipelineInfo()),
${hookFetchCalls}
            retailService.getAuditLogs(authUserId, email, fullName),
            retailService.getRetailHubOptions(authUserId, email, fullName),
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
        retailHubOptions,
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
    }, e.hubField === false ? {} : { retailHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <RetailHubSelect data={data} {...form.register("retailHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: RetailData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise retail operating system ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
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

writeFileSync(join(mod, "components/RetailPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { RTL_THEME, SALES_ORDER_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/retail/constants";
import type { useRetail } from "@/src/modules/retail/hooks/useRetail";
import {
${schemaImports}
} from "@/src/modules/retail/schemas";

type RetailData = ReturnType<typeof useRetail>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-lime-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-lime-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-lime-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-lime-600">{meta}</p> : null}</div>;
}
function RetailHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.retailHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Retail OS summary" description="System health, background jobs, event bus, retailInvoices, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Retail Hubs" subtitle={\`\${data.stats?.totalRetailHubs ?? 0} total\`} meta={\`\${data.stats?.activeRetailHubs ?? 0} active • \${data.stats?.retailBrandCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.customerProfileCount ?? 0} menu categories\`} meta={\`\${data.stats?.salesOrderCount ?? 0} salesOrders • \${data.stats?.openRetailInvoiceCount ?? 0} open retailInvoices\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallRetailScore ?? 0).toFixed(1)} overall retail score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first retail operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Retail operating system pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Retail operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Retail OS audit history" description="Security-first audit trail for jobs, events, retailInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Retail OS SDK" description="Import from @/src/modules/retail/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createRetailClient()" subtitle="Factory for module-scoped Retail OS client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRegisterRetailBrand()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: enterprise_retail_business_os" />
            <ListCard title="sdkConfigureCustomerProfile()" subtitle="Configure customer profile with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunSalesOrderWorkflow()" subtitle="Run sales order workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {RTL_THEME.primary} • Integration hubs loaded: {data.retailHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createRetailClient } from "@/src/modules/retail/sdk";

const intg = createRetailClient(userId, email, fullName);
await intg.registerCampus({ retailHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureCustomerProfile({ retailHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runSalesOrderWorkflow({ retailHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/RetailStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { RtlDashboardStats } from "@/src/modules/retail/types";

interface RetailStatsProps { stats: RtlDashboardStats | null; }

export function RetailStats({ stats }: RetailStatsProps) {
    const cards = [
        { title: "Retail Hubs", value: String(stats?.totalRetailHubs ?? 0), detail: \`\${stats?.activeRetailHubs ?? 0} active • \${stats?.retailBrandCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.customerProfileCount ?? 0), detail: \`\${stats?.salesOrderCount ?? 0} salesOrders • \${stats?.openRetailInvoiceCount ?? 0} open retailInvoices\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallRetailScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, retailInvoices, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-lime-600 dark:[&_p:last-child]:text-lime-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "RetailOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "RetailAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "RetailSdkPanel" },
];

writeFileSync(join(mod, "components/RetailPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    ${panelImports},
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/retail/components/RetailPanels";
import { RetailStats } from "@/src/modules/retail/components/RetailStats";
import { RTL_TABS } from "@/src/modules/retail/constants";
import { useRetail } from "@/src/modules/retail/hooks/useRetail";

const tabs = [
${tabDefs.map((t) => `    { id: RTL_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function RetailPage() {
    const retail = useRetail();
    const [activeTab, setActiveTab] = useState<(typeof RTL_TABS)[keyof typeof RTL_TABS]>(RTL_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Retail OS" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-lime-600">V2 Program A Program B Sprint 9</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Retail OS</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Retail OS SDK.
                </p>
            </motion.header>
            <RetailStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-lime-600 text-white" : "border border-slate-200 text-slate-600 hover:border-lime-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === RTL_TABS.${t.id} ? <${t.panel} data={retail} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { retailService } from "@/src/modules/retail/services/retail.service";
import type { RtlSdkRegisterFormInput, RtlSdkConfigureValidationInput, RtlSdkRunFormSubmissionInput } from "@/src/modules/retail/types";

export class RetailClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerCampus(input: RtlSdkConnectServiceInput) {
        return retailService.sdkRegisterRetailBrand(this.authUserId, this.email, input, this.fullName);
    }

    async configureCustomerProfile(input: RtlSdkIssueApiKeyInput) {
        return retailService.sdkConfigureCustomerProfile(this.authUserId, this.email, input, this.fullName);
    }

    async runSalesOrderWorkflow(input: RtlSdkRegisterWebhookInput) {
        return retailService.sdkRunSalesOrderWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getRetailHubs() {
        return retailService.getRetailHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return retailService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return retailService.getPipelineInfo();
    }
}

export function createRetailClient(authUserId: string, email: string, fullName?: string | null): RetailClient {
    return new RetailClient(authUserId, email, fullName);
}

export { retailService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { RetailPage } from "@/src/modules/retail/components/RetailPage";
export { RetailStats } from "@/src/modules/retail/components/RetailStats";
export { retailService } from "@/src/modules/retail/services/retail.service";
export { useRetail } from "@/src/modules/retail/hooks/useRetail";
export { createRetailClient, RetailClient } from "@/src/modules/retail/sdk";
export * from "@/src/modules/retail/types";
export * from "@/src/modules/retail/constants";
`);

console.log(`Generated retail operating system module files. RTL_TABS count: ${tabs.length}`);
