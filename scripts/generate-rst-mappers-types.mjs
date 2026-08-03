#!/usr/bin/env node
/**
 * Generates restaurant-mappers.ts and types/index.ts for Program B Sprint 6.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "RestaurantHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "Brand", key: "brand_key", title: "brand_name", sub: "brand_type", hub: true, orgOnly: false, createFields: ["brandKey", "brandName", "brandType"] },
    { pascal: "Branch", key: "branch_key", title: "branch_name", sub: "branch_address", hub: true, orgOnly: false, createFields: ["branchKey", "branchName", "branchAddress"] },
    { pascal: "BusinessLicense", key: "license_key", title: "license_name", sub: "license_type", hub: true, orgOnly: false, createFields: ["licenseKey", "licenseName", "licenseType"] },
    { pascal: "DiningArea", key: "area_key", title: "area_name", sub: "area_type", hub: true, orgOnly: false, createFields: ["areaKey", "areaName", "areaType"] },
    { pascal: "RestaurantTable", key: "table_key", title: "table_name", sub: "table_status", hub: true, orgOnly: false, createFields: ["tableKey", "tableName", "tableStatus"] },
    { pascal: "MenuCategory", key: "category_key", title: "category_name", sub: "category_type", hub: true, orgOnly: false, createFields: ["categoryKey", "categoryName", "categoryType"] },
    { pascal: "MenuItem", key: "item_key", title: "item_name", sub: "item_price", hub: true, orgOnly: false, createFields: ["itemKey", "itemName", "itemPrice"] },
    { pascal: "MenuVariant", key: "variant_key", title: "variant_name", sub: "variant_type", hub: true, orgOnly: false, createFields: ["variantKey", "variantName", "variantType"] },
    { pascal: "AddOn", key: "addon_key", title: "addon_name", sub: "addon_price", hub: true, orgOnly: false, createFields: ["addonKey", "addonName", "addonPrice"] },
    { pascal: "ComboMeal", key: "combo_key", title: "combo_name", sub: "combo_price", hub: true, orgOnly: false, createFields: ["comboKey", "comboName", "comboPrice"] },
    { pascal: "Order", key: "order_key", title: "order_number", sub: "order_type", hub: true, orgOnly: false, createFields: ["orderKey", "orderNumber", "orderType"] },
    { pascal: "OrderItem", key: "item_key", title: "item_name", sub: "item_quantity", hub: true, orgOnly: false, createFields: ["itemKey", "itemName", "itemQuantity"] },
    { pascal: "OrderQueue", key: "queue_key", title: "queue_name", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueName", "queueStatus"] },
    { pascal: "KitchenRouting", key: "routing_key", title: "routing_name", sub: "routing_status", hub: true, orgOnly: false, createFields: ["routingKey", "routingName", "routingStatus"] },
    { pascal: "OrderTimeline", key: "timeline_key", title: "timeline_event", sub: "timeline_status", hub: true, orgOnly: false, createFields: ["timelineKey", "timelineEvent", "timelineStatus"] },
    { pascal: "KitchenStation", key: "station_key", title: "station_name", sub: "station_type", hub: true, orgOnly: false, createFields: ["stationKey", "stationName", "stationType"] },
    { pascal: "PreparationQueue", key: "prep_key", title: "prep_name", sub: "prep_status", hub: true, orgOnly: false, createFields: ["prepKey", "prepName", "prepStatus"] },
    { pascal: "CookingStatus", key: "cooking_key", title: "cooking_name", sub: "cooking_status", hub: true, orgOnly: false, createFields: ["cookingKey", "cookingName", "cookingStatus"] },
    { pascal: "ReadyQueue", key: "ready_key", title: "ready_name", sub: "ready_status", hub: true, orgOnly: false, createFields: ["readyKey", "readyName", "readyStatus"] },
    { pascal: "RushOrder", key: "rush_key", title: "rush_name", sub: "rush_priority", hub: true, orgOnly: false, createFields: ["rushKey", "rushName", "rushPriority"] },
    { pascal: "Reservation", key: "reservation_key", title: "reservation_name", sub: "reservation_status", hub: true, orgOnly: false, createFields: ["reservationKey", "reservationName", "reservationStatus"] },
    { pascal: "WaitingList", key: "wait_key", title: "wait_name", sub: "wait_status", hub: true, orgOnly: false, createFields: ["waitKey", "waitName", "waitStatus"] },
    { pascal: "CustomerProfile", key: "profile_key", title: "profile_name", sub: "profile_type", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileType"] },
    { pascal: "LoyaltyProgram", key: "program_key", title: "program_name", sub: "program_type", hub: true, orgOnly: false, createFields: ["programKey", "programName", "programType"] },
    { pascal: "FeedbackReview", key: "review_key", title: "review_title", sub: "review_rating", hub: true, orgOnly: false, createFields: ["reviewKey", "reviewTitle", "reviewRating"] },
    { pascal: "RestaurantMetric", key: "metrics_key", title: "metrics_key", sub: "overall_restaurant_score", hub: false, orgOnly: true, createFields: ["metricsKey", "orderCount", "overallRestaurantScore"] },
    { pascal: "RestaurantHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "RevenueAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "KitchenPerformance", key: "performance_key", title: "performance_key", sub: "performance_type", hub: true, orgOnly: false, createFields: ["performanceKey", "performanceType", "performanceScore"] },
    { pascal: "RestaurantFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "itemPrice", "addonPrice", "comboPrice", "itemQuantity", "reviewRating", "analyticsScore", "performanceScore",
    "orderCount", "overallRestaurantScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface RstDashboardStats {
    totalRestaurantHubs: number;
    activeRestaurantHubs: number;
    diningAreaCount: number;
    menuCategoryCount: number;
    orderCount: number;
    openReservationCount: number;
    openFailureCount: number;
    overallRestaurantScore: number;
    orderCountScore: number;
    revenueTotalScore: number;
    averageBillScore: number;
    occupancyRateScore: number;
    kitchenPerformanceScore: number;
    auditCount: number;
}

export interface RstPipelineInfo {
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

export interface RstSdkRegisterBrandInput { restaurantHubId: string; brandKey?: string; brandName?: string; }
export interface RstSdkRegisterBrandResult { brandId: string; brandKey: string; status: string; }
export interface RstSdkConfigureMenuInput { restaurantHubId: string; categoryKey?: string; categoryName?: string; }
export interface RstSdkConfigureMenuResult { categoryId: string; categoryKey: string; status: string; }
export interface RstSdkRunOrderWorkflowInput { restaurantHubId: string; orderKey?: string; orderNumber?: string; }
export interface RstSdkRunOrderWorkflowResult { orderId: string; orderKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "RestaurantHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    restaurantHubId: string;\n    ";
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
    const dbImports = entities.map((e) => `DbRst${e.pascal}`).concat(["DbRstAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["RstDashboardStats", "RstPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/restaurant/types";

export function buildRestaurantHubLookupMaps(hubs: DbRstRestaurantHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildRstPipelineInfo(): RstPipelineInfo {
    const stages = [
        { key: "foundation", label: "Foundation" },
        { key: "menu", label: "Menu" },
        { key: "orders", label: "Orders" },
        { key: "kitchen", label: "Kitchen" },
        { key: "customer", label: "Customer" },
    ];
    return { stages, currentStage: "orders", nextStage: "kitchen", previousStage: "menu" };
}

export function buildRstAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbRstAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "RestaurantHub";
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
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.restaurantHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbRst${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
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

    m += `export function mapDiningAreaForStats(r: DbRstDiningArea) { return { status: r.status }; }
export function mapMenuCategoryForStats(r: DbRstMenuCategory) { return { status: r.status }; }
export function mapRestaurantMetricForStats(r: DbRstRestaurantMetric) {
    return {
        order_count: r.order_count,
        revenue_total: r.revenue_total,
        average_bill: r.average_bill,
        occupancy_rate: r.occupancy_rate,
        kitchen_performance_score: r.kitchen_performance_score,
        overall_restaurant_score: r.overall_restaurant_score,
        status: r.status,
    };
}
export function mapOrderForStats(r: DbRstOrder) { return { order_type: r.order_type, status: r.status }; }
export function mapReservationForStats(r: DbRstReservation) { return { status: r.status }; }
export function mapKitchenStationForStats(r: DbRstKitchenStation) { return { status: r.status }; }
export function mapRestaurantHealthForStats(r: DbRstRestaurantHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapRestaurantFailureForStats(r: DbRstRestaurantFailure) { return { status: r.status }; }

export function buildRstDashboardStats(input: {
    restaurantHubs: RestaurantHubSummary[];
    diningAreas: ReturnType<typeof mapDiningAreaForStats>[];
    menuCategories: ReturnType<typeof mapMenuCategoryForStats>[];
    restaurantMetrics: ReturnType<typeof mapRestaurantMetricForStats>[];
    orders: ReturnType<typeof mapOrderForStats>[];
    reservations: ReturnType<typeof mapReservationForStats>[];
    kitchenStations: ReturnType<typeof mapKitchenStationForStats>[];
    restaurantHealth: ReturnType<typeof mapRestaurantHealthForStats>[];
    restaurantFailures: RestaurantFailureSummary[];
    auditLogs: AuditEntry[];
}): RstDashboardStats {
    const activeHubs = input.restaurantHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.restaurantMetrics[0];
    const latestHealth = input.restaurantHealth[0];
    return {
        totalRestaurantHubs: input.restaurantHubs.length,
        activeRestaurantHubs: activeHubs,
        diningAreaCount: input.diningAreas.length,
        menuCategoryCount: input.menuCategories.length,
        orderCount: input.orders.length,
        openReservationCount: input.reservations.filter((r) => r.status === "open" || r.status === "pending").length,
        openFailureCount: input.restaurantFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallRestaurantScore: latestMetrics?.overall_restaurant_score ?? latestHealth?.overall_score ?? 0,
        orderCountScore: latestMetrics?.order_count ?? 0,
        revenueTotalScore: latestMetrics?.revenue_total ?? 0,
        averageBillScore: latestMetrics?.average_bill ?? 0,
        occupancyRateScore: latestMetrics?.occupancy_rate ?? 0,
        kitchenPerformanceScore: latestMetrics?.kitchen_performance_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/restaurant/types"), { recursive: true });
writeFileSync(join(root, "src/modules/restaurant/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/restaurant-mappers.ts"), buildMappers(), "utf8");
console.log("Generated RST types and mappers");
