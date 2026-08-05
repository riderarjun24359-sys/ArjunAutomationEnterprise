import { businessPlatformService } from "@/src/modules/business-platform/services/business-platform.service";
import type { BusinessPlatformDashboard } from "@/src/modules/business-platform/types";

export async function fetchBusinessPlatformDashboard(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<BusinessPlatformDashboard> {
    return businessPlatformService.getDashboard({ authUserId, email, fullName });
}

export interface BusinessPlatformIntelSummary {
    leadsCount: number;
    consultationsScheduled: number;
    activeClients: number;
    pendingAiRecommendations: number;
    overdueInvoices: number;
    openProjects: number;
}

export function summarizeBusinessPlatformIntel(dashboard: BusinessPlatformDashboard): BusinessPlatformIntelSummary {
    return {
        leadsCount: dashboard.leadsCount ?? 0,
        consultationsScheduled: dashboard.consultationsScheduled ?? 0,
        activeClients: dashboard.activeClients ?? 0,
        pendingAiRecommendations: dashboard.pendingAiRecommendations ?? 0,
        overdueInvoices: dashboard.openInvoices ?? 0,
        openProjects: dashboard.activeProjects ?? 0,
    };
}
