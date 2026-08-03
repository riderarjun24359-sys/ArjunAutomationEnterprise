#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/restaurant");

const entities = [
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
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const RST_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const ORDER_TYPE_OPTIONS = [
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


export const RST_THEME = {
    primary: "orange-600",
    primaryHover: "orange-500",
    ring: "orange-500/20",
    text: "text-orange-600",
    textDark: "dark:text-orange-400",
    bg: "bg-orange-600",
    bgHover: "hover:bg-orange-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    restaurantHubId: z.string().min(1),`;
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
    "buildRestaurantHubLookupMaps", "buildRstAuditPayload", "buildRstDashboardStats", "buildRstPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapDiningAreaForStats", "mapMenuCategoryForStats", "mapRestaurantMetricForStats", "mapOrderForStats", "mapReservationForStats", "mapKitchenStationForStats", "mapRestaurantHealthForStats", "mapRestaurantFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "RstDashboardStats", "RstPipelineInfo", "RstSdkRegisterFormInput", "RstSdkRegisterFormResult", "RstSdkConfigureValidationInput", "RstSdkConfigureValidationResult", "RstSdkRunFormSubmissionInput", "RstSdkRunFormSubmissionResult"]).join(",\n    ");

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
        await databaseService.rstAuditLogs.create(buildRstAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/restaurant.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/restaurant-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/restaurant/types";

export class RestaurantService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const restaurantHubs = await databaseService.rstRestaurantHubs.listByOrganization(organizationId);
        return buildRestaurantHubLookupMaps(restaurantHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<RstDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildRstDashboardStats({ restaurantHubs: [], diningAreas: [], menuCategories: [], restaurantMetrics: [], orders: [], reservations: [], kitchenStations: [], restaurantHealth: [], restaurantFailures: [], auditLogs: [] });
        const [restaurantHubs, diningAreasRaw, menuCategoriesRaw, restaurantMetricsRaw, ordersRaw, reservationsRaw, kitchenStationsRaw, restaurantHealthRaw, restaurantFailures, auditLogs] = await Promise.all([
            this.getRestaurantHubs(authUserId, email, fullName),
            databaseService.rstDiningAreas.listByOrganization(context.organizationId),
            databaseService.rstMenuCategories.listByOrganization(context.organizationId),
            databaseService.rstRestaurantMetrics.listByOrganization(context.organizationId),
            databaseService.rstOrders.listByOrganization(context.organizationId),
            databaseService.rstReservations.listByOrganization(context.organizationId),
            databaseService.rstKitchenStations.listByOrganization(context.organizationId),
            databaseService.rstRestaurantHealth.listByOrganization(context.organizationId),
            this.getRestaurantFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildRstDashboardStats({
            restaurantHubs,
            diningAreas: diningAreasRaw.map(mapDiningAreaForStats),
            menuCategories: menuCategoriesRaw.map(mapMenuCategoryForStats),
            restaurantMetrics: restaurantMetricsRaw.map(mapRestaurantMetricForStats),
            orders: ordersRaw.map(mapOrderForStats),
            reservations: reservationsRaw.map(mapReservationForStats),
            kitchenStations: kitchenStationsRaw.map(mapKitchenStationForStats),
            restaurantHealth: restaurantHealthRaw.map(mapRestaurantHealthForStats),
            restaurantFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): RstPipelineInfo {
        return buildRstPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rstAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getRestaurantHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.rstRestaurantHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterBrand(authUserId: string, email: string, input: RstSdkRegisterFormInput, fullName?: string | null): Promise<RstSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_brand", moduleSource: "enterprise_restaurant_business_os", inputPayload: { ...input } });
        const created = await this.createBrand(authUserId, email, { restaurantHubId: input.restaurantHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigureMenu(authUserId: string, email: string, input: RstSdkConfigureValidationInput, fullName?: string | null): Promise<RstSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { restaurantHubId: input.restaurantHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunOrderWorkflow(authUserId: string, email: string, input: RstSdkRunFormSubmissionInput, fullName?: string | null): Promise<RstSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_order_workflow", moduleSource: "enterprise_restaurant_business_os", inputPayload: { ...input } });
        const created = await this.createOrder(authUserId, email, { restaurantHubId: input.restaurantHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const restaurantService = new RestaurantService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "RstDashboardStats", "RstPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            restaurantService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await restaurantService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useRestaurant.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { restaurantService } from "@/src/modules/restaurant/services/restaurant.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/restaurant/types";

export function useRestaurant() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<RstDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<RstPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [restaurantHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            restaurantService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(restaurantService.getPipelineInfo()),
${hookFetchCalls}
            restaurantService.getAuditLogs(authUserId, email, fullName),
            restaurantService.getRestaurantHubOptions(authUserId, email, fullName),
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
        restaurantHubOptions,
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
    }, e.hubField === false ? {} : { restaurantHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: RestaurantData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise restaurant operating system ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
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

writeFileSync(join(mod, "components/RestaurantPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { RST_THEME, ORDER_TYPE_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/restaurant/constants";
import type { useRestaurant } from "@/src/modules/restaurant/hooks/useRestaurant";
import {
${schemaImports}
} from "@/src/modules/restaurant/schemas";

type RestaurantData = ReturnType<typeof useRestaurant>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-orange-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-orange-600">{meta}</p> : null}</div>;
}
function RestaurantHubSelect({ data, ...props }: { data: RestaurantData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select restaurant operating system</option>{data.restaurantHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RestaurantOverviewPanel({ data }: { data: RestaurantData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Restaurant OS summary" description="System health, background jobs, event bus, reservations, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Restaurant Hubs" subtitle={\`\${data.stats?.totalRestaurantHubs ?? 0} total\`} meta={\`\${data.stats?.activeRestaurantHubs ?? 0} active • \${data.stats?.diningAreaCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.menuCategoryCount ?? 0} menu categories\`} meta={\`\${data.stats?.orderCount ?? 0} orders • \${data.stats?.openReservationCount ?? 0} open reservations\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallRestaurantScore ?? 0).toFixed(1)} overall restaurant score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first restaurant operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Restaurant operating system pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Restaurant operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function RestaurantAuditLogsPanel({ data }: { data: RestaurantData }) {
    return (
        <Card hover><SectionHeader title="Restaurant OS audit history" description="Security-first audit trail for jobs, events, reservations, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for restaurant operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function RestaurantSdkPanel({ data }: { data: RestaurantData }) {
    return (
        <Card hover><SectionHeader title="Shared Restaurant OS SDK" description="Import from @/src/modules/restaurant/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createRestaurantClient()" subtitle="Factory for module-scoped Restaurant OS client with auth context" meta="Primary SDK for enterprise restaurant operating system" />
            <ListCard title="sdkRegisterBrand()" subtitle="Register restaurant operating system with AI orchestration" meta="moduleSource: enterprise_restaurant_business_os" />
            <ListCard title="sdkConfigureMenu()" subtitle="Configure menu category with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunOrderWorkflow()" subtitle="Run order workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {RST_THEME.primary} • Integration hubs loaded: {data.restaurantHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createRestaurantClient } from "@/src/modules/restaurant/sdk";

const intg = createRestaurantClient(userId, email, fullName);
await intg.registerBrand({ restaurantHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureMenu({ restaurantHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runOrderWorkflow({ restaurantHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/RestaurantStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { RstDashboardStats } from "@/src/modules/restaurant/types";

interface RestaurantStatsProps { stats: RstDashboardStats | null; }

export function RestaurantStats({ stats }: RestaurantStatsProps) {
    const cards = [
        { title: "Restaurant Hubs", value: String(stats?.totalRestaurantHubs ?? 0), detail: \`\${stats?.activeRestaurantHubs ?? 0} active • \${stats?.diningAreaCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.menuCategoryCount ?? 0), detail: \`\${stats?.orderCount ?? 0} orders • \${stats?.openReservationCount ?? 0} open reservations\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallRestaurantScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, reservations, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-orange-600 dark:[&_p:last-child]:text-orange-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "RestaurantOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "RestaurantAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "RestaurantSdkPanel" },
];

writeFileSync(join(mod, "components/RestaurantPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RestaurantOverviewPanel,
    ${panelImports},
    RestaurantAuditLogsPanel,
    RestaurantSdkPanel,
} from "@/src/modules/restaurant/components/RestaurantPanels";
import { RestaurantStats } from "@/src/modules/restaurant/components/RestaurantStats";
import { RST_TABS } from "@/src/modules/restaurant/constants";
import { useRestaurant } from "@/src/modules/restaurant/hooks/useRestaurant";

const tabs = [
${tabDefs.map((t) => `    { id: RST_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function RestaurantPage() {
    const restaurant = useRestaurant();
    const [activeTab, setActiveTab] = useState<(typeof RST_TABS)[keyof typeof RST_TABS]>(RST_TABS.overview);

    if (restaurant.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Restaurant OS" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">V2 Program A Program B Sprint 6</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Restaurant OS</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and restaurant operating system dashboard with security-first audit and the shared Restaurant OS SDK.
                </p>
            </motion.header>
            <RestaurantStats stats={restaurant.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-orange-600 text-white" : "border border-slate-200 text-slate-600 hover:border-orange-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === RST_TABS.${t.id} ? <${t.panel} data={restaurant} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { restaurantService } from "@/src/modules/restaurant/services/restaurant.service";
import type { RstSdkRegisterFormInput, RstSdkConfigureValidationInput, RstSdkRunFormSubmissionInput } from "@/src/modules/restaurant/types";

export class RestaurantClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerBrand(input: RstSdkConnectServiceInput) {
        return restaurantService.sdkRegisterBrand(this.authUserId, this.email, input, this.fullName);
    }

    async configureMenu(input: RstSdkIssueApiKeyInput) {
        return restaurantService.sdkConfigureMenu(this.authUserId, this.email, input, this.fullName);
    }

    async runOrderWorkflow(input: RstSdkRegisterWebhookInput) {
        return restaurantService.sdkRunOrderWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getRestaurantHubs() {
        return restaurantService.getRestaurantHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return restaurantService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return restaurantService.getPipelineInfo();
    }
}

export function createRestaurantClient(authUserId: string, email: string, fullName?: string | null): RestaurantClient {
    return new RestaurantClient(authUserId, email, fullName);
}

export { restaurantService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { RestaurantPage } from "@/src/modules/restaurant/components/RestaurantPage";
export { RestaurantStats } from "@/src/modules/restaurant/components/RestaurantStats";
export { restaurantService } from "@/src/modules/restaurant/services/restaurant.service";
export { useRestaurant } from "@/src/modules/restaurant/hooks/useRestaurant";
export { createRestaurantClient, RestaurantClient } from "@/src/modules/restaurant/sdk";
export * from "@/src/modules/restaurant/types";
export * from "@/src/modules/restaurant/constants";
`);

console.log(`Generated restaurant operating system module files. RST_TABS count: ${tabs.length}`);
