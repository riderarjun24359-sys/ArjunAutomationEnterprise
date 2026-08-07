import type { UserRole } from "@/src/constants/roles";
import { growthOsCreativeDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildGrowthOsCreativeSnapshot,
    createEmptyGrowthOsCreativeSnapshot,
} from "../builders/growth-os-creative.builders";
import { growthOsCreativeRepository } from "../repository/growth-os-creative.repository";
import type { GrowthOsCreativeSnapshot } from "../types";

export class GrowthOsCreativeService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<GrowthOsCreativeSnapshot> {
        const data = await growthOsCreativeRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyGrowthOsCreativeSnapshot(false, growthOsCreativeDeniedMessage());
        }
        if (!data) {
            return createEmptyGrowthOsCreativeSnapshot(
                true,
                "No organization context resolved for live Growth OS AI Creative Studio data.",
            );
        }
        return buildGrowthOsCreativeSnapshot(data);
    }
}

export const growthOsCreativeService = new GrowthOsCreativeService();
