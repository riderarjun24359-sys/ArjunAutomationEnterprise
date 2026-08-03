#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-document-engine-ui.mjs");
const outPath = join(root, "scripts/generate-restaurant-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
    { tab: "restaurantHubs", plural: "restaurantHubs", singular: "RestaurantHub", pascal: "RestaurantHub", db: "rstRestaurantHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "brands", plural: "brands", singular: "Brand", pascal: "Brand", db: "rstBrands", fields: [{ name: "brandKey", type: "string" }, { name: "brandName", type: "string" }, { name: "brandType", type: "string" }], display: { title: "brandName", sub: "brandType" } },
    { tab: "branches", plural: "branches", singular: "Branch", pascal: "Branch", db: "rstBranches", fields: [{ name: "branchKey", type: "string" }, { name: "branchName", type: "string" }, { name: "branchAddress", type: "string" }], display: { title: "branchName", sub: "branchAddress" } },
    { tab: "businessLicenses", plural: "businessLicenses", singular: "BusinessLicense", pascal: "BusinessLicense", db: "rstBusinessLicenses", fields: [{ name: "licenseKey", type: "string" }, { name: "licenseName", type: "string" }, { name: "licenseType", type: "string" }], display: { title: "licenseName", sub: "licenseType" } },
    { tab: "diningAreas", plural: "diningAreas", singular: "DiningArea", pascal: "DiningArea", db: "rstDiningAreas", fields: [{ name: "areaKey", type: "string" }, { name: "areaName", type: "string" }, { name: "areaType", type: "string" }], display: { title: "areaName", sub: "areaType" } },
    { tab: "restaurantTables", plural: "restaurantTables", singular: "RestaurantTable", pascal: "RestaurantTable", db: "rstRestaurantTables", fields: [{ name: "tableKey", type: "string" }, { name: "tableName", type: "string" }, { name: "tableStatus", type: "string" }], display: { title: "tableName", sub: "tableStatus" } },
    { tab: "menuCategories", plural: "menuCategories", singular: "MenuCategory", pascal: "MenuCategory", db: "rstMenuCategories", fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" } },
    { tab: "menuItems", plural: "menuItems", singular: "MenuItem", pascal: "MenuItem", db: "rstMenuItems", fields: [{ name: "itemKey", type: "string" }, { name: "itemName", type: "string" }, { name: "itemPrice", type: "number" }], display: { title: "itemName", sub: "itemPrice" } },
    { tab: "menuVariants", plural: "menuVariants", singular: "MenuVariant", pascal: "MenuVariant", db: "rstMenuVariants", fields: [{ name: "variantKey", type: "string" }, { name: "variantName", type: "string" }, { name: "variantType", type: "string" }], display: { title: "variantName", sub: "variantType" } },
    { tab: "addOns", plural: "addOns", singular: "AddOn", pascal: "AddOn", db: "rstAddOns", fields: [{ name: "addonKey", type: "string" }, { name: "addonName", type: "string" }, { name: "addonPrice", type: "number" }], display: { title: "addonName", sub: "addonPrice" } },
    { tab: "comboMeals", plural: "comboMeals", singular: "ComboMeal", pascal: "ComboMeal", db: "rstComboMeals", fields: [{ name: "comboKey", type: "string" }, { name: "comboName", type: "string" }, { name: "comboPrice", type: "number" }], display: { title: "comboName", sub: "comboPrice" } },
    { tab: "orders", plural: "orders", singular: "Order", pascal: "Order", db: "rstOrders", fields: [{ name: "orderKey", type: "string" }, { name: "orderNumber", type: "string" }, { name: "orderType", type: "select", options: "ORDER_TYPE_OPTIONS" }], display: { title: "orderNumber", sub: "orderType" } },
    { tab: "orderItems", plural: "orderItems", singular: "OrderItem", pascal: "OrderItem", db: "rstOrderItems", fields: [{ name: "itemKey", type: "string" }, { name: "itemName", type: "string" }, { name: "itemQuantity", type: "number" }], display: { title: "itemName", sub: "itemQuantity" } },
    { tab: "orderQueue", plural: "orderQueue", singular: "OrderQueue", pascal: "OrderQueue", db: "rstOrderQueue", fields: [{ name: "queueKey", type: "string" }, { name: "queueName", type: "string" }, { name: "queueStatus", type: "string" }], display: { title: "queueName", sub: "queueStatus" } },
    { tab: "kitchenRouting", plural: "kitchenRouting", singular: "KitchenRouting", pascal: "KitchenRouting", db: "rstKitchenRouting", fields: [{ name: "routingKey", type: "string" }, { name: "routingName", type: "string" }, { name: "routingStatus", type: "string" }], display: { title: "routingName", sub: "routingStatus" } },
    { tab: "orderTimeline", plural: "orderTimeline", singular: "OrderTimeline", pascal: "OrderTimeline", db: "rstOrderTimeline", fields: [{ name: "timelineKey", type: "string" }, { name: "timelineEvent", type: "string" }, { name: "timelineStatus", type: "string" }], display: { title: "timelineEvent", sub: "timelineStatus" } },
    { tab: "kitchenStations", plural: "kitchenStations", singular: "KitchenStation", pascal: "KitchenStation", db: "rstKitchenStations", fields: [{ name: "stationKey", type: "string" }, { name: "stationName", type: "string" }, { name: "stationType", type: "string" }], display: { title: "stationName", sub: "stationType" } },
    { tab: "preparationQueue", plural: "preparationQueue", singular: "PreparationQueue", pascal: "PreparationQueue", db: "rstPreparationQueue", fields: [{ name: "prepKey", type: "string" }, { name: "prepName", type: "string" }, { name: "prepStatus", type: "string" }], display: { title: "prepName", sub: "prepStatus" } },
    { tab: "cookingStatus", plural: "cookingStatus", singular: "CookingStatus", pascal: "CookingStatus", db: "rstCookingStatus", fields: [{ name: "cookingKey", type: "string" }, { name: "cookingName", type: "string" }, { name: "cookingStatus", type: "string" }], display: { title: "cookingName", sub: "cookingStatus" } },
    { tab: "readyQueue", plural: "readyQueue", singular: "ReadyQueue", pascal: "ReadyQueue", db: "rstReadyQueue", fields: [{ name: "readyKey", type: "string" }, { name: "readyName", type: "string" }, { name: "readyStatus", type: "string" }], display: { title: "readyName", sub: "readyStatus" } },
    { tab: "rushOrders", plural: "rushOrders", singular: "RushOrder", pascal: "RushOrder", db: "rstRushOrders", fields: [{ name: "rushKey", type: "string" }, { name: "rushName", type: "string" }, { name: "rushPriority", type: "string" }], display: { title: "rushName", sub: "rushPriority" } },
    { tab: "reservations", plural: "reservations", singular: "Reservation", pascal: "Reservation", db: "rstReservations", fields: [{ name: "reservationKey", type: "string" }, { name: "reservationName", type: "string" }, { name: "reservationStatus", type: "string" }], display: { title: "reservationName", sub: "reservationStatus" } },
    { tab: "waitingList", plural: "waitingList", singular: "WaitingList", pascal: "WaitingList", db: "rstWaitingList", fields: [{ name: "waitKey", type: "string" }, { name: "waitName", type: "string" }, { name: "waitStatus", type: "string" }], display: { title: "waitName", sub: "waitStatus" } },
    { tab: "customerProfiles", plural: "customerProfiles", singular: "CustomerProfile", pascal: "CustomerProfile", db: "rstCustomerProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" } },
    { tab: "loyaltyPrograms", plural: "loyaltyPrograms", singular: "LoyaltyProgram", pascal: "LoyaltyProgram", db: "rstLoyaltyPrograms", fields: [{ name: "programKey", type: "string" }, { name: "programName", type: "string" }, { name: "programType", type: "string" }], display: { title: "programName", sub: "programType" } },
    { tab: "feedbackReviews", plural: "feedbackReviews", singular: "FeedbackReview", pascal: "FeedbackReview", db: "rstFeedbackReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "reviewTitle", type: "string" }, { name: "reviewRating", type: "number" }], display: { title: "reviewTitle", sub: "reviewRating" } },
    { tab: "restaurantMetrics", plural: "restaurantMetrics", singular: "RestaurantMetric", pascal: "RestaurantMetric", db: "rstRestaurantMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "orderCount", type: "number" }, { name: "overallRestaurantScore", type: "number" }], display: { title: "metricsKey", sub: "overallRestaurantScore" } },
    { tab: "restaurantHealth", plural: "restaurantHealth", singular: "RestaurantHealth", pascal: "RestaurantHealth", db: "rstRestaurantHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "revenueAnalytics", plural: "revenueAnalytics", singular: "RevenueAnalytics", pascal: "RevenueAnalytics", db: "rstRevenueAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "kitchenPerformance", plural: "kitchenPerformance", singular: "KitchenPerformance", pascal: "KitchenPerformance", db: "rstKitchenPerformance", fields: [{ name: "performanceKey", type: "string" }, { name: "performanceType", type: "string" }, { name: "performanceScore", type: "number" }], display: { title: "performanceKey", sub: "performanceType" } },
    { tab: "restaurantFailures", plural: "restaurantFailures", singular: "RestaurantFailure", pascal: "RestaurantFailure", db: "rstRestaurantFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/document-engine"\);/, 'const mod = join(root, "src/modules/restaurant");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/documentHubs/g, "restaurantHubs"],
    [/documentHubOptions/g, "restaurantHubOptions"],
    [/getDocumentHubs/g, "getRestaurantHubs"],
    [/getDocumentHubOptions/g, "getRestaurantHubOptions"],
    [/DocumentHubSelect/g, "RestaurantHubSelect"],
    [/buildDocumentHubLookupMaps/g, "buildRestaurantHubLookupMaps"],
    [/documentHubId/g, "restaurantHubId"],
    [/Document Hubs/g, "Restaurant Hubs"],
    [/Document Hub/g, "Restaurant OS"],
    [/document hub/g, "restaurant hub"],
    [/document-engine/g, "restaurant"],
    [/documentEngine/g, "restaurant"],
    [/DocumentEngine/g, "Restaurant"],
    [/Document Engine/g, "Restaurant OS"],
    [/document engine/g, "restaurant operating system"],
    [/databaseService\.dde/g, "databaseService.rst"],
    [/buildDde/g, "buildRst"],
    [/mapDde/g, "mapRst"],
    [/DdeDashboardStats/g, "RstDashboardStats"],
    [/DdePipelineInfo/g, "RstPipelineInfo"],
    [/DdeSdk/g, "RstSdk"],
    [/DDE_TABS/g, "RST_TABS"],
    [/DDE_THEME/g, "RST_THEME"],
    [/DDE_PERMISSIONS/g, "RST_PERMISSIONS"],
    [/DDE_STATUS_OPTIONS/g, "RST_STATUS_OPTIONS"],
    [/Program B Sprint 5/g, "Program B Sprint 6"],
    [/fuchsia-600/g, "orange-600"],
    [/fuchsia-500/g, "orange-500"],
    [/fuchsia-400/g, "orange-400"],
    [/fuchsia-300/g, "orange-300"],
    [/ring-fuchsia/g, "ring-orange"],
    [/bg-fuchsia/g, "bg-orange"],
    [/text-fuchsia/g, "text-orange"],
    [/hover:bg-fuchsia/g, "hover:bg-orange"],
    [/hover:border-fuchsia/g, "hover:border-orange"],
    [/mapTemplateSectionForStats/g, "mapDiningAreaForStats"],
    [/mapRetentionPolicyForStats/g, "mapMenuCategoryForStats"],
    [/mapDocumentMetricForStats/g, "mapRestaurantMetricForStats"],
    [/mapPdfGenerationForStats/g, "mapOrderForStats"],
    [/mapPendingSignatureForStats/g, "mapReservationForStats"],
    [/mapElectronicSignatureForStats/g, "mapKitchenStationForStats"],
    [/mapDocumentHealthForStats/g, "mapRestaurantHealthForStats"],
    [/mapDocumentFailureForStats/g, "mapRestaurantFailureForStats"],
    [/templateSections/g, "diningAreas"],
    [/retentionPolicies/g, "menuCategories"],
    [/documentMetrics/g, "restaurantMetrics"],
    [/pdfGenerations/g, "orders"],
    [/pendingSignatures/g, "reservations"],
    [/electronicSignatures/g, "kitchenStations"],
    [/documentHealth/g, "restaurantHealth"],
    [/documentFailures/g, "restaurantFailures"],
    [/totalDocumentHubs/g, "totalRestaurantHubs"],
    [/activeDocumentHubs/g, "activeRestaurantHubs"],
    [/templateSectionCount/g, "diningAreaCount"],
    [/retentionPolicyCount/g, "menuCategoryCount"],
    [/pdfGenerationCount/g, "orderCount"],
    [/openPendingSignatureCount/g, "openReservationCount"],
    [/overallDocumentScore/g, "overallRestaurantScore"],
    [/generatedCountScore/g, "orderCountScore"],
    [/deliverySuccessRateScore/g, "revenueTotalScore"],
    [/failureCountScore/g, "averageBillScore"],
    [/downloadCountScore/g, "occupancyRateScore"],
    [/storageUsageScore/g, "kitchenPerformanceScore"],
    [/sdkRegisterDocument/g, "sdkRegisterBrand"],
    [/sdkConfigureTemplate/g, "sdkConfigureMenu"],
    [/sdkRunDocumentGeneration/g, "sdkRunOrderWorkflow"],
    [/registerDocument/g, "registerBrand"],
    [/configureTemplate/g, "configureMenu"],
    [/runDocumentGeneration/g, "runOrderWorkflow"],
    [/createDocumentType/g, "createBrand"],
    [/createTemplateSection/g, "createMenuCategory"],
    [/createPdfGeneration/g, "createOrder"],
    [/Register document type/g, "Register brand"],
    [/Configure template section/g, "Configure menu category"],
    [/Run document generation/g, "Run order workflow"],
    [/documents, templates, generation jobs, signatures, and deliveries/g, "brands, menus, orders, kitchen stations, reservations, and customer profiles"],
    [/Documents, templates, generation jobs, signatures, deliveries, and dynamic document engine outputs/g, "Brands, menus, orders, kitchen stations, reservations, customer profiles, and restaurant business operating system outputs"],
    [/Document engine pipeline/g, "Restaurant operating system pipeline"],
    [/Generated document engine/g, "Generated restaurant module"],
    [/Enterprise dynamic document engine: document registry, template engine, generation engine, digital signature, storage engine, delivery engine, document analytics, and document dashboard with security-first audit and the shared Document Engine SDK\./g,
        "Enterprise restaurant business operating system: restaurant foundation, menu engine, order engine, kitchen engine, customer engine, restaurant analytics, and restaurant dashboard with security-first audit and shared IFR/BPF/DFE/DWE/DDE framework SDKs."],
    [/document registration, template configuration, and document generation/g, "brand registration, menu configuration, and order workflow execution"],
    [/register_document/g, "register_brand"],
    [/run_document_generation/g, "run_order_workflow"],
    [/"dde\.view"/g, '"rst.view"'],
    [/"dde\.manage"/g, '"rst.manage"'],
    [/"dde\.approve"/g, '"rst.approve"'],
    [/"dde\.admin"/g, '"rst.admin"'],
    [/dynamic_document_engine/g, "enterprise_restaurant_business_os"],
    [/moduleSource: dynamic_document_engine/g, "moduleSource: enterprise_restaurant_business_os"],
    [/template sections/g, "dining areas"],
    [/retention policies/g, "menu categories"],
    [/pdf generations/g, "orders"],
    [/open pending signatures/g, "open reservations"],
    [/overall document score/g, "overall restaurant score"],
    [/Document Engine summary/g, "Restaurant OS summary"],
    [/Security-first document engine/g, "Security-first restaurant operating system"],
    [/ddeDocumentHubs/g, "rstRestaurantHubs"],
    [/getDocumentFailures/g, "getRestaurantFailures"],
    [/document-engine-mappers/g, "restaurant-mappers"],
    [/buildDocumentHubPayload/g, "buildRestaurantHubPayload"],
    [/mapDocumentHubSummary/g, "mapRestaurantHubSummary"],
    [/buildDdeAuditPayload/g, "buildRstAuditPayload"],
    [/Enterprise Document Engine/g, "Enterprise Restaurant OS"],
    [/createDocumentEngineClient/g, "createRestaurantClient"],
    [/DocumentEngineClient/g, "RestaurantClient"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.rstDocumentTypes\.listByOrganization/g, "databaseService.rstBrands.listByOrganization");
s = s.replace(/databaseService\.rstTemplateSections\.listByOrganization/g, "databaseService.rstDiningAreas.listByOrganization");
s = s.replace(/databaseService\.rstRetentionPolicies\.listByOrganization/g, "databaseService.rstMenuCategories.listByOrganization");
s = s.replace(/databaseService\.rstDocumentMetrics\.listByOrganization/g, "databaseService.rstRestaurantMetrics.listByOrganization");
s = s.replace(/databaseService\.rstPdfGenerations\.listByOrganization/g, "databaseService.rstOrders.listByOrganization");
s = s.replace(/databaseService\.rstPendingSignatures\.listByOrganization/g, "databaseService.rstReservations.listByOrganization");
s = s.replace(/databaseService\.rstElectronicSignatures\.listByOrganization/g, "databaseService.rstKitchenStations.listByOrganization");
s = s.replace(/databaseService\.rstDocumentHealth\.listByOrganization/g, "databaseService.rstRestaurantHealth.listByOrganization");
s = s.replace(/databaseService\.rstDocumentHubs\.listByOrganization/g, "databaseService.rstRestaurantHubs.listByOrganization");
s = s.replace(/databaseService\.rstAuditLogs/g, "databaseService.rstAuditLogs");

const frameworkImports = `import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";`;

s = s.replace(
    /import { createAiOrchestrationClient } from "@\/src\/modules\/ai-orchestration\/sdk";\nimport { createKnowledgeClient } from "@\/src\/modules\/knowledge\/sdk";/,
    frameworkImports,
);

s = s.replace(
    /async sdkRegisterBrand\(authUserId: string, email: string, input: RstSdkRegisterDocumentInput[\s\S]*?return \{ typeId: created\.id, typeKey: created\.typeKey, status: created\.status \};\n    \}/,
    `async sdkRegisterBrand(authUserId: string, email: string, input: RstSdkRegisterBrandInput, fullName?: string | null): Promise<RstSdkRegisterBrandResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const created = await this.createBrand(authUserId, email, { restaurantHubId: input.restaurantHubId, brandKey: input.brandKey, brandName: input.brandName }, fullName);
        return { brandId: created.id, brandKey: created.brandKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkConfigureMenu\(authUserId: string, email: string, input: RstSdkConfigureTemplateInput[\s\S]*?return \{ sectionId: created\.id, sectionKey: created\.sectionKey, status: created\.status \};\n    \}/,
    `async sdkConfigureMenu(authUserId: string, email: string, input: RstSdkConfigureMenuInput, fullName?: string | null): Promise<RstSdkConfigureMenuResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        const created = await this.createMenuCategory(authUserId, email, { restaurantHubId: input.restaurantHubId, categoryKey: input.categoryKey, categoryName: input.categoryName }, fullName);
        return { categoryId: created.id, categoryKey: created.categoryKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkRunOrderWorkflow\(authUserId: string, email: string, input: RstSdkRunDocumentGenerationInput[\s\S]*?return \{ generationId: created\.id, generationKey: created\.generationKey, status: created\.status \};\n    \}/,
    `async sdkRunOrderWorkflow(authUserId: string, email: string, input: RstSdkRunOrderWorkflowInput, fullName?: string | null): Promise<RstSdkRunOrderWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createOrder(authUserId, email, { restaurantHubId: input.restaurantHubId, orderKey: input.orderKey, orderNumber: input.orderNumber }, fullName);
        return { orderId: created.id, orderKey: created.orderKey, status: created.status };
    }`,
);

const rstOptionsBlock = `export const ORDER_TYPE_OPTIONS = [
    { value: "dine-in", label: "Dine In" },
    { value: "takeaway", label: "Takeaway" },
    { value: "delivery", label: "Delivery" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const RST_STATUS_OPTIONS = [
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

export const RST_PERMISSIONS = ["rst.view", "rst.manage", "rst.approve", "rst.admin"] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const RST_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const RST_THEME)/,
    `$1${rstOptionsBlock}$2`,
);

s = s.replace(/Select document hub/g, "Select restaurant hub");
s = s.replace(/RELEASE_CHANNEL_OPTIONS/g, "ORDER_TYPE_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-restaurant-ui.mjs");
