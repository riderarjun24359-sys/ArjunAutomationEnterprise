import type { UserRole } from "@/src/constants/roles";
import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "../access";
import {
    buildFounderAnalyticsSnapshot,
    createEmptyFounderAnalyticsSnapshot,
} from "../builders/founder-analytics.builders";
import { founderAnalyticsRepository } from "../repository/founder-analytics.repository";
import type { FounderAnalyticsSnapshot } from "../types";

export class FounderAnalyticsService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<FounderAnalyticsSnapshot> {
        const data = await founderAnalyticsRepository.loadOrganizationData(authUserId, email, fullName).catch(() => null);

        const membershipRole = data?.membershipRole ?? null;
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole });
        if (!allowed) {
            return createEmptyFounderAnalyticsSnapshot(false, founderAccessDeniedMessage());
        }

        if (!data) {
            return createEmptyFounderAnalyticsSnapshot(true, "No organization context resolved for live data.");
        }

        return buildFounderAnalyticsSnapshot(data);
    }
}

export const founderAnalyticsService = new FounderAnalyticsService();
