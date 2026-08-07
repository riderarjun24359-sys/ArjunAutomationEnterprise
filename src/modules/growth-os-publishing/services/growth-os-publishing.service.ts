import type { UserRole } from "@/src/constants/roles";
import { growthOsPublishingDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildGrowthOsPublishingSnapshot,
    createEmptyGrowthOsPublishingSnapshot,
} from "../builders/growth-os-publishing.builders";
import { growthOsPublishingRepository } from "../repository/growth-os-publishing.repository";
import type { GrowthOsPublishingSnapshot } from "../types";

export class GrowthOsPublishingService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<GrowthOsPublishingSnapshot> {
        const data = await growthOsPublishingRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyGrowthOsPublishingSnapshot(false, growthOsPublishingDeniedMessage());
        }
        if (!data) {
            return createEmptyGrowthOsPublishingSnapshot(
                true,
                "No organization context resolved for live Growth OS Publishing & Distribution data.",
            );
        }
        return buildGrowthOsPublishingSnapshot(data);
    }
}

export const growthOsPublishingService = new GrowthOsPublishingService();
