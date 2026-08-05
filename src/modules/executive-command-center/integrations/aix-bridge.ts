import { executiveIntelligenceService } from "@/src/modules/executive-intelligence";
import type { AixDashboardStats } from "@/src/modules/executive-intelligence/types";

export async function fetchAixStats(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<AixDashboardStats> {
    return executiveIntelligenceService.getDashboardStats(authUserId, email, fullName);
}
