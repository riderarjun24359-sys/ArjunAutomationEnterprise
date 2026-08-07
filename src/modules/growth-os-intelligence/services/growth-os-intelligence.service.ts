import type { UserRole } from "@/src/constants/roles";
import { growthOsIntelligenceDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildGrowthOsIntelligenceSnapshot,
    createEmptyGrowthOsIntelligenceSnapshot,
} from "../builders/growth-os-intelligence.builders";
import { growthOsIntelligenceRepository } from "../repository/growth-os-intelligence.repository";
import type { GrowthOsIntelligenceSnapshot } from "../types";

export class GrowthOsIntelligenceService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<GrowthOsIntelligenceSnapshot> {
        const data = await growthOsIntelligenceRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyGrowthOsIntelligenceSnapshot(false, growthOsIntelligenceDeniedMessage());
        }
        if (!data) {
            return createEmptyGrowthOsIntelligenceSnapshot(
                true,
                "No organization context resolved for live Growth OS Growth Intelligence data.",
            );
        }
        return buildGrowthOsIntelligenceSnapshot(data);
    }
}

export const growthOsIntelligenceService = new GrowthOsIntelligenceService();
