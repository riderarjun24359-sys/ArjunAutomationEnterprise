import type { UserRole } from "@/src/constants/roles";
import { growthOsVideoDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildGrowthOsVideoSnapshot,
    createEmptyGrowthOsVideoSnapshot,
} from "../builders/growth-os-video.builders";
import { growthOsVideoRepository } from "../repository/growth-os-video.repository";
import type { GrowthOsVideoSnapshot } from "../types";

export class GrowthOsVideoService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<GrowthOsVideoSnapshot> {
        const data = await growthOsVideoRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyGrowthOsVideoSnapshot(false, growthOsVideoDeniedMessage());
        }
        if (!data) {
            return createEmptyGrowthOsVideoSnapshot(
                true,
                "No organization context resolved for live Growth OS AI Video Factory data.",
            );
        }
        return buildGrowthOsVideoSnapshot(data);
    }
}

export const growthOsVideoService = new GrowthOsVideoService();
