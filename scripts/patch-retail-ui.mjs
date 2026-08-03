#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-hospital-ui.mjs");
const outPath = join(root, "scripts/generate-retail-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
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
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/hospital"\);/, 'const mod = join(root, "src/modules/retail");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/hospitalHubs/g, "retailHubs"],
    [/hospitalHubOptions/g, "retailHubOptions"],
    [/getHospitalHubs/g, "getRetailHubs"],
    [/getHospitalHubOptions/g, "getRetailHubOptions"],
    [/HospitalHubSelect/g, "RetailHubSelect"],
    [/buildHospitalHubLookupMaps/g, "buildRetailHubLookupMaps"],
    [/hospitalHubId/g, "retailHubId"],
    [/Hospital Hubs/g, "Retail Hubs"],
    [/Hospital OS/g, "Retail OS"],
    [/hospital hub/g, "retail hub"],
    [/hospital/g, "retail"],
    [/Hospital/g, "Retail"],
    [/buildHsp/g, "buildRtl"],
    [/mapHsp/g, "mapRtl"],
    [/HspDashboardStats/g, "RtlDashboardStats"],
    [/HspPipelineInfo/g, "RtlPipelineInfo"],
    [/HspSdk/g, "RtlSdk"],
    [/HSP_TABS/g, "RTL_TABS"],
    [/HSP_THEME/g, "RTL_THEME"],
    [/HSP_PERMISSIONS/g, "RTL_PERMISSIONS"],
    [/HSP_STATUS_OPTIONS/g, "RTL_STATUS_OPTIONS"],
    [/Program B Sprint 8/g, "Program B Sprint 9"],
    [/cyan-600/g, "lime-600"],
    [/cyan-500/g, "lime-500"],
    [/cyan-400/g, "lime-400"],
    [/cyan-300/g, "lime-300"],
    [/ring-cyan/g, "ring-lime"],
    [/bg-cyan/g, "bg-lime"],
    [/text-cyan/g, "text-lime"],
    [/hover:bg-cyan/g, "hover:bg-lime"],
    [/hover:border-cyan/g, "hover:border-lime"],
    [/mapCampusForStats/g, "mapRetailBrandForStats"],
    [/mapPatientRegistrationForStats/g, "mapCustomerProfileForStats"],
    [/mapHospitalMetricForStats/g, "mapRetailMetricForStats"],
    [/mapAppointmentForStats/g, "mapSalesOrderForStats"],
    [/mapHospitalInvoiceForStats/g, "mapPosTransactionForStats"],
    [/mapPharmacyInventoryForStats/g, "mapWarehouseForStats"],
    [/mapHospitalHealthForStats/g, "mapRetailHealthForStats"],
    [/mapHospitalFailureForStats/g, "mapRetailFailureForStats"],
    [/campuses/g, "retailBrands"],
    [/patientRegistrations/g, "customerProfiles"],
    [/appointments/g, "salesOrders"],
    [/hospitalInvoices/g, "posTransactions"],
    [/pharmacyInventory/g, "warehouses"],
    [/hospitalMetrics/g, "retailMetrics"],
    [/hospitalHealth/g, "retailHealth"],
    [/hospitalFailures/g, "retailFailures"],
    [/totalHospitalHubs/g, "totalRetailHubs"],
    [/activeHospitalHubs/g, "activeRetailHubs"],
    [/campusCount/g, "retailBrandCount"],
    [/patientRegistrationCount/g, "customerProfileCount"],
    [/appointmentCount/g, "salesOrderCount"],
    [/openHospitalInvoiceCount/g, "openPosTransactionCount"],
    [/overallHospitalScore/g, "overallRetailScore"],
    [/admissionsCountScore/g, "revenueTotalScore"],
    [/bedOccupancyRateScore/g, "profitTotalScore"],
    [/departmentPerformanceScore/g, "salesCountScore"],
    [/patientSatisfactionScore/g, "customerRetentionRateScore"],
    [/revenueTotalScore/g, "revenueTotalScore"],
    [/sdkRegisterCampus/g, "sdkRegisterRetailBrand"],
    [/sdkConfigurePatientRegistration/g, "sdkConfigureCustomerProfile"],
    [/sdkRunAppointmentWorkflow/g, "sdkRunSalesOrderWorkflow"],
    [/configurePatientRegistration/g, "configureCustomerProfile"],
    [/runAppointmentWorkflow/g, "runSalesOrderWorkflow"],
    [/createCampus/g, "createRetailBrand"],
    [/createPatientRegistration/g, "createCustomerProfile"],
    [/createAppointment/g, "createSalesOrder"],
    [/Configure patient registration/g, "Configure customer profile"],
    [/Run appointment workflow/g, "Run sales order workflow"],
    [/campuses, patient registrations, appointments, pharmacy inventory, hospital invoices, and patient profiles/g, "retail brands, customer profiles, sales orders, warehouses, POS transactions, and product catalogs"],
    [/Campuses, patient registrations, appointments, pharmacy inventory, hospital invoices, patient profiles, and hospital business operating system outputs/g, "Retail brands, customer profiles, sales orders, warehouses, POS transactions, product catalogs, and retail business operating system outputs"],
    [/enterprise_hospital_business_os/g, "enterprise_retail_business_os"],
    [/register_campus/g, "register_retail_brand"],
    [/run_appointment_workflow/g, "run_sales_order_workflow"],
    [/"hsp\.view"/g, '"rtl.view"'],
    [/"hsp\.manage"/g, '"rtl.manage"'],
    [/"hsp\.approve"/g, '"rtl.approve"'],
    [/"hsp\.admin"/g, '"rtl.admin"'],
    [/hspHospitalHubs/g, "rtlRetailHubs"],
    [/getHospitalFailures/g, "getRetailFailures"],
    [/hospital-mappers/g, "retail-mappers"],
    [/buildHospitalHubPayload/g, "buildRetailHubPayload"],
    [/mapHospitalHubSummary/g, "mapRetailHubSummary"],
    [/buildHspAuditPayload/g, "buildRtlAuditPayload"],
    [/createHospitalClient/g, "createRetailClient"],
    [/HospitalClient/g, "RetailClient"],
    [/databaseService\.hsp/g, "databaseService.rtl"],
    [/useHospital/g, "useRetail"],
    [/HospitalPage/g, "RetailPage"],
    [/HospitalStats/g, "RetailStats"],
    [/HospitalPanels/g, "RetailPanels"],
    [/hospitalService/g, "retailService"],
    [/HospitalService/g, "RetailService"],
    [/\/hospital\/page/g, "/retail/page"],
    [/app\/\(shell\)\/hospital/g, "app/(shell)/retail"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.rtlRetailBrands\.listByOrganization/g, "databaseService.rtlRetailBrands.listByOrganization");
s = s.replace(/databaseService\.rtlDepartments\.listByOrganization/g, "databaseService.rtlStores.listByOrganization");
s = s.replace(/databaseService\.rtlWards\.listByOrganization/g, "databaseService.rtlCashRegisters.listByOrganization");
s = s.replace(/databaseService\.rtlHospitalBeds\.listByOrganization/g, "databaseService.rtlStoreDepartments.listByOrganization");
s = s.replace(/databaseService\.rtlCustomerProfiles\.listByOrganization/g, "databaseService.rtlCustomerProfiles.listByOrganization");
s = s.replace(/databaseService\.rtlRetailMetrics\.listByOrganization/g, "databaseService.rtlRetailMetrics.listByOrganization");
s = s.replace(/databaseService\.rtlSalesOrders\.listByOrganization/g, "databaseService.rtlSalesOrders.listByOrganization");
s = s.replace(/databaseService\.rtlPosTransactions\.listByOrganization/g, "databaseService.rtlPosTransactions.listByOrganization");
s = s.replace(/databaseService\.rtlWarehouses\.listByOrganization/g, "databaseService.rtlWarehouses.listByOrganization");
s = s.replace(/databaseService\.rtlStockLevels\.listByOrganization/g, "databaseService.rtlStockLevels.listByOrganization");
s = s.replace(/databaseService\.rtlRetailHealth\.listByOrganization/g, "databaseService.rtlRetailHealth.listByOrganization");
s = s.replace(/databaseService\.rtlRetailHubs\.listByOrganization/g, "databaseService.rtlRetailHubs.listByOrganization");
s = s.replace(/databaseService\.rtlAuditLogs/g, "databaseService.rtlAuditLogs");

s = s.replace(
    /async sdkRegisterRetailBrand\(authUserId: string, email: string, input: RtlSdkRegisterRetailBrandInput[\s\S]*?return \{ campusId: created\.id, campusKey: created\.campusKey, status: created\.status \};\n    \}/,
    `async sdkRegisterRetailBrand(authUserId: string, email: string, input: RtlSdkRegisterRetailBrandInput, fullName?: string | null): Promise<RtlSdkRegisterRetailBrandResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const created = await this.createRetailBrand(authUserId, email, { retailHubId: input.retailHubId, brandKey: input.brandKey, brandName: input.brandName }, fullName);
        return { brandId: created.id, brandKey: created.brandKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkConfigureCustomerProfile\(authUserId: string, email: string, input: RtlSdkConfigureCustomerProfileInput[\s\S]*?return \{ registrationId: created\.id, registrationKey: created\.registrationKey, status: created\.status \};\n    \}/,
    `async sdkConfigureCustomerProfile(authUserId: string, email: string, input: RtlSdkConfigureCustomerProfileInput, fullName?: string | null): Promise<RtlSdkConfigureCustomerProfileResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        const created = await this.createCustomerProfile(authUserId, email, { retailHubId: input.retailHubId, profileKey: input.profileKey, profileName: input.profileName }, fullName);
        return { profileId: created.id, profileKey: created.profileKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkRunSalesOrderWorkflow\(authUserId: string, email: string, input: RtlSdkRunSalesOrderWorkflowInput[\s\S]*?return \{ appointmentId: created\.id, appointmentKey: created\.appointmentKey, status: created\.status \};\n    \}/,
    `async sdkRunSalesOrderWorkflow(authUserId: string, email: string, input: RtlSdkRunSalesOrderWorkflowInput, fullName?: string | null): Promise<RtlSdkRunSalesOrderWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createSalesOrder(authUserId, email, { retailHubId: input.retailHubId, orderKey: input.orderKey, orderName: input.orderName }, fullName);
        return { orderId: created.id, orderKey: created.orderKey, status: created.status };
    }`,
);

const rtlOptionsBlock = `export const REGISTER_STATUS_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const RTL_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const RTL_THEME)/,
    `$1${rtlOptionsBlock}$2`,
);

s = s.replace(/Select retail hub/g, "Select retail hub");
s = s.replace(/REGISTRATION_STATUS_OPTIONS/g, "SALES_ORDER_STATUS_OPTIONS");
s = s.replace(/APPOINTMENT_STATUS_OPTIONS/g, "POS_STATUS_OPTIONS");
s = s.replace(/BED_STATUS_OPTIONS/g, "REGISTER_STATUS_OPTIONS");
s = s.replace(/PRESCRIPTION_STATUS_OPTIONS/g, "PROMOTION_STATUS_OPTIONS");
s = s.replace(/IPD_ADMISSION_STATUS_OPTIONS/g, "RETURN_STATUS_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-retail-ui.mjs");
