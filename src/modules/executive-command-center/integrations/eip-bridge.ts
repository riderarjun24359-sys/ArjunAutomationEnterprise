import { enterpriseIntelligencePlatformService } from "@/src/modules/enterprise-intelligence-platform";
import type { EipDashboardStats } from "@/src/modules/enterprise-intelligence-platform/types";

export async function fetchEipStats(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<EipDashboardStats> {
    return enterpriseIntelligencePlatformService.getDashboardStats(authUserId, email, fullName);
}
