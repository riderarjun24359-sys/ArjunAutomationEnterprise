import { dashboardService } from "@/src/modules/dashboard/services/dashboard.service";
import type { DashboardOverview } from "@/src/modules/dashboard/types";

export async function fetchDashboardOverview(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<DashboardOverview> {
    return dashboardService.getOverview(authUserId, email, fullName);
}
