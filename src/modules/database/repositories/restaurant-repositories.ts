import type {
    DbRstRestaurantHub,
    DbRstBrand,
    DbRstBranch,
    DbRstBusinessLicense,
    DbRstDiningArea,
    DbRstRestaurantTable,
    DbRstMenuCategory,
    DbRstMenuItem,
    DbRstMenuVariant,
    DbRstAddOn,
    DbRstComboMeal,
    DbRstOrder,
    DbRstOrderItem,
    DbRstOrderQueue,
    DbRstKitchenRouting,
    DbRstOrderTimeline,
    DbRstKitchenStation,
    DbRstPreparationQueue,
    DbRstCookingStatus,
    DbRstReadyQueue,
    DbRstRushOrder,
    DbRstReservation,
    DbRstWaitingList,
    DbRstCustomerProfile,
    DbRstLoyaltyProgram,
    DbRstFeedbackReview,
    DbRstRestaurantMetric,
    DbRstRestaurantHealth,
    DbRstRevenueAnalytics,
    DbRstKitchenPerformance,
    DbRstRestaurantFailure,
    DbRstAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgRstRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class RstRestaurantHubRepository extends OrgRstRepository<DbRstRestaurantHub> { protected table = "rst_restaurant_hubs"; }
export class RstBrandRepository extends OrgRstRepository<DbRstBrand> { protected table = "rst_brands"; }
export class RstBranchRepository extends OrgRstRepository<DbRstBranch> { protected table = "rst_branches"; }
export class RstBusinessLicenseRepository extends OrgRstRepository<DbRstBusinessLicense> { protected table = "rst_business_licenses"; }
export class RstDiningAreaRepository extends OrgRstRepository<DbRstDiningArea> { protected table = "rst_dining_areas"; }
export class RstRestaurantTableRepository extends OrgRstRepository<DbRstRestaurantTable> { protected table = "rst_restaurant_tables"; }
export class RstMenuCategoryRepository extends OrgRstRepository<DbRstMenuCategory> { protected table = "rst_menu_categories"; }
export class RstMenuItemRepository extends OrgRstRepository<DbRstMenuItem> { protected table = "rst_menu_items"; }
export class RstMenuVariantRepository extends OrgRstRepository<DbRstMenuVariant> { protected table = "rst_menu_variants"; }
export class RstAddOnRepository extends OrgRstRepository<DbRstAddOn> { protected table = "rst_add_ons"; }
export class RstComboMealRepository extends OrgRstRepository<DbRstComboMeal> { protected table = "rst_combo_meals"; }
export class RstOrderRepository extends OrgRstRepository<DbRstOrder> { protected table = "rst_orders"; }
export class RstOrderItemRepository extends OrgRstRepository<DbRstOrderItem> { protected table = "rst_order_items"; }
export class RstOrderQueueRepository extends OrgRstRepository<DbRstOrderQueue> { protected table = "rst_order_queue"; }
export class RstKitchenRoutingRepository extends OrgRstRepository<DbRstKitchenRouting> { protected table = "rst_kitchen_routing"; }
export class RstOrderTimelineRepository extends OrgRstRepository<DbRstOrderTimeline> { protected table = "rst_order_timeline"; }
export class RstKitchenStationRepository extends OrgRstRepository<DbRstKitchenStation> { protected table = "rst_kitchen_stations"; }
export class RstPreparationQueueRepository extends OrgRstRepository<DbRstPreparationQueue> { protected table = "rst_preparation_queue"; }
export class RstCookingStatusRepository extends OrgRstRepository<DbRstCookingStatus> { protected table = "rst_cooking_status"; }
export class RstReadyQueueRepository extends OrgRstRepository<DbRstReadyQueue> { protected table = "rst_ready_queue"; }
export class RstRushOrderRepository extends OrgRstRepository<DbRstRushOrder> { protected table = "rst_rush_orders"; }
export class RstReservationRepository extends OrgRstRepository<DbRstReservation> { protected table = "rst_reservations"; }
export class RstWaitingListRepository extends OrgRstRepository<DbRstWaitingList> { protected table = "rst_waiting_list"; }
export class RstCustomerProfileRepository extends OrgRstRepository<DbRstCustomerProfile> { protected table = "rst_customer_profiles"; }
export class RstLoyaltyProgramRepository extends OrgRstRepository<DbRstLoyaltyProgram> { protected table = "rst_loyalty_programs"; }
export class RstFeedbackReviewRepository extends OrgRstRepository<DbRstFeedbackReview> { protected table = "rst_feedback_reviews"; }
export class RstRestaurantMetricRepository extends OrgRstRepository<DbRstRestaurantMetric> { protected table = "rst_restaurant_metrics"; }
export class RstRestaurantHealthRepository extends OrgRstRepository<DbRstRestaurantHealth> { protected table = "rst_restaurant_health"; }
export class RstRevenueAnalyticsRepository extends OrgRstRepository<DbRstRevenueAnalytics> { protected table = "rst_revenue_analytics"; }
export class RstKitchenPerformanceRepository extends OrgRstRepository<DbRstKitchenPerformance> { protected table = "rst_kitchen_performance"; }
export class RstRestaurantFailureRepository extends OrgRstRepository<DbRstRestaurantFailure> { protected table = "rst_restaurant_failures"; }
export class RstAuditLogRepository extends OrgRstRepository<DbRstAuditLog> { protected table = "rst_audit_logs"; }
